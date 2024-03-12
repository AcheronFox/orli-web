/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/components/input/DatePicker.module.scss";
import { RiCalendar2Fill } from "react-icons/ri";
import Calendar from 'react-calendar';
import { useClickOutside } from "@/hooks/utils/useClickOutside";
import useTranslate from "@/hooks/translate/useTranslate";
import Input from "./Input";
import { Value } from "react-calendar/dist/cjs/shared/types";
import IconButton from "../button/IconButton";
import Button from "../button/Button";

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
  error?: boolean;
};

const CustomDatePicker = React.forwardRef(
  (
    { name, className, id, label, onChange, value, onClick, isDateValid, placeholder, onBlur, error}: Props,
    ref: React.Ref<HTMLInputElement>
  ) => {
    const { lang, currLang } = useTranslate()
    const [template, setTemplate] = useState<string>("");
    const [allowDelete, setAllowDelete] = useState<boolean>(false);
    const [previousValue, setPreviousValue] = useState<string>("");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const refCa = useRef<any>(null);

    useClickOutside(refCa, () => {
      setIsOpen(false)
    })

    useEffect(() => {
      setTemplate(lang.dateFormat)
    }, [currLang])

    useEffect(() =>{
      updateInput();
    }, [template])

    const updateInput = () => {
      if (!value) return;

      const stripped = value.toString().replace(/[^0-9]/g, "");

      const {year, month, day} = fillEmptySpace(stripped)
      validateDate(year, month, day);

      setPreviousValue(`${year}/${month}/${day}`);
      if (onChange) onChange(`${year}/${month}/${day}`);
    }

    const update = (e: string) => {
      let isDelete = false;
      if (previousValue.length > e.length) isDelete = true;

      let stripped = e.replace(/[^0-9]/g, "");
      if (isDelete && allowDelete && stripped.length <= 7)
        stripped = stripped.slice(0, -1);
      if (stripped.length >= 9) return;

      const isNum = /^\d+$/.test(stripped);
      if (!isNum && stripped != "") return;

      const {year, month, day} = fillEmptySpace(stripped)
      const final = replace(year, month, day);

      validateDate(year, month, day);

      e = final;

      setPreviousValue(e);
      if (onChange) onChange(e);
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
      if (currLang == "en") {
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

    useEffect(() => {
      if (!value) return
      const tempArr = value?.toString().split('/')
      validateDate(tempArr[0], tempArr[1], tempArr[2])
    }, [value])

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
          <label style={{marginRight: "1rem", marginTop: "2rem"}} htmlFor={id || 'datepicker'}>
            {label}
          </label>
          <Input
            type="text"
            name={name}
            id={id || 'datepicker'}
            onChange={(e) => update(e)}
            label={placeholder? placeholder : lang.dateFormat}
            value={value}
            list="autoCompleteOff"
            autoComplete="nope"
            onClick={onClick}
            ref={ref}
            onBlur={onBlur}
            error={error}
            onKeyDown={disableKeyStroke}
            endAdornment={
              <IconButton
                onClick={() => handleClick()}
                size="small"
              >
                <RiCalendar2Fill  />
              </IconButton>
            }
          ></Input>
          <div className={`${styles.DatePicker__Wrapper} ${isOpen? '' : styles.DatePicker__Wrapper__Hidden}`}>
            <div ref={refCa}>
              <Calendar
                locale={currLang}
                className="react-calendar"                
                onChange={(e: Value) => handleChange(e as unknown as Date | null)}
              />
            </div>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setIsOpen(false)}
            >
              {lang.dateClose}
            </Button>
          </div>
        </div>
    );
  }
);

CustomDatePicker.displayName = 'CustomDatePicker';

export default CustomDatePicker;
