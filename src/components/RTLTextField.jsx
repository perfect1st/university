import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Select, { components as RSComponents } from "react-select";
import Flag from "react-world-flags";
import { InputAdornment } from "@mui/material";
import CustomTextField from "./RTLTextField";

/**
 * PhoneNumberInput - يعرض country select داخل startAdornment للحقل المخصص (لا يغيّر ستايل CustomTextField)
 * props:
 * - personal, setPersonal, errors, handlePersonalBlur  (تتعامل مع state الموجود عندك)
 */
const PhoneNumberInput = ({ personal, setPersonal, errors, handlePersonalBlur }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchCountries = async () => {
      try {
        // نطلب الحقول المطلوبة فقط لتجنّب الخطأ 400
        const resp = await axios.get(
          "https://restcountries.com/v3.1/all?fields=name,idd,cca2"
        );
        if (!mounted) return;
        const list = resp.data
          .map((c) => {
            const root = c.idd?.root || "";
            const suffix = c.idd?.suffixes?.[0] || "";
            const dial = root ? `${root}${suffix}` : null; // example: "+966"
            if (!dial) return null;
            return {
              label: `${c.name.common} (${dial})`,
              value: dial, // نخزن كود مع +
              cca2: c.cca2, // لعرض العلم
              name: c.name.common,
              dial,
            };
          })
          .filter(Boolean);

        // نضع الأولوية (اليمن، البحرين، السعودية، مصر) في الأعلى
        const priorityOrder = ["YE", "BH", "SA", "EG"];
        const prioritized = [
          ...list.filter((i) => priorityOrder.includes(i.cca2)),
          ...list.filter((i) => !priorityOrder.includes(i.cca2)),
        ];

        setOptions(prioritized);
        setLoading(false);

        // إذا personal.countryCode موجود نعيّن الاختيار الافتراضي
        if (personal?.countryCode) {
          const found = prioritized.find((o) => o.value === personal.countryCode);
          if (found) setSelected(found);
        } else {
          // ممكن نعطي افتراضي +966 لو تحب (تعليق السطر التالي لو مش عايز افتراضي)
          const defaultFound = prioritized.find((o) => o.cca2 === "SA");
          if (defaultFound) {
            setSelected(defaultFound);
            setPersonal((p) => ({ ...p, countryCode: defaultFound.value }));
          }
        }
      } catch (err) {
        console.error("fetch countries error:", err);
        setLoading(false);
      }
    };

    fetchCountries();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // لو personal.countryCode اتغير من برّه، نزامن selected
  useEffect(() => {
    if (!options.length) return;
    const match = options.find((o) => o.value === personal?.countryCode);
    if (match) setSelected(match);
  }, [personal?.countryCode, options]);

  // custom renderOption لreact-select: يعرض العلم + الاسم + الكود
  const Option = (props) => {
    const { data } = props;
    return (
      <RSComponents.Option {...props}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Flag code={data.cca2} style={{ width: 20, height: 14 }} />
          <span style={{ whiteSpace: "nowrap" }}>{data.name}</span>
          <span style={{ marginLeft: 6, opacity: 0.8 }}>{data.dial}</span>
        </div>
      </RSComponents.Option>
    );
  };

  // custom single value (المحتوى الظاهر داخل الصندوق)
  const SingleValue = (props) => {
    const { data } = props;
    return (
      <RSComponents.SingleValue {...props}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Flag code={data.cca2} style={{ width: 18, height: 12 }} />
          <span style={{ fontSize: 13 }}>{data.dial}</span>
        </div>
      </RSComponents.SingleValue>
    );
  };

  // تنسيقات صغيرة عشان حجم الـ select يتوافق مع ارتفاع الـ TextField
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: 40,
      height: 40,
      boxShadow: "none",
      border: "none",
      cursor: "pointer",
      background: "transparent",
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0 6px",
    }),
    indicatorsContainer: (base) => ({
      ...base,
      padding: 0,
    }),
    option: (base) => ({
      ...base,
      padding: "6px 8px",
      fontSize: 13,
    }),
    singleValue: (base) => ({
      ...base,
      display: "flex",
      alignItems: "center",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 1500,
    }),
    container: (base) => ({
      ...base,
      width: 140, // عرض الـ select داخل الـ adornment
    }),
  };

  const handleChange = (option) => {
    setSelected(option || null);
    setPersonal((prev) => ({
      ...prev,
      countryCode: option ? option.value : "",
    }));
  };

  // محتوى الـ InputAdornment (نضع الـ react-select هنا)
  const startAdornment = (
    <InputAdornment position="start" sx={{ mr: 1, pl: 0, pr: 0 }}>
      <div style={{ width: 140 }}>
        <Select
          options={options}
          isLoading={loading}
          value={selected}
          onChange={handleChange}
          components={{ Option, SingleValue }}
          styles={selectStyles}
          placeholder={loading ? "..." : "الدولة"}
          isClearable={false}
          // منع overflow داخل الـ adornment
          menuPlacement="auto"
        />
      </div>
    </InputAdornment>
  );

  return (
    <CustomTextField
      placeholder="5XXXXXXXX"
      type="text"
      value={personal.phoneNumber || ""}
      onChange={(e) =>
        setPersonal((p) => ({
          ...p,
          phoneNumber: e.target.value,
        }))
      }
      onBlur={() => handlePersonalBlur("phoneNumber")}
      error={!!errors.phoneNumber}
      helperText={errors.phoneNumber || ""}
      InputProps={{
        startAdornment,
      }}
      fullWidth
    />
  );
};

export default PhoneNumberInput;
