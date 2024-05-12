import { NextPage } from "next";
import Router from 'next/router'
import styles from "@/styles/components/admin/AttendeeList.module.scss"
import axiosInstance from "@/functions/utils/axiosConfig";
import { IAttendee } from "@/models/newDbModels/attendee.model";
import { format, differenceInYears } from 'date-fns'
import { useState, useEffect } from "react"
import { INationality } from "@/models/newDbModels/nationality.model";

type Props = {
    attendees: IAttendee[];
};

type RowProps = {
    attendee: IAttendee
}

const navigateToSelectedAttendee = (attendeeId: number) => {
    Router.push(
        { 
            pathname: '/admin/user',
            query: {selectedAttendeeId: attendeeId}
        }
    )
}

const formatDate = (inputDate: any) => {
    if (typeof inputDate === "string"){
        return(format(new Date(inputDate), "yyyy/MM/dd"));
    } else {
        return("N/A")
    }
}

const formatDateTime = (inputDateTime: any) => {
    if (typeof inputDateTime === "string"){
        return(format(new Date(inputDateTime), "yyyy/MM/dd hh:mm:ss"));
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

const Row = ({attendee}: RowProps) => {
    const [nationality, setNationality] = useState<INationality>()

    useEffect(() => {
        if(attendee.nationalityId !== undefined){
            getNationality(attendee.nationalityId);
        }
      }, [attendee])
    
    const getNationality = async (nationalityId: number) => {
        await axiosInstance.get('/api/v2/nationality', {params: {id: nationalityId}})
            .then((res) => {
            setNationality(res.data)
        })
        .catch((err) => {
            return
        })
    }

    let rowAttendeeId: any;
    if (attendee.id === undefined){
        rowAttendeeId = 0;
    } else {
        rowAttendeeId = attendee.id;
    }
    const dateOfBirth = formatDate(attendee.dateOfBirth);
    const age = calculateAge(attendee.dateOfBirth);
    const telegram = trimTelegram(attendee.telegram);
    const allergy = emptyStringYesNo(attendee.allergy);
    const registeredAt = formatDateTime(attendee.registeredAt);
    const verified = formatBooleanYesNo(attendee.verified);
    const admin = formatBooleanYesNo(attendee.admin);

    let nationalityDisplayed;
    if (nationality === undefined){
        nationalityDisplayed = "Loading"
    } else {
        nationalityDisplayed = nationality.countryNameEnglish
    }

    return(
        <tr>
            <td>
                <button 
                    className={styles.AttendeeList__Button} 
                    onClick={(e:any) => navigateToSelectedAttendee(rowAttendeeId)}>
                    {attendee.id}
                </button>
            </td>
            <td>{attendee.firstName}</td>
            <td>{attendee.lastName}</td>
            <td>{attendee.email}</td>
            <td>{nationalityDisplayed}</td>
            <td>{dateOfBirth}</td>
            <td>{age}</td>
            <td>{telegram}</td>
            <td>{allergy}</td>
            <td>{registeredAt}</td>
            <td>{verified}</td>
            <td>{admin}</td>
        </tr>
    );
}

const AttendeeList: NextPage<Props> = (props: Props) => {  
    return (
        <div className={styles.AttendeeList}>
            <table id="test" className={styles.AttendeeList__Table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>E-mail</th>
                        <th>Nationality</th>
                        <th>D.o.B.</th>
                        <th>Age</th>
                        <th>Telegram</th>
                        <th>Allergy</th>
                        <th>Registered at</th>
                        <th>Verified?</th>
                        <th>Is Admin?</th>
                    </tr>
                </thead>
                <tbody>
                    {props.attendees.map((attendee, i) => {
                        return(
                            <Row key={i} attendee={attendee} />
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
  
  export default AttendeeList;