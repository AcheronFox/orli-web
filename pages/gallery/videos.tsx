import styles from "@/styles/pages/gallery/Videos.module.scss";
import { NextPage } from "next";
import CustomHead from "@/comp/CustomHead";
import useTranslate from "@/hooks/translate/useTranslate";
import { RiHourglass2Fill } from "react-icons/ri";

type Props = {}

const Videos: NextPage<Props> = (props: Props) => {
    const { lang } = useTranslate();
    const links: string[] = [
        'https://www.youtube-nocookie.com/embed/ZV7x83_KOIM/',
        'https://www.youtube-nocookie.com/embed/ZV7x83_KOIM/',
        'https://www.youtube-nocookie.com/embed/ZV7x83_KOIM/',
    ]

    return (
        <>
            <CustomHead title={lang.galleryVideos} />
            <div className={styles.Videos}>
                <div className={styles.Videos__Content}>
                    {
                        links.map((link, i) => {
                            return (
                                <div
                                    className={styles.Videos__Wrapper}
                                    key={i}
                                >
                                    <RiHourglass2Fill
                                        className={styles.Videos__Icon}
                                        size={"30%"}
                                    />
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        title={`YouTube video player ${i}`}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen={true}
                                        key={i}
                                        src={link}
                                        className={styles.Videos__Item}
                                    />
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        </>
    );
}

export default Videos;