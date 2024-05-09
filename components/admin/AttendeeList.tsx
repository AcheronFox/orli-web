import { NextPage } from "next";
import Router from 'next/router'
import styles from "@/styles/components/admin/AttendeeList.module.scss"
import { IAttendee } from "@/models/newDbModels/attendee.model";

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

const Row = ({attendee}: RowProps) => {
    let rowAttendeeId;
    if (attendee.id === undefined){
        rowAttendeeId = 0;
    } else {
        rowAttendeeId = attendee.id;
    }

    return(
        <tr>
            <td><button className={styles.AttendeeList__Button} onClick={(e:any) => navigateToSelectedAttendee(rowAttendeeId)}>SELECT ID {attendee.id}</button></td>
            <td>{attendee.firstName}</td>
            <td>{attendee.lastName}</td>
            <td>{attendee.email}</td>
            <td>{attendee.dateOfBirth}</td>
            <td>{attendee.phone}</td>
            <td>{attendee.telegram}</td>
            <td>{attendee.allergy}</td>
            <td>{attendee.registeredAt}</td>
            <td>{attendee.verified}</td>
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
                        <th>D.o.B.</th>
                        <th>Phone</th>
                        <th>Telegram</th>
                        <th>Allergy</th>
                        <th>Reg. At</th>
                        <th>Verified?</th>
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