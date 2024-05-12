/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import styles from "@/styles/pages/Profile.module.scss"
import { NextPage } from "next";
import FursuiterIcon from "@/comp/svg/FursuiterIcon";
import SponsorIcon from "@/comp/svg/SponsorIcon";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import ReactCrop, { centerCrop, Crop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import Router from "next/router";
import { AxiosProgressEvent } from "axios";
import ProgressBar from "@ramonak/react-progress-bar";
import { IUpdateForm } from "@/models/update.model";
import crypto from "crypto";
import { IRoom } from "@/models/room.model";
import useTranslate from "@/hooks/translate/useTranslate";
import { useUser } from "@/hooks/user/useUser";
import useNotification from "@/hooks/notification/useNotification";
import axiosInstance from "@/functions/utils/axiosConfig";
import CustomHead from "@/comp/utils/CustomHead";
import LoadingOverlay from "@/comp/utils/LoadingOverlay";
import { BarLoader } from "react-spinners";
import variables from "@/styles/abstracts/exports.module.scss"
import createDatePatternFromDate from "@/functions/utils/createDatePattern";
import Button from "@/comp/button/Button";
import ButtonGroup from "@/comp/button/ButtonGroup";
import { Tooltip } from "react-tippy";
import Input from "@/comp/input/Input";
import Checkbox from "@/comp/input/Checkbox";
import Picture from "@/comp/utils/Picture";
import PhoneCodeSelector from "@/comp/input/PhoneCodeSelector";
import { RiQuestionLine } from "react-icons/ri";

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
  const { lang, currLang } = useTranslate();
  const { user, didUserInit, getUser, updateUser } = useUser();
  const { addNotification } = useNotification()
  
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
  const fileInputRef = useRef<any>()
  const [isChanged, setIsChanged] = useState<boolean>(false)
  const [userRoom, setUserRoom] = useState<IRoom>()
  const [password, setPassword] = useState<string>("");
  const [fursonaName, setFursonaName] = useState<string>("");
  const [species, setSpecies] = useState<string>("");
  const [isFursuiter, setIsFursuiter] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [uploadLimit, setUploadLimit] = useState<Date>()
  const [errorStates, setErrorStates] = useState<any>({
    password: '',
    fursonaName: '',
    species: '',
  });

  useEffect(() => {
    if (user) {
      setIsFursuiter(user.fursona.hasFursuit)
      setFursonaName(user.fursona.name)
      setSpecies(user.fursona.species)
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
    await axiosInstance.get("api/v2/defaults/profile")
    .then((res) => {
      setUploadLimit(new Date(res.data.uploadToDate))
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
    if (errorStates.fursonaName != "") validateFursonaName()
  }, [fursonaName]);
  useEffect(() => {
    if (errorStates.species != "") validateSpecies()
  }, [species]);
  useEffect(() => {
    errorStates.password && validatePass()
    errorStates.fursonaName && validateFursonaName()
    errorStates.species && validateSpecies()
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

  const validatePass = () => {
    if (password.trim() == "") {
      setErrorStates((errorStates: any) => { return { ...errorStates, ["password"]: '' } });
      return true
    }
    return updateState(!hasLowerCase(password) || !hasUpperCase(password) || !hasNumber(password) || !isLongerThanSix(password), "password", lang.regPassError)
  }
  const validateFursonaName = () => {
    return updateState(fursonaName.trim() == "", "fursonaName", lang.regSonaNameError)
  }
  const validateSpecies = () => {
    return updateState(species.trim() == "", "species", lang.regSonaSpeciesError)
  }

  // ===============================================
  // IMAGE HANDLING
  // ===============================================
  const imageChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const file = e.target.files[0]
    if (!file.type.match(imageMimeType)) {
      addNotification({
        message: lang.profUnsupportedType,
        type: "error"
      })
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
        addNotification({
          message: lang.errFileTooLarge,
          type: "error"
        })
      } else {
        addNotification({
          message: lang.errDefault,
          type: "error"
        })
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
    const isSuiterChanged = user?.fursona.hasFursuit != isFursuiter
    const isFusronaNameChanged = user?.fursona.name != fursonaName.trim()
    const isSpeciesChanged = user?.fursona.species != species.trim()
    if (!isFusronaNameChanged && !isSpeciesChanged && !isSuiterChanged && !isPassChanged || isDisabled || !user) {
      setIsChanged(false)
      return
    }

    const finalCheck: boolean[] = []
    finalCheck.push(
      isPassChanged? validatePass() : true,
    )

    if (finalCheck.includes(false)) {
      return;
    }
    setIsDisabled(true)
    setIsLoading(true)

    const form: IUpdateForm = {
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
    <CustomHead title={lang.navProfile} />
    <LoadingOverlay isLoading={isLoading}>
      <BarLoader
          color={variables.secondaryColor}
        />
    </LoadingOverlay>
    {
      (fileDataURL && uploadLimit) &&
      <div className={styles.ImagePreview}>
        <div className={styles.ImagePreview__Top}>
          <span>
            {lang.profImageUpload}<br />
            <b>{`${lang.profImageLimit1} ${createDatePatternFromDate(uploadLimit)} ${lang.profImageLimit2}`}</b>
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
            <ButtonGroup>
              <Button
                variant="outlined"
                color="error"
                onClick={cancelImage}
              >
                {lang.profCancel}
              </Button>
              <Button
                variant="outlined"
                color="success"
                onClick={uploadImage}
                disabled={(crop && image)? Math.floor((crop.width/100) * image.naturalWidth) <= 0 && Math.floor((crop.height/100) * image.naturalHeight) <= 0 : true}
              >
                {lang.profConfirm}
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </div>
    }
    <div className={styles.Profile__Background} />
    <div className={styles.Profile}>
      {
        user &&
        <div className={styles.Profile__Content}>
          <section className={styles.Profile__Header}>
            <div className={styles.Profile__Header__Picture}>
              {
                (user.fursona.pathToPictureFile)?
                <Picture
                  defaultSrc={`${process.env.NODE_ENV == "development"? `uploads/${user.fursona.pathToPictureFile}` : `${process.env.DOMAIN_ROOT}uploads/${user.fursona.pathToPictureFile}`}`}
                  sizes="(max-width: 1400px) 100vw, 40vw"
                  alt="User Image"
                />
                :
                <Picture
                  defaultSrc="Default_profile.jpg"
                  sizes="(max-width: 1400px) 100vw, 40vw"
                  alt="User Image"
                />
              }
              {
                uploadProgress &&
                <div className={styles.Profile__Header__Picture__Overlay}>
                  <ProgressBar completed={uploadProgress} bgColor={styles.primaryColor} baseBgColor={styles.grey2} customLabel={uploadProgress == 100? lang.profProcessing : undefined}/>
                </div>
              }
            </div>
            <div className={styles.Profile__Header__Content}>
              <div className={styles.Profile__Header__Top}>
                <div className={styles.Profile__Header__Title}>
                  <h2>
                    {user.fursona.name}
                  </h2>
                  <h3>
                    {user.fursona.species}
                  </h3>
                </div>
                { (user.fursona.hasFursuit || user.ticket?.sponsorLevel && user.ticket.sponsorLevel != "None") &&
                  <div className={styles.Profile__Header__Badges}>
                    {
                      (user.fursona.hasFursuit == true) &&
                      <Tooltip
                        html={
                          <span style={{ fontSize: "1.4rem" }}>
                            {lang.partSuiter}
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
                          <FursuiterIcon style={{fill: variables.primaryColor}} />
                        </span>
                      </Tooltip>
                    }
                    {
                      (user.ticket?.isPaid == true && user.ticket?.sponsorLevel && user.ticket.sponsorLevel != "None") &&
                      <Tooltip
                        html={
                          <span style={{ fontSize: "1.4rem" }}>
                            {(user.ticket.sponsorLevel=="Super")? lang.ticketSuperSponsor : lang.partSponsor}
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
                          <SponsorIcon style={{fill: variables.primaryColor}} />
                        </span>
                      </Tooltip>
                    }
                  </div>
                }
              </div>
              <div className={styles.Profile__Header__Bottom}>
                <span className={styles.Profile__Header__Bottom__Input}>
                  <Button
                    variant="outlined"
                    id={"file"}
                    type="label"
                    onClick={() => fileInputRef.current.click()}
                  >
                    {lang.profPicture}
                    <input ref={fileInputRef} type="file" id="file" accept="image/jpg, image/jpeg, image/png, image/webp" onChange={(e) => imageChangeHandler(e)}/>
                  </Button>
                </span>
                <Tooltip
                  html={
                    <span style={{ fontSize: "1.4rem" }}>
                      {lang.profTicketDisabled}
                    </span>
                  }
                  disabled={!(user.ticket != null && user.ticket.isPaid)}
                  arrow
                  arrowSize="big"
                  size="big"
                  inertia
                  style={{
                    fontSize: '1.6rem'
                  }}
                >
                  <span className={styles.Profile__Header__Bottom__Input}>
                    <Button
                      variant="contained"
                      disabled={(user.ticket != null && user.ticket.isPaid)}
                      type="left"
                      link={"profile/tickets"}
                    >
                      {lang.navTickets}
                    </Button>
                  </span>
                </Tooltip>

                <Tooltip
                  html={
                    <span style={{ fontSize: "1.4rem" }}>
                      {lang.profTicketNotVerified}
                    </span>
                  }
                  disabled={((user.ticket != null && user.ticket.isPaid && user.ticket.type === 'WACC'))}
                  arrow
                  arrowSize="big"
                  size="big"
                  inertia
                  style={{
                    fontSize: '1.6rem'
                  }}
                >
                  <span className={styles.Profile__Header__Bottom__Input}>
                    <Button
                      variant="contained"
                      disabled={!((user.ticket != null && user.ticket.isPaid && user.ticket.type === 'WACC'))}
                      link={"profile/rooms"}
                    >
                      {lang.navRooms}
                    </Button>  
                  </span>
                </Tooltip>
              </div>
            </div>
          </section>
          <section className={styles.Profile__Body}>
            <div className={styles.Profile__Body__Left}>
              <h3>
                {lang.profData}
              </h3>
              <div className={styles.Profile__Body__Form}>
                <span className={styles.Profile__Body__Form__Row}>
                  <Input
                    disabled
                    label={lang.regFursonaName}
                    list="autoCompleteOff"
                    autoComplete="disabled"
                    value={fursonaName}
                    onChange={(e) => {setFursonaName(e); setIsChanged(true);}}
                    onBlur={() => validateFursonaName()}
                    error={errorStates.fursonaName}
                    maxLength={10}
                  />
                  <p className={styles.Profile__Body__Error__Text}>{errorStates.fursonaName}</p>
                </span>
                <span className={styles.Profile__Body__Form__Row}>
                  <Input
                    disabled
                    label={lang.regSpecies}
                    list="autoCompleteOff"
                    autoComplete="disabled"
                    value={species}
                    onChange={(e) => {setSpecies(e); setIsChanged(true);}}
                    onBlur={() => validateSpecies()}
                    error={errorStates.species}
                    maxLength={10}
                  />
                  <p className={styles.Profile__Body__Error__Text}>{errorStates.species}</p>
                </span>
                <span className={styles.Profile__Body__Form__Row}>
                  <Input
                    disabled
                    label={lang.profPassword}
                    type={"password"}
                    list="autoCompleteOff"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => {setPassword(e); setIsChanged(true);}}
                    onBlur={() => validatePass()}
                    maxLength={100}
                    error={errorStates.password}
                  ></Input>
                  <p className={styles.Profile__Body__Error__Text}>{errorStates.password}</p>
                </span>
                <span className={styles.Profile__Body__Form__Checkbox}>
                  <Checkbox
                    disabled
                    checked={(e) => {setIsFursuiter(e); setIsChanged(true);}}
                    checkBoxValue={isFursuiter}
                    id="chk-3"
                    label={lang.profSuiter}
                  />
                </span>
                <div className={styles.Profile__Body__Button}>
                  <Button
                    variant="contained"
                    disabled={!isChanged || true}
                    onClick={handleButton}
                  >
                    {lang.profSave}
                  </Button>
                </div>
                <p style={{color:"red"}}>
                  {currLang=="en"?
                    "Not available at the moment."
                    :
                    "Jelenleg nem elérhető"
                  }
                </p>
              </div>
            </div>
            <div className={styles.Profile__Body__Right}>
              <h3>
                {lang.profOverview}
              </h3>
              <div className={styles.Profile__Body__Right__Row}>
                <span className={styles.Profile__Body__Right__Row_left}>{`${lang.regFirstname}: `}</span>
                <span>{user.attendee.firstName}</span>
              </div>
              <div className={styles.Profile__Body__Right__Row}>
                <span className={styles.Profile__Body__Right__Row_left}>{`${lang.regLastname}: `}</span>
                <span>{user.attendee.lastName}</span>
              </div>
              <div className={styles.Profile__Body__Right__Row}>
                <span className={styles.Profile__Body__Right__Row_left}>{`${lang.regEmail}: `}</span>
                <span>{user.attendee.email}</span>
              </div>
              <div className={styles.Profile__Body__Right__Row}>
                <span className={styles.Profile__Body__Right__Row_left}>{`${lang.regNationality}: `}</span>
                <span>{currLang=="en"? user.nationality.countryNameEnglish : user.nationality.countryNameHungarian}</span>
              </div>
              <div className={styles.Profile__Body__Right__Row}>
                <span className={styles.Profile__Body__Right__Row_left}>{`${lang.profPayment}: `}</span>
                {
                  (user.ticket == undefined) &&
                  <span style={{color: "red"}}>{lang.profNotSelected}</span>
                }
                {
                  (user.ticket != undefined && user.ticket.isPaid == false) &&
                  <span style={{color: "red"}}>{lang.profNotPaid}</span>
                }
                {
                  (user.ticket != undefined && user.ticket.isPaid == true) &&
                  <span style={{color: "green"}}>{lang.profPaid}</span>
                }
              </div>
              {
                (user.ticket !== undefined) &&
                <div className={styles.Profile__Body__Right__Row}>
                  <span className={styles.Profile__Body__Right__Row_left}>{`${lang.profRoom}: `}</span>
                  {
                    (!user.accomodation && (user.ticket !== undefined && user.ticket?.type !== 'WACC')) &&
                    <span style={{textAlign: "right"}}>{lang.profNotSelectable}</span>
                  }
                  {
                    (!user.accomodation && (user.ticket && user.ticket.type === 'WACC')) &&
                    <span style={{color: "red"}}>{lang.profNotSelected}</span>
                  }
                  {
                    (user.accomodation && userRoom) &&
                    <span style={{textAlign: "right"}}>
                      <span>{`${userRoom.customName? (`${userRoom.customName} (${userRoom.roomNumber})`) : (`${userRoom.roomNumber}`)}`}</span><br />
                      <span>{`${userRoom.occupantCount} / ${userRoom.size}`}</span>
                    </span>
                  }
                </div>
              }
            </div>
          </section>
        </div>
      }
      </div>
    </>
  )
}

export default Profile;