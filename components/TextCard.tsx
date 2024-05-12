import { NextPage } from "next";
import React from "react";
import styles from "@/styles/components/TextCard.module.scss";
import Picture from "./utils/Picture";
import { ICustomImage } from "@/models/image.model";

type Props = {
    children?: string | React.ReactNode
    icon?: React.ReactNode
    title?: string | React.ReactNode
    image?: ICustomImage
    imagePlacement?: 'top' | 'right'
    variant?: 'contained' | 'outlined' | 'simple' | 'filled'
    shadowEnabled?: boolean
    customTitleClass?: string
    customBodyClass?: string
    floatImage?: boolean
    floatIcon?: boolean
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
    floatImage = false,
    floatIcon = false,
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
                        defaultSrc={image.imgPath? (
                                process.env.NODE_ENV == "development"
                                ?
                                `uploads/${image.imgPath}`
                                :
                                `${process.env.DOMAIN_ROOT}uploads/${image.imgPath}`
                            )
                            : "Default_profile.jpg"
                        }
                        alt={image.alt || "Text Card Image"}
                        className={`${styles.TextCard__Image_top} ${image.customStyle? image.customStyle : ''}`}
                    />
                </div>
            }
            <div className={`
                ${styles.TextCard__Body}
                ${customBodyClass? customBodyClass : ''}
            `}>
                {
                    (icon != undefined && floatIcon == false) &&
                    <div className={styles.TextCard__Icon}>
                        {icon}
                    </div>
                }
                <div className={styles.TextCard__Content}>
                    {
                        (icon != undefined && floatIcon == true) &&
                        <div className={`${styles.TextCard__Icon} ${styles.TextCard__Icon_float}`}>
                            {icon}
                        </div>
                    }
                    {
                        (image != undefined && imagePlacement == 'right' && floatImage == true) &&
                        <div className={`${styles.TextCard__Image} ${styles.TextCard__Image_right} ${styles.TextCard__Image_float}`}>
                            <Picture
                                sizes={image.sizes || '100vw'}
                                alt={image.alt || "Text Card Image"}
                                defaultSrc={image.imgPath? (
                                        process.env.NODE_ENV == "development"
                                        ?
                                        `uploads/${image.imgPath}`
                                        :
                                        `${process.env.DOMAIN_ROOT}uploads/${image.imgPath}`
                                    )
                                    : "Default_profile.jpg"
                                }
                                className={`${image.customStyle? image.customStyle : ''}`}
                            />
                        </div>
                    }
                    {children}
                </div>
                {
                    (image != undefined && imagePlacement == 'right' && floatImage == false) &&
                    <div className={`${styles.TextCard__Image}`}>
                        <Picture
                            sizes={image.sizes || '100vw'}
                            alt={image.alt || "Text Card Image"}
                            defaultSrc={image.imgPath? (
                                    process.env.NODE_ENV == "development"
                                    ?
                                    `uploads/${image.imgPath}`
                                    :
                                    `${process.env.DOMAIN_ROOT}uploads/${image.imgPath}`
                                )
                                : "Default_profile.jpg"
                            }
                            className={`${styles.TextCard__Image_right} ${image.customStyle? image.customStyle : ''}`}
                        />
                    </div>
                }
            </div>
        </div>
    );
};

export default TextCard;