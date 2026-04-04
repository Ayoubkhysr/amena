import { Button } from "../components";

function HomePage() {
  const handleClick = () => {
    console.log("Button clicked!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Amena
        </h1>
        <p className="text-gray-600 mb-6">
          React + Vite + Tailwind CSS + React Router
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="primary" onClick={handleClick}>
            Primary
          </Button>
          <Button variant="secondary" onClick={handleClick}>
            Secondary
          </Button>
          <Button variant="outline" onClick={handleClick}>
            Outline
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
