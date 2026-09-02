import LoadingPage from "../../components/LoadingComponent";
import { useTheme } from "@emotion/react";
import { Box, Chip, CircularProgress, Grid, useMediaQuery, MenuItem, alpha } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import DashboardFilterComponent from "../../components/Utilities/DashboardFilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import Header from "../../components/PageHeader/header";
import { GET_ALL_FILTERED_REGISTER_FORMS, APPROVE_REGISTER_FORM, REJECT_REGISTER_FORM, DELETE_REGISTER_FORM } from "../../graphql/registerationFormQueries";
import formatDateToString from "../../components/Utilities/FormatDateToString";
import { useEffect, useState, useMemo } from "react";
import notify from "../../components/notify";
import FilterComponent from "../../components/TableComponent/FilterComponent";
import { GET_ALL_FACULITIES, GET_ALL_DEPARTMENTS } from "../../graphql/facultyQuiries";

import ExportExcelAndPDF from "../../components/Utilities/ExportExcelAndPDF";
import NoPermissionPage from "../../components/NoPermissionPage";
import usePermissionsByModule from "../../hooks/getPermissionsByScreen";
import logger from "../../utils/logger";

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

    const { data: facultiesData, loading: facultiesLoading } = useQuery(GET_ALL_FACULITIES);
    const { data: departmentsData, loading: departmentsLoading } = useQuery(GET_ALL_DEPARTMENTS);

    logger.log("facultiesData", facultiesData);
    logger.log("departmentsData", departmentsData);
    const [selectedFacultyId, setSelectedFacultyId] = useState(searchParams.get("faculty_id") || "0");

    const filteredDepartments = useMemo(() => {
        if (!departmentsData?.facultyDepartments) return [];
        if (selectedFacultyId === "0") return departmentsData.facultyDepartments;
        return departmentsData.facultyDepartments.filter(dep => dep.faculty_id?.id === selectedFacultyId);
    }, [departmentsData, selectedFacultyId]);

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
                        status: (searchParams.get("status") && searchParams.get("status") !== "0") ? searchParams.get("status") : undefined,
                        faculty_id: (searchParams.get("faculty_id") && searchParams.get("faculty_id") !== "0") ? searchParams.get("faculty_id") : undefined,
                        faculty_department_id: (searchParams.get("faculty_department_id") && searchParams.get("faculty_department_id") !== "0") ? searchParams.get("faculty_department_id") : undefined
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
                        status: (searchParams.get("status") && searchParams.get("status") !== "0") ? searchParams.get("status") : undefined,
                        faculty_id: (searchParams.get("faculty_id") && searchParams.get("faculty_id") !== "0") ? searchParams.get("faculty_id") : undefined,
                        faculty_department_id: (searchParams.get("faculty_department_id") && searchParams.get("faculty_department_id") !== "0") ? searchParams.get("faculty_department_id") : undefined
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
        if (searchParams.get("faculty_id") && searchParams.get("faculty_id") !== "0")
            variablesObj.faculty_id = searchParams.get("faculty_id");
        if (searchParams.get("faculty_department_id") && searchParams.get("faculty_department_id") !== "0")
            variablesObj.faculty_department_id = searchParams.get("faculty_department_id");

        FilteredPagedRegisterForms({ variables: variablesObj });
    }, [searchParams]);

    let columns = [
        { key: "serial", label: t("Serial") },
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
            logger.error("Export error:", err);
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
                logger.error("Delete error:", error);
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
            logger.error("Status change error:", error);
        }
    };

    const onFilterChange = async (filterOBJ) => {
        logger.log("filterOBJ", filterOBJ);
        let newParams = new URLSearchParams(searchParams);

        if (filterOBJ.search) {
            newParams.set("search", filterOBJ.search);
        } else {
            newParams.delete("search");
        }

        if (filterOBJ.status && filterOBJ.status !== "0") {
            newParams.set("status", filterOBJ.status);
        } else {
            newParams.delete("status");
        }

        if (filterOBJ.faculty_id && filterOBJ.faculty_id !== "0") {
            newParams.set("faculty_id", filterOBJ.faculty_id);
        } else {
            newParams.delete("faculty_id");
        }

        if (filterOBJ.faculty_department_id && filterOBJ.faculty_department_id !== "0") {
            newParams.set("faculty_department_id", filterOBJ.faculty_department_id);
        } else {
            newParams.delete("faculty_department_id");
        }

        newParams.delete("page");
        setSearchParams(newParams);
    };

    let pageLimit;
    if (!searchParams.get("limit")) {
        pageLimit = 10;
    } else {
        pageLimit = Number(searchParams.get("limit"));
    }

    const totalPages = Math.ceil(total / pageLimit) || 1;
    const addRegisterFormNavigate = () => navigate('/admissions?fromAdmin=true');

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
                        haveBtn={create}
                        btn={t("addItem", { item: translateText })}
                        btnIcon={<ControlPointIcon sx={{ [isArabic ? "mr" : "ml"]: 1 }} />}
                        onSubmit={addRegisterFormNavigate}

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
                        selectKey2={"faculty_id"}
                        selectOptions2={facultiesData?.faculties || []}
                        select2Label2={"Dashboard.faculty"}
                        onSelect2Change={(val) => setSelectedFacultyId(val)}
                        selectKey3={"faculty_department_id"}
                        selectOptions3={filteredDepartments}
                        select2Label3={"Dashboard.facultyDepartment"}
                        onFilterChange={onFilterChange}
                        t={t}
                        isAdmin={true}
                        fromRegisterForm={true}
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
                        renderCustomMenuItems={(selectedRow, handleClose) => {
                            if (selectedRow?.status === "accepted" && selectedRow?.user_id?.id) {
                                return (
                                    <MenuItem
                                        onClick={() => {
                                            navigate(`/users/details/${selectedRow?.user_id?.id}`, { state: selectedRow?.user_id });
                                            handleClose();
                                        }}
                                        sx={{
                                            borderLeft: isArabic ? "" : `4px solid ${alpha(theme.palette.info.main, 0.5)}`,
                                            borderRight: isArabic ? `4px solid ${alpha(theme.palette.info.main, 0.5)}` : "",
                                            py: 1,
                                            fontWeight: 500
                                        }}
                                    >
                                        {isArabic ? "الانتقال لصفحة المستخدم" : "Go to User Page"}
                                    </MenuItem>
                                );
                            }
                            return null;
                        }}
                    />

                    <FilterComponent totalPages={totalPages} />
                </Grid>
            </Grid>
        </Box>
    );
}
