export const paymentMethodsArr = ["CASH", "BANK_TRANSFER", "ONLINE"];

export const transactionTypesArr = ["OUT", "IN"];

export const TrueOrFalseArr = [true, false];

export const userRules = ["admin", "doctor", "student"];

export const isPaidArr = [
    { arKey: "مدفوع", id: "true" , enKey:"Paid" },
    { arKey: "غير مدفوع", id: "false" , enKey:"UnPaid" }
];

export const terms_optionsArr = [
    { id: 1, value: 1 },
    { id: 2, value: 2 },
    { id: 3, value: 3 },
  ];

export const days = [
    { key: "Saturday", labelAr: "السبت", labelEn: "Saturday" },
    { key: "Sunday", labelAr: "الأحد", labelEn: "Sunday" },
    { key: "Monday", labelAr: "الإثنين", labelEn: "Monday" },
    { key: "Tuesday", labelAr: "الثلاثاء", labelEn: "Tuesday" },
    { key: "Wednesday", labelAr: "الأربعاء", labelEn: "Wednesday" },
    { key: "Thursday", labelAr: "الخميس", labelEn: "Thursday" },
    { key: "Friday", labelAr: "الجمعة", labelEn: "Friday" }
];

//  "enumValues": [
//"week",
//"month",
//"midterm",
//"final"
//],

export const examTypes = [
    { id: "week", labelAr: "اسبوعي", labelEn: "Weekly" },
    { id: "month", labelAr: "شهري", labelEn: "Monthly" },
    { id: "midterm", labelAr: "ميد ترم", labelEn: "Midterm" },
    { id: "final", labelAr: "فينال", labelEn: "Final" }
];

export const YES_OR_NO_ARR = [
    { id: "true", labelAr: "نعم", labelEn: "Yes" },
    { id: "false", labelAr: "لا", labelEn: "No" }
];

export const ticketTypes=[
    { id: "complaint", labelAr: "شكوى", labelEn: "Complaint" },
    { id: "suggestion", labelAr: "مقترح", labelEn: "Suggestion" },
    { id: "postgraduate_studies", labelAr: "طلب دراسات عليا", labelEn: "Postgraduate Studies" },
    { id: "university_card", labelAr: "طلب بطاقة جامعية", labelEn: "University Card Request" },
    { id: "university_certificate", labelAr: "طلب إفادة جامعية", labelEn: "University Certificate Request" },
    { id: "graduation_certificate", labelAr: "طلب إفادة تخرج", labelEn: "Graduation Certificate Request" },
    { id: "success_statement", labelAr: "طلب بيان نجاح", labelEn: "Success Statement Request" },
    { id: "registration_suspension", labelAr: "إيقاف قيد", labelEn: "Registration Suspension" },
    { id: "graduation_enrollment", labelAr: "قيد تخرج", labelEn: "Graduation Enrollment" }
];

export const isOpen = [
    { id: "open", labelAr: "مفتوح", labelEn: "Open" },
    { id: "closed", labelAr: "مغلق", labelEn: "Closed" }
];