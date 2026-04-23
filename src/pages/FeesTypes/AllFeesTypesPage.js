import { useTheme } from "@emotion/react";
import { Box, CircularProgress, Grid, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import LoadingPage from "../../components/LoadingComponent";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import DashboardFilterComponent from "../../components/Utilities/DashboardFilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import Header from "../../components/PageHeader/header";
import { useEffect } from "react";
import notify from "../../components/notify";
import { GET_ALL_FEES_TYPES, UPDATE_ONE_FEE_BY_ID, GET_ALL_FEES_TYPES_FILTERED } from "../../graphql/feeTypesQueries";
import FilterComponent from "../../components/TableComponent/FilterComponent";
import { TrueOrFalseArr } from "../../constants";
import ExportExcelAndPDF from "../../components/Utilities/ExportExcelAndPDF";
import NoPermissionPage from "../../components/NoPermissionPage";
import usePermissionsByModule from "../../hooks/getPermissionsByScreen";
import logger from "../../utils/logger";

export default function AllFeesTypesPage() {
    const theme = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [searchParams, setSearchParams] = useSearchParams();
const { view, create, update, delete: canDelete } = usePermissionsByModule("feesTypes");

    const isArabic = i18n.language === "ar";

    // getFeesTypes with filter
    const [GetFeesTypes, {
        data: {
            getFeesTypesFiltered: {
                total = 0,
                feesTypes: getFeesTypes = []
            } = {}
        }
        = {},
        loading: gettingFees
    }] = useLazyQuery(GET_ALL_FEES_TYPES_FILTERED, { fetchPolicy: "network-only" });

    // get all feesTypes
    const { data } = useQuery(GET_ALL_FEES_TYPES, { fetchPolicy: "network-only" });

    const [UpdateFeesType, {
        loading: updatingStatus
    }] = useMutation(UPDATE_ONE_FEE_BY_ID, { fetchPolicy: "network-only" });

    useEffect(() => {
        let page;
        let limit;
        if (!searchParams.get("page")) {
            page = 1;
        }
        else {
            page = Number(searchParams.get("page"));
        }
        if (!searchParams.get("limit")) {
            limit = 10;
        }
        else {
            limit = Number(searchParams.get("limit"));
        }

        let searchText = "";

        if (searchParams.get("search")) {
            searchText = searchParams.get("search");
        }

        let variablesObj = {};
        if (page) variablesObj.page = page;
        if (limit) variablesObj.limit = limit;
        if (searchText) variablesObj.search = searchText;
        if (searchParams.get("status") && searchParams.get("status") !== "0") variablesObj.status = searchParams.get("status") === "true" ? true : false;

        GetFeesTypes({ variables: variablesObj });

    }, [searchParams]);



    let columns = [
        { key: "serial", label: t("Serial") },
        { key: "title_ar", label: t("Dashboard.NameInArabic") },
        { key: "title_en", label: t("Dashboard.NameInEnglish") },
        { key: "inside_yemen_value", label: t("Dashboard.inside_yemen") },
        { key: "outside_yemen_value", label: t("Dashboard.outside_yemen") },
        { key: "status", label: t("Status") }
    ];

    const fetchAndExport = async (type) => {
        try {
            const exportData = data?.getFeesTypes?.map((user) => ({
                [t("Dashboard.NameInArabic")]: user?.title_ar,
                [t("Dashboard.NameInEnglish")]: user?.title_en,
                [t("Dashboard.inside_yemen")]: user?.inside_yemen_value,
                [t("Dashboard.outside_yemen")]: user?.outside_yemen_value,
                [t("Status")]: t(user.status),
            }));

            ExportExcelAndPDF({
                exportData,
                isArabic,
                reportTitle: isArabic ? "قائمة انواع الرسوم" : "Fees Types List",
                type
            });

        } catch (err) {
            logger.error("Export error:", err);
        }
    };

    const addNavigate = () => navigate('add');

    const handleDetailsClick = (selectedRow) => {
      if(!update) return notify(t("no_permission.title"),"error");
        navigate(`details/${selectedRow?.id}`, {
            state: selectedRow
        });
    }

    const onStatusChange = async (selectedRow, newStatus) => {
        try {
            logger.log("selectedRow", selectedRow, newStatus);
            // return;
            let data = {
                status: newStatus == "inActive" ? false : true,
                title_ar: selectedRow?.title_ar,
                title_en: selectedRow?.title_en,
                inside_yemen_value: selectedRow?.inside_yemen_value,
                outside_yemen_value: selectedRow?.outside_yemen_value
            }
            const result = await UpdateFeesType({
                variables: {
                    id: selectedRow?.id,
                    input: data
                }
            });

            logger.log("reeesult", result);

            notify(t("success"), "success");

        } catch (error) {
            notify(t("error"), "error");
        }
    }

    // logger.log("faculties", faculties);

    const onFilterChange = (filterOBJ) => {
        logger.log("filterOBJ", filterOBJ);
        if (filterOBJ.search) searchParams.set("search", filterOBJ.search);
        if (filterOBJ.hasOwnProperty("status") && filterOBJ.status !== "0") searchParams.set("status", filterOBJ.status);

        setSearchParams(searchParams);
    }


    let pageLimit;
    if (!searchParams.get("limit")) {
        pageLimit = 10;
    }
    else {
        pageLimit = Number(searchParams.get("limit"));
    }

    logger.log("pageLimit", pageLimit);

    const totalPages = parseInt(total / pageLimit) + 1;

    if (!view) return <NoPermissionPage />;


    let translateText = isArabic ? "رسوم" : "fee type";
    let searchText = isArabic ? "ب اسم الرسوم" : "Fee Types Title";

    logger.log("getFeesTypes", getFeesTypes);

    if (gettingFees) return <LoadingPage />
    return (
        <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
            {
                updatingStatus && <CircularProgress
                    size={26}
                    thickness={8}
                    sx={{ color: "black" }}
                />
            }

            <Grid container spacing={3}>
                <Grid item
                    sm={12} md={12}
                    sx={{
                        overflowX: "auto", // ✅ مهم جدًا عشان الجدول يعمل scroll داخل الـ Grid
                    }}
                >
                    <Header
                        title={t("Dashboard.feesTypes")}
                        subtitle={t("Dashboard.feesTypes")}
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
                        placeholder={t("Dashboard.searchWith", { search: searchText })}
                        textSearchField={"search"}
                        statusKey={"status"}
                        select1Label={"Status"}
                        TrueOrFalseArr={TrueOrFalseArr}
                        select2Label={"Dashboard.transactionType"}
                        // selectKey={"operation_type"}
                        // selectOptions={transactionTypesArr}
                        onFilterChange={onFilterChange}
                        t={t}
                    />


                    <TableComponent
                        columns={columns}
                        data={getFeesTypes}
                        statusKey={"status"}
                        // onViewDetails={(r) => navigate(`/userDetails/${r.id}`)}
                        loading={gettingFees}
                        // isUsers={true}
                        // statusKey="status"
                        sx={{
                            flex: 1,
                            overflow: "auto",
                            boxShadow: 1,
                            borderRadius: 1,
                            width: "100%",
                        }}
                        handleDetailsClick={handleDetailsClick}
                        onStatusChange={onStatusChange}
                    />

                    <FilterComponent totalPages={totalPages} />
                </Grid>
            </Grid>
        </Box>
    )
}
