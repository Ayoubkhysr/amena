import { useNavigate } from "react-router-dom";
import { Button } from '../components';
import FormUser from './Forum';

const AddUser = () => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  }

  return (
  <div>
    
    <div>
      <FormUser onSubmit={handleClick}/>
    </div>

    <div className="flex gap-4 justify-center">
    <Button variant="outline" onClick={handleClick}>
      <h1>retour</h1> 
    </Button>
    </div>
  </div>
  )
}
export default AddUser