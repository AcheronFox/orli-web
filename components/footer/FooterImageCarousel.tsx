/* eslint-disable react-hooks/exhaustive-deps */
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import styles from "styles/components/footer/FooterImageCarousel.module.scss";
import Picture from "./../Picture";
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
    }, 500);
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
    <div className={styles.ImageCarousel}>
      <div
        className={`${styles.ImageCarousel__ImageWrapper} ${styles.ImageCarousel__NextImage} ${isSwitching && styles.ImageCarousel__Switching}`}
      >
        <Link href={imgPaths[indexOfNextImage ?? 0].link} target={"_blank"} rel="noopener noreferrer">
          <div>
            <Picture
              defaultSrc={imgPaths[indexOfNextImage ?? 0].imgPath}
              className={`${styles.ImageCarousel__Image}`}
            ></Picture>
          </div>
        </Link>
      </div>
      <div className={styles.ImageCarousel__Wrapper}>
        <Link href={imgPaths[indexOfShownImage].link} target={"_blank"} rel="noopener noreferrer">
          <div>
            <Picture
              defaultSrc={imgPaths[indexOfShownImage].imgPath}
              className={styles.ImageCarousel__Image}
            ></Picture>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default FooterImageCarousel;
