import Database from 'better-sqlite3';
import { DB_PATH } from '$env/static/private';
import type {
	Album,
	AlbumImage,
	AlbumTrack,
	Genre,
	Invoice,
	PlaylistTrack,
	PlaylistTrackResponse,
	SessionInfo,
	SessionInfoCache,
	Track,
	TracksGridSaveData
} from './types';
import bcrypt from 'bcrypt';

const db = new Database(DB_PATH, { verbose: console.log });
addSessionsTable();
addImageTable();

function addSessionsTable() {
	const sql = `
	create table if not exists sessions (
		ses_id          text primary key
	, ses_created     integer not null default (strftime( '%s', 'now' ) * 1000)
	, ses_expires     integer not null
	, ses_data        text not null
	) strict;
	`;
	const stmnt = db.prepare(sql);
	stmnt.run();
}

function addImageTable() {
	const sql = `
	create table if not exists album_images (
		img_album_id      integer primary key
	, img_name          text not null
	, img_mime_type     text not null       
	, img_last_modified integer not null default (strftime( '%s', 'now' ) * 1000)
	, img_size          integer not null
	, img_data          blob not null
	, constraint img_album_id_fk foreign key (img_album_id) references albums (AlbumId)
	) strict;
	`;
	const stmnt = db.prepare(sql);
	stmnt.run();
}

export function deleteExpiredDbSessions(now: number) {
	const sql = `
	delete from sessions
	 where ses_expires < $now
`;

	const stmnt = db.prepare(sql);
	stmnt.run({ now });
}

export function insertDbSession(sid: string, sessionInfo: SessionInfo, expiresAt: number) {
	const sql = `
	insert into sessions (ses_id, ses_expires, ses_data)
	values ($sid, $expires, $data)
`;

	const stmnt = db.prepare(sql);
	stmnt.run({ sid, expires: expiresAt, data: JSON.stringify(sessionInfo) });
}

export function deleteDbSession(sid: string) {
	const sql = `
	delete from sessions
	 where ses_id = $sid
`;
	const stmnt = db.prepare(sql);
	stmnt.run({ sid });
}

export function getDbSession(sid: string): SessionInfoCache | undefined {
	const sql = `
	select ses_data as data
	     , ses_expires as expires
	  from sessions
	 where ses_id = $sid
`;

	const stmnt = db.prepare(sql);
	const row = stmnt.get({ sid }) as { data: string; expires: number };
	if (row) {
		const data = JSON.parse(row.data);
		data.expires = row.expires;
		return data as SessionInfoCache;
	}
	return undefined;
}

export function getInitialTracks(limit = 50): Track[] {
	const sql = `
  select t.TrackId as trackId
  , t.Name as trackName
  , a.AlbumId as albumId
  , a.Title as albumTitle
  , at.ArtistId as artistId
  , at.Name as artistName
  , g.Name as genre
from tracks t
join albums a
 on t.AlbumId = a.AlbumId
join artists at
 on a.ArtistId = at.ArtistId
join genres g
 on t.GenreId = g.GenreId
limit $limit  
  `;
	const stmnt = db.prepare(sql);
	const rows = stmnt.all({ limit });
	return rows as Track[];
}

export function searchTracks(searchTerm: string, limit = 50): Track[] {
	const sql = `
  select t.TrackId as trackId
  , t.Name as trackName
  , a.AlbumId as albumId
  , a.Title as albumTitle
  , at.ArtistId as artistId
  , at.Name as artistName
  , g.Name as genre
from tracks t
join albums a
 on t.AlbumId = a.AlbumId
join artists at
 on a.ArtistId = at.ArtistId
join genres g
 on t.GenreId = g.GenreId
where lower(t.Name) like lower('%' || $searchTerm || '%')
limit $limit  
  `;
	const stmnt = db.prepare(sql);
	const rows = stmnt.all({ searchTerm, limit });
	return rows as Track[];
}

export function getAlbumById(albumId: number): Album {
	const sql = `
  select a.AlbumId as albumId
     , a.Title as albumTitle
     , at.ArtistId as artistId
     , at.Name as artistName
		 , ai.img_name as imgName
  from albums a
  join artists at on a.ArtistId = at.ArtistId
	left join album_images ai on a.AlbumId = ai.img_album_id
 where a.AlbumId = $albumId;
  `;
	const stmnt = db.prepare(sql);
	const row = stmnt.get({ albumId });
	return row as Album;
}

export function getAlbumTracks(albumId: number): AlbumTrack[] {
	const sql = `
	select t.TrackId as trackId
	, t.Name as trackName
	, t.Milliseconds as trackMs
	, t.Composer as composer
	, g.Name as genre
from tracks t
left join genres g
 on t.GenreId = g.GenreId
where t.AlbumId = $albumId
order by t.TrackId
`;
	const stmnt = db.prepare(sql);
	const rows = stmnt.all({ albumId });
	return rows as AlbumTrack[];
}

