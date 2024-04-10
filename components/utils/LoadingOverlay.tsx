import { NextPage } from "next";
import React from "react";
import styles from "@/styles/components/utils/LoadingOverlay.module.scss"
import Color from 'color'
import { LoaderSizeProps } from "react-spinners/helpers/props";

type Props = {
    isLoading: boolean,
    text?: string,
    color?: Color,
    children: React.ReactElement<LoaderSizeProps>
};

const LoadingOverlay: NextPage<Props> = ({isLoading, text, color, children}: Props) => {
    let clr: Color<string> | undefined = undefined
    if (color) clr = Color(color)

    return (
        <div className={`${isLoading? styles.Wrapper : styles.Hidden}`}>
            {isLoading &&
            <div className={styles.Wrapper__Center}>
                {text &&
                    <div className={styles.Loader__Text}>
                        <div className={styles.Text} style={clr? {"color": clr.hex(), "textShadow": `0rem 0rem 1rem rgba(${clr.red()}, ${clr.green()}, ${clr.blue()}, 0.8)`} : {}}>
                            {text}
                        </div>
                    </div>
                }
                <div className={styles.Loader}>
                    {children}
                </div>
            </div>
            }
        </div>
    );
};

export default LoadingOverlay;
