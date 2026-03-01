import { Box, Button, IconButton, InputAdornment, TextField, Typography, useTheme } from '@mui/material'
import CreateIcon from '@mui/icons-material/Create';
import { baseURL } from '../../Api/apolloClient';
import { useRef } from 'react';
import { CustomSelect } from './CustomTextField';
import DownloadIcon from "@mui/icons-material/Download";


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
  handleChange,
  isDisabled = false,
  isMultiline = false,
  isMultiImages=false,
  handleDownloadFile=null

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


  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", mb: 4, alignItems: "center", backgroundColor: theme.palette.primary?.gray, gap: 3, p: 1 }}>

      <Typography variant="subtitle2" sx={{ fontWeight: "bold", width: "40%" , display:"flex", gap:5 }}>
        {title}
      </Typography>

       {
                  handleDownloadFile && (
                    <Button color='primary' variant='contained' onClick={handleDownloadFile}>
                      <IconButton size="small" sx={{ color: "white" }} >
                      <DownloadIcon fontSize="small" color='white' />
                    </IconButton>
                    </Button>
                    
        
                  )
                }

      {
        type == "file" ?
      (
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", flexGrow: "1" }}>
           {
            !handleDownloadFile &&<Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              {Array.isArray(value) ?
                value.map((img, index) => (
                <Box
  key={index}
  component="img"
  src={`${baseURL}${img}`}
  alt={`صورة-${index}`}
  loading="lazy"
  sx={{
    width: 40,
    height: 28,
    objectFit: "cover",
    objectPosition: "center",
    borderRadius: "4px",
    boxShadow: "0px 1px 2px rgba(0,0,0,0.15)",
    border: "1px solid #e0e0e0",
    display: "inline-block",
  }}
/>
                ))
                :
         <Box
  component="img"
  src={`${baseURL}${value}`}
  alt="Flag"
  loading="lazy"
  sx={{
    width: 40,
    height: 28,
    objectFit: "cover",
    objectPosition: "center",
    borderRadius: "4px",
    boxShadow: "0px 1px 2px rgba(0,0,0,0.1)",
    border: "1px solid #eee",
  }}
/>

              }
            </Box>
           }
            


          {!isDisabled && <CreateIcon color="action" sx={{ margin: "15px", cursor: "pointer" }} onClick={handleClick} />}  

            {/* Input مخفي */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }} // المخفي
              onChange={handleChange}
              multiple={isMultiImages}
              disabled={isDisabled}
            />
          </Box>
      )
          

          :
          type == "number" ?
            <TextField
              disabled={isDisabled}
              type={"number"}
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
                endAdornment: !isDisabled && (
                  <InputAdornment position="end">
                    <CreateIcon color="action" sx={{ cursor: "pointer" }} onClick={handleFocus} />
                  </InputAdornment>
                ),
                formNoValidate: true,
                inputMode: "numeric",
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                  e.preventDefault();   // يمنع الزيادة/النقصان
                }
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
                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                  display: "none",
                },
                "& input[type=number]": {
                  MozAppearance: "textfield",
                },
                 "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: `${theme.palette.primary?.disabled} !important`, // لون النص
                    fontWeight: "700"
                  },
              }}
            />
            :
            <TextField
              multiline={isMultiline}
              rows={4}
              disabled={isDisabled}
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
                endAdornment: !isDisabled && (
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
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: `${theme.palette.primary?.disabled} !important`, // لون النص
                    fontWeight: "700"
                  },
                },
              }}
            />


      }

    </Box>
  )
}


export const HorizentalTextFieldSelect = ({ t, backgroundColor, title, defaultOptionLabel, children, value, setValue, error, setError, onChange, isDisabled=false }) => {
  const theme = useTheme();
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", mb: 4, backgroundColor: theme.palette.primary?.gray, gap: 3, p: 1, height: "60px" }}>

      <Typography variant="subtitle2" sx={{ fontWeight: "bold", height: "55px", display: "flex", flexDirection: "column", alignItems: "start", justifyContent: "center", width: "40%" }}>
        {title}
      </Typography>

      <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <CustomSelect t={t} label={defaultOptionLabel} backgroundColor={theme.palette.primary?.gray} value={value} setValue={setValue} error={error} setError={setError} onChange={onChange} isDisabled={isDisabled}  >
          {children}
        </CustomSelect>

      </Box>

    </Box>

  );
}