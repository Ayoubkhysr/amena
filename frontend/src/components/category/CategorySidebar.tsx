import { useState, useEffect } from 'react';

export interface FilterSection {
  title: string;
  options: string[];
}

interface CategorySidebarProps {
  filters: FilterSection[];
  selectedFilters: Record<string, string[]>;
  minPriceValue?: number;
  maxPriceValue?: number;
  onFilterChange?: (selectedFilters: Record<string, string[]>) => void;
  onPriceChange?: (min: number | undefined, max: number | undefined) => void;
}

const CategorySidebar = ({ filters, selectedFilters, minPriceValue, maxPriceValue, onFilterChange, onPriceChange }: CategorySidebarProps) => {


  const handleCheckboxChange = (filterTitle: string, option: string, isChecked: boolean) => {
    const newSelected = { ...selectedFilters };
    if (!newSelected[filterTitle]) {
      newSelected[filterTitle] = [];
    }

    if (isChecked) {
      newSelected[filterTitle].push(option);
    } else {
      newSelected[filterTitle] = newSelected[filterTitle].filter(item => item !== option);
    }

    if (onFilterChange) {
      onFilterChange(newSelected);
    }
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (onPriceChange) {
      const min = val === '' ? undefined : parseFloat(val);
      onPriceChange(min, maxPriceValue);
    }
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (onPriceChange) {
      const max = val === '' ? undefined : parseFloat(val);
      onPriceChange(minPriceValue, max);
    }
  };

  return (
    <div className="w-full md:w-64 flex-shrink-0">
      <div className="bg-white border border-blue-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-gray-800 text-sm mb-6 uppercase tracking-wide">
          Filtres principaux
        </h3>
        
        <div className="space-y-8">
          {/* Categories / Options */}
          {filters.map((filter, idx) => (
            <div key={idx}>
              <h4 className="text-sm font-semibold text-gray-700 mb-4">{filter.title}</h4>
              <div className="space-y-3">
                {filter.options.map((option, i) => (
                  <label key={i} className="flex items-center space-x-3 text-sm text-gray-600 cursor-pointer w-full py-1.5">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-blue-500 focus:ring-blue-500 w-4 h-4 min-w-4"
                      checked={selectedFilters[filter.title]?.includes(option) || false}
                      onChange={(e) => handleCheckboxChange(filter.title, option, e.target.checked)}
                    />
                    <span className="flex-1">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          {/* Prix */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Prix</h4>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                placeholder="Min" 
                value={minPriceValue ?? ''}
                onChange={handleMinPriceChange}
                className="w-full min-w-0 px-3 py-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500" 
              />
              <span className="text-gray-400 flex-shrink-0">-</span>
              <input 
                type="number" 
                placeholder="Max" 
                value={maxPriceValue ?? ''}
                onChange={handleMaxPriceChange}
                className="w-full min-w-0 px-3 py-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500" 
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CategorySidebar;
