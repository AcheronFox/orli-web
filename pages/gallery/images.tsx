import styles from "@/styles/pages/gallery/Images.module.scss";
import { NextPage } from "next";
import CustomHead from "@/comp/CustomHead";
import useTranslate from "@/hooks/translate/useTranslate";
import Link from "next/link";
import Picture from "@/comp/utils/Picture";

type Props = {}

const Gallery: NextPage<Props> = (props: Props) => {
    const { lang } = useTranslate();
    const images: string[] = [
        'blue_1.jpg',
        'blue_2.jpg',
        'blue_3.jpg',
        'blue_4.jpg',
        'blue_5.jpg',
        'blue_6.jpg',
        'makron_1.jpg',
        'makron_2.jpg',
        'marty_3.jpg',
        'marty_2.jpg',
        'marty_4.jpg',
        'marty_1.jpg'
    ]

    return (
        <>
            <CustomHead title={lang.galleryImages} />
            <div className={styles.Gallery__Background} />
            <div className={styles.Gallery}>
                <div className={styles.Gallery__Content}>
                    {
                        images.map((img, i) => {
                            return (
                                <Link
                                    key={i}
                                    href={`/gallery/${img}`}
                                    className={styles.Gallery__Item}
                                    target="_blank"
                                >
                                    <Picture
                                        sizes="(max-width: 600px) 100vw, 45vw"
                                        className={styles.Gallery__Item__Img}
                                        defaultSrc={`gallery/${img}`}
                                        alt={`${img} (Img_${i})`}
                                    />
                                </Link>
                            );
                        })
                    }
                    {
                        /*
                        <Link className={styles.Gallery__Item}>
                    <picture className={styles.Gallery__Item__Img}>
                            <source srcSet="/gallery/blue2_x1.jpg 1x, /gallery/blue2_x2.jpg 2x," media="(max-width: 37.5em)" />
                            <img srcSet="/gallery/blue2_x1.jpg 1x, /gallery/blue2_x2.jpg 2x" alt="BlueDragon3 pic2" src="/gallery/blue2_x2.jpg" loading="lazy"/>
                        </picture>
                    </Link>
                    <Link className={styles.Gallery__Item}>
                        <picture className={styles.Gallery__Item__Img}>
                            <source srcSet="/gallery/blue3_x1.jpg 1x, /gallery/blue3_x2.jpg 2x," media="(max-width: 37.5em)" />
                            <img srcSet="/gallery/blue3_x1.jpg 1x, /gallery/blue3_x2.jpg 2x" alt="BlueDragon3 pic3" src="/gallery/blue3_x2.jpg" loading="lazy"/>
                        </picture>
                    </Link>
                    <Link className={styles.Gallery__Item}>
                        <picture className={styles.Gallery__Item__Img}>
                            <source srcSet="/gallery/blue4_x1.jpg 1x, /gallery/blue4_x2.jpg 2x," media="(max-width: 37.5em)" />
                            <img srcSet="/gallery/blue4_x1.jpg 1x, /gallery/blue4_x2.jpg 2x" alt="BlueDragon3 pic4" src="/gallery/blue4_x2.jpg" loading="lazy"/>
                        </picture>
                    </Link>
                    <Link className={styles.Gallery__Item}>
                        <picture className={styles.Gallery__Item__Img}>
                            <source srcSet="/gallery/blue5_x1.jpg 1x, /gallery/blue5_x2.jpg 2x," media="(max-width: 37.5em)" />
                            <img srcSet="/gallery/blue5_x1.jpg 1x, /gallery/blue5_x2.jpg 2x" alt="BlueDragon3 pic5" src="/gallery/blue5_x2.jpg" loading="lazy"/>
                        </picture>
                    </Link>
                    <Link className={styles.Gallery__Item}>
                        <picture className={styles.Gallery__Item__Img}>
                            <source srcSet="/gallery/blue6_x1.jpg 1x, /gallery/blue6_x2.jpg 2x," media="(max-width: 37.5em)" />
                            <img srcSet="/gallery/blue6_x1.jpg 1x, /gallery/blue6_x2.jpg 2x" alt="BlueDragon3 pic6" src="/gallery/blue6_x2.jpg" loading="lazy"/>
                        </picture>
                    </Link>
                    <Link className={styles.Gallery__Item}>
                        <picture className={styles.Gallery__Item__Img}>
                            <source srcSet="/gallery/makron1_x1.jpg 1x, /gallery/makron1_x2.jpg 2x," media="(max-width: 37.5em)" />
                            <img srcSet="/gallery/makron1_x1.jpg 1x, /gallery/makron1_x2.jpg 2x" alt="Makron_Chan pic1" src="/gallery/makron1_x2.jpg" loading="lazy"/>
                        </picture>
                    </Link>
                    <Link className={styles.Gallery__Item}>
                        <picture className={styles.Gallery__Item__Img}>
                            <source srcSet="/gallery/makron2_x1.jpg 1x, /gallery/makron2_x2.jpg 2x," media="(max-width: 37.5em)" />
                            <img srcSet="/gallery/makron2_x1.jpg 1x, /gallery/makron2_x2.jpg 2x" alt="Makron_Chan pic2" src="/gallery/makron2_x2.jpg" loading="lazy"/>
                        </picture>
                    </Link>
                    <Link className={styles.Gallery__Item}>
                        <picture className={styles.Gallery__Item__Img}>
                            <source srcSet="/gallery/marty3_x1.jpg 1x, /gallery/marty3_x2.jpg 2x," media="(max-width: 37.5em)" />
                            <img srcSet="/gallery/marty3_x1.jpg 1x, /gallery/marty3_x2.jpg 2x" alt="MartyFolf pic3" src="/gallery/marty3_x2.jpg" loading="lazy"/>
                        </picture>
                    </Link>
                    <Link className={styles.Gallery__Item}>
                        <picture className={styles.Gallery__Item__Img}>
                            <source srcSet="/gallery/marty2_x1.jpg 1x, /gallery/marty2_x2.jpg 2x," media="(max-width: 37.5em)" />
                            <img srcSet="/gallery/marty2_x1.jpg 1x, /gallery/marty2_x2.jpg 2x" alt="MartyFolf pic2" src="/gallery/marty2_x2.jpg" loading="lazy"/>
                        </picture>
                    </Link>
                    <Link className={styles.Gallery__Item}>
                        <picture className={styles.Gallery__Item__Img}>
                            <source srcSet="/gallery/marty4_x1.jpg 1x, /gallery/marty4_x2.jpg 2x," media="(max-width: 37.5em)" />
                            <img srcSet="/gallery/marty4_x1.jpg 1x, /gallery/marty4_x2.jpg 2x" alt="MartyFolf pic4" src="/gallery/marty4_x2.jpg" loading="lazy"/>
                        </picture>
                    </Link>
                    <Link className={styles.Gallery__Item}>
                        <picture className={styles.Gallery__Item__Img}>
                            <source srcSet="/gallery/marty1_x1.jpg 1x, /gallery/marty1_x2.jpg 2x," media="(max-width: 37.5em)" />
                            <img srcSet="/gallery/marty1_x1.jpg 1x, /gallery/marty1_x2.jpg 2x" alt="MartyFolf pic1" src="/gallery/marty1_x2.jpg" loading="lazy"/>
                        </picture>
                    </Link>
                        */
                    }
                    
                </div>
            </div>
        </>
    );
}

export default Gallery;