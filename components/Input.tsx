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
    | "textarea"
    | "number";
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
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  placeholder?: string;
  inputLabelClass?: string;
  disabled?: boolean;
  maxlength?: number;
  checked?: (checkedVal: boolean) => void;
  checkBoxValue?: boolean;
  min?: number;
  max?: number;
  onInput?: React.FormEventHandler<HTMLInputElement>;
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
      checked,
      onKeyDown,
      checkBoxValue,
      min,
      max,
      onInput,
    }: Props,
    ref: React.Ref<HTMLInputElement>
  ) => {

    const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = parseInt(e.target.value) || 0;
      e.target.value = value.toString()
      if (onChange) onChange(e)
    }

    const handleNumericBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
      if (min && max) {
        const value = Math.max(min, Math.min(max, Number(e.target.value)));
        e.target.value = value.toString()
        if (onBlur) onBlur(e);
      }
      else {
        if (onBlur) onBlur(e);
      }
    };

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
              onKeyDown={onKeyDown}
              maxLength={maxlength}
            ></input>
          </div>
        );
      case "checkbox":
        
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
      case "number":
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
              onChange={handleNumericChange}
              value={value}
              autoComplete={autoComplete}
              list={list}
              onClick={onClick}
              ref={ref}
              onFocus={onFocus}
              onBlur={handleNumericBlur}
              placeholder={placeholder}
              disabled={disabled}
              onKeyDown={onKeyDown}
              min={min}
              max={max}
              maxLength={maxlength}
              onInput={onInput}
            ></input>
          </div>
        );
    }
  }
);

Input.displayName = "Input";

export default Input;
