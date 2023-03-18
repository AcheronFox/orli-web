/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/components/DatePicker.module.scss";
import { RiCalendar2Fill, RiCloseFill } from "react-icons/ri";
import Calendar from 'react-calendar';
import { useTranslate } from "@/hooks/useTranslate";
import Input from "./Input";
import SecondaryButton from "./SecondaryButton";

type Props = {
  id?: string;
  className?: string;
  name?: string;
  label?: string;
  onChange?: Function;
  value?: string | number | readonly string[] | undefined;
  onClick?: React.MouseEventHandler<HTMLInputElement>;
  isDateValid: Function;
  placeholder?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  inputClass?: string;
};

const CustomDatePicker = React.forwardRef(
  (
    { name, className, id, label, onChange, value, onClick, isDateValid, placeholder, onBlur, inputClass}: Props,
    ref: React.Ref<HTMLInputElement>
  ) => {
    const { t, locale } = useTranslate()
    const [template, setTemplate] = useState<string>("");
    const [allowDelete, setAllowDelete] = useState<boolean>(false);
    const [previousValue, setPreviousValue] = useState<string>("");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const refCa = useRef<any>(null);
    const refButton = useRef<any>(null);

    useEffect(() => {
      setTemplate(t("dateFormat"))
    }, [locale])

    useEffect(() =>{
      updateInput();
    }, [template])

    useEffect(() => {
      document.addEventListener('mousedown', closeModal)
      return function cleaup() {
        document.removeEventListener('mousedown', closeModal)
      }
    }, [refCa])

    const closeModal = (e: any) => {
      if (refCa.current && !isOpen && !refCa.current.contains(e.target)) {
        setIsOpen(false)
      }
    };

    const updateInput = () => {
      if (!value) return;

      const stripped = value.toString().replace(/[^0-9]/g, "");

      const {year, month, day} = fillEmptySpace(stripped)
      validateDate(year, month, day);

      setPreviousValue(`${year}/${month}/${day}`);
      if (onChange) onChange(`${year}/${month}/${day}`);
    }

    const update = (e: React.ChangeEvent<HTMLInputElement>) => {
      let isDelete = false;
      if (previousValue.length > e.target.value.length) isDelete = true;

      let stripped = e.target.value.replace(/[^0-9]/g, "");
      if (isDelete && allowDelete && stripped.length <= 7)
        stripped = stripped.slice(0, -1);
      if (stripped.length >= 9) return;

      const isNum = /^\d+$/.test(stripped);
      if (!isNum && stripped != "") return;

      const {year, month, day} = fillEmptySpace(stripped)
      const final = replace(year, month, day);

      validateDate(year, month, day);

      e.target.value = final;

      setPreviousValue(e.target.value);
      if (onChange) onChange(e.target.value);
      if (!isDelete && stripped.length >= 8) setAllowDelete(false);
      else setAllowDelete(true);
    };

    const updateGui = (date: Date | null) => {
      if (!date) return;

      const offset = date.getTimezoneOffset()
      date = new Date(date.getTime() - (offset*60*1000));

      let day = date.getDate().toString();
      let month = (date.getMonth() + 1).toString();
      let year = date.getFullYear().toString();

      if (parseInt(day) < 10) day = '0' + day;
      if (parseInt(month) < 10) month = '0' + month;

      while (year.length < 4) {
        year = `0${year}`
      }

      const final = replace(year, month, day);

      validateDate(year, month, day);

      if (onChange) onChange(final);
      setPreviousValue(final);
    }

    const fillEmptySpace = (input: string) => {
      let year = input.slice(0, 4);
      while (year.length < 4) {
        year = year + template[1];
      }
      let month = input.slice(4, 6);
      while (month.length < 2) {
        month = month + template[5];
      }
      let day = input.slice(6, 8);
      while (day.length < 2) {
        day = day + template[9];
      }
      return {year, month, day}
    }

    const replace = (y:string, m:string, d:string) => {
      let val;
      if (locale == "en") {
        val = template
        .replace("dd", d)
        .replace("mm", m)
        .replace("yyyy", y);
      }
      else {
        val = template
        .replace("nn", d)
        .replace("hh", m)
        .replace("éééé", y);
      }
      return val;
    }

    const validateDate = (year: string, month: string, day: string) => {
      const datePattern = `${year}-${month}-${day}`;
      const actualDate = new Date(datePattern);
      isDateValid(!isNaN(actualDate.getDate()));
    }

    const handleClick = (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (e) e.preventDefault();
      setIsOpen(!isOpen);
    };

    const handleChange = (e: Date | null) => {
      setIsOpen(!isOpen);
      updateGui(e);
    };

    const disableKeyStroke = (e: any) => {
      const disallowedKeys = [37, 38, 39, 40]
      if (disallowedKeys.includes(e.keyCode)) e.preventDefault()
    }

    return (
      
        <div className={`${styles.DatePicker} ${className}`}>
          <label htmlFor={id}>
            {label}
          </label>
          <div className={styles.DatePicker__InputWrapper}>
            <Input
              className={styles.DatePicker__Input}
              type="text"
              name={name}
              id={id}
              onChange={update}
              placeholder={placeholder? placeholder : t("dateFormat")}
              value={value}
              list="autoCompleteOff"
              autoComplete="nope"
              onClick={onClick}
              ref={ref}
              onBlur={onBlur}
              inputClass={inputClass}
              onKeyDown={disableKeyStroke}
            ></Input>
            <div ref={refButton}>
              <SecondaryButton text={<RiCalendar2Fill size={24} />} onClick={() => handleClick()}></SecondaryButton>
            </div>
          </div>
          <div className={`${styles.DatePicker__Wrapper} ${isOpen? '' : styles.DatePicker__Wrapper__Hidden}`} ref={refCa}>
            <div className={styles.DatePicker__Modal}>
              <button
                className={`${styles.DatePicker__Wrapper__Btn}`}
                onClick={(e) => handleClick(e)}
              >
                <RiCloseFill size={26} />
              </button>
              <Calendar
                locale={locale}
                className="react-calendar"                
                onChange={(e: Date | null) => handleChange(e)}
              />
            </div>
          </div>
        </div>
    );
  }
);

CustomDatePicker.displayName = 'CustomDatePicker';

export default CustomDatePicker;
