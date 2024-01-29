import { NextPage } from "next";
import React from "react";
import styles from "@/styles/components/TextCard.module.scss";
import Picture from "./utils/Picture";

type Props = {
    children?: string | React.ReactNode
    icon?: React.ReactNode
    title?: string | React.ReactNode
    image?: CustomImage
    imagePlacement?: 'top' | 'right'
    variant?: 'contained' | 'outlined' | 'simple'
};

const TextCard: NextPage<Props> = ({
    children,
    icon,
    title,
    image,
    imagePlacement = 'top',
    variant = 'contained'
}: Props) => {

    return (
        <div className={`
            ${styles.TextCard}
            ${variant == "outlined"? styles.TextCard_Outlined : ''}
            ${variant == "contained"? styles.TextCard_Contained : ''} 
        `}>
            {
                (title != undefined) &&
                <div className={styles.TextCard__Title}>
                    {title}
                </div>
            }
            {
                (image != undefined) && imagePlacement == 'top' &&
                <Picture
                    sizes={image.sizes}
                    alt={image.alt || "Text Card Image"}
                    defaultSrc={image.imgPath}
                    className={styles.TextCard__Image_top}
                />
            }
            <div className={styles.TextCard__Body}>
                {
                    (icon != undefined) &&
                    <div className={styles.TextCard__Icon}>
                        {icon}
                    </div>
                }
                <div className={styles.TextCard__Content}>
                    {children}
                </div>
                {
                    (image != undefined) && imagePlacement == 'right' &&
                    <Picture
                        sizes={image.sizes || '100vw'}
                        alt={image.alt || "Text Card Image"}
                        defaultSrc={image.imgPath}
                        className={styles.TextCard__Image_right}
                    />
                }
            </div>
        </div>
    );
};

export default TextCard;