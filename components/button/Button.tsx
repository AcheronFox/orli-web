import Color from "color";
import { NextPage } from "next";
import React, { useEffect, useRef, useState } from "react";
import variables from "@/styles/abstracts/exports.module.scss"
import styles from "@/styles/components/button/Button.module.scss"
import Link from "next/link";
import useRipple from "@/hooks/utils/useRipple";
import { IconType } from "react-icons/lib";


// ============
// VARIANTS
// ============

// CONTAINED
type ContainedProps = {
    label?: string
    children?: string | React.ReactNode
    size: string
    color: Color
    link?: string
    target?: React.HTMLAttributeAnchorTarget
    onClick?: () => void
    startIcon?: React.ReactElement<IconType>
    endIcon?: React.ReactElement<IconType>
    disabled?: boolean
    id?: string
    type?: string
}
const ContainedButton: NextPage<ContainedProps> = ({
    label,
    children,
    size,
    color,
    link,
    target,
    onClick,
    startIcon,
    endIcon,
    disabled,
    id,
    type
}: ContainedProps) =>{
    const buttonRef = useRef<any>(null)
    const ripples = useRipple(buttonRef)

    return (
        <>
            {
                (link != undefined)?
                <Link
                    id={id}
                    type={type}
                    ref={buttonRef}
                    href={link}
                    target={target}
                    style={{
                        color: color.hex(),
                        backgroundColor: color.hex(),
                        fontSize: size,
                    }}
                    className={`
                        ${styles.Button}
                        ${styles.Button__Contained}
                        ${disabled? styles.Button__Disabled : ''}
                    `}
                >
                    {ripples}
                    {
                        (startIcon != undefined) &&
                        startIcon
                    }
                    <span className={styles.Button__Contained__Text}>{children? children : label}</span>
                    {
                        (endIcon != undefined) &&
                        endIcon
                    }
                </Link>
                :
                <button
                    id={id}
                    ref={buttonRef}
                    onClick={onClick}
                    style={{
                        color: color.hex(),
                        backgroundColor: color.hex(),
                        fontSize: size,
                    }}
                    className={`
                        ${styles.Button}
                        ${styles.Button__Contained}
                        ${disabled? styles.Button__Disabled : ''}
                    `}
                >
                    {ripples}
                    {
                        (startIcon != undefined) &&
                        startIcon
                    }
                    <span className={styles.Button__Contained__Text}>{children? children : label}</span>
                    {
                        (endIcon != undefined) &&
                        endIcon
                    }
                </button>
            }
        </>
    );
}


// OUTLINED
type OutlinedProps = {
    label?: string
    children?: string | React.ReactNode
    size: string
    color: Color
    link?: string
    target?: React.HTMLAttributeAnchorTarget
    onClick?: () => void
    startIcon?: React.ReactElement<IconType>
    endIcon?: React.ReactElement<IconType>
    disabled?: boolean
    id?: string
    type?: string
}
const OutlinedButton: NextPage<OutlinedProps> = ({
    label,
    children,
    size,
    color,
    link,
    target,
    onClick,
    startIcon,
    endIcon,
    disabled,
    id,
    type
}: OutlinedProps) =>{
    const buttonRef = useRef<any>(null)
    const ripples = useRipple(buttonRef)

    return (
        <>
            {
                (link != undefined)?
                <Link
                    id={id}
                    type={type}
                    ref={buttonRef}
                    href={link}
                    target={target}
                    style={{
                        color: color.hex(),
                        fontSize: size,
                    }}
                    className={`
                        ${styles.Button}
                        ${styles.Button__Outlined}
                        ${disabled? styles.Button__Disabled : ''}
                    `}
                >
                    {ripples}
                    {
                        (startIcon != undefined) &&
                        startIcon
                    }
                    <span>{children? children : label}</span>
                    {
                        (endIcon != undefined) &&
                        endIcon
                    }
                    <div
                        style={{backgroundColor: color.hex()}}
                        className={styles.Button__Outlined__Background}
                    />
                </Link>
                :
                <button
                    id={id}
                    ref={buttonRef}
                    onClick={onClick}
                    style={{
                        color: color.hex(),
                        fontSize: size,
                    }}
                    className={`
                        ${styles.Button}
                        ${styles.Button__Outlined}
                        ${disabled? styles.Button__Disabled : ''}
                    `}
                >
                    {ripples}
                    {
                        (startIcon != undefined) &&
                        startIcon
                    }
                    <span>{children? children : label}</span>
                    {
                        (endIcon != undefined) &&
                        endIcon
                    }
                    <div
                        style={{backgroundColor: color.hex()}}
                        className={styles.Button__Outlined__Background}
                    />
                </button>
            }
        </>
    );
}


