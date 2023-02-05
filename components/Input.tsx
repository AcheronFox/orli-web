import { NextPage } from "next";
import React from "react";
import style from "@/styles/components/Input.module.scss";

type Props = {
  type?:
    | "text"
    | "password"
    | "checkbox"
    | "file"
    | "email"
    | "date"
    | "textarea";
  id?: string;
  className?: string;
  name?: string;
  label?: string | React.ReactNode;
  inputClass?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  value?: string | number | readonly string[] | undefined;
  labelStyle?: string;
  inputStyle?: string;
  list?: string;
  autoComplete?: string;
  onClick?: React.MouseEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  placeholder?: string;
  inputLabelClass?: string;
  disabled?: boolean;
  maxlength?: number;
  checked?: (checkedVal: boolean) => void;
};

const Input = React.forwardRef(
  (
    {
      type = "text",
      name,
      className,
      id,
      label,
      inputClass,
      onChange,
      value,
      list,
      autoComplete,
      onClick,
      onFocus,
      onBlur,
      placeholder,
      inputLabelClass,
      disabled,
      maxlength,
      checked
    }: Props,
    ref: React.Ref<HTMLInputElement>
  ) => {
    switch (type) {
      default:
      case "date":
      case "email":
      case "password":
      case "text":
        return (
          <div className={`${style.Input} ${className? className : ''}`}>
            <label className={style.Input__Label} htmlFor={id}>
              {label}
            </label>
            <input
              className={`${style.Input__Text} ${inputClass? inputClass : ''}`}
              type={type}
              name={name}
              id={id}
              onChange={onChange}
              value={value}
              autoComplete={autoComplete}
              list={list}
              onClick={onClick}
              ref={ref}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder={placeholder}
              disabled={disabled}
              
            ></input>
          </div>
        );
      case "checkbox":
        return (
          <div className={`${style.Input} ${style.Input__Checkbox} ${className? className : ''}`}>
            <input
              type="checkbox"
              name={name}
              id={id}
              onChange={(e) => {checked!(e.target.checked)}}
              value={value}
              autoComplete={autoComplete}
              list={list}
              onClick={onClick}
              ref={ref}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder={placeholder}
              disabled={disabled}
            ></input>
            <label htmlFor={id} className={`${style.Input__Checkbox__Check}`}>
              <svg viewBox="0 0 18 18">
                <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                <polyline points="1 9 7 14 15 4"></polyline>
              </svg>
            </label>
            <label
              className={`${style.Input__Checkbox__Label} ${inputLabelClass? inputLabelClass : ''}`}
              htmlFor={id}
            >
              {label}
            </label>
          </div>
        );
      case "textarea":
        return (
          <div className={`${style.Input} ${style.Input__Textarea} ${className? className : ''}`}>
            <label
              className={`${style.Input__Label__Area} ${inputLabelClass? inputLabelClass : ''}`}
              htmlFor={id}
            >
              {label}
            </label>
            <textarea
              className={`${style.Input__Text__Area} ${inputClass? inputClass : ''}`}
              name={name}
              id={id}
              rows={10}
              onChange={onChange}
              value={value}
              autoComplete={autoComplete}
              onClick={onClick}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder={placeholder}
              disabled={disabled}
              maxLength={maxlength}
            ></textarea>
          </div>
        );
    }
  }
);

Input.displayName = "Input";

export default Input;
