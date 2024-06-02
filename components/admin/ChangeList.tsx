import { NextPage } from "next"
import React, { useEffect, useMemo, useState } from "react";
import { format, differenceInYears } from 'date-fns'
import styles from "@/styles/components/admin/AttendeeList.module.scss"
import { IFursona } from "@/models/newDbModels/fursona.model"
import Picture from "@/comp/utils/Picture";

type Props = {
    changes?: string[];
};

const ChangeList: NextPage<Props> = (props: Props) => {
    const changes = props.changes
    if (changes === undefined || changes.length === 0){
        return(
            <p>No changes</p>
        );
    } else {
        let provisionalUpdateList = [];
            if (changes.indexOf("verifiedStatus") > -1){
                provisionalUpdateList.push(<p key="verifiedStatus">Verified status will be changed</p>)
            }
            if (changes.indexOf("paymentStatus") > -1){
                provisionalUpdateList.push(<p key="paymentStatus">Payment status will be changed</p>)
            }
            if (changes.indexOf("paymentMethod") > -1){
                provisionalUpdateList.push(<p key="paymentMethod">Payment method will be changed</p>)
            }
            if (changes.indexOf("accomodationDeleteFlag") > -1){
                provisionalUpdateList.push(<p key="accomodationDeleteFlag">Room assignment will be removed</p>)
            }
            if (changes.indexOf("assignedRoom") > -1 && !(changes.indexOf("accomodationDeleteFlag") > -1)){
                provisionalUpdateList.push(<p key="assignedRoom">Room assignment will be changed</p>)
            }
            if (changes.indexOf("imageDeleteFlag") > -1){
                provisionalUpdateList.push(<p key="imageDeleteFlag">Profile image will be deleted</p>)
            }
            if (changes.indexOf("deleteFlag") > -1){
                provisionalUpdateList = [<p key={0}>Attendee will be REJECTED and DELETED</p>]
            }
        return(provisionalUpdateList)
    }
};
  
  export default ChangeList;