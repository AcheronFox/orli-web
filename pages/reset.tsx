/* eslint-disable react-hooks/exhaustive-deps */

import styles from "@/styles/pages/Reset.module.scss"
import { NextPage } from "next"
import { useEffect, useState } from "react"
import { IResetForm } from "@/models/reset-form.model";
import { useRouter } from 'next/router';
import { IResetAuthForm } from "@/models/reset-auth-form.model"
import crypto from "crypto";
import useNotification from "@/hooks/notification/useNotification"
import useTranslate from "@/hooks/translate/useTranslate";
import { useUser } from "@/hooks/user/useUser";
import CustomHead from "@/comp/utils/CustomHead";
import LoadingOverlay from "@/comp/utils/LoadingOverlay";
import BarLoader from "react-spinners/BarLoader";
import variables from "@/styles/abstracts/exports.module.scss"
import TextCard from "@/comp/TextCard";
import Input from "@/comp/input/Input";
import Button from "@/comp/button/Button";

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
    const { lang, currLang } = useTranslate()
    const { addNotification, closeNotification } = useNotification() 
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
    let message: string | undefined = undefined;

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
    }, [currLang])

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
    const validatePassword = () => {
        return updateState(!hasLowerCase(password) || !hasUpperCase(password) || !hasNumber(password) || !isLongerThanSix(password), "password", lang.regPassError)
    }
    const validateConfPassword = () => {
        return updateState(password.trim() != confPassword.trim(), "confPassword", lang.regPassConfError)
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
        message = addNotification({autoClose: false, closable: false, type: "info", message: lang.warnOverload})
    };
    const closeOverload = () => {
        clearInterval(timer);
        if (message) closeNotification(message)
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
            <CustomHead title={lang.resetTitle} />
            <LoadingOverlay isLoading={isLoading}>
                <BarLoader
                    color={variables.secondaryColor}
                />
            </LoadingOverlay>
            <div className={styles.Reset__Background} />
            <div className={styles.Reset}>
                <div className={styles.Reset__Center}>
                    <TextCard
                        variant="contained"
                        shadowEnabled
                        title={lang.resetTitle}
                    >
                        {
                            (!token && didInit) &&
                            <div className={styles.Reset__Form}>
                                <span>
                                    {lang.resetInstruct1}<br />
                                    {lang.resetInstruct2}
                                </span>
                                <span>
                                    <Input
                                        label={`${lang.regEmail}`}
                                        type={"email"}
                                        value={email}
                                        onChange={(e) => setEmail(e)}
                                        onBlur={() => validateEmail()}
                                        maxLength={100}
                                        error={errorStates.email}
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
                                        label={`${lang.resetPass}`}
                                        type={"password"}
                                        value={password}
                                        onChange={(e) => setPassword(e)}
                                        onBlur={() => validatePassword()}
                                        maxLength={100}
                                        error={errorStates.password}
                                    ></Input>
                                    <p className={styles.Reset__Error__Text}>{errorStates.password}</p>
                                </span>
                                <span>
                                    <Input
                                        label={`${lang.resetPassConf}`}
                                        type={"password"}
                                        value={confPassword}
                                        onChange={(e) => setConfPassword(e)}
                                        onBlur={() => validateConfPassword()}
                                        maxLength={100}
                                        error={errorStates.confPassword}
                                    ></Input>
                                    <p className={styles.Reset__Error__Text}>{errorStates.confPassword}</p>
                                </span>
                            </div>
                        }
                        <div className={styles.Reset__Button}>
                            <Button
                                disabled={isDisabled}
                                onClick={handleButton}
                            >
                                {token? lang.resetButtonToken : lang.resetButton}
                            </Button>
                        </div>
                    </TextCard>
                </div>
            </div>
        </>
    )
}

export default Reset;