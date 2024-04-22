/* eslint-disable react-hooks/exhaustive-deps */
/*
import { FloatingMessageContext } from "@/hooks/FloatingMessageContext"
import Input from "@/comp/Input"
import crypto from "crypto";
import styles from "@/styles/pages/Login.module.scss"
import { NextPage } from "next"
import { useEffect, useState } from "react"
import { ILoginForm } from "@/models/login-form.model";
import Router from "next/router";
import useTranslate from "@/hooks/translate/useTranslate";
import CustomHead from "@/comp/utils/CustomHead";
import LoadingOverlay from "@/comp/utils/LoadingOverlay";
import BarLoader from "react-spinners/BarLoader";
import variables from "@/styles/abstracts/exports.module.scss"
import { useUser } from "@/hooks/user/useUser";
import Button from "@/comp/button/Button";
import TextCard from "@/comp/TextCard";
import useNotification from "@/hooks/notification/useNotification";
import Input from "@/comp/input/Input";
import Checkbox from "@/comp/input/Checkbox";

type Props = {}

const Login: NextPage<Props> = (props: Props) => {
  const { lang, currLang } = useTranslate()
  const { addNotification, closeNotification } = useNotification()
  const { user, didUserInit, login } = useUser()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [remember, setRemember] = useState<boolean>(false)
  const [errorStates, setErrorStates] = useState<any>({
    email: '',
    password: '',
  })

  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  let timer: NodeJS.Timeout | undefined = undefined;
  let time = 0;
  let message: string | undefined = undefined;

  // ===============================================
  // USEEFFECT UPDATES
  // ===============================================
  useEffect(() => {
    if (errorStates.email != "") validateEmail()
  }, [email]);
  useEffect(() => {
    if (errorStates.password != "") validatePass()
  }, [password]);
  useEffect(() => {
    errorStates.email && validateEmail()
    errorStates.password && validatePass()
  }, [currLang])

  useEffect(() => {
    if (!didUserInit) return
    if (user) {
      Router.push('/profile')
    }
  }, [didUserInit])

  // ===============================================
  // VALIDATORS
  // ===============================================
  const updateState = (check: any, key: string, value: string) => {
    if (check) {
      setErrorStates((errorStates: any) => { return { ...errorStates, [key]: value } });
      return false;
    } else {
      setErrorStates((errorStates: any) => { return { ...errorStates, [key]: '' } });
      return true
    }
  }

  const validateEmail = () => {
    return updateState(email.trim() == "", "email", lang.loginEmailError)
  }
  const validatePass = () => {
    return updateState(password.trim() == "", "password", lang.loginPassError)
  }

  // ===============================================
  // SEND TO BACKEND
  // ===============================================
  const startTimer = () => {
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
      time = time + 100;
      if (time >= 6000) showOverload();
    }, 100);
  };

  const showOverload = () => {
    clearInterval(timer);
    message = addNotification({autoClose: false, closable: false, type: "info", message: lang.warnOverload })
  };
  const closeOverload = () => {
    clearInterval(timer);
    closeNotification(message!)
  };

  const handleButton = async () => {
    //Run bulk final check
    const finalCheck: boolean[] = []
    finalCheck.push(
      validateEmail(),
      validatePass(),
    )

    if (finalCheck.includes(false)) {
      return;
    }
    setIsDisabled(true);

    const formData: ILoginForm = {
      email: email,
      password: crypto.createHash("sha256").update(password).digest("hex"),
      remember: remember,
    };

    startTimer();
    setIsLoading(true)
    message = undefined;

    login(formData, () => {
      if (timer) clearInterval(timer);
      time = 0;
      closeOverload();
      setIsLoading(false);
      setIsDisabled(false)
    });
  }

  return (
    <>
      <CustomHead title={lang.navLogin} />
      <LoadingOverlay isLoading={isLoading}>
        <BarLoader
          color={variables.secondaryColor}
        />
      </LoadingOverlay>
      <div className={styles.Login__Background} />
      <div className={styles.Login}>
        <div className={styles.Login__Center}>
          <TextCard
            variant="contained"
            shadowEnabled
            title={lang.navLogin}
          >
            <div className={styles.Login__Form}>
              <span>
                <Input
                  id={"email"}
                  name={"email"}
                  label={`${lang.regEmail}`}
                  type={"email"}
                  value={email}
                  onChange={(e) => setEmail(e)}
                  onBlur={() => validateEmail()}
                  error={errorStates.email}
                />
                <p className={styles.Login__Error__Text}>{errorStates.email}</p>
              </span>
              <span>
                <Input
                  id={"password"}
                  name={"password"}
                  label={`${lang.regPassword}`}
                  type={"password"}
                  value={password}
                  onChange={(e) => setPassword(e)}
                  onBlur={() => validatePass()}
                  error={errorStates.password}
                ></Input>
                <p className={styles.Login__Error__Text}>{errorStates.password}</p>
              </span>
              <div className={styles.Login__Form__Row}>
                <Checkbox
                  checked={(e) => setRemember(e)}
                  id="chk-1"
                  label={lang.loginRemember}
                />
                <div className={styles.Login__Form__Button}>
                  <Button
                    variant="text"
                    link={"/reset"}
                  >
                    {lang.loginForgotPass}
                  </Button>
                </div>
              </div>
            </div>
            <div className={styles.Login__Button}>
              <Button
                variant="contained"
                disabled={isDisabled}
                onClick={handleButton}
              >
                {lang.loginButton}
              </Button>
            </div>
          </TextCard>
        </div>
      </div>
    </>
  )
}

export default Login;
*/

import TempWIP from "@/comp/TempWIP";
import { NextPage } from "next";

type Props = {}

const Login: NextPage<Props> = (props: Props) => {

  return (
    <TempWIP/>
  );
}
export default Login