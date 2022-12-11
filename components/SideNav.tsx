/* eslint-disable react-hooks/exhaustive-deps */
import { NextPage } from "next";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/components/navbar/Navbar.module.scss";
import DropDownStyle from "@/styles/components/navbar/NavDropDown.module.scss";
import axiosInstance from "../utils/axiosConfig";
import NavDropdown from "./NavDropdown";
import NavItem from "./NavItem";
import { useTranslate } from "@/hooks/useTranslate";
import { getCookie } from "cookies-next";
import jwt_decode from "jwt-decode";

import { useRouter } from "next/router";
import { SingletonRouter, withRouter } from "next/router";

type Props = {
  router: SingletonRouter;
};

type PublicData = {
  fursonaName: string;
  imgPath: string;
};

const Navbar: NextPage<Props> = (props: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
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
      return routerPath == route && DropDownStyle.Active;
    } else if (type == "contain") {
      return routerPath.includes(route) && DropDownStyle.MainActive;
    }
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.ItemWrappers}>
        <div
          className={`${styles.ItemContainer} ${isOpen ? styles.Opened : ""}`}
        >
          <button
            className={styles.LanguageChanger}
            onClick={() => changeLanguage(locale == "en" ? "hu" : "en")}
          >
            {t("lang")}
          </button>

          {!publicData.fursonaName && (
            <NavItem
              link="/login"
              shouldOverwrite={false}
              CustomStyle={`${evalRoute("/login", "item")}`}
            >
              {t("signIn")}
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
                {t("profile")}
              </NavItem>
              <NavItem
                link=""
                onClick={async () => await logout()}
                CustomStyle={`${DropDownStyle.Item} ${DropDownStyle.LogoutButton}`}
              >
                {t("logout")}
              </NavItem>
            </NavDropdown>
          )}

          <NavItem
            link="/registration"
            shouldOverwrite={false}
            CustomStyle={`${evalRoute("/registration", "item")}`}
          >
            {t("registration")}
          </NavItem>

          <NavDropdown
            dropDownName={t("007Fursang")}
            mainclassname={`${evalRoute("/fursang", "contain")} ${evalRoute(
              "/about",
              "contain"
            )}`}
          >
            <NavItem
              link="/fursang#programs"
              CustomStyle={`${DropDownStyle.Item} ${evalRoute(
                "/fursang#programs"
              )}`}
            >
              {t("programs")}
            </NavItem>
            <NavItem
              link="/fursang#prices"
              CustomStyle={`${DropDownStyle.Item} ${evalRoute(
                "/fursang#prices"
              )}`}
            >
              {t("prices")}
            </NavItem>
            <NavItem
              link="/fursang#accomodation"
              CustomStyle={`${DropDownStyle.Item} ${evalRoute(
                "/fursang#accomodation"
              )}`}
            >
              {t("accomodation")}
            </NavItem>
            <NavItem
              link="/about#history"
              CustomStyle={`${DropDownStyle.Item} ${evalRoute(
                "/about#history"
              )}`}
            >
              {t("history")}
            </NavItem>
            <NavItem
              link="/about#aboutFursang"
              CustomStyle={`${DropDownStyle.Item} ${evalRoute(
                "/about#fursang"
              )}`}
            >
              {t("aboutFursang")}
            </NavItem>
            <NavItem
              link="/about#aboutUs"
              CustomStyle={`${DropDownStyle.Item} ${evalRoute(
                "/about#aboutUs"
              )}`}
            >
              {t("aboutUs")}
            </NavItem>
          </NavDropdown>

          <NavDropdown
            dropDownName={t("location")}
            mainclassname={`${evalRoute("/location", "contain")}`}
          >
            <NavItem
              link="/location#gettingThere"
              CustomStyle={`${DropDownStyle.Item} ${evalRoute(
                "/location#gettingThere"
              )}`}
            >
              {t("locGettingThere")}
            </NavItem>
            <NavItem
              link="/location#floorPlan"
              CustomStyle={`${DropDownStyle.Item} ${evalRoute(
                "/location#floorPlan"
              )}`}
            >
              {t("locPlan")}
            </NavItem>
            <NavItem
              link="/location#external"
              CustomStyle={`${DropDownStyle.Item} ${evalRoute(
                "/location#external"
              )}`}
            >
              {t("locExternal")}
            </NavItem>
            <NavItem
              link="/location#suitwalk"
              CustomStyle={`${DropDownStyle.Item} ${evalRoute(
                "/location#suitwalk"
              )}`}
            >
              {t("locSuitWalk")}
            </NavItem>
          </NavDropdown>

          <NavDropdown
            dropDownName={t("generalInfo")}
            mainclassname={`${evalRoute("/information", "contain")} ${evalRoute(
              "/rules",
              "contain"
            )}`}
          >
            <NavItem
              link="/information#FurryConvention"
              CustomStyle={`${DropDownStyle.Item} ${evalRoute(
                "/information#FurryConvention"
              )}`}
            >
              {t("furryConv")}
            </NavItem>
            <NavItem
              link="/information#FAQ"
              CustomStyle={`${DropDownStyle.Item} ${evalRoute(
                "/information#FAQ"
              )}`}
            >
              {t("faq")}
            </NavItem>
            <NavItem
              link="/rules"
              CustomStyle={`${DropDownStyle.Item} ${evalRoute("/rules")}`}
            >
              {t("rules")}
            </NavItem>
          </NavDropdown>
        </div>
      </div>
    </nav>
  );
};

export default withRouter(Navbar);
