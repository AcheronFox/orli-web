import styles from "@/styles/pages/gallery/Images.module.scss";
import { NextPage } from "next";
import CustomHead from "@/comp/utils/CustomHead";
import useTranslate from "@/hooks/translate/useTranslate";
import Link from "next/link";
import Picture from "@/comp/utils/Picture";

type Props = {}

const Images: NextPage<Props> = (props: Props) => {
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
            <div className={styles.Images}>
                <div className={styles.Images__Content}>
                    {
                        images.map((img, i) => {
                            return (
                                <Link
                                    key={i}
                                    href={`/gallery/${img}`}
                                    className={styles.Images__Item}
                                    target="_blank"
                                >
                                    <Picture
                                        sizes="(max-width: 1000px) 100vw, 45vw"
                                        className={styles.Images__Item__Img}
                                        defaultSrc={
                                            process.env.NODE_ENV == "development"
                                            ?
                                            `gallery/${img}`
                                            :
                                            `${process.env.DOMAIN_ROOT}gallery/${img}`
                                        }
                                        alt={`${img} (Img_${i})`}
                                    />
                                </Link>
                            );
                        })
                    }
                </div>
            </div>
        </>
    );
}

export default Images;