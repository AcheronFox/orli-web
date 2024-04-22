/* eslint-disable react-hooks/exhaustive-deps */
import { NextPage } from "next";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { VariableSizeList as List } from "react-window";
import Input from "./Input";
import styles from "@/styles/components/input/FilterableDropDown.module.scss";
import UseWindowDimensions from "@/hooks/utils/useWindowDimensions";
import { RiArrowRightSLine } from "react-icons/ri"
import Button from "../button/Button";

type Props = {
  label: string;
  onChange?: Function;
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
  dataDisplayVal: string | string[];
  dataValue: string;
  minWidth?: number
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
  minWidth
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [switchFlyOut, setSwitchFlyOut] = useState<boolean>(false);
  const InputRef = useRef<HTMLDivElement>(null);
  const size = UseWindowDimensions();
  const dropdownAnchor = useRef<any>()
  const [listHeight, setListHeight] = useState<number>(0)

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

    const shouldSwitch = anchor.bottom >= height / 2;;

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
      if (listHeight < vh(40)) setListHeight((listHeight + (rowRef.current.getBoundingClientRect().height + 10)))
    }, [setSize, index, windowWidth]);

    return (
      <div
        ref={rowRef}
        key={index}
      >
        {
          (Array.isArray(dataDisplayVal))?
          <span>
            {
              dataDisplayVal.map((val, i) => {
                return (
                  <>
                    {
                      (i+1 < dataDisplayVal.length)?
                      `${filteredData?.length? filteredData[index][val] : data[index][val]} - `
                      :
                      filteredData?.length? filteredData[index][val] : data[index][val]
                    }
                  </>
                );
              })
            }
          </span>
          :
          filteredData?.length? filteredData[index][dataDisplayVal] : data[index][dataDisplayVal]
        }
      </div>
    );
  }

  const getSize = (index: number) => {
    //fallback
    if (!sizeMap.current) return 50
    return sizeMap.current[index]
  };

  const calculateHeight = () => {
    let tempHeight = 0;
    if (!sizeMap.current) return vh(40)

    Object.keys(sizeMap.current).map((key) => {
      tempHeight = tempHeight + sizeMap.current[key]
    })
    
    if (tempHeight > vh(40)) return vh(40)
    else return tempHeight
  }

  return (
    <div ref={InputRef} style={{minWidth: minWidth}} className={styles.Selector}>
      <div className={styles.Selector__Selection} ref={dropdownAnchor}>
        <span className={styles.Selector__Label}>{label}</span>
        <Button
          variant="outlined"
          color="info"
          onClick={openDropDown}
          endIcon={
            <RiArrowRightSLine size={18} className={`${styles.Selector__Button__Icon} ${open && styles.Selector__Button__Open}`} />
          }
        >
          <span
            className={styles.Selector__Button}
          >
            {selected || buttonPlaceholder}
          </span>
        </Button>
      </div>
      <div className={`${styles.Selector__DropDown} ${open && styles.Selector__Open} ${switchFlyOut && styles.Selector__Reversed}`}>
        <Input
          type="text"
          onChange={(e) => {
            searchFunction? searchFunction(e) : {};
          }}
          value={searchValue}
          label={searchPlaceholder}
          onBlur={onBlur}
        ></Input>
        <List
            className={styles.Selector__Search}
            itemCount={
                filteredData?.length ? filteredData.length : data.length
            }
            itemSize={getSize}
            height={calculateHeight()}
            width={"100%"}
            ref={listRef}
            >
            {({ index, style }) => (
              <div style={style} className={styles.Selector__Item} 
                onMouseDown={() => {
                  if (Array.isArray(dataDisplayVal)) {
                    let stringData: string = '';
                    dataDisplayVal.forEach((val, i) => {
                      if (filteredData?.length) {
                        stringData = `${stringData}${filteredData[index][val]}`
                      }
                      else {
                        stringData = `${stringData}${data[index][val]}`
                      }
                      if (i+1 < dataDisplayVal.length) stringData = `${stringData} - `
                    })
                    setValue(stringData);
                    setSelected(stringData);  
                  }
                  else {
                    setValue(filteredData?.length? filteredData[index][dataDisplayVal] : data[index][dataDisplayVal]);
                    setSelected(filteredData?.length? filteredData[index][dataDisplayVal] : data[index][dataDisplayVal]);  
                  }
                  setOpen(false);
                  if (onChange) onChange(filteredData?.length? filteredData[index][dataValue] : data[index][dataValue]);
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
