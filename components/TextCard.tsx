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
    variant?: 'contained' | 'outlined' | 'simple' | 'filled'
    shadowEnabled?: boolean
    customTitleClass?: string
    customBodyClass?: string
};

const TextCard: NextPage<Props> = ({
    children,
    icon,
    title,
    image,
    imagePlacement = 'top',
    variant = 'contained',
    shadowEnabled,
    customTitleClass,
    customBodyClass,
}: Props) => {

    return (
        <div className={`
            ${styles.TextCard}
            ${variant == "outlined"? styles.TextCard_Outlined : ''}
            ${variant == "contained"? styles.TextCard_Contained : ''} 
            ${variant == "filled"? styles.TextCard_Filled : ''}
            ${shadowEnabled? styles.TextCard__Shadow : ''}
        `}>
            {
                (title != undefined) &&
                <div className={`
                    ${styles.TextCard__Title}
                    ${customTitleClass? customTitleClass : ''}
                `}>
                    {title}
                </div>
            }
            {
                (image != undefined) && imagePlacement == 'top' &&
                <div className={styles.TextCard__Image}>
                    <Picture
                        sizes={image.sizes}
                        alt={image.alt || "Text Card Image"}
                        defaultSrc={image.imgPath}
                        className={`${styles.TextCard__Image_top} ${image.customStyle? image.customStyle : ''}`}
                    />
                </div>
            }
            <div className={`
                ${styles.TextCard__Body}
                ${customBodyClass? customBodyClass : ''}
            `}>
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
                    <div className={styles.TextCard__Image}>
                        <Picture
                            sizes={image.sizes || '100vw'}
                            alt={image.alt || "Text Card Image"}
                            defaultSrc={image.imgPath}
                            className={`${styles.TextCard__Image_right} ${image.customStyle? image.customStyle : ''}`}
                        />
                    </div>
                }
            </div>
        </div>
    );
};

export default TextCard;