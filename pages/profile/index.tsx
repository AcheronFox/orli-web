/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import styles from "@/styles/pages/Profile.module.scss"
import { useTranslate } from "@/hooks/useTranslate";
import { NextPage } from "next";
import { useUser } from "@/hooks/useUser";
import SecondaryButton from "@/comp/SecondaryButton";
import Tippy from "@tippyjs/react";
import FursuiterIcon from "@/comp/svg/FursuiterIcon";
import SponsorIcon from "@/comp/svg/SponsorIcon";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import ReactCrop, { centerCrop, Crop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import Router from "next/router";
import axiosInstance from "@/utils/axiosConfig";
import { AxiosProgressEvent } from "axios";
import ProgressBar from "@ramonak/react-progress-bar";
import { FloatingMessageContext } from "@/hooks/FloatingMessageContext";
import Input from "@/comp/Input";
import PrimaryButton from "@/comp/PrimaryButton";
import { IUpdateForm } from "@/models/update.model";
import getNationality from "functions/getNationality";
import LoadingOverlay from "@/comp/LoadingOverlay";
import crypto from "crypto";

type Props = {}
const imageMimeType = /image\/(png|jpg|jpeg|webp)/i;

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

const Profile: NextPage<Props> = (props: Props) => {
  const { t, locale } = useTranslate();
  const { user, didUserInit, getUser, updateUser } = useUser();
  const { AddFloatingMessage } = useContext(FloatingMessageContext);
  
  const [uploadProgress, setUploadProgress] = useState<number>()
  const [image, setImage] = useState<any>()
  const [file, setFile] = useState<File>()
  const [fileDataURL, setFileDataURL] = useState<string>()
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    x: 25,
    y: 25,
    width: 50,
    height: 50,
  })
  const [isChanged, setIsChanged] = useState<boolean>(false)
  const [password, setPassword] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [isFursuiter, setIsFursuiter] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [errorStates, setErrorStates] = useState<any>({
    password: '',
    contact: '',
  });

  useEffect(() => {
    if (user) {
      setIsFursuiter(user.isFursuiter)
      setContact(user.contact)
    }
  }, [user])

  useEffect(() => {
    if (!didUserInit) return
    if (!user) {
      Router.push('/')
    }
  }, [didUserInit])

  // ===============================================
  // USEEFFECT UPDATES
  // ===============================================
  useEffect(() => {
    if (errorStates.password != "") validatePass()
  }, [password]);
  useEffect(() => {
    if (errorStates.contact != "") validateContact()
  }, [contact]);

  useEffect(() => {
    errorStates.password && validatePass()
    errorStates.contact && validateContact()
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

  const validatePass = () => {
    if (password.trim() == "") {
      setErrorStates((errorStates: any) => { return { ...errorStates, ["password"]: '' } });
      return true
    }
    return updateState(!hasLowerCase(password) || !hasUpperCase(password) || !hasNumber(password) || !isLongerThanSix(password), "password", t("regPassError"))
  }
  const validateContact = () => {
    console.log(user)
    return updateState(contact.trim() == "", "contact", t("regContactErr"))
  }

  // ===============================================
  // IMAGE HANDLING
  // ===============================================
  const imageChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const file = e.target.files[0]
    if (!file.type.match(imageMimeType)) {
      AddFloatingMessage({"autocloses": true, "type": "Error", "message": t("profUnsupportedType")})
      return;
    }
    setFile(file);
  }

  useEffect(() => {
    let fileReader: FileReader; 
    let isCancel = false;
    if (file) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const result = e.target?.result;
        if (result && !isCancel) {
          setFileDataURL(result.toString())
        }
      }
      fileReader.readAsDataURL(file);
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    }

  }, [file]);

  const onImageLoad = (e: any) => {
    const width = e.currentTarget.width;
    const height = e.currentTarget.height;
    
    const naturalWidth = e.currentTarget.naturalWidth
    const naturalHeight = e.currentTarget.naturalHeight
    const newCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 50,
        },
        1 / 1,
        width,
        height
      ),
      width,
      height
    )

    setImage({naturalWidth, naturalHeight})
    setCrop({...newCrop})
  }
  const onCropChange = (crop: any, percentCrop: any) => setCrop(percentCrop)

  const cancelImage = () => {
    setFile(undefined)
    setFileDataURL(undefined)
  }

  const uploadImage = () => {
    if (!file) return
    setFileDataURL(undefined)

    const cropData = {
      x: (crop.x / 100) * image.naturalWidth,
      y: (crop.y / 100) * image.naturalHeight,
      width: (crop.width / 100) * image.naturalWidth,
      height: (crop.height / 100) * image.naturalHeight,
    }

    const fd = new FormData();
    fd.append('file', file, file.name);
    fd.append('crop', JSON.stringify(cropData));

    axiosInstance.post('api/user/upload', fd, {
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (!progressEvent.total) return
        const uploadPercentage = Math.round((progressEvent.loaded / progressEvent.total) * 100)
        setUploadProgress(uploadPercentage)
      },
    })
    .finally(() => {
      setUploadProgress(undefined)
      setFile(undefined)
      setImage(undefined)
      getUser()
    })
  }

  // ===============================================
  // BACKEND HANDLING
  // ===============================================
  const handleButton = async () => {
    const isPassChanged = password.trim() != ""
    const isContactChanged = user?.contact != contact.trim()
    const isSuiterChanged = user?.isFursuiter != isFursuiter
    if (!isSuiterChanged && !isContactChanged && !isPassChanged || isDisabled || !user) {
      setIsChanged(false)
      return
    }

    const finalCheck: boolean[] = []
    finalCheck.push(
      isPassChanged? validatePass() : true,
      isContactChanged? validateContact() : true,
    )

    if (finalCheck.includes(false)) {
      return;
    }
    setIsDisabled(true)
    setIsLoading(true)

    const form: IUpdateForm = {
      contact: isContactChanged? contact : undefined,
      isFursuiter: isSuiterChanged? isFursuiter : undefined,
      password: isPassChanged? crypto.createHash("sha256").update(password.trim()).digest("hex") : undefined,
    }

    await updateUser(form, () => {
      setIsLoading(false);
      setIsDisabled(false);
      setIsChanged(false);
      setPassword('')
    })
  }

  return (
    <>
    <LoadingOverlay isLoading={isLoading}/>
    {
      fileDataURL &&
      <div className={styles.ImagePreview}>
        <div className={styles.ImagePreview__Top}>
          {t("profImageUpload")}
        </div>
        <div className={styles.ImagePreview__Center}>
          <ReactCrop className={styles.ImagePreview__Crop} crop={crop} onChange={onCropChange} aspect={1/1}>
            <img className={styles.ImagePreview__Image} src={fileDataURL} alt="Image Preview" onLoad={(e) => onImageLoad(e)} />
          </ReactCrop>
        </div>
        <div className={styles.ImagePreview__Bottom}>
          <span>
            {image &&
            <h3>{`${Math.floor((crop.width / 100) * image.naturalWidth)} x ${Math.floor((crop.height / 100) * image.naturalHeight)}`}</h3>
            }
          </span>
          <div>
            <SecondaryButton text="Cancel" type="left" onClick={cancelImage}/>
            <SecondaryButton text="Confirm" type="right" onClick={uploadImage}/>
          </div>
        </div>
      </div>
    }
    <div className={styles.Profile}>
      {
        user &&
        <div className={styles.Profile__Content}>
          <section className={styles.Profile__Header}>
            <div className={styles.Profile__Header__Picture}>
              <picture>
                <source srcSet={`${user.picture? (`uploads/${user.picture.split('.')[0]}_x1.jpg 1x, uploads/${user.picture.split('.')[0]}_x2.jpg 2x`) : 'Default_profile_x1.jpg 1x, Default_profile_x2.jpg 2x,'}`} media="(max-width: 37.5em)" />
                <img srcSet={`${user.picture? (`uploads/${user.picture.split('.')[0]}_x1.jpg 1x, uploads/${user.picture.split('.')[0]}_x2.jpg 2x`) : 'Default_profile_x1.jpg 1x, Default_profile_x2.jpg 2x,'}`} alt="Participant Picture" src="Default_profile_x2.jpg" loading="lazy" />
                  {
                    uploadProgress &&
                    <div className={styles.Profile__Header__Picture__Overlay}>
                      <ProgressBar completed={uploadProgress} bgColor={styles.primaryColor} baseBgColor={styles.grey2}/>
                    </div>
                  }
              </picture>
            </div>
            <div className={styles.Profile__Header__Content}>
              <div className={styles.Profile__Header__Top}>
                <div className={styles.Profile__Header__Title}>
                  <h2>
                    {user.fursonaName}
                  </h2>
                  <h3>
                    {user.fursonaSpecies}
                  </h3>
                </div>
                { (user.isFursuiter == true || user.SponsorLevel > 0) &&
                  <div className={styles.Profile__Header__Badges}>
                    {
                      (user.isFursuiter == true) &&
                      <Tippy className={styles.Tooltip} content={t("partSuiter")}>
                          <span>
                              <FursuiterIcon style={{"fill": "#F741D5"}} />
                          </span>
                      </Tippy>
                    }
                    {
                      (user.SponsorLevel > 0) &&
                      <Tippy className={styles.Tooltip} content={t("partSponsor")}>
                          <span>
                              <SponsorIcon style={{"fill": "#F741D5"}} />
                          </span>
                      </Tippy>
                    }
                  </div>
                }
              </div>
              <div className={styles.Profile__Header__Bottom}>
                <SecondaryButton type="label" text={t("profPicture")} id={"file"}>
                  <input type="file" id="file" accept="image/jpg, image/jpeg, image/png, image/webp" onChange={(e) => imageChangeHandler(e)}/>
                </SecondaryButton>
                <SecondaryButton type="left" text={t("navTickets")} link={"profile/tickets"} />
                <SecondaryButton type="right" text={t("navRooms")} link={"profile/rooms"} />
              </div>
            </div>
          </section>
          <section className={styles.Profile__Body}>
            <div className={styles.Profile__Body__Left}>
              <h3>
                {t("profData")}
              </h3>
              <div className={styles.Profile__Body__Form}>
                <span className={styles.Profile__Body__Form__Row}>
                  <Input
                    label={`${t("profPassword")}: `}
                    placeholder={t("profPassword")}
                    type={"password"}
                    list="autoCompleteOff"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => {setPassword(e.target.value); setIsChanged(true);}}
                    onBlur={() => validatePass()}
                    inputClass={errorStates.password && styles.Profile__Body__Error}
                  ></Input>
                  <p className={styles.Profile__Body__Error__Text}>{errorStates.password}</p>
                </span>
                <span className={styles.Profile__Body__Form__Row}>
                  <Input
                    label={`${t("regContact")}: `}
                    placeholder={t("regContact")}
                    type={"text"}
                    list="autoCompleteOff"
                    autoComplete="nope"
                    value={contact}
                    onChange={(e) => {setContact(e.target.value); setIsChanged(true);}}
                    onBlur={() => validateContact()}
                    inputClass={errorStates.contact && styles.Profile__Body__Error}
                  ></Input>
                  <p className={styles.Profile__Body__Error__Text}> {errorStates.contact}</p>
                </span>
                <span className={styles.Profile__Body__Form__Checkbox}>
                  <Input
                    type="checkbox"
                    checkBoxValue={isFursuiter}
                    checked={(e) => {setIsFursuiter(e); setIsChanged(true);}}
                    id="chk-3"
                    label={t("profSuiter")}
                  ></Input>
                </span>
                <div className={styles.Profile__Body__Button}>
                  <PrimaryButton
                    disabled={!isChanged}
                    text={t("profSave")}
                    onClick={handleButton}
                  />
                </div>
              </div>
            </div>
            <div className={styles.Profile__Body__Right}>
              <h3>
                {t("profOverview")}
              </h3>
              <div className={styles.Profile__Body__Right__Row}>
                <span>{`${t("regFirstname")}: `}</span>
                <span>{user.firstName}</span>
              </div>
              <div className={styles.Profile__Body__Right__Row}>
                <span>{`${t("regLastname")}: `}</span>
                <span>{user.lastName}</span>
              </div>
              <div className={styles.Profile__Body__Right__Row}>
                <span>{`${t("regEmail")}: `}</span>
                <span>{user.email}</span>
              </div>
              <div className={styles.Profile__Body__Right__Row}>
                <span>{`${t("regNationality")}: `}</span>
                <span>{getNationality(user.nationality, locale)?.name}</span>
              </div>
              <div className={styles.Profile__Body__Right__Row}>
                <span>{`${t("profPayment")}: `}</span>
                <span>null</span>
              </div>
              <div className={styles.Profile__Body__Right__Row}>
                <span>{`${t("profRoom")}: `}</span>
                <span>null</span>
              </div>
            </div>
          </section>
        </div>
      }
      </div>
    </>
  )
}

export default Profile;