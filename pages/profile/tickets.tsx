/* eslint-disable react-hooks/exhaustive-deps */
import styles from "@/styles/pages/Tickets.module.scss"
import { useTranslate } from "@/hooks/useTranslate";
import { NextPage } from "next";
import { useUser } from "@/hooks/useUser";
import SecondaryButton from "@/comp/SecondaryButton";
import { useContext, useEffect, useState } from "react";
import Router from "next/router";
import PriceCard from "@/comp/PriceCard";
import Calendar from 'react-calendar'
import axiosInstance from "@/utils/axiosConfig";
import Slider from "@/comp/Slider";
import Input from "@/comp/Input";
import { IFood } from "@/models/food.model";
import FilterableDropDown from "@/comp/FilterableDropDown";
import { IPrices } from "@/models/prices.model";
import LoadingOverlay from "@/comp/LoadingOverlay";
import PrimaryButton from "@/comp/PrimaryButton";
import { ITicketForm } from "@/models/ticket-form.model";
import Tippy from "@tippyjs/react";
import { FloatingMessageContext } from "@/hooks/FloatingMessageContext";
import DropDown from "@/comp/DropDown";
import CustomHead from "@/comp/CustomHead";
import createDatePatternFromDate from "@/root/functions/createDatePattern";
import CustomBackground from "@/comp/CustomBackground";
import { ITicketCount } from "@/models/ticket-count.model";

type Props = {}

interface CustomFoodFilterInterface {[index: number]: IFood[];}
interface CustomFoodDataInterface   {[index: number]: IFood[];}
interface CustomFoodSearchInterface {[index: number]: string; }
interface CustomFoodSelectInterface {[index: number]: string; }
interface CustomFoodValueInterface  {[index: number]: number; }
type ShirtSizeInterface = 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL' | null;

