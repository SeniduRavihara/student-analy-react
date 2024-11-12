import { useParams } from "react-router-dom";

const AddResultsPage = () => {
    const { examId } = useParams();

    console.log(examId);
    
  return (
    <div>AddResultsPage</div>
  )
}
export default AddResultsPage