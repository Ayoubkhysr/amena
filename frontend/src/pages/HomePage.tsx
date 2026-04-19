import { Button } from "../components";
//import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate  = useNavigate();
  
  const handleAddUser = () => {
    navigate('/add-user');
  };

  const handleAdminDashboard = () => {
    navigate('/admin');
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Al Amine
        </h1>

        <div className="flex gap-4 justify-center">
        
          <Button variant="outline" onClick={handleAddUser}>
            Ajouter un utilisateur
          </Button>
          <Button onClick={handleAdminDashboard}>
            Ouvrir le dashboard admin
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
