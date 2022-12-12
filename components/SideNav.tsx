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

  const closeNavBar = () => {
    console.log("close")
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.ItemWrappers}>
        <div className={`${styles.ItemContainer}`}>
          <div className={styles.TopContainer}>
            <button
              className={styles.CloseBtn}
              onClick={() => closeNavBar()}
            >
              <RiCloseFill/>
            </button>
            <Link href={"/"} className={styles.HomeBtn}>
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
          >
            {t("navRegistration")}
          </NavItem>

          <NavDropdown
            dropDownName={"Örli"}
            mainclassname={`${evalRoute("/fursang", "contain")} ${evalRoute(
              "/about",
              "contain"
            )}`}
            icon={<RiMapLine />}
          >
            <NavItem
              link="/fursang#programs"
              CustomStyle={`${DropDownStyle.Item} ${evalRoute(
                "/fursang#programs"
              )}`}
            >
              {t("navPrograms")}
            </NavItem>
            <NavItem
              link="/fursang#prices"
              CustomStyle={`${DropDownStyle.Item} ${evalRoute(
                "/fursang#prices"
              )}`}
            >
              {t("navPrices")}
            </NavItem>
            <NavItem
              link="/fursang#accomodation"
              CustomStyle={`${DropDownStyle.Item} ${evalRoute(
                "/fursang#accomodation"
              )}`}
            >
              {t("navAccom")}
            </NavItem>
          </NavDropdown>

          <NavDropdown
            dropDownName={t("navLocation")}
            mainclassname={`${evalRoute("/location", "contain")}`}
            icon={<RiMapPin2Line />}
          >
            <NavItem
              link="/location#gettingThere"
              CustomStyle={`${DropDownStyle.Item} ${evalRoute(
                "/location#gettingThere"
              )}`}
            >
              {t("navGetting")}
            </NavItem>
            <NavItem
              link="/location#floorPlan"
              CustomStyle={`${DropDownStyle.Item} ${evalRoute(
                "/location#floorPlan"
              )}`}
            >
              {t("navPoi")}
            </NavItem>
          </NavDropdown>

          <NavDropdown
            dropDownName={"Info"}
            mainclassname={`${evalRoute("/information", "contain")} ${evalRoute(
              "/rules",
              "contain"
            )}`}
            icon={<RiInformationLine />}
          >
            <NavItem
              link="/information#FurryConvention"
              CustomStyle={`${DropDownStyle.Item} ${evalRoute(
                "/information#FurryConvention"
              )}`}
            >
              {t("navTos")}
            </NavItem>
            <NavItem
              link="/information#FAQ"
              CustomStyle={`${DropDownStyle.Item} ${evalRoute(
                "/information#FAQ"
              )}`}
            >
              {t("navRules")}
            </NavItem>
            <NavItem
              link="/rules"
              CustomStyle={`${DropDownStyle.Item} ${evalRoute("/rules")}`}
            >
              {t("navData")}
            </NavItem>
          </NavDropdown>

          <NavItem
              link="/gallery"
              shouldOverwrite={false}
              CustomStyle={`${evalRoute("/gallery", "item")}`}
              icon={<RiCamera3Line />}
            >
              {t("navGallery")}
            </NavItem>
        </div>
      </div>
    </nav>
  );
};

export default withRouter(Navbar);
