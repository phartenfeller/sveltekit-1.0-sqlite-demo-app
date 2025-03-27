import { tool } from 'ai';
import { z } from 'zod';
import { searchTracks, updateAlbumTitle } from '../db';

const trackData = tool({
	description: 'Get a list of tracks from the music library.',
	parameters: z.object({
		searchTerm: z.string().describe('The search term to filter tracks.')
	}),
	execute: async ({ searchTerm }) => {
		const results = searchTracks(searchTerm);

		const html = `<ul>
      ${results
				.map(
					(track) =>
						`<li><strong>${track.trackName}</strong> by ${track.artistName} (Album ${track.albumTitle} - ID ${track.albumId})</li>`
				)
				.join('')}
    </ul>`;

		return html;
	}
});

const sendEmail = tool({
	description: 'Send an email to a user.',
	parameters: z.object({
		to: z.string().describe('The recipient email address.'),
		subject: z.string().describe('The subject of the email.'),
		body: z.string().describe('The body of the email.')
	}),
	execute: async ({ to, subject, body }) => {
		// Simulate sending an email
		console.log(`Sending email to ${to} with subject "${subject}" and body "${body}"`);

		return `<div>Email to ${to} with subject "${subject}" sent successfully!</div>`;
	}
});

const renameAlbum = tool({
	description:
		'Rename an album in the music library. Make sure to search tracks first to get the album ID.',
	parameters: z.object({
		albumId: z.number().describe('The ID of the album to rename.'),
		newTitle: z.string().describe('The new title for the album.')
	}),
	execute: async ({ albumId, newTitle }) => {
		updateAlbumTitle(albumId, newTitle);

		return `<div>Album with ID ${albumId} renamed to "${newTitle}"!</div>`;
	}
});

export default function getTools() {
	return {
		searchTrackDb: trackData,
		sendEmail,
		renameAlbum
	};
}
