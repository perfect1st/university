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
import { GetWebsiteArticles , HomeSlider, newsArticales} from "../../graphql/queries/articleQueries.js";
import { GetWebsiteDepartments, getDepartmentByFatherId } from "../../graphql/queries/departmentsQueries.js";

const Home = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isArabic = i18n.language === "ar";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { data: articlesData, loading: articlesLoading, error: articlesError } = useQuery(GetWebsiteArticles, {
    fetchPolicy: "network-only",
  });
  
  const { data: departmentsData, loading: departmentsLoading, error: departmentsError } = useQuery(GetWebsiteDepartments, {
    fetchPolicy: "network-only",
  });

  const { data: HomeSliderData, loading: HomeSliderLoading, error: HomeSliderError } = useQuery(HomeSlider, {
    variables: { departmentId: "68ef9373023da961743a05ca" },
    fetchPolicy: "network-only",
  });
  const { data: newsArticalesData, loading: newsArticalesLoading, error: newsArticalesError } = useQuery(newsArticales, {
    variables: { departmentId: "68ef93c7023da961743a05cc" },
    fetchPolicy: "network-only",
  });
  const { data: getDepartmentByFatherIdData, loading: getDepartmentByFatherIdLoading, error: getDepartmentByFatherIdError } = useQuery(getDepartmentByFatherId, {
    variables: { father_id: "68efa348023da961743a0610" },
    fetchPolicy: "network-only",
  });

  

  // console.log("GetWebsiteArticles",articlesData)
  // console.log("HomeSliderData",HomeSliderData)
  // console.log("departmentsData",departmentsData)
  console.log("getDepartmentByFatherIdData",getDepartmentByFatherIdData)
  console.log("newsArticalesData",newsArticalesData)

  // if (loading) return <LoadingComponent />;

  return (
    <Box sx={{ backgroundColor: theme.palette.background.secDefault}}>
      <HomeHero HomeSliderData={HomeSliderData?.getArticlesByDepartment} />
      <News news={newsArticalesData?.getArticlesByDepartment}/>
      <ActivitiesPrograms Activities={getDepartmentByFatherIdData?.getDepartmentsByFather} />
      <FutureVision />
    </Box>
  );
};

export default Home;
