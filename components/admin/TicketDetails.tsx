import { NextPage } from "next"
import React, { useEffect, useMemo, useState } from "react";
import { format, differenceInYears } from 'date-fns'
import styles from "@/styles/components/admin/AttendeeList.module.scss"
import { ITicket } from "@/models/newDbModels/ticket.model"
import { INationality } from "@/models/newDbModels/nationality.model"
import axiosInstance from "@/functions/utils/axiosConfig";

type Props = {
    ticket?: ITicket;
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

const formatSponsorship = (inputSponsorLevel: any, inputSponsorPrice: any, inputShirtSize: any) => {
    const sponsorLevel = inputSponsorLevel;
    
    let shirtSize;
    if (inputShirtSize === undefined){
        shirtSize = "No size selected"
    } else {
        shirtSize = inputShirtSize
    }

    let sponsorPrice;
    if (inputSponsorPrice === undefined){
        sponsorPrice = 0
    } else {
        sponsorPrice = inputSponsorPrice
    }

    if (sponsorLevel === undefined || sponsorLevel === "None"){
        return("-");
    } else if (sponsorLevel === "Regular") {
        if (sponsorPrice === 0) {
            return(sponsorLevel + " - " + "0 HUF (Possible error)")
        } else {
            return(sponsorLevel + " - " + sponsorPrice + " HUF")
        }
    } else if (sponsorLevel === "Super") {
        if (sponsorPrice === 0) {
            return(sponsorLevel + " - " + "0 HUF (Possible error) - Shirt: " + shirtSize)
        } else {
            return(sponsorLevel + " - " + sponsorPrice + " HUF - " + shirtSize)
        }
    }
}

const TicketDetails: NextPage<Props> = (props: Props) => {
    const currentTicket = props.ticket
    if (currentTicket === undefined){
        return(
            <div>No ticket</div>
        );
    } else { 
        const earlyArrival = formatBooleanYesNo(currentTicket.earlyArrival);
        const lateDeparture = formatBooleanYesNo(currentTicket.lateDeparture);
        const arrivalDate = formatDate(currentTicket.arrivalDate);
        const departureDate = formatDate(currentTicket.departureDate);
        const sponsorship = formatSponsorship(currentTicket.sponsorLevel, currentTicket.sponsorPrice, currentTicket.shirtSize)
        const isPaid = formatBooleanYesNo(currentTicket.isPaid);
        const createdAt = formatDateTime(currentTicket.createdAt);

        return (
            <table id="test" className={styles.AttendeeList__Table}>
                <tbody>
                <tr>
                    <th>Ticket ID</th>
                    <td>{currentTicket.id}</td>
                </tr>
                <tr>
                    <th>Type</th>
                    <td>{currentTicket.type}</td>
                </tr>
                <tr>
                    <th>Early Arrival</th>
                    <td>{earlyArrival}</td>
                </tr>
                <tr>
                    <th>Late Departure</th>
                    <td>{lateDeparture}</td>
                </tr>
                <tr>
                    <th>Arrival Date</th>
                    <td>{arrivalDate}</td>
                </tr>
                <tr>
                    <th>Departure Date</th>
                    <td>{departureDate}</td>
                </tr>
                <tr>
                    <th>Food</th>
                    <td>TBA (in development)</td>
                </tr>
                <tr>
                    <th>Sponsorship</th>
                    <td>{sponsorship}</td>
                </tr>
                <tr>
                    <th>Total Price</th>
                    <td>{currentTicket.totalPrice} HUF</td>
                </tr>
                <tr>
                    <th>Payment Method</th>
                    <td>{currentTicket.paymentMethod}</td>
                </tr>
                <tr>
                    <th>Paid?</th>
                    <td>{isPaid}</td>
                </tr>
                <tr>
                    <th>Record created at:</th>
                    <td>{createdAt}</td>
                </tr>
                </tbody>
            </table>
        );
    }
};
  
  export default TicketDetails;