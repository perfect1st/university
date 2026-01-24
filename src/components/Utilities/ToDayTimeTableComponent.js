import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    useTheme,
    useMediaQuery,
    Typography,
    Button,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress
} from "@mui/material";
import i18n from "../../i18n/i18n";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useState } from "react";
import VerticalTextField from "./VerticalTextField";
import { useMutation } from "@apollo/client/react";
import { ATTEND_LECTURE_FOR_STUDENT, CANCEL_LECTURE_SESSION, CREATE_LECTURE_SESSION } from "../../graphql/LectureSessionQueries";
import ConfirmModal from "./ConfirmModal";




export default function ToDayTimeTableComponent({ rows = [], canEdit = false, func }) {

    // open lecture link pop up
    const [open, setOpen] = useState(false);
    // open cancel lect. popup
    const [cancelPopUp, setCancelPopUp] = useState(false);

    const [lectureLink, setLectureLink] = useState('');
    const [selectedRow, setSelectedRow] = useState(null);

    const navigte = useNavigate();
    const me = useSelector(state => state.user.loggedUser);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // اضافة لينك للمحاضرة
    const [
        CreateLectureSession,
        {
            loading: creatingSession
        }
    ] = useMutation(CREATE_LECTURE_SESSION, { fetchPolicy: "network-only" });

    // الغاء المحاضرة
    const [
        CreateCanceledLectureSession,
        {
            loading: cancelingSession
        }
    ] = useMutation(CANCEL_LECTURE_SESSION, { fetchPolicy: "network-only" });

    // حضور المحاضرة للطالب
    const [AttendLecture] = useMutation(ATTEND_LECTURE_FOR_STUDENT, { fetchPolicy: "network-only" });

    const handleAddLectureLink = async () => {
        let data = {};
        data.lecture_url = lectureLink;
        data.timetable_id = selectedRow?.id;

        console.log("selectedRow", selectedRow);

        const result = await CreateLectureSession({
            variables: {
                input: data
            }
        });

        console.log("result", result);

        const date = new Date();
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

        console.log("dayName", dayName);

        func({ variables: { doctor_id: me?.id, day: dayName } });

        handleClose();
    }

    const handleCancelLecture = async () => {
        // let data = {};
        // data.timetable_id = selectedRow?.id;
        // console.log("selectedRow", selectedRow);

        // return;
        const result = await CreateCanceledLectureSession({
            variables: { timetable_id: selectedRow?.id }
        });
        console.log("result", result);
        const date = new Date();
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

        console.log("dayName", dayName);
        func({ variables: { doctor_id: me?.id, day: dayName } });
        setCancelPopUp(false);
    }

    const isArabic = i18n.language === "ar";
    const theme = useTheme();
    const { t } = useTranslation();
    const location = useLocation();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t("from")}</TableCell>
                            <TableCell>{t("to")}</TableCell>
                            {/* <TableCell>{t("studentDashboard.section")}</TableCell> */}
                            <TableCell>{t("Status")}</TableCell>
                            <TableCell> {t("Details")}</TableCell>
                            {
                                me?.role == "student" && <TableCell> {t("Dashboard.enterLecture")}</TableCell>
                            }
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {
                            rows?.length == 0 ? <TableRow><TableCell colSpan={7}>
                                <Typography variant="h6" color="text.secondary" align="center">
                                    {t("noData")}
                                </Typography>
                            </TableCell></TableRow>
                                :
                                rows?.map((row, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{row?.start_time}</TableCell>
                                        <TableCell>{row?.end_time}</TableCell>
                                        {/* <TableCell>{row?.section}</TableCell> */}
                                        <TableCell>{t(`lectures.${row?.lecture_status}`)}</TableCell>
                                        <TableCell>
                                            {
                                                me?.role == "doctor" &&
                                                <Box>
                                                    {
                                                        row?.lecture_status == "pending" &&
                                                        <>
                                                            <Button variant="contained" size="small" color="primary"
                                                                onClick={() => {
                                                                    setSelectedRow(row);
                                                                    handleOpen();
                                                                }}
                                                            >
                                                                {t("Dashboard.startnow")}
                                                            </Button>

                                                            <Button variant="contained" size="small" color="error"
                                                                sx={{
                                                                    mx: 1
                                                                }}
                                                                onClick={() => {
                                                                    setSelectedRow(row);
                                                                    setCancelPopUp(true);
                                                                }}
                                                            >
                                                                {t("Cancel")}
                                                            </Button>
                                                        </>

                                                    }
                                                </Box>

                                            }

                                            {

                                                row?.lecture_status !== "pending" && <Button
                                                    sx={{
                                                        bgcolor: "secondary.main",
                                                    }}
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => {
                                                        navigte(`/LectureSessionDetails/${row?.lecture_id}`);
                                                        // setSelectedRow(row);
                                                        // handleOpen();
                                                    }}
                                                >
                                                    {t("Details")}
                                                </Button>
                                            }


                                        </TableCell>

                                        {/* لينك دخول المحاضرة */}
                                        {
                                            me?.role == "student" && row?.lecture_status == "started" && <TableCell>
                                                <Button
                                                    color="primary"
                                                    variant="contained"
                                                    size="small"
                                                    onClick={async () => {
                                                        try {

                                                            console.log("clicked", row);
                                                            const result = await AttendLecture({ variables: { lecture_session_id: row?.lecture_id } });

                                                            // console.log("result", result);
                                                        } catch (error) {
                                                            console.log("error", error);
                                                            
                                                        }
                                                        finally {
                                                            window.open(row?.lecture_url, "_blank");
                                                        }

                                                    }}
                                                >
                                                    {t("Dashboard.enterLecture")}
                                                </Button>
                                            </TableCell>
                                        }
                                    </TableRow>
                                ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* enter lecture link popup */}
            <Dialog open={open} onClose={() => {
                handleClose();
                setSelectedRow(null);
            }}>


                <DialogContent>

                    <VerticalTextField
                        title={t("Dashboard.lectureLink")}
                        fieldID={"lectureLink"}
                        fieldName={"lectureLink"}
                        placeholder={t("Dashboard.lectureLink")}
                        value={lectureLink}
                        onChange={(e) => setLectureLink(e.target.value)}
                    />
                </DialogContent>

                <DialogActions sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mx: 2
                }}>

                    <Button
                        disabled={creatingSession}
                        variant="contained"
                        size="small"
                        color="success"
                        onClick={() => handleAddLectureLink()}>
                        {
                            creatingSession ? <>
                                <CircularProgress size={26}
                                    thickness={8}
                                    sx={{ color: "black" }} />
                            </> : t("form.save")
                        }
                    </Button>

                    <Button variant="contained" size="small" color="primary" onClick={() => {
                        handleClose();
                        setSelectedRow(null);
                    }}>{t("form.close")}</Button>

                </DialogActions>
            </Dialog>

            {/* cancel lecture popup */}
            <ConfirmModal
                dialogOpen={cancelPopUp}
                setDialogOpen={setCancelPopUp}
                content={"هل انت متأكد"}
                onClickAction={handleCancelLecture}
                isLoading={cancelingSession}
            />
        </Box>

    )

}
