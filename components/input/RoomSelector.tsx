/* eslint-disable react-hooks/exhaustive-deps */
import { NextPage } from "next";
import React, { useEffect, useMemo, useState } from "react";
import FilterableDropDown from "./FilterableDropDown";
import useTranslate from "@/hooks/translate/useTranslate";
import { IRoom } from "@/models/newDbModels/room.model";
import axiosInstance from "@/functions/utils/axiosConfig";

type Props = {
  label: string;
  onChange: React.Dispatch<React.SetStateAction<number>>;
  value: number;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  disabled?: boolean;
  roomList?: IRoom[]
};


const RoomSelector: NextPage<Props> = ({
  label,
  onChange,
  value,
  onBlur,
  disabled,
  roomList
}: Props) => {
  const [modifiedRooms, setModifiedRooms] = useState<IRoom[]>();
  const [val, setVal] = useState<string>("");
  const [selected, setSelected] = useState<string>("");
  const [rooms, setRooms] = useState<IRoom[]>([])
  const currProp ='number';

  useEffect(() => {
    if (!roomList) {
      axiosInstance.get('/api/v2/room/getFreeRooms').then((res) => {
        setRooms(res.data)
      })
    }
    else {
        console.log(roomList);
        setRooms([...roomList])
    }
  }, [roomList])

  useEffect(() => {
    if (rooms && value) {
      const id = rooms.findIndex((x: IRoom) => x.id == value);
      if (id >= 0) {
        setSelected((rooms[id])[currProp]);
        setVal((rooms[id])[currProp])
      }
    }
    else {
      setSelected('');
      setVal('')
    }
  }, [rooms, value]);

  const changeList = (
    e: string
  ) => {
    setVal(e);

    let tempArr: IRoom[] = [];
    rooms.map((x) => {
      if (x[currProp].toLowerCase().includes(e.toLowerCase())) {
        tempArr.push(x);
      }
    });

    if (e == "") {
      setModifiedRooms([]);
    } else {
      setModifiedRooms(tempArr);
    }
  };

  return (
    <FilterableDropDown
      label={label}
      onChange={onChange}
      setSelected={setSelected}
      selected={selected}
      setValue={setVal}
      buttonPlaceholder="Free Rooms"
      searchPlaceholder="Select Free Room"
      searchValue={val}
      searchFunction={changeList}
      onBlur={onBlur}
      filteredData={modifiedRooms}
      data={rooms}
      dataDisplayVal={currProp}
      dataValue={'id'}
      disabled={disabled}
    />
  );
};

export default RoomSelector;
