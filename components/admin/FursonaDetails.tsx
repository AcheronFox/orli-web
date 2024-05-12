import { NextPage } from "next"
import React, { useEffect, useMemo, useState } from "react";
import { format, differenceInYears } from 'date-fns'
import styles from "@/styles/components/admin/AttendeeList.module.scss"
import { IFursona } from "@/models/newDbModels/fursona.model"
import Picture from "@/comp/utils/Picture";

type Props = {
    fursona?: IFursona;
};

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

const FursonaDetails: NextPage<Props> = (props: Props) => {
    const currentFursona = props.fursona
    if (currentFursona === undefined){
        return(
            <div>No fursona</div>
        );
    } else { 
        const hasFursuit = formatBooleanYesNo(currentFursona.hasFursuit);

        return (
            <table id="test" className={styles.AttendeeList__Table}>
                <tbody>
                <tr>
                    <th>Picture</th>
                    <td><Picture 
                        defaultSrc={currentFursona.pathToPictureFile? (
                                process.env.NODE_ENV == "development"
                                ?
                                `uploads/${currentFursona.pathToPictureFile}`
                                :
                                `${process.env.DOMAIN_ROOT}uploads/${currentFursona.pathToPictureFile}`
                            )
                            : "Default_profile.jpg"
                        }
                        sizes="(max-width: 9999px) 300px"
                        alt="User Image"
                        >
                        </Picture></td>
                </tr>
                <tr>
                    <th>Fursona ID</th>
                    <td>{currentFursona.id}</td>
                </tr>
                <tr>
                    <th>Name</th>
                    <td>{currentFursona.name}</td>
                </tr>
                <tr>
                    <th>Species</th>
                    <td>{currentFursona.species}</td>
                </tr>
                <tr>
                    <th>Has Fursuit?</th>
                    <td>{hasFursuit}</td>
                </tr>
                </tbody>
            </table>
        );
    }
};
  
  export default FursonaDetails;