import styles from "@/styles/pages/Gallery.module.scss";
import { useTranslate } from "@/hooks/useTranslate";
import { NextPage } from "next";
import CustomHead from "@/comp/CustomHead";
import CustomBackground from "@/comp/CustomBackground";

type Props = {}

const Gallery: NextPage<Props> = (props: Props) => {
    const { t } = useTranslate();

    return (
        <>
            <CustomHead title={t("navGallery")} />
            <CustomBackground />
            <div className={styles.MainWrapper}>
                <div className={styles.Title}>
                    <h1>
                        {t("navGallery")}
                    </h1>
                </div>
                <div className={styles.Gallery}>
                    <div className={styles.Gallery__Item}>
                        <picture className={styles.Gallery__Item__Img}>
                            <source srcSet="/gallery/blue1_x1.jpg 1x, /gallery/blue1_x2.jpg 2x," media="(max-width: 37.5em)" />
                            <img srcSet="/gallery/blue1_x1.jpg 1x, /gallery/blue1_x2.jpg 2x" alt="BlueDragon3 pic1" src="/gallery/blue1_x2.jpg" loading="lazy"/>
                        </picture>
                    </div>
                    <div className={styles.Gallery__Item}>
                    <picture className={styles.Gallery__Item__Img}>
                            <source srcSet="/gallery/blue2_x1.jpg 1x, /gallery/blue2_x2.jpg 2x," media="(max-width: 37.5em)" />
                            <img srcSet="/gallery/blue2_x1.jpg 1x, /gallery/blue2_x2.jpg 2x" alt="BlueDragon3 pic2" src="/gallery/blue2_x2.jpg" loading="lazy"/>
                        </picture>
                    </div>
                    <div className={styles.Gallery__Item}>
                        <picture className={styles.Gallery__Item__Img}>
                            <source srcSet="/gallery/blue3_x1.jpg 1x, /gallery/blue3_x2.jpg 2x," media="(max-width: 37.5em)" />
                            <img srcSet="/gallery/blue3_x1.jpg 1x, /gallery/blue3_x2.jpg 2x" alt="BlueDragon3 pic3" src="/gallery/blue3_x2.jpg" loading="lazy"/>
                        </picture>
                    </div>
                    <div className={styles.Gallery__Item}>
                        <picture className={styles.Gallery__Item__Img}>
                            <source srcSet="/gallery/blue4_x1.jpg 1x, /gallery/blue4_x2.jpg 2x," media="(max-width: 37.5em)" />
                            <img srcSet="/gallery/blue4_x1.jpg 1x, /gallery/blue4_x2.jpg 2x" alt="BlueDragon3 pic4" src="/gallery/blue4_x2.jpg" loading="lazy"/>
                        </picture>
                    </div>
                    <div className={styles.Gallery__Item}>
                        <picture className={styles.Gallery__Item__Img}>
                            <source srcSet="/gallery/blue5_x1.jpg 1x, /gallery/blue5_x2.jpg 2x," media="(max-width: 37.5em)" />
                            <img srcSet="/gallery/blue5_x1.jpg 1x, /gallery/blue5_x2.jpg 2x" alt="BlueDragon3 pic5" src="/gallery/blue5_x2.jpg" loading="lazy"/>
                        </picture>
                    </div>
                    <div className={styles.Gallery__Item}>
                        <picture className={styles.Gallery__Item__Img}>
                            <source srcSet="/gallery/blue6_x1.jpg 1x, /gallery/blue6_x2.jpg 2x," media="(max-width: 37.5em)" />
                            <img srcSet="/gallery/blue6_x1.jpg 1x, /gallery/blue6_x2.jpg 2x" alt="BlueDragon3 pic6" src="/gallery/blue6_x2.jpg" loading="lazy"/>
                        </picture>
                    </div>
                    <div className={styles.Gallery__Item}>
                        <picture className={styles.Gallery__Item__Img}>
                            <source srcSet="/gallery/makron1_x1.jpg 1x, /gallery/makron1_x2.jpg 2x," media="(max-width: 37.5em)" />
                            <img srcSet="/gallery/makron1_x1.jpg 1x, /gallery/makron1_x2.jpg 2x" alt="Makron_Chan pic1" src="/gallery/makron1_x2.jpg" loading="lazy"/>
                        </picture>
                    </div>
                    <div className={styles.Gallery__Item}>
                        <picture className={styles.Gallery__Item__Img}>
                            <source srcSet="/gallery/makron2_x1.jpg 1x, /gallery/makron2_x2.jpg 2x," media="(max-width: 37.5em)" />
                            <img srcSet="/gallery/makron2_x1.jpg 1x, /gallery/makron2_x2.jpg 2x" alt="Makron_Chan pic2" src="/gallery/makron2_x2.jpg" loading="lazy"/>
                        </picture>
                    </div>
                    <div className={styles.Gallery__Item}>
                        <picture className={styles.Gallery__Item__Img}>
                            <source srcSet="/gallery/marty3_x1.jpg 1x, /gallery/marty3_x2.jpg 2x," media="(max-width: 37.5em)" />
                            <img srcSet="/gallery/marty3_x1.jpg 1x, /gallery/marty3_x2.jpg 2x" alt="MartyFolf pic3" src="/gallery/marty3_x2.jpg" loading="lazy"/>
                        </picture>
                    </div>
                    <div className={styles.Gallery__Item}>
                        <picture className={styles.Gallery__Item__Img}>
                            <source srcSet="/gallery/marty2_x1.jpg 1x, /gallery/marty2_x2.jpg 2x," media="(max-width: 37.5em)" />
                            <img srcSet="/gallery/marty2_x1.jpg 1x, /gallery/marty2_x2.jpg 2x" alt="MartyFolf pic2" src="/gallery/marty2_x2.jpg" loading="lazy"/>
                        </picture>
                    </div>
                    <div className={styles.Gallery__Item}>
                        <picture className={styles.Gallery__Item__Img}>
                            <source srcSet="/gallery/marty4_x1.jpg 1x, /gallery/marty4_x2.jpg 2x," media="(max-width: 37.5em)" />
                            <img srcSet="/gallery/marty4_x1.jpg 1x, /gallery/marty4_x2.jpg 2x" alt="MartyFolf pic4" src="/gallery/marty4_x2.jpg" loading="lazy"/>
                        </picture>
                    </div>
                    <div className={styles.Gallery__Item}>
                        <picture className={styles.Gallery__Item__Img}>
                            <source srcSet="/gallery/marty1_x1.jpg 1x, /gallery/marty1_x2.jpg 2x," media="(max-width: 37.5em)" />
                            <img srcSet="/gallery/marty1_x1.jpg 1x, /gallery/marty1_x2.jpg 2x" alt="MartyFolf pic1" src="/gallery/marty1_x2.jpg" loading="lazy"/>
                        </picture>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Gallery;