export type SessionInfo = {
	username: string;
	roles: string[];
};

export type SessionInfoCache = SessionInfo & {
	invalidAt: number;
};

export type Track = {
	trackId: number;
	trackName: string;
	albumId: number;
	albumTitle: string;
	artistId: number;
	artistName: string;
	genre: string;
};

export type Album = {
	albumId: number;
	albumTitle: string;
	artistId: number;
	artistName: string;
	imgName?: string;
};

export type AlbumTrack = {
	trackId: number;
	trackName: string;
	trackMs: number;
	composer: string;
	genre: string;
};

export type Genre = { genreId: number; genreName: string };

export type TracksGridSaveData = {
	deleted?: number[];
	rows?: AlbumTrack[];
	albumId: number;
};

export type AlbumImage = {
	filename: string;
	mimeType: string;
	lastModified: number;
	size: number;
	data: Blob;
};

export type Invoice = {
	id: number;
	date: string;
	address: string;
	city: string;
	state: string;
	country: string;
	postalCode: string;
	total: number;
	customer: string;
};
