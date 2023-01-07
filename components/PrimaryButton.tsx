import { NextPage } from "next";
import React from "react";
import styles from "@/styles/components/PrimaryButton.module.scss";

type Props = {
  text: string | React.ReactNode;
  onClick?: Function;
  type?: string;
  link?: string;
  disabled?: boolean;
};

const PrimaryButton: NextPage<Props> = ({
  text,
  onClick,
  type,
  link,
  disabled
}: Props) => {


    return (
        <a onClick={() => onClick? onClick() : {}} href={link} className={`${styles.Button} ${type == "left" && styles.Button_left} ${type == "center" && styles.Button_center} ${type == "right" && styles.Button_right}`}
          style={disabled? {"pointerEvents": "none"} : {} }>
            <span className={styles.Button__Text}>{text}</span>
        </a>
    );
};

export default PrimaryButton;