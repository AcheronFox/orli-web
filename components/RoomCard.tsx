import { NextPage } from "next";
import React from "react";
import styles from "@/styles/components/RoomCard.module.scss"
import { useTranslate } from "@/hooks/useTranslate";
import PrimaryButton from "./PrimaryButton";
import { IOccupant } from "@/models/occupant.model";
import AdminIcon from "./svg/AdminIcon";
import Tippy from "@tippyjs/react";

type Props = {
    dbID: number;
    roomNumber: string;
    customName?: string | React.ReactNode;
    maxSize: number;
    currentAmount: number;
    occupants: IOccupant[];
    customClass?: string;
};

const RoomCard: NextPage<Props> = (props: Props) => {
    const { t } = useTranslate();

    return (
        <div className={`${styles.RoomCard} ${props.customClass}`}>
            <div className={`${styles.RoomCard__Title} ${!props.customName && styles.RoomCard__Title_small}`}>
                <h3>
                    {props.customName? (props.customName) : (t("roomRoom"))}
                </h3>
            </div>
            <div className={`${styles.RoomCard__Title} ${props.customName && styles.RoomCard__Title_small}`}>
                <h3>
                    {props.roomNumber}
                </h3>
            </div>
            <div className={styles.RoomCard__Occupants}>
                {props.occupants.map((occupant, i) => {
                    return (
                        <div key={i} className={occupant.fursonaName && styles.RoomCard__Row}>
                            <span className={styles.RoomCard__Image}>
                                <picture>
                                    <source srcSet={`${occupant.picture? (`/uploads/${occupant.picture.split('.')[0]}_thumb.jpg 1x`) : '/Default_profile_thumb.jpg 1x,'}`} media="(max-width: 37.5em)" />
                                    <img srcSet={`${occupant.picture? (`/uploads/${occupant.picture.split('.')[0]}_thumb.jpg 1x`) : '/Default_profile_thumb.jpg 1x,'}`} alt="User Image" src="/Default_profile_thumb.jpg" loading="lazy"/>
                                </picture>
                            </span>
                            <span className={styles.RoomCard__Name}>
                                {occupant.fursonaName}
                                {(i==0 && occupant.isRoomAdmin) &&
                                    <Tippy className={styles.Tooltip} content={t("roomAdmin")}>
                                        <span className={styles.RoomCard__Name__Icon}>
                                            <AdminIcon style={{"fill": styles.primaryColor}} />
                                        </span> 
                                    </Tippy>
                                }
                            </span>
                        </div>
                    );
                })}
            </div>
            <div className={styles.RoomCard__Footer}>
                <PrimaryButton disabled={props.currentAmount >= props.maxSize}
                text={`${t("roomJoin")} (${props.currentAmount} / ${props.maxSize})`} />
            </div>
        </div>
    );
};

export default RoomCard;