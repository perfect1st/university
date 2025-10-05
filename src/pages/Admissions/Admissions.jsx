import React, { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  LinearProgress,
  TextField,
  MenuItem,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Divider,
  useTheme,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AdmissionsHero from "../../components/AdmissionsComponents/AdmissionsHero";
import TermsConditions from "../../components/AdmissionsComponents/TermsConditions";
import { useTranslation } from "react-i18next";

// Single-file small wrapper so this works even if your project doesn't have
// a CustomTextField component yet. It behaves like a TextField but uses
// project theme tokens you requested.
function CustomTextField(props) {
  const theme = useTheme();
  return (
    <TextField
      fullWidth
      variant="outlined"
      size="small"
      {...props}
      sx={{
        background: theme.palette.primary?.textField ?? "transparent",
        color: theme.palette.primary?.textFieldText ?? "inherit",
        '& .MuiInputBase-input': { color: theme.palette.primary?.textFieldText ?? 'inherit' },
        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.12)' },
        ...props.sx,
      }}
    />
  );
}

export default function Admissions() {
  const { t , i18n } = useTranslation();
  const isArabic = i18n.language == "ar"
  const theme = useTheme();
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [step, setStep] = useState(1);

  // step1 state
  const [personal, setPersonal] = useState({
    firstName: "",
    secondName: "",
    thirdName: "",
    fourthName: "",
    fullName: "",
    gender: "",
    nationality: "",
    dob: "",
    email: "",
    homePhone: "",
    phoneNumber: "",
    idNo: "",
    idCard: false,
    passport: false,
    residence: false,
  });
  const [errors, setErrors] = useState({});

  // step2 state
  const [academic, setAcademic] = useState({
    yearOfEducation: "",
    placeOfStudy: "",
    country: "",
    city: "",
    studentNo: "",
    generalAppreciation: "",
    gpa: "",
    highSchoolFile: null,
    faculty: "",
    facultyDepartment: "",
  });
  const [acadErrors, setAcadErrors] = useState({});

  const nationalities = ["Saudi", "Egypt", "Jordan", "Other"];
  const genders = ["Male", "Female"];

  function validateStep1() {
    const e = {};
    if (!personal.firstName) e.firstName = true;
    if (!personal.secondName) e.secondName = true;
    if (!personal.thirdName) e.thirdName = true;
    if (!personal.fourthName) e.fourthName = true;
    if (!personal.fullName) e.fullName = true;
    if (!personal.gender) e.gender = true;
    if (!personal.nationality) e.nationality = true;
    if (!personal.dob) e.dob = true;
    if (!personal.email) e.email = true;
    if (!personal.phoneNumber) e.phoneNumber = true;
    if (!personal.idNo) e.idNo = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2() {
    const e = {};
    if (!academic.yearOfEducation) e.yearOfEducation = true;
    if (!academic.placeOfStudy) e.placeOfStudy = true;
    if (!academic.country) e.country = true;
    if (!academic.city) e.city = true;
    if (!academic.studentNo) e.studentNo = true;
    if (!academic.generalAppreciation) e.generalAppreciation = true;
    if (!academic.gpa) e.gpa = true;
    if (!academic.highSchoolFile) e.highSchoolFile = true;
    if (!academic.faculty) e.faculty = true;
    if (!academic.facultyDepartment) e.facultyDepartment = true;
    setAcadErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (validateStep1()) {
      setStep(2);
    }
  }

  function handleFinish() {
    if (validateStep2()) {
      // submit or dispatch action
      console.log({ personal, academic });
      // You can dispatch here or navigate
      alert("Application submitted (demo)");
    }
  }

  return (
    <Box>
      <AdmissionsHero />

      {!acceptTerms && <TermsConditions setAcceptTerms={setAcceptTerms} acceptTerms={acceptTerms} />}

      {acceptTerms && (
        <Box sx={{ mt: 3,  maxWidth: 900 , margin: "auto"}}>
          {/* Step header */}
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2">Step {step} of 2</Typography>
            <Box sx={{ mt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={step === 1 ? 50 : 100}
                sx={{ height: 10, borderRadius: 2, backgroundColor: '#CFDBE8', '& .MuiLinearProgress-bar': { backgroundColor: theme.palette.primary.main } }}
              />
            </Box>
          </Box>

          {/* Paper with big border */}
          <Paper elevation={0} sx={{ border: `10px solid ${theme.palette.divider}`, p: 3, mb: 3 }}>
            {step === 1 && (
              <>
                <Typography variant="h6" sx={{ color: theme.palette.info?.main }}>Personal Information</Typography>
                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  {["firstName", "secondName", "thirdName", "fourthName"].map((k, idx) => (
                    <Grid key={k} item xs={12} sm={6} md={3}>
                      <Typography variant="body2" sx={{ display: 'block', mb: 0.5 }}>{k === 'firstName' ? 'First Name' : k === 'secondName' ? 'Second Name' : k === 'thirdName' ? 'Third Name' : 'Fourth Name'}</Typography>
                      <CustomTextField
                        placeholder={`Enter ${k === 'firstName' ? 'First Name' : k.replace(/Name/, ' Name')}`}
                        value={personal[k]}
                        onChange={(e) => setPersonal(p => ({ ...p, [k]: e.target.value }))}
                        error={!!errors[k]}
                      />
                    </Grid>
                  ))}

                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ display: 'block', mb: 0.5 }}>Full Name</Typography>
                    <CustomTextField
                      placeholder="Full Name"
                      value={personal.fullName}
                      onChange={(e) => setPersonal(p => ({ ...p, fullName: e.target.value }))}
                      error={!!errors.fullName}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ display: 'block', mb: 0.5 }}>Gender</Typography>
                    <CustomTextField
                      select
                      value={personal.gender}
                      onChange={(e) => setPersonal(p => ({ ...p, gender: e.target.value }))}
                      error={!!errors.gender}
                    >
                      {genders.map((g) => (
                        <MenuItem key={g} value={g}>{g}</MenuItem>
                      ))}
                    </CustomTextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ display: 'block', mb: 0.5 }}>Nationality</Typography>
                    <CustomTextField
                      select
                      value={personal.nationality}
                      onChange={(e) => setPersonal(p => ({ ...p, nationality: e.target.value }))}
                      error={!!errors.nationality}
                    >
                      {nationalities.map((n) => (
                        <MenuItem key={n} value={n}>{n}</MenuItem>
                      ))}
                    </CustomTextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ display: 'block', mb: 0.5 }}>Date of Birth</Typography>
                    <CustomTextField
                      type="date"
                      value={personal.dob}
                      onChange={(e) => setPersonal(p => ({ ...p, dob: e.target.value }))}
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.dob}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ display: 'block', mb: 0.5 }}>Email</Typography>
                    <CustomTextField
                      placeholder="example@mail.com"
                      type="email"
                      value={personal.email}
                      onChange={(e) => setPersonal(p => ({ ...p, email: e.target.value }))}
                      error={!!errors.email}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ display: 'block', mb: 0.5 }}>Home Phone</Typography>
                    <CustomTextField
                      placeholder="Home Phone"
                      value={personal.homePhone}
                      onChange={(e) => setPersonal(p => ({ ...p, homePhone: e.target.value }))}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
  <Typography variant="caption" sx={{ display: "block", mb: 0.5 }}>
    Phone Number
  </Typography>

  <CustomTextField
    placeholder="5XXXXXXXX"
    value={personal.phoneNumber}
    onChange={(e) =>
      setPersonal((p) => ({ ...p, phoneNumber: e.target.value }))
    }
    error={!!errors.phoneNumber}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          +966
        </InputAdornment>
      ),
    }}
  />
