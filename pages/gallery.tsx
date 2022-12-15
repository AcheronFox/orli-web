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
                        <Picture defaultSrc="gallery/_89716241_thinkstockphotos-523060154.jpg"></Picture>
                    </div>
                </div>
                <div className={styles.Gallery__Item}>
                    <div className={styles.Gallery__Item__Img}>
                        <Picture defaultSrc="gallery/_89716241_thinkstockphotos-523060154.jpg"></Picture>
                    </div>
                </div>
                <div className={styles.Gallery__Item}>
                    <div className={styles.Gallery__Item__Img}>
                        <Picture defaultSrc="gallery/_89716241_thinkstockphotos-523060154.jpg"></Picture>
                    </div>
                </div>
                <div className={styles.Gallery__Item}>
                    <div className={styles.Gallery__Item__Img}>
                        <Picture defaultSrc="gallery/_89716241_thinkstockphotos-523060154.jpg"></Picture>
                    </div>
                </div>
                <div className={styles.Gallery__Item}>
                    <div className={styles.Gallery__Item__Img}>
                        <Picture defaultSrc="gallery/_89716241_thinkstockphotos-523060154.jpg"></Picture>
                    </div>
                </div>
                <div className={styles.Gallery__Item}>
                    <div className={styles.Gallery__Item__Img}>
                        <Picture defaultSrc="gallery/_89716241_thinkstockphotos-523060154.jpg"></Picture>
                    </div>
                </div>
            </div>
        </div>
    );
}
