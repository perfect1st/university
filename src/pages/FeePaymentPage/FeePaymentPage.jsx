import React, { useEffect } from "react";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import FeeCard from "../../components/FeePaymentComponants/FeeCard";
import RegistrationSteps from "../../components/studentDashboard/RegistrationSteps";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import { GET_LOGGED_USER_BY_TOKEN, GET_USER_REQUIRED_FEES_BY_STUDENT_ID , PAY_USER_REQUIRED_FEES } from "../../graphql/usersQueries";
import LoadingPage from "../../components/LoadingComponent";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";


export default function FeePaymentPage() {

  const theme = useTheme();
  const { t } = useTranslation();
  const me=useSelector(state=>state.user.loggedUser);   
  const[GetUsersRequiredFeesByStudent,{data:{getUsersRequiredFeesByStudent}={},loading:getFeesLoading, error:getFeesError}]=useLazyQuery(GET_USER_REQUIRED_FEES_BY_STUDENT_ID , { fetchPolicy: "network-only" });


    
    //  const sampleFees=getUsersRequiredFeesByStudent;

     useEffect(()=>{
        if(me?.id){
          console.log('meeeee');
          GetUsersRequiredFeesByStudent({variables:{student_id:me?.id}});
        }
      },[me]);

      // const{required_fees,is_inside_yemen}=getUsersRequiredFeesByStudent;
      console.log('getUsersRequiredFeesByStudent',getUsersRequiredFeesByStudent);

      // console.log('required_fees',required_fees);
      
       if(me==null||getFeesLoading) return <LoadingPage />

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={9}>
          <Typography variant="h6" sx={{ color: theme.palette.info.main, fontWeight: 700, mb: 1 }}>
            {t("fee.feePayment")}
          </Typography>
          {getUsersRequiredFeesByStudent&& getUsersRequiredFeesByStudent?.required_fees?.map((f) => (
            <FeeCard key={f.id} data={f} is_inside_yemen={getUsersRequiredFeesByStudent?.is_inside_yemen} GetUsersRequiredFeesByStudent={GetUsersRequiredFeesByStudent} />
          ))}
        </Grid>

        <Grid item xs={12} md={3}>
          <RegistrationSteps paid={false} semester="first" />
        </Grid>
      </Grid>
    </Box>
  );
}
