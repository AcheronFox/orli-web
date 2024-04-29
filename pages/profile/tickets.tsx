/* eslint-disable react-hooks/exhaustive-deps */
import styles from "@/styles/pages/Tickets.module.scss"
import { NextPage } from "next";
import { useEffect, useState } from "react";
import Router from "next/router";
import Calendar from 'react-calendar'
import Slider from "@/comp/Slider";
import Input from "@/comp/Input";
import { IPrices } from "@/models/prices.model";
import { ITicketForm } from "@/models/ticket-form.model";
import DropDown from "@/comp/DropDown";
import { ITicketCount } from "@/models/ticket-count.model";
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
import { IFood } from "@/models/locale/food.model";
import createDatePatternFromDate from "@/functions/utils/createDatePattern";
import FilterableDropDown from "@/comp/input/FilterableDropDown";
import TextCard from "@/comp/TextCard";
import { ITicket } from "@/models/locale/ticket.model";
import { useHTMLString } from "@/hooks/utils/useHTMLString";

type Props = {}

interface CustomFoodFilterInterface {[index: number]: IFood[];}
interface CustomFoodSearchInterface {[index: number]: string; }
interface CustomFoodSelectInterface {[index: number]: string; }
interface CustomFoodValueInterface  {[index: number]: number; }
type ShirtSizeInterface = 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL' | null;

