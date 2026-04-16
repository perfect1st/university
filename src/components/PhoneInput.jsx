// src/components/PhoneInput.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Select, { components as RSComponents } from "react-select";
import Flag from "react-world-flags";
import { InputAdornment, TextField, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

/**
 * PhoneNumberInput
 * - لقبول prop اختياري CustomTextField لتنسيق الحقل (لو عندك واحد محلي)
 * - يعمل fallbacks ويمنع crash لو personal undefined
 */
function CustomTextField(props) {
  const theme = useTheme();
  const { placeholder, helperText, error, ...rest } = props;
  const { i18n } = useTranslation();
  const isArabic = i18n.language == "ar";
  return (
    <TextField
      fullWidth
      variant="outlined"
      size="small"
      placeholder={placeholder}
      error={error}
      helperText={helperText}
      {...rest}
      sx={{
        background: theme.palette.primary?.textField ?? "transparent",
        color: theme.palette.primary?.textFieldText ?? "inherit",
        "& .MuiInputBase-input": {
          color: theme.palette.primary?.textFieldText ?? "inherit",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "rgba(0,0,0,0.12)",
        },
        "& .MuiFormHelperText-root": {
          color: "error",
          fontFamily: "Cairo, Arial, sans-serif",
          fontWeight: 400,
          fontSize: "0.75rem",
          textAlign: isArabic ? "right" : "left",
          marginTop: 0,
          marginBottom: 0,
          marginRight: 0,
          marginLeft: 0,
          background: theme.palette.background.paper, // ✅ نفس لون خلفية الـ paper
        },
        ...props.sx,
      }}
    />
  );
}

const PhoneNumberInput = (props) => {
  // لا نفترض أن props موجودة — استخدم guard بسيط
  const {
    personal: incomingPersonal,
    setPersonal,
    errors = {},
    handlePersonalBlur,
  } = props || {};

  // local safe personal object (سيئتر منك لو parent مرّر undefined)
  const personal = incomingPersonal || { mobile: "", countryCode: "" };

  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchCountries = async () => {
      try {
        const resp = await axios.get(
          "https://restcountries.com/v3.1/all?fields=name,idd,cca2"
        );
        if (!mounted) return;
        const list = resp.data
          .map((c) => {
            const root = c?.idd?.root || "";
            const suffix = c?.idd?.suffixes?.[0] || "";
            const dial = root ? `${root}${suffix}` : null;
            if (!dial) return null;
            return {
              label: `${c?.name?.common || ""} (${dial})`,
              value: dial,
              cca2: c?.cca2 || "",
              name: c?.name?.common || "",
              dial,
            };
          })
          .filter(Boolean);

        const priority = ["YE", "BH", "SA", "EG"];
        const prioritized = [
          ...list.filter((i) => priority.includes(i.cca2)),
          ...list.filter((i) => !priority.includes(i.cca2)),
        ];

        setOptions(prioritized);
        setLoading(false);

        const initial =
          prioritized.find((o) => o.value === (personal?.countryCode || "")) ||
          prioritized.find((o) => o.cca2 === "YE") ||
          null;

        if (initial) {
          setSelected(initial);
          if (typeof setPersonal === "function") {
            setPersonal((p) => ({ ...(p || {}), countryCode: initial.value }));
          }
        }
      } catch (err) {
        console.error("PhoneInput fetch error:", err);
        setLoading(false);
      }
    };

    fetchCountries();
    return () => {
      mounted = false;
    };
  }, []); // مرة واحدة

  // مزامنة لو parent غيّر countryCode بعد التحميل
  useEffect(() => {
    if (!options.length) return;
    const found = options.find((o) => o.value === (personal?.countryCode || ""));
    if (found) setSelected(found);
  }, [personal?.countryCode, options]);

  const Option = (props) => {
    const { data } = props;
    return (
      <RSComponents.Option {...props}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, width: "70%", overflow: "hidden" }}>
            <Flag code={data.cca2 || "US"} style={{ minWidth: 20, height: 14 }} />
            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: 13 }}>{data.name}</span>
          </div>
          <span style={{ fontWeight: 500, fontSize: 13, direction: "ltr" }}>{data.dial}</span>
        </div>
      </RSComponents.Option>
    );
  };

  const SingleValue = (props) => {
    const { data } = props;
    return (
      <RSComponents.SingleValue {...props}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Flag code={data.cca2 || "US"} style={{ minWidth: 20, height: 14 }} />
          <span style={{ fontSize: 14, fontWeight: "bold", direction: "ltr" }}>{data.dial}</span>
        </div>
      </RSComponents.SingleValue>
    );
  };

  const selectStyles = {
    control: (base) => ({
      ...base,
      minHeight: 40,
      height: 40,
      boxShadow: "none",
      border: "none",
      background: "transparent",
    }),
    valueContainer: (base) => ({ ...base, padding: "0 6px" }),
    indicatorsContainer: (base) => ({ ...base, padding: 0 }),
    option: (base) => ({ ...base, padding: "6px 8px", fontSize: 13 }),
    singleValue: (base) => ({ ...base, display: "flex", alignItems: "center" }),
    menu: (base) => ({ ...base, zIndex: 1500, width: 250 }),
    container: (base) => ({ ...base, width: 110 }),
  };

  const handleChange = (opt) => {
    setSelected(opt || null);
    if (typeof setPersonal === "function") {
      setPersonal((prev) => ({ ...(prev || {}), countryCode: opt ? opt.value : "" }));
    }
  };

  const startAdornment = (
    <InputAdornment position="start" sx={{ mr: 1, pl: 0, pr: 0 }}>
      <div style={{ width: 110, borderInlineEnd: "1px solid rgba(0,0,0,0.1)", paddingInlineEnd: "4px" }}>
        <Select
          options={options}
          isLoading={loading}
          value={selected}
          onChange={handleChange}
          components={{ Option, SingleValue }}
          styles={selectStyles}
          placeholder={loading ? "..." : "الدولة"}
          isClearable={false}
          menuPlacement="auto"
          isSearchable
        />
      </div>
    </InputAdornment>
  );

  // اختر أي TextField: الممرّر عبر props أو MUI الافتراضي
  const Field = CustomTextField || TextField;

  return (
    <Field
      placeholder="5XXXXXXXX"
      type="text"
      value={(personal && personal.mobile) || ""}
      onChange={(e) => {
        if (typeof setPersonal === "function") {
          setPersonal((p) => ({ ...(p || {}), mobile: e.target.value }));
        }
      }}
      onBlur={() => {
        try {
          if (typeof handlePersonalBlur === "function")
            handlePersonalBlur("mobile");
        } catch (e) {}
      }}
      error={!!(errors && errors.mobile)}
      helperText={(errors && errors.mobile) || ""}
      InputProps={{ startAdornment }}
      fullWidth
      // إذا Field هو MUI TextField فالـ props أعلاه شغالة. لو Field هو custom قد يتقبّل props أيضاً.
    />
  );
};

export default PhoneNumberInput;
