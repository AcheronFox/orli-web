import { NextPage } from "next"
import React, { useEffect, useMemo, useState } from "react";
import { format, differenceInYears } from 'date-fns'
import styles from "@/styles/components/admin/AttendeeList.module.scss"
import { IAttendee } from "@/models/newDbModels/attendee.model"
import { INationality } from "@/models/newDbModels/nationality.model"
import axiosInstance from "@/functions/utils/axiosConfig";

type Props = {
    attendee?: IAttendee;
};

const formatDate = (inputDate: any) => {
    if (typeof inputDate === "string"){
        return(format(new Date(inputDate), "yyyy/MM/dd"));
    } else {
        return("N/A")
    }
}

const formatDateTime = (inputDateTime: any) => {
    if (typeof inputDateTime === "string"){
        let dateTimeToFormat = new Date(inputDateTime);
        dateTimeToFormat.setHours(dateTimeToFormat.getHours() - 2)
        return(format(dateTimeToFormat, "yyyy/MM/dd HH:mm:ss"));
    } else {
        return("N/A")
    }
}

const formatBooleanYesNo = (inputBoolean: any) => {
    if (typeof inputBoolean === "number" && inputBoolean in [1,2]){
        switch(inputBoolean){
            case 1: return("Yes");
            case 0: return("No");
        }
    } else {
        return("N/A")
    }
}

const calculateAge = (inputDoB: any) => {
    if (typeof inputDoB === "string"){
        return(differenceInYears(new Date(), new Date(inputDoB)));
    } else {
        return ("N/A")
    }
}

const trimTelegram = (inputTelegram: any) => {
    if (typeof inputTelegram === "string" && inputTelegram !== "https://t.me/" && inputTelegram.startsWith("https://t.me/")){
        const trimmedTelegram = inputTelegram.replace("https://t.me/", "");
        return(<a href={inputTelegram} target="_blank">{trimmedTelegram}</a>)
    } else if (typeof inputTelegram === "string" && inputTelegram !== ""){
        return(<p>{inputTelegram}</p>)
    } else {
        const emtpyString = "-"
        return (<p>{emtpyString}</p>)
    }
}

const emptyStringYesNo = (inputString: any) => {
    if (typeof inputString === "string" && inputString.length > 0){
        return ("Yes")
    } else {
        return ("")
    }
}

const AttendeeDetails: NextPage<Props> = (props: Props) => {
    const currentAttendee = props.attendee
    const [nationality, setNationality] = useState<INationality>()

    useEffect(() => {
        if(currentAttendee !== undefined && currentAttendee.nationalityId !== undefined){
            getNationality(currentAttendee.nationalityId);
        }
      }, [currentAttendee])
    
    const getNationality = async (nationalityId: number) => {
        await axiosInstance.get('/api/v2/nationality', {params: {id: nationalityId}})
            .then((res) => {
            setNationality(res.data)
        })
        .catch((err) => {
            return
        })
    }

    if (currentAttendee === undefined){
        return(
            <div>LOADING</div>
        );
    } else{
        const dateOfBirth = formatDate(currentAttendee.dateOfBirth);
        const age = calculateAge(currentAttendee.dateOfBirth);
        const telegram = trimTelegram(currentAttendee.telegram);
        const registeredAt = formatDateTime(currentAttendee.registeredAt);
        const verified = formatBooleanYesNo(currentAttendee.verified);
        const admin = formatBooleanYesNo(currentAttendee.admin);
    
        let nationalityDisplayed;
        if (nationality === undefined){
            nationalityDisplayed = "Loading"
        } else {
            nationalityDisplayed = nationality.countryNameEnglish
        }

        return (
            <table id="test" className={styles.AttendeeList__Table}>
                <tbody>
                <tr>
                    <th>Attendee ID</th>
                    <td>{currentAttendee.id}</td>
                </tr>
                <tr>
                    <th>FirstName</th>
                    <td>{currentAttendee.firstName}</td>
                </tr>
                <tr>
                    <th>Last Name</th>
                    <td>{currentAttendee.lastName}</td>
                </tr>
                <tr>
                    <th>E-mail</th>
                    <td>{currentAttendee.email}</td>
                </tr>
                <tr>
                    <th>Nationality</th>
                    <td>{nationalityDisplayed}</td>
                </tr>
                <tr>
                    <th>Date of Birth</th>
                    <td>{dateOfBirth}</td>
                </tr>
                <tr>
                    <th>Age</th>
                    <td>{age}</td>
                </tr>
                <tr>
                    <th>Phone</th>
                    <td>{currentAttendee.phone}</td>
                </tr>
                <tr>
                    <th>Telegram</th>
                    <td>{telegram}</td>
                </tr>
                <tr>
                    <th>Allergy</th>
                    <td>{currentAttendee.allergy}</td>
                </tr>
                <tr>
                    <th>Registered at</th>
                    <td>{registeredAt}</td>
                </tr>
                <tr>
                    <th>Verified?</th>
                    <td>{verified}</td>
                </tr>
                <tr>
                    <th>Is Admin?</th>
                    <td>{admin}</td>
                </tr>
                </tbody>
            </table>
        );
    }
};
  
  export default AttendeeDetails;