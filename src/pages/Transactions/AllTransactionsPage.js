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
import { GET_ALL_TRANSACTIONS, UPDATE_TRANSACTION_BY_ID, GET_FILTERED_TRANSACTIONS } from "../../graphql/transactionQueries";
import FilterComponent from "../../components/TableComponent/FilterComponent";
import { paymentMethodsArr , transactionTypesArr } from "../../constants";

export default function AllTransactionsPage() {
    const theme = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [searchParams, setSearchParams] = useSearchParams();

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


    const [UpdateTransaction, {
        data,
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
        if(searchParams.get("payment_method_type")) variablesObj.payment_method_type=searchParams.get("payment_method_type");
        if(searchParams.get("operation_type")) variablesObj.operation_type=searchParams.get("operation_type");

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
            const exportData = transactions?.map((user) => ({
                ID: user.serial_num,
                "Full Name": user.name,
                Email: user.email,
                Mobile: user.mobile,
                "User Type": user.userType,
                Status: user.status,
            }));

            if (type === "excel") {
                const ws = XLSX.utils.json_to_sheet(exportData);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Users");
                const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
                const data = new Blob([excelBuffer], {
                    type: "application/octet-stream",
                });
                saveAs(data, `Users_${new Date().toISOString()}.xlsx`);
            } else if (type === "pdf") {
                const doc = new jsPDF();
                doc.text("Users Report", 14, 10);
                autoTable(doc, {
                    startY: 20,
                    head: [Object.keys(exportData[0] || {})],
                    body: exportData.map((row) => Object.values(row)),
                });
                doc.save(`Users_${new Date().toISOString()}.pdf`);
            } else if (type === "print") {
                const printableWindow = window.open("", "_blank");
                const htmlContent = `
                         <html>
                           <head>
                             <title>Users Report</title>
                             <style>
                               table { width: 100%; border-collapse: collapse; }
                               th, td { border: 1px solid #333; padding: 8px; text-align: left; }
                               th { background-color: #f2f2f2; }
                             </style>
                           </head>
                           <body>
                             <h2>Users Report</h2>
                             <table>
                               <thead><tr>${Object.keys(exportData[0] || {})
                        .map((k) => `<th>${k}</th>`)
                        .join("")}</tr></thead>
                               <tbody>${exportData
                        .map(
                            (row) =>
                                `<tr>${Object.values(row)
                                    .map((v) => `<td>${v}</td>`)
                                    .join("")}</tr>`
                        )
                        .join("")}</tbody>
                             </table>
                           </body>
                         </html>
                       `;
                printableWindow.document.write(htmlContent);
                printableWindow.document.close();
                printableWindow.print();
            }
        } catch (err) {
            console.error("Export error:", err);
        }
    };

    const addNavigate = () => navigate('add');

    const handleDetailsClick = (selectedRow) => {
        console.log('handleDetailsClick', selectedRow);
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

     const onFilterChange=async(filterOBJ)=>{
        console.log("filterOBJ",filterOBJ);
        if(filterOBJ.search) searchParams.set("search", filterOBJ.search);
        if(filterOBJ.hasOwnProperty("payment_method_type")&&filterOBJ.payment_method_type !== "0") searchParams.set("payment_method_type", filterOBJ.payment_method_type);
        if(filterOBJ.hasOwnProperty("operation_type")&&filterOBJ.operation_type !== "0") searchParams.set("operation_type", filterOBJ.operation_type);

          
        setSearchParams(searchParams);
    }

    const hasViewPermission = true;
    const hasAddPermission = true;

    if (!hasViewPermission) return <Navigate to="/profile" />;

    let translateText = isArabic ? "معاملة مالية" : "Transaction";




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
                        haveBtn={hasAddPermission}
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
                    />

                    <FilterComponent totalPages={totalPages} />
                </Grid>
            </Grid>
        </Box>
    )
}
