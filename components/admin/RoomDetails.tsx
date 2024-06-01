import { NextPage } from "next"
import React, { useEffect, useMemo, useState } from "react";
import { format, differenceInYears } from 'date-fns'
import styles from "@/styles/components/admin/AttendeeList.module.scss"
import { IRoom } from "@/models/newDbModels/room.model"
import { IAccomodation } from "@/models/newDbModels/accomodation.model"
import { IAttendee } from "@/models/newDbModels/attendee.model"
import axiosInstance from "@/functions/utils/axiosConfig";

type Props = {
    room?: IRoom;
    roommates?: string[];
    accommodation?: IAccomodation;
};

const formatBooleanYesNo = (inputBoolean: any) => {
    if (typeof inputBoolean === "number" && inputBoolean in [0,1]){
        switch(inputBoolean){
            case 1: return("Yes");
            case 0: return("No");
        }
    } else {
        return("N/A")
    }
}

const RoomDetails: NextPage<Props> = (props: Props) => {      
    const currentRoom = props.room
    const currentRoommates = (props.roommates === undefined) ? [] : props.roommates
    const isAdmin = (props.accommodation === undefined) ? 0 : props.accommodation.isOwner

    if (currentRoom === undefined){
        return(
            <div>No room</div>
        );
    } else { 
        
        const freeSpots = (currentRoommates === undefined) ? 0 : currentRoom.size - currentRoommates.length - 1
        const displayRoomName = (currentRoom.customName !== null && currentRoom.customName !== undefined) ? currentRoom.customName : "-"
        const displayIsAdmin = formatBooleanYesNo(isAdmin);

        return (
            <table id="test" className={styles.AttendeeList__Table}>
                <tbody>
                <tr>
                    <th>Building / Room</th>
                    <td>{currentRoom.building} / {currentRoom.number}</td>
                </tr>
                <tr>
                    <th>Name</th>
                    <td>{displayRoomName}</td>
                </tr>
                <tr>
                    <th>Roommates</th>
                    <td>{currentRoommates.map(roommate => <><span>{roommate}</span><br></br></>)}</td>
                </tr>
                <tr>
                    <th>Free Spots</th>
                    <td>{freeSpots}</td>
                </tr>
                <tr>
                    <th>Is Admin?</th>
                    <td>{displayIsAdmin}</td>
                </tr>
                </tbody>
            </table>
        );
    }
};
  
  export default RoomDetails;