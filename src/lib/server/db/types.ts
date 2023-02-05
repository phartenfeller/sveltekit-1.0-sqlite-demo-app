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
};

export type AlbumTrack = {
	trackId: number;
	trackName: string;
	trackMs: number;
	composer: string;
	genre: string;
};

export type Genre = { genreId: number; genreName: string };
