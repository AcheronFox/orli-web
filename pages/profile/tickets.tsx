/* eslint-disable react-hooks/exhaustive-deps */
import styles from "@/styles/pages/Tickets.module.scss"
import { NextPage } from "next";
import { useEffect, useState } from "react";
import Router from "next/router";
import { ITicketForm } from "@/models/ticket-form.model";
import DropDown from "@/comp/input/DropDown";
import useTranslate from "@/hooks/translate/useTranslate";
import useNotification from "@/hooks/notification/useNotification";
import { useUser } from "@/hooks/user/useUser";
import axiosInstance from "@/functions/utils/axiosConfig";
import useLocaleSwitch from "@/hooks/utils/useLocaleSwitch";
import CustomHead from "@/comp/utils/CustomHead";
import LoadingOverlay from "@/comp/utils/LoadingOverlay";
import { BarLoader } from "react-spinners";
import variables from "@/styles/abstracts/exports.module.scss"
import ButtonGroup from "@/comp/button/ButtonGroup";
import Button from "@/comp/button/Button";
import TextCard from "@/comp/TextCard";
import { ITicket } from "@/models/locale/ticket.model";
import { useHTMLString } from "@/hooks/utils/useHTMLString";
import { IAppConfig } from "@/models/app.config.model";
import Input from "@/comp/input/Input";
import Checkbox from "@/comp/input/Checkbox";
import Slider from "@/comp/input/Slider";
import { Tooltip } from "react-tippy";
import { ITicketCount } from "@/models/ticket-count.model";

type Props = {}

type ShirtSizeInterface = 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL' | null;

