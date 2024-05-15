/* eslint-disable react-hooks/exhaustive-deps */
import CustomDatePicker from "@/comp/input/CustomDatePicker";
import NationalitySelector from "@/comp/input/NationalitySelector";
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import styles from "@/styles/pages/Registration.module.scss"
import { useEffect, useState } from "react";
import crypto from "crypto";
import Router from 'next/router'
import { IRegistrationDataSave, IRegistrationForm } from "@/models/registration-form.model";
import { NextPage } from "next";
import LoadingOverlay from "@/comp/utils/LoadingOverlay";
import { RiQuestionLine } from "react-icons/ri"
import createDatePatternFromDate from "@/functions/utils/createDatePattern";
import useTranslate from "@/hooks/translate/useTranslate";
import axiosInstance from "@/functions/utils/axiosConfig";
import CustomHead from "@/comp/utils/CustomHead";
import Input from "@/comp/input/Input";
import TextCard from "@/comp/TextCard";
import Button from "@/comp/button/Button";
import BarLoader from "react-spinners/BarLoader";
import variables from "@/styles/abstracts/exports.module.scss"
import { Tooltip } from 'react-tippy';
import Checkbox from "@/comp/input/Checkbox";
import useNotification from "@/hooks/notification/useNotification";
import { INationality } from "@/models/newDbModels/nationality.model";
import PhoneCodeSelector from "@/comp/input/PhoneCodeSelector";
import { useHTMLString } from "@/hooks/utils/useHTMLString";

const isEmailValid = (email: string) => {
  return /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
    email
  );
};

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

