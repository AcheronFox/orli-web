/* eslint-disable react-hooks/exhaustive-deps */
import { NextPage } from "next";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/components/CustomBackground.module.scss"
import UseWindowDimensions from "@/hooks/useWindowDimensions";

type Props = {
    numberOfParticles?: number
}

const CustomBackground: NextPage<Props> = (props: Props) => {
    const size = UseWindowDimensions();
    const bottomRef = useRef<any>()
    const [doRender, setDoRender] = useState<boolean>(false)

    const vh = (v: number) => {
        const h = size.height;
        return (v * h) / 100;
    };

    useEffect(() => {
        const footer = document.getElementById('footer');
        if (footer && bottomRef.current) {
            const footerHeight = footer.getBoundingClientRect().height
            bottomRef.current.style.setProperty('--start', `${ vh(25) + footerHeight }px`)
            bottomRef.current.style.setProperty('--end', `${ vh(25) }px`)
        }
      }, [size.height, bottomRef]);
    
    useEffect(() => {
        if (size.width > parseInt(styles.phone)) {
            setDoRender(true)
        } else {
            setDoRender(false)
        }
    }, [size.width])

    return (
        <> 
            <div className={styles.Gradient}></div>
            <div className={styles.Gradient__Bottom} ref={bottomRef}></div>
            <div>
                {
                    (doRender == true) &&
                    Array(props.numberOfParticles? props.numberOfParticles : 20).fill(1).map((el, i) =>
                    <div key={i} className={styles.Background}>
                        <div className={styles.Particle} ></div>
                    </div>
                    )
                }
            </div>
        </>
        
    );
};

export default CustomBackground;