const Tickets: NextPage<Props> = (props: Props) => {
  const { lang, currLang } = useTranslate();
  const { user, didUserInit, getUser } = useUser();
  const { addNotification } = useNotification()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isDisabled, setIsDisabled] = useState<boolean>(true)
  const [showDialog, setShowDialog] = useState<boolean>(false)

  const [selectedTicket, setSelectedTicket] = useState<"WACC" | 'TENT'>()
  const [selectedExtras, setSelectedExtras] = useState<{early: boolean, late: boolean}>({
    early: false,
    late: false,
  })

  const [configData, setConfigData] = useState<IAppConfig['ticket']>()
  const [ticcketLimits, setTicketLimits] = useState<ITicketCount>()

  const ticketData: ITicket = useLocaleSwitch(currLang, 'ticket.ts')

  const [isSponsor, setIsSponsor] = useState<boolean>(false)
  const [shirtSize, setShirtSize] = useState<ShirtSizeInterface>(null)
  const [shirtSizes] = useState<ShirtSizeInterface[]>([
    'S',
    'M',
    'L',
    'XL',
    'XXL',
    '3XL'
  ])
  const [sponsorAmount, setSponsorAmount] = useState<number>(0)
  const [isExtraAllowed, setIsExtraAllowed] = useState<boolean>(false)
  const minSponsor = 5000
  const maxSponsor = 50000

  const parse = useHTMLString()

  useEffect(() => {
    if (!didUserInit) return
    if (!user || (user && (user.ticket && user.ticket.isPaid))) {
      Router.push('/profile')
    }
    else if (user && !user.ticket?.isPaid) {
      getDefaults()
    }
  }, [didUserInit])

  // ===============================================
  // TICKETS
  // ===============================================
  const getDefaults = async () => {
    await getConfig()
    await getLimits()
    setIsLoading(false)
  }

  const getConfig = async () => {
    axiosInstance.get<IAppConfig["ticket"]>('/api/v2/defaults/ticket')
      .then((res) => {
        setConfigData(res.data)
      })
  }
  const getLimits = async () => {
    axiosInstance.get<ITicketCount>('/api/ticket/limits')
      .then((res) => {
        setTicketLimits(res.data)
      })
  }

  const selectTicket = (ticket: "WACC" | "TENT") => {
    setSelectedTicket(ticket)
    setSelectedExtras({
      early: false,
      late: false,
    })
    setIsExtraAllowed(true)
  }

  // ===============================================
  // PURCHASE
  // ===============================================
  useEffect(() => {
    evalDisabled()
  }, [selectedTicket, selectedExtras, shirtSize])


  const evalDisabled = async () => {
    let disabled = false
    
    if (
      selectedTicket == undefined ||
      (isSponsor && sponsorAmount > 12000) && !shirtSize
      ) {
      disabled = true
    }

    setIsDisabled(disabled)
    return disabled
  }

  const purchase = async () => {
    if (await evalDisabled()) {
      return
    }


    const payload: ITicketForm = {
      ticketType: selectedTicket!,
      early: selectedExtras.early,
      late: selectedExtras.late,
      sponsorLevel: isSponsor? (sponsorAmount > 12000? '2' : '1') : '0',
      shirt: isSponsor? (sponsorAmount > 12000? shirtSize : null) : null,
      sponsorPrice: sponsorAmount,
    }

    setShowDialog(false)
    setIsDisabled(true)
    setIsLoading(true)

    axiosInstance.post("api/ticket/create", payload)
    .then(() => {
      addNotification({
        message: lang.ticketSuccess,
        type: "success",
      })
      Router.push(
        '/profile'
      )
      getUser()
    })
    .catch((err) => {
      addNotification({
        message: lang.errDefault,
        type: "error"
      })
    })
    .finally(() => {
      setIsLoading(false)
      setIsDisabled(false)
    })
  }


  return (
    <>
      <CustomHead title={lang.navTickets} />
      <LoadingOverlay isLoading={isLoading}>
        <BarLoader
          color={variables.secondaryColor}
        />
      </LoadingOverlay>
      {
        showDialog &&
        <div className={styles.Tickets__Dialog}>
          <div className={styles.Tickets__Dialog__Center}>
            <p>{lang.ticketPurchaseQuestion}</p>
            <div className={styles.Tickets__Dialog__Buttons}>
              <ButtonGroup>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setShowDialog(false)}
                >
                  {lang.profCancel}
                </Button>
                <Button
                  variant="outlined"
                  color="success"
                  onClick={() => purchase()}
                >
                  {lang.profConfirm}
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
      }
      <div className={styles.Tickets__Background} />
      <div className={styles.Tickets}>
        {
          (user && configData && ticcketLimits) &&
          <> 
            <div className={styles.Tickets__Content}>
              <section className={styles.Tickets__Prices}>
                <h2 className={styles.Tickets__Prices__Title}>{lang.ticketTickets}</h2>
                <div className={styles.Tickets__Prices__List}>
                {
                      ticketData?.content.filter((o) => o.priceKey == "WACC" || o.priceKey == "TENT" ).map((o, i) => {
                      return (
                          <TextCard
                              key={i}
                              variant="simple"
                              title={o.title}
                              customBodyClass={`${styles.Tickets__Item} ${selectedTicket==(o.priceKey as "WACC" | "TENT")? styles.Tickets__Selected : ''}`}
                          >
                          {
                              o.body.map((p) => {
                                  const str = p+'<br/>'
                                  return parse(str) 
                              })
                          }
                          {
                              (() => {
                                  if (!o.priceKey) return null
                                  const ticketObj = configData.types.find((p) => p.name === o.priceKey)
                                  
                                  if (ticketObj) {
                                      if (configData.isEarlyBird && ticketObj.earlyBirdPrice) {
                                          return (
                                              <>
                                                  <b>
                                                      <s>{ticketObj.price}</s> {ticketObj.earlyBirdPrice} HUF
                                                  </b>
                                                  <br/>
                                              </>
                                          )
                                      }
                                      else return (
                                          <>
                                              <b>
                                                  {ticketObj.price} HUF
                                              </b>
                                              <br/>
                                          </>
                                      )
                                  }
                                  else return null
                              })()
                          }
                          <div className={styles.Tickets__Button}>
                          <Tooltip
                            html={
                              <span style={{ fontSize: "1.4rem" }}>
                                {lang.ticketNotAvailable}
                              </span>
                            }
                            arrow
                            arrowSize="big"
                            size="big"
                            inertia
                            style={{
                              fontSize: '1.6rem'
                            }}
                            disabled={!((o.priceKey=='WACC' && ticcketLimits.countWACC >= (configData.types.find((o) => o.name == 'WACC')?.limit || 0)) || (o.priceKey=='TENT' && ticcketLimits.countWACC >= (configData.types.find((o) => o.name == 'TENT')?.limit || 0)))}
                          >
                            <Button
                              variant="contained"
                              disabled={(selectedTicket==(o.priceKey as "WACC" | "TENT") && ((o.priceKey=='WACC' && ticcketLimits.countWACC >= (configData.types.find((o) => o.name == 'WACC')?.limit || 0)) || (o.priceKey=='TENT' && ticcketLimits.countWACC >= (configData.types.find((o) => o.name == 'TENT')?.limit || 0))))}
                              onClick={() => selectTicket(o.priceKey as "WACC" | 'TENT')}
                            >
                              {lang.ticketSelect}
                            </Button>
                          </Tooltip>
                          </div>
                          </TextCard>
                      )
                      })
                  }
                </div>
              </section>
            </div>
            {
              (isExtraAllowed == true) &&
              <div className={styles.Tickets__Content}>
                <section className={styles.Tickets__Prices}>
                  <h2 className={styles.Tickets__Prices__Title}>{lang.ticketExtra}</h2>
                  <div className={`${styles.Tickets__Prices__List} ${styles.Tickets__Prices__List_2col}`}>
                  {
                      ticketData?.content.filter((o) => o.priceKey == "LATE" || o.priceKey == "EARLY" ).map((o, i) => {
                      return (
                          <TextCard
                              key={i}
                              variant="simple"
                              title={o.title}
                              customBodyClass={`
                                ${styles.Tickets__Item}
                                ${selectedExtras.early && o.priceKey == 'EARLY'? styles.Tickets__Selected : ''}
                                ${selectedExtras.late && o.priceKey == 'LATE'? styles.Tickets__Selected : ''}
                              `}
                          >
                          {
                              o.body.map((p) => {
                                  const str = p+'<br/>'
                                  return parse(str) 
                              })
                          }
                          {
                              (() => {
                                  if (!o.priceKey) return null
                                  const ticketObj = configData.types.find((p) => p.name === o.priceKey)
                                  
                                  if (ticketObj) {
                                      if (configData.isEarlyBird && ticketObj.earlyBirdPrice) {
                                          return (
                                              <>
                                                  <b>
                                                      <s>{ticketObj.price}</s> {ticketObj.earlyBirdPrice} HUF
                                                  </b>
                                                  <br/>
                                              </>
                                          )
                                      }
                                      else return (
                                          <>
                                              <b>
                                                  {ticketObj.price} HUF
                                              </b>
                                              <br/>
                                          </>
                                      )
                                  }
                                  else return null
                              })()
                          }
                          <div className={styles.Tickets__Button}>
                            <Button
                              variant="contained"
                              onClick={() => {
                                switch (o.priceKey) {
                                  case "EARLY":
                                      setSelectedExtras({...selectedExtras, early: !selectedExtras.early})
                                    break;
                                  case "LATE":
                                      setSelectedExtras({...selectedExtras, late: !selectedExtras.late})
                                    break;
                                }
                              }}
                            >
                              {lang.ticketSelect}
                            </Button>
                          </div>
                          </TextCard>
                      )
                      })
                  }
                  </div>
                </section>
              </div>
            }
            <div className={styles.Tickets__Content}>
              <section className={styles.Tickets__Prices}>
                <h2 className={styles.Tickets__Prices__Title}>{lang.ticketSponsor}</h2>
                <Checkbox
                  checked={(e) => setIsSponsor(e)}
                  id="chk-1"
                  label={lang.ticketSponsorQuestion}
                />
                {isSponsor &&
                  <div className={styles.Tickets__Sponsor}>
                    <span>
                      {lang.ticketSponsorText1}<br /><br />
                      {lang.ticketSponsorText2}<br /><br />
                    </span>
                    <Input
                      type="number"
                      label={`${lang.ticketSponsorAmount}:`}
                      value={sponsorAmount}
                      onChange={(e) => setSponsorAmount(parseInt(e))}
                      onBlur={(e) => setSponsorAmount(parseInt(e.currentTarget.value))}
                      min={minSponsor}
                      max={9999999}
                      onInput={(e) => e.currentTarget.value = e.currentTarget.value.slice(0, 10)}
                    />
                    <Slider
                      min={minSponsor}
                      max={maxSponsor}
                      step={500}
                      marks={[12000]}
                      tooltipText={"HUF"}
                      value={sponsorAmount}
                      returnValue={(e: number) => setSponsorAmount(e)}
                    />
                    {(isSponsor && sponsorAmount > 12000) &&
                      <div className={styles.Tickets__Sponsor__Select}>
                        <DropDown
                          label={`${lang.ticketSponsorShirt}:`}
                          buttonPlaceholder={lang.natSelectSelect}
                          data={shirtSizes}
                          onChange={(e: ShirtSizeInterface) => setShirtSize(e)}
                          selected={shirtSize}
                          setSelected={(e: ShirtSizeInterface) => setShirtSize(e)}
                          setValue={(e: ShirtSizeInterface) => setShirtSize(e)}
                        />
                      </div>
                    }
                  </div>
                }
              </section>
            </div>
            <div className={styles.Tickets__Content}>
              <section className={styles.Tickets__Prices}>
                <h2 className={styles.Tickets__Prices__Title}>{lang.ticketOverview}</h2>
                <div className={styles.Tickets__Overview}>
                  <table>
                    <tbody>
                      <tr>
                        <td colSpan={2}><span className={styles.Tickets__Overview__Title}><h3>{lang.ticketTicket}</h3></span></td>
                      </tr>
                      <tr>
                        <td>{lang.ticketOverviewTicket}</td>
                        <td>{selectedTicket!=undefined? `${(selectedTicket=="WACC")? (`${lang.ticketWACC}`) : (lang.ticketTENT)}` : <span style={{"color": "red"}}>{lang.ticketNoTicket}</span>}</td>
                      </tr>
                      {
                        (selectedTicket!=undefined) &&
                        <tr>
                          <td>{lang.ticketDay}</td>
                        </tr>
                      }
                      {
                        isSponsor &&
                        <tr>
                          <td colSpan={2}><span className={styles.Tickets__Overview__Title}><h3>{lang.ticketSponsor}</h3></span></td>
                        </tr>
                      }
                      {
                        isSponsor &&
                        <>
                        <tr>
                          <td>{lang.ticketSponsorAmount}</td>
                          <td>{`${sponsorAmount} HUF`}</td>
                        </tr>
                        <tr>
                          <td>{lang.ticketSponsorLevel}</td>
                          <td>{sponsorAmount>12000? lang.ticketSuperSponsor : lang.ticketSponsor}</td>
                        </tr>
                        {(isSponsor && sponsorAmount>12000) &&
                          <tr>
                            <td>{lang.ticketSponsorShirt}</td>
                            <td>{shirtSize? shirtSize : <span style={{"color": "red"}}>{lang.ticketNoShirt}</span>}</td>
                          </tr>
                        }
                        </>
                      }
                      {
                        (selectedTicket != undefined) &&
                        <tr>
                          <td colSpan={2}><span className={styles.Tickets__Overview__Title}><h3>{lang.ticketPrice}</h3></span></td>
                        </tr>
                      }
                      {
                        (selectedTicket != undefined && configData != undefined) &&
                        <tr>
                          <td>{lang.ticketTicket}</td>
                          {
                            (configData.isEarlyBird)?
                            <td>{`${(selectedTicket=='WACC' && configData.types.find((o) => o.name == 'WACC')!.earlyBirdPrice) || (selectedTicket=='TENT' && configData.types.find((o) => o.name == 'TENT')!.earlyBirdPrice)} HUF`}</td>
                            :
                            <td>{`${(selectedTicket=='WACC' && configData.types.find((o) => o.name == 'WACC')!.price) || (selectedTicket=='TENT' && configData.types.find((o) => o.name == 'TENT')!.price)} HUF`}</td>
                          }
                        </tr>
                      }
                      {
                        (selectedTicket != undefined && configData != undefined && selectedExtras.early) &&
                        <tr>
                          <td>{lang.ticketNoExtra}</td>
                          {
                            (configData.isEarlyBird)?
                            <td>{`+${configData.types.find((o) => o.name == 'EARLY')?.earlyBirdPrice} HUF`}</td>
                            :
                            <td>{`+${configData.types.find((o) => o.name == 'EARLY')?.price} HUF`}</td>
                          }
                        </tr>
                      }
                      {
                        (selectedTicket != undefined && configData != undefined && selectedExtras.late) &&
                        <tr>
                          <td>{lang.ticketExtra}</td>
                          {
                            (configData.isEarlyBird)?
                            <td>{`+${configData.types.find((o) => o.name == "LATE")?.earlyBirdPrice} HUF`}</td>
                            :
                            <td>{`+${configData.types.find((o) => o.name == "LATE")?.price} HUF`}</td>
                          }
                        </tr>
                      }
                      {
                        (selectedTicket != undefined && isSponsor) &&
                        <tr>
                          <td>{lang.ticketSponsor}</td>
                          <td>{`+${sponsorAmount} HUF`}</td>
                        </tr>
                      }
                      {
                        (selectedTicket != undefined) &&
                        <tr className={styles.Tickets__Overview__Price}>
                          <td>{`${lang.ticketFinalPrice}`}</td>
                          {
                            (configData.isEarlyBird)?
                            <td>
                              {`
                                ${
                                (selectedTicket=="WACC"? parseInt(configData.types.find((o) => o.name == 'WACC')!.earlyBirdPrice!.toString().replaceAll(' ', '')) : 0)
                                +
                                (selectedTicket=="TENT"? parseInt(configData.types.find((o) => o.name == 'TENT')!.earlyBirdPrice!.toString().replaceAll(' ', '')) : 0)
                                + 
                                (selectedExtras.early? parseInt(configData.types.find((o) => o.name == 'EARLY')!.earlyBirdPrice!.toString().replaceAll(' ', '')) : 0) 
                                +
                                (selectedExtras.late? parseInt(configData.types.find((o) => o.name == 'LATE')!.earlyBirdPrice!.toString().replaceAll(' ', '')) : 0)
                                +
                                (isSponsor? sponsorAmount : 0)
                                } HUF`
                              }
                            </td>
                            :
                            <td>
                              {`
                                ${
                                (selectedTicket=="WACC"? parseInt(configData.types.find((o) => o.name == 'WACC')!.price.toString().replaceAll(' ', '')) : 0)
                                +
                                (selectedTicket=="TENT"? parseInt(configData.types.find((o) => o.name == 'TENT')!.price.toString().replaceAll(' ', '')) : 0)
                                + 
                                (selectedExtras.early? parseInt(configData.types.find((o) => o.name == 'EARLY')!.price.toString().replaceAll(' ', '')) : 0) 
                                +
                                (selectedExtras.late? parseInt(configData.types.find((o) => o.name == 'LATE')!.price.toString().replaceAll(' ', '')) : 0)
                                +
                                (isSponsor? sponsorAmount : 0)
                                } HUF`
                              }
                            </td>
                          }
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
                <div className={styles.Tickets__Overview__Buy}>
                  <>
                    {
                      (!configData.isOpen) &&
                      <p style={{color: 'red'}}>
                        {lang.warnDateLimit}
                      </p>
                    }
                    <Tooltip
                      html={
                        <span style={{ fontSize: "1.4rem" }}>
                          {lang.ticketAlreadyHas}
                        </span>
                      }
                      arrow
                      arrowSize="big"
                      size="big"
                      inertia
                      style={{
                        fontSize: '1.6rem'
                      }}
                      disabled={(user.ticket == null)}
                    >
                      <Button
                        variant="contained"
                        disabled={isDisabled || (user.ticket != null) || !(configData.isOpen)}
                        onClick={() => setShowDialog(true)}
                      >
                        {lang.ticketBuy}
                      </Button>
                    </Tooltip>
                  </>
                </div>
              </section>
            </div>
          </>
        }
      </div>
    </>
  )
}

export default Tickets;
