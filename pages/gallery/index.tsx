import styles from "@/styles/pages/gallery/Gallery.module.scss"
import { RiCamera3Line, RiVideoLine } from "react-icons/ri";
import { NextPage } from "next";
import CustomHead from "@/comp/CustomHead";
import IconButton from "@/comp/button/IconButton";
import useTranslate from "@/hooks/translate/useTranslate";

type Props = {}

const Gallery: NextPage<Props> = (props: Props) => {
  const { lang } = useTranslate();

  return (
    <>
      <CustomHead title={lang.navGallery} />
      <div className={styles.Gallery__Background} />
      <div className={styles.Gallery}>
        <IconButton
          size="10rem"
          link="/gallery/videos"
          tooltip={lang.galleryVideos}
          tooltipVariant="internal"
          variant="contained"
        >
          <RiVideoLine />
        </IconButton>

        <IconButton
          size="10rem" 
          link="/gallery/images"
          tooltip={lang.galleryImages}
          tooltipVariant="internal"
          variant="contained"
        >
          <RiCamera3Line />
        </IconButton>
      </div>
    </>
  )
}

export default Gallery;
