import { useQuery } from "@apollo/client";
import {
  GET_SIGNATURES_BY_FACULTY,
  GET_UNIV_SIGNATURES,
} from "../graphql/signatures";

/**
 * A custom hook to fetch all required signatures for rendering a document.
 * It will fetch both university level signatures and faculty level signatures.
 * 
 * @param {Object} params
 * @param {string} params.faculty_id - The ID of the faculty
 * @returns {Object} { signatures, loading, error }
 * 
 * @example
 * const { signatures } = useDocumentSignatures({ faculty_id: user.faculty_id.id });
 * 
 * // Accessing a specific signature:
 * const deanSig = signatures.find(s => s.role_title === "dean");
 * if (deanSig) {
 *    renderImage(deanSig.signature_image);
 * }
 */
const useDocumentSignatures = ({ faculty_id } = {}) => {
  const { data: facultyData, loading: loadingFac, error: errorFac } = useQuery(
    GET_SIGNATURES_BY_FACULTY,
    {
      variables: { faculty_id },
      skip: !faculty_id,
      fetchPolicy: "cache-first",
    }
  );

  const { data: univData, loading: loadingUniv, error: errorUniv } = useQuery(
    GET_UNIV_SIGNATURES,
    {
      fetchPolicy: "cache-first",
    }
  );

  const loading = loadingFac || loadingUniv;
  const error = errorFac || errorUniv;

  const signatures = [
    ...(facultyData?.getSignaturesByFaculty || []),
    ...(univData?.getUniversityLevelSignatures || []),
  ];

  return {
    signatures,
    loading,
    error,
  };
};

export default useDocumentSignatures;
