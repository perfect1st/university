import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import i18n from "../../../i18n/i18n";

import ControlPointIcon from "@mui/icons-material/ControlPoint";
import DashboardFilterComponent from "../../../components/Utilities/DashboardFilterComponent";
import TableComponent from "../../../components/TableComponent/TableComponent";
import Header from "../../../components/PageHeader/header";
import FilterComponent from "../../../components/TableComponent/FilterComponent";
import LoadingPage from "../../../components/LoadingComponent";
import notify from "../../../components/notify";
import { TrueOrFalseArr } from "../../../constants";
import usePermissionsByModule from "../../../hooks/getPermissionsByScreen";

import {
  GET_PAGED_SIGNATURES,
  TOGGLE_SIGNATURE,
  DELETE_SIGNATURE,
} from "../../../graphql/signatures";

const ROLE_TITLES = [
  { id: "university_president", ar: "رئيس الجامعة", en: "University President" },
  { id: "vice_president", ar: "نائب رئيس الجامعة", en: "Vice President" },
  { id: "secretary_general", ar: "أمين عام", en: "Secretary General" },
  { id: "dean", ar: "عميد", en: "Dean" },
  { id: "vice_dean", ar: "وكيل", en: "Vice Dean" },
  { id: "registrar", ar: "أمين السجل", en: "Registrar" },
  { id: "academic_affairs", ar: "شؤون أكاديمية", en: "Academic Affairs" },
  { id: "student_affairs", ar: "شؤون الطلاب", en: "Student Affairs" },
  { id: "department_head", ar: "رئيس القسم", en: "Department Head" },
];

export default function AllSignaturesPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isArabic = i18n.language === "ar";
  
  // Using a fallback module name. It will be ignored if permissions aren't strictly enforced.
  const { view, create, update, delete: canDelete } = usePermissionsByModule("settings") || { view: true, create: true, update: true, delete: true };

  const [
    FilteredPagedSignatures,
    { data: { filteredPagedSignatures } = {}, loading: signaturesLoading, refetch },
  ] = useLazyQuery(GET_PAGED_SIGNATURES, { fetchPolicy: "network-only" });

  const [ToggleSignature, { loading: toggling }] = useMutation(
    TOGGLE_SIGNATURE,
    { fetchPolicy: "network-only" }
  );

  const [DeleteSignature] = useMutation(DELETE_SIGNATURE, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    let page = Number(searchParams.get("page")) || 1;
    let limit = Number(searchParams.get("limit")) || 10;
    let searchText = searchParams.get("search") || null;
    let role_title = searchParams.get("role_title") || null;
    let faculty_id = searchParams.get("faculty_id") || null;
    let is_active = null;

    if (searchParams.get("is_active") && searchParams.get("is_active") !== "0") {
      is_active = searchParams.get("is_active") === "true";
    }

    FilteredPagedSignatures({
      variables: {
        page,
        limit,
        search: searchText,
        role_title,
        faculty_id,
        is_active,
      },
    });
  }, [searchParams, FilteredPagedSignatures]);

  let columns = [
    { key: "serial", label: t("Serial") },
    { key: "name", label: isArabic ? "الاسم" : "Name" },
    { key: "role_title_label", label: isArabic ? "المسمى الوظيفي" : "Role Title" },
    { key: "faculty_name", label: isArabic ? "الكلية" : "Faculty" },
    { key: "signature_image", label: isArabic ? "التوقيع" : "Signature" },
    { key: "is_active", label: t("Status") },
  ];

  const addNavigate = () => navigate("add");

  const handleEditClick = (selectedRow) => {
    if (!update) return notify(t("no_permission.title"), "error");
    navigate(`details/${selectedRow?.id}`, {
      state: selectedRow,
    });
  };

  const handleDeleteClick = async (selectedRow) => {
    if (!canDelete) return notify(t("no_permission.title"), "error");
    if (window.confirm(isArabic ? "هل أنت متأكد من الحذف؟" : "Are you sure you want to delete?")) {
      try {
        await DeleteSignature({ variables: { id: selectedRow.id } });
        notify(t("success"), "success");
        refetch();
      } catch (err) {
        notify(err.message, "error");
      }
    }
  };

  const onStatusChange = async (selectedRow, newStatus) => {
    try {
      const is_active = newStatus === "inActive" ? false : true;
      await ToggleSignature({
        variables: {
          id: selectedRow?.id,
          is_active,
        },
      });
      notify(t("success"), "success");
      refetch();
    } catch (error) {
      notify(t("error"), "error");
    }
  };

  const onFilterChange = (filterOBJ) => {
    let newParams = new URLSearchParams(searchParams);

    if (filterOBJ.search) newParams.set("search", filterOBJ.search);
    else newParams.delete("search");

    if (filterOBJ.is_active && filterOBJ.is_active !== "0") newParams.set("is_active", filterOBJ.is_active);
    else newParams.delete("is_active");

    if (filterOBJ.role_title && filterOBJ.role_title !== "0") newParams.set("role_title", filterOBJ.role_title);
    else newParams.delete("role_title");

    newParams.delete("page"); 
    setSearchParams(newParams);
  };

  const signaturesToShow = filteredPagedSignatures?.signatures?.map((el) => {
    const roleObj = ROLE_TITLES.find((r) => r.id === el.role_title);
    return {
      ...el,
      role_title_label: roleObj ? (isArabic ? roleObj.ar : roleObj.en) : el.role_title,
      faculty_name: el.faculty_id ? (isArabic ? el.faculty_id.title_ar : el.faculty_id.title_en) : "-",
    };
  });

  const pageLimit = Number(searchParams.get("limit")) || 10;
  const totalItems = filteredPagedSignatures?.total || 0;
  const totalPages = Math.ceil(totalItems / pageLimit) || 1;

  if (signaturesLoading) return <LoadingPage />;

  return (
    <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ overflowX: "auto" }}>
          {toggling && (
            <CircularProgress size={26} thickness={8} sx={{ color: "black", mb: 2 }} />
          )}

          <Header
            title={isArabic ? "التوقيعات" : "Signatures"}
            subtitle={isArabic ? "التوقيعات" : "Signatures"}
            i18n={i18n}
            haveBtn={create}
            btn={isArabic ? "إضافة توقيع" : "Add Signature"}
            btnIcon={<ControlPointIcon sx={{ [isArabic ? "mr" : "ml"]: 1 }} />}
            onSubmit={addNavigate}
          />

          <DashboardFilterComponent
            placeholder={isArabic ? "البحث بالاسم" : "Search by name"}
            textSearchField={"search"}
            statusKey={"is_active"}
            TrueOrFalseArr={TrueOrFalseArr}
            selectKey={"role_title"}
            selectOptions={ROLE_TITLES}
            select2Label={isArabic ? "المسمى الوظيفي" : "Role Title"}
            arKey="ar"
            enKey="en"
            onFilterChange={onFilterChange}
            t={t}
          />

          <TableComponent
            columns={columns}
            data={signaturesToShow}
            loading={signaturesLoading}
            statusKey="is_active"
            sx={{ flex: 1, overflow: "auto", boxShadow: 1, borderRadius: 1, width: "100%" }}
            hasEditBtn={update}
            handleEditClick={handleEditClick}
            hasDeleteBtn={canDelete}
            handleDeleteClick={handleDeleteClick}
            onStatusChange={onStatusChange}
            isInDetails={true}
          />

          <FilterComponent totalPages={totalPages} />
        </Grid>
      </Grid>
    </Box>
  );
}
