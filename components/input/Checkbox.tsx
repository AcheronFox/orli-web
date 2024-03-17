import { NextPage } from "next"
import styles from '@/styles/components/input/Checkbox.module.scss'

type Props = {
    id?: string;
    className?: string;
    name?: string;
    label?: string | React.ReactNode;
    value?: string | number | readonly string[] | undefined;
    list?: string;
    autoComplete?: string;
    onClick?: React.MouseEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onFocus?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    placeholder?: string;
    inputLabelClass?: string;
    disabled?: boolean;
    checked?: (checkedVal: boolean) => void;
    checkBoxValue?: boolean;
}

const Checkbox: NextPage<Props> = ({
    name,
    className,
    id,
    label,
    value,
    list,
    autoComplete,
    onClick,
    onFocus,
    onBlur,
    placeholder,
    inputLabelClass,
    disabled,
    checked,
    checkBoxValue,
}: Props) => {
    return (
        <div className={`${styles.Checkbox} ${className? className : ''}`}>
          <input
            type="checkbox"
            name={name}
            id={id}
            onChange={(e) => {checked!(e.target.checked)}}
            value={value}
            checked={checkBoxValue}
            autoComplete={autoComplete}
            list={list}
            onClick={onClick}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
          ></input>
          <label htmlFor={id} className={`${styles.Checkbox__Check}`}>
            <svg viewBox="0 0 18 18">
              <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
              <polyline points="1 9 7 14 15 4"></polyline>
            </svg>
          </label>
          <label
            className={`${styles.Checkbox__Label} ${inputLabelClass? inputLabelClass : ''}`}
            htmlFor={id}
          >
            {label}
          </label>
        </div>
    );
}

export default Checkbox