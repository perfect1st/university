import {
  InputAdornment,
  MenuItem,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import i18n from "../../i18n/i18n";
import SearchIcon from "@mui/icons-material/Search";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowDropDownCircleOutlined } from "@mui/icons-material";

const truncateText = (text, maxLength = 50) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

export default function CustomTextFieldAdmin({
  searchKey,
  width = "100%",
  height,
  placeholder,
  value,
  setValue,
  sx,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const theme = useTheme();
  const isArabic = i18n.language === "ar";
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <TextField
      hiddenLabel
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder={isMobile ? truncateText(placeholder, 40) : placeholder}
      InputProps={{
        endAdornment: (
          <InputAdornment position={"end"}>
            <SearchIcon sx={{ color: theme.palette.info.main }} />
          </InputAdornment>
        ),
      }}
      inputProps={{
        style: {
          direction: isArabic ? "rtl" : "ltr",
          fontWeight: 400,
          height: height,
          padding: "0 12px",
          display: "flex",
          alignItems: "center",
        },
      }}
      sx={{
        width: isMobile ? "100%" : width,
        height: height,
        direction: isArabic ? "rtl" : "ltr",
        background: theme.palette.background.gray,
        fontWeight: 400,
        "& .MuiOutlinedInput-root": {
          "& fieldset": { border: "none" },
          "&:hover fieldset": { border: "none" },
          "&.Mui-focused fieldset": { border: "none" },
        },
        ...sx,
      }}
    />
  );
}

function CustomSelect({
  children,
  t,
  height,
  label,
  backgroundColor,
  value,
  setValue,
  error,
  setError,
  onChange,
  fieldID,
  fieldName,
  onBlur,
  onKeyDown,
  isDisabled = false,
  sx,
}) {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const isArabic = i18n.language == "ar";

  return (
    <TextField
      id={fieldID}
      name={fieldName}
      select
      size="small"
      SelectProps={{
        displayEmpty: true,
        MenuProps: { disableScrollLock: true },
      }}
      sx={{
        direction: isArabic ? "rtl" : "ltr",
        my: "auto",
        width: "100%",
        minWidth: "160px",
        "& .MuiInputBase-root": {
          height: height || "45px",
          backgroundColor: backgroundColor
            ? backgroundColor
            : theme.palette.background.gray,
          color: "#6C737F",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          border: "none !important",
          boxShadow: "none !important",
        },
        "& .MuiSelect-select": {
          padding: isArabic ? "10px 12px 10px 35px" : "10px 35px 10px 12px",
          display: "flex",
          alignItems: "center",
          textAlign: isArabic ? "right" : "left",
          justifyContent: isArabic ? "flex-end" : "flex-start",
          color: theme.palette.text.primary,
          fontWeight: 500,
          direction: isArabic ? "rtl" : "ltr",
        },
        "& .MuiSvgIcon-root": {
          color: theme.palette.info.main,
          position: "absolute",
          right: isArabic ? "auto" : "5px",
          left: isArabic ? "5px" : "auto",
          pointerEvents: "none",
        },
        "& fieldset": {
          border: "none !important",
        },
        "& .MuiInputBase-input.Mui-disabled": {
          WebkitTextFillColor: `${theme.palette.primary?.disabled} !important`,
          fontWeight: "700",
        },
        ...sx,
      }}
      value={value}
      onChange={(e) => {
        if (onChange) {
          setValue && setValue(e.target.value);
          onChange(e);
        } else {
          setValue(e.target.value);
        }
        setError && setError("");
      }}
      onBlur={onBlur}
      error={error}
      helperText={error}
      disabled={isDisabled}
    >
      {children}
    </TextField>
  );
}

export { CustomSelect };
