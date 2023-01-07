import { NextPage } from "next";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/components/SecondaryButton.module.scss";

type Props = {
  text: string | React.ReactNode;
  onClick: Function;
  type?: string;
};

const SecondaryButton: NextPage<Props> = ({
  text,
  onClick,
  type
}: Props) => {
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleMouseMove = (e: any) => {
        const bounds = e.target.getBoundingClientRect();
        const x = e.clientX - bounds.left;
        const y = e.clientY - bounds.top;

	    e.target.style.setProperty('--x', `${ x }px`)
	    e.target.style.setProperty('--y', `${ y }px`)
    };

    const handleMouseOut = (e: any) => {
        e.target.style.setProperty('--x', `50%`)
	    e.target.style.setProperty('--y', `50%`)
    }

    return (
        <button onMouseMove={(e) => handleMouseMove(e)} onMouseLeave={(e) => handleMouseOut(e)} ref={buttonRef} onClick={() => onClick()}
            className={`${styles.Button} ${type == "left" && styles.Button_left} ${type == "center" && styles.Button_center} ${type == "right" && styles.Button_right}`}>
            <span className={styles.Button__Text}>{text}</span>
        </button>
    );
};

export default SecondaryButton;