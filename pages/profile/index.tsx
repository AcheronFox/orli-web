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
import CustomHead from "@/comp/CustomHead";
import { IRoom } from "@/models/room.model";
import CustomBackground from "@/comp/CustomBackground";
import createDatePatternFromDate from "@/root/functions/createDatePattern";

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
  const [userRoom, setUserRoom] = useState<IRoom>()
  const [password, setPassword] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [fursonaName, setFursonaName] = useState<string>("");
  const [species, setSpecies] = useState<string>("");
  const [isFursuiter, setIsFursuiter] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [uploadLimit, setUploadLimit] = useState<Date>()
  const [errorStates, setErrorStates] = useState<any>({
    password: '',
    contact: '',
    fursonaName: '',
    species: ''
  });

  useEffect(() => {
    if (user) {
      setIsFursuiter(user.isFursuiter)
      setContact(user.contact)
      setFursonaName(user.fursonaName)
      setSpecies(user.fursonaSpecies)
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!didUserInit) return
    if (!user) {
      Router.push('/')
    }
    else {
      getUser()
      getUserRoom()
      getUploadLimit()
    }
  }, [didUserInit])

  const getUserRoom = async () => {
    await axiosInstance.get("api/user/room")
    .then((res) => {
      setUserRoom(res.data)
    })
    .catch(() => {
      setUserRoom(undefined)
    })
    .finally(() => setIsLoading(false))
  }
  const getUploadLimit = async () => {
    await axiosInstance.get("api/defaults/profile/upload")
    .then((res) => {
      setUploadLimit(new Date(res.data.toDate))
    })
    .catch(() => {
      setUserRoom(undefined)
    })
    .finally(() => setIsLoading(false))
  }

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
    if (errorStates.fursonaName != "") validateFursonaName()
  }, [fursonaName]);
  useEffect(() => {
    if (errorStates.species != "") validateSpecies()
  }, [species]);
  useEffect(() => {
    errorStates.password && validatePass()
    errorStates.contact && validateContact()
    errorStates.fursonaName && validateFursonaName()
    errorStates.species && validateSpecies()
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
    return updateState(contact.trim() == "", "contact", t("regContactErr"))
  }
  const validateFursonaName = () => {
    return updateState(fursonaName.trim() == "", "fursonaName", t("regSonaNameError"))
  }
  const validateSpecies = () => {
    return updateState(species.trim() == "", "species", t("regSonaSpeciesError"))
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
    .catch((err) => {
      if (err.response && err.response.status == 413) {
        AddFloatingMessage({
          autocloses: true,
          type: "Error",
          message: t("errTooLarge"),
        });
      } else {
        AddFloatingMessage({
          autocloses: true,
          type: "Error",
          message: t("errDefault"),
        });
      }
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
    const isFusronaNameChanged = user?.fursonaName != fursonaName.trim()
    const isSpeciesChanged = user?.fursonaSpecies != species.trim()
    if (!isFusronaNameChanged && !isSpeciesChanged && !isSuiterChanged && !isContactChanged && !isPassChanged || isDisabled || !user) {
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
      fursonaName: isFusronaNameChanged? fursonaName : undefined,
      fursonaSpecies: isSpeciesChanged? species : undefined,
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
    <CustomHead title={t("navProfile")} />
    <LoadingOverlay isLoading={isLoading}/>
    <CustomBackground />
    {
      (fileDataURL && uploadLimit) &&
      <div className={styles.ImagePreview}>
        <div className={styles.ImagePreview__Top}>
          <span>
            {t("profImageUpload")}<br />
            <b>{`${t("profImageLimit1")} ${createDatePatternFromDate(uploadLimit)} ${t("profImageLimit2")}`}</b>
          </span>
        </div>
        <div className={styles.ImagePreview__Center}>
          <ReactCrop className={styles.ImagePreview__Crop} crop={crop} onChange={onCropChange} aspect={1/1} minHeight={10} minWidth={10}>
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
            <SecondaryButton text={t("profCancel")} type="left" classType={"danger"} onClick={cancelImage}/>
            <SecondaryButton disabled={(crop && image)? Math.floor((crop.width/100) * image.naturalWidth) <= 0 && Math.floor((crop.height/100) * image.naturalHeight) <= 0 : true} text={t("profConfirm")} classType={"success"} type="right" onClick={uploadImage}/>
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
                  <source srcSet={`${user.picture? (`/uploads/${user.picture.split('.')[0]}_x1.${user.picture.split('.')[1]} 1x, /uploads/${user.picture.split('.')[0]}_x2.${user.picture.split('.')[1]} 2x`) : '/Default_profile_x1.jpg 1x, /Default_profile_x2.jpg 2x,'}`} media="(max-width: 37.5em)" />
                  <img srcSet={`${user.picture? (`/uploads/${user.picture.split('.')[0]}_x1.${user.picture.split('.')[1]} 1x, /uploads/${user.picture.split('.')[0]}_x2.${user.picture.split('.')[1]} 2x`) : '/Default_profile_x1.jpg 1x, /Default_profile_x2.jpg 2x,'}`} alt="User Picture" src="/Default_profile_x2.jpg" loading="lazy" />  
                  {
                    uploadProgress &&
                    <div className={styles.Profile__Header__Picture__Overlay}>
                      <ProgressBar completed={uploadProgress} bgColor={styles.primaryColor} baseBgColor={styles.grey2} customLabel={uploadProgress == 100? t("profProcessing") : undefined}/>
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
                { (user.isFursuiter || user.sponsorLevel && user.sponsorLevel > 0) &&
                  <div className={styles.Profile__Header__Badges}>
                    {
                      user.isFursuiter &&
                      <Tippy className={styles.Tooltip} content={t("partSuiter")}>
                          <span>
                              <FursuiterIcon style={{"fill": "#F741D5"}} />
                          </span>
                      </Tippy>
                    }
                    {
                      (user.isPaid == true && user.sponsorLevel && user.sponsorLevel > 0) &&
                      <Tippy className={styles.Tooltip} content={(user.sponsorLevel==2)? t("ticketSuperSponsor") : t("partSponsor")}>
                          <span>
                              <SponsorIcon style={{"fill": "#F741D5"}} />
                          </span>
                      </Tippy>
                    }
                  </div>
                }
              </div>
              <div className={styles.Profile__Header__Bottom}>
                <span className={styles.Profile__Header__Bottom__Input}>
                  <SecondaryButton type="label" text={t("profPicture")} id={"file"}>
                    <input type="file" id="file" accept="image/jpg, image/jpeg, image/png, image/webp" onChange={(e) => imageChangeHandler(e)}/>
                  </SecondaryButton>
                </span>
                <Tippy disabled={!(user.TicketKey != null && user.isPaid)} content={t("profTicketDisabled")}>  
                  <span className={styles.Profile__Header__Bottom__Input}>
                    <SecondaryButton disabled={(user.TicketKey != null && user.isPaid)} type="left" text={t("navTickets")} link={"profile/tickets"} />
                  </span>
                </Tippy>
                <Tippy disabled={((user.TicketKey != null && user.isPaid && user.ticketType === '2'))} content={
                  user.ticketType !== null? (user.ticketType == '2'? (user.isPaid? '' : t("profTicketNotVerified")) : t("profNotSelectable")) : (user.isPaid? '' : t("profTicketNotVerified"))
                }>
                  <span className={styles.Profile__Header__Bottom__Input}>
                    <SecondaryButton disabled={!((user.TicketKey != null && user.isPaid && user.ticketType === '2'))} type="right" text={t("navRooms")} link={"profile/rooms"} />
                  </span>
                </Tippy>
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
                    label={`${t("regFursonaName")}: `}
                    placeholder={t("regFursonaName")}
                    list="autoCompleteOff"
                    autoComplete="disabled"
                    value={fursonaName}
                    onChange={(e) => {setFursonaName(e.target.value); setIsChanged(true);}}
                    onBlur={() => validateFursonaName()}
                    inputClass={errorStates.fursonaName && styles.Profile__Body__Error}
                    maxlength={10}
                  ></Input>
                  <p className={styles.Profile__Body__Error__Text}>{errorStates.fursonaName}</p>
                </span>
                <span className={styles.Profile__Body__Form__Row}>
                  <Input
                    label={`${t("regSpecies")}: `}
                    placeholder={t("regSpecies")}
                    list="autoCompleteOff"
                    autoComplete="disabled"
                    value={species}
                    onChange={(e) => {setSpecies(e.target.value); setIsChanged(true);}}
                    onBlur={() => validateSpecies()}
                    inputClass={errorStates.species && styles.Profile__Body__Error}
                    maxlength={10}
                  ></Input>
                  <p className={styles.Profile__Body__Error__Text}>{errorStates.species}</p>
                </span>
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
                    maxlength={100}
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
                    maxlength={100}
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
                <span className={styles.Profile__Body__Right__Row_left}>{`${t("regFirstname")}: `}</span>
                <span>{user.firstName}</span>
              </div>
              <div className={styles.Profile__Body__Right__Row}>
                <span className={styles.Profile__Body__Right__Row_left}>{`${t("regLastname")}: `}</span>
                <span>{user.lastName}</span>
              </div>
              <div className={styles.Profile__Body__Right__Row}>
                <span className={styles.Profile__Body__Right__Row_left}>{`${t("regEmail")}: `}</span>
                <span>{user.email}</span>
              </div>
              <div className={styles.Profile__Body__Right__Row}>
                <span className={styles.Profile__Body__Right__Row_left}>{`${t("regNationality")}: `}</span>
                <span>{getNationality(user.nationality, locale)?.name}</span>
              </div>
              <div className={styles.Profile__Body__Right__Row}>
                <span className={styles.Profile__Body__Right__Row_left}>{`${t("profPayment")}: `}</span>
                {
                  (user.TicketKey == null) &&
                  <span style={{color: "red"}}>{t("profNotSelected")}</span>
                }
                {
                  (user.TicketKey != null && user.isPaid == false) &&
                  <span style={{color: "red"}}>{t("profNotPaid")}</span>
                }
                {
                  (user.TicketKey != null && user.isPaid == true) &&
                  <span style={{color: "green"}}>{t("profPaid")}</span>
                }
              </div>
              <div className={styles.Profile__Body__Right__Row}>
                <span className={styles.Profile__Body__Right__Row_left}>{`${t("profRoom")}: `}</span>
                {
                  (!user.AccomodationKey && (user.ticketType !== null && user.ticketType !== '2')) &&
                  <span style={{textAlign: "right"}}>{t("profNotSelectable")}</span>
                }
                {
                  (!user.AccomodationKey && (user.ticketType === '2' || user.ticketType === null)) &&
                  <span style={{color: "red"}}>{t("profNotSelected")}</span>
                }
                {
                  (user.AccomodationKey && userRoom) &&
                  <span style={{textAlign: "right"}}>
                    <span>{`${userRoom.customName? (`${userRoom.customName} (${userRoom.roomNumber})`) : (`${userRoom.roomNumber}`)}`}</span><br />
                    <span>{`${userRoom.occupantCount} / ${userRoom.size}`}</span>
                  </span>
                }
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