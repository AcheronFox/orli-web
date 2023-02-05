import { NextPage } from "next";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/components/navbar/NavDropDown.module.scss";
import useWindowDimensions from "@/hooks/useWindowDimensions";

type Props = {
  children?: React.ReactNode;
  dropDownName: string;
  classname?: string;
  mainclassname?: string;
  icon?: JSX.Element;
};

const NavDropdown: NextPage<Props> = ({
  children,
  dropDownName,
  mainclassname,
  icon,
}: Props) => {
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const dropDownMenu = useRef<HTMLAnchorElement>(null);
  const { width } = useWindowDimensions();  

  const toggleDropDown = () => {
    setShowDropDown(!showDropDown);
  };

  useEffect(() => {
    const closeDropDownOutside = (e: any) => {
      if (
        dropDownMenu.current !== null &&
        !dropDownMenu.current.contains(e.target)
      ) {
        setShowDropDown(!showDropDown);
      }
    };

    if (showDropDown) {
      document.addEventListener("click", closeDropDownOutside);
    }
    return function cleanup() {
      document.removeEventListener("click", closeDropDownOutside);
    };
  }, [showDropDown]);

  return (
    <>
      <span
        className={`${styles.DropDown} ${mainclassname} ${showDropDown && styles.DropDown__Open}`}
        onClick={() => toggleDropDown()}
        ref={dropDownMenu}
      >
        <div className={styles.DropDown__Content}>
          {icon && <div className={`${styles.DropDown__Content__Icon} ${showDropDown && styles.DropDown__Content__Open}`}>{icon}</div>}
          <span className={`${styles.DropDown__Content__Name} ${showDropDown && styles.DropDown__Content__Open}`}>{dropDownName}</span>
        </div>
        {
          width > parseInt(styles.tinyDesktop) &&
          <div className={`${styles.Menu} ${showDropDown && styles.Menu__Open}`}>
            {children}
          </div>
        }
      </span>
      {
        width <= parseInt(styles.tinyDesktop) &&
        <div className={`${styles.Menu} ${showDropDown && styles.Menu__Open}`}>
          {children}
        </div>
      }
    </>
  );
};

export default NavDropdown;
