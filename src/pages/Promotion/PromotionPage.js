import { useTheme } from "@emotion/react";
import { Box, CircularProgress, Grid, useMediaQuery, Chip, MenuItem, IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLazyQuery, useQuery } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import LoadingPage from "../../components/LoadingComponent";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardFilterComponent from "../../components/Utilities/DashboardFilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import Header from "../../components/PageHeader/header";
import { FILTERED_PAGED_PROMOTIONS, ACTIVATE_PROMOTION, DELETE_DRAFT_PROMOTION } from "../../graphql/PromotionQueries";
import { GET_ALL_FACULITIES } from "../../graphql/facultyQuiries";
import { useMutation } from "@apollo/client/react";
import { useEffect } from "react";
import notify from "../../components/notify";
import FilterComponent from "../../components/TableComponent/FilterComponent";
import logger from "../../utils/logger";

export default function PromotionPage() {
    const theme = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [searchParams, setSearchParams] = useSearchParams();
    const isArabic = i18n.language === "ar";

    const [
        getFilteredPromotions,
        {
            data: { filteredPagedPromotions } = {},
            loading: promotionsLoading,
        }
    ] = useLazyQuery(FILTERED_PAGED_PROMOTIONS, {
        fetchPolicy: "network-only",
        onError: (err) => {
            notify(err.message, "error");
        }
    });

    const { data: facultiesData } = useQuery(GET_ALL_FACULITIES);

    const [activatePromotion, { loading: activatingLoading }] = useMutation(ACTIVATE_PROMOTION, {
        onCompleted: () => {
            notify(t("Promotion activated successfully"), "success");
            getFilteredPromotions();
        },
        onError: (err) => notify(err.message, "error")
    });

    const [deleteDraft, { loading: deletingLoading }] = useMutation(DELETE_DRAFT_PROMOTION, {
        onCompleted: () => {
            notify(t("Draft deleted successfully"), "success");
            getFilteredPromotions();
        },
        onError: (err) => notify(err.message, "error")
    });

    useEffect(() => {
        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 10;
        const promotion_type = searchParams.get("promotion_type") !== "0" ? searchParams.get("promotion_type") : null;
        const promotion_status = searchParams.get("promotion_status") !== "0" ? searchParams.get("promotion_status") : null;
        const faculty_department_id = searchParams.get("faculty_department_id") !== "0" ? searchParams.get("faculty_department_id") : null;

        getFilteredPromotions({
            variables: {
                page,
                limit,
                promotion_type,
                promotion_status,
                faculty_department_id
            }
        });
    }, [searchParams, getFilteredPromotions]);

    const typeOptions = [
        { id: "TERM_TO_TERM", title_ar: "ترقية ترم لترم", title_en: "Term to Term" },
        { id: "YEAR_TO_YEAR", title_ar: "ترقية سنة لسنة", title_en: "Year to Year" }
    ];

    const statusOptions = [
        { id: "ACTIVE", title_ar: "نشط", title_en: "Active" },
        { id: "DRAFT", title_ar: "مسودة", title_en: "Draft" }
    ];

    const columns = [
        { key: "serial", label: t("Serial") },
        { key: "display_type", label: t("type") },
        { key: "display_date", label: t("Date") },
        { key: "total_students", label: t("Total Students") },
        { key: "promoted_count", label: t("Success") },
        { key: "failed_count", label: t("Failed") },
        { key: "promotion_status", label: t("Status") },
        {
            key: "actions",
            label: t("Actions"),
            render: (row) => {
                if (row.promotion_status !== "DRAFT") return null;
                return (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                            size="small"
                            onClick={() => handleActivate(row)}
                            sx={{ color: 'primary.main', border: '1px solid', borderColor: 'primary.main' }}
                        >
                            <PlayArrowIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={() => handleDelete(row)}
                            sx={{ color: 'error.main', border: '1px solid', borderColor: 'error.main' }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Box>
                );
            }
        }
    ];

    const onFilterChange = (filterOBJ) => {
        const newParams = new URLSearchParams(searchParams);
        if (filterOBJ.promotion_type) newParams.set("promotion_type", filterOBJ.promotion_type);
        else newParams.delete("promotion_type");

        if (filterOBJ.promotion_status) newParams.set("promotion_status", filterOBJ.promotion_status);
        else newParams.delete("promotion_status");

        if (filterOBJ.faculty_department_id) newParams.set("faculty_department_id", filterOBJ.faculty_department_id);
        else newParams.delete("faculty_department_id");

        newParams.set("page", "1");
        setSearchParams(newParams);
    };

    const handleAddPromotion = () => navigate('add');

    const handleActivate = (row) => {
        activatePromotion({ variables: { id: row.id } });
    };

    const handleDelete = (row) => {
        if (window.confirm(t("Are you sure you want to delete this draft?"))) {
            deleteDraft({ variables: { id: row.id } });
        }
    };

    const handleDetailsClick = (row) => {
        // Navigate to details if needed
    };

    const pageLimit = Number(searchParams.get("limit")) || 10;
    const totalPages = Math.ceil((filteredPagedPromotions?.total || 0) / pageLimit);

    const processedData = filteredPagedPromotions?.promotions?.map(row => {
        const type = typeOptions.find(opt => opt.id === row.promotion_type);
        const dateVal = isNaN(row.promotion_date) ? row.promotion_date : parseInt(row.promotion_date);
        return {
            ...row,
            display_type: isArabic ? type?.title_ar : type?.title_en || row.promotion_type,
            display_date: row.promotion_date ? new Date(dateVal).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US') : '-',
        };
    });

    if (promotionsLoading && !filteredPagedPromotions) return <LoadingPage />;

    return (
        <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Header
                        title={t("Promotion")}
                        subtitle={t("Promotion")}
                        i18n={i18n}
                        haveBtn={true}
                        btn={t("Add Promotion")}
                        btnIcon={<ControlPointIcon sx={{ [isArabic ? "ml" : "mr"]: 1 }} />}
                        onSubmit={handleAddPromotion}
                        isExcel
                        isPdf
                        isPrinter
                    />

                    <DashboardFilterComponent
                        t={t}
                        placeholder={t("Search promotions...")}
                        isPromotion={true}
                        onFilterChange={onFilterChange}
                        textSearchField="search"
                        isAdmin={true}
                        selectKey="promotion_type"
                        selectOptions={typeOptions}
                        select2Label="Promotion Type"
                        arKey="title_ar"
                        enKey="title_en"
                        selectKey2="promotion_status"
                        selectOptions2={statusOptions}
                        select2Label2="Status"
                    />

                    <TableComponent
                        columns={columns}
                        data={processedData}
                        loading={promotionsLoading || activatingLoading || deletingLoading}
                        statusKey="promotion_status"
                        activeStatusLabel="ACTIVE"
                        inActiveStatusLabel="DRAFT"
                        handleDetailsClick={handleDetailsClick}
                        dontShowActions={true}
                        sx={{
                            flex: 1,
                            overflow: "auto",
                            boxShadow: 1,
                            borderRadius: 1,
                            width: "100%",
                            mt: 2
                        }}
                    />

                    <FilterComponent totalPages={totalPages} />
                </Grid>
            </Grid>
        </Box>
    );
}
