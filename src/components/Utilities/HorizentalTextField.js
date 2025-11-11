import { Box, InputAdornment, TextField, Typography, useTheme } from '@mui/material'
import CreateIcon from '@mui/icons-material/Create';
import { baseURL } from '../../Api/apolloClient';
import { useRef } from 'react';


export default function HorizentalTextField({
  title,
  fieldID,
  fieldName,
  placeholder,
  value,
  onChange,
  error,
  helperText,
  type = "",
  handleChange

}) {
  const theme = useTheme();
  const fileInputRef = useRef();
  const inputRef = useRef(null);

  const handleClick = () => {
    // تفتح نافذة اختيار الملفات
    fileInputRef.current.click();
  };

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus(); // يعمل focus على الـ input
    }
  };
  //     font-family: Arial;
  // font-weight: 400;
  // font-size: 20px;
  // leading-trim: NONE;
  // line-height: 24px;
  // letter-spacing: 0%;

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", mb: 4, alignItems: "center", backgroundColor: theme.palette.primary?.gray, gap: 3, p: 1 }}>

      <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
        {title}
      </Typography>

      {
        type == "file" ?
          <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", flexGrow: "1" }}>
            <Box
              component="img"
              src={`${baseURL}${value}`}
              alt="وصف الصورة"
              loading="lazy"
              sx={{
                width: 100,          // ثابت أو '100%' للعرض الكامل
                height: "auto",
                objectFit: 'cover',  // contain, cover, fill
                borderRadius: 2,     // زوايا مدورة
                boxShadow: 1,
              }}
            />

            <CreateIcon color="action" sx={{ margin: "15px", cursor: "pointer" }} onClick={handleClick} />

            {/* Input مخفي */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }} // المخفي
              onChange={handleChange}
            />
          </Box>

          :
          <TextField
            id={fieldID}
            name={fieldName}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            inputRef={inputRef} // مهم جدًا
            error={error}
            helperText={helperText}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <CreateIcon color="action" sx={{ cursor: "pointer" }} onClick={handleFocus} />
                </InputAdornment>
              ),
            }}
            sx={{
              backgroundColor: theme.palette.primary?.gray,
              flexGrow: 1,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  border: "none", // بدون border افتراضي
                },
                "&.Mui-focused fieldset": {
                  border: `2px solid ${theme.palette.primary.main}`, // يظهر عند focus
                },
              },
            }}
          />


      }

    </Box>
  )
}
