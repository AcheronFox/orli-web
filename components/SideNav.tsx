/* eslint-disable react-hooks/exhaustive-deps */
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import styles from "@/styles/components/navbar/Navbar.module.scss";
import DropDownStyle from "@/styles/components/navbar/NavDropDown.module.scss";
import NavItemStyle from "@/styles/components/navbar/NavItems.module.scss";
import NavDropdown from "./NavDropdown";
import NavItem from "./NavItem";
import { useTranslate } from "@/hooks/useTranslate";

import { RiUserAddLine, RiLoginBoxLine, RiInformationLine, RiMapPin2Line, RiMapLine, RiCloseFill, RiHome2Line, RiCamera3Line, RiMenuLine } from "react-icons/ri";
import ReactCountryFlag from "react-country-flag"

import { SingletonRouter, withRouter } from "next/router";
import Link from "next/link";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import { useUser } from "@/hooks/useUser";

type Props = {
  router: SingletonRouter;
};

const Navbar: NextPage<Props> = (props: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { user, logout } = useUser()
  const { width } = useWindowDimensions();

  const { t, changeLanguage, locale } = useTranslate();
  const routerPath = props.router.asPath;

  const evalRoute = (route: string, type = "dropDown") => {
    if (type == "dropDown") {
      return routerPath == route && NavItemStyle.Active;
    } else {
      return routerPath.includes(route) && DropDownStyle.MainActive;
    }
  };

  const toggleNavBar = () => {
    if (width > parseInt(styles.tinyDesktop)) {
      setIsOpen(true)
    }
    else {
      setIsOpen((o) => !o);
    }
  }

  useEffect(() => {
    if (width > parseInt(styles.tinyDesktop)) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }, [width])

  return (
    <nav className={styles.nav}>
      {
        width != 0 && width <= parseInt(styles.tinyDesktop) &&
        <div className={`${styles.MainButtonWrapper} ${isOpen && styles.MainButtonClosed}`}>
          <button
            className={styles.MainButton}
            onClick={() => toggleNavBar()}
          >
            <RiMenuLine/>
          </button>
        </div>
      }
      <div className={`${styles.ItemWrappers} ${!isOpen && styles.BarClosed}`}>
        <div className={`${styles.ItemContainer}`}>
          <div className={styles.TopContainer}>
            {
              width != 0 && width <= parseInt(styles.tinyDesktop) &&
              <button
                className={styles.CloseBtn}
                onClick={() => toggleNavBar()}
              >
                <RiCloseFill/>
              </button>
            }
            <Link href={"/"} className={styles.HomeBtn} onClick={() => toggleNavBar()}>
              <RiHome2Line/>
            </Link>
            <button
              className={styles.LanguageChanger}
              onClick={() => changeLanguage(locale == "en" ? "hu" : "en")}
            > 
              <ReactCountryFlag countryCode={ locale == "hu"? "gb" : "hu" } svg />
            </button>
          </div>

          {!user && (
            <NavItem
              link="/login"
              shouldOverwrite={false}
              CustomStyle={`${evalRoute("/login", "item")}`}
              icon={<RiLoginBoxLine />}
              onClick={() => toggleNavBar()}
            >
              {t("navSignIn")}
            </NavItem>
          )}
          {user && (
            <NavDropdown
              mainclassname={`${evalRoute("/profile", "contain")}`}
              dropDownName={t("navProfile")}
            >
              <NavItem
                link="/profile"
                CustomStyle={`${DropDownStyle.Item} ${evalRoute("/profile")}`}
                onClick={() => toggleNavBar()}
              >
                {t("navProfile")}
              </NavItem>
              {
                !(user.TicketKey && user.isPaid) &&
                <NavItem
                  link="/profile/tickets"
                  CustomStyle={`${DropDownStyle.Item} ${evalRoute("/profile/tickets")}`}
                  onClick={() => toggleNavBar()}
                >
                  {t("navTickets")}
                </NavItem>
              }
              {
                ((user.TicketKey != null && user.isPaid && user.ticketType === '2')) &&
                <NavItem
                  link="/profile/rooms"
                  CustomStyle={`${DropDownStyle.Item} ${evalRoute("/profile/rooms")}`}
                  onClick={() => toggleNavBar()}
                >
                  {t("navRooms")}
                </NavItem>
              }
              {user.isAdmin == true &&
                <NavItem
                  link="/admin"
                  CustomStyle={`${DropDownStyle.Item} ${evalRoute("/admin", 'contain')}`}
                  onClick={() => toggleNavBar()}
                >
                  {t("navAdmin")}
                </NavItem>
              }
              <NavItem
                onClick={async () => {await logout(); toggleNavBar();}}
                CustomStyle={`${DropDownStyle.Item} ${DropDownStyle.LogoutButton}`}
                
              >
                {t("navLogout")}
              </NavItem>
            </NavDropdown>
          )}

          <NavItem
            link="/registration"
            shouldOverwrite={false}
            CustomStyle={`${evalRoute("/registration", "item")}`}
            icon={<RiUserAddLine />}
            onClick={() => toggleNavBar()}
          >
            {t("navRegistration")}
          </NavItem>

          <NavDropdown
            dropDownName={t("navEvent")}
            mainclassname={`${evalRoute("/programs")} ${evalRoute("/prices")} ${evalRoute("/staff")} ${evalRoute("/participants")}`}
            icon={<RiMapLine />}
          >
            <NavItem
              link="/programs"
              CustomStyle={`${DropDownStyle.Item} ${evalRoute("/programs", "dropdown")}`}
              onClick={() => toggleNavBar()}
            >
              {t("navPrograms")}
            </NavItem>
            <NavItem
              link="/prices"
              CustomStyle={`${DropDownStyle.Item} ${evalRoute("/prices")}`}
              onClick={() => toggleNavBar()}
            >
              {t("navPrices")}
            </NavItem>
            <NavItem
              link="/staff"
              CustomStyle={`${DropDownStyle.Item} ${evalRoute("/staff")}`}
              onClick={() => toggleNavBar()}
            >
              {t("navStaff")}
            </NavItem>
            <NavItem
              link="/participants"
              CustomStyle={`${DropDownStyle.Item} ${evalRoute("/participants")}`}
              onClick={() => toggleNavBar()}
            >
              {t("navParticipants")}
            </NavItem>
          </NavDropdown>

          <NavDropdown
            dropDownName={t("navLocation")}
            mainclassname={`${evalRoute("/location", "contain")}`}
            icon={<RiMapPin2Line />}
          >
            <NavItem
              link="/location#accomodation"
              CustomStyle={`${DropDownStyle.Item} ${evalRoute("/location#accomodation")}`}
              onClick={() => toggleNavBar()}
            >
              {t("navAccom")}
            </NavItem>
            <NavItem
              link="/location#route"
              CustomStyle={`${DropDownStyle.Item} ${evalRoute("/location#route")}`}
              onClick={() => toggleNavBar()}
            >
              {t("navGetting")}
            </NavItem>
            <NavItem
              link="/location#poi"
              CustomStyle={`${DropDownStyle.Item} ${evalRoute("/location#poi")}`}
              onClick={() => toggleNavBar()}
            >
              {t("navPoi")}
            </NavItem>
          </NavDropdown>

          <NavDropdown
            dropDownName={t("navImportant")}
            mainclassname={`${evalRoute("/legal", "contain")} ${evalRoute("/faq")}`}
            icon={<RiInformationLine />}
          >
            <NavItem
              link="/legal"
              CustomStyle={`${DropDownStyle.Item} ${evalRoute("/legal/data")} ${evalRoute("/legal/rules")} ${evalRoute("/legal/tos")}`}
              onClick={() => toggleNavBar()}
            >
              {t("navLegal")}
            </NavItem>
            <NavItem
              link="/faq"
              CustomStyle={`${DropDownStyle.Item} ${evalRoute("/faq")}`}
              onClick={() => toggleNavBar()}
            >
              {t("navFaq")}
            </NavItem>
          </NavDropdown>

          <NavItem
              link="/gallery"
              shouldOverwrite={false}
              CustomStyle={`${evalRoute("/gallery", "item")}`}
              icon={<RiCamera3Line />}
              onClick={() => toggleNavBar()}
            >
              {t("navGallery")}
            </NavItem>
        </div>
      </div>
    </nav>
  );
};

export default withRouter(Navbar);
