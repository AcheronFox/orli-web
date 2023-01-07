import { NextPage } from "next";
import React, { useState } from "react";
import styles from "@/styles/components/Infopanel.module.scss";

type Props = {
  children: React.ReactNode;
  title: string;
};

const Infopanel: NextPage<Props> = ({
  children,
  title,
}: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const Toggle = () => {
    setIsOpen((o) => !o);
  };

  return (
    <div className={styles.InfoPanel}>
        <div className={`${styles.InfoPanel__Title} ${isOpen && styles.InfoPanel__OpenTitle}`} onClick={() => Toggle()}>
          {title}
        </div>
      <div
        className={`${styles.InfoPanel__Content} ${isOpen && styles.InfoPanel__Open}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Infopanel;
