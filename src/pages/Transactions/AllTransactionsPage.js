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
import { useEffect, useState } from "react";
import notify from "../../components/notify";
import { GET_ALL_TRANSACTIONS, UPDATE_TRANSACTION_BY_ID, GET_FILTERED_TRANSACTIONS } from "../../graphql/transactionQueries";
import FilterComponent from "../../components/TableComponent/FilterComponent";
import { paymentMethodsArr, transactionTypesArr } from "../../constants";
import ExportExcelAndPDF from "../../components/Utilities/ExportExcelAndPDF";
import NoPermissionPage from "../../components/NoPermissionPage";
import usePermissionsByModule from "../../hooks/getPermissionsByScreen";

export default function AllTransactionsPage() {
    const theme = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [searchParams, setSearchParams] = useSearchParams();
    const { view, create, update, delete: canDelete } = usePermissionsByModule("transactions");
    
    const isArabic = i18n.language === "ar";

    const [
        GetTransactions,
        {
            data: {
                getTransactionsFiltered: {
                    transactions = [],
                    total = 0
                } = {}
            } = {},
            loading: transactionLoading
        }
    ] = useLazyQuery(GET_FILTERED_TRANSACTIONS, {
        fetchPolicy: "network-only"
    });

    const { data } = useQuery(GET_ALL_TRANSACTIONS, { fetchPolicy: "network-only" });

    const [UpdateTransaction, {

        loading: updatingStatus
    }] = useMutation(UPDATE_TRANSACTION_BY_ID, { fetchPolicy: "network-only" });

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
        if (searchParams.get("payment_method_type")) variablesObj.payment_method_type = searchParams.get("payment_method_type");
        if (searchParams.get("operation_type")) variablesObj.operation_type = searchParams.get("operation_type");
        if (searchParams.get("approval_status")) variablesObj.approval_status = searchParams.get("approval_status");

        GetTransactions({
            variables: variablesObj
        });

    }, [searchParams]);

    // console.log("trans",t("fee.method.CASH"))

    let getTransactionsToShow = transactions?.map(el => {
        return {
            ...el,
            payment_method_type: t(`fee.method.${el?.payment_method_type}`),
            amount: String(el.amount)
        }
    })

    console.log('transactions', transactions);

    let columns = [
        // { key: "ID", label: "ID" },
        { key: "transaction_serial", label: t("fee.transactionSerial") },
        { key: "payment_method_type", label: t("fee.paymentMethodsTitle") },
        { key: "amount", label: t("fee.table.amount") },
        { key: "transaction_date", label: t("fee.paymentDate") },
        { key: "user_id", label: t("Users") }

    ];

    const fetchAndExport = async (type) => {
       
        try {
            const exportData = data?.getTransactions?.map((user,i) => ({
                ID: i,
                [t("fee.transactionSerial")]: user?.transaction_serial,
                [t("fee.paymentMethodsTitle")]: t(`fee.method.${user?.payment_method_type}`),
                [t("fee.table.amount")]: user?.amount,
                [t("fee.paymentDate")]: user?.transaction_date,
                [t("Users")]: user?.user_id?.fullname,
            }));

            ExportExcelAndPDF({
                exportData,
                isArabic,
                reportTitle: isArabic ? "قائمة المعاملات المالية" : "Transactions List",
                type
            });
        } catch (err) {
            console.error("Export error:", err);
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
      if(!update) return notify(t("no_permission.title"),"error");
        navigate(`details/${selectedRow?.id}`, {
            state: selectedRow
        });
    }


    let pageLimit;
    if (!searchParams.get("limit")) {
        pageLimit = 10;
    }
    else {
        pageLimit = Number(searchParams.get("limit"));
    }

    console.log("pageLimit", pageLimit);

    const totalPages = parseInt(total / pageLimit) + 1;

    const onFilterChange = async (filterOBJ) => {
        console.log("filterOBJ", filterOBJ);
        if (filterOBJ.search) searchParams.set("search", filterOBJ.search);
        if (filterOBJ.hasOwnProperty("payment_method_type") && filterOBJ.payment_method_type !== "0") searchParams.set("payment_method_type", filterOBJ.payment_method_type);
        if (filterOBJ.hasOwnProperty("operation_type") && filterOBJ.operation_type !== "0") searchParams.set("operation_type", filterOBJ.operation_type);
        if (filterOBJ.hasOwnProperty("approval_status") && filterOBJ.approval_status !== "0") searchParams.set("approval_status", filterOBJ.approval_status);


        setSearchParams(searchParams);
    }

    if (!view) return <NoPermissionPage />;

    let translateText = isArabic ? "معاملة مالية" : "Transaction";

    console.log("transactionTypesArr", transactionTypesArr);


    if (transactionLoading) return <LoadingPage />
    return (
        <Box sx={{ p: 3, backgroundColor: "background.paper" }}>


            <Grid container spacing={3}>
                <Grid item
                    sm={12} md={12}
                    sx={{
                        overflowX: "auto", // ✅ مهم جدًا عشان الجدول يعمل scroll داخل الـ Grid
                    }}
                >
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

                        // onViewDetails={(r) => navigate(`/userDetails/${r.id}`)}
                        loading={transactionLoading}
                        // isUsers={true}
                        // statusKey="status"
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
    )
}
