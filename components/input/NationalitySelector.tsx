/* eslint-disable react-hooks/exhaustive-deps */
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import FilterableDropDown from "./FilterableDropDown";
import useTranslate from "@/hooks/translate/useTranslate";

type Props = {
  label: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  value: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  disabled?: boolean;
};
type Codes = {
  id: number;
  alpha2: string;
  alpha3: string;
  name: string;
};

const NationalitySelector: NextPage<Props> = ({
  label,
  onChange,
  value,
  onBlur,
  disabled
}: Props) => {
  const { currLang, lang } = useTranslate();
  const [modifiedCodes, setModifiedCodes] = useState<Codes[]>();
  const [val, setVal] = useState<string>("");
  const [selected, setSelected] = useState<string>("");

  /*
    NOTE: REPLACE THESE WITH DATA FROM BACKEND
  */
  const [Codes, setCodes] = useState<[Codes]>(
    currLang == "en"
      ? require("../../locales/en/en.world.json")
      : require("../../locales/hu/hu.world.json")
  );
  useEffect(() => {
    setCodes(
      currLang == "en"
        ? require("../../locales/en/en.world.json")
        : require("../../locales/hu/hu.world.json")
    );
  }, [currLang]);

  useEffect(() => {
    if (Codes && value) {
      const id = Codes.findIndex((x:Codes) => x.alpha2 == value);
      if (id >= 0) {
        setSelected(Codes[id].name);
        setVal(Codes[id].name)
      }
    }
    else {
      setSelected('');
      setVal('')
    }
  }, [Codes, value]);

  const changeList = (
    e: string
  ) => {
    setVal(e);

    let tempArr: Codes[] = [];
    Codes.map((x) => {
      if (x.name.toLowerCase().includes(val.toLowerCase())) {
        tempArr.push(x);
      }
    });

    if (e == "") {
      setModifiedCodes([]);
    } else {
      setModifiedCodes(tempArr);
    }
  };

  return (
    <FilterableDropDown
      label={label}
      onChange={onChange}
      setSelected={setSelected}
      selected={selected}
      setValue={setVal}
      buttonPlaceholder={lang.natSelectSelect}
      searchPlaceholder={lang.natSelectPlaceholder}
      searchValue={val}
      searchFunction={changeList}
      onBlur={onBlur}
      filteredData={modifiedCodes}
      data={Codes}
      dataDisplayVal={"name"}
      dataValue={"alpha2"}
      disabled={disabled}
    />
  );
};

export default NationalitySelector;
