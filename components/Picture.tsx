import { NextPage } from "next";
import React from "react";

type Props = {
  imagePaths?: [string];
  imageMedias?: [string];
  alt?: string;
  defaultSrc: string;
  className?: string;
};

const Picture: NextPage<Props> = (props: Props) => {
  if (!props.defaultSrc) return (<></>);
  return (
    <picture>
      {props.imagePaths?.map((imagesrc, i) => (
        <source
          key={i}
          media={props.imageMedias![i]}
          srcSet={imagesrc}
        ></source>
      ))}
      <img
        className={props.className}
        src={"/" + props.defaultSrc}
        alt={props.alt ?? ""}
      ></img>
    </picture>
  );
};

export default Picture;