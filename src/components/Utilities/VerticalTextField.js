import { Autocomplete, Box, Checkbox, MenuItem, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
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
  isDisabled = false,
  isMultiline = false,
  isReadOnly = false

}) {

  const theme = useTheme();

  console.log("fieldID", fieldID);
  return (
    <>
      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
        {title}
      </Typography>
      {
        type == "text" &&
        <TextField
          multiline={isMultiline}
          rows={4}
          fullWidth
          id={fieldID}
          name={fieldName}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          error={error}
          helperText={helperText}
          variant="outlined"
          sx={{ mb: 3, backgroundColor: theme.palette.background.inputBackGround, height: isMultiline ? "auto" : "56px" }}
          disabled={isDisabled}
          InputProps={{ readOnly: isReadOnly }}
        />
      }
      {
        type == "number" &&
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
      {
        type == "date" && <TextField
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          id={fieldID}
          name={fieldName}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          error={error}
          helperText={helperText}
          variant="outlined"
          sx={{ mb: 3, backgroundColor: theme.palette.background.inputBackGround, height: isMultiline ? "auto" : "56px" }}
          disabled={isDisabled}
          InputProps={{ readOnly: isReadOnly }}
        />
      }

    </>
  )
}


export const VerticalTextFieldSelect = ({ t, backgroundColor, title, defaultOptionLabel, children, value, setValue, error, setError, onChange, fieldID, fieldName, onBlur, onKeyDown, height = "56px" }) => {
  const theme = useTheme();
  return (
    <>
      {
        title && <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
          {title}
        </Typography>
      }

      <Box sx={{ mb: 3 }}>
        <CustomSelect t={t} label={defaultOptionLabel} height={height} backgroundColor={backgroundColor} value={value} setValue={setValue} error={error} setError={setError} onChange={onChange} fieldID={fieldID} fieldName={fieldName} onBlur={onBlur} onKeyDown={onKeyDown}  >
          {children}
        </CustomSelect>

      </Box>

    </>

  );
}

export const SearchByTypingSelect = ({ 
  options, value, setValue, title, label, error, onBlur, 
  multiple = false, labelToShow, findKey, onChangeFn 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box sx={{ mb: 2, width: "100%" }}>
      
      {/* TABLE LAYOUT — ضامن إن الـ autocomplete مينزلش تحت الـ label */}
      <Box sx={{
        display: "flex",
        tableLayout: "fixed",
        width: "100%",
        borderCollapse: "separate",
        borderSpacing: "8px 0",
        flexDirection: "column",
        gap: 1,
      }}>

        {/* Label Cell */}
        {title && (
          <Box sx={{
            // display: "table-cell",
            width: "130px",
            minWidth: "130px",
            maxWidth: "130px",
            verticalAlign: "middle",
            fontWeight: "bold",
            fontSize: "0.875rem",
            whiteSpace: "nowrap",
            pr: 1,
          }}>
            {title}
          </Box>
        )}

        {/* Autocomplete Cell */}
        <Box sx={{
          // display: "table-cell",
          width: "100%",
          // maxWidth: 0,          // ← مع tableLayout:fixed بيجبر الـ cell تتقلص
          verticalAlign: "middle",
          overflow: "hidden",
        }}>
          <Autocomplete
            multiple={multiple}
            disableCloseOnSelect={multiple}
            options={options}
            getOptionLabel={(option) => labelToShow(option)}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                {multiple && (
                  <Checkbox
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                )}
                {labelToShow(option)}
              </li>
            )}
            value={
              multiple
                ? options?.filter(opt => value.includes(opt[findKey]))
                : options?.find(opt => opt[findKey] === value) || null
            }
            clearOnEscape={false}
            disableClearable={false}
            onChange={(e, newValue, reason) => {
              if (reason === "clear") {
                multiple ? setValue([]) : setValue(null);
                if (onChangeFn) onChangeFn([]);
                return;
              }
              if (reason === "selectOption" || reason === "removeOption") {
                if (!newValue) return;
                if (multiple) {
                  const newIds = newValue.map(opt => opt[findKey]);
                  setValue(newIds);
                  if (onChangeFn) onChangeFn(newIds);
                } else {
                  setValue(newValue[findKey] || null);
                }
                return;
              }
              if (reason === "blur") {
                onBlur && onBlur();
                return;
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={`${title} ...`}
                error={!!error}
                onBlur={onBlur}
                sx={{
                  width: "100%",
                  "& .MuiInputBase-root": {
                    backgroundColor: theme.palette.background.inputBackGround,
                    flexWrap: multiple ? "wrap" : "nowrap", // ← multiple chips تتوزع
                    overflow: "hidden",
                  },
                  // ← ellipsis على الـ input نفسه
                  "& .MuiInputBase-input": {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    minWidth: "0 !important",
                  },
                }}
              />
            )}
            sx={{
              width: "100%",
              minWidth: 0,
              "& .MuiAutocomplete-popupIndicator": {
                color: theme.palette.info.main,
              },
              "& .MuiAutocomplete-clearIndicator": {
                color: theme.palette.error.main,
              },
              // ← الـ tags في multiple مش بتتمد برا الـ container
              "& .MuiAutocomplete-tag": {
                maxWidth: "calc(100% - 30px)",
                overflow: "hidden",
              },
            }}
          />
        </Box>
      </Box>

      {/* Error — تحت دايماً */}
      {error && (
        <Typography variant="caption" sx={{
          color: "error.main",
          display: "block",
          mt: 0.5,
          pl: "138px",  // ← aligned تحت الـ autocomplete
        }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};
export const SearchByTypingSelect2 = ({ 
  options, value, setValue, title, error, onBlur, 
  multiple = false, labelToShow, findKey, onChangeFn 
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ 
      display: "flex", 
      flexWrap: "wrap", 
      mb: 4, 
      backgroundColor: theme.palette.primary?.gray, 
      gap: 3, 
      p: 1, 
      minHeight: "60px" // استخدمنا minHeight بدلاً من height للسماح بالتمدد عند اختيار عناصر كثيرة
    }}>
      
      {/* قسم العنوان - مطابق تماماً لـ HorizentalTextFieldSelect */}
      <Typography variant="subtitle2" sx={{ 
        fontWeight: "bold", 
        height: "55px", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "start", 
        justifyContent: "center", 
        width: "40%" 
      }}>
        {title}
      </Typography>

      {/* قسم الحقل - مطابق تماماً في الهيكلية */}
      <Box sx={{ 
        flexGrow: 1, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        flexDirection: "column",
        width: "50%" // لضمان التوازن مع الـ 40% الخاصة بالعنوان والـ gap
      }}>
        <Autocomplete
          multiple={multiple}
          disableCloseOnSelect={multiple}
          options={options || []}
          getOptionLabel={(option) => labelToShow(option)}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              {multiple && (
                <Checkbox
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
              )}
              {labelToShow(option)}
            </li>
          )}
          value={multiple 
            ? (options?.filter(opt => value?.includes(opt[findKey])) || []) 
            : (options?.find(opt => opt[findKey] === value) || null)
          }
          onChange={(e, newValue, reason) => {
            if (reason === "clear") {
              multiple ? setValue([]) : setValue(null);
              if (onChangeFn) onChangeFn([]);
            } else if (reason === "selectOption" || reason === "removeOption") {
              if (multiple) {
                const newIds = newValue.map(opt => opt[findKey]);
                setValue(newIds);
                if (onChangeFn) onChangeFn(newIds);
              } else {
                setValue(newValue ? newValue[findKey] : null);
              }
            }
          }}
          onBlur={onBlur}
          fullWidth
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={`${title} ...`}
              error={Boolean(error)}
              helperText={error}
              variant="outlined"
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: theme.palette.primary?.gray,
                  borderRadius: "8px",
                  "& fieldset": { border: "none" },
                  "&:hover fieldset": { border: "none" },
                  "&.Mui-focused fieldset": { border: "none" },
                },
              }}
            />
          )}
          // تنسيق إضافي ليتناسب مع شكل الـ Select
          sx={{
            width: "100%",
            "& .MuiAutocomplete-popupIndicator": { color: theme.palette.info.main },
            "& .MuiChip-root": {
                height: "24px",
                backgroundColor: theme.palette.background.paper, // لون الـ chips
                border: `1px solid ${theme.palette.divider}`
            }
          }}
        />
      </Box>
    </Box>
  );
}
