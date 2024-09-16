"use client";

import React, { ChangeEvent, forwardRef, KeyboardEvent } from "react";
import "@/app/globals.css";

//          interface: Input Box 컴포넌트 properties          //
interface Props {
  label: string;
  type: "text" | "password";
  placeholder: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void; // React.Dispatch<React.SetStateAction<string>>// 상태를 바꾸는 value
  error: boolean;

  icon?: "eye-light-off-icon" | "eye-light-on-icon" | "expand-right-light-icon";
  onButtonClick?: () => void;

  message?: string;

  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

//          component: Input Box 컴포넌트          //
const InputBox = forwardRef<HTMLInputElement, Props>((props: Props, ref) => {
  //          state: properties          //
  const {
    label,
    type,
    placeholder,
    value,
    error,
    icon,
    onButtonClick,
    message,
    onKeyDown,
  } = props;
  const { onChange } = props;

  //          event handler: input 키 이벤트 처리 함수          //
  const onKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!onKeyDown) return;
    onKeyDown(event);
  };

  //          render: Input Box 컴포넌트          //
  return (
    <div className="flex flex-col gap-1">
      <div className="text-gray-700 text-sm font-normal leading-5">{label}</div>
      <div
        className={`flex items-center ${
          error
            ? "border-b border-red-500 bg-gray-50"
            : "border-b border-gray-300"
        } px-4 py-[11px]`}
      >
        <input
          ref={ref}
          className="flex-1 border-none bg-transparent outline-none text-gray-700 text-sm font-normal leading-5"
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDownHandler}
        />
        {onButtonClick !== undefined && (
          <div className="cursor-pointer" onClick={onButtonClick}>
            {icon !== undefined && <div className={`icon ${icon}`}></div>}
          </div>
        )}
      </div>
      {message !== undefined && error && (
        <div className="text-red-500 text-xs font-normal leading-5">
          {message}
        </div>
      )}
    </div>
  );
});

export default InputBox;
