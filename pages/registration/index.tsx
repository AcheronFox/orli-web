/* eslint-disable react-hooks/exhaustive-deps */
import CustomDatePicker from "@/comp/CustomDatePicker";
import Input from "@/comp/Input";
import NationalitySelector from "@/comp/NationalitySelector";
import PrimaryButton from "@/comp/PrimaryButton";
import Section from "@/comp/Section"
import { useTranslate } from "@/hooks/useTranslate";
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import styles from "@/styles/pages/Registration.module.scss"
import { useContext, useEffect, useState } from "react";
import crypto from "crypto";
import Router from 'next/router'
import axiosInstance from "@/utils/axiosConfig";
import { IRegistrationDataSave, IRegistrationForm } from "@/models/registration-form.model";
import LinkButton from "@/comp/LinkButton";
import { NextPage } from "next";
import LoadingOverlay from "@/comp/LoadingOverlay";
import { FloatingMessageContext } from "@/hooks/FloatingMessageContext";
import { RiQuestionLine } from "react-icons/ri"
import Tippy from "@tippyjs/react";
import CustomHead from "@/comp/CustomHead";
import createDatePatternFromDate from "@/root/functions/createDatePattern";

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
  const { t, locale } = useTranslate();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [dob, setDoB] = useState<string>("");
  const [nationality, setNationality] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [confEmail, setConfEmail] = useState<string>("");
  const [fursonaName, setFursonaName] = useState<string>("");
  const [fursonaSpecies, setFursonaSpecies] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confPassword, setConfPassword] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [allergy, setAllergy] = useState<string>("");
  const [otherPass, setOtherPass] = useState<string>("");

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
    contact: '',
  });

  const [agreeStates, setAgreeStates] = useState<any>({
    rules: false,
    data: false,
  })

  let timer: NodeJS.Timeout | undefined = undefined;
  let time = 0;
  let message: number | undefined = undefined;

  const { HandleClose, AddFloatingMessage } = useContext(FloatingMessageContext);

  // ===============================================
  // DEFAULTS
  // ===============================================
  useEffect(() => {
    getDefaults()
  }, [])

  const getDefaults = async () => {
    await axiosInstance.get('api/defaults/registration')
    .then((res) => {
      setServerDate(new Date(res.data.serverDate))
      setFromDate(new Date(res.data.fromDate))
      setToDate(new Date(res.data.toDate))
    })
    .catch((err) => {
      return
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
    if (errorStates.contact != "") validateContact()
  }, [contact]);

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
    errorStates.contact && validateContact()
  }, [locale])

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
      setErrorStates((errorStates: any) => { return { ...errorStates, [key]: value } });
      return false;
    } else {
      setErrorStates((errorStates: any) => { return { ...errorStates, [key]: '' } });
      return true
    }
  }

  const validateFirstName = () => {
    return updateState(firstName.trim() == "", "firstName", t("regFirstNameError"))
  }
  const validateLastName = () => {
    return updateState(lastName.trim() == "", "lastName", t("regLastNameError"))
  }
  const validateEmail = () => {
    return updateState(!isEmailValid(email), "email", t("regEmailError"))
  }
  const validateConfEmail = () => {
    return updateState(email.trim().toLowerCase() != confEmail.trim().toLowerCase(), "confEmail", t("regEmailConfError"))
  }
  const validateSonaName = () => {
    return updateState(fursonaName.trim() == "", "fursonaName", t("regSonaNameError"))
  }
  const validateSpecies = () => {
    return updateState(fursonaSpecies.trim() == "", "fursonaSpecies", t("regSonaSpeciesError"))
  }
  const validateDoB = () => {
    return updateState(!dobState, "dob", t("regDateError"))
  }
  const validateNationality = () => {
    return updateState(nationality.trim() == "", "nationality", t("regNationalityError"))
  }
  const validatePass = () => {
    return updateState(!hasLowerCase(password) || !hasUpperCase(password) || !hasNumber(password) || !isLongerThanSix(password), "password", t("regPassError"))
  }
  const validateConfPass = () => {
    return updateState(password.trim() != confPassword.trim(), "confPassword", t("regPassConfError"))
  }
  const validateContact = () => {
    return updateState(contact.trim() == "", "contact", t("regContactErr"))
  }
  
  const validateAge = (state: boolean, strict = false) => {
    if (dob == t("dateFormat") || dob == '') {
      if (strict) {
        setErrorStates((errorStates: any) => { return { ...errorStates, dob: t("regDateError") } });
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
      setErrorStates((errorStates: any) => { return { ...errorStates, dob: t("regInvalidAgeError") } });
      return false;
    }
    
    const tempAge = getAge(tempUtcFormatDOB);
    setAge(tempAge);
    setDoBState(state);
    setUtcFormatDOB(tempUtcFormatDOB);


    if (tempAge < 16) {
      setErrorStates((errorStates: any) => { return { ...errorStates, dob: t("regUnderAgeError") } });
      return false;
    } else if (tempAge >= 110) {
      setErrorStates((errorStates: any) => { return { ...errorStates, dob: t("regInvalidAgeError") } });
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
      validateContact(),
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
      age: age,
      nationality: nationality,
      contact: contact,
      allergy: allergy,
      password: crypto.createHash("sha256").update(password).digest("hex"),
      otherPass: otherPass,
    };

    startTimer();
    setIsLoading(true)
    message = undefined;

    axiosInstance
    .post("api/user/reg", formData)
    .then(() => {
      if (getCookie("registrationData")) {
        deleteCookie("registrationData");
      }
      Router.push({
        pathname: '/registration/success',
        query: {
          name:  fursonaName,
          email: email,
        }
      },
      '/registration/success');
    })
    .catch((err) => {
      if (err.response.status) {
        switch(err.response.status) {
          case (409):
            AddFloatingMessage({"autocloses": true, "type": "Error", "message": t("errRegErrConflict")})
            break;
          case (400):
            AddFloatingMessage({"autocloses": true, "type": "Error", "message": t("errBadRequest")})
            break;
          default:
            AddFloatingMessage({"autocloses": true, "type": "Error", "message": t("errDefault")})
            break;
        }  
      } else {
        AddFloatingMessage({"autocloses": true, "type": "Error", "message": t("errDefault")})
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


  // ====================================================
  // Saves the data of the user when deloading the page,
  // and loads it back into the fields code by Alma
  // ====================================================

  const saveCookie = () => {
    const saveData: IRegistrationDataSave = {
      "FirstName": firstName,
      "LastName": lastName,
      "FursonaName": fursonaName,
      "FursonaSpecies": fursonaSpecies,
      "Email": email,
      "DoB": dob,
      "Nationality": nationality,
      "Contact": contact,
      "Allergy": allergy,
      "OtherPass": otherPass,
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
  },[])
  
  // i hate myself xd - Alma

  useEffect(()=>{
    saveCookie();
  },[firstName, lastName, fursonaName, fursonaSpecies, 
    email, dob, age, nationality, 
    contact, allergy, otherPass])

  // ======================================================
  // Code by Alma ends here, thx for letting me write this!
  // ======================================================

  return (
    <>
      <CustomHead title={t("navRegistration")} />
      <LoadingOverlay isLoading={isLoading} message={`${t("regWait")}`}/>
      <div className={styles.Registration}>
        <div className={styles.Registration__Title}>
            <h1>
              {t("navRegistration")}
            </h1>
        </div>
        <div className={styles.Registration__Content}>
          <Section>
            <div className={styles.Registration__Form}>
                <div className={styles.Registration__Form__Row}>
                  <span>
                    <Input
                      id={"in-1"}
                      label={`${t("regFirstname")}: `}
                      placeholder={t("regFirstname")}
                      list="autoCompleteOff"
                      autoComplete="nope"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      onBlur={() => validateFirstName()}
                      inputClass={`${errorStates.firstName? styles.Registration__Error : ''}`}
                      maxlength={100}
                    ></Input>
                    <p className={styles.Registration__Error__Text}>{errorStates.firstName}</p>
                  </span>

                  <span>
                    <Input
                      id={"in-2"}
                      label={`${t("regLastname")}: `}
                      placeholder={t("regLastname")}
                      list="autoCompleteOff"
                      autoComplete="nope"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      onBlur={() => validateLastName()}
                      inputClass={errorStates.lastName && styles.Registration__Error}
                      maxlength={100}
                    ></Input>
                    <p className={styles.Registration__Error__Text}>{errorStates.lastName}</p>
                  </span>
                </div>
                <span>
                  <CustomDatePicker
                    isDateValid={setDoBState}
                    label={`${t("regDob")}: `}
                    onChange={(e: React.SetStateAction<string>) => setDoB(e)}
                    value={dob}
                    onBlur={validateDoB}
                    inputClass={errorStates.dob && styles.Registration__Error}
                  ></CustomDatePicker>
                  <p className={styles.Registration__Error__Text}>{errorStates.dob}</p>
                </span>
                
                <span>
                  <NationalitySelector
                    label={`${t("regNationality")}: `}
                    onChange={setNationality}
                    value={nationality}
                    onBlur={() => validateNationality()}
                  ></NationalitySelector>
                  <p className={styles.Registration__Error__Text}>{errorStates.nationality}</p>
                </span>
                
                <span>
                  <Input
                    id={"email"}
                    name={"email"}
                    label={`${t("regEmail")}: `}
                    placeholder={t("regEmail")}
                    type={"email"}
                    list="autoCompleteOff"
                    autoComplete="nope"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => validateEmail()}
                    inputClass={errorStates.email && styles.Registration__Error}
                    maxlength={100}
                  ></Input>
                  <p className={styles.Registration__Error__Text}>{errorStates.email}</p>
                </span>
                
                <span>
                  <Input
                    id={"in-3"}
                    label={`${t("regEmailConfirm")}: `}
                    placeholder={t("regEmailConfirm")}
                    type={"email"}
                    list="autoCompleteOff"
                    autoComplete="nope"
                    value={confEmail}
                    onChange={(e) => setConfEmail(e.target.value)}
                    onBlur={() => validateConfEmail()}
                    inputClass={errorStates.confEmail && styles.Registration__Error}
                    maxlength={100}
                  ></Input>
                  <p className={styles.Registration__Error__Text}> {errorStates.confEmail}</p>
                </span>
                
    
                <div className={styles.Registration__Form__Row}>
                  <span>
                    <Input
                      id={"in-4"}
                      label={`${t("regFursonaName")}: `}
                      placeholder={t("regFursonaName")}
                      list="autoCompleteOff"
                      autoComplete="nope"
                      value={fursonaName}
                      onChange={(e) => setFursonaName(e.target.value)}
                      onBlur={() => validateSonaName()}
                      inputClass={errorStates.fursonaName && styles.Registration__Error}
                      maxlength={10}
                    ></Input>
                    <p className={styles.Registration__Error__Text}>{errorStates.fursonaName}</p>
                  </span>
                  
                  <span>
                    <Input
                      id={"in-5"}
                      label={`${t("regSpecies")}: `}
                      placeholder={t("regSpecies")}
                      list="autoCompleteOff"
                      autoComplete="nope"
                      value={fursonaSpecies}
                      onChange={(e) => setFursonaSpecies(e.target.value)}
                      onBlur={() => validateSpecies()}
                      inputClass={errorStates.fursonaSpecies && styles.Registration__Error}
                      maxlength={10}
                    ></Input>
                    <p className={styles.Registration__Error__Text}>{errorStates.fursonaSpecies}</p>
                  </span>
                </div>

                <div className={styles.Registration__Form__Row}>
                  <span>
                    <Input
                      id={"password"}
                      name={"password"}
                      label={`${t("regPassword")}: `}
                      placeholder={t("regPassword")}
                      type={"password"}
                      list="autoCompleteOff"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => validatePass()}
                      inputClass={errorStates.password && styles.Registration__Error}
                      maxlength={100}
                    ></Input>
                    <p className={styles.Registration__Error__Text}>{errorStates.password}</p>
                  </span>
                  
                  <span>
                    <Input
                      id={"in-6"}
                      label={`${t("regPasswordConfirm")}: `}
                      placeholder={t("regPasswordConfirm")}
                      type={"password"}
                      list="autoCompleteOff"
                      autoComplete="new-password"
                      value={confPassword}
                      onChange={(e) => setConfPassword(e.target.value)}
                      onBlur={() => validateConfPass()}
                      inputClass={errorStates.confPassword && styles.Registration__Error}
                      maxlength={100}
                    ></Input>
                    <p className={styles.Registration__Error__Text}>{errorStates.confPassword}</p>
                  </span>
                </div>
                <span>
                  <span className={styles.Registration__Form__Inline}>
                    <Tippy content={t("regContactExp")}>
                      <span>
                        <RiQuestionLine size={20} />
                      </span>
                    </Tippy>
                    <Input
                      id={"in-7"}
                      label={`${t("regContact")}: `}
                      placeholder={t("regContact")}
                      type={"text"}
                      list="autoCompleteOff"
                      autoComplete="nope"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      onBlur={() => validateContact()}
                      inputClass={errorStates.contact && styles.Registration__Error}
                      maxlength={100}
                    ></Input>
                  </span>
                  <p className={styles.Registration__Error__Text}> {errorStates.contact}</p>
                </span>
                <span>
                  <span className={styles.Registration__Form__Inline}>
                    <Input
                      id={"in-8"}
                      label={`${t("regAllergy")}: `}
                      placeholder={t("regAllergy")}
                      type={"text"}
                      list="autoCompleteOff"
                      autoComplete="nope"
                      value={allergy}
                      onChange={(e) => setAllergy(e.target.value)}
                      maxlength={1000}
                    ></Input>
                  </span>
                </span>
                <Input
                  type="checkbox"
                  checked={(e) => setAgreeStates((agreeStates: any) => { return { ...agreeStates, rules: e} })}
                  id="chk-2"
                  label={<span className={styles.Registration__Form__Label} >{t("regRule1")}<LinkButton isInternal={true} text={t("regRuleBtn")} link="/legal/rules"></LinkButton>{t("regRule2")}</span>}
                ></Input>
                <Input
                  type="checkbox"
                  checked={(e) => setAgreeStates((agreeStates: any) => { return { ...agreeStates, data: e} })}
                  id="chk-3"
                  label={<span className={styles.Registration__Form__Label} >{t("regData1")}<LinkButton isInternal={true} text={t("regDataBtn")} link="/legal/data"></LinkButton></span>}
                ></Input>

                <Input
                  id={"password"}
                  name={"password"}
                  type={"password"}
                  list="autoCompleteOff"
                  autoComplete="nope"
                  value={otherPass}
                  onChange={(e) => setOtherPass(e.target.value)}
                  maxlength={100}
                  className={styles.Registration__Form__Pass}
                ></Input>
            </div>
            {
              <div className={styles.Registration__Button}>
                <>
                  
                  <PrimaryButton
                  disabled={isButtonActive || isDisabled}
                  text={t("regButton")}
                  onClick={handleButton} 
                  />
                </>
              </div>
            }
          </Section>
        </div>
      </div>
    </>
  )
}

export default Registration;