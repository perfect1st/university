import LoadingPage from "../../components/LoadingComponent";
import { useTheme } from "@emotion/react";
import { Box, Chip, CircularProgress, Grid, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import DashboardFilterComponent from "../../components/Utilities/DashboardFilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import Header from "../../components/PageHeader/header";
import { GET_ALL_FILTERED_REGISTER_FORMS, APPROVE_REGISTER_FORM, REJECT_REGISTER_FORM, DELETE_REGISTER_FORM } from "../../graphql/registerationFormQueries";
import formatDateToString from "../../components/Utilities/FormatDateToString";
import { useEffect, useState } from "react";
import notify from "../../components/notify";
import FilterComponent from "../../components/TableComponent/FilterComponent";

import ExportExcelAndPDF from "../../components/Utilities/ExportExcelAndPDF";
import NoPermissionPage from "../../components/NoPermissionPage";
import usePermissionsByModule from "../../hooks/getPermissionsByScreen";

export default function AllRegisterFormsPage() {
    const theme = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [searchParams, setSearchParams] = useSearchParams();
    const { view, create, update, delete: canDelete } = usePermissionsByModule("registerForms");

    const isArabic = i18n.language === "ar";

    const registerFormStatusArr = [
        { id: "pending", arKey: "قيد الانتظار", enKey: "Pending", color: theme.palette.warning.main, borderColor: theme.palette.warning.light },
        { id: "accepted", arKey: "مقبول", enKey: "Accepted", color: theme.palette.success.main, borderColor: theme.palette.success.light },
        { id: "rejected", arKey: "مرفوض", enKey: "Rejected", color: theme.palette.error.main, borderColor: theme.palette.error.light },
    ];

    // filtered register forms
    const [
        FilteredPagedRegisterForms,
        {
            data: {
                filteredPagedRegisterForms: {
                    registerForms: getRegisterForms,
                    total,
                } = {
                    registerForms: [],
                    total: 0,
                },
            } = {},
            loading: pageLoading,
        },
    ] = useLazyQuery(GET_ALL_FILTERED_REGISTER_FORMS, {
        fetchPolicy: "network-only",
    });

    const [DeleteRegisterForm] = useMutation(DELETE_REGISTER_FORM, {
        refetchQueries: [{ query: GET_ALL_FILTERED_REGISTER_FORMS }],
        onCompleted: () => {
            notify(t("success"), "success");
        },
        onError: (err) => {
            notify(err.message || t("error"), "error");
        }
    });

    const [ApproveRegisterForm] = useMutation(APPROVE_REGISTER_FORM, {
        onCompleted: (data) => {
            if (data?.approveRegisterForm?.success) {
                notify(t("success"), "success");
                FilteredPagedRegisterForms({
                    variables: {
                        page: Number(searchParams.get("page")) || 1,
                        limit: Number(searchParams.get("limit")) || 10,
                        search: searchParams.get("search") || "",
                        status: (searchParams.get("status") && searchParams.get("status") !== "0") ? searchParams.get("status") : undefined
                    }
                });
            } else {
                notify(data?.approveRegisterForm?.message || t("error"), "error");
            }
        },
        onError: (error) => {
            notify(error?.message || t("error"), "error");
        }
    });

    const [RejectRegisterForm] = useMutation(REJECT_REGISTER_FORM, {
        onCompleted: (data) => {
            if (data?.rejectRegisterForm?.success) {
                notify(t("success"), "success");
                FilteredPagedRegisterForms({
                    variables: {
                        page: Number(searchParams.get("page")) || 1,
                        limit: Number(searchParams.get("limit")) || 10,
                        search: searchParams.get("search") || "",
                        status: (searchParams.get("status") && searchParams.get("status") !== "0") ? searchParams.get("status") : undefined
                    }
                });
            } else {
                notify(data?.rejectRegisterForm?.message || t("error"), "error");
            }
        },
        onError: (error) => {
            notify(error?.message || t("error"), "error");
        }
    });

    useEffect(() => {
        let page;
        let limit;
        if (!searchParams.get("page")) {
            page = 1;
        } else {
            page = Number(searchParams.get("page"));
        }
        if (!searchParams.get("limit")) {
            limit = 10;
        } else {
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
        if (searchParams.get("status") && searchParams.get("status") !== "0")
            variablesObj.status = searchParams.get("status");

        FilteredPagedRegisterForms({ variables: variablesObj });
    }, [searchParams]);

    let columns = [
        { key: "fullName", label: t("Full Name") },
        { key: "email", label: t("Email") },
        { key: "mobile", label: t("Mobile") },
        { key: "faculty", label: t("Dashboard.faculty") },
        { key: "department", label: t("Dashboard.facultyDepartment") },
        // { key: "gender", label: t("admissions.gender") },
        { key: "createDate", label: t("Dashboard.createdAt") },
        { key: "statusDisplay", label: t("Status") },
    ];

    let registerFormsToShow = getRegisterForms?.map((el) => {
        const timestamp = Number(el?.createdAt);
        const date = new Date(timestamp);

        return {
            ...el,
            fullName: `${el?.first_name || ""} ${el?.second_name || ""} ${el?.third_name || ""} ${el?.fourth_name || ""}`.trim(),
            faculty: isArabic ? el?.faculty_id?.title_ar : el?.faculty_id?.title_en,
            department: isArabic ? el?.faculty_department_id?.title_ar : el?.faculty_department_id?.title_en,
            gender: el?.gender,
            createDate: formatDateToString(date),
            statusDisplay: (
                <Chip
                    label={t(`registerForms.status.${el?.status || "pending"}`)}
                    color={
                        el?.status === "accepted" ? "success"
                        : el?.status === "rejected" ? "error"
                        : "warning"
                    }
                    variant="filled"
                    sx={{
                        fontWeight: "bold",
                        minWidth: 100,
                        borderRadius: 2,
                        py: 2,
                        "& .MuiChip-label": {
                            width: "100%",
                            textAlign: "center",
                        },
                    }}
                />
            ),
        };
    });

    const fetchAndExport = async (type) => {
        try {
            const exportData = getRegisterForms?.map((el, i) => {
                const timestamp = Number(el?.createdAt);
                const date = new Date(timestamp);
                return {
                    "#": i + 1,
                    [t("Full Name")]: `${el?.first_name || ""} ${el?.second_name || ""} ${el?.third_name || ""} ${el?.fourth_name || ""}`.trim(),
                    [t("Email")]: el?.email,
                    [t("Mobile")]: el?.mobile,
                    [t("Dashboard.faculty")]: isArabic ? el?.faculty_id?.title_ar : el?.faculty_id?.title_en,
                    [t("Dashboard.facultyDepartment")]: isArabic ? el?.faculty_department_id?.title_ar : el?.faculty_department_id?.title_en,
                    [t("admissions.gender")]: el?.gender ? t(`admissions.${el?.gender}`) : "",
                    [t("Dashboard.createdAt")]: formatDateToString(date),
                    [t("Status")]: t(`registerForms.status.${el?.status || "pending"}`),
                };
            });

            ExportExcelAndPDF({
                exportData,
                isArabic,
                reportTitle: isArabic ? "قائمة استمارات التسجيل" : "Register Forms List",
                type,
            });
        } catch (err) {
            console.error("Export error:", err);
        }
    };

    const handleEditClick = (selectedRow) => {
        if (!update) return notify(t("no_permission.title"), "error");
        // Remove statusDisplay which is a JSX element to avoid DataCloneError
        const { statusDisplay, ...cleanRow } = selectedRow;
        navigate(`details/${selectedRow?.id}`, { state: cleanRow });
    };

    const handleDeleteClick = async (selectedRow) => {
        if (!canDelete) return notify(t("no_permission.title"), "error");
        
        if (window.confirm(t("Dashboard.confirm") || "Are you sure?")) {
            try {
                await DeleteRegisterForm({
                    variables: { id: selectedRow.id }
                });
            } catch (error) {
                console.error("Delete error:", error);
            }
        }
    };

    const handleDetailsClick = (selectedRow) => {
        // Remove statusDisplay which is a JSX element to avoid DataCloneError
        const { statusDisplay, ...cleanRow } = selectedRow;
        navigate(`details/${selectedRow?.id}`, { state: cleanRow });
    };

    const onStatusChange = async (selectedRow, newStatus) => {
        try {
            if (newStatus === "accepted") {
                await ApproveRegisterForm({
                    variables: {
                        id: selectedRow.id
                    }
                });
            } else if (newStatus === "rejected") {
                await RejectRegisterForm({
                    variables: {
                        id: selectedRow.id
                    }
                });
            }
        } catch (error) {
            console.error("Status change error:", error);
        }
    };

    const onFilterChange = async (filterOBJ) => {
        if (filterOBJ.search) searchParams.set("search", filterOBJ.search);
        if (filterOBJ.hasOwnProperty("status") && filterOBJ.status !== "0")
            searchParams.set("status", filterOBJ.status);
        setSearchParams(searchParams);
    };

    let pageLimit;
    if (!searchParams.get("limit")) {
        pageLimit = 10;
    } else {
        pageLimit = Number(searchParams.get("limit"));
    }

    const totalPages = Math.ceil(total / pageLimit) || 1;

    if (!view) return <NoPermissionPage />;

    let translateText = isArabic ? "استمارة تسجيل" : "Register Form";

    if (pageLoading) return <LoadingPage />;

    return (
        <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
            <Grid container spacing={3}>
                <Grid
                    item
                    sm={12}
                    md={12}
                    sx={{
                        overflowX: "auto",
                    }}
                >
                    <Header
                        title={t("registerForms.title")}
                        subtitle={t("registerForms.title")}
                        i18n={i18n}
                        haveBtn={false}
                        isExcel
                        isPdf
                        isPrinter
                        onExcel={() => fetchAndExport("excel")}
                        onPdf={() => fetchAndExport("pdf")}
                        onPrinter={() => fetchAndExport("print")}
                    />

                    <DashboardFilterComponent
                        placeholder={t("registerForms.searchPlaceholder")}
                        textSearchField={"search"}
                        selectKey={"status"}
                        selectOptions={registerFormStatusArr}
                        arKey={"arKey"}
                        enKey={"enKey"}
                        select2Label={"Status"}
                        onFilterChange={onFilterChange}
                        t={t}
                        isAdmin={true}
                    />

                    <TableComponent
                        columns={columns}
                        data={registerFormsToShow}
                        loading={pageLoading}
                        dontShowActions={false}
                        sx={{
                            flex: 1,
                            overflow: "auto",
                            boxShadow: 1,
                            borderRadius: 1,
                            width: "100%",
                        }}
                        handleDetailsClick={handleDetailsClick}
                        onStatusChange={onStatusChange}
                        statusOptions={registerFormStatusArr.filter(opt => opt.id !== "pending")}
                        showStatusChange={true}
                        hasEditBtn={false}
                        handleEditClick={handleEditClick}
                        hasDeleteBtn={canDelete}
                        handleDeleteClick={handleDeleteClick}
                        isInDetails={false}
                    />

                    <FilterComponent totalPages={totalPages} />
                </Grid>
            </Grid>
        </Box>
    );
}
