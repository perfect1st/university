import { TextField, Typography } from '@mui/material'
import React from 'react'

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
              sx={{ mb: 3 }}
            />
    </>
  )
}
