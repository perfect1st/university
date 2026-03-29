import { useTheme } from "@emotion/react";
import { Box, Grid, Typography, Breadcrumbs, Link, Container, Paper, Stack, IconButton, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import LoadingPage from "../../components/LoadingComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import Header from "../../components/PageHeader/header";
import FilterComponent from "../../components/TableComponent/FilterComponent";
import { GET_PAYMENT_LOGS_BY_TRANSACTION } from "../../graphql/transactionQueries";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HistoryIcon from '@mui/icons-material/History';

export default function TransactionLogsPage() {
    const theme = useTheme();
    const { t } = useTranslation();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const isArabic = i18n.language === "ar";

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const { data, loading } = useQuery(GET_PAYMENT_LOGS_BY_TRANSACTION, {
        variables: { transaction_id: id, page, limit },
        fetchPolicy: "network-only"
    });

    const { paymentLogs = [], total = 0 } = data?.getPaymentLogsByTransaction || {};

    const columns = [
        { key: "action", label: t("Action") },
        { key: "amount", label: t("Amount") },
        { key: "createdAt", label: t("Date") },
        { key: "entered_by", label: t("Entered By") },
        { key: "note", label: t("Notes") }
    ];

    const logsToShow = paymentLogs.map(log => ({
        ...log,
        createdAt: new Date(parseInt(log.createdAt)).toLocaleString(isArabic ? 'ar-EG' : 'en-US'),
        entered_by: log.entered_by?.fullname || "-"
    }));

    const totalPages = Math.ceil(total / limit) || 1;

    if (loading) return <LoadingPage />;

    return (
        <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
            <Grid container spacing={3}>
                <Grid item
                    xs={12} md={12}
                    sx={{
                        overflowX: "auto",
                    }}
                >
                    <Header
                        title={t("Transaction Logs")}
                        subtitle={`${t("transaction")}: ${id}`}
                        i18n={i18n}
                        haveBtn={false}
                    />

                    <TableComponent
                        columns={columns}
                        data={logsToShow}
                        loading={loading}
                        sx={{
                            flex: 1,
                            overflow: "auto",
                            boxShadow: 1,
                            borderRadius: 1,
                            width: "100%",
                        }}
                        showStatusChange={false}
                        hasEditBtn={false}
                        hasDeleteBtn={false}
                        dontShowActions={true}
                    />

                    <FilterComponent totalPages={totalPages} />
                </Grid>
            </Grid>
        </Box>
    );
}
