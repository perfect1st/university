import React, { useEffect } from "react";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import FeeCard from "../../components/FeePaymentComponants/FeeCard";
import RegistrationSteps from "../../components/studentDashboard/RegistrationSteps";
import { useLazyQuery, useQuery } from "@apollo/client/react";
import { GET_LOGGED_USER_BY_TOKEN, GET_USER_REQUIRED_FEES_BY_STUDENT_ID } from "../../graphql/usersQueries";
import LoadingPage from "../../components/LoadingComponent";
import { useTranslation } from "react-i18next";


export default function FeePaymentPage() {

  const theme = useTheme();
    const { t } = useTranslation();
  
  // get user token
      const {
        data: {me}={},
        loading: userLoading,
        error: userError,
      } = useQuery(GET_LOGGED_USER_BY_TOKEN, { fetchPolicy: "network-only" });
    
      const[GetUsersRequiredFeesByStudent,{data:{getUsersRequiredFeesByStudent}={},loading:getFeesLoading, error:getFeesError}]=useLazyQuery(GET_USER_REQUIRED_FEES_BY_STUDENT_ID , { fetchPolicy: "network-only" });

      let sampleFees = [
  {
    id: "fee1",
    title: "First Semester Fees",
    image: "https://via.placeholder.com/66",
    academicYear: 2024,
    semesterLabel: "First Semester",
    price: "2500 SAR",
    paid: true,
    paymentDate: "22 September 2024",
    transactionSerial: "22154255",
    paidDocument: "https://via.placeholder.com/400x300.png?text=Paid+Doc",
    items: [
      { reason: "Tuition Fee", amount: "2000 SAR" },
      { reason: "Registration Fee", amount: "500 SAR" },
    ],
  },
  {
    id: "fee2",
    title: "Second Semester Fees",
    image: "https://via.placeholder.com/66",
    academicYear: 2024,
    semesterLabel: "Second Semester",
    price: "2200 SAR",
    paid: false,
    items: [
      { reason: "Tuition Fee", amount: "2000 SAR" },
      { reason: "Service Fee", amount: "200 SAR" },
    ],
  },
];

    //  const sampleFees=getUsersRequiredFeesByStudent;

     useEffect(()=>{
        if(me?.id){
          console.log('meeeee');
          GetUsersRequiredFeesByStudent({variables:{student_id:me?.id}});
        }
      },[me]);

      console.log('getUsersRequiredFeesByStudent',getUsersRequiredFeesByStudent);
      
       if(userLoading||getFeesLoading) return <LoadingPage />
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={9}>
          <Typography variant="h6" sx={{ color: theme.palette.info.main, fontWeight: 700, mb: 1 }}>
            {t("fee.feePayment")}
          </Typography>
          {getUsersRequiredFeesByStudent&& getUsersRequiredFeesByStudent?.map((f) => (
            <FeeCard key={f.id} data={f} />
          ))}
        </Grid>

        <Grid item xs={12} md={3}>
          <RegistrationSteps paid={false} semester="first" />
        </Grid>
      </Grid>
    </Box>
  );
}