export function updateAlbumTitle(albumId: number, albumTitle: string): void {
	const sql = `
  update albums
     set Title = $albumTitle
   where AlbumId = $albumId
`;
	const stmnt = db.prepare(sql);
	stmnt.run({ albumId, albumTitle });
}

export async function createUser(username: string, password: string): Promise<void> {
	const sql = `
  insert into users (username, password, roles)
  values ($username, $password, 'admin:moderator')
`;

	const hashedPassword = await bcrypt.hash(password, 12);

	const stmnt = db.prepare(sql);
	stmnt.run({ username, password: hashedPassword });
}

export async function checkUserCredentials(username: string, password: string): Promise<boolean> {
	const sql = `
  select password
    from users
   where username = $username
`;
	const stmnt = db.prepare(sql);
	const row = stmnt.get({ username }) as { password: string };
	if (row) {
		return bcrypt.compare(password, row.password);
	} else {
		await bcrypt.hash(password, 12);
		return false;
	}
}

export function getUserRoles(username: string): string[] {
	const sql = `
  select roles
    from users
   where username = $username
`;
	const stmnt = db.prepare(sql);
	const row = stmnt.get({ username }) as { roles: string };
	if (row) {
		return row.roles.split(':');
	}
	return [];
}

export function getGenres(): Genre[] {
	const sql = `select GenreId as genreId, Name as genreName from genres`;
	const stmnt = db.prepare(sql);
	const rows = stmnt.all();
	return rows as Genre[];
}

export function saveGridTracks(data: TracksGridSaveData) {
	if (data.deleted && data.deleted.length > 0) {
		const delSql = `delete from tracks where Trackid = $trackId`;
		const delStmnt = db.prepare(delSql);
		data.deleted.forEach((trackId) => delStmnt.run({ trackId }));
	}

	if (data.rows && data.rows.length > 0) {
		const genres = getGenres();
		const rows = data.rows.map((track) => {
			const genre = genres.find((g) => g.genreName === track.genre);
			return {
				trackId: track.trackId > 0 ? track.trackId : null,
				trackName: track.trackName,
				trackMs: track.trackMs,
				composer: track.composer,
				genreId: genre ? genre.genreId : null
			};
		});

		const mergeSql = `
    insert into tracks (
      TrackId,
      Name,
      Milliseconds,
      Composer,
      GenreId,
      MediaTypeId,
      UnitPrice,
      AlbumId
    ) values (
      $trackId,
      $trackName,
      $trackMs,
      $composer,
      $genreId,
      1,
      1,
      $albumId
    )
    on conflict (TrackId) do
    update
       set Name =  excluded.Name
         , GenreId = excluded.GenreId
         , Composer = excluded.Composer
         , Milliseconds = excluded.Milliseconds
     where TrackId = excluded.TrackId
    ;`;
		const mergeStmnt = db.prepare(mergeSql);
		rows.forEach((track) => mergeStmnt.run({ ...track, albumId: data.albumId }));
	}
}

export async function mergeAlbumImage(albumId: number, image: File) {
	const arrayBuffer = await image.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	const sql = `
	insert into album_images (
		img_album_id
	, img_name
	, img_mime_type
	, img_last_modified
	, img_size
	, img_data
	)
	values (
	  $albumId
	, $filename
	, $mimeType
	, $lastModified
	, $size
	, $data
	)
	on conflict (img_album_id) do
	update
		 set img_name = excluded.img_name
		   , img_mime_type = excluded.img_mime_type
			 , img_last_modified = excluded.img_last_modified
			 , img_size = excluded.img_size
			 , img_data = excluded.img_data	
	 where img_album_id = excluded.img_album_id
	`;
	const stmnt = db.prepare(sql);
	stmnt.run({
		albumId,
		filename: image.name,
		mimeType: image.type,
		lastModified: image.lastModified,
		size: image.size,
		data: buffer
	});
}

export function getAlbumImage(albumId: number, filename: string): AlbumImage {
	const sql = `
	select img_name as filename
	, img_mime_type as mimeType
	, img_last_modified as lastModified
	, img_size as size
	, img_data as data
	from album_images
	where img_album_id = $albumId and img_name = $filename
	`;

	const stmnt = db.prepare(sql);
	const row = stmnt.get({ albumId, filename }) as AlbumImage;

	const img: AlbumImage = {
		filename: row.filename,
		mimeType: row.mimeType,
		lastModified: row.lastModified,
		size: row.size,
		data: new Blob([row.data], { type: row.mimeType })
	};

	return img;
}

export function otherAlbumsOfArtist(artistId: number, albumId: number): Album[] {
	const sql = `
		select a.AlbumId as albumId
			 , a.Title as albumTitle
			 , at.ArtistId as artistId
			 , at.Name as artistName
			 , ai.img_name as imgName
		from albums a
		join artists at on a.ArtistId = at.ArtistId
		left join album_images ai on a.AlbumId = ai.img_album_id
	 where a.ArtistId = $artistId
	   and a.AlbumId != $albumId;
		`;
	const stmnt = db.prepare(sql);
	const rows = stmnt.all({ artistId, albumId });
	return rows as Album[];
}

