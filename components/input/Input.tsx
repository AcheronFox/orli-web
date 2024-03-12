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
    value?: string | number | readonly string[]
    onChange?: (val: string) => void
    onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => void
    onClick?: (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => void
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
    autoFocus?: boolean
    list?: string
    autoComplete?: string
    maxLength?: number
    name?: string
    customClass?: string
    ref?: any
}
const Input: NextPage<Props> = ({
    id,
    type = "input",
    label,
    error,
    disabled,
    startAdornment,
    endAdornment,
    value,
    onChange,
    onBlur,
    onClick,
    autoFocus,
    list,
    autoComplete,
    maxLength,
    name,
    customClass,
    ref,
    onKeyDown,
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
                    ref={ref}
                    disabled={disabled}
                    type={type}
                    placeholder={label}
                    id={id || 'input'}
                    value={value}
                    autoFocus={autoFocus}
                    list={list}
                    name={name}
                    autoComplete={autoComplete}
                    maxLength={maxLength}
                    onChange={(o) => {
                        if (onChange) onChange(o.target.value)
                    }}
                    onBlurCapture={(e) => {
                        if (onBlur) onBlur(e)
                    }}
                    onClick={(e) => {
                        if (onClick) onClick(e)
                    }}
                    onKeyDown={(e) => {
                        if (onKeyDown) onKeyDown(e)
                    }}
                    onFocus={() => setIsActive(true)}
                    onBlur={() => setIsActive(false)}
                    className={`
                        ${customClass? customClass : ''}
                        ${error? styles.Input__Error : ''}
                    `}
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
                    ${error? styles.Input__Error : ''}
                `}>
                    {startAdornment}
                </div>
            }
            {
            (endAdornment != undefined) &&
            <div className={`
                ${styles.Input__End}
                ${isActive? styles.Input__End__Active : ''}
                ${error? styles.Input__Error : ''}
            `}>
                {endAdornment}
            </div>
        }
        </div>
    );
}

export default Input