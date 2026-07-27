import {
  Autocomplete,
  Box,
  Button,
  Grid,
  MenuItem,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import CustomTextFieldAdmin, { CustomSelect } from "./CustomTextField";
import { useSearchParams } from "react-router-dom";
import i18n from "../../i18n/i18n";

export default function DashboardFilterComponent({
  t,
  placeholder,
  onFilterChange,
  textSearchField,
  statusKey,
  TrueOrFalseArr,
  selectKey,
  selectOptions,
  select2Label,
  select1Label = "Status",
  arKey,
  enKey,
  textSearchField2,
  placeholder2,
  selectKey2,
  selectOptions2,
  select2Label2,
  selectKey3,
  selectOptions3,
  select2Label3,
  onSelect2Change,
  fromRegisterForm = false,
  isAdmin = true,
  isPromotion = false,
  isAcademyTerms = false,
  userKey,
  userOptions,
  userLabel,
  dateKey,
  dateLabel,
  scopeKey,
  scopeOptions,
  scopeLabel
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [searchParams, setSearchParams] = useSearchParams();
  const isArabic = i18n.language === "ar";

  const [searchValue, setSearchValue] = useState(
    () => searchParams.get(textSearchField) || "",
  );
  const [searchValue2, setSearchValue2] = useState(
    () => searchParams.get(textSearchField2) || "",
  );

  const [statusSearch, setStatusSearch] = useState(
    () => searchParams.get(statusKey) || "0",
  );
  const [select2Search, setSelect2Search] = useState(
    () => searchParams.get(selectKey) || "0",
  );
  const [select3Search, setSelect3Search] = useState(
    () => searchParams.get(selectKey2) || "0",
  );
  const [select4Search, setSelect4Search] = useState(
    () => searchParams.get(selectKey3) || "0",
  );

  const [userSearch, setUserSearch] = useState(() => {
    if (!userKey) return null;
    const uId = searchParams.get(userKey);
    if (uId && userOptions?.length > 0) {
      return userOptions.find((u) => String(u.id) === String(uId)) || null;
    }
    return null;
  });

  const [dateSearch, setDateSearch] = useState(
    () => (dateKey ? searchParams.get(dateKey) || "" : "")
  );
  const [scopeSearch, setScopeSearch] = useState(
    () => (scopeKey ? searchParams.get(scopeKey) || "0" : "0")
  );

  React.useEffect(() => {
    if (userKey) {
      const uId = searchParams.get(userKey);
      if (uId && userOptions?.length > 0) {
        const found = userOptions.find((u) => String(u.id) === String(uId));
        setUserSearch(found || null);
      } else if (!uId) {
        setUserSearch(null);
      }
    }
    if (dateKey) {
      setDateSearch(searchParams.get(dateKey) || "");
    }
    if (scopeKey) {
      setScopeSearch(searchParams.get(scopeKey) || "0");
    }
  }, [searchParams, userKey, dateKey, scopeKey, userOptions]);

  const handleCancel = () => {
    // 1. Clear local state
    setSearchValue("");
    setSearchValue2("");
    setStatusSearch("0");
    setSelect2Search("0");
    setSelect3Search("0");
    setSelect4Search("0");
    setUserSearch(null);
    setDateSearch("");
    setScopeSearch("0");
    if (onSelect2Change) onSelect2Change("0");

    // 3. CRITICAL: Tell the parent page to show ALL data again
    onFilterChange({});
  };

  const handleSearch = () => {
    let filterOBJ = {};
    if (searchValue) filterOBJ[textSearchField] = searchValue?.trim();
    if (statusSearch !== "0") filterOBJ[statusKey] = statusSearch;
    if (selectKey && select2Search !== "0") filterOBJ[selectKey] = select2Search;
    if (searchValue2) filterOBJ[textSearchField2] = searchValue2?.trim();
    if (selectKey2 && select3Search !== "0") filterOBJ[selectKey2] = select3Search;
    if (selectKey3 && select4Search !== "0") filterOBJ[selectKey3] = select4Search;
    if (userKey && userSearch?.id) filterOBJ[userKey] = userSearch.id;
    if (dateKey && dateSearch) filterOBJ[dateKey] = dateSearch;
    if (scopeKey && scopeSearch !== "0") filterOBJ[scopeKey] = scopeSearch;

    onFilterChange(filterOBJ);
  };
  return (
    <Grid
      container
      sx={{
        my: 2,
        gap: 2,
        display: "flex",
        flexWrap: "wrap",
        flexDirection: isMobile ? "column" : "row",
        width: "100%",
      }}
    >
      {!isPromotion && <Grid
        item
        xs={12}
        md={fromRegisterForm ? 3 : isAcademyTerms ? 5 : select3Search ? 6 : 8}
        sx={{ display: "flex", gap: 2, flexWrap: isMobile ? "wrap" : "nowrap" }}
      >
        {isMobile ? (
          <>
            <Box sx={{ width: "80%", mx: "auto" }}>
              <CustomTextFieldAdmin
                value={searchValue}
                setValue={setSearchValue}
                height={"40px"}
                placeholder={placeholder}
              />
            </Box>
            {textSearchField2 && (
              <Box sx={{ width: "80%", mx: "auto" }}>
                <CustomTextFieldAdmin
                  value={searchValue2}
                  setValue={setSearchValue2}
                  height={"40px"}
                  placeholder={placeholder2}
                />
              </Box>
            )}
          </>
        ) : (
          <>
            <CustomTextFieldAdmin
              value={searchValue}
              setValue={setSearchValue}
              height={"40px"}
              placeholder={placeholder}
            />
            {textSearchField2 && (
              <CustomTextFieldAdmin
                value={searchValue2}
                setValue={setSearchValue2}
                height={"40px"}
                placeholder={placeholder2}
              />
            )}
          </>
        )}
      </Grid>}

      {/* <Grid item xs={12} md={fromRegisterForm ? 8 : select3Search ? 6 : 4}> */}
        {/* <Grid
          container
          spacing={2}
          sx={{
            alignItems: "center",
          }}
        > */}
          {statusKey && isAdmin && (
            <Grid item xs={12} md={2}>
              {isMobile ? (
                <Box sx={{ width: "80%", mx: "auto" }}>
                  <CustomSelect
                    t={t}
                    value={statusSearch}
                    setValue={setStatusSearch}
                    height={"40px"}
                  >
                    <MenuItem value="0">{t(select1Label)}</MenuItem>
                    {TrueOrFalseArr?.map((el, i) => (
                      <MenuItem key={i} value={el}>
                        {t(el)}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </Box>
              ) : (
                <CustomSelect
                  t={t}
                  value={statusSearch}
                  setValue={setStatusSearch}
                  height={"40px"}
                >
                  <MenuItem value="0">{t(select1Label)}</MenuItem>
                  {TrueOrFalseArr?.map((el, i) => (
                    <MenuItem key={i} value={el}>
                      {t(el)}
                    </MenuItem>
                  ))}
                </CustomSelect>
              )}
            </Grid>
          )}

          {selectOptions && isAdmin && (
            <Grid item xs={12} md={isAcademyTerms ? 4 : 2}>
              {isAcademyTerms ? (
                <Autocomplete
                  size="small"
                  options={selectOptions}
                  getOptionLabel={(option) => {
                    if (typeof option === 'string') return t(option);
                    return isArabic ? option[arKey] : option[enKey];
                  }}
                  value={selectOptions.find(opt => opt.id === select2Search) || null}
                  onChange={(event, newValue) => {
                    setSelect2Search(newValue ? newValue.id : "0");
                  }}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      placeholder={t(select2Label)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: '40px',
                          backgroundColor: theme.palette.background.gray,
                          borderRadius: '8px',
                          '& fieldset': { border: 'none' },
                          '&:hover fieldset': { border: 'none' },
                          '&.Mui-focused fieldset': { border: 'none' },
                        }
                      }}
                    />
                  )}
                />
              ) : (
                <>
                  {isMobile ? (
                    <Box sx={{ width: "80%", mx: "auto" }}>
                      <CustomSelect
                        t={t}
                        value={select2Search}
                        setValue={setSelect2Search}
                        height={"40px"}
                      >
                        <MenuItem value="0">{t(select2Label)}</MenuItem>
                        {selectOptions?.map((el, i) => (
                          <MenuItem key={i} value={el?.id ? el?.id : el}>
                            {el?.id ? (isArabic ? el[arKey] : el[enKey]) : t(el)}
                          </MenuItem>
                        ))}
                      </CustomSelect>
                    </Box>
                  ) : (
                    <CustomSelect
                      t={t}
                      value={select2Search}
                      setValue={setSelect2Search}
                      height={"40px"}
                    >
                      <MenuItem value="0">{t(select2Label)}</MenuItem>
                      {selectOptions?.map((el, i) => (
                        <MenuItem key={i} value={el?.id ? el?.id : el}>
                          {el?.id ? (isArabic ? el[arKey] : el[enKey]) : t(el)}
                        </MenuItem>
                      ))}
                    </CustomSelect>
                  )}
                </>
              )}
            </Grid>
          )}

          {selectOptions2 && isAdmin && (
            <Grid item xs={12} md={2}>
              {isMobile ? (
                <Box sx={{ width: "80%", mx: "auto" }}>
                  <CustomSelect
                    t={t}
                    value={select3Search}
                    setValue={(val) => {
                      setSelect3Search(val);
                      if (onSelect2Change) onSelect2Change(val);
                    }}
                    height={"40px"}
                  >
                    <MenuItem value="0">{t(select2Label2)}</MenuItem>
                    {selectOptions2?.map((el, i) => (
                      <MenuItem
                        key={i}
                        value={el.hasOwnProperty("id") ? el?.id : el}
                      >
                        {isArabic ? el?.title_ar : el?.title_en}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </Box>
              ) : (
                <CustomSelect
                  t={t}
                  value={select3Search}
                  setValue={(val) => {
                    setSelect3Search(val);
                    if (onSelect2Change) onSelect2Change(val);
                  }}
                  height={"40px"}
                >
                  <MenuItem value="0">{t(select2Label2)}</MenuItem>
                  {selectOptions2?.map((el, i) => (
                    <MenuItem
                      key={i}
                      value={el.hasOwnProperty("id") ? el?.id : el}
                    >
                    {isArabic ? el?.title_ar : el?.title_en}
                    </MenuItem>
                  ))}
                </CustomSelect>
              )}
            </Grid>
          )}
            
          {selectOptions3 && isAdmin && (
            <Grid item xs={12} md={2}>
              {isMobile ? (
                <Box sx={{ width: "80%", mx: "auto" }}>
                  <CustomSelect
                    t={t}
                    value={select4Search}
                    setValue={setSelect4Search}
                    height={"40px"}
                  >
                    <MenuItem value="0">{t(select2Label3)}</MenuItem>
                    {selectOptions3?.map((el, i) => (
                      <MenuItem
                        key={i}
                        value={el.hasOwnProperty("id") ? el?.id : el}
                      >
                        {isArabic ? el?.title_ar : el?.title_en}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </Box>
              ) : (
                <CustomSelect
                  t={t}
                  value={select4Search}
                  setValue={setSelect4Search}
                  height={"40px"}
                >
                  <MenuItem value="0">{t(select2Label3)}</MenuItem>
                  {selectOptions3?.map((el, i) => (
                    <MenuItem
                      key={i}
                      value={el.hasOwnProperty("id") ? el?.id : el}
                    >
                      {isArabic ? el?.title_ar : el?.title_en}
                    </MenuItem>
                  ))}
                </CustomSelect>
              )}
            </Grid>
          )}

          {userKey && userOptions && (
            <Grid item xs={12} md={2.5}>
              <Autocomplete
                size="small"
                options={userOptions}
                value={userSearch}
                onChange={(event, newValue) => setUserSearch(newValue)}
                getOptionLabel={(option) => {
                  if (!option) return "";
                  const name = option.fullname || option.username || "";
                  const serial = option.serial ? ` (#${option.serial})` : "";
                  return `${name}${serial}`;
                }}
                isOptionEqualToValue={(option, value) => String(option?.id) === String(value?.id)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={userLabel ? t(userLabel) : (isArabic ? "فلترة حسب المستخدم" : "Filter by User")}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '40px',
                        backgroundColor: theme.palette.background.gray || "#f5f5f5",
                        borderRadius: '8px',
                        '& fieldset': { border: 'none' },
                        '&:hover fieldset': { border: 'none' },
                        '&.Mui-focused fieldset': { border: 'none' },
                      }
                    }}
                  />
                )}
              />
            </Grid>
          )}

          {scopeKey && (
            <Grid item xs={12} md={2}>
              {isMobile ? (
                <Box sx={{ width: "80%", mx: "auto" }}>
                  <CustomSelect
                    t={t}
                    value={scopeSearch}
                    setValue={setScopeSearch}
                    height={"40px"}
                  >
                    <MenuItem value="0">{scopeLabel ? t(scopeLabel) : (isArabic ? "النطاق الجغرافي" : "Scope")}</MenuItem>
                    {(scopeOptions || [
                      { id: "true", labelAr: "داخل اليمن", labelEn: "Inside Yemen" },
                      { id: "false", labelAr: "خارج اليمن", labelEn: "Outside Yemen" }
                    ]).map((el, i) => (
                      <MenuItem key={i} value={el.id}>
                        {isArabic ? el.labelAr : el.labelEn}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </Box>
              ) : (
                <CustomSelect
                  t={t}
                  value={scopeSearch}
                  setValue={setScopeSearch}
                  height={"40px"}
                >
                  <MenuItem value="0">{scopeLabel ? t(scopeLabel) : (isArabic ? "النطاق الجغرافي" : "Scope")}</MenuItem>
                  {(scopeOptions || [
                    { id: "true", labelAr: "داخل اليمن", labelEn: "Inside Yemen" },
                    { id: "false", labelAr: "خارج اليمن", labelEn: "Outside Yemen" }
                  ]).map((el, i) => (
                    <MenuItem key={i} value={el.id}>
                      {isArabic ? el.labelAr : el.labelEn}
                    </MenuItem>
                  ))}
                </CustomSelect>
              )}
            </Grid>
          )}

          {dateKey && (
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                size="small"
                type="date"
                value={dateSearch}
                onChange={(e) => setDateSearch(e.target.value)}
                InputLabelProps={{ shrink: true }}
                placeholder={dateLabel ? t(dateLabel) : (isArabic ? "تاريخ المعاملة" : "Transaction Date")}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: '40px',
                    backgroundColor: theme.palette.background.gray || "#f5f5f5",
                    borderRadius: '8px',
                    '& fieldset': { border: 'none' },
                    '&:hover fieldset': { border: 'none' },
                    '&.Mui-focused fieldset': { border: 'none' },
                  }
                }}
              />
            </Grid>
          )}

     
                          <Grid item xs={12} md={1} >
                              <Button
                              fullWidth
                  onClick={handleSearch}
                  variant="contained"
                  sx={{ background: theme.palette.info?.main, }}
                >
                  {t("Search")}
                </Button>
                          </Grid>
                          <Grid item xs={12} md={1}>

                <Button
                fullWidth
                  onClick={handleCancel}
                  variant="outlined"
                  color="error"
                  // sx={{ flex: 1 }}
                >
                  {t("Cancel")}
                </Button>
                          </Grid>

              
           
        {/* </Grid> */}
      {/* </Grid> */}
    </Grid >
  );
}
