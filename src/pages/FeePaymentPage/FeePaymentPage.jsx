import React from "react";
import { Box, Grid } from "@mui/material";
import FeeCard from "../../components/FeePaymentComponants/FeeCard";
import RegistrationSteps from "../../components/studentDashboard/RegistrationSteps";

const sampleFees = [
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
export default function FeePaymentPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={9}>
          {sampleFees.map((f) => (
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
