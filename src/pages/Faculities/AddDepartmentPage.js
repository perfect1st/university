import { useMutation } from "@apollo/client/react"
import { CREATE_FACULITY_DEPARTMENT } from "../../graphql/facultyQuiries";

export default function AddDepartmentPage() {

    const[]=useMutation(CREATE_FACULITY_DEPARTMENT,{fetchPolicy:"network-only"});
  return (
    <div>AddDepartmentPage</div>
  )
}
