export interface FilterSection {
  title: string;
  options: string[];
}

interface CategorySidebarProps {
  filters: FilterSection[];
}

const CategorySidebar = ({ filters }: CategorySidebarProps) => {
  return (
    <div className="w-full md:w-64 flex-shrink-0">
      <div className="bg-white border border-blue-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-gray-800 text-sm mb-6 uppercase tracking-wide">
          Filtres principaux
        </h3>

        {/* Dynamic Filters */}
        {filters.map((filter, index) => (
          <div key={index} className="mb-6">
            <h4 className="text-xs font-semibold text-gray-700 mb-3">{filter.title}</h4>
            <div className="space-y-2">
              {filter.options.map((option, i) => (
                <label key={i} className="flex items-center space-x-2 text-xs text-gray-600 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        {/* Prix */}
        <div>
          <h4 className="text-xs font-semibold text-gray-700 mb-3">Price</h4>
          <div className="flex items-center space-x-2">
            <input 
              type="text" 
              placeholder="Min" 
              className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500" 
            />
            <span className="text-gray-400">-</span>
            <input 
              type="text" 
              placeholder="Max" 
              className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500" 
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default CategorySidebar;
