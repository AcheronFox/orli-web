/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "@/styles/components/navbar/Navbar.module.scss";
import Image from "next/image";
import NavItem from "./NavItem";
import Link from "next/link";
import NavDropdown from "./NavDropdown";
import INavLayout from "@/models/navbar/navLayout.model";
import { RiCloseFill, RiLoginBoxLine, RiMenu3Line } from "react-icons/ri";
import useIsMobile from "@/hooks/utils/useIsMobile";
import IconButton from "../button/IconButton";
import { useRouter } from "next/router";
import useTranslate from "@/hooks/translate/useTranslate";
import ReactCountryFlag from "react-country-flag";
import { useWindowSize } from "usehooks-ts";

interface Props {
    brandImageSrc: string
    customBrandClass?: string
    customLayout?: INavLayout[]
}

const Navbar = ({
    brandImageSrc,
    customBrandClass,
    customLayout
    }: Props) => {
    const isMobile = useIsMobile()
    const { lang, currLang, changeLang } = useTranslate()
    const router = useRouter()
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const navbar = (typeof window !== 'undefined')? document.getElementById('navbar') : null
    const itemsRef = useRef<any>(null)
    const size = useWindowSize()

    const navbarHeight = useMemo<number>(() => {
        if (!navbar) return 0
        else {
            return navbar.clientHeight
        }
    }, [navbar, size])

    const layout = useMemo<INavLayout[]>(() => {
        if (customLayout) return customLayout
        else {
            return [
                {
                    title: lang.navReg,
                    link: '/registration',
                    align: 'left',
                },
                {
                    title: "Nav Item 2",
                    link: 'test2',
                    align: 'left',
                },
                {
                    title: "Dropdown Items",
                    align: 'left',
                    children: [
                        {
                            title: "Dropdown Item 1",
                            link: 'dropdown 1',
                        },
                        {
                            title: "Dropdown Item 2",
                            link: 'dropdown 2',
                        },
                        {
                            title: "Dropdown Item 3",
                            link: 'dropdown 3',
                        }
                    ]
                },
                {
                    title: "Dropdown Items",
                    align: 'left',
                    children: [
                        {
                            title: "Dropdown Item 1",
                            link: 'dropdown 1',
                        },
                        {
                            title: "Dropdown Item 2",
                            link: 'dropdown 2',
                        },
                        {
                            title: "Dropdown Item 3",
                            link: 'dropdown 3',
                        }
                    ]
                },
                {
                    title: lang.navLogin,
                    link: '/login',
                    align: 'right',
                    iconPlacement: "right",
                    icon: <RiLoginBoxLine />
                },
                {
                    title: <ReactCountryFlag countryCode={ currLang == "hu"? "gb" : "hu" } svg />,
                    align: 'right',
                    click: () => {changeLang(currLang == "hu"? "en" : "hu")},
                },
            ]
        }
    }, [customLayout, lang])

    const renderItems = (
        items: INavLayout[],
        align?: 'left' | 'right' | 'center',
        isMain = true
        ) => {

        const filtered = (isMain && align)
        ? items.filter((o) => o.align? o.align == align : o)
        : items;

        return filtered.map((item, i) => {
            if (item.children?.length) {
                return (
                    <NavDropdown
                        key={i}
                        title={item.title}
                        icon={item.icon}
                        iconPlacement={item.iconPlacement}
                    >
                        {renderItems(item.children, align, false)}
                    </NavDropdown>
                );
            }
            else {
                return (
                    <NavItem
                        key={i}
                        linkTo={item.link || ''}
                        isDropDownItem={!isMain}
                        icon={item.icon}
                        iconPlacement={item.iconPlacement}
                        target={item.target}
                        click={item.click}
                    >
                        {item.title}
                    </NavItem>
                );
            }
        })
    }

    useEffect(() => {
        if (isOpen) setIsVisible(true)
        else {
            setTimeout(() => {
                setIsVisible(false)
            }, 250)
        }
    }, [isOpen])

    useEffect(() => {
        if (!isMobile) setIsOpen(false)
    }, [isMobile])

    useEffect(() => {
        if (isMobile) setIsOpen(false)
    }, [router.asPath])

    return (
        <nav className={styles.Navbar} id="navbar">
            <Link href="/" className={`${styles.Navbar__BrandImage} ${customBrandClass || ""}`}>
                <Image src={brandImageSrc} alt="Brand Logo" sizes="7.375em" width="0" height="0"/>
            </Link>
            {
                (isMobile == true)?
                <div className={styles.Navbar__Body}>
                    <IconButton
                        onClick={() => setIsOpen(!isOpen)}
                        size="large"
                        color="info"
                    >
                        {
                            (isOpen)?
                            <RiCloseFill />
                            :
                            <RiMenu3Line />
                        }
                    </IconButton>
                    <div
                        ref={itemsRef}
                        className={`
                            ${styles.Navbar__Body__Items}
                            ${isOpen? styles.Navbar__Body__Items__Open : ''}
                        `}
                        style={{
                            top: navbarHeight,
                            visibility: isVisible? "visible" : "hidden"
                        }}
                    >
                        {
                            renderItems(layout)
                        }
                    </div>
                </div>
                :
                <div className={styles.Navbar__Body}>
                    <div className={styles.Navbar__Body__Left}>
                        {
                            renderItems(layout, 'left')
                        }
                    </div>
                    <div className={styles.Navbar__Body__Center}>
                        {
                            renderItems(layout, 'center')
                        }
                    </div>
                    <div className={styles.Navbar__Body__Right}>
                        {
                            renderItems(layout, 'right')
                        }
                    </div>
                </div>
            }
        </nav>
    )
};

export default Navbar;
