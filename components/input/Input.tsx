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
    autoFocus?: boolean
}
const Input: NextPage<Props> = ({
    id,
    type = "input",
    label,
    disabled,
    startAdornment,
    endAdornment,
    value,
    onChange,
    autoFocus
}: Props) => {
    const [isActive, setIsActive] = useState<boolean>(false)

    return (
        <div
            className={`
                ${styles.Input__Wrapper}
                ${disabled? styles.Input__Disabled : ''}
            `}
        >
            
            <div className={styles.Input}>
                <input
                    disabled={disabled}
                    type={type}
                    placeholder={label}
                    id={id || 'input'}
                    value={value}
                    autoFocus={autoFocus}
                    onChange={(o) => {
                        if (onChange) onChange(o.target.value)
                    }}
                    onFocus={() => setIsActive(true)}
                    onBlur={() => setIsActive(false)}
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
                (startAdornment != undefined) &&
                <div className={`
                    ${styles.Input__Start}
                    ${isActive? styles.Input__Start__Active : ''}
                `}>
                    {startAdornment}
                </div>
            }
            {
            (endAdornment != undefined) &&
            <div className={`
                ${styles.Input__End}
                ${isActive? styles.Input__End__Active : ''}
            `}>
                {endAdornment}
            </div>
        }
        </div>
    );
}

export default Input