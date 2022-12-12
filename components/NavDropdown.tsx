import { NextPage } from "next";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/components/navbar/NavDropDown.module.scss";

type Props = {
  children?: React.ReactNode;
  dropDownName: string;
  classname?: string;
  classnameItems?: string;
  mainclassname?: string;
  icon?: JSX.Element;
};

const NavDropdown: NextPage<Props> = ({
  children,
  dropDownName,
  classnameItems,
  mainclassname,
  icon,
}: Props) => {
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const dropDownMenu = useRef<HTMLAnchorElement>(null);

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
    <div className={styles.Wrapper}>
      <span
        className={`${styles.DropDown} ${mainclassname} ${showDropDown && styles.MainOpen}`}
        onClick={(e) => toggleDropDown()}
        ref={dropDownMenu}
      >
        <div className={styles.ContentWrapper}>
          {icon && <div className={`${styles.IconWrapper} ${showDropDown && styles.MainOpen}`}>{icon}</div>}
          <span className={`${classnameItems} ${showDropDown && styles.MenuOpen}`}>
            <span className={`${styles.Name}`}>{dropDownName}</span>
          </span>
        </div>
      </span>
      {true && (
        <div className={`${styles.DropDownMenu} ${showDropDown && styles.MenuOpen}`}>
          {children}
        </div>
      )}
    </div>
  );
};

export default NavDropdown;
