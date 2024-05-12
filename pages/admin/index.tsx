import { useEffect, useState } from "react";
import axiosInstance from "@/functions/utils/axiosConfig";
import { NextPage } from "next";
import { IAttendee } from "@/models/newDbModels/attendee.model";
import AttendeeList from "@/comp/admin/AttendeeList";
import styles from "@/styles/pages/Admin.module.scss"

type Props = {}

const AdminPage: NextPage<Props> = (props: Props) => {
  const [attendees, setAttendees] = useState<IAttendee[]>([])

  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [serverDate, setServerDate] = useState<Date>();

  useEffect(() => {
    getDefaults()
  }, [])

  const getDefaults = async () => {
    await axiosInstance.get('/api/v2/attendee/')
      .then((res) => {
        setAttendees(res.data)
    })
    .catch((err) => {
      return
    })
  }

  return (
    <div className={styles.Admin}>
      <div className={styles.Admin__Content}>
        <AttendeeList attendees={attendees}></AttendeeList>
      </div>
    </div>
  );
}
export default AdminPage


/*export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if (!await isMethodAllowed(req, res, 'GET')) {
        return;
    }

    const sendResponse = (code: number, data: Object | String = '') => {
        res.status(code).json(data);
    }

    let response: IParticipant[] = [];
    const query = async () => {
        return new Promise(async (resolve) => {
            const query = 
            `
            SELECT 
                attendee.nationalityId,
                fursona.name,
                fursona.species,
                fursona.pathToPictureFile,
                fursona.hasFursuit,
                ticket.sponsorLevel
            FROM
                attendee
                    INNER JOIN
                fursona ON attendee.fursonaId = fursona.id
                    AND attendee.verified = TRUE
                    INNER JOIN
                ticket ON attendee.ticketId = ticket.id
                    AND ticket.isPaid = TRUE;
            `;

            database.query(query, async (err: any, result: IParticipant[]) => {
                if (err) {
                    console.log("ERROR: ", err);
                    sendResponse(500, {message: "Unknown Error", e_code: "part_1"}); 
                    resolve(false);
                }
                response = result;
                resolve(true);
            });
        }).catch(() => {
            sendResponse(500, {message: "Unknown Error", e_code: "part_2"});
        });
    }

    if (await query()) {
        sendResponse(200, _.orderBy(response, ['name'],['asc']));
    }

    return (
      <>
        <div className={styles.Registration__Button}>
          <>
          <Button
           
          >
            TEST
          </Button>
        </>
      </div>
      <TempWIP/>
    </>
    );
}*/