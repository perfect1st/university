import { Box, MenuItem, TextField, Typography, useTheme } from '@mui/material'
import React from 'react'
import { CustomSelect } from './CustomTextField';

export default function VerticalTextField({
  title,
  fieldID,
  fieldName,
  placeholder,
  value,
  onChange,
  error,
  helperText,
  type = "text",
}) {

  const theme = useTheme();

  console.log("fieldID",fieldID);
  return (
    <>
      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
        {title}
      </Typography>
      {
        type == "text" ?
          <TextField
            fullWidth
            id={fieldID}
            name={fieldName}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            error={error}
            helperText={helperText}
            variant="outlined"
            sx={{ mb: 3, backgroundColor: theme.palette.background.inputBackGround, height: "56px" }}
          />
          :
          <TextField
            type={"number"}
            fullWidth
            id={fieldID}
            name={fieldName}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            error={error}
            helperText={helperText}
            variant="outlined"
            inputProps={{
                formNoValidate: true,  
              inputMode: "numeric",
              // pattern: "[0-9]*",
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();   // يمنع الزيادة/النقصان
              }
            }}
            sx={{
              mb: 3, backgroundColor: theme.palette.background.inputBackGround,
              "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                display: "none",
              },
              "& input[type=number]": {
                MozAppearance: "textfield",
              },
            }}
          />
      }

    </>
  )
}


export const VerticalTextFieldSelect = ({ t, backgroundColor, title, defaultOptionLabel, children, value, setValue, error, setError, onChange , fieldID, fieldName , onBlur , onKeyDown }) => {
  const theme = useTheme();
  return (
    <>
      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
        {title}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <CustomSelect t={t} label={defaultOptionLabel} height={"56px"} backgroundColor={backgroundColor} value={value} setValue={setValue} error={error} setError={setError} onChange={onChange} fieldID={fieldID} fieldName={fieldName} onBlur={onBlur} onKeyDown={onKeyDown}  >
          {children}
        </CustomSelect>

      </Box>

    </>

  );
}