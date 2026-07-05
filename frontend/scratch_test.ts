import fs from 'fs';

// Mock context to test what toApiRequest does
const categories = [
  { id: '1', name: 'Sol et Surface' },
  { id: '2', name: 'Lave Sol', parentId: '1' },
  { id: '3', name: 'Nettoyant', parentId: '1' }
];

function categoryNameToId(name: string, categories: any[]): number | undefined {
  const category = categories.find((item) => item.name.trim() === name.trim())
  return category ? Number(category.id) : undefined
}

const product = {
  name: 'Lave Sol Mauve',
  category: 'Sol et Surface',
  subcategories: ['Lave Sol'],
  price: 3.70,
  stock: 50,
  status: 'Actif',
};

const categoryId = product.category ? categoryNameToId(product.category, categories) : undefined

const subcategoryIds = (product.subcategories ?? [])
  .map((subName) => {
    let found = categories.find((item) => item.name.trim() === subName.trim() && Number(item.parentId) === categoryId)
    if (!found) {
      found = categories.find((item) => item.name.trim() === subName.trim())
    }
    return found ? Number(found.id) : undefined
  })
  .filter((id): id is number => id !== undefined)

console.log("CategoryId:", categoryId);
console.log("SubcategoryIds:", subcategoryIds);
