import { NextPage } from "next";
import Router from 'next/router'
import styles from "@/styles/components/admin/AttendeeList.module.scss"
import axiosInstance from "@/functions/utils/axiosConfig";
import { IAttendee } from "@/models/newDbModels/attendee.model";
import { format, differenceInYears } from 'date-fns'
import { useState, useEffect } from "react"
import { INationality } from "@/models/newDbModels/nationality.model";
import { IFursona } from "@/models/newDbModels/fursona.model";
import { ITicket } from "@/models/newDbModels/ticket.model";

type Props = {
    attendees: IAttendee[];
    sortColumn: string;
    setSortColumn: any;
    sortDirection: number;
    setSortDirection: any;
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
        let dateTimeToFormat = new Date(inputDateTime);
        dateTimeToFormat.setHours(dateTimeToFormat.getHours() - 2)
        return(format(dateTimeToFormat, "yyyy/MM/dd HH:mm:ss"));
    } else {
        return("N/A")
    }
}

const formatBooleanYesNo = (inputBoolean: any) => {
    if (typeof inputBoolean === "number"){
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
    const [fursona, setFursona] = useState<IFursona>()
    const [ticket, setTicket] = useState<ITicket>()

    useEffect(() => {
        if(attendee.nationalityId !== undefined && attendee.nationalityId !== null){
            getNationality(attendee.nationalityId);
        }
        if(attendee.fursonaId !== undefined && attendee.fursonaId !== null){
            getFursona(attendee.fursonaId);
        }
        if(attendee.ticketId !== undefined  && attendee.ticketId !== null){
            getTicket(attendee.ticketId);
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

    const getFursona = async (fursonaId: number) => {
        await axiosInstance.get('/api/v2/fursona', {params: {id: fursonaId}})
            .then((res) => {
            setFursona(res.data)
        })
        .catch((err) => {
            return
        })
    }

    const getTicket = async (ticketId: number) => {
        await axiosInstance.get('/api/v2/ticket', {params: {id: ticketId}})
            .then((res) => {
            setTicket(res.data)
        })
        .catch((err) => {
            return
        })
    }

    const rowAttendeeId = (attendee.id === undefined || attendee.id === null) ? 0 : attendee.id;

    const dateOfBirth = formatDate(attendee.dateOfBirth);
    const age = calculateAge(attendee.dateOfBirth);
    const telegram = trimTelegram(attendee.telegram);
    const allergy = emptyStringYesNo(attendee.allergy);
    const registeredAt = formatDateTime(attendee.registeredAt);
    const verified = formatBooleanYesNo(attendee.verified);
    const staff = formatBooleanYesNo(attendee.staff);
    const admin = formatBooleanYesNo(attendee.admin);

    const nationalityDisplayed = (nationality === undefined || fursona === null) ? "-" : nationality.countryNameEnglish;
    const fursonaDisplayed = (fursona === undefined || fursona === null) ? "-" : fursona.name;
    const isPaidDisplayed = formatBooleanYesNo((ticket === undefined || ticket === null || ticket.isPaid === undefined || ticket.isPaid === null) ? 0 : ticket.isPaid);
    const paymentMethodDisplayed = (ticket === undefined || ticket === null || ticket.paymentMethod === undefined || ticket.paymentMethod === null) ? "-" : ticket.paymentMethod;

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
            <td>{fursonaDisplayed}</td>
            <td>{attendee.email}</td>
            <td>{nationalityDisplayed}</td>
            <td>{dateOfBirth}</td>
            <td>{age}</td>
            <td>{telegram}</td>
            <td>{allergy}</td>
            <td>{registeredAt}</td>
            <td>{verified}</td>
            <td>{isPaidDisplayed}</td>
            <td>{paymentMethodDisplayed}</td>
            <td>{staff}</td>
            <td>{admin}</td>
        </tr>
    );
}

const AttendeeList: NextPage<Props> = (props: Props) => {
    const [sortColumn, setSortColumn] = useState<string>(props.sortColumn)
    const [sortDirection, setSortDirection] = useState<number>(props.sortDirection)
    
    useEffect(() => {
        props.setSortColumn(sortColumn)
    }, [sortColumn])

    useEffect(() => {
        props.setSortDirection(sortDirection)
    }, [sortDirection])

    const handleClick = (col:string) => {
        if (col === sortColumn){
            setSortDirection(sortDirection * -1)
        } else {
            setSortColumn(col)
            setSortDirection(1)
        }
    }

    const displaySort = (col:string) => {
        if (col === sortColumn){
            if (sortDirection === 1){
                return (<b>🡻</b>)
            } else {
                return (<b>🡹</b>)
            }
        } else {
            return (<b> </b>)
        }
    }

    return (
        <div className={styles.AttendeeList}>
            <table id="test" className={styles.AttendeeList__Table}>
                <thead>
                    <tr>
                        <th onClick={() => handleClick("id")}>ID{displaySort("id")}</th>
                        <th onClick={() => handleClick("firstName")}>First Name{displaySort("firstName")}</th>
                        <th onClick={() => handleClick("lastName")}>Last Name{displaySort("lastName")}</th>
                        <th onClick={() => handleClick("fursona")}>Fursona{displaySort("fursona")}</th>
                        <th onClick={() => handleClick("email")}>E-mail{displaySort("email")}</th>
                        <th onClick={() => handleClick("nationalityId")}>Nationality{displaySort("nationalityId")}</th>
                        <th onClick={() => handleClick("dateOfBirth")}>D.o.B.{displaySort("dateOfBirth")}</th>
                        <th onClick={() => handleClick("dateOfBirth")}>Age{displaySort("dateOfBirth")}</th>
                        <th onClick={() => handleClick("telegram")}>Telegram{displaySort("telegram")}</th>
                        <th onClick={() => handleClick("allergy")}>Allergy{displaySort("allergy")}</th>
                        <th onClick={() => handleClick("registeredAt")}>Registered at{displaySort("registeredAt")}</th>
                        <th onClick={() => handleClick("verified")}>Verified?{displaySort("verified")}</th>
                        <th onClick={() => handleClick("isPaid")}>Paid?{displaySort("isPaid")}</th>
                        <th onClick={() => handleClick("paymentMethod")}>Payment Method{displaySort("paymentMethod")}</th>
                        <th onClick={() => handleClick("staff")}>Is Staff?{displaySort("staff")}</th>
                        <th onClick={() => handleClick("admin")}>Is Admin?{displaySort("admin")}</th>
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