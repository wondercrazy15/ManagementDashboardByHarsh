import React, { useEffect } from "react";

const Input = ({
  fieldName,
  register,
  errors,
  placeHolder,
  isRequired,
  maximLength,
  minimLength,
  type,
  patternn,
  defaultValue,
}) => {
  return (
    <>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeHolder}
        {...register(fieldName, {
          required: {
            value: isRequired,
            message: `${fieldName} is required`,
          },
          maxLength: {
            value: maximLength,
            message: `Value must be maximum ${maximLength}`,
          },
          minLength: {
            value: minimLength,
            message: `Value must be minimum ${minimLength}`,
          },
          pattern: {
            value: patternn,
            message: "invalid email address",
          },
        })}
      />
    </>
  );
};

export default Input;
