import { gql } from "@apollo/client";

/* 🟩 1. Queries */
export const GetWebsiteArticles = gql`
  query GetWebsiteArticles {
    getWebsiteArticles {
      id
      title_ar
      title_en
      desc_ar
      desc_en
      article_date
      images_array
      main_image
      status
      website_department_id
      users_id
      createdAt
      updatedAt
    }
  }
`;

export const ArticalesById = gql`
  query ArticalesById($departmentId: ID!) {
    getArticlesByDepartment(departmentId: $departmentId) {
      id
      title_ar
      title_en
      desc_ar
      desc_en
      article_date
      images_array
      main_image
      status
      website_department_id
      users_id
      createdAt
      updatedAt
    }
  }
`;


// {  "input": {
//   "title_ar": "حدث 1",
//   "title_en": "Event 1",
//   "desc_ar": " وصف الحدث الاول",
//   "desc_en": "Event 1 description."  ,
//   "article_date": "2025-10-15",
//   "status": "published",
// "images_array": ["http://178.128.38.212:3000/static/media/DomiDriverImage.a676f0b4ae9f0e6bb5f0.png", "http://178.128.38.212:3000/uploads/users/user_1760532623754.jpg"],
// "main_image": "http://178.128.38.212:3000/uploads/users/user_1760532623754.jpg",
//   "website_department_id": "68ef93c7023da961743a05cc",
//   "users_id": "68e4e04a59e04cc5200c0080"
// },}


// "images_array": ["http://178.128.38.212:3000/uploads/users/user_1760532623754.jpg", "http://178.128.38.212:3000/uploads/users/user_1760532623754.jpg"],
// "main_image": "http://178.128.38.212:3000/uploads/users/user_1760532623754.jpg",

