import React from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  useTheme,
  Paper
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@apollo/client/react";
import { useSelector } from "react-redux";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import PendingIcon from "@mui/icons-material/Pending";

import { GET_SEQUENCE_TRANS_BY_TICKET, UPDATE_SEQUENCE_TRANS } from "../graphql/typeSequenceQueries";
import notify from "./notify";
import logger from "../utils/logger";
import { format } from "date-fns";

export default function ApprovalTimeline({ ticketId }) {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  
  // Get logged in user from Redux
  const me = useSelector((state) => state.user.loggedUser);

  const { data, loading, refetch } = useQuery(GET_SEQUENCE_TRANS_BY_TICKET, {
    variables: { ticketId },
    fetchPolicy: "network-only",
    skip: !ticketId,
  });

  const [updateSequenceTrans, { loading: updating }] = useMutation(UPDATE_SEQUENCE_TRANS);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress size={30} />
      </Box>
    );
  }

  const transactions = data?.getSupportTicketsSequenceTransByTicket || [];

  if (transactions.length === 0) {
    return (
      <Box p={2}>
        <Typography variant="body2" color="textSecondary">
          {isArabic ? "لا توجد مسارات موافقة لهذه التذكرة." : "No approval sequences for this ticket."}
        </Typography>
      </Box>
    );
  }

  // Sort by arrange
  const sortedTransactions = [...transactions].sort((a, b) => 
    (a.type_sequence_id?.arrange || 0) - (b.type_sequence_id?.arrange || 0)
  );

  const handleApprove = async (transaction) => {
    try {
      await updateSequenceTrans({
        variables: {
          id: transaction.id,
          input: {
            support_ticketsId: transaction.support_ticketsId?.id,
            type_sequence_id: transaction.type_sequence_id?.id,
            user_id: transaction.user_id?.id,
            is_approved: true,
            status: 'approved',
            approved_datetime: String(new Date().getTime()),
          }
        }
      });
      notify(isArabic ? "تم الاعتماد بنجاح!" : "Approved successfully!", "success");
      refetch();
    } catch (error) {
      logger.error("Approval error:", error);
      notify(t("error"), "error");
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {isArabic ? "مسار الموافقات (الاعتمادات)" : "Approval Workflow"}
      </Typography>
      
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
        {sortedTransactions.map((trans, index) => {
          const isApproved = trans.is_approved || trans.status === 'approved';
          
          // Determine the first step that is not approved
          const currentPendingStepIndex = sortedTransactions.findIndex(t => !t.is_approved && t.status !== 'approved');
          const isCurrentStep = index === currentPendingStepIndex;
          
          // It's my turn if it's the current pending step and I am the assigned user
          const isMyTurn = isCurrentStep && trans.user_id?.id === me?.id;
          
          const stepName = isArabic ? trans.type_sequence_id?.job_title_id?.name_ar : trans.type_sequence_id?.job_title_id?.name_en;
          
          return (
            <Paper 
              key={trans.id} 
              elevation={isMyTurn ? 3 : 1}
              sx={{ 
                p: 2, 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between",
                borderLeft: `5px solid ${isApproved ? theme.palette.success.main : (isMyTurn ? theme.palette.warning.main : theme.palette.grey[400])}`,
                backgroundColor: isMyTurn ? theme.palette.action.hover : "inherit"
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {isApproved ? (
                  <CheckCircleIcon color="success" />
                ) : isMyTurn ? (
                  <HourglassEmptyIcon color="warning" />
                ) : (
                  <PendingIcon color="disabled" />
                )}
                
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {isArabic ? "الخطوة" : "Step"} {trans.type_sequence_id?.arrange}: {stepName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {isArabic ? "المسؤول:" : "Assignee:"} {trans.user_id?.fullname}
                  </Typography>
                  {isApproved && trans.approved_datetime && (
                    <Typography variant="caption" color="success.main" display="block">
                      {isArabic ? "تاريخ الاعتماد:" : "Approved at:"} {format(new Date(Number(trans.approved_datetime)), "yyyy-MM-dd hh:mm a")}
                    </Typography>
                  )}
                </Box>
              </Box>

              {isMyTurn && (
                <Button 
                  variant="contained" 
                  color="success" 
                  onClick={() => handleApprove(trans)}
                  disabled={updating}
                  startIcon={updating && <CircularProgress size={16} color="inherit" />}
                >
                  {isArabic ? "اعتماد" : "Approve"}
                </Button>
              )}
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
}
