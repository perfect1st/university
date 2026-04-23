import logger from "../../utils/logger";


export default function FormatHTMLDate({timestamp}) {

    timestamp = Number(timestamp);
    const date = new Date(timestamp);

// صيغة مناسبة للـ input type date → 2025-12-14 مثلا
const formatted = date?.toISOString()?.split("T")[0];

logger.log("formatted",formatted);
return formatted;
}
