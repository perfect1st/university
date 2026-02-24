import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Button,
  TextField,
  Stack,
  Typography,
  Checkbox,
  FormControlLabel,
  Paper,
  Divider,
  CircularProgress,
  Card,
  CardContent,
  FormGroup,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client/react";
import i18n from "../../i18n/i18n";

// Components & GraphQL
import Header from "../../components/PageHeader/header";
import LoadingPage from "../../components/LoadingComponent";
import notify from "../../components/notify";
import {
  GET_SCREENS,
  GET_GROUP_BY_ID,
  CREATE_GROUP,
  UPDATE_GROUP,
} from "../../graphql/groupQueries";

export default function GroupFormPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isArabic = i18n.language === "ar";
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name_ar: "",
    name_en: "",
    permissions: [], // This will store the 'key' strings (e.g., 'users.view')
  });

  const { data: screensData, loading: screensLoading } = useQuery(GET_SCREENS);

const { data: groupData, loading: groupLoading } = useQuery(GET_GROUP_BY_ID, {
  variables: { id },
  skip: !isEdit,
});

useEffect(() => {
  if (isEdit && groupData?.group) {
    setFormData({
      name_ar: groupData.group.name_ar || "",
      name_en: groupData.group.name_en || "",
      permissions: groupData.group.permissions || [],
    });
  }
}, [groupData, isEdit]);


  const [createGroup, { loading: creating }] = useMutation(CREATE_GROUP);
  const [updateGroup, { loading: updating }] = useMutation(UPDATE_GROUP);

  // --- Logic Handlers ---

  const handlePermissionToggle = (key) => {
    setFormData((prev) => {
      const isSelected = prev.permissions.includes(key);
      return {
        ...prev,
        permissions: isSelected
          ? prev.permissions.filter((p) => p !== key)
          : [...prev.permissions, key],
      };
    });
  };

  const handleModuleToggle = (modulePermissions, isChecked) => {
    const keys = modulePermissions.map((p) => p.key);
    setFormData((prev) => {
      const filtered = prev.permissions.filter((p) => !keys.includes(p));
      return {
        ...prev,
        permissions: isChecked ? [...filtered, ...keys] : filtered,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.permissions.length === 0) {
        return notify(t("pleaseSelectAtLeastOnePermission"), "warning");
    }
    
    try {
      const input = {
        name_ar: formData.name_ar,
        name_en: formData.name_en,
        permissions: formData.permissions,
      };

      if (isEdit) {
        await updateGroup({ variables: { id, input } });
        notify(t("updatedSuccessfully"), "success");
      } else {
        await createGroup({ variables: { input } });
        notify(t("createdSuccessfully"), "success");
      }
      navigate(-1);
    } catch (err) {
      notify(err.message || t("error"), "error");
    }
  };

  if (screensLoading || (isEdit && groupLoading)) return <LoadingPage />;

  const availableModules = screensData?.availablePermissions || [];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Header
        title={isEdit ? t("Edit Group") : t("Add Group")}
        subtitle={isEdit ? (isArabic ? formData.name_ar : formData.name_en) : t("Define group roles")}
        i18n={i18n}
      />

      <form onSubmit={handleSubmit}>
        <Paper elevation={0} sx={{ p: 3, mt: 3, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
          <Grid container spacing={3}>
            {/* Identity Section */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t("Name (Arabic)")}
                value={formData.name_ar}
                onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t("Name (English)")}
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                required
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Typography variant="h6" fontWeight="600">
                  {t("Module Permissions")}
                </Typography>
                <Divider sx={{ flexGrow: 1, ml: 2 }} />
              </Box>
            </Grid>

            {/* Permissions Grid */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                {availableModules.map((moduleItem) => {
                  const moduleKeys = moduleItem.permissions.map((p) => p.key);
                  const isAllModuleSelected = moduleKeys.every((k) => formData.permissions.includes(k));
                  const isSomeModuleSelected = moduleKeys.some((k) => formData.permissions.includes(k)) && !isAllModuleSelected;

                  return (
                    <Grid item xs={12} sm={6} lg={4} key={moduleItem.module}>
                      <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
                        <Box sx={{ px: 2, py: 1, bgcolor: 'action.hover', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {isArabic ? moduleItem.label_ar : moduleItem.label_en}
                          </Typography>
                          <Checkbox
                            size="small"
                            indeterminate={isSomeModuleSelected}
                            checked={isAllModuleSelected}
                            onChange={(e) => handleModuleToggle(moduleItem.permissions, e.target.checked)}
                          />
                        </Box>
                        <CardContent>
                          <FormGroup>
                            <Grid container>
                              {moduleItem.permissions.map((perm) => (
                                <Grid item xs={6} key={perm.key}>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        size="small"
                                        checked={formData.permissions.includes(perm.key)}
                                        onChange={() => handlePermissionToggle(perm.key)}
                                      />
                                    }
                                    label={<Typography variant="body2">{t(perm.action)}</Typography>}
                                  />
                                </Grid>
                              ))}
                            </Grid>
                          </FormGroup>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>

            {/* Actions */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="text" color="inherit" onClick={() => navigate(-1)}>
                  {t("Cancel")}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={creating || updating}
                  sx={{ px: 4, borderRadius: 2 }}
                >
                  {(creating || updating) ? <CircularProgress size={24} color="inherit" /> : (isEdit ? t("Update Group") : t("Create Group"))}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </form>
    </Box>
  );
}