import React from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import LoadingComponent from "../../components/LoadingComponent";
import { useDispatch } from "react-redux";
import HomeHero from "../../components/HomeComponants/HomeHero";
import News from "../../components/HomeComponants/News";
import ActivitiesPrograms from "../../components/HomeComponants/ActivitiesPrograms";
import FutureVision from "../../components/HomeComponants/FutureVision";
import { useQuery } from "@apollo/client/react";
import { GetWebsiteArticles ,ArticalesById} from "../../graphql/articleQueries.js";
import { GetWebsiteDepartments, getDepartmentByFatherId } from "../../graphql/departmentsQueries.js";

const Home = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isArabic = i18n.language === "ar";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  const { data: HomeSliderData, loading: HomeSliderLoading, error: HomeSliderError } = useQuery(ArticalesById, {
    variables: { departmentId: "68ef9373023da961743a05ca" },
    fetchPolicy: "network-only",
  });
  const { data: newsArticalesData, loading: newsArticalesLoading, error: newsArticalesError } = useQuery(ArticalesById, {
    variables: { departmentId: "68ef93c7023da961743a05cc" },
    fetchPolicy: "network-only",
  });
  const { data: visionArticalesData, loading: visionArticalesLoading, error: visionArticalesError } = useQuery(ArticalesById, {
    variables: { departmentId: "68f09521023da961743a06a8" },
    fetchPolicy: "network-only",
  });
  const { data: getDepartmentByFatherIdData, loading: getDepartmentByFatherIdLoading, error: getDepartmentByFatherIdError } = useQuery(getDepartmentByFatherId, {
    variables: { father_id: "68efa348023da961743a0610" },
    fetchPolicy: "network-only",
  });

  
  const loading = HomeSliderLoading || newsArticalesLoading || visionArticalesLoading || getDepartmentByFatherIdLoading;
  if (loading) return <LoadingComponent />;

  return (
    <Box sx={{ backgroundColor: theme.palette.background.secDefault}}>
      <HomeHero HomeSliderData={HomeSliderData?.getArticlesByDepartment} />
      <News news={newsArticalesData?.getArticlesByDepartment}/>
      <ActivitiesPrograms Activities={getDepartmentByFatherIdData?.getDepartmentsByFather} />
      <FutureVision visionArticalesData={visionArticalesData?.getArticlesByDepartment} />
    </Box>
  );
};

export default Home;
