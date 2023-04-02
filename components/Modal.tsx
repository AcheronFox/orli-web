import { NextPage } from "next";
import React from "react";
import styles from "@/styles/components/Modal.module.scss";

type Props = {
  children?: React.ReactNode
};

// TODO

const Modal: NextPage<Props> = ({
  children,
}: Props) => {

    return (
        <div className={styles.Modal}>
            {children}
        </div>
    );
};

export default Modal;