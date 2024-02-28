/* eslint-disable react-hooks/exhaustive-deps */
import { NextPage } from "next"
import styles from "@/styles/components/input/Input.module.scss"
import { HTMLInputTypeAttribute, useEffect, useState } from "react"

type Props = {
    type?: HTMLInputTypeAttribute
    id?: string
    label?: string
    error?: boolean
    disabled?: boolean
    startAdornment?: React.ReactElement
    endAdornment?: React.ReactElement
    value?: string
    onChange?: (val: string) => void
}
const Input: NextPage<Props> = ({
    id,
    type = "input",
    label,
    disabled,
    startAdornment,
    endAdornment,
    value,
    onChange
}: Props) => {
    const [val, setVal] = useState<string>(value || '')
    const [isFocused, setIsFocused] = useState<boolean>(false)

    useEffect(() => {
        if (onChange) onChange(val)
    }, [val])

    return (
        <div
            className={`
                ${styles.Input__Wrapper}
                ${disabled? styles.Input__Disabled : ''}
            `}
        >
            {
                (startAdornment != undefined) &&
                <div className={`
                    ${styles.Input__Start}
                    ${isFocused? styles.Input__Start__Active : ''}
                `}>
                    {startAdornment}
                </div>
            }
            <div
                className={`
                    ${styles.Input__Wrapper__Input}
                `}
            >
                <input
                    disabled={disabled}
                    type={type}
                    className={styles.Input}
                    placeholder={label}
                    id={id || 'input'}
                    value={val}
                    onChange={(o) => setVal(o.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                {
                    (label != undefined) &&
                    <label
                        className={styles.Input__Label}
                        htmlFor={id || 'input'}
                    >
                        {label}
                    </label>
                }
            </div>
            {
                (endAdornment != undefined) &&
                <div className={`
                    ${styles.Input__End}
                    ${isFocused? styles.Input__End__Active : ''}
                `}>
                    {endAdornment}
                </div>
            }
        </div>
    );
}

export default Input