import React from "react";
import {
  Box,
  Typography,
  useTheme,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";
import LabelValueRow from "../../components/LabelValueRow"; // adjust path if needed

export default function StudentDashboard() {
  const theme = useTheme();

  // Dummy data for example
  const subjects = [
    { title: "Mathematics", fullMark: 100, successDegree: 50 },
    { title: "Physics", fullMark: 100, successDegree: 50 },
    { title: "Programming", fullMark: 100, successDegree: 60 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Major Information */}
      <Typography
        variant="h6"
        sx={{
          color: theme.palette.info.main,
          fontWeight: 700,
          mb: 1,
        }}
      >
        Major Information
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <LabelValueRow label="Faculty" value="Engineering" />
        <LabelValueRow label="Faculty Department" value="Computer Engineering" />
      </Paper>

      {/* Year Information */}
      <Typography
        variant="h6"
        sx={{
          color: theme.palette.info.main,
          fontWeight: 700,
          mb: 1,
        }}
      >
        Year Information
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <LabelValueRow label="Year Of Education" value="3rd Year" />
        <LabelValueRow label="Study Year" value="2025" />
        <LabelValueRow label="Semester" value="First" />
      </Paper>

      {/* Subjects */}
      <Typography
        variant="h6"
        sx={{
          color: theme.palette.info.main,
          fontWeight: 700,
          mb: 1,
        }}
      >
        Subjects
      </Typography>

      <Paper>
        <Table>
          <TableHead
            sx={{
              backgroundColor: theme.palette.primary?.tabelHeader || "#e0e0e0",
            }}
          >
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Subject Title</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Fullmark Degree</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Success Degree</TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              backgroundColor:
                theme.palette.background?.secDefault || "#fafafa",
            }}
          >
            {subjects.map((subj, idx) => (
              <TableRow key={idx}>
                <TableCell>{subj.title}</TableCell>
                <TableCell>{subj.fullMark}</TableCell>
                <TableCell>{subj.successDegree}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
