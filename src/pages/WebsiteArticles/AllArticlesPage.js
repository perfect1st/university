import LoadingPage from "../../components/LoadingComponent";
import { useTheme } from "@emotion/react";
import { Box, CircularProgress, Grid, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import i18n from "../../i18n/i18n";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import DashboardFilterComponent from "../../components/Utilities/DashboardFilterComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import Header from "../../components/PageHeader/header";
import notify from "../../components/notify";

import { GetWebsiteArticles, UPDATE_WEBSITE_ARTICLE_BY_ID } from "../../graphql/articleQueries";
import usePermissionsByModule from "../../hooks/getPermissionsByScreen";
import NoPermissionPage from "../../components/NoPermissionPage";

export default function AllArticlesPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [searchParams, setSearchParams] = useSearchParams();
  const isArabic = i18n.language === "ar";
  const { view, create, update, delete: canDelete } = usePermissionsByModule("websiteArticles");

  const {
    data: { getWebsiteArticles } = {},
    loading: getArticlesLoading
  } = useQuery(GetWebsiteArticles, { fetchPolicy: "network-only" });

  const [UpdateWebsiteArticle, {
    loading: updatingStatus
  }] = useMutation(UPDATE_WEBSITE_ARTICLE_BY_ID, { fetchPolicy: "network-only" });

  let columns = [
    { key: "serial", label: t("Serial") },
    { key: "title_ar", label: t("Dashboard.NameInArabic") },
    { key: "title_en", label: t("Dashboard.NameInEnglish") },
    { key: "users_id", label: t("Users") },
    { key: "status", label: t("Status") }
  ];

  const fetchAndExport = async (type) => {
    try {
      const exportData = getWebsiteArticles?.map((user) => ({
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
    if (!update) return notify(t("no_permission.title"), "error");
    let row = getWebsiteArticles?.find(el => el?.id == selectedRow?.id);

    navigate(`details/${selectedRow?.id}`, {
      state: row
    });
  }

  const onStatusChange = async (selectedRow, newStatus) => {
    try {
      // console.log("selectedRow", selectedRow, newStatus);
      // let row=getTransactionTypes?.find(el=>el?.id==selectedRow?.id);

      // // return;
      let data = {
        status: newStatus == "inActive" ? "draft" : "published",
        title_ar: selectedRow?.title_ar,
        title_en: selectedRow?.title_en,
        desc_ar: selectedRow?.desc_ar,
        desc_en: selectedRow?.desc_en,
        article_date: selectedRow?.article_date,
        website_department_id: selectedRow?.website_department_id,
        users_id: selectedRow?.users_id?.id
        //   operation_type:row?.operation_type
      }
      const result = await UpdateWebsiteArticle({
        variables: {
          id: selectedRow?.id,
          input: data
        }
      });

      console.log("reeesult", result);

      notify(t("success"), "success");

    } catch (error) {
      notify(t("error"), "error");
    }
  }

  console.log("GetWebsiteArticles", getWebsiteArticles);

  const getWebsiteArticlesToShow = getWebsiteArticles?.map(el => {
    return {
      ...el,
      status: el?.status == "published" ? true : false
    }
  })

  



  if (!view) return <NoPermissionPage />;

  let translateText = isArabic ? "مقالة" : "Website Article";

  if (getArticlesLoading) return <LoadingPage />;
  return (
    <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
      <Grid container spacing={3}>
        <Grid item
          sm={12} md={12}
          sx={{
            overflowX: "auto", // ✅ مهم جدًا عشان الجدول يعمل scroll داخل الـ Grid
          }}
        >
          {
            updatingStatus && <CircularProgress
              size={26}
              thickness={8}
              sx={{ color: "black" }}
            />
          }

          <Header
            title={t("Dashboard.ArticleDepartment")}
            subtitle={t("Dashboard.ArticleDepartment")}
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

          <DashboardFilterComponent t={t} />

          <TableComponent
            columns={columns}
            hasNavigateBtn={true}
            data={getWebsiteArticlesToShow}
            // onViewDetails={(r) => navigate(`/userDetails/${r.id}`)}
            loading={getArticlesLoading}
            // isUsers={true}
            statusKey="status"
            sx={{
              flex: 1,
              overflow: "auto",
              boxShadow: 1,
              borderRadius: 1,
              width: "100%",
            }}
            handleDetailsClick={handleDetailsClick}
            onStatusChange={onStatusChange}
            arPopulateKey={"fullname"}
            enPopulateKey={"fullname"}
          />

        </Grid>
      </Grid>
    </Box>
  )
}
