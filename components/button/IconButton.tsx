/* eslint-disable react-hooks/exhaustive-deps */
import Color from "color";
import { NextPage } from "next";
import Link from "next/link";
import React, { Attributes, ForwardedRef, forwardRef, useEffect, useRef, useState } from "react";
import variables from "@/styles/abstracts/exports.module.scss"
import { IconType } from "react-icons/lib";
import styles from "@/styles/components/button/IconButton.module.scss"
import useRipple from "@/hooks/utils/useRipple";
import useIsMobile from "@/hooks/utils/useIsMobile";

type Props = {
    children: React.ReactElement<IconType>
    size?: 'normal' | 'small' | 'large' | string
    tooltip?: string
    link?: string
    target?: React.HTMLAttributeAnchorTarget
    onClick?: () => void
    color?: 'error' | 'warning' | 'success' | 'info' | 'primary' | 'secondary' | 'tertiary'
    customColor?: Color
    disabled?: boolean
    tooltipColor?: 'white' | 'black'
    tooltipVariant?: 'default' | 'internal'
    variant?: 'basic' | 'outlined' | 'contained'
}


type TooltipProps = {
    variant: 'default' | 'internal'
    color: 'white' | 'black'
    text: string
    buttonColor?: Color
    forceOpen?: boolean
}


const Tooltip = forwardRef<HTMLSpanElement, TooltipProps>(({
    variant,
    color,
    text,
    buttonColor,
    forceOpen,
}, ref) => {

    return (
        <span
            ref={ref}
            className={`
                ${styles.IconButton__Tooltip}
                ${(variant=='internal')? styles.IconButton__Tooltip__Internal : ''}
                ${forceOpen? styles.IconButton__Tooltip__Open : ''}
                ${(forceOpen&&(variant=='internal'))? styles.IconButton__Tooltip__Internal__Open : ''}
            `}
            style={{
                background: (variant=="internal")? '' : buttonColor?.hex(),
                color: color
            }}
        >
            {text}
        </span>
    )
})
Tooltip.displayName = "Tooltip"


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
    tooltipColor = "white",
    tooltipVariant = "default",
    variant = "basic"
}: Props) =>{
    const isMobile = useIsMobile()

    const [buttonColor, setButtonColor] = useState<Color>()
    const [icon, setIcon] = useState<React.ReactElement<IconType>>()
    const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false)
    const buttonRef = useRef<any>(null)
    const tooltipRef = useRef<any>(null)
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
            default:
                tempSize = size? size : variables.normalIconSize
        }

        const element = React.cloneElement(children, {size: tempSize} as Partial<IconType> & Attributes)
        setIcon(element)
    }, [children, size])

    useEffect(() => {
        if (!link && !onClick) {
            throw new Error("Icon Button Action missing")
        }   
    }, [link, onClick])

    
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (!isMobile || !tooltip) {
            if (onClick) onClick()
            return
        }
        else if (isMobile) {
            if (!isTooltipOpen) {
                e.preventDefault()
                setIsTooltipOpen(true)
            }
            else {
                setIsTooltipOpen(false)
            }
        }
    }

    useEffect(() => {    
        const closeTooltip = (e: any) => {
            console.log(tooltipRef)
            if (
                (buttonRef.current != null && !buttonRef.current.contains(e.target))
                && (tooltipRef.current != null && !tooltipRef.current.contains(e.target))
            ) {
                setIsTooltipOpen(!isTooltipOpen);
            }
        };
    
        if (isTooltipOpen) {
            document.addEventListener("click", closeTooltip);
            return function cleanup() {
                document.removeEventListener("click", closeTooltip);
            };
        }
        return function cleanup() {
            document.removeEventListener("click", closeTooltip);
            return function cleanup() {
                document.removeEventListener("click", closeTooltip);
            };
        };
    }, [isTooltipOpen]);


    if (link) {
        return (
            <div
                className={`
                    ${styles.IconButton}
                `}
            >
                {
                    (tooltip != undefined && tooltipVariant == "default") &&
                    <Tooltip 
                        variant={"default"}
                        color={tooltipColor}
                        buttonColor={buttonColor}
                        text={tooltip}
                        forceOpen={isTooltipOpen}
                        ref={tooltipRef}
                    />
                }
                <Link
                    ref={buttonRef}
                    href={link}
                    target={target}
                    onClick={(e) => handleClick(e)}
                    className={`
                        ${styles.IconButton__Button}
                        ${(variant == "outlined")? styles.IconButton__Button_Outlined : ''}
                        ${(variant == "contained")? styles.IconButton__Button_Contained : ''}
                        ${disabled? styles.IconButton__Disabled : ''}
                    `}
                >
                    {
                        (tooltip != undefined && tooltipVariant == "internal") &&
                        <Tooltip 
                            variant={"internal"}
                            color={tooltipColor}
                            buttonColor={buttonColor}
                            text={tooltip}
                            forceOpen={isTooltipOpen}
                            ref={tooltipRef}
                        />
                    }
                    <span
                        style={{color: buttonColor?.hex()}}
                        className={styles.IconButton__Icon}
                    >
                        {icon}
                    </span>
                    {ripples}
                </Link>
            </div>
        );
    }
    else {
        return (
            <div
                className={`
                    ${styles.IconButton}
                `}
            >
                {
                    (tooltip != undefined && tooltipVariant == "default") &&
                    <Tooltip 
                        variant={"default"}
                        color={tooltipColor}
                        buttonColor={buttonColor}
                        text={tooltip}
                        forceOpen={isTooltipOpen}
                        ref={tooltipRef}
                    />
                }
                <button
                    ref={buttonRef}
                    onClick={(e) => handleClick(e)}
                    className={`
                        ${styles.IconButton__Button}
                        ${(variant == "outlined")? styles.IconButton__Button_Outlined : ''}
                        ${(variant == "contained")? styles.IconButton__Button_Contained : ''}
                        ${disabled? styles.IconButton__Disabled : ''}
                    `}
                >
                    {
                        (tooltip != undefined && tooltipVariant == "internal") &&
                        <Tooltip 
                            variant={"internal"}
                            color={tooltipColor}
                            buttonColor={buttonColor}
                            text={tooltip}
                            forceOpen={isTooltipOpen}
                            ref={tooltipRef}
                        />
                    }
                    <span
                        style={{color: buttonColor?.hex()}}
                        className={styles.IconButton__Icon}
                    >
                        {icon}
                    </span>
                    {ripples}
                </button>
            </div>
        );
    }
}

export default IconButton