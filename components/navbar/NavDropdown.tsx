/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useRef, useState } from "react"
import styles from "@/styles/components/navbar/NavDropdown.module.scss"
import { RiArrowDownSFill } from "react-icons/ri";
import { IconType } from "react-icons/lib";
import useIsMobile from "@/hooks/utils/useIsMobile";
import useRipple from "@/hooks/utils/useRipple";

interface Props {
    children: React.ReactNode
    title: string | React.ReactNode
    icon?: React.ReactElement<IconType>
    iconPlacement?: 'left' | 'right' | 'both'
}

const NavDropdown = ({
    children,
    title,
    icon,
    iconPlacement = 'left',
    }: Props) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const isMobile = useIsMobile(true)
    const RefDropDown = useRef<HTMLDivElement>(null)
    const panelRef = useRef<HTMLDivElement>(null)
    const navbar = (typeof window !== 'undefined')? document.getElementById('navbar') : null
    const titleRef = useRef<HTMLDivElement>(null)
    const ripples = useRipple(titleRef)
    const navbarHeight = useMemo<number>(() => {
        if (!navbar) return 0
        else {
            return navbar.clientHeight
        }
    }, [navbar])
    const panelHeight = useMemo<number>(() => {
        if (!panelRef.current || !children) return 0
        else {
            return isOpen? panelRef.current.scrollHeight : 0
        }
    }, [panelRef, isOpen, children])

    const ClickOutside = (e: UIEvent) => {
        if (RefDropDown.current && !RefDropDown.current.contains(e.target as Node)) {
            setIsOpen(false);
        }
    }

    useEffect(() => {
        window.addEventListener("click", ClickOutside);

        return () => {
            window.removeEventListener("click", ClickOutside);
        }
    }, [])

    return (
        <>
            <div
                className={`
                    ${styles.NavDropdown} ${isOpen ? styles.NavDropdown__Active : ""}
                `}
                ref={RefDropDown}
            >
                <div
                    ref={titleRef}
                    className={styles.NavDropdown__Title}
                    onClick={() => setIsOpen(o => !o)}
                >
                    {ripples}
                    <span className={styles.NavDropdown__Label}>
                        {
                            (icon != undefined && (iconPlacement == 'both' || iconPlacement == 'left')) &&
                            icon
                        }
                        <span>{title}</span>
                        {
                            (icon != undefined && (iconPlacement == 'both' || iconPlacement == 'right')) &&
                            icon
                        }
                    </span>
                    <RiArrowDownSFill
                        className={isOpen ? styles.NavDropdown__Title__Open : styles.NavDropdown__Title__Closed}
                        size={24}
                    />
                </div>
                {
                    (isMobile == false) &&
                    <div
                        ref={panelRef}
                        className={`${styles.NavDropdown__SubItems}`}
                        style={{top: navbarHeight, height: panelHeight}}
                    >
                        {children}
                    </div>
                }
            </div>
            {
                (isMobile == true) &&
                <div
                    ref={panelRef}
                    className={`${styles.NavDropdown__SubItems}`}
                    style={{top: 0, minHeight: panelHeight}}
                >
                    {children}
                </div>
            }
        </>
    )
};

export default NavDropdown;
