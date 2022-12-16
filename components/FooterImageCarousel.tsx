/* eslint-disable react-hooks/exhaustive-deps */
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import styles from "styles/components/footer/FooterImageCarousel.module.scss";
import Picture from "./Picture";
import Link from "next/link";

type CarouselImage = {
  imgPath: string;
  link: string;
};

type Props = {
  imgPaths: CarouselImage[];
  startImage?: number;
  lengthToSwitch?: number;
};

const FooterImageCarousel: NextPage<Props> = ({
  imgPaths,
  startImage = 0,
  lengthToSwitch = 5,
}: Props) => {
  const [indexOfShownImage, setIndexOfShownImage] =
    useState<number>(startImage);
  const [indexOfNextImage, setIndexOfNextImage] = useState<
    number | null | undefined
  >();
  const [isSwitching, setIsSwitching] = useState<boolean>(false);

  const SwitchImages = () => {
    //comment bad, makes code readable
    //there's only one person in this world who know what this does.. ME
    if (indexOfNextImage == undefined || indexOfNextImage == null) return;

    setIsSwitching(true);

    setTimeout(() => {
      setIndexOfShownImage(indexOfNextImage);

      if (indexOfNextImage + 1 >= imgPaths.length) {
        setIndexOfNextImage(0);
      } else {
        setIndexOfNextImage(indexOfNextImage + 1);
      }
      setIsSwitching(false);
    }, 200);
  };

  useEffect(() => {
    if (imgPaths.length > 1) setIndexOfNextImage(1);

    const root = document.documentElement;
    root?.style.setProperty("--length", `${lengthToSwitch}s`);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root?.style.setProperty("--length", `${lengthToSwitch}s`);
  }, [lengthToSwitch]);

  useEffect(() => {
    const imageSwitchingInterval = setInterval(() => {
      SwitchImages();
    }, lengthToSwitch * 1000);

    return () => clearInterval(imageSwitchingInterval);
  });

  return (
    <div className={styles.ImageCarouselWrapper}>
      <div className={styles.ImageCarousel}>
        <div
          className={`${styles.ImageWrapper} ${styles.NextImageIndex} ${
            isSwitching && styles.switching
          }`}
        >
          <Link href={imgPaths[indexOfNextImage ?? 0].link} target={"_blank"}>
            <div  className={styles.Link}>
              <Picture
                defaultSrc={imgPaths[indexOfNextImage ?? 0].imgPath}
                className={`${styles.Image}`}
              ></Picture>
            </div>
          </Link>
        </div>
        <div className={styles.ImageWrapper}>
          <Link href={imgPaths[indexOfShownImage].link} target={"_blank"}>
            <div className={styles.Link}>
              <Picture
                defaultSrc={imgPaths[indexOfShownImage].imgPath}
                className={styles.Image}
              ></Picture>
            </div>
          </Link>
        </div>
      </div>
      <div className={styles.TimeToNextImage}></div>
    </div>
  );
};

export default FooterImageCarousel;
