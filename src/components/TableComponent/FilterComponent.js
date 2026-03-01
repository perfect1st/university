import { 
  Box, 
  FormControl, 
  MenuItem, 
  Pagination, 
  Select, 
  Stack, 
  Typography, 
  useMediaQuery, 
  useTheme 
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

export default function FilterComponent({ totalPages = 10 }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const { t } = useTranslation();

    // استخراج القيم من الرابط مع قيم افتراضية
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const handleParamChange = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set(key, value);
        if (key === "limit") newParams.set("page", 1); // إعادة التصفير للصفحة 1 عند تغيير العدد
        setSearchParams(newParams);
    };

    return (
        <Box 
            sx={{ 
                display: "flex", 
                flexDirection: isMobile ? "column" : "row",
                justifyContent: "space-between", 
                alignItems: "center",
                gap: 2,
                my: 4,
             
            }}
        >
             {/* قسم الترقيم (Pagination) */}
            <Stack direction="row" alignItems="center">
                <Pagination
                    color="primary"
                    shape="rounded" // زوايا دائرية بسيطة بدلاً من الدوائر الكاملة
                    count={totalPages}
                    page={page}
                    size={isMobile ? "small" : "medium"}
                    onChange={(e, value) => handleParamChange("page", value)}
                    sx={{
                        '& .Mui-selected': {
                            fontWeight: 'bold',
                        }
                    }}
                />
            </Stack>
            {/* قسم التحكم في العدد (Limit) بتصميم أنيق */}
            <Stack direction="row" alignItems="center" spacing={1.5}>
              
                <Select
                    value={limit}
                    onChange={(e) => handleParamChange("limit", e.target.value)}
                    size="small"
                    variant="standard" // تغيير الستايل ليكون بلا حدود خارجية ضخمة
                    disableUnderline
                    sx={{
                        fontWeight: "bold",
                        backgroundColor: theme.palette.action.hover,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: "8px",
                        fontSize: "0.875rem",
                        '& .MuiSelect-select': { py: 0.5 },
                        '&:hover': { backgroundColor: theme.palette.action.selected }
                    }}
                >
                    {[5, 10, 20, 50].map((val) => (
                        <MenuItem key={val} value={val} sx={{ fontSize: "0.875rem" }}>
                            {val} {t("perPage")}
                        </MenuItem>
                    ))}
                </Select>
            </Stack>

           
        </Box>
    );
}