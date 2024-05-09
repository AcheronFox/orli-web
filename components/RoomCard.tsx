/* eslint-disable react-hooks/exhaustive-deps */
import { NextPage } from "next";
import React, { MouseEventHandler, useEffect, useRef } from "react";
import styles from "@/styles/components/RoomCard.module.scss"
import { IOccupant } from "@/models/occupant.model";
import AdminIcon from "./svg/AdminIcon";
import { useIsOverflow } from "@/hooks/utils/useIsOverflow";
import { IRoom } from "@/models/room.model";
import useTranslate from "@/hooks/translate/useTranslate";
import { Tooltip } from "react-tippy";
import { useUser } from "@/hooks/user/useUser";
import Button from "./button/Button";

type Props = {
    room: IRoom;
    maxSize: number;
    currentAmount: number;
    occupants: IOccupant[];
    customClass?: string;
    clickRow?: Function;
    clickButton?: Function;
    clickLeave?: Function;
};

type RowProps= {
    occupant: IOccupant
    props: Props
}

const Row = ({occupant, props}: RowProps) => {
    const { lang } = useTranslate();
    const titleRef = useRef<any>()
    const isTitleOverflow = useIsOverflow(titleRef);

    const clickHandler = () => {
        if (props.clickRow) props.clickRow(occupant)
    }

    return (
        <div className={occupant.fursonaName && styles.RoomCard__Row} onClick={occupant.fursonaName? () => clickHandler() : undefined}>
            <span className={styles.RoomCard__Image}>
                <picture>
                    <source srcSet={`${occupant.picture? (`/uploads/${occupant.picture.split('.')[0]}_thumb.${occupant.picture.split('.')[1]} 1x`) : '/Default_profile_thumb.jpg 1x,'}`} media="(max-width: 37.5em)" />
                    <img srcSet={`${occupant.picture? (`/uploads/${occupant.picture.split('.')[0]}_thumb.${occupant.picture.split('.')[1]} 1x`) : '/Default_profile_thumb.jpg 1x,'}`} alt="User Image" src="/Default_profile_thumb.jpg" loading="lazy"/>
                </picture>
            </span>
            <Tooltip
                html={
                    <span style={{ fontSize: "1.4rem" }}>
                        {occupant.fursonaName}
                    </span>
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
                <span className={`${styles.RoomCard__Name}`}>
                    <span ref={titleRef} className={`${styles.RoomCard__Name__Text}`}>{occupant.fursonaName}</span>
                    {(occupant.isRoomAdmin) &&
                        <Tooltip
                            html={
                                <span style={{ fontSize: "1.4rem" }}>
                                    {lang.roomAdmin}
                                </span>
                            }
                            arrow
                            arrowSize="big"
                            size="big"
                            inertia
                            style={{
                                fontSize: '1.6rem'
                            }}
                        >
                            <span className={`${styles.RoomCard__Name}`}>
                                <span className={styles.RoomCard__Name__Icon}>
                                    <AdminIcon style={{"fill": styles.primaryColor}} />
                                </span> 
                            </span>
                        </Tooltip>
                    }
                </span>
            </Tooltip>
        </div>
    );
}

const RoomCard: NextPage<Props> = (props: Props) => {
    const { lang } = useTranslate();
    const { user } = useUser();

    const clickHandler = () => {
        if (props.clickButton) props.clickButton(props.room)
    }
    const leaveHandler = () => {
        if (props.clickLeave) props.clickLeave(props.room)
    }

    return (
        <div className={`${styles.RoomCard} ${props.customClass}`}>
            <div className={`${styles.RoomCard__Title} ${!props.room.customName && styles.RoomCard__Title_small}`}>
                <h3>
                    {props.room.customName? (props.room.customName) : (lang.roomRoom)}
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
                {
                    (!props.occupants.find((o) => o.AccountKey == user?.attendee.accountKey)) &&
                    <Button
                        variant="contained"
                        onClick={() => clickHandler()}
                    >
                        {`${lang.roomJoin} (${props.currentAmount} / ${props.maxSize})`}
                    </Button>
                }
                {
                    (props.occupants.find((o) => o.AccountKey == user?.attendee.accountKey)) &&
                    <Button
                        variant="contained"
                        onClick={() => leaveHandler()}
                    >
                        {`${lang.roomLeave} (${props.currentAmount} / ${props.maxSize})`}
                    </Button>
                }
            </div>
        </div>
    );
};

export default RoomCard;