const getAge = (birthday: string) => {
  const ageDifMs = Date.now() - new Date(birthday).getTime();
  const ageDate = new Date(ageDifMs);

  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

type Props = {};

const Registration: NextPage<Props> = (props: Props) => {
  const { lang, currLang } = useTranslate();
  const { addNotification, closeNotification } = useNotification()
  const parse = useHTMLString()

  const [nationalities, setNationalities] = useState<INationality[]>([])

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [dob, setDoB] = useState<string>("");
  const [nationality, setNationality] = useState<number>(0);
  const [email, setEmail] = useState<string>("");
  const [confEmail, setConfEmail] = useState<string>("");
  const [fursonaName, setFursonaName] = useState<string>("");
  const [fursonaSpecies, setFursonaSpecies] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confPassword, setConfPassword] = useState<string>("");
  const [telegram, setTelegram] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [allergy, setAllergy] = useState<string>("");
  const [otherPass, setOtherPass] = useState<string>("");
  const [selectedPhoneExt, setSelectedPhoneExt] = useState<string>('')

  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [serverDate, setServerDate] = useState<Date>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isButtonActive, setIsButtonActive] = useState<boolean>(false);

  const [dobState, setDoBState] = useState<boolean>(false);
  const [age, setAge] = useState<number>(0);
  const [utcFormatDOB, setUtcFormatDOB] = useState<string>('');

  const [errorStates, setErrorStates] = useState<any>({
    firstName: '',
    lastName: '',
    dob: '',
    nationality: '',
    email: '',
    confEmail: '',
    fursonaName: '',
    fursonaSpecies: '',
    password: '',
    confPassword: '',
    telegram: '',
    phone: '',
  });

  const [agreeStates, setAgreeStates] = useState<any>({
    rules: false,
    data: false,
  })

  let timer: NodeJS.Timeout | undefined = undefined;
  let time = 0;
  let message: string | undefined = undefined;

  // ===============================================
  // DEFAULTS
  // ===============================================
  useEffect(() => {
    getDefaults()
  }, [])

  const getDefaults = async () => {
    await axiosInstance.get('api/v2/defaults/registration')
      .then((res) => {
        setServerDate(new Date(res.data.serverDate))
        setFromDate(new Date(res.data.fromDate))
        setToDate(new Date(res.data.toDate))
      })
      .catch((err) => {
        return
      })
    
    await axiosInstance.get('/api/v2/nationality/').then((res) => {
      setNationalities(res.data)
    })
  }

  // ===============================================
  // USEEFFECT UPDATES
  // ===============================================
  useEffect(() => {
    setErrorStates((errorStates: any) => { return { ...errorStates, lastName: '' } });
  }, [lastName]);
  useEffect(() => {
    setErrorStates((errorStates: any) => { return { ...errorStates, firstName: '' } });
  }, [firstName]);
  useEffect(() => {
    if (errorStates.email != "") validateEmail()
  }, [email]);
  useEffect(() => {
    if (errorStates.confEmail != "") validateConfEmail()
  }, [confEmail]);
  useEffect(() => {
    setErrorStates((errorStates: any) => { return { ...errorStates, fursonaSpecies: '' } });
  }, [fursonaSpecies]);
  useEffect(() => {
    setErrorStates((errorStates: any) => { return { ...errorStates, fursonaName: '' } });
  }, [fursonaName]);
  useEffect(() => {
    validateAge(dobState)
  }, [dob, dobState]);
  useEffect(() => {
    errorStates.nationality = ''
    setErrorStates(errorStates);
  }, [nationality]);
  useEffect(() => {
    if (errorStates.password != "") validatePass()
  }, [password]);
  useEffect(() => {
    if (errorStates.confPassword != "") validateConfPass()
  }, [confPassword]);
  useEffect(() => {
    if (errorStates.telegram != "") {
      validateTelegram()
      validatePhone()
    }
  }, [telegram]);
  useEffect(() => {
    if (errorStates.phone != "")  {
      validatePhone()
      validateTelegram()
    }
  }, [phone, selectedPhoneExt]);

  useEffect(() => {
    errorStates.firstName && validateFirstName()
    errorStates.lastName && validateLastName()
    errorStates.email && validateEmail()
    errorStates.confEmail && validateConfEmail()
    errorStates.fursonaName && validateSonaName()
    errorStates.fursonaSpecies && validateSpecies()
    errorStates.dob && validateAge(dobState, true)
    errorStates.nationality && validateNationality()
    errorStates.password && validatePass()
    errorStates.confPassword && validateConfPass()
    errorStates.telegram && validateTelegram()
    errorStates.phone && validatePhone()
  }, [currLang])

  useEffect(() => {
    let isDisabled = false;
    for (const [key, value] of Object.entries(agreeStates)) {
      if (value == false) isDisabled = true
    }
    return setIsButtonActive(isDisabled)
  }, [agreeStates])

  // ===============================================
  // VALIDATORS
  // ===============================================
  const updateState = (check: any, key: string, value: string) => {
    if (check) {
      setErrorStates({ ...errorStates, [key]: value } );
      return false;
    } else {
      setErrorStates({ ...errorStates, [key]: '' } );
      return true
    }
  }

  const validateFirstName = () => {
    return updateState(firstName.trim() == "", "firstName", lang.regFirstNameError)
  }
  const validateLastName = () => {
    return updateState(lastName.trim() == "", "lastName", lang.regLastNameError)
  }
  const validateEmail = () => {
    return updateState(!isEmailValid(email), "email", lang.regEmailError)
  }
  const validateConfEmail = () => {
    return updateState(email.trim().toLowerCase() != confEmail.trim().toLowerCase(), "confEmail", lang.regEmailConfError)
  }
  const validateSonaName = () => {
    return updateState(fursonaName.trim() == "", "fursonaName", lang.regSonaNameError)
  }
  const validateSpecies = () => {
    return updateState(fursonaSpecies.trim() == "", "fursonaSpecies", lang.regSonaSpeciesError)
  }
  const validateDoB = () => {
    return updateState(!dobState, "dob", lang.regDateError)
  }
  const validateNationality = () => {
    return updateState(!nationality, "nationality", lang.regNationalityError)
  }
  const validatePass = () => {
    return updateState(!hasLowerCase(password) || !hasUpperCase(password) || !hasNumber(password) || !isLongerThanSix(password), "password", lang.regPassError)
  }
  const validateConfPass = () => {
    return updateState(password.trim() != confPassword.trim(), "confPassword", lang.regPassConfError)
  }
  const validateTelegram = () => {
    return updateState((phone.trim() == "" && telegram.trim() == ""), "telegram", lang.regContactErr)
  }
  const validatePhone = () => {
    return updateState((telegram.trim() == "" && (phone.trim() == "" || selectedPhoneExt.trim() == "")), "phone", lang.regContactErr)
  }

  const validateAge = (state: boolean, strict = false) => {
    if (dob == lang.dateFormat || dob == '') {
      if (strict) {
        setErrorStates((errorStates: any) => { return { ...errorStates, dob: lang.regDateError } });
        return false;
      } else {
        return false;
      }
    }
    if (!state) {
      return false;
    }
    const parts = dob.split("/");
    const tempUtcFormatDOB = `${parts[0]}-${parts[1]}-${parts[2]}`;
    const tempDate = new Date(tempUtcFormatDOB);

    if (Math.floor(tempDate.valueOf() / 1000) >= Math.floor(Date.now() / 1000)) {
      setErrorStates((errorStates: any) => { return { ...errorStates, dob: lang.regInvalidAgeError } });
      return false;
    }

    const tempAge = getAge(tempUtcFormatDOB);
    setAge(tempAge);
    setDoBState(state);
    setUtcFormatDOB(tempUtcFormatDOB);


    if (tempAge < 16) {
      setErrorStates((errorStates: any) => { return { ...errorStates, dob: lang.regUnderAgeError } });
      return false;
    } else if (tempAge >= 110) {
      setErrorStates((errorStates: any) => { return { ...errorStates, dob: lang.regInvalidAgeError } });
      return false;
    } else {
      setErrorStates((errorStates: any) => { return { ...errorStates, dob: '' } });
      return true;
    }
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
    message = addNotification({type: "warning", message: lang.warnOverload, closable: false, autoClose: false})
  };
  const closeOverload = () => {
    clearInterval(timer);
    if (message) closeNotification(message)
  };

  const handleButton = async () => {
    //Run bulk final check
    const finalCheck: boolean[] = []
    finalCheck.push(
      validateFirstName(),
      validateLastName(),
      validateEmail(),
      validateConfEmail(),
      validateSonaName(),
      validateSpecies(),
      validateDoB(),
      validateAge(dobState, true),
      validateNationality(),
      validatePass(),
      validateConfPass(),
      telegram? validateTelegram() : validatePhone(),
    )

    if (finalCheck.includes(false)) {
      return;
    }
    setIsDisabled(true);


    const formData: IRegistrationForm = {
      firstName: firstName,
      lastName: lastName,
      fursonaName: fursonaName,
      fursonaSpecies: fursonaSpecies,
      email: email,
      dateOfBirth: new Date(utcFormatDOB),
      nationalityId: nationality as number,
      telegram: telegram? 'https://t.me/'+telegram : '',
      phone: phone? selectedPhoneExt+phone : '',
      allergy: allergy,
      password: crypto.createHash("sha256").update(password).digest("hex"),
      otherPass: otherPass,
    };

    startTimer();
    setIsLoading(true)
    message = undefined;

    axiosInstance
      .post("api/v2/user/register", formData)
      .then(() => {
        if (getCookie("registrationData")) {
          deleteCookie("registrationData");
        }
        Router.push({
          pathname: '/registration/success',
          query: {
            name: fursonaName,
            email: email,
          }
        },
          '/registration/success');
      })
      .catch((err) => {
        if (err.response.status) {
          switch (err.response.status) {
            case (409):
              addNotification({
                type: "error",
                message: lang.errRegConflict
              })
              break;
            default:
              addNotification({
                type: "error",
                message: lang.errDefault
              })
          }
        } else {
          addNotification({
            type: "error",
            message: lang.errDefault
          })
        }
      })
      .finally(() => {
        if (timer) clearInterval(timer);
        time = 0;
        closeOverload();
        setIsLoading(false);
        setIsDisabled(false);
      });
  }


  const saveCookie = () => {
    const saveData: IRegistrationDataSave = {
      FirstName: firstName,
      LastName: lastName,
      FursonaName: fursonaName,
      FursonaSpecies: fursonaSpecies,
      Email: email,
      DoB: dob,
      Nationality: nationality?.toString() || '',
      Telegram: telegram,
      Phone: phone,
      Allergy: allergy,
      OtherPass: otherPass,
    }
    setCookie("registrationData", JSON.stringify(saveData));
  }

  useEffect(() => {
    if (getCookie("registrationData")) {
      const loadedData: IRegistrationDataSave = JSON.parse(getCookie("registrationData")!.toString()) as IRegistrationDataSave;
      if (!Object.values(loadedData).every(x => x == "" || x == 0)) {
        Object.keys(loadedData).map((key) => {
          eval(`set${key}('${loadedData[key as keyof typeof loadedData]}')`)
        })
      }
    }
  }, [])

  useEffect(() => {
    saveCookie();
  }, [
    firstName, lastName, fursonaName, fursonaSpecies,
    email, dob, age, nationality,
    telegram, phone, allergy, otherPass
  ])

  return (
    <>
      <CustomHead title={lang.navReg} />
      <LoadingOverlay
        isLoading={isLoading}
        text={`${lang.regWait}`}
      >
        <BarLoader
          color={variables.secondaryColor}
        />
      </LoadingOverlay>
      <div className={styles.Registration__Background} />
      <div className={styles.Registration}>
        <TextCard
          variant="filled"
          shadowEnabled
          title={lang.navReg}
          customTitleClass={styles.Registration__Title}
          customBodyClass={styles.Registration__Content}
        >
          <div className={styles.Registration__Form}>
            <div className={styles.Registration__Form__Row}>
              <span>
                <Input
                  id={"in-1"}
                  label={`${lang.regFirstname}: `}
                  list="autoCompleteOff"
                  autoComplete="nope"
                  value={firstName}
                  onChange={(e) => setFirstName(e)}
                  onBlur={() => validateFirstName()}
                  error={!!errorStates.firstName}
                  maxLength={100}
                ></Input>
                <p className={styles.Registration__Error__Text}>{errorStates.firstName}</p>
              </span>

              <span>
                <Input
                  id={"in-2"}
                  label={`${lang.regLastname}: `}
                  list="autoCompleteOff"
                  autoComplete="nope"
                  value={lastName}
                  onChange={(e) => setLastName(e)}
                  onBlur={() => validateLastName()}
                  error={!!errorStates.lastName}
                  maxLength={100}
                ></Input>
                <p className={styles.Registration__Error__Text}>{errorStates.lastName}</p>
              </span>
            </div>
            
            <span>
              <CustomDatePicker
                isDateValid={setDoBState}
                label={`${lang.regDob}: `}
                onChange={(e: React.SetStateAction<string>) => setDoB(e)}
                value={dob}
                onBlur={validateDoB}
                error={!!errorStates.dob}
              ></CustomDatePicker>
              <p className={styles.Registration__Error__Text}>{errorStates.dob}</p>
            </span>

            <span>
              <NationalitySelector
                label={`${lang.regNationality}: `}
                onChange={(e) => setNationality(e)}
                value={nationality}
                nationalityList={nationalities}
                onBlur={() => validateNationality()}
              ></NationalitySelector>
              <p className={styles.Registration__Error__Text}>{errorStates.nationality}</p>
            </span>

            <span>
              <Input
                id={"email"}
                name={"email"}
                label={`${lang.regEmail}: `}
                type={"email"}
                list="autoCompleteOff"
                autoComplete="nope"
                value={email}
                onChange={(e) => setEmail(e)}
                onBlur={() => validateEmail()}
                error={!!errorStates.email}
                maxLength={100}
              ></Input>
              <p className={styles.Registration__Error__Text}>{errorStates.email}</p>
            </span>

            <span>
              <Input
                id={"in-3"}
                label={`${lang.regEmailConfirm}: `}
                type={"email"}
                list="autoCompleteOff"
                autoComplete="nope"
                value={confEmail}
                onChange={(e) => setConfEmail(e)}
                onBlur={() => validateConfEmail()}
                error={!!errorStates.confEmail}
                maxLength={100}
              ></Input>
              <p className={styles.Registration__Error__Text}> {errorStates.confEmail}</p>
            </span>


            <div className={styles.Registration__Form__Row}>
              <span>
                <Input
                  id={"in-4"}
                  label={`${lang.regFursonaName}: `}
                  list="autoCompleteOff"
                  autoComplete="nope"
                  value={fursonaName}
                  onChange={(e) => setFursonaName(e)}
                  onBlur={() => validateSonaName()}
                  error={!!errorStates.fursonaName}
                  maxLength={10}
                ></Input>
                <p className={styles.Registration__Error__Text}>{errorStates.fursonaName}</p>
              </span>

              <span>
                <Input
                  id={"in-5"}
                  label={`${lang.regSpecies}: `}
                  list="autoCompleteOff"
                  autoComplete="nope"
                  value={fursonaSpecies}
                  onChange={(e) => setFursonaSpecies(e)}
                  onBlur={() => validateSpecies()}
                  error={!!errorStates.fursonaSpecies}
                  maxLength={10}
                ></Input>
                <p className={styles.Registration__Error__Text}>{errorStates.fursonaSpecies}</p>
              </span>
            </div>

            <div className={styles.Registration__Form__Row}>
              <span>
                <Input
                  id={"password"}
                  name={"password"}
                  label={`${lang.regPassword}: `}
                  type={"password"}
                  list="autoCompleteOff"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e)}
                  onBlur={() => validatePass()}
                  error={!!errorStates.password}
                  maxLength={100}
                ></Input>
                <p className={styles.Registration__Error__Text}>{errorStates.password}</p>
              </span>

              <span>
                <Input
                  id={"in-6"}
                  label={`${lang.regPasswordConfirm}: `}
                  type={"password"}
                  list="autoCompleteOff"
                  autoComplete="new-password"
                  value={confPassword}
                  onChange={(e) => setConfPassword(e)}
                  onBlur={() => validateConfPass()}
                  error={!!errorStates.confPassword}
                  maxLength={100}
                ></Input>
                <p className={styles.Registration__Error__Text}>{errorStates.confPassword}</p>
              </span>
            </div>
            <span>
              <span className={styles.Registration__Form__Row}>
                <Input
                  id={"in-7"}
                  label={lang.regTelegram}
                  type={"text"}
                  list="autoCompleteOff"
                  autoComplete="nope"
                  value={telegram}
                  onChange={(e) => setTelegram(e)}
                  onBlur={() => validateTelegram()}
                  error={!!errorStates.telegram}
                  maxLength={100}
                  startAdornment={
                    <>
                      <Tooltip
                        html={
                          <span style={{ fontSize: "1.4rem" }}>
                            {parse(lang.regContactExp)}
                          </span>
                        }
                        arrow
                        arrowSize="big"
                        size="big"
                        inertia
                        style={{
                          fontSize: '1.6rem'
                        }}
                      >
                        <span>
                          <RiQuestionLine size={20} />
                        </span>
                      </Tooltip>
                      <span
                        style={{marginLeft: '1rem', whiteSpace: "nowrap"}}
                      >
                        https://t.me/
                      </span>
                    </>
                  }
                ></Input>
                <Input
                  id={"in-9"}
                  label={lang.regPhone}
                  type={"text"}
                  list="autoCompleteOff"
                  autoComplete="nope"
                  value={phone}
                  onChange={(e) => {
                    const regexp = /^\d+$/;
                    if (regexp.test(e)) {
                      setPhone(e)
                    }
                    else return
                  }}
                  onBlur={() => validatePhone()}
                  error={!!errorStates.phone}
                  maxLength={9}
                  startAdornment={
                    <>
                      <Tooltip
                        html={
                          <span style={{ fontSize: "1.4rem" }}>
                            {parse(lang.regContactExp)}
                          </span>
                        }
                        arrow
                        arrowSize="big"
                        size="big"
                        inertia
                        style={{
                          fontSize: '1.6rem'
                        }}
                      >
                        <span>
                          <RiQuestionLine size={20} />
                        </span>
                      </Tooltip>
                      <span
                        style={{marginLeft: '1rem', whiteSpace: "nowrap"}}
                      >
                        <span style={{display: "flex"}}>
                          +
                          <PhoneCodeSelector
                            label={""}
                            onChange={(o) => setSelectedPhoneExt(o)}
                            value={selectedPhoneExt}                        
                          />
                        </span>
                      </span>
                    </>
                  }
                ></Input>
              </span>
              <p className={styles.Registration__Error__Text}> {errorStates.telegram || errorStates.phone}</p>
            </span>
            <span>
              <span className={styles.Registration__Form__Inline}>
                <Input
                  id={"in-8"}
                  label={`${lang.regAllergy}: `}
                  type={"text"}
                  list="autoCompleteOff"
                  autoComplete="nope"
                  value={allergy}
                  onChange={(e) => setAllergy(e)}
                  maxLength={1000}
                ></Input>
              </span>
            </span>
            <Checkbox
              checked={(e) => setAgreeStates((agreeStates: any) => { return { ...agreeStates, rules: e} })}
              id="chk-2"
              label={
                <span className={styles.Registration__Form__Label}>
                  {lang.regRule1}
                  <Button
                    variant="text"
                    link="/legal/rules"
                  >
                    {lang.regRuleBtn}
                  </Button>
                  {lang.regRule2}
                </span>
              }
            />
            <Checkbox
              checked={(e) => setAgreeStates((agreeStates: any) => { return { ...agreeStates, data: e} })}
              id="chk-3"
              label={
                <span className={styles.Registration__Form__Label}>
                  {lang.regData1}
                  <Button
                    variant="text"
                    link="/legal/data"
                  >
                    {lang.regDataBtn}
                  </Button>
                </span>
              }
            />

            <Input
              id={"password"}
              name={"password"}
              type={"password"}
              list="autoCompleteOff"
              autoComplete="nope"
              value={otherPass}
              onChange={(e) => setOtherPass(e)}
              maxLength={100}
              customClass={styles.Registration__Form__Pass}
            ></Input>
          </div>
          {
            (serverDate != undefined && fromDate != undefined && toDate != undefined) &&
            <div className={styles.Registration__Button}>
              <>
                {
                  (!((serverDate.getTime() > fromDate.getTime()) && (serverDate.getTime() < toDate.getTime()))) &&
                  <p style={{ color: 'red' }}>
                    {`${lang.warnDateLimitReg}`}
                  </p>
                }
                <Button
                  variant="contained"
                  disabled={isButtonActive || isDisabled ||
                    !((serverDate.getTime() > fromDate.getTime()) && (serverDate.getTime() < toDate.getTime()))}
                  onClick={handleButton}
                >
                  {lang.regButton}
                </Button>
              </>
            </div>
          }
        </TextCard>
      </div>
    </>
  )
}

export default Registration;
