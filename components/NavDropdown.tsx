import { NextPage } from "next";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/components/navbar/NavDropDown.module.scss";

type Props = {
  children?: React.ReactNode;
  dropDownName: string;
  Icon?: React.ReactNode;
  classname?: string;
  classnameItems?: string;
  mainclassname?: string;
};

const NavDropdown: NextPage<Props> = ({
  children,
  dropDownName,
  Icon,
  classnameItems,
  mainclassname,
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
    <span
      className={`${styles.DropDown} ${mainclassname}`}
      onClick={(e) => toggleDropDown()}
      ref={dropDownMenu}
    >
      <span className={classnameItems}>
        <span className={styles.Name}>{dropDownName}</span>
        <span>{Icon}</span>
      </span>
      {
        <div
          className={`${styles.DropDownMenu} ${
            showDropDown && styles.MenuOpen
          }`}
        >
          {children}
        </div>
      }
    </span>
  );
};

export default NavDropdown;
