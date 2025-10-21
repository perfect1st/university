import React, { useState, useRef } from "react";
import {
  Box,
  Grid,
  Typography,
  useTheme,
  IconButton,
  TextField,
  Button,
  Avatar,
  Chip,
  MenuItem,
  Select,
  OutlinedInput,
  FormControl,
  InputLabel,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DownloadIcon from "@mui/icons-material/Download";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useParams } from "react-router-dom"
import { useQuery } from "@apollo/client/react";
import { GET_USER_BY_ID } from "../../graphql/usersQueries.js";
// Reusable row component that supports inline edit and file actions
function LabelValueRow({
  label,
  value,
  file = false,
  editable = false,
  onOpen,
  onDownload,
  onSave,
  options = [], // for select (permissions)
  multiple = false,
}) {
  const theme = useTheme();
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  // file input for upload
  const fileInputRef = useRef(null);

  const handleStartEdit = () => {
    setLocalValue(value);
    setEditing(true);
  };
  const handleCancel = () => {
    setEditing(false);
    setLocalValue(value);
  };
  const handleSave = () => {
    setEditing(false);
    if (onSave) onSave(localValue);
  };

  const handleFileChoose = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    // for demo: we just save the filename
    const fileName = f.name;
    setLocalValue(fileName);
    if (onSave) onSave(fileName, f);
  };

  // helper for rendering permission list as comma separated string
  const renderPermissionString = (val) => {
    if (!val) return "";
    if (Array.isArray(val)) return val.join(", ");
    return String(val);
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.primary?.gray || "#f5f5f5",
        borderRadius: 1,
        px: 2,
        py: 1.2,
        my: 1,
      }}
    >
      <Grid container alignItems="center" spacing={2}>
        {/* Label */}
        <Grid item xs={12} sm={3}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {label}
          </Typography>
        </Grid>

        {/* Value */}
        <Grid item xs={12} sm={7}>
          {file ? (
            // file — show status + filename (clickable) here; actions moved to end column
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CheckCircleIcon color="success" fontSize="small" />
              <Typography
                variant="body1"
                color="primary"
                sx={{
                  fontWeight: 700,
                  cursor: onOpen ? "pointer" : "default",
                  textDecoration: onOpen ? "underline" : "none",
                }}
                onClick={onOpen}
              >
                {localValue}
              </Typography>
            </Box>
          ) : editing ? (
            // editing mode: show proper input/select
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              {Array.isArray(options) && options.length > 0 && multiple ? (
                <FormControl sx={{ minWidth: 200 }} size="small">
                  <InputLabel id={`${label}-label`}>{label}</InputLabel>
                  <Select
                    labelId={`${label}-label`}
                    multiple
                    fullWidth
                    value={localValue || []}
                    onChange={(e) => setLocalValue(e.target.value)}
                    input={<OutlinedInput label={label} />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                        {selected.map((val) => (
                          <Chip key={val} size="small" label={val} />
                        ))}
                      </Box>
                    )}
                  >
                    {options.map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : Array.isArray(options) && options.length > 0 && !multiple ? (
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={localValue || ""}
                  onChange={(e) => setLocalValue(e.target.value)}
                >
                  {options.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                <TextField fullWidth size="small" value={localValue || ""} onChange={(e) => setLocalValue(e.target.value)} />
              )}
            </Box>
          ) : (
            // not editing: show value (for permissions show comma-separated)
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body1" color="text.primary" sx={{ fontWeight: 700 }}>
                {multiple ? renderPermissionString(value) : value}
              </Typography>
            </Box>
          )}
        </Grid>

        {/* Actions column (icons at the end) */}
        <Grid item xs={12} sm={2} sx={{ textAlign: "end" }}>
          {/* File actions: Upload & Download always on the right */}
          {file && (
            <>
              <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChoose} />
              <IconButton size="small" onClick={() => fileInputRef.current?.click()} aria-label="upload">
                <UploadFileIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={onDownload} aria-label="download">
                <DownloadIcon fontSize="small" />
              </IconButton>
            </>
          )}

          {/* Editing actions: Save / Cancel (when editing) */}
          {!file && editing && (
            <>
              <IconButton size="small" onClick={handleSave} color="primary" aria-label="save">
                <SaveIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={handleCancel} aria-label="cancel">
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          )}

          {/* Edit button when not editing */}
          {!file && editable && !editing && (
            <IconButton size="small" onClick={handleStartEdit} aria-label="edit">
              <EditIcon fontSize="small" />
            </IconButton>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

// Dummy User Details page
export default function UserDetails() {
  const theme = useTheme();
  const {id} = useParams();

  // dummy user state
  const [user, setUser] = useState({
    id: "U-001",
    fullName: "Mokhtar Mahmoud",
    email: "mokhtar@example.com",
    mobile: "+201000000001",
    password: "••••••••",
    userType: "student",
    enrollmentNumber: "EN-2025-001",
    profileImage: "profile.jpg",
    permissions: ["read", "write"],
  });

  const { data, loading, error } = useQuery(GET_USER_BY_ID, {
    variables: { id },
    skip: !id, // 👈 لو مفيش userId متبعت، ميعملش query
  });
console.log("data",data)
  // available permission groups (dummy)
  const permissionGroups = ["read", "write", "delete", "admin"];

  const handleSaveField = (field) => (newVal, file) => {
    // simple save handler -> update local state
    setUser((prev) => ({ ...prev, [field]: newVal }));
    // if there's a file passed you could upload to server here
    if (file) {
      // demo: we don't upload but you can implement
      console.log("file chosen for", field, file);
    }
  };

  const handleOpenProfile = () => {
    // demo open: show image in new tab if you had a URL; here create a tiny placeholder
    const blob = new Blob(["profile"], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const handleDownloadProfile = () => {
    const blob = new Blob(["dummy image content"], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = user.profileImage || "profile.jpg";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <Box component="main" sx={{ p: 3, width: "100%" }}>
      {/* Breadcrumbs */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Users &lt; User Details
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          User Details
        </Typography>
      </Box>

      {/* Rows */}
      <LabelValueRow label="Full Name" value={user.fullName} editable onSave={handleSaveField("fullName")} />
      <LabelValueRow label="Email" value={user.email} editable onSave={handleSaveField("email")} />
      <LabelValueRow label="Mobile" value={user.mobile} editable onSave={handleSaveField("mobile")} />
      <LabelValueRow label="Password" value={user.password} editable onSave={handleSaveField("password")} />
      <LabelValueRow label="User Type" value={user.userType} editable options={["Admin", "student", "accountant"]} onSave={handleSaveField("userType")} />
      <LabelValueRow label="Enrollment Number" value={user.enrollmentNumber} editable onSave={handleSaveField("enrollmentNumber")} />

      <LabelValueRow
        label="Profile Image"
        value={user.profileImage}
        file
        onOpen={handleOpenProfile}
        onDownload={handleDownloadProfile}
        onSave={handleSaveField("profileImage")}
      />

      <LabelValueRow
        label="Permissions"
        value={user.permissions}
        editable
        multiple
        options={permissionGroups}
        onSave={handleSaveField("permissions")}
      />
    </Box>
  );
}
