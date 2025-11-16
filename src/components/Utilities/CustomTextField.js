import { InputAdornment, MenuItem, TextField, useTheme } from "@mui/material";
import React from "react";
import i18n from "../../i18n/i18n";
import SearchIcon from "@mui/icons-material/Search";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowDropDownCircleOutlined } from "@mui/icons-material";

export default function CustomTextFieldAdmin({ searchKey, width = "100%", height }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const theme = useTheme();
  const isArabic = i18n.language === "ar";
  return (
    <TextField
      hiddenLabel
      value={searchParams.get(searchKey) || ""}
      onChange={(e) => {
        console.log("searchKey", searchKey);
        searchParams.set(searchKey, e.target.value);
        setSearchParams(searchParams);
      }}
      placeholder={isArabic ? "بحث بالاسم" : "Search By Nationality Name"}
      // fullWidth
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
          height: height, // 👈 نفس ارتفاع الحقل
          padding: "0 12px", // 👈 شوية padding أفقي فقط
          display: "flex",
          alignItems: "center", // 👈 يوسّط النص عموديًا
        },
      }}
      sx={{
        width: width,
        height: height,
        direction: isArabic ? "rtl" : "ltr",
        background: theme.palette.background.gray,
        fontWeight: 400,
        "& .MuiOutlinedInput-root": {
          "& fieldset": { border: "none" },
          "&:hover fieldset": { border: "none" },
          "&.Mui-focused fieldset": { border: "none" },
        },
      }}
    />
  );
}

// function CustomSelect({ children, t, height , label, ...rest }) {
//   const theme = useTheme();
//   const isArabic = i18n.language === "ar";
//   return (
//     <TextField
//   select
//   // id="country"
//   SelectProps={{
//     displayEmpty: true,
//     renderValue: (selected) => {
//       if (!selected) {
//         return <>{label}</>;
//       }
//       return <>Selected: {selected}</>;
//     },
//     MenuProps: { disableScrollLock: true },
//   }}
//   sx={{
//     direction: isArabic ? "rtl" : "rtl",
//      textAlign: isArabic ? "right" : "left",
//     width: "100%",
//     maxWidth: "100%",
//     minWidth:"160px",
//     "& .MuiInputBase-root": {
//       height: height || "45px",
//       backgroundColor: theme.palette.background.gray,
//       color: "#6C737F",
//       borderRadius: "8px",
//       display: "flex",
//       alignItems: "center",
//       border: "none !important",
//       boxShadow: "none !important",
//       outline: "none !important",

//       "&:hover": {
//         backgroundColor: theme.palette.background.gray,
//       },
//       "&.Mui-focused": {
//         backgroundColor: theme.palette.background.gray,
//         boxShadow: "none !important",
//       },
//     },
//     "& .MuiSelect-select": {
//       padding: "10px 12px",
//       display: "flex",
//       alignItems: "center",
//       color: "#6C737F",
//       fontWeight: 500,
//       direction: isArabic ? "rtl" : "rtl",
//     },
//     "& .MuiSvgIcon-root": {
//       color: theme.palette.info.main,
//       // 👇 هنا التحكم في مكان السهم
//       right: isArabic ? "auto" : "90%",
//       left: isArabic ? "8px" : "auto",
//       position: "absolute",
//       pointerEvents: "none",
//       direction: isArabic ? "rtl" : "rtl",
//     },
//     "& fieldset": {
//       border: "none !important",
//     },
//     "& .MuiMenuItem-root:hover": {
//       backgroundColor: "transparent !important",
//     },
//   }}
// >
//   <MenuItem value="eg">مصر</MenuItem>
//   <MenuItem value="sa">Saudi Arabia</MenuItem>
//   <MenuItem value="ae">UAE</MenuItem>
// </TextField>

