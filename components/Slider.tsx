/* eslint-disable react-hooks/exhaustive-deps */
import ReactSlider from "react-slider";
import styles from "@/styles/components/Slider.module.scss"
import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import Tippy from "@tippyjs/react";

type Props = {
    value: number;
    min: number;
    max: number;
    step: number;
    returnValue: Function;
    tooltipText?: string;
};
    
const Slider: NextPage<Props> = (props: Props) => {
    const [currentValue, setCurrentValue] = useState<number>(props.min);
    const [visible, setVisible] = useState(false);
    const show = () => setVisible(true);
    const hide = () => setVisible(false);

    useEffect(() => {
        if (props.returnValue) props.returnValue(currentValue)
    }, [currentValue])

    return (
        <ReactSlider
        className={styles.Slider}
        trackClassName={styles.Slider__Track}
        thumbClassName={styles.Slider__Thumb}
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        renderTrack={
            (props, state) =>
            <div key={state.index} {...props} onMouseEnter={show} onMouseLeave={hide} />
        }
        renderThumb={
            (thumbProps, state) =>
            <Tippy key={state.index} visible={visible} content={`${props.value} ${props.tooltipText}`}>
                <div onMouseEnter={show} onMouseLeave={hide} {...thumbProps} />
            </Tippy>
        }
        onChange={(e) => props.returnValue(e)}
        />
    );
};

export default Slider;