/* eslint-disable react-hooks/exhaustive-deps */
import { FloatingMessageContext } from "@/hooks/FloatingMessageContext"
import Input from "@/comp/Input"
import Section from "@/comp/Section"
import { useTranslate } from "@/hooks/useTranslate"
import styles from "@/styles/pages/Reset.module.scss"
import { NextPage } from "next"
import { useContext, useEffect, useState } from "react"
import PrimaryButton from "@/comp/PrimaryButton";
import LoadingOverlay from "@/comp/LoadingOverlay";
import { useUser } from "@/hooks/useUser";
import { IResetForm } from "@/models/reset-form.model";
import { useRouter } from 'next/router';
import { IResetAuthForm } from "@/models/reset-auth-form.model"
import crypto from "crypto";
import CustomHead from "@/comp/CustomHead"

type Props = {}

const hasLowerCase = (str: string) => {
    return str.toUpperCase() != str;
};
const hasUpperCase = (str: string) => {
    return str.toLowerCase() != str;
};
const hasNumber = (str: string) => {
    return /\d/.test(str);
};
const isLongerThanSix = (str: string) => {
    return str.length >= 6;
};

const Reset: NextPage<Props> = (props: Props) => {
    const { t, locale } = useTranslate()
    const { HandleClose, AddFloatingMessage } = useContext(FloatingMessageContext);
    const { createPasswordReset, resetPassword } = useUser()
    const router = useRouter()
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confPassword, setConfPassword] = useState<string>('')
    const [errorStates, setErrorStates] = useState<any>({
        email: '',
        password: '',
        confPassword: '',
    })

    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [didInit, setDidInit] = useState<boolean>(false)

    const [token, setToken] = useState<string>('');

    let timer: NodeJS.Timeout | undefined = undefined;
    let time = 0;
    let message: number | undefined = undefined;

    // ===============================================
    // USEEFFECT UPDATES
    // ===============================================
    useEffect(() => {
        setDidInit(true)
        if (router.query && router.query.token) {
            setToken(router.query.token.toString())
        }
    }, [router.isReady, router.query])

    useEffect(() => {
        if (errorStates.email != "") validateEmail()
    }, [email]);
    useEffect(() => {
        if (errorStates.password != "") validatePassword()
    }, [password]);
    useEffect(() => {
        if (errorStates.confPassword != "") validateConfPassword()
    }, [confPassword]);

    useEffect(() => {
        errorStates.email && validateEmail()
        errorStates.password && validatePassword()
        errorStates.confPassword && validateConfPassword()
    }, [locale])

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
    const validatePassword = () => {
        return updateState(!hasLowerCase(password) || !hasUpperCase(password) || !hasNumber(password) || !isLongerThanSix(password), "password", t("regPassError"))
    }
    const validateConfPassword = () => {
        return updateState(password.trim() != confPassword.trim(), "confPassword", t("regPassConfError"))
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
        message = AddFloatingMessage({ "autocloses": false, "closable": false, "type": "Info", "message": t("warnOverload") })
    };
    const closeOverload = () => {
        clearInterval(timer);
        HandleClose(message!)
    };

    const handleButton = async () => {
        //Run bulk final check
        const finalCheck: boolean[] = []
        if (token) {
            finalCheck.push(
                validatePassword(),
                validateConfPassword(),
            )
        }
        else {
            finalCheck.push(
                validateEmail(),
            )
        }

        if (finalCheck.includes(false)) {
            return;
        }
        setIsDisabled(true);

        startTimer();
        setIsLoading(true)
        message = undefined;

        if (token) {
            const formData: IResetAuthForm = {
                token: token,
                password: crypto.createHash("sha256").update(password).digest("hex"),
            };
            resetPassword(formData, () => {
                if (timer) clearInterval(timer);
                time = 0;
                closeOverload();
                setIsLoading(false);
                setIsDisabled(false)
            })
        }
        else {
            const formData: IResetForm = {
                email: email,
            };
            createPasswordReset(formData, () => {
                if (timer) clearInterval(timer);
                time = 0;
                closeOverload();
                setIsLoading(false);
                setIsDisabled(false)
            });
        }
    }

    return (
        <>
            <CustomHead title={t("resetTitle")} />
            <LoadingOverlay isLoading={isLoading} />
            <div className={styles.Reset}>
                <div className={styles.Reset__Center}>
                    <Section title={t("resetTitle")}>
                        {
                            (!token && didInit) &&
                            <div className={styles.Reset__Form}>
                                <span>
                                    {t("resetInstruct1")}<br />
                                    {t("resetInstruct2")}
                                </span>
                                <span>
                                    <Input
                                        label={`${t("regEmail")}: `}
                                        placeholder={t("regEmail")}
                                        type={"email"}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onBlur={() => validateEmail()}
                                        inputClass={errorStates.email && styles.Reset__Error}
                                        maxlength={100}
                                    ></Input>
                                    <p className={styles.Reset__Error__Text}>{errorStates.email}</p>
                                </span>
                            </div>
                        }
                        {
                            (token && didInit) &&
                            <div className={styles.Reset__Form}>
                                <span>
                                    <Input
                                        label={`${t("resetPass")}: `}
                                        placeholder={t("resetPass")}
                                        type={"password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onBlur={() => validatePassword()}
                                        inputClass={errorStates.password && styles.Reset__Error}
                                        maxlength={100}
                                    ></Input>
                                    <p className={styles.Reset__Error__Text}>{errorStates.password}</p>
                                </span>
                                <span>
                                    <Input
                                        label={`${t("resetPassConf")}: `}
                                        placeholder={t("resetPassConf")}
                                        type={"password"}
                                        value={confPassword}
                                        onChange={(e) => setConfPassword(e.target.value)}
                                        onBlur={() => validateConfPassword()}
                                        inputClass={errorStates.confPassword && styles.Reset__Error}
                                        maxlength={100}
                                    ></Input>
                                    <p className={styles.Reset__Error__Text}>{errorStates.confPassword}</p>
                                </span>
                            </div>
                        }
                        <div className={styles.Reset__Button}>
                            <PrimaryButton disabled={isDisabled} text={token? t("resetButtonToken") : t("resetButton")} onClick={handleButton} />
                        </div>
                    </Section>
                </div>
            </div>
        </>
    )
}

export default Reset;