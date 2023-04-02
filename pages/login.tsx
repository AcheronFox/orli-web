/* eslint-disable react-hooks/exhaustive-deps */
import { FloatingMessageContext } from "@/hooks/FloatingMessageContext"
import Input from "@/comp/Input"
import Section from "@/comp/Section"
import crypto from "crypto";
import { useTranslate } from "@/hooks/useTranslate"
import styles from "@/styles/pages/Login.module.scss"
import { NextPage } from "next"
import { useContext, useEffect, useState } from "react"
import { ILoginForm } from "@/models/login-form.model";
import PrimaryButton from "@/comp/PrimaryButton";
import LoadingOverlay from "@/comp/LoadingOverlay";
import LinkButton from "@/comp/LinkButton";
import { useUser } from "@/hooks/useUser";
import Router from "next/router";
import CustomHead from "@/comp/CustomHead";

type Props = {}

const Login: NextPage<Props> = (props: Props) => {
  const { t, locale } = useTranslate()
  const { HandleClose, AddFloatingMessage } = useContext(FloatingMessageContext);
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
  let message: number | undefined = undefined;

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
  }, [locale])

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
    return updateState(email.trim() == "", "email", t("loginEmailError"))
  }
  const validatePass = () => {
    return updateState(password.trim() == "", "password", t("loginPassError"))
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
    message = AddFloatingMessage({"autocloses": false, "closable": false, "type": "Info", "message": t("warnOverload")})
  };
  const closeOverload = () => {
    clearInterval(timer);
    HandleClose(message!)
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
      <CustomHead title={t("navSignIn")} />
      <LoadingOverlay isLoading={isLoading} message={t("loginWait")}/>
      <div className={styles.Login}>
        <div className={styles.Login__Center}>
          <Section title={t("navSignIn")}>
            <div className={styles.Login__Form}>
              <span>
                <Input
                  id={"email"}
                  name={"email"}
                  label={`${t("regEmail")}: `}
                  placeholder={t("regEmail")}
                  type={"email"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => validateEmail()}
                  inputClass={errorStates.email && styles.Login__Error}
                ></Input>
                <p className={styles.Login__Error__Text}>{errorStates.email}</p>
              </span>
              <span>
                <Input
                  id={"password"}
                  name={"password"}
                  label={`${t("regPassword")}: `}
                  placeholder={t("regPassword")}
                  type={"password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => validatePass()}
                  inputClass={errorStates.password && styles.Login__Error}
                ></Input>
                <p className={styles.Login__Error__Text}>{errorStates.password}</p>
              </span>
              <div className={styles.Login__Form__Row}>
                <Input
                  type="checkbox"
                  checked={(e) => setRemember(e)}
                  id="chk-1"
                  label={<>{t("loginRemember")}</>}
                ></Input>
                <div className={styles.Login__Form__Button}>
                  <LinkButton text={t("loginForgotPass")} link={"/reset"} isInternal={true} />
                </div>
              </div>
            </div>
            <div className={styles.Login__Button}>
              <PrimaryButton disabled={isDisabled} text={t("loginButton")} onClick={handleButton}/>
            </div>
          </Section>
        </div>
      </div>
    </>
  )
}

export default Login;