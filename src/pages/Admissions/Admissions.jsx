import React, { useState } from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import AdmissionsHero from "../../components/AdmissionsComponents/AdmissionsHero";
import TermsConditions from "../../components/AdmissionsComponents/TermsConditions";

const Admissions = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isArabic = i18n.language === "ar";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [acceptTerms,setAcceptTerms] = useState(false);

  // if (loading) return <LoadingComponent />;

  return (
    <Box>
      <AdmissionsHero />
      {!acceptTerms &&<TermsConditions setAcceptTerms={setAcceptTerms}/>}
    </Box>
  );
};

export default Admissions;
