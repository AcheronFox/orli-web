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
import TextCard from "./TextCard";

type Props = {
    name: string;
    species?: string;
    nationality?: string;
    picture?: string;
    isSponsor?: boolean;
    isSuperSponsor?: boolean;
    isFursuiter?: boolean;
    description?: string | React.ReactNode;
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
                >
                <div ref={titleRef} className={`${styles.ParticipantCard__Title} ${isTitleOverflow && styles.ParticipantCard__Title_overflow}`}>
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
                            {props.nationality && <ReactCountryFlag countryCode={ props.nationality } svg />}
                        </span>
                    </Tooltip>
                </div>
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
            <span className={styles.ParticipantCard__Description}>{props.description}</span>
        </div>
    );
};

export default ParticipantCard;