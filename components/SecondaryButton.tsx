import { NextPage } from "next";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/components/SecondaryButton.module.scss";
import Link from "next/link";

type Props = {
  text: string | React.ReactNode;
  onClick?: Function;
  link?: string;
  type?: string;
  id?: string;
  children?: React.ReactElement
  disabled?: boolean
  classType?: 'danger' | 'success'
};

const SecondaryButton: NextPage<Props> = ({
  text,
  onClick,
  type,
  link,
  id,
  children,
  disabled,
  classType
}: Props) => {
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


    if (type == 'label') {
      return (
        <label className={`${styles.Button}`} htmlFor={id} onMouseMove={handleMouseMove} onMouseOut={handleMouseOut}>
          <span className={styles.Button__Text}>{text}</span>
          {children}
        </label>
      );
    }
    else if (link) {
      return (
        <Link id={id} href={link} onMouseMove={(e) => handleMouseMove(e)} onMouseLeave={(e) => handleMouseOut(e)} 
          className={`${styles.Button} ${type == "left" && styles.Button_left} ${type == "center" && styles.Button_center} ${type == "right" && styles.Button_right} ${classType && styles.Button__Disabled}
            ${disabled && styles.Button__Disabled}
            ${classType == "danger" && styles.Button_danger} ${classType == "success" && styles.Button_success}`}>
          <span className={styles.Button__Text}>{text}</span>
        </Link>
      );
      
    } else {
      return (
        <button disabled={disabled} id={id} onMouseMove={(e) => handleMouseMove(e)} onMouseLeave={(e) => handleMouseOut(e)} onClick={onClick? () => onClick() : () => {}}
          className={`${styles.Button} ${type == "left" && styles.Button_left} ${type == "center" && styles.Button_center} ${type == "right" && styles.Button_right}
            ${disabled && styles.Button__Disabled}
            ${classType == "danger" && styles.Button_danger} ${classType == "success" && styles.Button_success}`}>
          <span className={styles.Button__Text}>{text}</span>
        </button>
      );
    }
};

export default SecondaryButton;