const Tickets: NextPage<Props> = (props: Props) => {
  const { t, locale } = useTranslate();
  const { user, didUserInit, getUser } = useUser();
  const { AddFloatingMessage } = useContext(FloatingMessageContext);
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

  const [foods, setFoods] = useState<CustomFoodDataInterface>(
    locale == "en"
      ? require("../../locales/en.food.json")
      : require("../../locales/hu.food.json")
  );
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

  useEffect(() => {
    if (!didUserInit) return
    if (!user || (user && (user.TicketKey && user.isPaid))) {
      Router.push('/profile')
    }
    else if (user && !user.isPaid) {
      getDefaults()
    }
  }, [didUserInit])

  // ===============================================
  // TICKETS
  // ===============================================
  const getDefaults = async () => {
    await getLimits()
    await getPrices()
    await getTicketLimits()
    await getTicketMax()
    await getDateLimit()

    setIsLoading(false)
  }

  const getDateLimit = async () => {
    await axiosInstance.get('api/defaults/ticket/date')
    .then((res) => {
      setFromDate(new Date(res.data.fromDate))
      setToDate(new Date(res.data.toDate))
    })
    .catch((err) => {
      return
    })
  }

  const getLimits = async () => {
    await axiosInstance.get("api/defaults/ticket")
    .then((res) => {
      setDefaultMinDate(new Date(res.data.minDate))
      setDefaultMaxDate(new Date(res.data.maxDate))
      setMinDate(new Date(res.data.minDate))
      setMaxDate(new Date(res.data.maxDate))
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

  const getPrices = async () => {
    await axiosInstance.get<{prices: IPrices; normal: IPrices | null}>("api/defaults/ticket/prices")
    .then((res) => {
      setPrices(res.data.prices)
      setFullPrices(res.data.normal)
    })
    .catch((err) => {return})
  }

  const getTicketLimits = async () => {
    await axiosInstance.get("api/ticket/limits")
    .then((res) => {
      setTicketLimits(res.data)
    })
    .catch((err) => {return})
  }

  const getTicketMax = async () => {
    await axiosInstance.get("api/defaults/ticket/max")
    .then((res) => {
      setTicketLimitMax(res.data)
    })
    .catch((err) => {return})
  }

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
    setFoods(
      locale == "en"
        ? require("../../locales/en.food.json")
        : require("../../locales/hu.food.json")
    );
  }, [locale]);

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
        selectedFoods[key] == undefined)) {
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

    let tempMinDate: number | undefined = undefined
    let tempMaxDate: number | undefined = undefined

    // Fix date offset for full ticket
    const offsetMax = new Date(defaultMaxDate.valueOf());
    tempMaxDate = offsetMax.getDate() + 1
    offsetMax.setDate(tempMaxDate);

    const earliest = new Date(defaultMinDate.valueOf());
    const last = new Date(offsetMax.valueOf());
    tempMinDate = earliest.getDate() - 1
    tempMaxDate = last.getDate() + 1
    earliest.setDate(tempMinDate);
    last.setDate(tempMaxDate);

    let startDay: string;
    if (selectedTicket == 2) {
      if (wantsDay0) {
        startDay = earliest.toString();
      } else {
        startDay = defaultMinDate.toString();
      }
    } else if (selectedTicket == 1) {
      if (wantsDay0) {
        startDay = earliest.toString();
      } else {
        startDay = selectedDate[0].toString();
      }
    } else {
      startDay = selectedDate[0].toString();
    }

    let endDay: string;
    if (selectedTicket == 2) {
      if (wantsDayExtra) {
        endDay = last.toString();
      } else {
        endDay = offsetMax.toString();
      }
    } else if (selectedTicket == 1) {
      if (wantsDayExtra) {
        endDay = last.toString();
      } else {
        endDay = selectedDate[1].toString();
      }
    } else {
      if (selectedDate[1]) {
        endDay = selectedDate[1].toString();
      } else {
        endDay = selectedDate[0].toString();
      }
    }

    const payload: ITicketForm = {
      ticketType: selectedTicket!.toString() as '0' | '1' | '2',
      extra0: wantsDay0,
      extra1: wantsDayExtra,
      sponsorLevel: isSponsor? (sponsorAmount > 10000? '2' : '1') : '0',
      shirt: isSponsor? (sponsorAmount > 10000? shirtSize : null) : null,
      sponsorPrice: sponsorAmount,
      foodData: selectedTicket==0? null : selectedFoods,
      startDay: startDay,
      endDay: endDay,
    }

    setShowDialog(false)
    setIsDisabled(true)
    setIsLoading(true)

    axiosInstance.post("api/ticket/create", payload)
    .then(() => {
      AddFloatingMessage({
        autocloses: true,
        type: "Success",
        duration: 10,
        message: t("ticketSuccess"),
      });
      Router.push(
        '/profile'
      )
      getUser()
    })
    .catch((err) => {
      AddFloatingMessage({
        autocloses: true,
        type: "Error",
        message: t("errDefault"),
      });
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
      <CustomHead title={t("navTickets")} />
      <LoadingOverlay isLoading={isLoading} />
      <CustomBackground />
      {
        showDialog &&
        <div className={styles.Tickets__Dialog}>
          <div className={styles.Tickets__Dialog__Center}>
            <p>{t("ticketPurchaseQuestion")}</p>
            <div className={styles.Tickets__Dialog__Buttons}>
              <SecondaryButton type="left" text={t("profCancel")} classType={"danger"} onClick={() => setShowDialog(false)} />
              <SecondaryButton type="right" text={t("profConfirm")} classType={"success"} onClick={() => purchase()} />
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
                <h2 className={styles.Tickets__Prices__Title}>{t("ticketTickets")}</h2>
                {
                  isEarlyBird &&
                  <div className={styles.Tickets__Prices__EarlyBird}>
                    <h3>{`${t("ticketEarlyBird")}: ${getDifference(serverDate, earlyBirdDate)} ${t("ticketEarlyBirdExp")}`}</h3>
                    <h3>{createDatePatternFromDate(earlyBirdDate)}</h3>
                  </div>
                }
                <div className={styles.Tickets__Prices__List}>
                  <PriceCard
                  title={t("ticket0Title")}
                  customClass={selectedTicket==0? styles.Tickets__Selected : ''}
                  button={<SecondaryButton disabled={selectedTicket==0} text={t("ticketSelect")} onClick={() => selectTicket(0)} />}
                  description={
                    <span>
                      {t("ticket0Desc")}<br /><br />
                      {t("ticket0Inc")}<br />
                      <ul>
                        <li>{t("ticket0Inc1")}</li>
                        <li>{t("ticket0Inc2")}</li>
                        <li>{t("ticket0Inc3")}</li>
                        <li>{t("ticket0Inc4")}</li>
                        <li>{t("ticket0Inc5")}</li>
                      </ul>
                      <br />
                      {t("ticket0Out")}
                    </span>
                  }
                  fullPrice={fullPrices != null && fullPrices[0].hu}
                  price={prices[0].hu} />

                  <PriceCard
                  title={t("ticket1Title")}
                  customClass={selectedTicket==1? styles.Tickets__Selected : ''}
                  button={
                    <Tippy disabled={(ticketLimits.ticket1Count < ticketLimitMax.ticket1Count) || user.isStaff} content={t("ticketNotAvailable")}>
                      <span>
                        <SecondaryButton disabled={selectedTicket==1 || (ticketLimits.ticket1Count >= ticketLimitMax.ticket1Count) && !user.isStaff} text={t("ticketSelect")} onClick={() => selectTicket(1)} />
                      </span>
                    </Tippy>
                  }
                  description={
                    <span>
                      {t("ticket1Desc")}<br /><br />
                      {t("ticket1Inc")}<br />
                      <ul>
                        <li>{t("ticket1Inc1")}</li>
                        <li>{t("ticket1Inc2")}</li>
                        <li>{t("ticket1Inc3")}</li>
                        <li>{t("ticket1Inc4")}</li>
                        <li>{t("ticket1Inc5")}</li>
                        <li>{t("ticket1Inc6")}</li>
                      </ul>
                      <br />
                      {t("ticket1Out")}
                    </span>
                  }
                  fullPrice={fullPrices != null && fullPrices[1].hu}
                  price={prices[1].hu} />

                  <PriceCard
                  title={t("ticket2Title")}
                  customClass={selectedTicket==2? styles.Tickets__Selected : ''}
                  button={
                    <Tippy disabled={(ticketLimits.ticket2Count < ticketLimitMax.ticket2Count) || user.isStaff} content={t("ticketNotAvailable")}>
                      <span>
                        <SecondaryButton disabled={selectedTicket==2 || (ticketLimits.ticket2Count >= ticketLimitMax.ticket2Count) && !user.isStaff} text={t("ticketSelect")} onClick={() => selectTicket(2)} />
                      </span>
                    </Tippy>
                  }
                  description={
                    <span>
                      {t("ticket2Desc")}<br /><br />
                      {t("ticket2Inc")}<br />
                      <ul>
                        <li>{t("ticket2Inc1")}</li>
                        <li>{t("ticket2Inc2")}</li>
                        <li>{t("ticket2Inc3")}</li>
                        <li>{t("ticket2Inc4")}</li>
                        <li>{t("ticket2Inc5")}</li>
                        <li>{t("ticket2Inc6")}</li>
                      </ul>
                    </span>
                  }
                  fullPrice={fullPrices != null && fullPrices[2].hu}
                  price={prices[2].hu} />
                </div>
              </section>
            </div>
            {
            (selectedTicket==0 || selectedTicket==1) &&
              <div className={styles.Tickets__Content}>
                <section className={styles.Tickets__DaySelect}>
                  <h2>{t("ticketDaySelect")}</h2>
                  <div>
                    <Calendar
                    key={calendarKey}
                    locale={locale}
                    value={Array.isArray(selectedDate)? [selectedDate[0], selectedDate[1]] : selectedDate}
                    defaultActiveStartDate={new Date(2023, 5, 14)}
                    maxDate={(maxDate==defaultMaxDate && selectedTicket==1)? maxDate1Night : maxDate}
                    minDate={minDate}
                    showNavigation={false}
                    selectRange={true}
                    onChange={(e: Date | Date[]) => evaluateDateSelect(e)}
                    view={"month"}
                    allowPartialRange
                    tileClassName={({ date }) => {
                      let zeroDay = new Date(defaultMinDate)
                      zeroDay.setDate(zeroDay.getDate() -1)
                      let extraDay = new Date(maxDate1Night)
                      extraDay.setDate(extraDay.getDate() +1)
                      
                      if ((wantsDay0 && zeroDay.valueOf() == date.valueOf()) ||
                        (wantsDayExtra && extraDay.valueOf() == date.valueOf())) {
                        return 'react-calendar__tile--highlight';
                       }
                       else return null
                    }}
                    />
                  </div>
                  <div className={styles.Tickets__DaySelect__Button}>
                    <SecondaryButton text={t("ticketClear")} onClick={() => resetCalendar()}/>
                  </div>
                </section>
              </div>
            }
            {
              (selectedTicket==2 || selectedTicket==1) &&
              <div className={styles.Tickets__Content}>
                <section className={styles.Tickets__Prices}>
                  <h2 className={styles.Tickets__Prices__Title}>{t("ticketExtra")}</h2>
                  <div className={`${styles.Tickets__Prices__List} ${styles.Tickets__Prices__List_2col}`}>
                    <PriceCard
                    title={t("ticketExtra0")}
                    customClass={wantsDay0? styles.Tickets__Selected : ''}
                    button={
                      <Tippy disabled={isDay0Allowed || selectedTicket!=1} content={t("ticketNotAllowed0")}>
                        <span>
                          <SecondaryButton disabled={!isDay0Allowed && selectedTicket == 1} text={wantsDay0? t("ticketCancel") : t("ticketSelect")} onClick={() => setWantsDay0((o) => !o)} />
                        </span>
                      </Tippy>
                    }
                    description={
                      <span>
                        {t("ticketE0Desc")}<br /><br />
                        {t("ticketE0Inc")}<br />
                        <ul>
                          <li>{t("ticketE0Inc1")}</li>
                          <li>{t("ticketE0Inc2")}</li>
                          <li>{t("ticketE0Inc3")}</li>
                          <li>{t("ticketE0Inc4")}</li>
                          <li>{t("ticketE0Inc5")}</li>
                        </ul>
                        <br />
                        {t("ticketE0Out")}
                      </span>
                    }
                    fullPrice={fullPrices != null && fullPrices.extra0.hu}
                    price={prices.extra0.hu} />

                    <PriceCard
                    title={t("ticketExtra1")}
                    customClass={wantsDayExtra? styles.Tickets__Selected : ''}
                    button={
                    <Tippy disabled={((ticketLimits.extra1Count < ticketLimitMax.extra1Count) || user.isStaff) && (isDay1Allowed || selectedTicket!=1)} content={(!isDay1Allowed && selectedTicket == 1)? t("ticketNotAllowed1") : t("ticketNotAvailable")}>
                      <span>
                        <SecondaryButton disabled={((ticketLimits.extra1Count >= ticketLimitMax.extra1Count) && !user.isStaff) || (!isDay1Allowed && selectedTicket == 1)} text={wantsDayExtra? t("ticketCancel") : t("ticketSelect")} onClick={() => setWantsDayExtra((o) => !o)} />
                      </span>
                    </Tippy>
                    }
                    description={
                      <span>
                        {t("ticketE1Desc")}<br /><br />
                        {t("ticketE1Inc")}<br />
                        <ul>
                          <li>{t("ticketE1Inc1")}</li>
                          <li>{t("ticketE1Inc2")}</li>
                          <li>{t("ticketE1Inc3")}</li>
                          <li>{t("ticketE1Inc4")}</li>
                          <li>{t("ticketE1Inc5")}</li>
                        </ul>
                        <br />
                        {t("ticketE1Out")}
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
                  <h2 className={styles.Tickets__Prices__Title}>{t("ticketFoodSelect")}</h2>
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
                            buttonPlaceholder={t("natSelectSelect")}
                            searchPlaceholder={t("natSelectPlaceholder")}
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
                <h2 className={styles.Tickets__Prices__Title}>{t("ticketSponsor")}</h2>
                <Input
                  type="checkbox"
                  checked={(e) => setIsSponsor(e)}
                  id="chk-1"
                  label={<>{t("ticketSponsorQuestion")}</>}
                ></Input>
                {isSponsor &&
                  <div className={styles.Tickets__Sponsor}>
                    <span>
                      {t("ticketSponsorText1")}<br /><br />
                      {t("ticketSponsorText2")}<br /><br />
                    </span>
                    <Input
                      type="number"
                      label={`${t("ticketSponsorAmount")}:`}
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
                          label={`${t("ticketSponsorShirt")}:`}
                          buttonPlaceholder={t("natSelectSelect")}
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
                <h2 className={styles.Tickets__Prices__Title}>{t("ticketOverview")}</h2>
                <div className={styles.Tickets__Overview}>
                  <table>
                    <tbody>
                      <tr>
                        <td colSpan={2}><span className={styles.Tickets__Overview__Title}><h3>{t("ticketTicket")}</h3></span></td>
                      </tr>
                      <tr>
                        <td>{t("ticketOverviewTicket")}</td>
                        <td>{selectedTicket!=undefined? `${(selectedTicket==1&&evalAmountOfDays()>1)? (`${t(`ticket${selectedTicket}Title`)} * ${evalAmountOfDays()}`) : (t(`ticket${selectedTicket}Title`))}` : <span style={{"color": "red"}}>{t(`ticketNoTicket`)}</span>}</td>
                      </tr>
                      {
                        (selectedTicket==0) &&
                        <tr>
                          <td>{t("ticketDay")}</td>
                          <td>{selectedDate && createDatePatternFromDate(selectedDate[0])} {(selectedDate && selectedDate.length == 2)? '-' : ''} {selectedDate && createDatePatternFromDate(selectedDate[1])} {(!selectedDate.length) && <span style={{"color": "red"}}>{t(`ticketNoDay`)}</span>}</td>
                        </tr>
                      }
                      {
                        (selectedTicket==1) &&
                        <tr>
                          <td>{t("ticketDays")}</td>
                          <td>{selectedDate.length == 2 && `${createDatePatternFromDate(selectedDate[0])} -`} {selectedDate.length == 2 && createDatePatternFromDate(selectedDate[1])} {!Array.isArray(selectedDate) || selectedDate.length < 2 && <span style={{"color": "red"}}>{t(`ticketNoDays`)}</span>}</td>
                        </tr>
                      }
                      {
                        (selectedTicket==2) &&
                        <tr>
                          <td>{t("ticketExtra")}</td>
                          <td>{wantsDay0 && t("ticketExtra0")}{wantsDay0 && wantsDayExtra && ','} {wantsDayExtra && t("ticketExtra1")} {!wantsDay0 && !wantsDayExtra && t("ticketNoExtra")}</td>
                        </tr>
                      }
                      {
                        (selectedTicket==2 || (selectedTicket==1 && selectedDayIndex)) &&
                        <tr>
                          <td colSpan={2}><span className={styles.Tickets__Overview__Title}><h3>{t("ticketFood")}</h3></span></td>
                        </tr>
                      }
                      {
                        (foods && (selectedTicket==2 || (selectedTicket==1 && selectedDayIndex))) &&
                          Object.keys(foods).map((food, i) => {
                            const key = parseInt(food)

                            if (selectedTicket==1 && (selectedDayIndex!-1 < key) || (key <= selectedStartingDayIndex!-1)) return null
                            if (selectedTicket==2 && ((key == 0 && !wantsDay0) || (key == Object.keys(foods).length-1 && !wantsDayExtra))) return null
                            
                            return (
                              <tr key={i}>
                                <td>
                                  {createDatePattern(i+1)}
                                </td>
                                <td>
                                  {foodSelect[key] || <span style={{"color": "red"}}>{t("ticketNoFood")}</span>}
                                </td>
                              </tr>
                            );
                          })
                      }
                      {
                        (isSponsor == true) &&
                        <tr>
                          <td colSpan={2}><span className={styles.Tickets__Overview__Title}><h3>{t("ticketSponsor")}</h3></span></td>
                        </tr>
                      }
                      {
                        (isSponsor == true) &&
                        <>
                        <tr>
                          <td>{t("ticketSponsorAmount")}</td>
                          <td>{`${sponsorAmount} HUF`}</td>
                        </tr>
                        <tr>
                          <td>{t("ticketSponsorLevel")}</td>
                          <td>{sponsorAmount>10000? t("ticketSuperSponsor") : t("ticketSponsor")}</td>
                        </tr>
                        {(isSponsor && sponsorAmount>10000) &&
                          <tr>
                            <td>{t("ticketSponsorShirt")}</td>
                            <td>{shirtSize? shirtSize : <span style={{"color": "red"}}>{t("ticketNoShirt")}</span>}</td>
                          </tr>
                        }
                        </>
                      }
                      {
                        (selectedTicket != undefined) &&
                        <tr>
                          <td colSpan={2}><span className={styles.Tickets__Overview__Title}><h3>{t("ticketPrice")}</h3></span></td>
                        </tr>
                      }
                      {
                        (selectedTicket != undefined && prices != undefined) &&
                        <tr>
                          <td>{t("ticketTicket")}</td>
                          <td>{`${(selectedTicket==0 && prices[0].hu) || (selectedTicket==1 && prices[1].hu) || (selectedTicket==2 && prices[2].hu)} ${selectedTicket==0? (evalAmountOfDays() <= 1)? '' : `(* ${evalAmountOfDays()})` : ''} HUF`}</td>
                        </tr>
                      }
                      {
                        (selectedTicket != undefined && prices != undefined && wantsDay0 == true) &&
                        <tr>
                          <td>{t("ticketExtra0")}</td>
                          <td>{`+${prices.extra0.hu} HUF`}</td>
                        </tr>
                      }
                      {
                        (selectedTicket != undefined && prices != undefined && wantsDayExtra == true) &&
                        <tr>
                          <td>{t("ticketExtra1")}</td>
                          <td>{`+${prices.extra1.hu} HUF`}</td>
                        </tr>
                      }
                      {
                        (selectedTicket != undefined && isSponsor == true) &&
                        <tr>
                          <td>{t("ticketSponsor")}</td>
                          <td>{`+${sponsorAmount} HUF`}</td>
                        </tr>
                      }
                      {
                        (selectedTicket != undefined) &&
                        <tr className={styles.Tickets__Overview__Price}>
                          <td>{`${t("ticketFinalPrice")}`}</td>
                          <td>{`${
                            (selectedTicket==0? (prices[0].hu * evalAmountOfDays()) : 0) + (selectedTicket==1? (prices[1].hu * evalAmountOfDays()) : 0) + (selectedTicket==2? prices[2].hu : 0)
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
                          {`${t("warnDateLimit1")} ${createDatePatternFromDate(fromDate)} - ${createDatePatternFromDate(toDate)} ${t("warnDateLimit2")}`}
                        </p>
                      }
                      <Tippy disabled={user.TicketKey == null} content={t("ticketAlreadyHas")}>
                        <span>
                          <PrimaryButton
                            text={t("ticketBuy")}
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