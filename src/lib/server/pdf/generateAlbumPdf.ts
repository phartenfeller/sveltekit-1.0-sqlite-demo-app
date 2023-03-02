import PdfPrinter from 'pdfmake';
import blobStream, { type IBlobStream } from 'blob-stream';
import type { TDocumentDefinitions, TFontDictionary } from 'pdfmake/interfaces';
import { getAlbumById, getAlbumImage, getAlbumTracks, otherAlbumsOfArtist } from '../db';

const fonts: TFontDictionary = {
	Inter: {
		normal: 'src/lib/server/pdf/fonts/Inter-Regular.ttf',
		bold: 'src/lib/server/pdf/fonts/Inter-Bold.ttf'
	}
};
const printer = new PdfPrinter(fonts);

async function blobToBase64(blob: Blob) {
	const buffer = Buffer.from(await blob.arrayBuffer());
	return `data:${blob.type};base64,${buffer.toString('base64')}`;
}

async function genAlbumPdf(albumId: number): Promise<Blob> {
	const album = getAlbumById(albumId);
	const tracks = getAlbumTracks(albumId);
	const otherArtistAlbums = otherAlbumsOfArtist(album.artistId, albumId);

	let imgBase64: string | undefined;

	if (album.imgName) {
		const img = getAlbumImage(albumId, album.imgName);
		imgBase64 = await blobToBase64(img.data);
	}

	const file: TDocumentDefinitions = {
		content: [
			{ text: album.albumTitle, style: 'h1' },
			`By ${album.artistName}`,

			imgBase64 ? { image: imgBase64, width: 100 } : 'no image',

			{ text: 'Tracks', style: 'h2' },
			{
				table: {
					headerRows: 1,
					body: [
						[
							{ text: '#', style: 'tableHeader' },
							{ text: 'Name', style: 'tableHeader' },
							{ text: 'Seconds', style: 'tableHeader' }
						],
						...tracks.map((track, i) => [i + 1, track.trackName, (track.trackMs / 1000).toFixed(1)])
					]
				},
				layout: 'headerLineOnly'
			},
			{ text: 'Other Albums by this Artist', style: 'h2' },
			{
				ul: otherArtistAlbums.map((a) => ({
					text: a.albumTitle,
					link: `http://localhost:5173/album/${a.albumId}`,
					style: 'link'
				}))
			}
		],
		styles: {
			h1: {
				fontSize: 18,
				bold: true,
				margin: [0, 0, 0, 16]
			},
			h2: {
				fontSize: 16,
				margin: [0, 10, 0, 10]
			},
			tableHeader: {
				bold: true,
				fontSize: 13,
				color: 'black',
				fillColor: '#e7e7e7',
				margin: [0, 2, 0, 2]
			},
			link: {
				decoration: 'underline',
				color: 'blue'
			}
		},
		defaultStyle: {
			font: 'Inter'
		}
	};

	return new Promise((resolve, reject) => {
		const pdf = printer.createPdfKitDocument(file);

		pdf
			.pipe(blobStream())
			.on('finish', function (this: IBlobStream) {
				console.log('Finished generating PDF');
				resolve(this.toBlob('application/pdf'));
			})
			.on('error', (err) => {
				console.error('err', err);
				reject(err);
			});

		pdf.end();
	});
}

export default genAlbumPdf;