</Grid>


                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ display: 'block', mb: 0.5 }}>ID No.</Typography>
                    <CustomTextField
                      placeholder="ID Number"
                      value={personal.idNo}
                      onChange={(e) => setPersonal(p => ({ ...p, idNo: e.target.value }))}
                      error={!!errors.idNo}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'end' }}>
                    <FormControlLabel control={<Checkbox checked={personal.idCard} onChange={(e) => setPersonal(p => ({ ...p, idCard: e.target.checked }))} />} label="ID Card" />
                    <FormControlLabel control={<Checkbox checked={personal.passport} onChange={(e) => setPersonal(p => ({ ...p, passport: e.target.checked }))} />} label="Passport" />
                    <FormControlLabel control={<Checkbox checked={personal.residence} onChange={(e) => setPersonal(p => ({ ...p, residence: e.target.checked }))} />} label="Residence No." />
                  </Grid>

                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" endIcon={<ArrowForwardIcon />} sx={{ background:theme.palette.info?.main}} onClick={handleNext}>Next</Button>
                  </Grid>
                </Grid>
              </>
            )}

            {step === 2 && (
              <>
                <Typography variant="h6" sx={{ color: theme.palette.info?.main }}>Academic Information</Typography>
                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ display: 'block', mb: 0.5 }}>Year Of Education</Typography>
                    <CustomTextField value={academic.yearOfEducation} onChange={(e) => setAcademic(a => ({ ...a, yearOfEducation: e.target.value }))} error={!!acadErrors.yearOfEducation} />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ display: 'block', mb: 0.5 }}>Place Of Study</Typography>
                    <CustomTextField value={academic.placeOfStudy} onChange={(e) => setAcademic(a => ({ ...a, placeOfStudy: e.target.value }))} error={!!acadErrors.placeOfStudy} />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ display: 'block', mb: 0.5 }}>Country</Typography>
                    <CustomTextField select value={academic.country} onChange={(e) => setAcademic(a => ({ ...a, country: e.target.value }))} error={!!acadErrors.country}>
                      <MenuItem value="Saudi">Saudi</MenuItem>
                      <MenuItem value="Egypt">Egypt</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </CustomTextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ display: 'block', mb: 0.5 }}>City</Typography>
                    <CustomTextField value={academic.city} onChange={(e) => setAcademic(a => ({ ...a, city: e.target.value }))} error={!!acadErrors.city} />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ display: 'block', mb: 0.5 }}>Student No. In High School</Typography>
                    <CustomTextField value={academic.studentNo} onChange={(e) => setAcademic(a => ({ ...a, studentNo: e.target.value }))} error={!!acadErrors.studentNo} />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ display: 'block', mb: 0.5 }}>General Appreciation</Typography>
                    <CustomTextField value={academic.generalAppreciation} onChange={(e) => setAcademic(a => ({ ...a, generalAppreciation: e.target.value }))} error={!!acadErrors.generalAppreciation} />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ display: 'block', mb: 0.5 }}>GPA</Typography>
                    <CustomTextField value={academic.gpa} onChange={(e) => setAcademic(a => ({ ...a, gpa: e.target.value }))} error={!!acadErrors.gpa} />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2">High School Certificate</Typography>
                    <Box sx={{ width: '100%', border: `2px dashed ${theme.palette.secondary.main}`, p: 2, mt: 1, borderRadius: 1 }}>
                      <Typography variant="body2">Please upload your high school certificate after authentication by the issuing country, the Ministry of Foreign Affairs, and the embassy.</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button variant="contained" sx={{ background: theme.palette.secondary.main }} startIcon={<AddCircleOutlineIcon />}>Add File</Button>
                      </Box>
                    </Box>
                  </Grid>

                </Grid>
              </>
            )}
          </Paper>
            {/* Major Information Paper */}
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ border: `10px solid ${theme.palette.divider}`, p: 2, mt: 3 }}>
                <Typography variant="h6">Major Information</Typography>
                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ display: 'block', mb: 0.5 }}>Faculty</Typography>
                    <CustomTextField select value={academic.faculty} onChange={(e) => setAcademic(a => ({ ...a, faculty: e.target.value }))} error={!!acadErrors.faculty}>
                      <MenuItem value="Engineering">Engineering</MenuItem>
                      <MenuItem value="Medicine">Medicine</MenuItem>
                      <MenuItem value="Business">Business</MenuItem>
                    </CustomTextField>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ display: 'block', mb: 0.5 }}>Faculty Department</Typography>
                    <CustomTextField select value={academic.facultyDepartment} onChange={(e) => setAcademic(a => ({ ...a, facultyDepartment: e.target.value }))} error={!!acadErrors.facultyDepartment}>
                      <MenuItem value="Dept A">Dept A</MenuItem>
                      <MenuItem value="Dept B">Dept B</MenuItem>
                    </CustomTextField>
                  </Grid>

                </Grid>
              </Paper>
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' , my:2 }}>
                    <Button variant="contained" endIcon={<ArrowForwardIcon />} sx={{background : theme.palette.info?.main}} onClick={handleFinish}>Finish</Button>
                  </Grid>
            </Grid>
        </Box>
      )}
    </Box>
  );
}
