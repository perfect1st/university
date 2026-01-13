import { Box } from '@mui/material';
import React from 'react'
import { useSelector } from 'react-redux';
import StudentComponent from './StudentComponent';
import DoctorComponent from './DoctorComponent';

export default function AllLectureSessionsPage() {
  const me = useSelector((state) => state.user.loggedUser);

  return (
    <Box>
      {me?.role == "student"&&<StudentComponent />}
      {me?.role == "doctor"&&<DoctorComponent />}
    </Box>
  )
}
