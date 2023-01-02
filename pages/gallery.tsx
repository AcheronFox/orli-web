import Picture from "@/comp/Picture";
import styles from "@/styles/pages/Gallery.module.scss";
import { useTranslate } from "@/hooks/useTranslate";

export default function Gallery() {
    const { t } = useTranslate();

    return (
        <div className={styles.MainWrapper}>
            <div className={styles.Title}>
                <h1>
                    {t("navGallery")}
                </h1>
            </div>
            <div className={styles.Gallery}>
                <div className={styles.Gallery__Item}>
                    <div className={styles.Gallery__Item__Img}>
                        <Picture defaultSrc="gallery/blue/P1000188.jpg"></Picture>
                    </div>
                </div>
                <div className={styles.Gallery__Item}>
                    <div className={styles.Gallery__Item__Img}>
                        <Picture defaultSrc="gallery/blue/P1000203.jpg"></Picture>
                    </div>
                </div>
                <div className={styles.Gallery__Item}>
                    <div className={styles.Gallery__Item__Img}>
                        <Picture defaultSrc="gallery/blue/P1000205.jpg"></Picture>
                    </div>
                </div>
                <div className={styles.Gallery__Item}>
                    <div className={styles.Gallery__Item__Img}>
                        <Picture defaultSrc="gallery/blue/P1000367.jpg"></Picture>
                    </div>
                </div>
                <div className={styles.Gallery__Item}>
                    <div className={styles.Gallery__Item__Img}>
                        <Picture defaultSrc="gallery/blue/P1000380.jpg"></Picture>
                    </div>
                </div>
                <div className={styles.Gallery__Item}>
                    <div className={styles.Gallery__Item__Img}>
                        <Picture defaultSrc="gallery/blue/P1000429.jpg"></Picture>
                    </div>
                </div>
                <div className={styles.Gallery__Item}>
                    <div className={styles.Gallery__Item__Img}>
                        <Picture defaultSrc="gallery/Makron/photo_2022-06-21_03-06-16.jpg"></Picture>
                    </div>
                </div>
                <div className={styles.Gallery__Item}>
                    <div className={styles.Gallery__Item__Img}>
                        <Picture defaultSrc="gallery/Makron/photo_2022-06-21_03-06-18.jpg"></Picture>
                    </div>
                </div>
                <div className={styles.Gallery__Item}>
                    <div className={styles.Gallery__Item__Img}>
                        <Picture defaultSrc="gallery/Marty/ÖFF-0416.jpg"></Picture>
                    </div>
                </div>
                <div className={styles.Gallery__Item}>
                    <div className={styles.Gallery__Item__Img}>
                        <Picture defaultSrc="gallery/Marty/ÖFF-0433.jpg"></Picture>
                    </div>
                </div>
                <div className={styles.Gallery__Item}>
                    <div className={styles.Gallery__Item__Img}>
                        <Picture defaultSrc="gallery/Marty/ÖFF-0406.jpg"></Picture>
                    </div>
                </div>
                <div className={styles.Gallery__Item}>
                    <div className={styles.Gallery__Item__Img}>
                        <Picture defaultSrc="gallery/Marty/ÖFF-0483.jpg"></Picture>
                    </div>
                </div>
            </div>
        </div>
    );
}
