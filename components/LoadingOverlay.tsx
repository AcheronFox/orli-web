import { NextPage } from "next";
import React from "react";
import styles from "@/styles/components/LoadingOverlay.module.scss"
import Color from 'color'

type Props = {
    isLoading: boolean,
    message?: string,
    color?: string,
    animDuration?: string,
};

const LoadingOverlay: NextPage<Props> = ({isLoading, message, color, animDuration}: Props) => {
    let clr: Color<string> | undefined = undefined
    if (color) clr = Color(color)

    return (
        <div className={`${isLoading? styles.Wrapper : styles.Hidden}`}>
            {isLoading &&
            <div className={styles.Wrapper__Center}>
                {message &&
                    <div className={styles.Loader__Text}>
                        <div className={styles.Text} style={clr? {"color": clr.hex(), "textShadow": `0rem 0rem 1rem rgba(${clr.red()}, ${clr.green()}, ${clr.blue()}, 0.8)`} : {}}>
                            {message}
                        </div>
                    </div>
                }
                <div className={styles.Loader}>
                    {Array(9).fill(1).map((el, i) =>
                        <div key={i} style={clr? {"backgroundColor": clr.hex(), "boxShadow": `0 0 2rem .1rem ${clr.hex()}`,"animationDuration": animDuration} : {}}></div>
                    )}        
                </div>
            </div>
            }
        </div>
    );
};

export default LoadingOverlay;
