import { useNavigate } from 'react-router-dom';
import { Button } from '../components';


  const AddUser = () => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  }

  function FormUser(){
    return(
      <form onSubmit={handleClick}>
        <label>
          Nom:
          <input type="text" name="Nom" />
        </label>
        <br />

        <label>
          Prénom:
          <input type="text" name="Prénom" />
        </label>

        <br />
        <label>
          Email:
          <input type="email" name="email" />
        </label>
        
        <br />
        <Button>Add User</Button>
      </form>
    );
  }

  return <FormUser />;
}

export default AddUser;