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
import { GET_ALL_FACULITIES, UPDATE_FACULITY_BY_ID, FILTERED_PAGED_FACULITIES } from "../../graphql/facultyQuiries";
import { useEffect } from "react";
import notify from "../../components/notify";
import FilterComponent from "../../components/TableComponent/FilterComponent";
import { TrueOrFalseArr } from "../../constants";
import ExportExcelAndPDF from "../../components/Utilities/ExportExcelAndPDF";
import NoPermissionPage from "../../components/NoPermissionPage";
import usePermissionsByModule from "../../hooks/getPermissionsByScreen";
import logger from "../../utils/logger";

export default function AllfaculitiesPage() {
    const theme = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [searchParams, setSearchParams] = useSearchParams();
const { view, create, update, delete: canDelete } = usePermissionsByModule("faculties");

    const isArabic = i18n.language === "ar";

    const [
        FilteredPagedFaculties,
        {
            data: { filteredPagedFaculties } = {},
            loading: faculitiesLoading,
            
        }
    ] = useLazyQuery(FILTERED_PAGED_FACULITIES, {
        fetchPolicy: "network-only"
    });

    // get all faculities
      const {
        data: {
            faculties
        }={},
        loading: allFaculitiesLoading,
        error: faculitiesError,
      } = useQuery(GET_ALL_FACULITIES, { fetchPolicy: "network-only" });

      logger.log("faculitiesData",faculties);

    const [UpdateFaculty, {
        data,
        loading: updatingStatus,
        error: updaingError
    }] = useMutation(UPDATE_FACULITY_BY_ID, { fetchPolicy: "network-only" });

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

        let searchText="";

        if(searchParams.get("search")){
            searchText=searchParams.get("search");
        }
        
        let variablesObj={};
        if(page) variablesObj.page=page;
        if(limit) variablesObj.limit=limit;
        if(searchText) variablesObj.search=searchText;
        if(searchParams.get("status")&&searchParams.get("status") !=="0") variablesObj.status= searchParams.get("status") === "true" ? true : false;
        
        FilteredPagedFaculties({ variables: variablesObj });
        
    }, [searchParams]);

    let columns = [
        { key: "serial", label: t("Serial") },
        { key: "title_ar", label: t("Dashboard.NameInArabic") },
        { key: "title_en", label: t("Dashboard.NameInEnglish") },
        { key: "study_years_count", label: t("Dashboard.yearsofstudy") },
        { key: "status", label: t("Status") }
    ];

    const fetchAndExport = async (type) => {
        try {
          
            const exportData = faculties?.map((user, i) => ({
                "#": i,
                [t("Dashboard.NameInArabic")]: user?.title_ar,
                [t("Dashboard.NameInEnglish")]: user?.title_en,
                [t("Dashboard.yearsofstudy")]: user?.study_years_count,
                [t("Status")]: t(user?.status),
            }));

            ExportExcelAndPDF({
                exportData,
                isArabic,
                reportTitle: isArabic ? "قائمة الكليات" : "Faculities List",
                type
            });
        } catch (err) {
            logger.error("Export error:", err);
        }
    };

    const addFaculityNavigate = () => navigate('add');

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
            let data={
                status:newStatus=="inActive" ? false :true
            }
            const result=await UpdateFaculty({
                variables:{
                    id:selectedRow?.id,
                    input:data
                }
            });

            logger.log("reeesult",result);

             notify(t("success"), "success");

        } catch (error) {
                notify(t("error"), "error");
        }
    }

     const onFilterChange=async(filterOBJ)=>{
        logger.log("filterOBJ",filterOBJ);
        let newParams = new URLSearchParams(searchParams);

        if(filterOBJ.search) {
            newParams.set("search", filterOBJ.search);
        } else {
            newParams.delete("search");
        }

        if( filterOBJ.hasOwnProperty("status")&&filterOBJ.status !== "0") {
            newParams.set("status", filterOBJ.status);
        } else {
            newParams.delete("status");
        }
        
        newParams.delete("page");
        setSearchParams(newParams);
    }


     let pageLimit;
    if (!searchParams.get("limit")) {
        pageLimit = 10;
    }
    else {
        pageLimit = Number(searchParams.get("limit"));
    }

    logger.log("pageLimit", pageLimit);

    const totalPages = parseInt(filteredPagedFaculties?.total / pageLimit) + 1;

    logger.log("filteredPagedFaculties", filteredPagedFaculties);

    if (!view) return <NoPermissionPage />;


    let translateText = isArabic ? "كلية" : "Faculity";

    if (faculitiesLoading) return <LoadingPage />;
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
                        title={t("faculties")}
                        subtitle={t("faculties")}
                        i18n={i18n}
                        haveBtn={create}
                        btn={t("addItem", { item: translateText })}
                        btnIcon={<ControlPointIcon sx={{ [isArabic ? "mr" : "ml"]: 1 }} />}
                        onSubmit={addFaculityNavigate}
                        isExcel
                        isPdf
                        isPrinter
                        onExcel={() => fetchAndExport("excel")}
                        onPdf={() => fetchAndExport("pdf")}
                        onPrinter={() => fetchAndExport("print")}
                    />


                    <DashboardFilterComponent
                                        placeholder={t("Dashboard.searchByFaculityName")}
                                        textSearchField={"search"}
                                        statusKey={"status"}
                                        TrueOrFalseArr={TrueOrFalseArr}
                                        onFilterChange={onFilterChange}
                                         t={t}
                                          />


                    <TableComponent
                        columns={columns}
                        hasNavigateBtn={true}
                        navigateTo={'departments'}
                        navigateBtnTitle={t("departments")}
                        data={filteredPagedFaculties?.faculties}
                        statusKey={"status"}
                        // onViewDetails={(r) => navigate(`/userDetails/${r.id}`)}
                        loading={faculitiesLoading}
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
