import React from 'react';
import GraduationCertificate from '../components/Certificates/GraduationCertificate';

const TestCertificatePage = () => {
  const dummyData = {
    nameEn: "Mr. Omar Salem M Ba-Dhufr",
    nameAr: "عمر سالم محمد باظفر",
    nationalityEn: "Yemeni",
    nationalityAr: "يمني",
    academicYear: "2019 / 2020",
    graduationYear: "2022 / 2023",
    collegeEn: "Engineering and Computer science",
    collegeAr: "الهندسة وعلوم الحاسوب",
    majorEn: "Information Systems",
    majorAr: "نظم المعلومات",
    gradeEn: "Very Good",
    gradeAr: "جيد جداً",
    registrationNo: "123456",
    councilNo: "789",
    studentPhoto: "https://via.placeholder.com/150",
    barcodeNumber: "1034578451125"
  };

  return (
    <div style={{ padding: '50px', background: '#f0f0f0', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <button 
        onClick={() => window.print()}
        style={{
          padding: '10px 25px',
          background: '#095690',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '16px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
        className="no-print"
      >
        Print Certificate
      </button>
      <div id="printable-certificate">
        <GraduationCertificate studentData={dummyData} />
      </div>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-certificate, #printable-certificate * { visibility: visible; }
          #printable-certificate { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default TestCertificatePage;
