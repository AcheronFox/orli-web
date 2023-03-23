/* eslint-disable react-hooks/exhaustive-deps */
import { NextPage } from "next";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { VariableSizeList as List } from "react-window";
import SecondaryButton from "./SecondaryButton";
import Input from "./Input";
import styles from "@/styles/components/FilterableDropDown.module.scss";
import UseWindowDimensions from "@/hooks/useWindowDimensions";
import { RiArrowRightSLine } from "react-icons/ri"

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
  data: any[];
  inputClass?: string;
};

const DropDown: NextPage<Props> = ({
  label,
  onBlur,
  disabled,
  selected,
  buttonPlaceholder,
  data,
  onChange,
  setSelected,
  setValue,
  inputClass
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [switchFlyOut, setSwitchFlyOut] = useState<boolean>(false);
  const InputRef = useRef<HTMLDivElement>(null);
  const size = UseWindowDimensions();
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
        {data[index]}
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
          text={<span className={styles.Selector__Button}>{selected || buttonPlaceholder} <RiArrowRightSLine size={18} className={`${styles.Selector__Button__Icon} ${open && styles.Selector__Button__Open}`} /></span>}
        />
      </div>
      <div className={`${styles.Selector__DropDown} ${open && styles.Selector__Open} ${switchFlyOut && styles.Selector__Reversed}`}>
        <List
            className={styles.Selector__Search}
            itemCount={
                data.length
            }
            itemSize={getSize}
            height={vh(40)}
            width={"100%"}
            ref={listRef}
            >
            {({ index, style }) => (
              <div style={style} className={styles.Selector__Item} 
                onMouseDown={() => {
                  setValue(data[index]);
                  setSelected(data[index]);
                  setOpen(false);
                  if (onChange) onChange(data[index]);
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

export default DropDown;
