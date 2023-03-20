import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createTransport, type Transporter } from 'nodemailer';
import { getInvoiceEmailDetails } from '$lib/server/db';

let transport: Transporter;

export const POST = (async ({ locals, params }) => {
	if (!locals?.roles?.includes('admin')) {
		throw error(401, 'Unauthorized');
	}

	const { id } = params;

	const { order, tracks } = getInvoiceEmailDetails(parseInt(id));

	if (!transport) {
		transport = createTransport({
			host: 'localhost',
			port: 1025,
			secure: false
		});
	}

	const text = `
Hello ${order.customer},

Thank you for your order! See below for details.

Order #${order.id}
${tracks
	.map(
		(item) =>
			` - ${item.quantity} x ${item.track} - ${item.album} - ${item.artist} (${item.price}€)`
	)
	.join('\n')}

Total: ${order.total}€

Your order will be shipped to: ${order.address}, ${order.city}, ${order.country}

Kind regards,
SvelteKit Demo App Team
`;

	const html = `
<p>Hello ${order.customer},</p>

<p>Thank you for your order! See below for details.</p>

<p>Order #${order.id}</p>

<ul>
${tracks
	.map(
		(item) =>
			`<li>${item.quantity} x <b>${item.track}</b> - ${item.album} - ${item.artist} (${item.price}€)</li>`
	)
	.join('\n')}
</ul>

<p>Total: ${order.total}€</p>

<p>Your order will be shipped to: ${order.address}, ${order.city}, ${order.country}</p>

<p>Kind regards,<br>
SvelteKit Demo App Team</p>`;

	const worked = await transport.sendMail({
		from: '"SvelteKit Demo App" <sveltekit@example.com>',
		to: order.email,
		subject: `Order confirmation #${order.id}`,
		text,
		html
	});

	return new Response(worked.response);
}) satisfies RequestHandler;
