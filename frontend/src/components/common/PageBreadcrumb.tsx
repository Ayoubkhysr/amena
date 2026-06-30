import { Link } from 'react-router-dom';

interface PageBreadcrumbProps {
  pageName: string;
}

const PageBreadcrumb = ({ pageName }: PageBreadcrumbProps) => {
  return (
    <div className="w-full bg-white pt-4 pb-2">
      <div className="max-w-7xl mx-auto px-8 text-xs text-gray-400 font-medium">
        <Link to="/" className="hover:text-blue-600">Accueil</Link>
        <span className="mx-2">&gt;</span>
        <span className="text-gray-600">{pageName}</span>
      </div>
    </div>
  );
};

export default PageBreadcrumb;
