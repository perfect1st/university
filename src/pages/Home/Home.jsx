import React, { useEffect } from "react";
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
import logger from "../../utils/logger.js";
import { useLocation } from "react-router-dom";

const Home = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();
  const isArabic = i18n.language === "ar";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  

    useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.replace("#", "");
      const element = document.getElementById(elementId);
      
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [location]);
  
  const { data: HomeSliderData, loading: HomeSliderLoading, error: HomeSliderError } = useQuery(ArticalesById, {
    variables: { departmentId: "69d4c8e5d94595c71773dae4" },
    fetchPolicy: "network-only",
  });
  const { data: newsArticalesData, loading: newsArticalesLoading, error: newsArticalesError } = useQuery(ArticalesById, {
    variables: { departmentId: "69d4db61655d6500ed48a9f9" },
    fetchPolicy: "network-only",
  });
  const { data: visionArticalesData, loading: visionArticalesLoading, error: visionArticalesError } = useQuery(ArticalesById, {
    variables: { departmentId: "69d4dc15655d6500ed48aa3b" },
    fetchPolicy: "network-only",
  });
  const { data: getDepartmentByFatherIdData, loading: getDepartmentByFatherIdLoading, error: getDepartmentByFatherIdError } = useQuery(getDepartmentByFatherId, {
    variables: { father_id: "69d4defa655d6500ed48aaf4" },
    fetchPolicy: "network-only",
  });

  const news = newsArticalesData?.getArticlesByDepartment.filter((el)=>el.status == "published") || [];
  const vision = visionArticalesData?.getArticlesByDepartment.filter((el)=>el.status == "published") || [];
  const Activities = getDepartmentByFatherIdData?.getDepartmentsByFather.filter((el)=>el.status == true) || [];
  logger.log("News Articles:", news);
  logger.log("Home Slider Data:", HomeSliderData);
  logger.log("Vision Articles:", vision);
  logger.log("Activities Articles:", getDepartmentByFatherIdData);
  
  const loading = HomeSliderLoading || newsArticalesLoading || visionArticalesLoading || getDepartmentByFatherIdLoading;
  if (loading) return <LoadingComponent />;




  return (
    <Box sx={{ 
      backgroundColor: theme.palette.background.secDefault,
      maxWidth: "100vw", // يمنع تجاوز عرض الشاشة
      overflowX: "hidden", // يمنع ظهور السكرول العرضي نهائياً
      display: "flex",
      flexDirection: "column"
    }}>
      <HomeHero HomeSliderData={HomeSliderData?.getArticlesByDepartment} />
      
      {/* News Section */}
      <Box sx={{
        width: "100%",
        maxWidth: 1300,
        margin: "0 auto",
        px: { xs: 3, sm: 5, md: 8, lg: 12 },
        pt: { xs: 4, md: 8 },
        pb: { xs: 2, md: 4 }
      }}>
        <Box id="news">
          <News news={news}/>
        </Box>
      </Box>

      {/* Activities & Programs Section (Full Width with white background) */}
      <Box id="activity" sx={{ 
        width: "100%", 
        backgroundColor: "#ffffff",
        py: { xs: 4, md: 8 },
        borderTop: `1px solid ${theme.palette.divider || "#eaeaea"}`,
        borderBottom: `1px solid ${theme.palette.divider || "#eaeaea"}`
      }}>
        <Box sx={{
          width: "100%",
          maxWidth: 1300,
          margin: "0 auto",
          px: { xs: 3, sm: 5, md: 8, lg: 12 }
        }}>
          <ActivitiesPrograms Activities={Activities} /> 
        </Box>
      </Box>

      {/* Future Vision Section */}
      <Box sx={{
        width: "100%",
        maxWidth: 1300,
        margin: "0 auto",
        px: { xs: 3, sm: 5, md: 8, lg: 12 },
        pt: { xs: 2, md: 4 },
        pb: { xs: 4, md: 8 }
      }}>
        <Box id="FutureVision">
          <FutureVision visionArticalesData={vision} />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
