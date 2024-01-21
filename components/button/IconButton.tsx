import Color from "color";
import { NextPage } from "next";
import Link from "next/link";
import React, { Attributes, useEffect, useRef, useState } from "react";
import variables from "@/styles/abstracts/exports.module.scss"
import { IconType } from "react-icons/lib";
import styles from "@/styles/components/button/IconButton.module.scss"
import useRipple from "@/hooks/utils/useRipple";

type Props = {
    children: React.ReactElement<IconType>
    size?: 'normal' | 'small' | 'large'
    tooltip?: string
    link?: string
    target?: React.HTMLAttributeAnchorTarget
    onClick?: () => void
    color?: 'error' | 'warning' | 'success' | 'info' | 'primary' | 'secondary' | 'tertiary'
    customColor?: Color
    disabled?: boolean
}
const IconButton: NextPage<Props> = ({
    children,
    size = 'normal',
    tooltip,
    link,
    target,
    onClick,
    color = 'primary',
    customColor,
    disabled,
}: Props) =>{
    const [buttonColor, setButtonColor] = useState<Color>()
    const [icon, setIcon] = useState<React.ReactElement<IconType>>()
    const buttonRef = useRef<any>(null)
    const ripples = useRipple(buttonRef)

    useEffect(() => {
        let tempColor: Color;
        if (customColor) {
            tempColor = customColor
        }
        if (disabled) {
            tempColor = Color(variables.disabledColor.toString())
        }
        else {
            switch(color) {
                case "error":
                    tempColor = Color(variables.errorColor.toString())
                    break;
                case "warning":
                    tempColor = Color(variables.warningColor.toString())
                    break;
                case "info":
                    tempColor = Color(variables.infoColor.toString())
                    break;
                case "success":
                    tempColor = Color(variables.successColor.toString())
                    break;
                case "primary":
                    tempColor = Color(variables.primaryColor.toString())
                    break;
                case "secondary":
                    tempColor = Color(variables.secondaryColor.toString())
                    break;
                case "tertiary":
                    tempColor = Color(variables.tertiaryColor.toString())
                    break;
            }
        }
        setButtonColor(tempColor)
    }, [color, customColor, disabled])

    useEffect(() => {
        let tempSize = ''

        switch (size) {
            case "large":
                tempSize = variables.largeIconSize
                break;
            case "normal":
                tempSize = variables.normalIconSize
                break;
            case "small":
                tempSize = variables.smallIconSize
                break;
        }

        const element = React.cloneElement(children, {size: tempSize} as Partial<IconType> & Attributes)
        setIcon(element)
    }, [children, size])

    useEffect(() => {
        if (!link && !onClick) {
            throw new Error("Icon Button Action missing")
        }   
    }, [link, onClick])


    if (link) {
        return (
            <Link
                ref={buttonRef}
                href={link}
                target={target}
                onClick={onClick}
                className={`
                    ${styles.IconButton}
                    ${disabled? styles.IconButton__Disabled : ''}
                `}
            >
                {
                    (tooltip != undefined) &&
                    <span
                        className={styles.IconButton__Tooltip}
                        style={{background: buttonColor?.hex()}}
                    >
                        {tooltip}
                    </span>
                }
                <span
                    style={{color: buttonColor?.hex()}}
                    className={styles.IconButton__Icon}
                >
                    {icon}
                </span>
                {ripples}
            </Link>
        );
    }
    else {
        return (
            <button
                ref={buttonRef}
                onClick={onClick}
                className={`
                    ${styles.IconButton}
                    ${disabled? styles.IconButton__Disabled : ''}
                `}
            >
                {
                    (tooltip != undefined) &&
                    <span
                        className={styles.IconButton__Tooltip}
                        style={{background: buttonColor?.hex()}}
                    >
                        {tooltip}
                    </span>
                }
                <span
                    style={{color: buttonColor?.hex()}}
                    className={styles.IconButton__Icon}
                >
                    {icon}
                </span>
                {ripples}
            </button>
        );
    }
}

export default IconButton