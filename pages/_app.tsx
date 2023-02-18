/* eslint-disable react-hooks/exhaustive-deps */
import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import Head from "next/head";
import style from "@/styles/global.module.scss";
import React from "react";


const MyApp = ({ Component, pageProps }: AppProps) => {

  return (
    <>
      <Head>
        <title>Örli Försztivál | Agárd Hungary</title>
      </Head>
      <div className={style.BG__Img}></div>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
