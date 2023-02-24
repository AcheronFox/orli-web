/* eslint-disable react-hooks/exhaustive-deps */
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import styles from "@/styles/components/ParticipantCard.module.scss"
import { useTranslate } from "@/hooks/useTranslate";
import FursuiterIcon from "./svg/FursuiterIcon";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import SponsorIcon from "./svg/SponsorIcon";
import ReactCountryFlag from "react-country-flag";
import getNationality from "functions/getNationality";

type Props = {
    name: string;
    species?: string;
    nationality?: string;
    picture?: string;
    isSponsor?: boolean;
    isFursuiter?: boolean;
    description?: string;
};

const ParticipantCard: NextPage<Props> = (props: Props) => {
    const { t, locale } = useTranslate();
    const [nationalityName, setNationalityName] = useState<string>("")

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
            <div className={styles.ParticipantCard__Title}>
                <h2>
                    {props.name}
                </h2>
                <h3>
                    {props.species}
                </h3>
            </div>
            <div className={styles.ParticipantCard__Picture}>
                <picture>
                    <source srcSet={`${props.picture? (`uploads/${props.picture.split('.')[0]}_x1.jpg 1x, uploads/${props.picture.split('.')[0]}_x2.jpg 2x`) : 'Default_profile_x1.jpg 1x, Default_profile_x2.jpg 2x,'}`} media="(max-width: 37.5em)" />
                    <img srcSet={`${props.picture? (`uploads/${props.picture.split('.')[0]}_x1.jpg 1x, uploads/${props.picture.split('.')[0]}_x2.jpg 2x`) : 'Default_profile_x1.jpg 1x, Default_profile_x2.jpg 2x,'}`} alt="Participant Picture" src="Default_profile_x2.jpg" loading="lazy"/>
                </picture>
                <div className={styles.ParticipantCard__Flag}>
                    <Tippy className={styles.Tooltip} content={nationalityName}>
                        <span>
                            {props.nationality && <ReactCountryFlag countryCode={ props.nationality } svg />}
                        </span>
                    </Tippy>
                </div>
            </div>
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
                    <Tippy className={styles.Tooltip} content={t("partSponsor")}>
                        <span>
                            <SponsorIcon style={{"fill": "#F741D5"}} />
                        </span>
                    </Tippy>
                }
                {props.description}
            </div>
        </div>
    );
};

export default ParticipantCard;