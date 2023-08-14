type ImgProps = {
	src: string;
	w: number;
};
type ImgPropsH = ImgProps & { h: number };

export type ImgMeta = { img: ImgPropsH; sources: { [key: string]: ImgProps[] } };