//   //   <TextField
//   //     select
//   //     id="country"
//   //     // placeholder={t("admissions.country")}
//   //     // value={academic.country_id}
//   //     // onChange={(e) => {
//   //     //   setAcademic((a) => ({ ...a, country_id: e.target.value }));
//   //     //   // get cities in selected country
//   //     //   if (e.target.value != "") {
//   //     //     // 44444444444444444444444444
//   //     //     getCitiesByCountry({
//   //     //       variables: {
//   //     //         country_id: e.target.value,
//   //     //       },
//   //     //     });
//   //     //   }
//   //     // }}
//   //     // onBlur={() => handleAcademicBlur("country_id")}
//   //     // error={!!acadErrors.country_id}
//   //     // helperText={acadErrors.country_id || ""}
//   //     SelectProps={{
//   //       displayEmpty: true,
//   //       renderValue: (selected) => {
//   //         if (!selected) {
//   //           return <>{label}</>;
//   //         }
//   //         return (
//   //           <>
//   //             {/* {i18n.language === "ar"
//   //                         ? countries?.find((city) => city?.id === selected)
//   //                             ?.name_ar
//   //                         : cities?.find((city) => city?.id === selected)
//   //                             ?.name_en} */}
//   //           </>
//   //         );
//   //       },
//   //       MenuProps: {
//   //         // optional: keep menu within viewport
//   //         //  PaperProps: { style: { maxHeight: 320 } },
//   //       },
//   //     }}
//   //   //   sx={{ 
//   //   //     width: "100%", // أو أي عرض تريده
//   //   // "& .MuiInputBase-root": {
//   //   //   height: "40px", // 👈 هنا تتحكم في الارتفاع
//   //   //   display: "flex",
//   //   //   alignItems: "center", // يخلي النص في النص عموديًا
//   //   //    backgroundColor: theme.palette.background.gray, // 👈 الخلفية الأساسية
//   //   //     "& .MuiInputBase-root": {
//   //   //   height: "45px",
//   //   //   backgroundColor: theme.palette.background.gray, // 👈 لو عايز تغطي كل طبقات الـ input
//   //   //   display: "flex",
//   //   //   alignItems: "center",
//   //   // },
//   //   // },
//   //   // "& .MuiSelect-select": {
//   //   //   padding: "10px 12px", // 👈 padding داخلي أنيق
//   //   //   display: "flex",
//   //   //   alignItems: "center",
//   //   // },
//   //   //    }}
//   // //   sx={{
//   // //   width: "100%",
//   // //   "& .MuiInputBase-root": {
//   // //     height: height,
//   // //     backgroundColor: theme.palette.background.gray, // لون الخلفية
//   // //     color: "#6C737F", // لون النص
//   // //     display: "flex",
//   // //     alignItems: "center",
//   // //     borderRadius: "8px",
//   // //     // 🔥 إلغاء أي تأثير hover أو focus
//   // //     "&:hover": {
//   // //       backgroundColor: theme.palette.background.gray,
//   // //     },
//   // //     "&.Mui-focused": {
//   // //       backgroundColor: theme.palette.background.gray,
//   // //       boxShadow: "none",
//   // //     },
//   // //   },
//   // //   "& .MuiSelect-select": {
//   // //     padding: "10px 12px",
//   // //     display: "flex",
//   // //     alignItems: "center",
//   // //     color: "#6C737F",
//   // //     fontWeight: 500,
//   // //   },
//   // //   "& .MuiSvgIcon-root": {
//   // //     color: theme.palette.info.main, // لون السهم
//   // //   },
//   // //   // 🔥 إلغاء hover داخل القائمة نفسها
//   // //   "& .MuiMenuItem-root:hover": {
//   // //     backgroundColor: "transparent !important",
//   // //   },


//   // // }}

//   //  sx={{
//   //   direction: "rtl",
//   //   width: "100%",
//   //   "& .MuiInputBase-root": {
//   //     height: height,
//   //     backgroundColor: theme.palette.background.gray, // الخلفية
//   //     color: "#6C737F", // لون النص
//   //     borderRadius: "8px",
//   //     display: "flex",
//   //     alignItems: "center",
//   //     border: "none !important",
//   //     boxShadow: "none !important",
//   //     outline: "none !important",

//   //     // 👇 إزالة hover تمامًا
//   //     "&:hover": {
//   //       backgroundColor: theme.palette.background.gray,
//   //       border: "none !important",
//   //       boxShadow: "none !important",
//   //     },

//   //     // 👇 إزالة تأثير الفوكس تمامًا
//   //     "&.Mui-focused": {
//   //       backgroundColor: theme.palette.background.gray,
//   //       border: "none !important",
//   //       boxShadow: "none !important",
//   //       outline: "none !important",
//   //     },
//   //   },

//   //   "& .MuiSelect-select": {
//   //     padding: "10px 12px",
//   //     display: "flex",
//   //     alignItems: "center",
//   //     color: "#6C737F",
//   //     fontWeight: 500,
//   //   },

