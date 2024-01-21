/* eslint-disable react-hooks/exhaustive-deps */
import { NextPage } from "next";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/components/ParticipantCard.module.scss"
import { useTranslate } from "@/hooks/useTranslate";
import FursuiterIcon from "./svg/FursuiterIcon";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import SponsorIcon from "./svg/SponsorIcon";
import ReactCountryFlag from "react-country-flag";
import getNationality from "functions/getNationality";
import { useIsOverflow } from "@/hooks/utils/useIsOverflow";

type Props = {
    name: string;
    species?: string;
    nationality?: string;
    picture?: string;
    isSponsor?: boolean;
    isSuperSponsor?: boolean;
    isFursuiter?: boolean;
    description?: string | React.ReactNode;
    isStaffMode?: boolean;
};

const ParticipantCard: NextPage<Props> = (props: Props) => {
    const { t, locale } = useTranslate();
    const [nationalityName, setNationalityName] = useState<string>("")
    const titleRef = useRef<any>()
    const isTitleOverflow = useIsOverflow(titleRef);

    useEffect(() => {
        refreshNationality()
    }, [])

    useEffect(() => {
        refreshNationality()
    }, [locale])

    const refreshNationality = () => {
        if (!props.nationality) return;
        const val = getNationality(props.nationality, locale)
        if (val) setNationalityName(val.name)
    }

    return (
        <div className={styles.ParticipantCard}>
            <Tippy disabled={!isTitleOverflow} content={<span>{props.name}<br />{props.species}</span>}>
                <div ref={titleRef} className={`${styles.ParticipantCard__Title} ${isTitleOverflow && styles.ParticipantCard__Title_overflow}`}>
                    <h2>
                        {props.name}
                    </h2>
                    <h3>
                        {props.species}
                    </h3>
                </div>
            </Tippy>
            <div className={styles.ParticipantCard__Picture}>
                {
                    (props.isStaffMode == true) &&
                    <picture>
                        <source srcSet={`${props.picture? (`${props.picture}_x1.jpg 1x, ${props.picture}_x2.jpg 2x`) : '/Default_profile_x1.jpg 1x, /Default_profile_x2.jpg 2x,'}`} media="(max-width: 37.5em)" />
                        <img srcSet={`${props.picture? (`${props.picture}_x1.jpg 1x, ${props.picture}_x2.jpg 2x`) : '/Default_profile_x1.jpg 1x, /Default_profile_x2.jpg 2x,'}`} alt="Participant Picture" src="/Default_profile_x2.jpg" loading="lazy"/>
                    </picture>
                }
                {   
                    (!props.isStaffMode) &&
                    <picture>
                        <source srcSet={`${props.picture? (`/uploads/${props.picture.split('.')[0]}_x1.${props.picture.split('.')[1]} 1x, /uploads/${props.picture.split('.')[0]}_x2.${props.picture.split('.')[1]} 2x`) : '/Default_profile_x1.jpg 1x, /Default_profile_x2.jpg 2x,'}`} media="(max-width: 37.5em)" />
                        <img srcSet={`${props.picture? (`/uploads/${props.picture.split('.')[0]}_x1.${props.picture.split('.')[1]} 1x, /uploads/${props.picture.split('.')[0]}_x2.${props.picture.split('.')[1]} 2x`) : '/Default_profile_x1.jpg 1x, /Default_profile_x2.jpg 2x,'}`} alt="Participant Picture" src="/Default_profile_x2.jpg" loading="lazy"/>
                    </picture>
                }
                <div className={styles.ParticipantCard__Flag}>
                    <Tippy className={styles.Tooltip} content={nationalityName}>
                        <span>
                            {props.nationality && <ReactCountryFlag countryCode={ props.nationality } svg />}
                        </span>
                    </Tippy>
                </div>
            </div>
            {
                (props.isFursuiter || props.isSponsor) &&
                <div className={styles.ParticipantCard__Footer}>
                    {
                        props.isFursuiter &&
                        <Tippy className={styles.Tooltip} content={t("partSuiter")}>
                            <span>
                                <FursuiterIcon style={{"fill": "#F741D5"}} />
                            </span>
                        </Tippy>
                    }
                    {
                        props.isSponsor &&
                        <Tippy className={styles.Tooltip} content={(props.isSuperSponsor)? t("ticketSuperSponsor") : t("partSponsor")}>
                            <span>
                                <SponsorIcon style={{"fill": "#F741D5"}} />
                            </span>
                        </Tippy>
                    }
                </div>
            }
            <span className={styles.ParticipantCard__Description}>{props.description}</span>
        </div>
    );
};

export default ParticipantCard;