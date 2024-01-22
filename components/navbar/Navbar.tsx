/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "@/styles/components/navbar/Navbar.module.scss";
import Image from "next/image";
import NavItem from "./NavItem";
import Link from "next/link";
import NavDropdown from "./NavDropdown";
import INavLayout from "@/models/navbar/navLayout.model";
import { RiAccountBoxLine, RiAdminLine, RiCamera3Line, RiClipboardLine, RiCloseFill, RiFileList2Line, RiFilePaper2Line, RiHome2Line, RiInformationLine, RiLoginBoxLine, RiLogoutBoxLine, RiMapLine, RiMapPin2Line, RiMenu3Line, RiPriceTag3Line, RiProfileLine, RiQuestionLine, RiTicket2Line, RiUser2Line, RiUserAddLine } from "react-icons/ri";
import useIsMobile from "@/hooks/utils/useIsMobile";
import IconButton from "../button/IconButton";
import { useRouter } from "next/router";
import useTranslate from "@/hooks/translate/useTranslate";
import ReactCountryFlag from "react-country-flag";
import { useWindowSize } from "usehooks-ts";
import ButtonGroup from "../button/ButtonGroup";
import { useUser } from "@/hooks/user/useUser";

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
    const { user, didUserInit, logout } = useUser()
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
            const layout: INavLayout[] = []

            if (didUserInit && !user) {
                layout.push(
                    {
                        title: lang.navReg,
                        link: '/registration',
                        align: 'left',
                        iconPlacement: "right",
                        icon: <RiUserAddLine />,
                    },
                )
            }

            layout.push(
                {
                    title: lang.navEvent,
                    align: 'left',
                    iconPlacement: "right",
                    icon: <RiMapLine />,
                    children: [
                        {
                            title: lang.navPrograms,
                            link: '/programs',
                            iconPlacement: "right",
                            icon: <RiClipboardLine />,
                        },
                        {
                            title: lang.navPrices,
                            link: '/prices',
                            iconPlacement: "right",
                            icon: <RiPriceTag3Line />,
                        },
                        {
                            title: lang.navStaff,
                            link: '/staff',
                            iconPlacement: "right",
                            icon: <RiUser2Line />,
                        },
                        {
                            title: lang.navParticipants,
                            link: '/participants',
                            iconPlacement: "right",
                            icon: <RiFileList2Line />,
                        }
                    ]
                },
                {
                    title: lang.navLocation,
                    align: 'left',
                    iconPlacement: "right",
                    icon: <RiMapPin2Line />,
                },
                {
                    title: lang.navImportant,
                    align: 'left',
                    iconPlacement: "right",
                    icon: <RiInformationLine />,
                    children: [
                        {
                            title: lang.navLegal,
                            link: '/legal',
                            iconPlacement: "right",
                            icon: <RiFilePaper2Line />,
                        },
                        {
                            title: lang.navFaq,
                            link: '/faq',
                            iconPlacement: "right",
                            icon: <RiQuestionLine />,
                        },
                    ]
                },
                {
                    title: lang.navGallery,
                    link: '/gallery',
                    align: 'left',
                    iconPlacement: "right",
                    icon: <RiCamera3Line />
                },
            )


            if (didUserInit && !user) {
                layout.push(
                    {
                        title: lang.navLogin,
                        link: '/login',
                        align: 'right',
                        iconPlacement: "right",
                        icon: <RiLoginBoxLine />
                    },
                )
            }
            else if (didUserInit && user && user.isAdmin) {
                layout.push(
                    {
                        title: lang.navProfile,
                        align: 'right',
                        iconPlacement: "right",
                        icon: <RiProfileLine />,
                        children: [
                            {
                                title: lang.navMe,
                                link: '/profile',
                                iconPlacement: "right",
                                icon: <RiAccountBoxLine />,
                            },
                            {
                                title: lang.navTickets,
                                link: '/profile/tickets',
                                iconPlacement: "right",
                                icon: <RiTicket2Line />,
                            },
                            {
                                title: lang.navRooms,
                                link: '/profile/rooms',
                                iconPlacement: "right",
                                icon: <RiHome2Line />,
                            },
                            {
                                title: lang.navAdmin,
                                link: '/admin',
                                iconPlacement: "right",
                                icon: <RiAdminLine />,
                            },
                            {
                                title: lang.navLogout,
                                iconPlacement: "right",
                                icon: <RiLogoutBoxLine />,
                                click: () => {logout();}
                            },
                        ]
                    },
                )
            }
            else if (didUserInit && user && !user.isAdmin) {
                layout.push(
                    {
                        title: lang.navProfile,
                        align: 'right',
                        iconPlacement: "right",
                        icon: <RiProfileLine />,
                        children: [
                            {
                                title: lang.navMe,
                                link: '/profile',
                                iconPlacement: "right",
                                icon: <RiAccountBoxLine />,
                            },
                            {
                                title: lang.navTickets,
                                link: '/profile/tickets',
                                iconPlacement: "right",
                                icon: <RiTicket2Line />,
                            },
                            {
                                title: lang.navRooms,
                                link: '/profile/rooms',
                                iconPlacement: "right",
                                icon: <RiHome2Line />,
                            },
                            {
                                title: lang.navLogout,
                                iconPlacement: "right",
                                icon: <RiLogoutBoxLine />,
                                click: () => {logout();}
                            },
                        ]
                    },
                )
            }


            if (!isMobile) {
                layout.push(
                    {
                        title: <ReactCountryFlag countryCode={ currLang == "hu"? "gb" : "hu" } svg />,
                        align: 'right',
                        click: () => {changeLang(currLang == "hu"? "en" : "hu")},
                    }
                )
            }

            return layout
        }
    }, [customLayout, lang, isMobile, didUserInit, user])

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
                        onClick={() => setIsOpen(false)}
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
                    <ButtonGroup>
                        <IconButton
                            onClick={() => changeLang(currLang == "hu"? "en" : "hu")}
                            size="large"
                            color="info"
                        >
                            <>
                                <ReactCountryFlag style={{height: "2.8rem"}} countryCode={ currLang == "hu"? "gb" : "hu" } svg />
                            </>
                        </IconButton>
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
                    </ButtonGroup>
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
