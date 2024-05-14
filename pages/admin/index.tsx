/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axiosInstance from "@/functions/utils/axiosConfig";
import { NextPage } from "next";
import { IAttendee } from "@/models/newDbModels/attendee.model";
import { INationality } from "@/models/newDbModels/nationality.model";
import { IFursona } from "@/models/newDbModels/fursona.model";
import { ITicket } from "@/models/newDbModels/ticket.model";
import AttendeeList from "@/comp/admin/AttendeeList";
import Input from "@/comp/input/Input";
import Checkbox from "@/comp/input/Checkbox";
import styles from "@/styles/pages/Admin.module.scss"
import Router from "next/router";
import { useUser } from "@/hooks/user/useUser";
import { RiCreativeCommonsSaLine } from "react-icons/ri";
import ticket from "@/locales/en/en.ticket";

type Props = {}

const AdminPage: NextPage<Props> = (props: Props) => {
  const [attendees, setAttendees] = useState<IAttendee[]>([])
  const [fursonas, setFursonas] = useState<IFursona[]>([])
  const [tickets, setTickets] = useState<ITicket[]>([])
  const [nationalities, setNationalities] = useState<INationality[]>([])
  const [filteredAttendees, setFilteredAttendees] = useState<IAttendee[]>([])
  const [sortedAttendees, setSortedAttendees] = useState<IAttendee[]>([])
  const [sortColumn, setSortColumn] = useState<string>("id")
  const [sortDirection, setSortDirection] = useState<number>(1) // 1 = asc, -1 = desc

  const [filterName, setFilterName] = useState<string|undefined>(undefined)
  const [filterEmail, setFilterEmail] = useState<string|undefined>(undefined)
  const [filterFursona, setFilterFursona] = useState<string|undefined>(undefined)
  const [filterNationality, setFilterNationality] = useState<string|undefined>(undefined)
  const [filterDoB, setFilterDoB] = useState<string|undefined>(undefined)
  const [filterContact, setFilterContact] = useState<string|undefined>(undefined)
  const [filterVerified, setFilterVerified] = useState<boolean|undefined>(undefined)
  const [filterPaid, setFilterPaid] = useState<boolean|undefined>(undefined)
  const [filterPaymentMethod, setFilterPaymentMethod] = useState<string|undefined>(undefined)
  const [filterStaff, setFilterStaff] = useState<boolean|undefined>(undefined)
  const [filterAdmin, setFilterAdmin] = useState<boolean|undefined>(undefined)

  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [serverDate, setServerDate] = useState<Date>();

  const { user, didUserInit } = useUser()
  const [isAuthenTicated, setIsAuthenticated] = useState<boolean>(false)
  
  // ===============================================
  // AUTHENTICATION
  // ===============================================
  useEffect(() => {
    if (!didUserInit) return
    if (!user || !user.attendee.admin) {
        Router.push('/')
    }
    else if (user && user.attendee.admin) {
        runAuth()
    }
}, [didUserInit])

  const runAuth = async () => {
    await axiosInstance.get(`/api/admin/auth`)
      .then((res) => {
          setIsAuthenticated(true)
          getDefaults()
      })
      .catch((err) => {
          setIsAuthenticated(false)
          Router.push('/')
      })
      .finally(() => {
        // If using loading  
        // setIsLoading(false)
      })
  }

  const getAttendes = async () => {
    await axiosInstance.get('/api/v2/attendee/')
    .then((res) => {
      setAttendees(res.data)
      setSortedAttendees(res.data)
    })
    .catch((err) => {
      return
    })
  }
  
  const getFursonas = async () => {
    await axiosInstance.get('/api/v2/fursona/', {params: {all: true}})
    .then((res) => {
      setFursonas(res.data)
    })
    .catch((err) => {
      return
    })
  }

  const getTickets = async () => {
    await axiosInstance.get('/api/v2/ticket/', {params: {all: true}})
    .then((res) => {
      setTickets(res.data)
    })
    .catch((err) => {
      return
    })
  }

  const getNationalities = async () => {
    await axiosInstance.get('/api/v2/nationality/')
    .then((res) => {
      setNationalities(res.data)
    })
    .catch((err) => {
      return
    })
  }

  const getDefaults = async () => {
    getAttendes();
    getFursonas();
    getTickets();
    getNationalities();
  }

  const filterAttendeeArray = () => {
    let filter:IAttendee[] = attendees;
    if (filterName !== undefined && filterName !== ""){
      filter = filter.filter((a) => (a.firstName.toUpperCase().includes(filterName.toUpperCase()) || a.lastName.toUpperCase().includes(filterName.toUpperCase())))
    }
    if (filterEmail !== undefined && filterEmail !== ""){
      filter = filter.filter((a) => (a.email.toUpperCase().includes(filterEmail.toUpperCase())))
    }
    if (filterFursona !== undefined && filterFursona != ""){
      filter = filter.filter((a) => (fursonas.find(({ id }) => id === a.fursonaId) !== undefined && fursonas.find(({ id }) => id === a.fursonaId)!.name.toUpperCase().includes(filterFursona.toUpperCase())))
    }
    if (filterNationality !== undefined && filterNationality != ""){
      console.log(filterNationality);
      filter = filter.filter((a) => (nationalities.find(({ id }) => id === a.nationalityId) !== undefined && (nationalities.find(({ id }) => id === a.nationalityId)!.countryNameEnglish.toUpperCase().includes(filterNationality.toUpperCase()) || nationalities.find(({ id }) => id === a.nationalityId)!.countryNameHungarian.toUpperCase().includes(filterNationality.toUpperCase()))))
    }
    if (filterDoB !== undefined && filterDoB.length === 4){
      filter = filter.filter((a) => (a.dateOfBirth.toUpperCase().includes(filterDoB)))
    }
    if (filterContact !== undefined && filterContact != ""){
      filter = filter.filter((a) => (a.telegram !== undefined && a.telegram.toUpperCase().includes(filterContact.toUpperCase())))
    }
    if (filterVerified !== undefined){
      filter = filter.filter((a) => (a.verified == filterVerified))
    }
    if (filterPaid !== undefined){
      filter = filter.filter((a) => (
        (filterPaid == true && tickets.find(({ id }) => id === a.ticketId) !== undefined && tickets.find(({ id }) => id === a.ticketId)!.isPaid == true) ||
        (filterPaid == false && (tickets.find(({ id }) => id === a.ticketId) === undefined || tickets.find(({ id }) => id === a.ticketId)!.isPaid == false))
      ))
    }
    if (filterPaymentMethod !== undefined && filterPaymentMethod != ""){
      filter = filter.filter((a) => (tickets.find(({ id }) => id === a.ticketId) !== undefined && tickets.find(({ id }) => id === a.ticketId)!.paymentMethod !== undefined && tickets.find(({ id }) => id === a.ticketId)!.paymentMethod!.toUpperCase().includes(filterPaymentMethod.toUpperCase())))
    }
    if (filterStaff !== undefined){
      filter = filter.filter((a) => (a.staff == filterStaff))
    }
    if (filterAdmin !== undefined){
      filter = filter.filter((a) => (a.admin == filterAdmin))
    }
    return (filter);
  }

  const sortAttendeeArray = () => {
    let sort:IAttendee[] = [];
    switch(sortColumn){
      case "id":
        sort = filteredAttendees.sort((a, b) => {
          const idA = (a.id === undefined) ? 0 : a.id
          const idB = (b.id === undefined) ? 0 : b.id
          if (idA < idB) {
            return -1 * sortDirection;
          }
          if (idA > idB) {
            return 1 * sortDirection;
          }
          return 0;
        });
        break;
      case "firstName":
        sort = filteredAttendees.sort((a, b) => {
          const firstNameA = (a.firstName === undefined) ? "" : a.firstName.toUpperCase()
          const firstNameB = (b.firstName === undefined) ? "" : b.firstName.toUpperCase()
          if (firstNameA < firstNameB) {
            return -1 * sortDirection;
          }
          if (firstNameA > firstNameB) {
            return 1 * sortDirection;
          }
          return 0;
        });
        break;
      case "lastName":
        sort = filteredAttendees.sort((a, b) => {
          const lastNameA = (a.lastName === undefined) ? "" : a.lastName.toUpperCase()
          const lastNameB = (b.lastName === undefined) ? "" : b.lastName.toUpperCase()
          if (lastNameA < lastNameB) {
            return -1 * sortDirection;
          }
          if (lastNameA > lastNameB) {
            return 1 * sortDirection;
          }
          return 0;
        });
        break;
      case "fursona":
        sort = filteredAttendees.sort((a, b) => {
          const fursonaA = (a.fursonaId === undefined || fursonas === undefined || fursonas.find(({ id }) => id === a.fursonaId) === undefined) ? "" : fursonas.find(({ id }) => id === a.fursonaId)!.name.toUpperCase()
          const fursonaB = (b.fursonaId === undefined || fursonas === undefined || fursonas.find(({ id }) => id === b.fursonaId) === undefined) ? "" : fursonas.find(({ id }) => id === b.fursonaId)!.name.toUpperCase()
          console.log(fursonaA, fursonaB)
          if (fursonaA < fursonaB) {
            return -1 * sortDirection;
          }
          if (fursonaA > fursonaB) {
            return 1 * sortDirection;
          }
          return 0;
        });
        break;
      case "email":
        sort = filteredAttendees.sort((a, b) => {
          const emailA = (a.email === undefined) ? "" : a.email.toUpperCase()
          const emailB = (b.email === undefined) ? "" : b.email.toUpperCase()
          if (emailA < emailB) {
            return -1 * sortDirection;
          }
          if (emailA > emailB) {
            return 1 * sortDirection;
          }
          return 0;
        });
        break;
      case "nationalityId":
        sort = filteredAttendees.sort((a, b) => {
          const nationalityIdA = (a.nationalityId === undefined) ? 0 : a.nationalityId
          const nationalityIdB = (b.nationalityId === undefined) ? 0 : b.nationalityId
          if (nationalityIdA < nationalityIdB) {
            return -1 * sortDirection;
          }
          if (nationalityIdA > nationalityIdB) {
            return 1 * sortDirection;
          }
          return 0;
        });
        break;
      case "dateOfBirth":
        sort = filteredAttendees.sort((a, b) => {
          const dateOfBirthA = (a.dateOfBirth === undefined) ? "" : a.dateOfBirth
          const dateOfBirthB = (b.dateOfBirth === undefined) ? "" : b.dateOfBirth
          if (dateOfBirthA < dateOfBirthB) {
            return -1 * sortDirection;
          }
          if (dateOfBirthA > dateOfBirthB) {
            return 1 * sortDirection;
          }
          return 0;
        });
        break;
      case "telegram":
        sort = filteredAttendees.sort((a, b) => {
          const telegramA = (a.telegram === undefined) ? "" : a.telegram.toUpperCase()
          const telegramB = (b.telegram === undefined) ? "" : b.telegram.toUpperCase()
          if (telegramA < telegramB) {
            return -1 * sortDirection;
          }
          if (telegramA > telegramB) {
            return 1 * sortDirection;
          }
          return 0;
        });
        break;
      case "allergy":
        sort = filteredAttendees.sort((a, b) => {
          const allergyA= (a.allergy === undefined) ? "" : a.allergy.toUpperCase()
          const allergyB = (b.allergy === undefined) ? "" : b.allergy.toUpperCase()
          if (allergyA < allergyB) {
            return -1 * sortDirection;
          }
          if (allergyA > allergyB) {
            return 1 * sortDirection;
          }
          return 0;
        });
        break;
      case "registeredAt":
        sort = filteredAttendees.sort((a, b) => {
          const registeredAtA = (a.registeredAt === undefined) ? "" : a.registeredAt
          const registeredAtB = (b.registeredAt === undefined) ? "" : b.registeredAt
          if (registeredAtA < registeredAtB) {
            return -1 * sortDirection;
          }
          if (registeredAtA > registeredAtB) {
            return 1 * sortDirection;
          }
          return 0;
        });
        break;
      case "verified":
        sort = filteredAttendees.sort((a, b) => {
          const verifiedA = (a.verified === undefined) ? 0 : a.verified
          const verifiedB = (b.verified === undefined) ? 0 : b.verified
          if (verifiedA < verifiedB) {
            return -1 * sortDirection;
          }
          if (verifiedA > verifiedB) {
            return 1 * sortDirection;
          }
          return 0;
        });
        break;
      case "isPaid":
        sort = filteredAttendees.sort((a, b) => {
          const isPaidA = (a.ticketId === undefined || tickets === undefined || tickets.find(({ id }) => id === a.ticketId) === undefined) ? 0 : tickets.find(({ id }) => id === a.ticketId)!.isPaid
          const isPaidB = (b.ticketId === undefined || tickets === undefined || tickets.find(({ id }) => id === b.ticketId) === undefined) ? 0 : tickets.find(({ id }) => id === b.ticketId)!.isPaid
          if (isPaidA < isPaidB) {
            return -1 * sortDirection;
          }
          if (isPaidA > isPaidB) {
            return 1 * sortDirection;
          }
          return 0;
        });
        break;
      case "paymentMethod":
        sort = filteredAttendees.sort((a, b) => {
          const paymenthMethodA = (a.ticketId === undefined || tickets === undefined || tickets.find(({ id }) => id === a.ticketId) === undefined || tickets.find(({ id }) => id === a.ticketId)!.paymentMethod === undefined) ? "" : tickets.find(({ id }) => id === a.ticketId)!.paymentMethod!.toUpperCase()
          const paymenthMethodB = (b.ticketId === undefined || tickets === undefined || tickets.find(({ id }) => id === b.ticketId) === undefined || tickets.find(({ id }) => id === b.ticketId)!.paymentMethod === undefined) ? "" : tickets.find(({ id }) => id === b.ticketId)!.paymentMethod!.toUpperCase()
          if (paymenthMethodA < paymenthMethodB) {
            return -1 * sortDirection;
          }
          if (paymenthMethodA > paymenthMethodB) {
            return 1 * sortDirection;
          }
          return 0;
        });
        break;
      case "staff":
        sort = filteredAttendees.sort((a, b) => {
          const staffA = (a.staff === undefined) ? 0 : a.staff
          const staffB = (b.staff === undefined) ? 0 : b.staff
          if (staffA < staffB) {
            return -1 * sortDirection;
          }
          if (staffA > staffB) {
            return 1 * sortDirection;
          }
          return 0;
        });
        break;
      case "admin":
        sort = filteredAttendees.sort((a, b) => {
          const adminA = (a.admin === undefined) ? 0 : a.admin
          const adminB = (b.admin === undefined) ? 0 : b.admin
          if (adminA < adminB) {
            return -1 * sortDirection;
          }
          if (adminA > adminB) {
            return 1 * sortDirection;
          }
          return 0;
        });
        break;
    }
    return sort;
  }

  useEffect(() => {
    setFilteredAttendees([...filterAttendeeArray()]);
  }, [attendees, filterName, filterEmail, filterFursona, filterNationality, filterDoB, filterContact, filterVerified, filterPaid, filterPaymentMethod, filterStaff, filterAdmin, sortColumn, sortDirection])

  useEffect(() => {
    setSortedAttendees([...sortAttendeeArray()]);
  }, [filteredAttendees])

  return (
    <>
      {
        (isAuthenTicated == true) &&
        <div className={styles.Admin}>
          <div className={styles.Admin__Content}><h2>FILTERS:</h2></div>
          <hr></hr>
          <div className={styles.Admin__Content}>
            <Input
              type="text"
              onChange={(e) => {setFilterName(e)}}
              label="Name (first or last)"
            >
            </Input>

            <Input
              type="text"
              onChange={(e) => {setFilterEmail(e)}}
              label="Email"
            >
            </Input>

            <Input
              type="text"
              onChange={(e) => {setFilterFursona(e)}}
              label="Fursona Name"
            >
            </Input>
          </div>
          <div className={styles.Admin__Content}> 
            <Input
              type="text"
              onChange={(e) => {setFilterNationality(e)}}
              label="Nationality"
            >
            </Input>

            <Input
              type="text"
              onChange={(e) => {setFilterDoB(e)}}
              label="Year of Birth"
            >
            </Input>

            <Input
              type="text"
              onChange={(e) => {setFilterContact(e)}}
              label="Telegram"
            >
            </Input>
          </div>
          <div className={styles.Admin__Content}> 
            <Input
              type="text"
              onChange={(e) => {setFilterPaymentMethod(e)}}
              label="Payment Method"
            >
            </Input>
          </div>
          <hr></hr>
          <div className={styles.Admin__Content}>
            <span>
            <label>
              Show only verified:&nbsp;
              <input
                type="checkbox"
                checked={(filterVerified == true) ? true : false}
                onChange={(e) => {setFilterVerified((e.target.checked) ? true : undefined)}}
              ></input>
            </label>
            <br></br>
            <label>
              Show only unverified:&nbsp;
              <input
                type="checkbox"
                checked={(filterVerified == false) ? true : false}
                onChange={(e) => {setFilterVerified((e.target.checked) ? false : undefined)}}
              ></input>
            </label>
            </span>
            ||
            <span>
            <label>
              Show only paid:&nbsp;
              <input
                type="checkbox"
                checked={(filterPaid == true) ? true : false}
                onChange={(e) => {setFilterPaid((e.target.checked) ? true : undefined)}}
              ></input>
            </label>
            <br></br>
            <label>
              Show only unpaid:&nbsp;
              <input
                type="checkbox"
                checked={(filterPaid == false) ? true : false}
                onChange={(e) => {setFilterPaid((e.target.checked) ? false : undefined)}}
              ></input>
            </label>
            </span>
            ||
            <span>
            <label>
              Show only staff:&nbsp;
              <input
                type="checkbox"
                checked={(filterStaff == true) ? true : false}
                onChange={(e) => {setFilterStaff((e.target.checked) ? true : undefined)}}
              ></input>
            </label>
            <br></br>
            <label>
              Show only non-staff:&nbsp;
              <input
                type="checkbox"
                checked={(filterStaff == false) ? true : false}
                onChange={(e) => {setFilterStaff((e.target.checked) ? false : undefined)}}
              ></input>
            </label>
            </span>
            ||
            <span>
            <label>
              Show only admin:&nbsp;
              <input
                type="checkbox"
                checked={(filterAdmin == true) ? true : false}
                onChange={(e) => {setFilterAdmin((e.target.checked) ? true : undefined)}}
              ></input>
            </label>
            <br></br>
            <label>
              Show only non-admin:&nbsp;
              <input
                type="checkbox"
                checked={(filterAdmin == false) ? true : false}
                onChange={(e) => {setFilterAdmin((e.target.checked) ? false : undefined)}}
              ></input>
            </label>
            </span>
          </div>
          <hr></hr>
          <div className={styles.Admin__Content}><h2>ATTENDEE LIST:</h2></div>
          <div className={styles.Admin__Content}>
            <AttendeeList 
              sortColumn={sortColumn} 
              setSortColumn={setSortColumn} 
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
              attendees={sortedAttendees}></AttendeeList>
          </div>
        </div>
      }
    </>
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