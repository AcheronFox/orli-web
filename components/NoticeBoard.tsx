import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import styles from "@/styles/components/NoticeBoard.module.scss";
import Color from "color";
import variables from "@/styles/abstracts/exports.module.scss"
import { RiAlertLine, RiCheckboxCircleLine, RiErrorWarningLine, RiInformationLine } from "react-icons/ri";

type Props = {
    children?: string | React.ReactNode
    title?: string | React.ReactNode
    type?: 'error' | 'warning' | 'info' | 'success'
    variant?: 'contained' | 'outlined' | 'simple' | 'filled'
    size?: "large" | "normal" | "small"
    shadowEnabled?: boolean
    customTitleClass?: string
    customBodyClass?: string
};

const NoticeBoard: NextPage<Props> = ({
    children,
    title,
    size = "normal",
    type = 'info',
    variant = 'contained',
    shadowEnabled,
    customTitleClass,
    customBodyClass,
}: Props) => {
    const [icon, setIcon] = useState<React.ReactElement>()
    const [color, setColor] = useState<Color>(Color('#fff'))

    useEffect(() => {
        let tempColor: Color;
        let tempIcon: React.ReactElement;
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

        switch(type) {
            case "error":
                tempColor = Color(variables.errorColor.toString())
                tempIcon = <RiErrorWarningLine color={variables.errorColor} size={tempSize} />
                break;
            case "warning":
                tempColor = Color(variables.warningColor.toString())
                tempIcon = <RiAlertLine color={variables.warningColor} size={tempSize} />
                break;
            case "info":
                tempColor = Color(variables.infoColor.toString())
                tempIcon = <RiInformationLine color={variables.infoColor} size={tempSize} />
                break;
            case "success":
                tempColor = Color(variables.successColor.toString())
                tempIcon = <RiCheckboxCircleLine color={variables.successColor} size={tempSize} />
                break;
        }
        
        setColor(tempColor)
        setIcon(tempIcon)
    }, [type, size])

    return (
        <div
            className={`
                ${styles.NoticeBoard}
                ${variant == "outlined"? styles.NoticeBoard_Outlined : ''}
                ${variant == "contained"? styles.NoticeBoard_Contained : ''} 
                ${variant == "filled"? styles.NoticeBoard_Filled : ''}
                ${shadowEnabled? styles.NoticeBoard__Shadow : ''}
            `}
            style={variant=="contained"? {
                background: `linear-gradient(135deg,${color.hex()}40, transparent)`
            }: {}}
        >
            <div className={styles.NoticeBoard__Head}>
                {
                    (icon != undefined) &&
                    <div className={styles.NoticeBoard__Icon}>
                        {icon}
                    </div>
                }
                {
                    (title != undefined) &&
                    <div className={`
                        ${styles.NoticeBoard__Title}
                        ${customTitleClass? customTitleClass : ''}
                    `}>
                        {title}
                    </div>
                }
            </div>
            <div className={`
                ${styles.NoticeBoard__Body}
                ${customBodyClass? customBodyClass : ''}
            `}>
                <div className={styles.NoticeBoard__Content}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default NoticeBoard;