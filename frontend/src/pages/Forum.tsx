import React from 'react';
import { Button } from '../components';

interface FormUserProps {
  onSubmit: () => void;
}

const FormUser = ({ onSubmit }: FormUserProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  return(
    <form onSubmit={handleSubmit}>
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
      <Button type="submit">Add User</Button>
    </form>
  );
}

export default FormUser;