// TEXT
type TextProps = {
    label?: string
    children?: string | React.ReactNode
    size: string
    color: Color
    link?: string
    target?: React.HTMLAttributeAnchorTarget
    onClick?: () => void
    startIcon?: React.ReactElement<IconType>
    endIcon?: React.ReactElement<IconType>
    disabled?: boolean
    id?: string
    type?: string
}
const TextButon: NextPage<TextProps> = ({
    label,
    children,
    size,
    color,
    link,
    target,
    onClick,
    startIcon,
    endIcon,
    disabled,
    id,
    type
}: TextProps) =>{
    const buttonRef = useRef<any>(null)
    const ripples = useRipple(buttonRef)

    return (
        <>
            {
                (link != undefined)?
                <Link
                    id={id}
                    type={type}
                    ref={buttonRef}
                    href={link}
                    target={target}
                    style={{
                        color: color.hex(),
                        fontSize: size,
                    }}
                    className={`
                        ${styles.Button}
                        ${styles.Button__Text}
                        ${disabled? styles.Button__Disabled : ''}
                    `}
                >
                    {ripples}
                    {
                        (startIcon != undefined) &&
                        startIcon
                    }
                    <span>{children? children : label}</span>
                    {
                        (endIcon != undefined) &&
                        endIcon
                    }
                    <div
                        style={{backgroundColor: color.hex()}}
                        className={styles.Button__Text__Underline}
                    />
                </Link>
                :
                <button
                    id={id}
                    ref={buttonRef}
                    onClick={onClick}
                    style={{
                        color: color.hex(),
                        fontSize: size,
                    }}
                    className={`
                        ${styles.Button}
                        ${styles.Button__Text}
                        ${disabled? styles.Button__Disabled : ''}
                    `}
                >
                    {ripples}
                    {
                        (startIcon != undefined) &&
                        startIcon
                    }
                    <span>{children? children : label}</span>
                    {
                        (endIcon != undefined) &&
                        endIcon
                    }
                    <div
                        style={{backgroundColor: color.hex()}}
                        className={styles.Button__Text__Underline}
                    />
                </button>
            }
        </>
    );
}



// ============
// MAIN
// ============
type Props = {
    variant?: 'contained' | 'outlined' | 'text'
    label?: string
    children?: string | React.ReactNode
    size?: 'normal' | 'small' | 'large'
    link?: string
    target?: React.HTMLAttributeAnchorTarget
    onClick?: () => void
    color?: 'error' | 'warning' | 'success' | 'info' | 'primary' | 'secondary' | 'tertiary'
    customColor?: Color
    startIcon?: React.ReactElement<IconType>
    endIcon?: React.ReactElement<IconType>
    disabled?: boolean
    id?: string
    type?: string
}
const Button: NextPage<Props> = ({
    variant = 'contained',
    children,
    label,
    size = 'normal',
    link,
    target,
    onClick,
    color = 'primary',
    customColor,
    startIcon,
    endIcon,
    disabled,
    id,
    type
}: Props) => {
    const [buttonColor, setButtonColor] = useState<Color>(Color('#fff'))
    const [buttonSize, setButtonSize] = useState<string>('')

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
                tempSize = variables.largeSize
                break;
            case "normal":
                tempSize = variables.normalSize
                break;
            case "small":
                tempSize = variables.smallSize
                break;
        }
        
        setButtonSize(tempSize)
    }, [children, size, startIcon, endIcon])

    switch (variant) {
        case "contained":
            return (
                <ContainedButton
                    id={id}
                    type={type}
                    label={label}
                    color={buttonColor}
                    size={buttonSize}
                    link={link}
                    target={target}
                    onClick={onClick}
                    startIcon={startIcon}
                    endIcon={endIcon}
                    disabled={disabled}
                >
                    {children}
                </ContainedButton>
            );
        case "outlined":
            return (
                <OutlinedButton 
                    id={id}
                    type={type}
                    label={label}
                    color={buttonColor}
                    size={buttonSize}
                    link={link}
                    target={target}
                    onClick={onClick}
                    startIcon={startIcon}
                    endIcon={endIcon}
                    disabled={disabled}
                >
                    {children}
                </OutlinedButton>
            );
        case "text":
            return  (
                <TextButon
                    id={id}
                    type={type}
                    label={label}
                    color={buttonColor}
                    size={buttonSize}
                    link={link}
                    target={target}
                    onClick={onClick}
                    startIcon={startIcon}
                    endIcon={endIcon}
                    disabled={disabled}
                >
                    {children}
                </TextButon>
            );
    }
}

export default Button