const Tickets: NextPage<Props> = (props: Props) => {
  const { lang, currLang } = useTranslate();
  const { user, didUserInit, getUser } = useUser();
  const { addNotification } = useNotification()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isDisabled, setIsDisabled] = useState<boolean>(true)
  const [showDialog, setShowDialog] = useState<boolean>(false)

  const [prices, setPrices] = useState<IPrices>()
  const [fullPrices, setFullPrices] = useState<IPrices | null>()
  const [selectedTicket, setSelectedTicket] = useState<number>()
  const [wantsDay0, setWantsDay0] = useState<boolean>(false)
  const [wantsDayExtra, setWantsDayExtra] = useState<boolean>(false)

  const [isEarlyBird, setIsEarlyBird] = useState<boolean>(false)
  const [serverDate, setServerDate] = useState<Date>(new Date())
  const [earlyBirdDate, setEarlyBirdDate] = useState<Date>(new Date())
  const [defaultMinDate, setDefaultMinDate] = useState<Date>(new Date())
  const [defaultMaxDate, setDefaultMaxDate] = useState<Date>(new Date())
  const [maxDate1Night, setMaxDate1Night] = useState<Date>(new Date()) 
  const [minDate, setMinDate] = useState<Date>()
  const [maxDate, setMaxDate] = useState<Date>()
  const [selectedDate, setSelectedDate] = useState<Date[]>([])
  const [selectedStartingDayIndex, setSelectedStartingDayIndex] = useState<number | null>(null)
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null)
  const [calendarKey, setCalendarKey] = useState<number>(0)

  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();

  const ticketData: ITicket = useLocaleSwitch(currLang, 'ticket.ts')
  const foods: IFood[] = useLocaleSwitch(currLang, 'food.ts');
  const [foodSearch, setFoodSearch] = useState<CustomFoodSearchInterface>({});
  const [foodSelect, setFoodSelect] = useState<CustomFoodSelectInterface>({});
  const [filteredFoods, setFilteredFoods] = useState<CustomFoodFilterInterface>({});
  const [selectedFoods, setSelectedFoods] = useState<CustomFoodValueInterface>({});

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
  const [ticketLimits, setTicketLimits] = useState<ITicketCount>()
  const [ticketLimitMax, setTicketLimitMax] = useState<ITicketCount>()
  const [isDay0Allowed, setIsDay0Allowed] = useState<boolean>(false)
  const [isDay1Allowed, setIsDay1Allowed] = useState<boolean>(false)
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
    await getLimits()
    /*
    await getPrices()
    await getTicketLimits()
    await getTicketMax()
    await getDateLimit()
    */

    setIsLoading(false)
  }

  const getLimits = async () => {
    //TODO
    await axiosInstance.get("api/v2/defaults/ticket")
    .then((res) => {
      setServerDate(new Date(res.data.serverDate))
      setEarlyBirdDate(new Date(res.data.earlyBirdExpDate))
      setIsEarlyBird(new Date(res.data.serverDate).valueOf() < new Date(res.data.earlyBirdExpDate).valueOf())
      
      const maxDate = new Date(res.data.maxDate);
      const newMaxDate = maxDate.getDate() + 1
      maxDate.setDate(newMaxDate);
      setMaxDate1Night(maxDate)
    })
    .catch((err) => {return})
  }
  /*
  const getDateLimit = async () => {
    await axiosInstance.get('api/v2/defaults/ticket/date')
    .then((res) => {
      setFromDate(new Date(res.data.fromDate))
      setToDate(new Date(res.data.toDate))
    })
    .catch((err) => {
      return
    })
  }

  const getPrices = async () => {
    await axiosInstance.get<{prices: IPrices; normal: IPrices | null}>("api/defaults/ticket/prices")
    .then((res) => {
      setPrices(res.data.prices)
      setFullPrices(res.data.normal)
    })
    .catch((err) => {return})
  }

  const getTicketLimits = async () => {
    await axiosInstance.gelang.api/ticket/limits")
    .then((res) => {
      setTicketLimits(res.data)
    })
    .catch((err) => {return})
  }

  const getTicketMax = async () => {
    await axiosInstance.gelang.api/defaults/ticket/max")
    .then((res) => {
      setTicketLimitMax(res.data)
    })
    .catch((err) => {return})
  }
  */

  const selectTicket = (ticket: number) => {
    setSelectedTicket(ticket)
    setWantsDay0(false)
    setWantsDayExtra(false)
    resetCalendar()
  }

  useEffect(() => {
    if (!wantsDay0) {
      updateFoodValue(0, undefined)
    }
  }, [wantsDay0])
  useEffect(() => {
    if (!wantsDayExtra) {
      updateFoodValue(Object.keys(foods).length-1, undefined)
    }
  }, [wantsDayExtra])

  // ===============================================
  // CALENDAR
  // ===============================================
  const resetCalendar = () => {
    setSelectedDate([])
    setMinDate(defaultMinDate)
    setMaxDate(defaultMaxDate)
    setCalendarKey(calendarKey? 0 : 1)
    setSelectedDayIndex(null)
    setSelectedStartingDayIndex(null)
    resetFoodSystem()
  }

  useEffect(() => {
    if (selectedDate.length == 2) {
      evaluateDayIndex()
    }
  }, [selectedDate])

  const evaluateDateSelect = (e: Date | Date[]) => {
    if (Array.isArray(e)) {
      if ((e.length == 2)) {
        if (e[0].getDate() != e[1].getDate()) {
          setSelectedDate(e)
        }
        else {
          setSelectedDayIndex(null)
          setSelectedStartingDayIndex(null)
          setSelectedDate([])
          setMinDate(defaultMinDate)
          setMaxDate(defaultMaxDate)
          resetFoodSystem()
        }
      }
      else {
        setSelectedDayIndex(null)
        setSelectedStartingDayIndex(null)
        resetFoodSystem()
        setSelectedDate(e)
      }
    }
  }

  const evaluateDayIndex = () => {
    if (Array.isArray(selectedDate)) {
      const offset = 1;
      const MS_PER_DAY = 1000 * 60 * 60 * 24;
      const utcMax1 = Date.UTC(defaultMinDate.getFullYear(), defaultMinDate.getMonth(), defaultMinDate.getDate());
      const utcMax2 = Date.UTC(selectedDate[1].getFullYear(), selectedDate[1].getMonth(), selectedDate[1].getDate());

      const utcMax1Start = Date.UTC(defaultMinDate.getFullYear(), defaultMinDate.getMonth(), defaultMinDate.getDate());
      const utcMax2Start = Date.UTC(selectedDate[0].getFullYear(), selectedDate[0].getMonth(), selectedDate[0].getDate());

      setSelectedStartingDayIndex(Math.floor((utcMax2Start - utcMax1Start) / MS_PER_DAY) + offset)
      setSelectedDayIndex(Math.floor((utcMax2 - utcMax1) / MS_PER_DAY) + offset)
    }
  }

  const getDifference = (date1: Date, date2: Date) => {
    const diffTime = Math.abs(date2.valueOf() - date1.valueOf());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays
  }

  // ===============================================
  // FOOD SELECT
  // ===============================================
  useEffect(() => {
    Object.keys(foods).map((food) => {
      const key = parseInt(food)
      if (!foodSearch[key]) return;

      const index = foods[key].findIndex((x: IFood) => x.id == selectedFoods[key]);
      if (index >= 0) {
        updateFoodSelect(key, foods[key][index].value);
        updateFoodSearch(key, foods[key][index].value)
      }
    })
  }, [foods]);

  const updateFoodSearch = (key: number, value: string) => {
    setFoodSearch((foodSearch: any) => { return { ...foodSearch, [key]: value } });
  }
  const updateFoodSelect = (key: number, value: string) => {
    setFoodSelect((foodSelect: any) => { return { ...foodSelect, [key]: value } });
  }
  const updateFilteredFoods = (key: number, value: IFood[]) => {
    setFilteredFoods((filteredFoods: any) => { return { ...filteredFoods, [key]: value } });
  }
  const updateFoodValue = (key: number, value: number | undefined) => {
    setSelectedFoods((selectedFoods: any) => { return { ...selectedFoods, [key]: value } });
  }

  const searchFunction = (key: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateFoodSearch(key, e.target.value)

    let tempArr: IFood[] = [];
    foods[key].map((x) => {
      if (x.value.toLowerCase().includes(e.target.value.toLowerCase())) {
        tempArr.push(x);
      }
    });

    if (e.target.value == "") {
      updateFilteredFoods(key, [])
    } else {
      updateFilteredFoods(key, tempArr)
    }
  };

  const createDatePattern = (index: number) => {
    const year = defaultMinDate.getFullYear();
    const month = ('0' + (defaultMinDate.getMonth() + 1)).slice(-2);
    const date = ('0' + (defaultMinDate.getDate()+(index-1))).slice(-2);
    
    return `${year}.${month}.${date}.`
  }

  const resetFoodSystem = () => {
    setFoodSearch({})
    setFoodSelect({})
    setFilteredFoods({})
    setSelectedFoods({})
  }

  // ===============================================
  // PURCHASE
  // ===============================================
  useEffect(() => {
    evalDisabled()
  }, [selectedFoods, selectedDayIndex, selectedDate, selectedTicket, wantsDay0, wantsDayExtra, shirtSize])

  const evalAmountOfDays = () => {
    if (selectedDate.length < 2 || selectedTicket == 2 || (selectedTicket == 1 && selectedDate.length != 2)) return 0
    else {
      const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      const diffDays = Math.round(Math.abs((selectedDate[0].valueOf() - selectedDate[1].valueOf()) / oneDay));
      return selectedTicket==1? diffDays-1 : diffDays
    }
  }

  const evalDisabled = async () => {
    let disabled = false
    let hasMissingFood = false
    
    Object.keys(foods).forEach((food) => {
      const key = parseInt(food)
      if (selectedTicket == 1 && ((selectedDayIndex!-1 >= key && key > selectedStartingDayIndex!-1) &&
        selectedFoods[key] == undefined) || (key == 0 && wantsDay0) && selectedFoods[key] == undefined ||
        (key == Object.keys(foods).length-1) && wantsDayExtra && selectedFoods[key] == undefined) {
        hasMissingFood = true
      }
      else if (
        selectedTicket == 2 && (
        ((key == 0 && wantsDay0) && selectedFoods[key] == undefined) ||
        ((key == Object.keys(foods).length-1) && wantsDayExtra && selectedFoods[key] == undefined) ||
        ((key != 0 && key != Object.keys(foods).length-1) && selectedFoods[key] == undefined)
        )) {
          hasMissingFood = true
      }
    })

    if (
      selectedTicket == undefined ||
      selectedTicket == 0 && (!selectedDate.length) ||

      selectedTicket == 1 && (selectedDate.length < 2) ||
      selectedTicket == 1 && hasMissingFood ||

      selectedTicket == 2 && hasMissingFood ||
      (isSponsor && sponsorAmount > 10000) && !shirtSize
      ) {
      disabled = true
    }

    setIsDisabled(disabled)
    return disabled
  }

  const purchase = async () => {
    if (await evalDisabled() || !prices) {
      return
    }


    const payload: ITicketForm = {
      ticketType: selectedTicket!.toString() as '0' | '1' | '2',
      extra0: wantsDay0,
      extra1: wantsDayExtra,
      sponsorLevel: isSponsor? (sponsorAmount > 10000? '2' : '1') : '0',
      shirt: isSponsor? (sponsorAmount > 10000? shirtSize : null) : null,
      sponsorPrice: sponsorAmount,
      foodData: selectedTicket==0? null : selectedFoods,
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

  useEffect(() => {
    if (selectedStartingDayIndex == null || selectedDayIndex == null) {
      setIsDay0Allowed(false)
      setIsDay1Allowed(false)
      setWantsDay0(false)
      setWantsDayExtra(false)
      return;
    }

    const offsetMax = new Date(defaultMaxDate.valueOf());
    let tempMaxDate: number | undefined = undefined
    tempMaxDate = offsetMax.getDate() + 1
    offsetMax.setDate(tempMaxDate);

    const last = new Date(offsetMax.valueOf());
    tempMaxDate = last.getDate() + 1
    last.setDate(tempMaxDate);

    const maxDaysIndex = getDifference(defaultMinDate, last)

    if (selectedStartingDayIndex == 1) setIsDay0Allowed(true)
    if (selectedDayIndex == maxDaysIndex) setIsDay1Allowed(true)
  }, [selectedStartingDayIndex, selectedDayIndex])

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
      <div className={styles.Tickets}>
        {
          (user && prices && ticketLimits && ticketLimitMax) &&
          <> 
            <div className={styles.Tickets__Content}>
              <section className={styles.Tickets__Prices}>
                <h2 className={styles.Tickets__Prices__Title}>{lang.ticketTickets}</h2>
                {
                  isEarlyBird &&
                  <div className={styles.Tickets__Prices__EarlyBird}>
                    <h3>{`${lang.ticketEarlyBird}: ${getDifference(serverDate, earlyBirdDate)} ${lang.ticketEarlyBirdExp}`}</h3>
                    <h3>{createDatePatternFromDate(earlyBirdDate)}</h3>
                  </div>
                }
                <div className={styles.Tickets__Prices__List}>
                {
                      ticketData?.content.filter((o) => o.priceKey == "WACC" || o.priceKey == "TENT" ).map((o, i) => {
                      return (
                          <TextCard
                              key={i}
                              variant="simple"
                              title={o.title}
                              customBodyClass={styles.Prices__Body}
                              customTitleClass={styles.Prices__Content__Title}
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
                          </TextCard>
                      )
                      })
                  }
                </div>
              </section>
            </div>
            {
              (selectedTicket==2 || selectedTicket==1) &&
              <div className={styles.Tickets__Content}>
                <section className={styles.Tickets__Prices}>
                  <h2 className={styles.Tickets__Prices__Title}>{lang.ticketExtra}</h2>
                  <div className={`${styles.Tickets__Prices__List} ${styles.Tickets__Prices__List_2col}`}>
                    <PriceCard
                    title={lang.ticketExtra0}
                    customClass={wantsDay0? styles.Tickets__Selected : ''}
                    button={
                      <Tippy disabled={isDay0Allowed || selectedTicket!=1} content={lang.ticketNotAllowed0}>
                        <span>
                          <SecondaryButton disabled={!isDay0Allowed && selectedTicket == 1} text={wantsDay0? lang.ticketCancel : lang.ticketSelect} onClick={() => setWantsDay0((o) => !o)} />
                        </span>
                      </Tippy>
                    }
                    description={
                      <span>
                        {lang.ticketE0Desc}<br /><br />
                        {lang.ticketE0Inc}<br />
                        <ul>
                          <li>{lang.ticketE0Inc1}</li>
                          <li>{lang.ticketE0Inc2}</li>
                          <li>{lang.ticketE0Inc3}</li>
                          <li>{lang.ticketE0Inc4}</li>
                          <li>{lang.ticketE0Inc5}</li>
                        </ul>
                        <br />
                        {lang.ticketE0Out}
                      </span>
                    }
                    fullPrice={fullPrices != null && fullPrices.extra0.hu}
                    price={prices.extra0.hu} />

                    <PriceCard
                    title={lang.ticketExtra1}
                    customClass={wantsDayExtra? styles.Tickets__Selected : ''}
                    button={
                    <Tippy disabled={((ticketLimits.extra1Count < ticketLimitMax.extra1Count) || user.isStaff) && (isDay1Allowed || selectedTicket!=1)} content={(!isDay1Allowed && selectedTicket == 1)? lang.ticketNotAllowed1") : lang.ticketNotAvailable}>
                      <span>
                        <SecondaryButton disabled={((ticketLimits.extra1Count >= ticketLimitMax.extra1Count) && !user.isStaff) || (!isDay1Allowed && selectedTicket == 1)} text={wantsDayExtra? lang.ticketCancel") : lang.ticketSelect} onClick={() => setWantsDayExtra((o) => !o)} />
                      </span>
                    </Tippy>
                    }
                    description={
                      <span>
                        {lang.ticketE1Desc}<br /><br />
                        {lang.ticketE1Inc}<br />
                        <ul>
                          <li>{lang.ticketE1Inc1}</li>
                          <li>{lang.ticketE1Inc2}</li>
                          <li>{lang.ticketE1Inc3}</li>
                          <li>{lang.ticketE1Inc4}</li>
                          <li>{lang.ticketE1Inc5}</li>
                        </ul>
                        <br />
                        {lang.ticketE1Out}
                      </span>
                    }
                    fullPrice={fullPrices != null && fullPrices.extra1.hu}
                    price={prices.extra1.hu} />
                  </div>
                </section>
              </div>
            }
            {
              (selectedTicket==2 || (selectedTicket==1 && selectedDayIndex && selectedStartingDayIndex)) &&
              <div className={styles.Tickets__Content}>
                <section className={styles.Tickets__Prices}>
                  <h2 className={styles.Tickets__Prices__Title}>{lang.ticketFoodSelect}</h2>
                  <div className={styles.Tickets__Foods}>
                    {
                      foods &&
                      Object.keys(foods).map((food, i) => {
                        const key = parseInt(food)
                        
                        if (selectedTicket==1 && ((selectedDayIndex!-1 < key && !wantsDayExtra) || (key <= selectedStartingDayIndex!-1 && !wantsDay0))) return null
                        if (selectedTicket==2 && ((key == 0 && !wantsDay0) || (key == Object.keys(foods).length-1 && !wantsDayExtra))) return null
                        
                        return (
                          <FilterableDropDown
                            key={i}
                            label={`${createDatePattern(i+1)}:`}
                            buttonPlaceholder={lang.natSelectSelect}
                            searchPlaceholder={lang.natSelectPlaceholder}
                            data={foods[key]}
                            filteredData={filteredFoods[key]}
                            dataDisplayVal={"value"}
                            dataValue={"id"}
                            onChange={(e: string) => updateFoodValue(key, parseInt(e))}
                            searchFunction={(e: any) => searchFunction(key, e)}
                            selected={foodSelect[key]}
                            setSelected={(e: string) => updateFoodSelect(key, e)}
                            searchValue={foodSearch[key]}
                            setValue={(e: string) => updateFoodSearch(key, e)}
                          />
                        );
                      })
                    }
                  </div>
                </section>
              </div>
            }
            <div className={styles.Tickets__Content}>
              <section className={styles.Tickets__Prices}>
                <h2 className={styles.Tickets__Prices__Title}>{lang.ticketSponsor}</h2>
                <Input
                  type="checkbox"
                  checked={(e) => setIsSponsor(e)}
                  id="chk-1"
                  label={<>{lang.ticketSponsorQuestion}</>}
                ></Input>
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
                      onChange={(e) => setSponsorAmount(parseInt(e.target.value))}
                      onBlur={(e) => setSponsorAmount(parseInt(e.target.value))}
                      min={minSponsor}
                      max={9999999}
                      onInput={(e) => e.currentTarget.value = e.currentTarget.value.slice(0, 10)}
                    />
                    <Slider
                      min={minSponsor}
                      max={maxSponsor}
                      step={500}
                      marks={[10000]}
                      tooltipText={"HUF"}
                      value={sponsorAmount}
                      returnValue={(e: number) => setSponsorAmount(e)}
                    />
                    {(isSponsor && sponsorAmount > 10000) &&
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
                        <td>{selectedTicket!=undefined? `${(selectedTicket==1&&evalAmountOfDays()>1)? (`${t(`ticket${selectedTicket}Title`)} * ${evalAmountOfDays()}`) : (t(`ticket${selectedTicket}Title`))}` : <span style={{"color": "red"}}>{t(`ticketNoTicket`)}</span>}</td>
                      </tr>
                      {
                        (selectedTicket==0) &&
                        <tr>
                          <td>{lang.ticketDay}</td>
                          <td>{selectedDate && createDatePatternFromDate(selectedDate[0])} {(selectedDate && selectedDate.length == 2)? '-' : ''} {selectedDate && createDatePatternFromDate(selectedDate[1])} {(!selectedDate.length) && <span style={{"color": "red"}}>{t(`ticketNoDay`)}</span>}</td>
                        </tr>
                      }
                      {
                        (selectedTicket==1) &&
                        <tr>
                          <td>{lang.ticketDays}</td>
                          <td>{selectedDate.length == 2 && `${createDatePatternFromDate(selectedDate[0])} -`} {selectedDate.length == 2 && createDatePatternFromDate(selectedDate[1])} {!Array.isArray(selectedDate) || selectedDate.length < 2 && <span style={{"color": "red"}}>{t(`ticketNoDays`)}</span>}</td>
                        </tr>
                      }
                      {
                        (selectedTicket==2) &&
                        <tr>
                          <td>{lang.ticketExtra}</td>
                          <td>{wantsDay0 && lang.ticketExtra0}{wantsDay0 && wantsDayExtra && ','} {wantsDayExtra && lang.ticketExtra1} {!wantsDay0 && !wantsDayExtra && lang.ticketNoExtra}</td>
                        </tr>
                      }
                      {
                        (selectedTicket==2 || (selectedTicket==1 && selectedDayIndex)) &&
                        <tr>
                          <td colSpan={2}><span className={styles.Tickets__Overview__Title}><h3>{lang.ticketFood}</h3></span></td>
                        </tr>
                      }
                      {
                        (foods && (selectedTicket==2 || (selectedTicket==1 && selectedDayIndex))) &&
                          Object.keys(foods).map((food, i) => {
                            const key = parseInt(food)

                            if (selectedTicket==1 && ((selectedDayIndex!-1 < key && !wantsDayExtra) || (key <= selectedStartingDayIndex!-1 && !wantsDay0))) return null
                            if (selectedTicket==2 && ((key == 0 && !wantsDay0) || (key == Object.keys(foods).length-1 && !wantsDayExtra))) return null
                                
                            return (
                              <tr key={i}>
                                <td>
                                  {createDatePattern(i+1)}
                                </td>
                                <td>
                                  {foodSelect[key] || <span style={{"color": "red"}}>{lang.ticketNoFood}</span>}
                                </td>
                              </tr>
                            );
                          })
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
                          <td>{sponsorAmount>10000? lang.ticketSuperSponsor") : lang.ticketSponsor}</td>
                        </tr>
                        {(isSponsor && sponsorAmount>10000) &&
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
                        (selectedTicket != undefined && prices != undefined) &&
                        <tr>
                          <td>{lang.ticketTicket}</td>
                          <td>{`${(selectedTicket==0 && prices[0].hu) || (selectedTicket==1 && prices[1].hu) || (selectedTicket==2 && prices[2].hu)} ${(selectedTicket==0 || selectedTicket==1)? (evalAmountOfDays() <= 1)? '' : `(* ${evalAmountOfDays()})` : ''} HUF`}</td>
                        </tr>
                      }
                      {
                        (selectedTicket != undefined && prices != undefined && wantsDay0) &&
                        <tr>
                          <td>{lang.ticketExtra0}</td>
                          <td>{`+${prices.extra0.hu} HUF`}</td>
                        </tr>
                      }
                      {
                        (selectedTicket != undefined && prices != undefined && wantsDayExtra) &&
                        <tr>
                          <td>{lang.ticketExtra1}</td>
                          <td>{`+${prices.extra1.hu} HUF`}</td>
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
                          <td>{`${
                            (selectedTicket==0? (prices[0].hu * (evalAmountOfDays() || 1)) : 0) + (selectedTicket==1? (prices[1].hu * evalAmountOfDays()) : 0) + (selectedTicket==2? prices[2].hu : 0)
                            + 
                            (wantsDay0? prices.extra0.hu : 0) 
                            +
                            (wantsDayExtra? prices.extra1.hu : 0)
                            +
                            (isSponsor? sponsorAmount : 0)
                            } HUF`}</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
                {
                  (fromDate != undefined && toDate != undefined) && 
                  <div className={styles.Tickets__Overview__Buy}>
                    <>
                      {
                        (!((serverDate.getTime() > fromDate.getTime()) && (serverDate.getTime() < toDate.getTime()))) &&
                        <p style={{color: 'red'}}>
                          {`${lang.warnDateLimit1} ${createDatePatternFromDate(fromDate)} - ${createDatePatternFromDate(toDate)} ${lang.warnDateLimit2}`}
                        </p>
                      }
                      <Tippy disabled={user.TicketKey == null} content={lang.ticketAlreadyHas}>
                        <span>
                          <PrimaryButton
                            text={lang.ticketBuy}
                            onClick={() => setShowDialog(true)}
                            disabled={isDisabled || (user.TicketKey != null) || 
                            !((serverDate.getTime() > fromDate.getTime()) && (serverDate.getTime() < toDate.getTime()))} />
                        </span>
                      </Tippy>
                    </>
                  </div>
                }
              </section>
            </div>
          </>
        }
      </div>
    </>
  )
}

export default Tickets;
