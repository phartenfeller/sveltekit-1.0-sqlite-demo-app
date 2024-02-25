type ImgProps = {
	src: string;
	w: number;
	h: number;
};

export type ImgMeta = { img: ImgProps; sources: { [key: string]: string } };
