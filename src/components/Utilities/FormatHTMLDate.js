

export default function FormatHTMLDate({timestamp}) {

    timestamp = Number(timestamp);
    const date = new Date(timestamp);

// صيغة مناسبة للـ input type date → 2025-12-14 مثلا
const formatted = date?.toISOString()?.split("T")[0];

console.log("formatted",formatted);
return formatted;
}
