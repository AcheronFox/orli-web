/* eslint-disable react-hooks/exhaustive-deps */
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import styles from "@/styles/components/navbar/Navbar.module.scss";
import DropDownStyle from "@/styles/components/navbar/NavDropDown.module.scss";
import NavItemStyle from "@/styles/components/navbar/NavItems.module.scss";
import axiosInstance from "../utils/axiosConfig";
import NavDropdown from "./NavDropdown";
import NavItem from "./NavItem";
import { useTranslate } from "@/hooks/useTranslate";
import { getCookie } from "cookies-next";
import jwt_decode from "jwt-decode";

import { RiUserAddLine } from "react-icons/ri";
import { RiLoginBoxLine } from "react-icons/ri";
import { RiInformationLine } from "react-icons/ri";
import { RiMapPin2Line } from "react-icons/ri";
import { RiMapLine } from "react-icons/ri";
import { RiCloseFill } from "react-icons/ri";
import { RiHome2Line } from "react-icons/ri";
import { RiCamera3Line } from "react-icons/ri";
import { RiMenuLine } from "react-icons/ri";

import { useRouter } from "next/router";
import { SingletonRouter, withRouter } from "next/router";
import Link from "next/link";

type Props = {
  router: SingletonRouter;
};

type PublicData = {
  fursonaName: string;
  imgPath: string;
};

const Navbar: NextPage<Props> = (props: Props) => {
  const [_document, set_document] = useState<any>(null);
  const [_window, set_window] = useState<any>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [publicData, setPublicData] = useState<PublicData>({
    fursonaName: "",
    imgPath: "",
  });

  const { t, changeLanguage, locale } = useTranslate();
  const routerPath = props.router.asPath;

  const updateCookie = () => {
    const ck = getCookie("publicToken");
    if (ck && typeof ck == "string") {
      setPublicData(jwt_decode(ck));
    } else {
      setPublicData({
        fursonaName: "",
        imgPath: "",
      });
    }
  };

  useEffect(() => {
    if (document) updateCookie();
  }, [_document]);

  useEffect(() => {
    setInterval(() => {
      updateCookie();
    }, 1000);
    set_document(document);
    set_window(window);
  }, []);

  const router = useRouter();

  const logout = async () => {
    await axiosInstance.get("api/logout");
    if (router.pathname == "/profile") router.push("/");
  };

  const evalRoute = (route: string, type = "dropDown") => {
    if (type == "dropDown") {
      return routerPath == route && NavItemStyle.Active;
    } else {
      return routerPath.includes(route) && DropDownStyle.MainActive;
    }
  };

  const toggleNavBar = () => {
    setIsOpen((o) => !o);
  }

  return (
    <nav className={styles.nav}>
      <div className={`${styles.MainButtonWrapper} ${isOpen && styles.MainButtonClosed}`}>
        <button
          className={styles.MainButton}
          onClick={() => toggleNavBar()}
        >
          <RiMenuLine/>
        </button>
      </div>
      <div className={`${styles.ItemWrappers} ${!isOpen && styles.BarClosed}`}>
        <div className={`${styles.ItemContainer}`}>
          <div className={styles.TopContainer}>
            <button
              className={styles.CloseBtn}
              onClick={() => toggleNavBar()}
            >
              <RiCloseFill/>
            </button>
            <Link href={"/"} className={styles.HomeBtn} onClick={() => toggleNavBar()}>
              <RiHome2Line/>
            </Link>
            <button
              className={styles.LanguageChanger}
              onClick={() => changeLanguage(locale == "en" ? "hu" : "en")}
            >
              {t("navLang")}
            </button>
          </div>

          {!publicData.fursonaName && (
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
          {publicData.fursonaName && (
            <NavDropdown
              mainclassname={`${evalRoute("/profile", "contain")}`}
              classnameItems={styles.profile}
              dropDownName={publicData.fursonaName}
            >
              <NavItem
                link="/profile"
                CustomStyle={`${DropDownStyle.Item} ${evalRoute("/profile")}`}
              >
                Profile
              </NavItem>
              <NavItem
                link=""
                onClick={async () => await logout()}
                CustomStyle={`${DropDownStyle.Item} ${DropDownStyle.LogoutButton}`}
              >
                Logout
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
            dropDownName={"Örli"}
            mainclassname={`${evalRoute("/orli", "contain")}`}
            icon={<RiMapLine />}
          >
            <NavItem
              link="/orli#programs"
              CustomStyle={`${DropDownStyle.Item} ${evalRoute("/orli#programs")}`}
              onClick={() => toggleNavBar()}
            >
              {t("navPrograms")}
            </NavItem>
            <NavItem
              link="/orli#prices"
              CustomStyle={`${DropDownStyle.Item} ${evalRoute("/orli#prices")}`}
              onClick={() => toggleNavBar()}
            >
              {t("navPrices")}
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
            dropDownName={"Info"}
            mainclassname={`${evalRoute("/info", "contain")}`}
            icon={<RiInformationLine />}
          >
            <NavItem
              link="/info#tos"
              CustomStyle={`${DropDownStyle.Item} ${evalRoute("/info#tos")}`}
              onClick={() => toggleNavBar()}
            >
              {t("navTos")}
            </NavItem>
            <NavItem
              link="/info#rules"
              CustomStyle={`${DropDownStyle.Item} ${evalRoute("/info#rules")}`}
              onClick={() => toggleNavBar()}
            >
              {t("navRules")}
            </NavItem>
            <NavItem
              link="/info#data"
              CustomStyle={`${DropDownStyle.Item} ${evalRoute("/info#data")}`}
              onClick={() => toggleNavBar()}
            >
              {t("navData")}
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
