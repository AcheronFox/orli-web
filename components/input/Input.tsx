import { NextPage } from "next"
import styles from "@/styles/components/input/Input.module.scss"
import { HTMLInputTypeAttribute, useEffect } from "react"

type Props = {
    type?: HTMLInputTypeAttribute
    id?: string
    label?: string
    error?: boolean
    disabled?: boolean
    startAdornment?: React.ReactElement
    endAdornment?: React.ReactElement
    variant?: 'text' | 'outlined'
}
const Input: NextPage<Props> = ({
    id,
    type = "input",
    label,
    disabled,
    startAdornment,
    endAdornment,
    variant = 'text'
}: Props) => {

    return (
        <div
            className={`
                ${styles.Input__Wrapper}
                ${disabled? styles.Input__Disabled : ''}
            `}
        >
            {
                (startAdornment != undefined) &&
                <div className={styles.Input__Start}>
                    {startAdornment}
                </div>
            }
            <div
                className={`
                    ${styles.Input__Wrapper__Input}
                    ${(variant=="outlined")? styles.Input__Outlined : ''}
                `}
            >
                <input
                    disabled={disabled}
                    type={type}
                    className={styles.Input}
                    placeholder={label}
                    id={id || 'input'}
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
                <div className={styles.Input__End}>
                    {endAdornment}
                </div>
            }
        </div>
    );
}

export default Input