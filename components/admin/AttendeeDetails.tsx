import { NextPage } from "next";
import React, { useEffect, useMemo, useState } from "react";
import styles from "@/styles/components/admin/AttendeeList.module.scss"
import { IAttendee } from "@/models/newDbModels/attendee.model";

type Props = {
    attendee?: IAttendee;
};

const AttendeeDetails: NextPage<Props> = (props: Props) => {
    const currentAttendee = props.attendee

    if (currentAttendee === undefined){
        return(
            <div>LOADING</div>
        );
    } else{
        return (
            <div className={styles.AttendeeList}>
                <table id="test" className={styles.AttendeeList__Table}>
                    <tbody>
                    <tr>
                        <th>ID</th>
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
                        <th>Date of Birth</th>
                        <td>{currentAttendee.dateOfBirth}</td>
                    </tr>
                    <tr>
                        <th>Telegram</th>
                        <td>{currentAttendee.telegram}</td>
                    </tr>
                    <tr>
                        <th>Allergy</th>
                        <td>{currentAttendee.allergy}</td>
                    </tr>
                    <tr>
                        <th>Registered at</th>
                        <td>{currentAttendee.registeredAt}</td>
                    </tr>
                    <tr>
                        <th>Verified</th>
                        <td>{currentAttendee.verified}</td>
                    </tr>
                    <tr>
                        <th>Ticket ID</th>
                        <td>{currentAttendee.ticketId}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
};
  
  export default AttendeeDetails;