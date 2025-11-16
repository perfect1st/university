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
  type = "",
}) {

  const theme = useTheme();
  return (
    <>
      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
        {title}
      </Typography>
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
        sx={{ mb: 3, backgroundColor: theme.palette.background.inputBackGround , height:"56px" }}
      />
    </>
  )
}


export const VerticalTextFieldSelect = ({ t, backgroundColor, title , defaultOptionLabel,children, value , setValue , error , setError , onChange }) => {
  const theme = useTheme();
  return (
    <>
      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
        {title}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <CustomSelect t={t} label={defaultOptionLabel} height={"56px"} backgroundColor={backgroundColor} value={value} setValue={setValue} error={error} setError={setError} onChange={onChange}  >
          {children}
        </CustomSelect>

      </Box>

    </>

  );
}