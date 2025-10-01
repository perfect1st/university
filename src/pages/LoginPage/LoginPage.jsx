import React, { useState } from "react";
import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  useTheme,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import logo from "../../assets/Logo.png";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slices/user/thunk";
import { useNavigate } from "react-router-dom";
import { setToken, setUserCookie } from "../../hooks/authCookies";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const LoginPage = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required(t("validation.usernameRequired")),
      password: Yup.string()
        .min(6, t("validation.passwordMin"))
        .required(t("validation.passwordRequired")),
    }),
    onSubmit: async (values) => {
      const data = {
        phone_number: values.username,
        password: values.password,
      };
      try {
        setIsLoading(true);
        const response = await dispatch(login({ data }));
        if (response?.payload?.token && response?.payload?.admin) {
          const { groups } = response.payload.admin;

          const mergedScreensMap = {};

          groups.forEach((group) => {
            group.screens.forEach((screen) => {
              const screenName = screen.screen;

              if (!mergedScreensMap[screenName]) {
                mergedScreensMap[screenName] = { ...screen };
              } else {
                const existing = mergedScreensMap[screenName];
                mergedScreensMap[screenName].permissions = {
                  view: existing.permissions.view || screen.permissions.view,
                  edit: existing.permissions.edit || screen.permissions.edit,
                  delete:
                    existing.permissions.delete || screen.permissions.delete,
                  add: existing.permissions.add || screen.permissions.add,
                };
              }
            });
          });

          const mergedScreensArray = Object.values(mergedScreensMap);

          const mergedAdmin = {
            ...response.payload.admin,
            groups: [
              {
                _id: "merged-group",
                name: "Merged Permissions",
                screens: mergedScreensArray,
              },
            ],
          };

          // Set in cookies/local storage
          setUserCookie(mergedAdmin);
          setToken(response.payload.token);
          navigate("/home");
        }
      } catch (error) {
        console.error("Error logging in:", error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const changeLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      {/* Left side with logo and text */}
      <Grid
        item
        xs={12}
        md={4}
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: "#fff",
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          // order: { xs: 2, md:1 },
        }}
      >
        <Box component="img" src={logo} alt="Logo" sx={{ width: 120, mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          {t("intro.title")}
        </Typography>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {t("intro.highlight")}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {t("intro.welcome")}
        </Typography>
        <Typography variant="body2" align="center">
          {t("intro.description")}
        </Typography>
      </Grid>

      {/* Right side with form */}
      <Grid
        item
        xs={12}
        md={8}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Language Switch Button */}
        <Box
          sx={{
            position: "absolute",
            top: 16,
            ...(i18n.language === "ar" ? { left: 16 } : { right: 16 }),
          }}
        >
          <Button variant="outlined" size="small" onClick={changeLanguage}>
            {i18n.language === "en" ? "AR" : "EN"}
          </Button>
        </Box>

        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{ maxWidth: 600 }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: "bold", mb: 4 }}
          >
            {t("form.login")}
          </Typography>

          {/* Username */}
          <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
            {t("form.phone")}
          </Typography>
          <TextField
            fullWidth
            id="username"
            name="username"
            placeholder={t("form.phonePlaceholder")}
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
            variant="outlined"
            sx={{ mb: 3 }}
          />

          {/* Password */}
          <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
            {t("form.password")}
          </Typography>
          <TextField
            fullWidth
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder={t("form.passwordPlaceholder")}
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            variant="outlined"
            sx={{ mb: 4 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 1, mb: 2, py: 1.5 }}
          >
            {isLoading ? (
              <CircularProgress
                size={26}
                thickness={8}
                sx={{ color: "#fff" }}
              />
            ) : (
              t("form.loginButton")
            )}
          </Button>

          {/* Forgot Password */}
          {/* <Link
            href="#"
            variant="body2"
            underline="hover"
            sx={{ display: 'block', textAlign: 'center' }}
          >
            {t('form.forgotPassword')}
          </Link> */}
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
