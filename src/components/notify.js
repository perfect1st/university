import React from "react"; 
import { toast } from "react-toastify";
import { MdCheckCircle, MdError, MdWarning } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";
import i18next from "i18next";

const notify = (msg, type) => {
  const isArabic = i18next.language === 'ar';

  const getIcon = () => {
    switch (type) {
      case "success":
        return <MdCheckCircle style={{ color: "#4caf50", fontSize: 22 }} />;
      case "error":
        return <MdError style={{ color: "#f44336", fontSize: 22 }} />;
      case "warning":
        return <MdWarning style={{ color: "#ff9800", fontSize: 22 }} />;
      default:
        return null;
    }
  };

  const options = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    icon: getIcon(),
    style: {
      background: "rgba(0, 0, 0, 0.85)",
      color: "#fff",
      fontFamily: "Cairo, sans-serif",
      zIndex: 99999,
      borderRadius: 8,
      padding: "0.75rem 1rem",
      maxWidth: "90vw",
      width: "fit-content",
      direction: isArabic ? "rtl" : "ltr",
    },
    bodyStyle: {
      direction: isArabic ? "rtl" : "ltr",
      fontSize: "1rem",
      display: "flex",
      alignItems: "center",
      textAlign: isArabic ? "right" : "left",
    },
    rtl: isArabic,
  };

  switch (type) {
    case "warning":
      toast.warn(msg, options);
      break;
    case "success":
      toast.success(msg, options);
      break;
    case "error":
      toast.error(msg, options);
      break;
    default:
      toast(msg, options);
  }
};

export default notify;
