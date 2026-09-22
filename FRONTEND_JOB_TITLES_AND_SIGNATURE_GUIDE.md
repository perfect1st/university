# دليل التكامل مع الفرونت إند: مسميات الموظفين وتوقيع المستخدم
# Frontend Integration Guide: Job Titles & User Signature

يوفر هذا الدليل توثيقاً شاملاً للتعديلات التي تمت في الباك إند لإضافة موديول **مسميات الموظفين (Job Titles)** وربطها بموديول **المستخدمين (Users)**، بالإضافة إلى إضافة حقل رابط صورة التوقيع (`signature`) لكل مستخدم.

---

## 📌 الفهرس
1. [موديول مسميات الموظفين (JobTitle Module)](#1-موديول-مسميات-الموظفين-jobtitle-module)
2. [التحديثات على موديول المستخدم (User Module Updates)](#2-التحديثات-على-موديول-المستخدم-user-module-updates)
3. [آلية رفع صورة التوقيع (Signature Upload Flow)](#3-آلية-رفع-صورة-التوقيع-signature-upload-flow)
4. [استعلامات وطفرات GraphQL (GraphQL Queries & Mutations)](#4-استعلامات-وطفرات-graphql-graphql-queries--mutations)
5. [أمثلة عملية للفرونت إند (Frontend Code Examples - React)](#5-أمثلة-عملية-للفرونت-إند-frontend-code-examples---react)

---

## 1. موديول مسميات الموظفين (JobTitle Module)

تم إنشاء موديول مستقل لإدارة الرتب والمسميات الوظيفية (مثل: عميد كلية، وكيل كلية، رئيس قسم، رئيس الجامعة، نائب رئيس الجامعة، إلخ).

### هيكل كائن المسمى الوظيفي (`JobTitle`):

| الحقل (Field) | النوع (Type) | الوصف |
| :--- | :--- | :--- |
| `id` | `ID!` | المعرف الفريد للمسمى الوظيفي |
| `serial` | `Int` | الرقم التسلسلي التلقائي |
| `name_ar` | `String!` | المسمى الوظيفي بالعربية (مثال: "عميد كلية") |
| `name_en` | `String!` | المسمى الوظيفي بالإنجليزية (مثال: "Dean") |
| `status` | `Boolean` | حالة التفعيل (`true` / `false`) |
| `createdAt` | `String` | تاريخ الإنشاء |
| `updatedAt` | `String` | تاريخ آخر تعديل |

> [!NOTE]
> يقوم الباك إند تلقائياً بإنشاء قائمة مسميات افتراضية شائعة (Seeder) بمجرد تشغيل الاستعلامات إذا كانت القائمة فارغة.

---

## 2. التحديثات على موديول المستخدم (User Module Updates)

تمت إضافة حقلين جديدين على كيان المستخدم (`User`):

1. **`job_title_id` (`JobTitle`)**:
   - يحتوي على كائن المسمى الوظيفي للمستخدم (يتضمن `id`, `name_ar`, `name_en`, `status`).
   - يدعم أيضاً الاسم البديل `job_title`.
2. **`signature` (`String`)**:
   - يخزن رابط صورة التوقيع (URL) الخاص بالموظف/المسؤول بعد رفعها عبر خادم الملفات.
   - يدعم أيضاً الاسم البديل `signature_image`.

### في مدخلات الإنشاء والتعديل (`AdminCreateUserInput` و `UpdateUserInput`):
- `job_title_id`: معرف المسمى الوظيفي (`ID`).
- `signature`: رابط صورة التوقيع (`String`).

---

## 3. آلية رفع صورة التوقيع (Signature Upload Flow)

لا يتم إرسال ملف الصورة مباشرة داخل GraphQL، بل يتم الرفع أولاً عبر Endpoint الـ REST API المتاح مسبقاً:

```text
POST /api/users/single
أو
POST /api/signatures/single
Content-Type: multipart/form-data
Body: file: [ملف صورة التوقيع PNG/JPG/WEBP]
```

**الاستجابة:**
```json
{
  "success": true,
  "url": "/uploads/users/1727000000000-signature.png"
}
```

بعد استلام الرابط `url`، يتم تمريره في استدعاء GraphQL داخل حقل `signature`.

---

## 4. استعلامات وطفرات GraphQL (GraphQL Queries & Mutations)

### أ) استعلامات مسميات الموظفين:

#### 1. جلب المسميات النشطة فقط (للقوائم المنسدلة Dropdown):
```graphql
query GetActiveJobTitles {
  getActiveJobTitles {
    id
    serial
    name_ar
    name_en
    status
  }
}
```

#### 2. جلب جميع المسميات مع الترقيم والبحث (لشاشة إدارة المسميات):
```graphql
query GetFilteredJobTitles($search: String, $status: Boolean, $page: Int, $limit: Int) {
  filteredPagedJobTitles(search: $search, status: $status, page: $page, limit: $limit) {
    total
    jobTitles {
      id
      serial
      name_ar
      name_en
      status
      createdAt
    }
  }
}
```

#### 3. إنشاء مسمى وظيفي جديد:
```graphql
mutation CreateJobTitle($input: CreateJobTitleInput!) {
  createJobTitle(input: $input) {
    id
    name_ar
    name_en
    status
  }
}
# متغيرات (Variables):
# {
#   "input": {
#     "name_ar": "مسؤول شؤون الخريجين",
#     "name_en": "Alumni Officer",
#     "status": true
#   }
# }
```

#### 4. تعديل مسمى وظيفي:
```graphql
mutation UpdateJobTitle($id: ID!, $input: UpdateJobTitleInput!) {
  updateJobTitle(id: $id, input: $input) {
    id
    name_ar
    name_en
    status
  }
}
```

#### 5. تبديل حالة التفعيل / حذف:
```graphql
mutation ToggleJobTitle($id: ID!, $status: Boolean!) {
  toggleJobTitle(id: $id, status: $status) {
    id
    status
  }
}

mutation DeleteJobTitle($id: ID!) {
  deleteJobTitle(id: $id)
}
```

---

### ب) استعلامات وطفرات المستخدم (مع المسمى والتوقيع):

#### 1. جلب المستخدمين (يشمل المسمى والتوقيع):
```graphql
query GetUsers {
  users {
    id
    fullname
    username
    email
    role
    status
    signature
    job_title_id {
      id
      name_ar
      name_en
    }
    faculty_id {
      id
      title_ar
    }
  }
}
```

#### 2. إنشاء مستخدم مسؤول مع مسمى وظيفي وتوقيع:
```graphql
mutation CreateAdminUser($input: AdminCreateUserInput!) {
  createUser(input: $input) {
    id
    username
    fullname
    email
    role
    signature
    job_title_id {
      id
      name_ar
      name_en
    }
  }
}
# متغيرات (Variables):
# {
#   "input": {
#     "username": "dean_cs",
#     "fullname": "د. أحمد علي",
#     "email": "dean.cs@university.edu",
#     "password": "StrongPassword123",
#     "role": "admin",
#     "faculty_id": "64f1a2...",
#     "job_title_id": "64f1b5...",
#     "signature": "/uploads/users/dean-signature.png",
#     "status": true
#   }
# }
```

#### 3. تحديث مسمى الموظف أو توقيعه:
```graphql
mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
  updateUser(id: $id, input: $input) {
    id
    fullname
    signature
    job_title_id {
      id
      name_ar
      name_en
    }
  }
}
# متغيرات (Variables):
# {
#   "id": "64f1c9...",
#   "input": {
#     "job_title_id": "64f1b5...",
#     "signature": "/uploads/users/new-signature.png"
#   }
# }
```

#### 4. جلب المستخدم الحالي (`me`):
```graphql
query GetMe {
  me {
    id
    fullname
    role
    signature
    job_title_id {
      id
      name_ar
      name_en
    }
  }
}
```

---

## 5. أمثلة عملية للفرونت إند (Frontend Code Examples - React)

### مثال على دالة رفع التوقيع ثم حفظ المستخدم:

```javascript
import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';

export function EditAdminProfileModal({ user, onClose }) {
  const [jobTitleId, setJobTitleId] = useState(user?.job_title_id?.id || '');
  const [signatureUrl, setSignatureUrl] = useState(user?.signature || '');
  const [uploading, setUploading] = useState(false);

  // جلب قائمة المسميات الوظيفية للقائمة المنسدلة
  const { data: jobTitlesData } = useQuery(GET_ACTIVE_JOB_TITLES);
  const [updateUser, { loading: updating }] = useMutation(UPDATE_USER_MUTATION);

  // دالة رفع التوقيع
  const handleSignatureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:5000/api/users/single', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setSignatureUrl(data.url);
      } else {
        alert(data.error || 'فشل رفع صورة التوقيع');
      }
    } catch (err) {
      alert('خطأ أثناء الرفع: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  // حفظ التعديلات
  const handleSave = async () => {
    await updateUser({
      variables: {
        id: user.id,
        input: {
          job_title_id: jobTitleId || null,
          signature: signatureUrl || null,
        },
      },
    });
    onClose();
  };

  return (
    <div className="modal">
      <h3>تعديل بيانات المسؤول</h3>

      {/* اختيار المسمى الوظيفي */}
      <label>المسمى الوظيفي:</label>
      <select value={jobTitleId} onChange={(e) => setJobTitleId(e.target.value)}>
        <option value="">-- اختر المسمى الوظيفي --</option>
        {jobTitlesData?.getActiveJobTitles?.map((jt) => (
          <option key={jt.id} value={jt.id}>
            {jt.name_ar} - {jt.name_en}
          </option>
        ))}
      </select>

      {/* رفع صورة التوقيع */}
      <label>صورة التوقيع:</label>
      <input type="file" accept="image/*" onChange={handleSignatureUpload} />
      {uploading && <p>جاري رفع صورة التوقيع...</p>}

      {/* معاينة صورة التوقيع */}
      {signatureUrl && (
        <div style={{ marginTop: 10 }}>
          <p>معاينة التوقيع:</p>
          <img
            src={`http://localhost:5000${signatureUrl}`}
            alt="التوقيع"
            style={{ maxHeight: 100, border: '1px solid #ccc', padding: 4 }}
          />
        </div>
      )}

      <button onClick={handleSave} disabled={updating || uploading}>
        {updating ? 'جاري الحفظ...' : 'حفظ'}
      </button>
    </div>
  );
}
```
