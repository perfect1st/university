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
  Typography 
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
import FilterComponent from "../../components/TableComponent/FilterComponent";
import { paymentMethodsArr, transactionTypesArr } from "../../constants";
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

    useEffect(() => {
        let page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
        let limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 10;
        let searchText = searchParams.get("search") || "";

        let variablesObj = { page, limit };
        if (searchText) variablesObj.search = searchText;
        if (searchParams.get("payment_method_type")) variablesObj.payment_method_type = searchParams.get("payment_method_type");
        if (searchParams.get("operation_type")) variablesObj.operation_type = searchParams.get("operation_type");
        if (searchParams.get("approval_status")) variablesObj.approval_status = searchParams.get("approval_status");

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
                        statusKey={"payment_method_type"}
                        select1Label={"fee.paymentMethodsTitle"}
                        TrueOrFalseArr={paymentMethodsArr}
                        select2Label={"Dashboard.transactionType"}
                        selectKey={"operation_type"}
                        selectOptions={transactionTypesArr}
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