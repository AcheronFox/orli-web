/* eslint-disable react-hooks/exhaustive-deps */
import { NextPage } from "next";
import React, { MouseEventHandler, useEffect, useRef } from "react";
import styles from "@/styles/components/RoomCard.module.scss"
import { useTranslate } from "@/hooks/useTranslate";
import PrimaryButton from "./PrimaryButton";
import { IOccupant } from "@/models/occupant.model";
import AdminIcon from "./svg/AdminIcon";
import Tippy from "@tippyjs/react";
import { useIsOverflow } from "@/hooks/useIsOverflow";
import { IRoom } from "@/models/room.model";
import { useUser } from "@/hooks/useUser";

type Props = {
    room: IRoom;
    maxSize: number;
    currentAmount: number;
    occupants: IOccupant[];
    customClass?: string;
    clickRow?: Function;
    clickButton?: Function;
};

type RowProps= {
    occupant: IOccupant
    props: Props
}

const Row = ({occupant, props}: RowProps) => {
    const { t } = useTranslate();
    const titleRef = useRef<any>()
    const isTitleOverflow = useIsOverflow(titleRef);

    const clickHandler = () => {
        if (props.clickRow) props.clickRow(occupant)
    }

    return (
        <div className={occupant.fursonaName && styles.RoomCard__Row} onClick={occupant.fursonaName? () => clickHandler() : undefined}>
            <span className={styles.RoomCard__Image}>
                <picture>
                    <source srcSet={`${occupant.picture? (`/uploads/${occupant.picture.split('.')[0]}_thumb.jpg 1x`) : '/Default_profile_thumb.jpg 1x,'}`} media="(max-width: 37.5em)" />
                    <img srcSet={`${occupant.picture? (`/uploads/${occupant.picture.split('.')[0]}_thumb.jpg 1x`) : '/Default_profile_thumb.jpg 1x,'}`} alt="User Image" src="/Default_profile_thumb.jpg" loading="lazy"/>
                </picture>
            </span>
            <Tippy disabled={!isTitleOverflow} content={occupant.fursonaName}>
                <span className={`${styles.RoomCard__Name}`}>
                    <span ref={titleRef} className={`${styles.RoomCard__Name__Text}`}>{occupant.fursonaName}</span>
                    {(occupant.isRoomAdmin) &&
                        <Tippy className={styles.Tooltip} content={t("roomAdmin")}>
                            <span className={styles.RoomCard__Name__Icon}>
                                <AdminIcon style={{"fill": styles.primaryColor}} />
                            </span> 
                        </Tippy>
                    }
                </span>
            </Tippy>
        </div>
    );
}

const RoomCard: NextPage<Props> = (props: Props) => {
    const { t } = useTranslate();
    const { user } = useUser();

    const clickHandler = () => {
        if (props.clickButton) props.clickButton(props.room)
    }

    return (
        <div className={`${styles.RoomCard} ${props.customClass}`}>
            <div className={`${styles.RoomCard__Title} ${!props.room.customName && styles.RoomCard__Title_small}`}>
                <h3>
                    {props.room.customName? (props.room.customName) : (t("roomRoom"))}
                </h3>
            </div>
            <div className={`${styles.RoomCard__Title} ${props.room.customName && styles.RoomCard__Title_small}`}>
                <h3>
                    {props.room.roomNumber}
                </h3>
            </div>
            <div className={styles.RoomCard__Occupants}>
                {props.occupants.map((occupant, i) => {
                    return(
                        <Row key={i} occupant={occupant} props={props} />
                    );
                })}
            </div>
            <div className={styles.RoomCard__Footer}>
                <PrimaryButton disabled={(props.currentAmount >= props.maxSize) || (props.occupants.find((o) => o.AccountKey == user?.AccountKey)? true : false)}
                text={`${t("roomJoin")} (${props.currentAmount} / ${props.maxSize})`}
                onClick={() => clickHandler()} />
            </div>
        </div>
    );
};

export default RoomCard;