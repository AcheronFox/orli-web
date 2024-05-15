/* eslint-disable react-hooks/exhaustive-deps */
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import FilterableDropDown from "./FilterableDropDown";
import useTranslate from "@/hooks/translate/useTranslate";
import { INationality } from "@/models/newDbModels/nationality.model";
import axiosInstance from "@/functions/utils/axiosConfig";

type Props = {
  label: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  value: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  disabled?: boolean;
  nationalityList?: INationality[]
};


const PhoneCodeSelector: NextPage<Props> = ({
  label,
  onChange,
  value,
  onBlur,
  disabled,
  nationalityList
}: Props) => {
  const { lang } = useTranslate();

  const [modifiedNationalities, setModifiedNationalities] = useState<INationality[]>();
  const [val, setVal] = useState<string>("");
  const [selected, setSelected] = useState<string>("");
  const [nationalities, setNationalities] = useState<INationality[]>([])

  useEffect(() => {
    if (!nationalityList) {
      axiosInstance.get('/api/v2/nationality/').then((res) => {
        setNationalities(res.data)
      })
    }
    else setNationalities([...nationalityList])
  }, [nationalityList])

  useEffect(() => {
    if (nationalities && value) {
      const id = nationalities.findIndex((x: INationality) => x.phoneCode == value);
      if (id >= 0) {
        setSelected((nationalities[id]).phoneCode);
        setVal((nationalities[id]).phoneCode)
      }
    }
    else {
      setSelected('');
      setVal('')
    }
  }, [nationalities, value]);

  const changeList = (
    e: string
  ) => {
    setVal(e);

    let tempArr: INationality[] = [];
    nationalities.map((x) => {
      if (x.phoneCode.toLowerCase().includes(e.toLowerCase())) {
        tempArr.push(x);
      }
    });

    if (e == "") {
      setModifiedNationalities([]);
    } else {
      setModifiedNationalities(tempArr);
    }
  };

  return (
    <FilterableDropDown
      label={label}
      onChange={onChange}
      setSelected={setSelected}
      selected={selected}
      setValue={setVal}
      buttonPlaceholder={''}
      searchPlaceholder={''}
      searchValue={val}
      searchFunction={changeList}
      onBlur={onBlur}
      filteredData={modifiedNationalities}
      data={nationalities}
      dataDisplayVal={'phoneCode'}
      dataValue={'phoneCode'}
      disabled={disabled}
    />
  );
};

export default PhoneCodeSelector;
