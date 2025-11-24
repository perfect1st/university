import { Autocomplete, Box, MenuItem, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import React from 'react'
import { CustomSelect } from './CustomTextField';
import { isNullableType } from 'graphql';

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
  isDisabled = false

}) {

  const theme = useTheme();

  console.log("fieldID", fieldID);
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
            disabled={isDisabled}
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
            disabled={isDisabled}
          />
      }

    </>
  )
}


export const VerticalTextFieldSelect = ({ t, backgroundColor, title, defaultOptionLabel, children, value, setValue, error, setError, onChange, fieldID, fieldName, onBlur, onKeyDown }) => {
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

export const SearchByTypingSelect = ({ options, value, setValue, title, label, error, onBlur, multiple = false , labelToShow,findKey, onChangeFn }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  console.log("auto error", error);
  return (
    <Box sx={{ width: "100%", maxWidth: isMobile ? 400 : "100%" }}>
      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
        {title}
      </Typography>

      <Autocomplete
        multiple={multiple}
        options={options}
        getOptionLabel={(option) => labelToShow(option)}
       value={multiple ? options?.filter(opt => value.includes(opt[findKey])) : options?.find(opt => opt[findKey] === value) || null}
        clearOnEscape={false}
        disableClearable={false}

        onChange={(e, newValue, reason) => {
          if (reason === "clear") {

            // لو المستخدم ضغط على clear icon
            multiple ? setValue([]) : setValue(null);

            if(onChangeFn) onChangeFn([]);
            return;
          }

          if (reason === "selectOption" || reason === "removeOption") {
            if (!newValue) return; // safety
            // المستخدم اختار اختيار فعلي
            if (multiple) {
              // newValue هترجع array من objects المختارين
              const newIds = newValue.map(opt => opt[findKey]);
              setValue(newIds); // value = array of ids

              if(onChangeFn) onChangeFn(newIds);
            }
            else {
              setValue(newValue[findKey]|| isNullableType);
            }
            return;
          }

          // لو المستخدم قفل البوكس فقط (blur)
          if (reason === "blur") {
            // خليه يحتفظ بالقيمة الحالية — متعملش setValue(null)
            onBlur();
            return;
          }

          
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={`${title} ...`}
            error={error}
            helperText={error}
            onBlur={onBlur}
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: theme.palette.background.inputBackGround, // 👈 هنا
              },
            }}
          />
        )}

        sx={{
          mb: 3,
          "& .MuiAutocomplete-popupIndicator": {
            color: theme.palette.info.main, // 👈 لون السهم هنا
          },
          "& .MuiAutocomplete-clearIndicator": {
            color: theme.palette.error.main,   // 👈 لو عايز تغيّر لون Clear icon
          },
        }}

      />
    </Box>

  );
}

