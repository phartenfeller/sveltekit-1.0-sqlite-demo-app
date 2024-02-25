import { SUBSCRIPTION_DB_PATH, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } from '$env/static/private';
import Database from 'better-sqlite3';
import webpush, { type PushSubscription } from 'web-push';

const subDb = new Database(SUBSCRIPTION_DB_PATH);
subDb.pragma('foreign_keys = ON');
initTables();
initWebPush();

function initTables() {
	subDb.exec(`
    CREATE TABLE IF NOT EXISTS users (
      username test not null,
      created_at timestamp not null default current_timestamp,
      constraint users_pk primary key (username)
    );

    CREATE TABLE IF NOT EXISTS user_devices (
      device_id integer primary key autoincrement,
      subscription json not null,
      username text not null,
      constraint user_devices_uk unique (subscription),
      constraint user_devices_users_username_fk foreign key (username) references users (username) on delete cascade
    );

    CREATE INDEX IF NOT EXISTS user_devices_users_username_fk on user_devices (username);

    CREATE TABLE IF NOT EXISTS notif_channels (
      channel_id text not null,
      created_at timestamp not null default current_timestamp,
      constraint notif_channels_pk primary key (channel_id)
    );

    CREATE TABLE IF NOT EXISTS notif_channel_users (
      username text not null,
      channel_id text not null,
      constraint user_notif_channels_pk primary key (username, channel_id),
      constraint user_notif_channels_notif_channels_channel_id_fk foreign key (channel_id) references notif_channels (channel_id) on delete cascade,
      constraint user_notif_channels_users_username_fk foreign key (username) references users (username) on delete cascade
    );

    CREATE TABLE IF NOT EXISTS notif_log (
      notif_id integer primary key autoincrement,
      created_at timestamp not null default current_timestamp,
      channel_id text,
      device_id integer not null,
      payload text not null,
      http_status_response integer,
      success boolean not null,
      error_message text,
      constraint notif_log_notif_channels_channel_id_fk foreign key (channel_id) references notif_channels (channel_id) on delete cascade,
      constraint notif_log_user_devices_device_id_fk foreign key (device_id) references user_devices (device_id) on delete cascade
    );
  `);
}

function initWebPush() {
	webpush.setVapidDetails('mailto:webpush@hartenfeller.dev', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

async function sendNotification(subscription: PushSubscription, payload: string) {
	try {
		const res = await webpush.sendNotification(subscription, payload);
		return {
			ok: res.statusCode === 201,
			status: res.statusCode,
			body: res.body
		};
	} catch (err) {
		const msg = `Could not send notification: ${err}`;
		console.error(msg);
		return {
			ok: false,
			status: undefined,
			body: msg
		};
	}
}

function deleteIfExpired(deviceId: number) {
	const last3Success = subDb
		.prepare(
			`
		SELECT sum(success) as cnt
		FROM notif_log
		WHERE device_id = ?
		AND success = 0
		ORDER BY created_at DESC
		LIMIT 3
	`
		)
		.get(deviceId) as { cnt: number };

	if (last3Success.cnt === 0) {
		console.log(`Removing expired subscription for device ${deviceId}`);
		subDb.prepare('DELETE FROM user_devices WHERE device_id = ?').run(deviceId);
	}
}

async function sendNotificationToDevices(devices: SubDevice[], payload: string) {
	devices.forEach(async (device) => {
		const subscription = JSON.parse(device.subscription);
		const res = await sendNotification(subscription, payload);

		if (!res.ok) {
			console.error(
				`Failed to send notification to device ${device.device_id}: ${res.body} (${res.status}).
${JSON.stringify(res)}`
			);
		}

		subDb
			.prepare(
				`
      INSERT INTO notif_log (device_id, payload, http_status_response, success, error_message)
      VALUES (?, ?, ?, ?, ?)
    `
			)
			.run(device.device_id, payload, res.status, res.ok ? 1 : 0, res.body);

		// remove expired subscription
		if (res.status === 410) {
			subDb.prepare('DELETE FROM user_devices WHERE device_id = ?').run(device.device_id);
		} else if (!res.ok) {
			deleteIfExpired(device.device_id);
		}
	});
}

export function addUserDevice(username: string, subscription: PushSubscription) {
	const userNameCount = subDb
		.prepare('SELECT count(*) as cnt FROM users WHERE username = ?')
		.get(username) as { cnt: number };

	if (userNameCount.cnt === 0) {
		subDb.prepare('INSERT INTO users (username) VALUES (?)').run(username);
	}

	const subCount = subDb
		.prepare(
			`SELECT count(*) as cnt FROM user_devices WHERE json_extract(subscription, '$.endpoint') = ? `
		)
		.get(subscription.endpoint) as { cnt: number };

	if (subCount.cnt === 0) {
		subDb
			.prepare('INSERT INTO user_devices (subscription, username) VALUES (?, ?)')
			.run(JSON.stringify(subscription), username);
	}
}

export function addUserToChannel(username: string, channelId: string) {
	const channelCount = subDb
		.prepare('SELECT count(*) as cnt FROM notif_channels WHERE channel_id = ?')
		.get(channelId) as { cnt: number };

	if (channelCount.cnt === 0) {
		subDb.prepare('INSERT INTO notif_channels (channel_id) VALUES (?)').run(channelId);
	}

	const subCount = subDb
		.prepare(
			`SELECT count(*) as cnt FROM notif_channel_users WHERE username = ? AND channel_id = ?`
		)
		.get(username, channelId) as { cnt: number };

	if (subCount.cnt === 0) {
		subDb
			.prepare('INSERT INTO notif_channel_users (username, channel_id) VALUES (?, ?)')
			.run(username, channelId);
	}
}

export async function notifUser(username: string, payload: string) {
	const devices = subDb
		.prepare('SELECT * FROM user_devices WHERE username = ?')
		.all(username) as SubDevice[];

	await sendNotificationToDevices(devices, payload);
}

export async function notifChannel(channelId: string, payload: string) {
	const devices = subDb
		.prepare(
			`
    SELECT ud.device_id, ud.subscription
    FROM user_devices ud
    JOIN notif_channel_users ncu ON ud.username = ncu.username
    WHERE ncu.channel_id = ?
  `
		)
		.all(channelId) as SubDevice[];

	await sendNotificationToDevices(devices, payload);
}

type SubDevice = {
	device_id: number;
	subscription: string;
};
