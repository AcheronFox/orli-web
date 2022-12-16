import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import Head from "next/head";
import Navbar from "@/comp/SideNav";
import { useEffect, useState } from "react";
import styles from "@/styles/LoginTemp.module.scss";
import style from "@/styles/global.module.scss";
import crypto from "crypto";
import React from "react";
import axiosInstance from "@/utils/axiosConfig";
import TranslateProvider from "@/hooks/TranslateProvider";
import CustomScrollBar from "@/comp/Scrollbar";
import FloatingMessageWrapper from "@/comp/FloatingMessageWrapper";
import Footer from "@/comp/Footer";

function MyApp({ Component, pageProps }: AppProps) {
  const [loggedIn, setLoggedIn] = useState<boolean>(
    process.env.TEMP_LOGIN_STATE?.toLowerCase() == "enabled" ? false : true
  );
  const [username, setUsername] = useState<string>("");
  const [pass, setPass] = useState<string>("");

  const [logInAttempts, setLogInAttempts] = useState<number>(0);
  const [lockedUntil, setLockedUntil] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  const usernameElement = React.useRef<HTMLInputElement>(null);
  const passwordElement = React.useRef<HTMLInputElement>(null);

  const waitOneMinute = async () => {
    await axiosInstance.get(`api/lockedTime`).then((res) => {
      setIsLocked(true);
      setLockedUntil(res.data.timeLeft);
    });
  };

  useEffect(() => {
    if (isLocked) {
      const timer = setInterval(async () => {
        if (lockedUntil <= Math.floor(new Date().getTime() / 1000)) {
          setIsLocked(false);
          setLockedUntil(0);
          setLogInAttempts(0);
        } else if (!isLocked) {
          return () => clearTimeout(timer);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isLocked, lockedUntil]);

  React.useEffect(() => {
    //handle autocomplete
    setUsername(usernameElement?.current?.value ?? "");
    setPass(passwordElement?.current?.value ?? "");
  }, [usernameElement, passwordElement]);

  const handleLogin = async () => {
    if (isLocked) return;
    let input = {
      username: username,
      pass: crypto.createHash("sha256").update(pass).digest("base64"),
    };
    await axiosInstance
      .post(`api/temp-login`, input)
      .then(() => {
        setLoggedIn(true);
      })
      .catch((err) => {
        if (!err.response) {
          console.log(err);
          return;
        }
        if (err.response.status == 403) {
          setLogInAttempts(logInAttempts + 1);
          if (logInAttempts >= 2) {
            waitOneMinute();
          }
        }
      });
  };

  if (loggedIn) {
    return (
      <CustomScrollBar>
        <TranslateProvider>
          <>
            <Navbar></Navbar>
            <FloatingMessageWrapper>
              <Head>
                <title>Örli Försztivál | Agárd Hungary</title>
              </Head>
              <div className={style.BG__Img}></div>
              <Component {...pageProps} />
              <Footer />
            </FloatingMessageWrapper>
          </>
        </TranslateProvider>
      </CustomScrollBar>
    );
  } else {
    return (
      <div className={styles.container}>
        {!isLocked && (
          <div className={styles.inner}>
            <p style={{ color: "red" }}>Orli Test Server Login:</p>
            <input
              ref={usernameElement}
              className={styles.content}
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            ></input>
            <br></br>
            <input
              ref={passwordElement}
              className={styles.content}
              type="password"
              placeholder="Password"
              onChange={(e) => setPass(e.target.value)}
              value={pass}
            ></input>
            <br></br>
            <button
              className={styles.content}
              disabled={isLocked}
              onClick={() => handleLogin()}
            >
              Login
            </button>
            {logInAttempts > 0 && (
              <p style={{ color: "red" }}>Invalid Attempts: {logInAttempts}</p>
            )}
          </div>
        )}
        {isLocked && <p style={{ color: "red" }}>Please wait one minute...</p>}
      </div>
    );
  }
}

export default MyApp;
