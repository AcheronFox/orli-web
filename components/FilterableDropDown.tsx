/* eslint-disable react-hooks/exhaustive-deps */
import { NextPage } from "next";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { VariableSizeList as List } from "react-window";
import SecondaryButton from "./SecondaryButton";
import Input from "./Input";
import styles from "@/styles/components/FilterableDropDown.module.scss";

type Props = {
  label: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  setSelected: Function;
  setValue: Function;
  close?: Function;
  disabled?: boolean;
  selected: any;
  buttonPlaceholder?: string;
  searchFunction?: Function;
  searchValue?: string;
  searchPlaceholder: string;
  filteredData?: any[];
  data: any[];
  dataDisplayVal: string;
  dataValue: string;
  inputClass?: string;
};

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener("resize", handleResize);

      handleResize();

      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);
  return windowSize;
};

const FilterableDropDown: NextPage<Props> = ({
  label,
  onBlur,
  disabled,
  selected,
  searchFunction,
  buttonPlaceholder,
  searchValue,
  searchPlaceholder,
  filteredData,
  data,
  dataDisplayVal,
  dataValue,
  onChange,
  setSelected,
  setValue,
  inputClass
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [switchFlyOut, setSwitchFlyOut] = useState<boolean>(false);
  const InputRef = useRef<HTMLDivElement>(null);
  const size = useWindowSize();
  const dropdownAnchor = useRef<any>()

  const sizeMap = useRef<any>();
  const setSize = useCallback((index: any, size: any) => {
    sizeMap.current = { ...sizeMap.current, [index]: size };
    listRef.current.resetAfterIndex(index);
  }, []);

  const listRef = useRef<any>(null);

  const vh = (v: number) => {
    const h = size.height;
    return (v * h) / 100;
  };

  const adjustFlyout = () => {
    const anchor = dropdownAnchor.current.getBoundingClientRect();
    const body = document.body;
    const html = document.documentElement;

    const height = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );

    let shouldSwitch;
    shouldSwitch = anchor.bottom >= height / 2;

    if (shouldSwitch) {
      setSwitchFlyOut(true);
    } else {
      setSwitchFlyOut(false);
    }
  };

  useEffect(() => {
    adjustFlyout();

    const closeDropDownOutside = (e: any) => {
      if (InputRef.current != null && !InputRef.current.contains(e.target)) {
        setOpen(!open);
      }
    };

    if (open) {
      document.addEventListener("click", closeDropDownOutside);
      return function cleanup() {
        document.removeEventListener("click", closeDropDownOutside);
      };
    }
    return function cleanup() {
      document.removeEventListener("click", closeDropDownOutside);
      return function cleanup() {
        document.removeEventListener("click", closeDropDownOutside);
      };
    };
  }, [open]);

  const openDropDown = () => {
    if (disabled) return

    setOpen((o) => !o)
  }

  const Row = ({ index, setSize, windowWidth }: any) => {
    const rowRef = useRef<any>();

    useEffect(() => {
        setSize(index, (rowRef.current.getBoundingClientRect().height + 10));
    }, [setSize, index, windowWidth]);

    return (
      <div
        ref={rowRef}
        key={index}
      >
        {filteredData?.length? filteredData[index][dataDisplayVal] : data[index][dataDisplayVal]}
      </div>
    );
  }

  const getSize = (index: number) => {
    //fallback
    if (!sizeMap.current) return 50
    return sizeMap.current[index]
  };

  return (
    <div ref={InputRef} className={styles.Selector}>
      <div className={styles.Selector__Selection} ref={dropdownAnchor}>
        <span className={styles.Selector__Label}>{label}</span>
        <SecondaryButton
          onClick={openDropDown}
          text={selected || buttonPlaceholder}
        />
      </div>
      <div className={`${styles.Selector__DropDown} ${open && styles.Selector__Open} ${switchFlyOut && styles.Selector__Reversed}`}>
        <Input
          type="text"
          onChange={(e) => {
            searchFunction? searchFunction(e) : {};
          }}
          value={searchValue}
          placeholder={searchPlaceholder}
          inputClass={`${styles.Selector__Input} ${inputClass}`}
          onBlur={onBlur}
        ></Input>
        <List
            className={styles.Selector__Search}
            itemCount={
                filteredData?.length ? filteredData.length : data.length
            }
            itemSize={getSize}
            height={vh(40)}
            width={"100%"}
            ref={listRef}
            >
            {({ index, style }) => (
              <div style={style} className={styles.Selector__Item} 
                onMouseDown={() => {
                  setValue(filteredData?.length? filteredData[index][dataDisplayVal] : data[index][dataDisplayVal]);
                  setSelected(filteredData?.length? filteredData[index][dataDisplayVal] : data[index][dataDisplayVal]);
                  setOpen(false);
                  onChange(filteredData?.length? filteredData[index][dataDisplayVal] : data[index][dataValue]);
                }}>
                  <Row
                  index={index}
                  setSize={setSize}
                  windowWidth={size.width}
                  />
              </div>
            )}
        </List>
      </div>
    </div>
  );
};

export default FilterableDropDown;