export function getInvoices() {
	const sql = `
	select i.InvoiceId as "id"
	, i.InvoiceDate as "date"
	, i.BillingAddress as "address"
	, i.BillingCity as "city"
	, i.BillingState as "state"
	, i.BillingCountry as "country"
	, i.BillingPostalCode as "postalCode"
	, i.Total as "total"
	, c.FirstName || ' ' || c.LastName as "customer"
from invoices i
join customers c
 on i.CustomerId = c.CustomerId
 order by i.InvoiceId desc
 `;
	const stmnt = db.prepare(sql);
	const rows = stmnt.all();
	return rows as Invoice[];
}

export function updateInvoice(invoice: Invoice) {
	const sql = `update invoices
	  set BillingAddress = $address,
		    Total = $total
			where InvoiceId = $id`;

	const stmnt = db.prepare(sql);
	stmnt.run({
		id: invoice.id,
		address: invoice.address,
		total: invoice.total
	});
}

export function getInvoiceEmailDetails(invoiceId: number) {
	const sql = `
	select i.InvoiceId as "id"
	, i.InvoiceDate as "date"
	, i.BillingAddress as "address"
	, i.BillingCity as "city"
	, i.BillingState as "state"
	, i.BillingCountry as "country"
	, i.BillingPostalCode as "postalCode"
	, i.Total as "total"
	, c.FirstName || ' ' || c.LastName as "customer"
	, c.Email as "email"
from invoices i
join customers c
 on i.CustomerId = c.CustomerId
 where i.InvoiceId = $invoiceId
	`;

	let stmnt = db.prepare(sql);
	const order = stmnt.get({ invoiceId }) as {
		id: number;
		date: string;
		address: string;
		city: string;
		state: string;
		country: string;
		postalCode: string;
		total: number;
		customer: string;
		email: string;
	};

	const sql2 = `
	select t.Name as "track"
	, ii.UnitPrice as "price"
	, ii.Quantity as "quantity"
	, a.Title as "album"
	, ar.Name as "artist"
from invoice_items ii
join tracks t
 on ii.TrackId = t.TrackId
join albums a
 on t.AlbumId = a.AlbumId
join artists ar
 on a.ArtistId = ar.ArtistId
where ii.InvoiceId = $invoiceId
	`;

	stmnt = db.prepare(sql2);
	const tracks = stmnt.all({ invoiceId }) as {
		track: string;
		price: number;
		quantity: number;
		album: string;
		artist: string;
	}[];

	return { order, tracks };
}

export type QueryPlaylistTracksArgs = {
	sort?: { col: string; dir: string };
	pagination: { page: number; pageSize: number };
	search?: string;
	colFilters?: { [key: string]: string };
};

export function queryPlaylistTracks({
	sort,
	pagination,
	search,
	colFilters
}: QueryPlaylistTracksArgs): PlaylistTrackResponse {
	let sql = `
	select row_number() over () as "rowId"
	, p.PlaylistId as "playlistId"
	, p.name || ' (#' || p.PlaylistId || ')' as "playlistName"
	, t.name as "trackName"
	, a.Name as "artistName"
	, g.Name as "genre"
from playlist_track pt
join playlists p on p.PlaylistId = pt.PlaylistId
join tracks t on pt.TrackId = t.TrackId
join albums al on t.AlbumId = al.AlbumId
join artists a on al.ArtistId = a.ArtistId
left join genres g on t.GenreId = g.GenreId
#WHERE#
#ORDER#
#LIMIT#
`;

	console.log('colFilters', colFilters);

	if (sort) {
		sql = sql.replace('#ORDER#', `order by ${sort.col} ${sort.dir}`);
	} else {
		sql = sql.replace('#ORDER#', '');
	}

	const whereClauses: string[] = [];

	if (search) {
		whereClauses.push(
			`( lower(p.name) like '%${search.toLowerCase()}%' or lower(t.name) like '%${search.toLowerCase()}%' or lower(a.name) like '%${search.toLowerCase()}%' or lower(g.name) like '%${search.toLowerCase()}%' )`
		);
	}

	if (colFilters) {
		for (const [key, value] of Object.entries(colFilters)) {
			if (value) {
				whereClauses.push(`lower(${key}) like '%${value.toLowerCase()}%'`);
			}
		}
	}

	const where = whereClauses.length > 0 ? 'where ' + whereClauses.join(' and ') : '';
	sql = sql.replace('#WHERE#', where);

	const withPagination = sql.replace(
		'#LIMIT#',
		`limit ${pagination.pageSize} offset ${(pagination.page - 1) * pagination.pageSize}`
	);
	const withoutPagination = sql.replace('#LIMIT#', '');

	const stmnt = db.prepare(withPagination);
	const rows = stmnt.all() as PlaylistTrack[];

	const countSql = `select count(*) as "count" from (${withoutPagination})`;
	const stmnt2 = db.prepare(countSql);
	const countRes = stmnt2.get() as { count: number };

	return { rows, count: countRes.count };
}
