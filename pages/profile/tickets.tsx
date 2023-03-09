/* eslint-disable react-hooks/exhaustive-deps */
import styles from "@/styles/pages/Tickets.module.scss"
import { useTranslate } from "@/hooks/useTranslate";
import { NextPage } from "next";
import { useUser } from "@/hooks/useUser";
import SecondaryButton from "@/comp/SecondaryButton";
import { useEffect, useState } from "react";
import Router from "next/router";
import PriceCard from "@/comp/PriceCard";
import Calendar from 'react-calendar'
import axiosInstance from "@/utils/axiosConfig";
import Slider from "@/comp/Slider";
import Input from "@/comp/Input";
import { IFood } from "@/models/food.model";
import FilterableDropDown from "@/comp/FilterableDropDown";

type Props = {}

interface CustomFoodFilterInterface {[index: number]: IFood[];}
interface CustomFoodDataInterface   {[index: number]: IFood[];}
interface CustomFoodSearchInterface {[index: number]: string; }
interface CustomFoodSelectInterface {[index: number]: string; }
interface CustomFoodValueInterface {[index: number]: number; }

const Tickets: NextPage<Props> = (props: Props) => {
  const { t, locale } = useTranslate();
  const { user, didUserInit } = useUser();

  const [selectedTicket, setSelectedTicket] = useState<number>()
  const [wantsDay0, setWantsDay0] = useState<boolean>(false)
  const [wantsDayExtra, setWantsDayExtra] = useState<boolean>(false)

  const [defaultMinDate, setDefaultMinDate] = useState<Date>(new Date())
  const [defaultMaxDate, setDefaultMaxDate] = useState<Date>(new Date())
  const [minDate, setMinDate] = useState<Date>()
  const [maxDate, setMaxDate] = useState<Date>()
  const [selectedDate, setSelectedDate] = useState<Date | Date[]>()
  const [calendarKey, setCalendarKey] = useState<number>(0)

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
  const [sponsorAmount, setSponsorAmount] = useState<number>(0)
  const minSponsor = 5000
  const maxSponsor = 50000

  useEffect(() => {
    if (!didUserInit) return
    if (!user) {
      Router.push('/')
    }
  }, [didUserInit])

  useEffect(() => {
    if (user) getDefaults()
  }, [user])


  // ===============================================
  // TICKETS
  // ===============================================
  const selectTicket = (ticket: number) => {
    setSelectedTicket(ticket)
    setWantsDay0(false)
    setWantsDayExtra(false)
    resetCalendar()
  }

  // ===============================================
  // CALENDAR
  // ===============================================
  const getDefaults = () => {
    axiosInstance.get("api/defaults/tickets")
    .then((res) => {
      setDefaultMinDate(new Date(res.data.minDate))
      setDefaultMaxDate(new Date(res.data.maxDate))
      setMinDate(new Date(res.data.minDate))
      setMaxDate(new Date(res.data.maxDate))
    })
    .catch((err) => console.log(err))
  }

  const resetCalendar = () => {
    setSelectedDate([])
    setMinDate(defaultMinDate)
    setMaxDate(defaultMaxDate)
    setCalendarKey(calendarKey? 0 : 1)
  }

  const evaluateDateLimits = (e?: Date) => {
    if (selectedTicket!=1) return
    if (e) {
      const minDate = new Date(e.valueOf());
      const maxDate = new Date(e.valueOf());

      const newMinDate = minDate.getDate() - 1
      const newMaxDate = maxDate.getDate() + 1

      minDate.setDate((newMinDate < defaultMinDate.getDate())? defaultMinDate.getDate() : newMinDate);
      maxDate.setDate((newMaxDate > defaultMaxDate.getDate())? defaultMaxDate.getDate() : newMaxDate);
      setMinDate(minDate)
      setMaxDate(maxDate)
    }
    else if (Array.isArray(selectedDate)) {
      setMinDate(selectedDate[0])
      setMaxDate(selectedDate[1])
    }
  }

  useEffect(() => {
    if (Array.isArray(selectedDate) && selectedDate.length == 2) evaluateDateLimits()
  }, [selectedDate])

  const evaluateDateSelect = (e: Date | Date[]) => {
    if (Array.isArray(e)) {
      if ((e.length == 2)) {
        if (e[0].getDate() != e[1].getDate()) {
          setSelectedDate(e)
        }
        else {
          setSelectedDate([])
          setMinDate(defaultMinDate)
          setMaxDate(defaultMaxDate)
        }
      }
      else {
        setSelectedDate(e)
      }
    }
    else {
      setSelectedDate(e)
    }
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

      const index = foods[key].findIndex((x: IFood) => x.value == foodSearch[key]);
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
  const updateFoodValue = (key: number, value: number) => {
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

  useEffect(() => {
    console.log(selectedFoods)
  }, [selectedFoods])

  return (
    <div className={styles.Tickets}>
      {
        user &&
        <> 
          <div className={styles.Tickets__Content}>
            <section className={styles.Tickets__Prices}>
              <h2 className={styles.Tickets__Prices__Title}>{t("ticketTickets")}</h2>
              <div className={styles.Tickets__Prices__List}>
                <PriceCard
                title={t("ticket0Title")}
                customClass={selectedTicket==0? styles.Tickets__Selected : ''}
                button={<SecondaryButton disabled={selectedTicket==0} text={t("ticketSelect")} onClick={() => selectTicket(0)} />}
                description={"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Recusandae, optio commodi. Ducimus incidunt sit sed eveniet fugiat a, molestias vel quibusdam nisi voluptatum provident soluta nulla dolorem, animi, saepe id!"}
                price={"100"} />

                <PriceCard
                title={t("ticket1Title")}
                customClass={selectedTicket==1? styles.Tickets__Selected : ''}
                button={<SecondaryButton disabled={selectedTicket==1} text={t("ticketSelect")} onClick={() => selectTicket(1)} />}
                description={"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Recusandae, optio commodi. Ducimus incidunt sit sed eveniet fugiat a, molestias vel quibusdam nisi voluptatum provident soluta nulla dolorem, animi, saepe id!"}
                price={"100"} />

                <PriceCard
                title={t("ticket2Title")}
                customClass={selectedTicket==2? styles.Tickets__Selected : ''}
                button={<SecondaryButton disabled={selectedTicket==2} text={t("ticketSelect")} onClick={() => selectTicket(2)} />}
                description={"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Recusandae, optio commodi. Ducimus incidunt sit sed eveniet fugiat a, molestias vel quibusdam nisi voluptatum provident soluta nulla dolorem, animi, saepe id!"}
                price={"100"} />
              </div>
            </section>
          </div>
          {
            (selectedTicket==2) &&
            <div className={styles.Tickets__Content}>
              <section className={styles.Tickets__Prices}>
                <h2 className={styles.Tickets__Prices__Title}>{t("ticketExtra")}</h2>
                <div className={styles.Tickets__Prices__List}>
                  <PriceCard
                  title={t("ticketExtra0")}
                  customClass={wantsDay0? styles.Tickets__Selected : ''}
                  button={<SecondaryButton text={wantsDay0? t("ticketCancel") : t("ticketSelect")} onClick={() => setWantsDay0((o) => !o)} />}
                  description={"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Recusandae, optio commodi. Ducimus incidunt sit sed eveniet fugiat a, molestias vel quibusdam nisi voluptatum provident soluta nulla dolorem, animi, saepe id!"}
                  price={"100"} />

                  <PriceCard
                  title={t("ticketExtra1")}
                  customClass={wantsDayExtra? styles.Tickets__Selected : ''}
                  button={<SecondaryButton text={wantsDayExtra? t("ticketCancel") : t("ticketSelect")} onClick={() => setWantsDayExtra((o) => !o)} />}
                  description={"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Recusandae, optio commodi. Ducimus incidunt sit sed eveniet fugiat a, molestias vel quibusdam nisi voluptatum provident soluta nulla dolorem, animi, saepe id!"}
                  price={"100"} />
                </div>
              </section>
            </div>
          }
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
                  maxDate={maxDate}
                  minDate={minDate}
                  showNavigation={false}
                  selectRange={selectedTicket==1}
                  onClickDay={(e) => evaluateDateLimits(e)}
                  onChange={(e: Date | Date[]) => evaluateDateSelect(e)}
                  view={"month"}
                  allowPartialRange
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
                <h2 className={styles.Tickets__Prices__Title}>{t("ticketFoodSelect")}</h2>
                <div className={styles.Tickets__Foods}>
                  {
                    foods &&
                    Object.keys(foods).map((food, i) => {
                      const key = parseInt(food)
                      return (
                        <FilterableDropDown
                          key={i}
                          label={`Day ${i}:`}
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
                  <Input
                    type="number"
                    label={`${t("ticketSponsorAmount")}:`}
                    value={sponsorAmount}
                    onChange={(e) => setSponsorAmount(parseInt(e.target.value))}
                    onBlur={(e) => setSponsorAmount(parseInt(e.target.value))}
                    min={minSponsor}
                    max={9999999}
                  />
                  <Slider
                    min={minSponsor}
                    max={maxSponsor}
                    step={500}
                    tooltipText={"HUF"}
                    value={sponsorAmount}
                    returnValue={(e: number) => setSponsorAmount(e)}
                  />
                </div>
              }
            </section>
          </div>
          <div className={styles.Tickets__Content}>
            <section className={styles.Tickets__Prices}>
              <h2 className={styles.Tickets__Prices__Title}>{t("ticketOverview")}</h2>
              <div className={styles.Tickets__Prices__List}>

              </div>
            </section>
          </div>
        </>
      }
      
    </div>
  )
}

export default Tickets;