/* eslint-disable react-hooks/exhaustive-deps */
import { NextPage } from "next";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/components/ParticipantCard.module.scss"
import FursuiterIcon from "./svg/FursuiterIcon";
import SponsorIcon from "./svg/SponsorIcon";
import ReactCountryFlag from "react-country-flag";
import { useIsOverflow } from "@/hooks/utils/useIsOverflow";
import useTranslate from "@/hooks/translate/useTranslate";
import { INationality } from "@/models/newDbModels/nationality.model";
import { Tooltip } from "react-tippy";
import Picture from "./utils/Picture";
import variables from "@/styles/abstracts/exports.module.scss"

type Props = {
    name: string;
    species?: string;
    nationality?: number;
    picture?: string;
    isSponsor?: boolean;
    isSuperSponsor?: boolean;
    isFursuiter?: boolean;
    nationalities: INationality[]
};

const ParticipantCard: NextPage<Props> = (props: Props) => {
    const { lang, currLang } = useTranslate();
    const [nationalityName, setNationalityName] = useState<string>("")
    const titleRef = useRef<any>()
    const isTitleOverflow = useIsOverflow(titleRef);

    useEffect(() => {
        refreshNationality()
    }, [])

    useEffect(() => {
        refreshNationality()
    }, [currLang])

    const refreshNationality = () => {
        if (!props.nationality) return;
        const val = props.nationalities.find((o) => o.id === props.nationality)
        if (val) setNationalityName(currLang=="hu"? val.countryNameHungarian : val.countryNameEnglish)
    }

    return (
        <div className={styles.ParticipantCard}>
            <Tooltip
                html={
                    <span>{props.name}<br />{props.species}</span>
                }
                arrow
                arrowSize="big"
                size="big"
                inertia
                style={{
                    fontSize: '1.6rem'
                }}
                disabled={!isTitleOverflow}
                className={styles.ParticipantCard__Title}
            >
                <div ref={titleRef} className={`${isTitleOverflow && styles.ParticipantCard__Title_overflow}`}>
                    <h2>
                        {props.name}
                    </h2>
                    <h3>
                        {props.species}
                    </h3>
                </div>
            </Tooltip>
            <div className={styles.ParticipantCard__Picture}>   
                <Picture
                    alt={"User Profile Picture"}
                    defaultSrc={`${props.picture? `uploads/${props.picture}` : "Default_profile.jpg"}`}
                    sizes={"20vw"}
                />
                {
                    (props.nationalities.length) && 
                    <div className={styles.ParticipantCard__Flag}>
                        <Tooltip
                            html={
                                <span>{nationalityName}</span>
                            }
                            arrow
                            arrowSize="big"
                            size="big"
                            inertia
                            style={{
                                fontSize: '1.6rem'
                            }}
                            >
                            <span>
                                {props.nationality && <ReactCountryFlag countryCode={ props.nationalities.find((o) => o.id === props.nationality)!.iso2 } svg />}
                            </span>
                        </Tooltip>
                    </div>
                }
            </div>
            {
                (props.isFursuiter || props.isSponsor) &&
                <div className={styles.ParticipantCard__Footer}>
                    {
                        props.isFursuiter &&
                        <Tooltip
                            html={
                                <span>{lang.partSuiter}</span>
                            }
                            arrow
                            arrowSize="big"
                            size="big"
                            inertia
                            style={{
                                fontSize: '1.6rem'
                            }}
                        >
                            <span>
                                <FursuiterIcon style={{fill: variables.primaryColor}} />
                            </span>
                        </Tooltip>
                    }
                    {
                        props.isSponsor &&
                        <Tooltip
                            html={
                                <span>{(props.isSuperSponsor)? lang.ticketSuperSponsor : lang.partSponsor}</span>
                            }
                            arrow
                            arrowSize="big"
                            size="big"
                            inertia
                            style={{
                                fontSize: '1.6rem'
                            }}
                        >
                            <span>
                                <SponsorIcon style={{fill: variables.primaryColor}} />
                            </span>
                        </Tooltip>
                    }
                </div>
            }
        </div>
    );
};

export default ParticipantCard;