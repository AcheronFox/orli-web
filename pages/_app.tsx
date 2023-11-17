/* eslint-disable react-hooks/exhaustive-deps */
import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import style from "@/styles/global.module.scss";
import React from "react";
import TranslateProvider from "@/hooks/TranslateProvider";
import CustomHead from "@/comp/CustomHead";

const MyApp = ({ Component, pageProps }: AppProps) => {


  return (
    <TranslateProvider>
      <>
        <CustomHead></CustomHead>
        <div className={style.BG__Img}></div>
        <Component {...pageProps} />
      </>
    </TranslateProvider>
  );
}

export default MyApp;
