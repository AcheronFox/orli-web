import { NextPage } from "next";
import React from "react";
import styles from "@/styles/components/Separator.module.scss";


type Props = {
  IconComp: JSX.Element,
  placement?: "left" | "right" | "both";
  text: string;
};

const Separator: NextPage<Props> = ({
  IconComp,
  placement = "both",
  text,
}: Props) => {
  const iconWrapper = () => (<div className={styles.Separator__Center__Icon}>{IconComp}</div>)

  return (
    <div className={`${styles.Separator}`}>
      <div className={styles.Separator__Left}></div>
      <div className={styles.Separator__Center}>
         <>
         {(placement == "left" || placement == "both")
         && iconWrapper()}
         </>
        <span>{text}</span>
         <>
         {(placement == "right" || placement == "both")
         && iconWrapper()}
         </>
      </div>
      <div className={styles.Separator__Right}></div>
    </div>
  );
};

export default Separator;
