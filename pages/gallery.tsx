import Picture from "@/comp/Picture"
import styles from "@/styles/pages/Gallery.module.scss"
import Image from "next/image"

export default function Gallery() {
  return (
    <div className={styles.MainWrapper}>
      <div className={styles.Gallery}>
            <div className={styles.Gallery__Item}>
                <div className={styles.Gallery__Item__Img}>
                    <Picture defaultSrc="_89716241_thinkstockphotos-523060154.jpg"></Picture>
                </div>
            </div>
            <div className={styles.Gallery__Item}>
                <div className={styles.Gallery__Item__Img}>
                    <Picture defaultSrc="_89716241_thinkstockphotos-523060154.jpg"></Picture>
                </div>
            </div>
            <div className={styles.Gallery__Item}>
                <div className={styles.Gallery__Item__Img}>
                    <Picture defaultSrc="_89716241_thinkstockphotos-523060154.jpg"></Picture>
                </div>
            </div>
            <div className={styles.Gallery__Item}>
                <div className={styles.Gallery__Item__Img}>
                    <Picture defaultSrc="_89716241_thinkstockphotos-523060154.jpg"></Picture>
                </div>
            </div>
            <div className={styles.Gallery__Item}>
                <div className={styles.Gallery__Item__Img}>
                    <Picture defaultSrc="_89716241_thinkstockphotos-523060154.jpg"></Picture>
                </div>
            </div>
            <div className={styles.Gallery__Item}>
                <div className={styles.Gallery__Item__Img}>
                    <Picture defaultSrc="_89716241_thinkstockphotos-523060154.jpg"></Picture>
                </div>
            </div>
            <div className={styles.Gallery__Item}>
                <div className={styles.Gallery__Item__Img}>
                    <Picture defaultSrc="_89716241_thinkstockphotos-523060154.jpg"></Picture>
                </div>
            </div>
            <div className={styles.Gallery__Item}>
                <div className={styles.Gallery__Item__Img}>
                    <Picture defaultSrc="_89716241_thinkstockphotos-523060154.jpg"></Picture>
                </div>
            </div>
            <div className={styles.Gallery__Item}>
                <div className={styles.Gallery__Item__Img}>
                    <Picture defaultSrc="_89716241_thinkstockphotos-523060154.jpg"></Picture>
                </div>
            </div>
      </div>
    </div>
  )
}
