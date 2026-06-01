// FilterComponent.users.jsx
import React, { useEffect, useState } from "react";
import { Box, Grid, InputAdornment, Button, MenuItem, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import CustomTextField from "../RTLTextField";
import { ReactComponent as SearchIcon } from "../../assets/searchIcon.svg";
import { ArrowDropDown } from "@mui/icons-material";


const FilterComponent = ({
  onSearch,
  initialFilters = {},
  userTypeOptions = ["Admin", "student", "accountant"],
  statusOptions = ["active", "inActive"],
}) => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const location = useLocation();

  const inputSx = {
    backgroundColor: "#E5E5E5",
    borderRadius: 1,
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#F5F0F2",
      },
      "&:hover fieldset": {
        borderColor: "#F5F0F2",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#F5F0F2",
      },
    },
  };

  const [filters, setFilters] = useState({
    search: initialFilters.keyword || "",
    role: initialFilters.role || "",
    status: initialFilters.status || "",
  });

  // Sync internal state when initialFilters change (e.g., URL changes)
  useEffect(() => {
    setFilters({
      search: initialFilters.keyword || "",
      role: initialFilters.role || "",
      status: initialFilters.status || "",
    });
  }, [initialFilters.keyword, initialFilters.role, initialFilters.status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (typeof onSearch === "function") {
      onSearch({ keyword: filters.search, role: filters.role, status: filters.status });
    }
  };

  const handleCancelFilters = () => {
    const empty = { search: "", role: "", status: "" };
    setFilters(empty);
    if (typeof onSearch === "function") {
      onSearch(empty);
    }
  };

  return (
    <Box sx={{ mb: 3, px: { xs: 1, sm: 2 } }}>
      <Grid container spacing={2} alignItems="center">
        {/* Search Field */}
        <Grid item xs={12} sm={6} md={6}>
          <CustomTextField
            fullWidth
            size="small"
            name="search"
            placeholder={t("Search by User Name , Email and Mobile")}
            sx={inputSx}
            value={filters.search}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            isRtl={isArabic}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Role Select */}
        <Grid item xs={12} sm={3} md={2}>
          <CustomTextField
            select
            fullWidth
            size="small"
            label={t("User Type")}
            name="role"
            value={filters.role || ""}
            onChange={handleChange}
            variant="outlined"
            isRtl={isArabic}
            SelectProps={{
              IconComponent: (props) => <ArrowDropDown {...props} sx={{ left: isArabic ? 8 : "auto", right: isArabic ? "auto" : 8, position: "absolute" }} />,
              MenuProps: { PaperProps: { style: { maxHeight: 250 } } },
            }}
            sx={inputSx}
          >
            <MenuItem value="">{t("All")}</MenuItem>
            {userTypeOptions.map((opt) =>
              typeof opt === "string" ? (
                <MenuItem key={opt} value={opt}>
                  {t(opt)}
                </MenuItem>
              ) : (
                <MenuItem key={opt.value} value={opt.value}>
                  {t(opt.label)}
                </MenuItem>
              )
            )}
          </CustomTextField>
        </Grid>

        {/* Status Select */}
        <Grid item xs={12} sm={3} md={2}>
          <CustomTextField
            select
            fullWidth
            size="small"
            label={t("Status")}
            name="status"
            value={filters.status || ""}
            onChange={handleChange}
            variant="outlined"
            isRtl={isArabic}
            SelectProps={{
              IconComponent: (props) => <ArrowDropDown {...props} sx={{ left: isArabic ? 8 : "auto", right: isArabic ? "auto" : 8, position: "absolute" }} />,
              MenuProps: { PaperProps: { style: { maxHeight: 250 } } },
            }}
            sx={inputSx}
          >
            <MenuItem value="">{t("All")}</MenuItem>
            {statusOptions.map((s) => (
              <MenuItem key={s} value={s}>
                {t(s)}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>

        {/* Buttons */}
        <Grid item xs={12} sm={6} md={1}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            size="medium"
            sx={{
              backgroundColor: theme.palette.info.main,
              color: "#ffffff",
              borderRadius: 1,
              height: "40px"
            }}
          >
            {t("Search")}
          </Button>
        </Grid>

        <Grid item xs={12} sm={6} md={1}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleCancelFilters}
            size="medium"
            sx={{
              borderColor: theme.palette.error.main,
              color: theme.palette.error.main,
              borderRadius: 1,
              height: "40px"
            }}
          >
            {t("Cancel")}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FilterComponent;
