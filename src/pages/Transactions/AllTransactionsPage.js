import { useTheme } from "@emotion/react";
import { 
  Box, 
  Grid, 
  useMediaQuery, 
  Card, 
  CardContent, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Typography,
  Autocomplete,
  TextField,
  Paper,
  Button
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLazyQuery, useQuery } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import LoadingPage from "../../components/LoadingComponent";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import DashboardFilterComponent from "../../components/Utilities/DashboardFilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import Header from "../../components/PageHeader/header";
import { useEffect, useState } from "react";
import notify from "../../components/notify";
import { GET_ALL_TRANSACTIONS, GET_FILTERED_TRANSACTIONS } from "../../graphql/transactionQueries";
import { GET_USERS } from "../../graphql/usersQueries";
import FilterComponent from "../../components/TableComponent/FilterComponent";
import ExportExcelAndPDF from "../../components/Utilities/ExportExcelAndPDF";
import NoPermissionPage from "../../components/NoPermissionPage";
import usePermissionsByModule from "../../hooks/getPermissionsByScreen";
import logger from "../../utils/logger";

export default function AllTransactionsPage() {
    const theme = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [searchParams, setSearchParams] = useSearchParams();
    const { view, create, update } = usePermissionsByModule("transactions");
    
    const isArabic = i18n.language === "ar";

    // حالة فلتر نطاق الدولة (عام / داخل اليمن / خارج اليمن)
    const [countryFilter, setCountryFilter] = useState("all");

    // استعلام المستخدمين لفلتر الأوتوكومبليت
    const { data: usersData, loading: usersLoading } = useQuery(GET_USERS, { fetchPolicy: "network-only" });
    const userOptions = usersData?.users || [];

    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedDate, setSelectedDate] = useState(searchParams.get("transaction_date") || searchParams.get("date") || "");

    useEffect(() => {
        const userIdFromUrl = searchParams.get("user_id");
        if (userIdFromUrl && userOptions.length > 0) {
            const foundUser = userOptions.find(u => String(u.id) === String(userIdFromUrl));
            setSelectedUser(foundUser || null);
        } else if (!userIdFromUrl) {
            setSelectedUser(null);
        }
    }, [searchParams, userOptions]);

    useEffect(() => {
        const dateFromUrl = searchParams.get("transaction_date") || searchParams.get("date") || "";
        setSelectedDate(dateFromUrl);
    }, [searchParams]);

    const [
        GetTransactions,
        {
            data: filteredData,
            loading: transactionLoading
        }
    ] = useLazyQuery(GET_FILTERED_TRANSACTIONS, {
        fetchPolicy: "network-only"
    });

    // استعلام التصدير العام الشامل
    const { data: allData } = useQuery(GET_ALL_TRANSACTIONS, { fetchPolicy: "network-only" });

    const transactions = filteredData?.getTransactionsFiltered?.transactions || [];
    const total = filteredData?.getTransactionsFiltered?.total || 0;

    const formatDateToDDMMYYYY = (dateStr) => {
        if (!dateStr) return "";
        if (dateStr.includes("-")) {
            const parts = dateStr.split("-");
            if (parts[0].length === 4) {
                return `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
        }
        return dateStr;
    };

    useEffect(() => {
        let page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
        let limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 10;
        let searchText = searchParams.get("search") || "";
        let userIdParam = searchParams.get("user_id") || "";
        let dateParam = searchParams.get("transaction_date") || searchParams.get("date") || "";
        let isInsideYemenParam = searchParams.get("is_inside_yemen") || "";

        let variablesObj = { page, limit };
        if (searchText) variablesObj.search = searchText;
        if (searchParams.get("payment_method_type")) variablesObj.payment_method_type = searchParams.get("payment_method_type");
        if (searchParams.get("operation_type")) variablesObj.operation_type = searchParams.get("operation_type");
        if (searchParams.get("approval_status")) variablesObj.approval_status = searchParams.get("approval_status");
        if (userIdParam) variablesObj.user_id = userIdParam;
        if (dateParam) {
            variablesObj.transaction_date = formatDateToDDMMYYYY(dateParam);
        }
        if (isInsideYemenParam && isInsideYemenParam !== "0") {
            variablesObj.is_inside_yemen = isInsideYemenParam === "true";
        }

        GetTransactions({ variables: variablesObj });
    }, [searchParams]);

    // --- معالجة البيانات وتجهيز الرسوم والكلية لعرض الجدول ---
    const processTransactions = (items) => {
        let result = items || [];
        
        if (countryFilter !== "all") {
            result = result.filter((t) => {
                const isInsideYemen =
                    t.register_form_id?.is_inside_yemen === true ||
                    t.user_id?.is_inside_yemen === true;
                return countryFilter === "YEMEN" ? isInsideYemen : !isInsideYemen;
            });
        }

        const userIdParam = searchParams.get("user_id");
        if (userIdParam) {
            result = result.filter((t) => {
                const uId = t.user_id?.id || t.user_id?._id || t.register_form_id?.id;
                return String(uId) === String(userIdParam);
            });
        }

        const dateParam = searchParams.get("transaction_date") || searchParams.get("date");
        if (dateParam) {
            const formattedDate = formatDateToDDMMYYYY(dateParam);
            result = result.filter((t) => {
                if (!t.transaction_date) return false;
                return t.transaction_date === formattedDate || t.transaction_date.startsWith(dateParam);
            });
        }

        return result.map(el => {
            const student = el?.register_form_id || {};
            const user = el?.user_id || {};
            const feesSnapshot = el?.fees_type_snapshot || {};

            // جلب اسم الكلية ديناميكياً بناء على لغة النظام المحددة
            const facultyName = user?.faculty_id 
                ? (isArabic ? user.faculty_id.title_ar : user.faculty_id.title_en) 
                : t("N/A");

            // حساب الحقول المالية المتقدمة
            const totalFees = (student.is_inside_yemen || user.is_inside_yemen)
                ? (feesSnapshot.inside_yemen_value || 0)
                : (feesSnapshot.outside_yemen_value || 0);
            
            const paidAmount = el.amount || 0;
            const remainingAmount = totalFees - paidAmount;
            const fullName = el?.user_id ? el?.user_id?.fullname : `${student.first_name || ""} ${student.second_name || ""} ${student.third_name || ""} ${student.fourth_name || ""}`.trim();

            return {
                ...el,
                payment_method_type: t(`fee.method.${el?.payment_method_type}`),
                amount: String(paidAmount),
                fullName: fullName,
                facultyName: facultyName, // حقل الكلية الجديد الممرر للجدول
                requiredFees: String(totalFees),
                remainingFees: String(remainingAmount >= 0 ? remainingAmount : 0),
                countryScope: (student.is_inside_yemen || user.is_inside_yemen) ? t("insideYemen") : t("outsideYemen")
            };
        });
    };

    const getTransactionsToShow = processTransactions(transactions);

    // تحديث أعمدة الجدول لإدراج الكلية
    let columns = [
        { key: "serial", label: t("Serial") },
        { key: "transaction_serial", label: t("fee.transactionSerial") },
        { key: "fullName", label: t("Users") },
        { key: "facultyName", label: isArabic ? "الكلية" : "Faculty" }, // عمود الكلية بالجدول المعروض
        { key: "payment_method_type", label: t("fee.paymentMethodsTitle") },
        { key: "requiredFees", label: isArabic ? "الرسوم المطلوبة" : "Required Fees" },
        { key: "amount", label: t("fee.table.amount") },
        { key: "remainingFees", label: isArabic ? "المتبقي" : "Remaining" },
        { key: "countryScope", label: isArabic ? "النطاق الجغرافي" : "Scope" },
        { key: "transaction_date", label: t("fee.paymentDate") }
    ];

    // --- دالة استخراج التقارير وتصدير الكلية إلى Excel / PDF / Print ---
    const fetchAndExport = async (type) => {
        try {
            const allFetched = allData?.getTransactions || [];
            let exportFiltered = allFetched;

            if (countryFilter !== "all") {
                exportFiltered = allFetched.filter((t) => {
                    const isInsideYemen = t.register_form_id?.is_inside_yemen === true || t.user_id?.is_inside_yemen === true;
                    return countryFilter === "YEMEN" ? isInsideYemen : !isInsideYemen;
                });
            }

            const exportData = exportFiltered.map((user, i) => {
                const isInside = user.register_form_id?.is_inside_yemen || user.user_id?.is_inside_yemen;
                const totalFees = isInside ? (user.fees_type_snapshot?.inside_yemen_value || 0) : (user.fees_type_snapshot?.outside_yemen_value || 0);
                const remaining = totalFees - (user?.amount || 0);
                
                // تحديد اسم الكلية لملف التصدير والطباعة
                const facultyExportName = user?.user_id?.faculty_id 
                    ? (isArabic ? user.user_id.faculty_id.title_ar : user.user_id.faculty_id.title_en)
                    : (isArabic ? "غير محدد" : "N/A");

                return {
                    ID: i + 1,
                    [t("fee.transactionSerial")]: user?.transaction_serial,
                    [t("Users")]: user?.user_id ? user?.user_id?.fullname : `${user?.register_form_id?.first_name || ""} ${user?.register_form_id?.second_name || ""} ${user?.register_form_id?.third_name || ""} ${user?.register_form_id?.fourth_name || ""}`.trim(),
                    [isArabic ? "الكلية" : "Faculty"]: facultyExportName, // حقل الكلية بملفات التقارير والطباعة
                    [t("fee.paymentMethodsTitle")]: t(`fee.method.${user?.payment_method_type}`),
                    [isArabic ? "الرسوم الكلية" : "Total Fees"]: totalFees,
                    [t("fee.table.amount")]: user?.amount,
                    [isArabic ? "المبلغ المتبقي" : "Remaining"]: remaining >= 0 ? remaining : 0,
                    [isArabic ? "النطاق" : "Scope"]: isInside ? "داخل اليمن" : "خارج اليمن",
                    [t("fee.paymentDate")]: user?.transaction_date,
                };
            });

            const reportTitle = countryFilter === "all" 
                ? (isArabic ? "كشف المعاملات المالية العام" : "General Financial Transactions")
                : countryFilter === "YEMEN"
                ? (isArabic ? "كشف المعاملات المالي - داخل اليمن" : "Financial Report - Inside Yemen")
                : (isArabic ? "كشف المعاملات المالي - خارج اليمن" : "Financial Report - Outside Yemen");

            ExportExcelAndPDF({
                exportData,
                isArabic,
                reportTitle,
                type
            });
        } catch (err) {
            logger.error("Export error:", err);
        }
    };

    const addNavigate = () => {
        const typeId = searchParams.get("transaction_type_id");
        if (typeId) {
            navigate(`add?transaction_type_id=${typeId}`);
        } else {
            navigate('add');
        }
    };

    const handleDetailsClick = (selectedRow) => {
        if (!update) return notify(t("no_permission.title"), "error");
        navigate(`details/${selectedRow?.id}`, { state: selectedRow });
    };

    let pageLimit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 10;
    const totalPages = Math.ceil(total / pageLimit) || 1;

    const handleUserChange = (event, newValue) => {
        setSelectedUser(newValue);
        if (newValue?.id) {
            searchParams.set("user_id", newValue.id);
        } else {
            searchParams.delete("user_id");
        }
        searchParams.set("page", "1");
        setSearchParams(searchParams);
    };

    const handleDateChange = (e) => {
        const val = e.target.value;
        setSelectedDate(val);
        if (val) {
            searchParams.set("transaction_date", val);
        } else {
            searchParams.delete("transaction_date");
            searchParams.delete("date");
        }
        searchParams.set("page", "1");
        setSearchParams(searchParams);
    };

    const handleClearUserAndDate = () => {
        setSelectedUser(null);
        setSelectedDate("");
        searchParams.delete("user_id");
        searchParams.delete("transaction_date");
        searchParams.delete("date");
        searchParams.set("page", "1");
        setSearchParams(searchParams);
    };

    const onFilterChange = async (filterOBJ) => {
        if (filterOBJ.search) searchParams.set("search", filterOBJ.search);
        else searchParams.delete("search");

        if (filterOBJ.hasOwnProperty("payment_method_type") && filterOBJ.payment_method_type !== "0") {
            searchParams.set("payment_method_type", filterOBJ.payment_method_type);
        } else {
            searchParams.delete("payment_method_type");
        }

        if (filterOBJ.hasOwnProperty("operation_type") && filterOBJ.operation_type !== "0") {
            searchParams.set("operation_type", filterOBJ.operation_type);
        } else {
            searchParams.delete("operation_type");
        }

        if (filterOBJ.hasOwnProperty("approval_status") && filterOBJ.approval_status !== "0") {
            searchParams.set("approval_status", filterOBJ.approval_status);
        } else {
            searchParams.delete("approval_status");
        }

        if (filterOBJ.user_id) searchParams.set("user_id", filterOBJ.user_id);
        else searchParams.delete("user_id");

        if (filterOBJ.transaction_date) searchParams.set("transaction_date", filterOBJ.transaction_date);
        else {
            searchParams.delete("transaction_date");
            searchParams.delete("date");
        }

        if (filterOBJ.is_inside_yemen && filterOBJ.is_inside_yemen !== "0") {
            searchParams.set("is_inside_yemen", filterOBJ.is_inside_yemen);
        } else {
            searchParams.delete("is_inside_yemen");
        }

        if (Object.keys(filterOBJ).length === 0) {
            setSelectedUser(null);
            setSelectedDate("");
            searchParams.delete("user_id");
            searchParams.delete("transaction_date");
            searchParams.delete("date");
            searchParams.delete("is_inside_yemen");
        }

        setSearchParams(searchParams);
    };

    if (!view) return <NoPermissionPage />;

    let translateText = isArabic ? "معاملة مالية" : "Transaction";

    if (transactionLoading) return <LoadingPage />;

    return (
        <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
            <Grid container spacing={3}>
                <Grid item sm={12} md={12} sx={{ overflowX: "auto" }}>
                    
                    <Header
                        title={t("Dashboard.transactions")}
                        subtitle={t("Dashboard.transactions")}
                        i18n={i18n}
                        haveBtn={create}
                        btn={t("addItem", { item: translateText })}
                        btnIcon={<ControlPointIcon sx={{ [isArabic ? "mr" : "ml"]: 1 }} />}
                        onSubmit={addNavigate}
                        isExcel
                        isPdf
                        isPrinter
                        onExcel={() => fetchAndExport("excel")}
                        onPdf={() => fetchAndExport("pdf")}
                        onPrinter={() => fetchAndExport("print")}
                    />

                    <DashboardFilterComponent
                        placeholder={t("Dashboard.searchWith", { search: t("fee.transactionSerial") })}
                        textSearchField={"search"}
                        userKey={"user_id"}
                        userOptions={userOptions}
                        userLabel={isArabic ? "فلترة حسب المستخدم" : "Filter by User"}
                        dateKey={"transaction_date"}
                        dateLabel={isArabic ? "تاريخ المعاملة" : "Transaction Date"}
                        scopeKey={"is_inside_yemen"}
                        scopeLabel={isArabic ? "النطاق الجغرافي" : "Scope"}
                        onFilterChange={onFilterChange}
                        t={t}
                    />

                    <TableComponent
                        columns={columns}
                        data={getTransactionsToShow}
                        loading={transactionLoading}
                        arPopulateKey={"fullname"}
                        enPopulateKey={"fullname"}
                        sx={{
                            flex: 1,
                            overflow: "auto",
                            boxShadow: 1,
                            borderRadius: 1,
                            width: "100%",
                        }}
                        handleDetailsClick={handleDetailsClick}
                        showStatusChange={false}
                        hasLogsBtn={true}
                        handleLogsClick={(row) => {
                            navigate(`logs/${row.id}`);
                        }}
                    />

                    <FilterComponent totalPages={totalPages} />
                </Grid>
            </Grid>
        </Box>
    );
}