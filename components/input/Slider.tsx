/* eslint-disable react-hooks/exhaustive-deps */
import ReactSlider from "react-slider";
import styles from "@/styles/components/Slider.module.scss"
import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import { Tooltip } from "react-tippy";

type Props = {
    value: number;
    min: number;
    max: number;
    step: number;
    returnValue: Function;
    tooltipText?: string;
    marks?: Array<number>;
};
    
const Slider: NextPage<Props> = (props: Props) => {
    const [currentValue, setCurrentValue] = useState<number>(props.min);
    const [visible, setVisible] = useState(false);
    const sliderRef = useRef<any>()
    const show = () => setVisible(true);
    const hide = () => setVisible(false);

    useEffect(() => {
        if (props.returnValue) props.returnValue(currentValue)
    }, [currentValue])

    return (
        <ReactSlider
        ref={sliderRef}
        className={styles.Slider}
        trackClassName={styles.Slider__Track}
        thumbClassName={styles.Slider__Thumb}
        markClassName={styles.Slider__Mark}
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        marks={props.marks}
        renderTrack={
            (props, state) =>
            <div key={state.index} {...props} onMouseEnter={show} onMouseLeave={hide} />
        }
        renderThumb={
            (thumbProps, state) =>
            <Tooltip
                html={
                <span style={{ fontSize: "1.4rem" }}>
                    {`${props.value} ${props.tooltipText}`}
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
                <div onMouseEnter={show} onMouseLeave={hide} {...thumbProps} />
            </Tooltip>
        }
        renderMark={
            (markProps) => {
                let left = 0;
                if (sliderRef.current && props.max && markProps.key && markProps.style && markProps.style.left) {
                    const end: number = props.max as number
                    const maxSteps = end / props.step

                    left = (1 / maxSteps) * sliderRef.current.slider.clientWidth
                    markProps.style.left = markProps.style.left as number + left
                }
                return (
                    <span {...markProps}></span>
                )
            }   
        }
        onChange={(e) => props.returnValue(e)}
        />
    );
};

export default Slider;