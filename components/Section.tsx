import { NextPage } from "next";
import React from "react";
import styles from "@/styles/components/Section.module.scss"

type Props = {
    id?: string;
    title?: string;
    text?: string | React.ReactNode;
    children?: React.ReactNode;
};

const Section: NextPage<Props> = (props: Props) => {

  return (
    <section className={styles.Section} id={props.id}>
        {props.title && <h2 className={styles.Section__Title}>{props.title}</h2>}
        {props.text && <p className={styles.Section__Text}>{props.text}</p>}
        {props.children && <div className={props.text? styles.Section__Border : ''}>
            {props.children}
        </div>}
        <div className={styles.Shadow__1}>
            <div className={styles.Shadow__2}>
                <div className={styles.Shadow__3}>
                    <div className={styles.Shadow__4}>
                        <div className={styles.Shadow__5}>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default Section;