//   //   "& .MuiSvgIcon-root": {
//   //     color: theme.palette.info.main, // لون السهم
//   //   },

//   //   // 🔥 إلغاء hover داخل عناصر القائمة (MenuItem)
//   //   "& .MuiMenuItem-root:hover": {
//   //     backgroundColor: "transparent !important",
//   //   },

//   //   // 🔥 إزالة أي تأثير border في كل الحالات
//   //   "& fieldset": {
//   //     border: "none !important",
//   //   },
//   // }}
//   //   >
//   //     <MenuItem value="eg">Egypt</MenuItem>
//   //     <MenuItem value="sa">Saudi Arabia</MenuItem>
//   //     <MenuItem value="ae">UAE</MenuItem>
//   //     {/* {countries?.map((country) => (
//   //                 <MenuItem key={country?.id} value={country?.id}>
//   //                   {i18n.language === "ar"
//   //                     ? country?.name_ar
//   //                     : country?.name_en}
//   //                 </MenuItem>
//   //               ))} */}
//   //   </TextField>
//   );
// }

// function CustomSelect({ children, t, height, label, ...rest }) {
//   const theme = useTheme();
//   const isArabic = i18n.language === "ar";

//   return (
//   <TextField
//       select
//       size="small"
//       hiddenLabel
//       SelectProps={{
//         displayEmpty: true,
//         IconComponent: () => null, // ❌ إلغاء سهم MUI الافتراضي
//         renderValue: (selected) => {
//           if (!selected) return label;
//           return selected;
//         },
//         MenuProps: { disableScrollLock: true },
//       }}
//       sx={{
//         direction: isArabic ? "rtl" : "ltr",
//         "& .MuiInputBase-root": {
//           height,
//           backgroundColor: theme.palette.background.gray,
//           borderRadius: "8px",
//           paddingRight: "36px", // مساحة للسهم
//           display: "flex",
//           alignItems: "center",
//           border: "none",
//         },
//         "& fieldset": { border: "none" },
//         "& .MuiSelect-select": {
//           display: "flex",
//           alignItems: "center",
//           color: "#6C737F",
//           fontWeight: 500,
//           textAlign: isArabic ? "right" : "left",
//         },
//       }}
//       {...rest}
//       InputProps={{
//         endAdornment: (
//           <ArrowDropDownCircleOutlined
//             sx={{
//               position: "absolute",
//               right: isArabic && "8px", // 👈 السهم دايمًا في أقصى اليمين

//               color: theme.palette.info.main,
//               pointerEvents: "none",
//             }}
//           />
//         ),
//       }}
//     >

//       {children}
//     </TextField>
//   );
// }

function CustomSelect({ children, t, height, label, backgroundColor, value, setValue ,error,setError , onChange }) {
  const theme = useTheme();
  // const { placeholder, helperText, error, ...rest } = props;

  // const { placeholder, helperText, error, children, ...rest } = props;
  const { i18n } = useTranslation();
  const isArabic = i18n.language == "ar";

  return (
    <TextField
      select
      size="small"
      SelectProps={{
        displayEmpty: true,
        // renderValue: (selected) => (!selected ? label : selected),
        MenuProps: { disableScrollLock: true },
      }}
      sx={{
        direction: isArabic ? "rtl" : "ltr",
        my:"auto",
        width: "100%",
        minWidth: "160px",
        "& .MuiInputBase-root": {
          height: height || "45px",
          backgroundColor: backgroundColor ? backgroundColor : theme.palette.background.gray,
          color: "#6C737F",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          border: "none !important",
          boxShadow: "none !important",
        },
        "& .MuiSelect-select": {
          padding: "10px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end", // 👈 اتجاه النص
          color: "#6C737F",
          fontWeight: 500,
        },
        "& .MuiSvgIcon-root": {
          color: theme.palette.info.main,
          position: "absolute",
          right: isArabic ? "5px" : "auto", // 👈 موقع السهم
          left: isArabic ? "5px" : "auto",
          pointerEvents: "none",
        },
        "& fieldset": {
          border: "none !important",
        },

      }}

      value={value}
      onChange={(e) => {
        if(onChange){
          setValue(e.target.value);
          onChange(e);
          
        }
        else{
           setValue(e.target.value);
        }

        setError("");
         
      }}
      error={error}
      helperText={error}
    >

      {children}
    </TextField>

  );
}


export { CustomSelect };
