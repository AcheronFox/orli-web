/* eslint-disable react-hooks/exhaustive-deps */
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { useTranslate } from "@/hooks/useTranslate";
import FilterableDropDown from "./FilterableDropDown";

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
  const { locale } = useTranslate();
  const [Codes, setCodes] = useState<[Codes]>(
    locale == "en"
      ? require("../locales/en.world.json")
      : require("../locales/hu.world.json")
  );
  const [modifiedCodes, setModifiedCodes] = useState<Codes[]>();
  const [val, setVal] = useState<string>("");
  const [selected, setSelected] = useState<string>("");
  const { t } = useTranslate();

  useEffect(() => {
    setCodes(
      locale == "en"
        ? require("../locales/en.world.json")
        : require("../locales/hu.world.json")
    );
  }, [locale]);

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setVal(e.target.value);

    let tempArr: Codes[] = [];
    Codes.map((x) => {
      if (x.name.toLowerCase().includes(val.toLowerCase())) {
        tempArr.push(x);
      }
    });

    if (e.target.value == "") {
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
      buttonPlaceholder={t("natSelectSelect")}
      searchPlaceholder={t("natSelectPlaceholder")}
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
