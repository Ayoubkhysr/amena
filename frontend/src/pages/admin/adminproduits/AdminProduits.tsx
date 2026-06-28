import React, { useEffect, useMemo, useState } from 'react'
import { IconPackage, IconTag, IconEye, IconArchive } from '../../../components/admin'
import { Product, Category } from '../../../context/StoreContext'
import { resolveImageUrl } from '../../../services/productService'

type ProductSortKey = 'id' | 'name' | 'category' | 'price' | 'stock' | 'status'
type SortOrder = 'asc' | 'desc'

const compareProducts = (a: Product, b: Product, sortBy: ProductSortKey, order: SortOrder) => {
  let cmp = 0
  switch (sortBy) {
    case 'id':
      cmp = a.id.localeCompare(b.id, 'fr', { numeric: true, sensitivity: 'base' })
      break
    case 'name':
      cmp = a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' })
      break
    case 'category':
      cmp = a.category.localeCompare(b.category, 'fr', { sensitivity: 'base' })
      break
    case 'price':
      cmp = a.price - b.price
      break
    case 'stock':
      cmp = a.stock - b.stock
      break
    case 'status':
      cmp = a.status.localeCompare(b.status, 'fr', { sensitivity: 'base' })
      break
  }
  return order === 'asc' ? cmp : -cmp
}

type ProductListToolbarProps = {
  searchId: string
  searchName: string
  searchCategory: string
  sortBy: ProductSortKey
  sortOrder: SortOrder
  categories: Category[]
  onSearchIdChange: (value: string) => void
  onSearchNameChange: (value: string) => void
  onSearchCategoryChange: (value: string) => void
  onSortByChange: (value: ProductSortKey) => void
  onSortOrderChange: (value: SortOrder) => void
  onReset: () => void
}

function ProductListToolbar({
  searchId,
  searchName,
  searchCategory,
  sortBy,
  sortOrder,
  categories,
  onSearchIdChange,
  onSearchNameChange,
  onSearchCategoryChange,
  onSortByChange,
  onSortOrderChange,
  onReset,
}: ProductListToolbarProps) {
  const hasFilters = Boolean(searchId.trim() || searchName.trim() || searchCategory)

  return (
    <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Recherche et tri</p>
        {hasFilters ? (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-bold text-brand-blue hover:text-brand-light"
          >
            Réinitialiser
          </button>
        ) : null}
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">ID produit</label>
          <input
            type="text"
            value={searchId}
            onChange={(e) => onSearchIdChange(e.target.value)}
            placeholder="Ex: P01"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">Nom du produit</label>
          <input
            type="text"
            value={searchName}
            onChange={(e) => onSearchNameChange(e.target.value)}
            placeholder="Ex: Détergent"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">Catégorie</label>
          <select
            value={searchCategory}
            onChange={(e) => onSearchCategoryChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">Trier par</label>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as ProductSortKey)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
          >
            <option value="name">Nom</option>
            <option value="id">ID</option>
            <option value="category">Catégorie</option>
            <option value="price">Prix</option>
            <option value="stock">Stock</option>
            <option value="status">Statut</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">Ordre</label>
          <select
            value={sortOrder}
            onChange={(e) => onSortOrderChange(e.target.value as SortOrder)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
          >
            <option value="asc">Croissant</option>
            <option value="desc">Décroissant</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export type AdminProduitsProps = {
  products: Product[]
  activeSection: string
  categories: Category[]
  handleEditProduct?: (p: Product) => void | Promise<void>
  handleAddProduct?: (p: Product) => void | Promise<void>
  handleDeleteProduct?: (productId: string) => void | Promise<void>
  handleAddCategory?: (cat: string) => void
  handleDeleteCategory?: (cat: string) => void
  handleEditCategory?: (oldCat: string, newCat: string) => void
}

export function AdminProduits({ products, activeSection, categories, handleEditProduct, handleAddProduct, handleDeleteProduct, handleAddCategory, handleDeleteCategory, handleEditCategory }: AdminProduitsProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Product | null>(null)
  
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '', category: categories[0]?.name || 'Autre', price: 0, stock: 0, status: 'Actif', imageUrl: '', description: ''
  })

  const [newCat, setNewCat] = useState('')
  const [editingCat, setEditingCat] = useState<{old: string, new: string} | null>(null)
  const [searchId, setSearchId] = useState('')
  const [searchName, setSearchName] = useState('')
  const [searchCategory, setSearchCategory] = useState('')
  const [sortBy, setSortBy] = useState<ProductSortKey>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [newProductImageFile, setNewProductImageFile] = useState<File | null>(null)
  const [newProductImagePreview, setNewProductImagePreview] = useState('')
  const [editProductImageFile, setEditProductImageFile] = useState<File | null>(null)
  const [editProductImagePreview, setEditProductImagePreview] = useState('')

  const revokePreview = (preview: string) => {
    if (preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }
  }

  useEffect(() => {
    return () => {
      revokePreview(newProductImagePreview)
      revokePreview(editProductImagePreview)
    }
  }, [newProductImagePreview, editProductImagePreview])

  const resetNewProductForm = () => {
    revokePreview(newProductImagePreview)
    setNewProductImageFile(null)
    setNewProductImagePreview('')
    setNewProduct({
      name: '',
      category: categories[0]?.name || 'Autre',
      price: 0,
      stock: 0,
      status: 'Actif',
      imageUrl: '',
      description: '',
    })
  }

  const resetEditProductImage = () => {
    revokePreview(editProductImagePreview)
    setEditProductImageFile(null)
    setEditProductImagePreview('')
  }

  const handleNewProductImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide (JPEG, PNG, WebP ou GIF).')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("L'image ne doit pas dépasser 5 Mo.")
      return
    }
    setNewProductImageFile(file)
    setNewProductImagePreview((prev) => {
      revokePreview(prev)
      return URL.createObjectURL(file)
    })
    event.target.value = ''
  }

  const handleEditProductImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide (JPEG, PNG, WebP ou GIF).')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("L'image ne doit pas dépasser 5 Mo.")
      return
    }
    setEditProductImageFile(file)
    setEditProductImagePreview((prev) => {
      revokePreview(prev)
      return URL.createObjectURL(file)
    })
    event.target.value = ''
  }

  const resetListFilters = () => {
    setSearchId('')
    setSearchName('')
    setSearchCategory('')
    setSortBy('name')
    setSortOrder('asc')
  }

  const isProductList = activeSection === 'produits-liste'
  const isRuptureView = activeSection === 'produits-rupture'
  const isListTableView = isProductList || isRuptureView
  const hasActiveFilters = Boolean(searchId.trim() || searchName.trim() || searchCategory)

  const baseProducts = useMemo(() => {
    if (isRuptureView) {
      return products.filter(p => p.stock <= 5 || p.status === 'Rupture')
    }
    return products
  }, [products, isRuptureView])

  const filteredProducts = useMemo(() => {
    if (!isListTableView) return []

    const idQuery = searchId.trim().toLowerCase()
    const nameQuery = searchName.trim().toLowerCase()

    let result = baseProducts.filter((product) => {
      if (isProductList && idQuery && !product.id.toLowerCase().includes(idQuery)) return false
      if (isProductList && nameQuery && !product.name.toLowerCase().includes(nameQuery)) return false
      if (isProductList && searchCategory && product.category !== searchCategory) return false
      return true
    })

    if (isProductList) {
      result = [...result].sort((a, b) => compareProducts(a, b, sortBy, sortOrder))
    }

    return result
  }, [baseProducts, isListTableView, isProductList, searchId, searchName, searchCategory, sortBy, sortOrder])
  
  if (activeSection === 'produits-ajouter') {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-admin-panel-in">
        <header className="mb-6">
          <h3 className="text-lg font-bold text-brand-blue">Ajouter un nouveau produit</h3>
          <p className="text-sm text-slate-500">Remplissez les informations ci-dessous pour créer une nouvelle fiche produit.</p>
        </header>
        <form className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Nom du produit</label>
              <input type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue" placeholder="Ex: Détergent Sol Pro" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Catégorie</label>
              <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue">
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Prix (TND)</label>
              <input type="number" step="0.01" value={newProduct.price || ''} onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue" placeholder="Ex: 15.50" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Stock initial</label>
              <input type="number" value={newProduct.stock || ''} onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value)})} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue" placeholder="Ex: 50" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Image du produit</label>
              <div className="flex flex-wrap items-center gap-3">
                <label className="cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
                  Choisir une image
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleNewProductImageUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-slate-500">JPEG, PNG, WebP ou GIF — max. 5 Mo</span>
                {newProductImagePreview ? (
                  <img
                    src={newProductImagePreview}
                    alt="Aperçu produit"
                    className="h-14 w-14 rounded-lg object-cover border border-slate-200 bg-white"
                  />
                ) : null}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
            <textarea rows={4} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue" placeholder="Description détaillée du produit..."></textarea>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={resetNewProductForm} className="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors">Annuler</button>
            <button type="button" onClick={async () => {
                if (handleAddProduct && newProduct.name?.trim()) {
                await handleAddProduct({
                  id: '',
                  name: newProduct.name.trim(),
                  category: newProduct.category || categories[0]?.name || 'Autre',
                  price: newProduct.price || 0,
                  stock: newProduct.stock || 0,
                  status: (newProduct.stock || 0) > 5 ? 'Actif' : 'Rupture',
                  description: newProduct.description || '',
                  pendingImageFile: newProductImageFile ?? undefined,
                })
                resetNewProductForm()
                alert('Produit ajouté !')
              }
            }} className="rounded-xl bg-brand-blue px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-brand-light transition-colors">Enregistrer le produit</button>
          </div>
        </form>
      </div>
    )
  }

  if (activeSection === 'produits-categories') {
    const categoriesStats = categories.map(cat => ({
      name: cat.name,
      count: products.filter(p => p.category === cat.name).length
    }))

    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-admin-panel-in">
        <header className="mb-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-brand-blue">Gestion des catégories</h3>
              <p className="text-sm text-slate-500">Ajoutez, modifiez ou supprimez les catégories de produits.</p>
            </div>
            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={newCat} 
                    onChange={e => setNewCat(e.target.value)}
                    placeholder="Nouvelle catégorie..." 
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
                />
                <button 
                    onClick={() => {
                        if (newCat.trim() && handleAddCategory) {
                            handleAddCategory(newCat.trim());
                            setNewCat('');
                        }
                    }}
                    className="bg-brand-blue text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-brand-light"
                >Ajouter</button>
            </div>
        </header>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categoriesStats.map(({name, count}) => {
            const isEditing = editingCat?.old === name;
            return (
            <div key={name} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm flex flex-col items-center flex-col relative group">
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                 <button onClick={() => setEditingCat({old: name, new: name})} className="text-slate-400 hover:text-brand-blue"><IconEye className="w-4 h-4" /></button>
                 <button onClick={() => {
                   if (count > 0 && !window.confirm(`Vous avez ${count} produit(s) dans la catégorie "${name}". Si vous supprimez, ils iront dans "Autre". Procéder ?`)) return;
                   if (handleDeleteCategory) handleDeleteCategory(name);
                 }} className="text-slate-400 hover:text-red-500"><IconArchive className="w-4 h-4" /></button>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-brand-blue border border-slate-200 mb-4 shadow-sm">
                <IconTag className="h-6 w-6" />
              </div>
              {isEditing ? (
                  <div className="flex items-center gap-2 mt-1">
                      <input 
                        type="text" 
                        value={editingCat.new} 
                        onChange={e => setEditingCat({...editingCat, new: e.target.value})}
                        className="rounded border border-slate-300 px-2 py-1 text-sm font-bold text-center w-full max-w-[120px]"
                      />
                      <button onClick={() => {
                          if (handleEditCategory && editingCat.new.trim()) handleEditCategory(editingCat.old, editingCat.new.trim());
                          setEditingCat(null);
                      }} className="bg-brand-blue text-white rounded px-2 py-1 text-xs font-bold">OK</button>
                  </div>
              ) : (
                  <h4 className="text-base font-bold text-slate-800">{name}</h4>
              )}
              <span className="mt-2 rounded-full bg-white border border-slate-200 px-3 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">{count} produit(s)</span>
            </div>
          )})}
        </div>
      </div>
    )
  }

  let title = 'Liste des produits'
  if (isRuptureView) {
    title = 'Produits en rupture ou stock faible'
  }

  if (baseProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-brand-surface py-24 text-center animate-admin-panel-in">
        <IconPackage className="h-8 w-8 text-Brand-light mb-4 opacity-50" />
        <h3 className="text-lg font-bold text-brand-blue">Aucun produit trouvé</h3>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          Il n'y a aucun produit à afficher dans cette vue.
        </p>
      </div>
    )
  }

  if (isProductList && filteredProducts.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm animate-admin-panel-in">
        <header className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand-blue">{title}</h3>
          <span className="text-xs font-medium text-slate-500">0 produit(s)</span>
        </header>
        <ProductListToolbar
          searchId={searchId}
          searchName={searchName}
          searchCategory={searchCategory}
          sortBy={sortBy}
          sortOrder={sortOrder}
          categories={categories}
          onSearchIdChange={setSearchId}
          onSearchNameChange={setSearchName}
          onSearchCategoryChange={setSearchCategory}
          onSortByChange={setSortBy}
          onSortOrderChange={setSortOrder}
          onReset={resetListFilters}
        />
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-brand-surface py-16 text-center">
          <IconPackage className="h-8 w-8 text-brand-light mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-brand-blue">Aucun résultat</h3>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            Aucun produit ne correspond à vos critères de recherche.
          </p>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={resetListFilters}
              className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              Réinitialiser les filtres
            </button>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm animate-admin-panel-in">
      <header className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-brand-blue">{title}</h3>
        <span className="text-xs font-medium text-slate-500">
          {filteredProducts.length} produit(s){hasActiveFilters && isProductList ? ` / ${baseProducts.length}` : ''}
        </span>
      </header>
      {isProductList ? (
        <ProductListToolbar
          searchId={searchId}
          searchName={searchName}
          searchCategory={searchCategory}
          sortBy={sortBy}
          sortOrder={sortOrder}
          categories={categories}
          onSearchIdChange={setSearchId}
          onSearchNameChange={setSearchName}
          onSearchCategoryChange={setSearchCategory}
          onSortByChange={setSortBy}
          onSortOrderChange={setSortOrder}
          onReset={resetListFilters}
        />
      ) : null}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 bg-slate-50">
              <th className="px-4 py-3 rounded-tl-lg">ID</th>
              <th className="px-4 py-3">Produit</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">Prix</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              const isEditing = editingId === product.id;

              if (isEditing && editForm) {
                return (
                  <React.Fragment key={product.id}>
                    <tr className="bg-brand-blue/5">
                    <td className="px-4 py-4 font-semibold text-slate-500">{product.id}</td>
                    <td className="px-4 py-4">
                      <input 
                        type="text" 
                        value={editForm.name} 
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm focus:border-brand-blue focus:outline-none"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <select 
                        value={editForm.category}
                        onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                        className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm focus:border-brand-blue focus:outline-none"
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <input 
                        type="number" step="0.01" 
                        value={editForm.price} 
                        onChange={(e) => setEditForm({...editForm, price: parseFloat(e.target.value)})}
                        className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm focus:border-brand-blue focus:outline-none"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <input 
                        type="number" 
                        value={editForm.stock} 
                        onChange={(e) => setEditForm({...editForm, stock: parseInt(e.target.value, 10)})}
                        className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm focus:border-brand-blue focus:outline-none"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <select 
                        value={editForm.status}
                        onChange={(e) => setEditForm({...editForm, status: e.target.value as 'Actif'|'Inactif'|'Rupture'})}
                        className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm focus:border-brand-blue focus:outline-none"
                      >
                        <option>Actif</option>
                        <option>Inactif</option>
                        <option>Rupture</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={async () => {
                            if (handleEditProduct && editForm) {
                              await handleEditProduct({
                                ...editForm,
                                pendingImageFile: editProductImageFile ?? undefined,
                              })
                            }
                            setEditingId(null)
                            resetEditProductImage()
                          }}
                          className="rounded-md bg-brand-blue px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-light transition-colors"
                        >
                          Sauver
                        </button>
                        <button 
                          onClick={() => {
                            setEditingId(null)
                            resetEditProductImage()
                          }}
                          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          Annul.
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200 bg-brand-blue/5">
                    <td colSpan={7} className="px-4 py-4 pt-0">
                      <label className="block text-xs font-semibold text-brand-blue mb-1 uppercase tracking-wider">Image</label>
                      <div className="flex flex-wrap items-center gap-3">
                        <label className="cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50">
                          Changer l&apos;image
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            onChange={handleEditProductImageUpload}
                            className="hidden"
                          />
                        </label>
                        {(editProductImagePreview || editForm.imageUrl) ? (
                          <img
                            src={editProductImagePreview || resolveImageUrl(editForm.imageUrl)}
                            alt={editForm.name}
                            className="h-10 w-10 rounded-lg object-cover border border-slate-200 bg-white"
                          />
                        ) : null}
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200 bg-brand-blue/5">
                    <td colSpan={7} className="px-4 py-4 pt-0">
                      <label className="block text-xs font-semibold text-brand-blue mb-1 uppercase tracking-wider">Description</label>
                      <textarea 
                        rows={3} 
                        value={editForm.description || ''} 
                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
                        placeholder="Description du produit..."
                      />
                    </td>
                  </tr>
                </React.Fragment>
                )
              }

              return (
                <tr key={product.id} className="border-b border-slate-100 last:border-none transition duration-150 hover:bg-slate-50">
                  <td className="px-4 py-4 font-semibold text-slate-500">{product.id}</td>
                  <td className="px-4 py-4 font-bold text-brand-blue">
                    <div className="flex items-center gap-3">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="h-10 w-10 shrink-0 rounded-lg object-cover border border-slate-200 bg-white" />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 border border-slate-200">
                          <IconPackage className="h-5 w-5" />
                        </div>
                      )}
                      <span className="truncate max-w-[150px] overflow-hidden sm:max-w-[200px] hover:text-clip">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{product.category}</td>
                  <td className="px-4 py-4 font-medium text-slate-700">{product.price.toFixed(2)} TND</td>
                  <td className="px-4 py-4">
                    <span className={`font-bold ${product.stock <= 5 ? 'text-red-500' : 'text-slate-700'}`}>
                      {product.stock}
                    </span>
                  </td>
                    <td className="px-4 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] uppercase font-extrabold ${
                      product.stock <= 5 || product.status === 'Rupture' ? 'bg-red-100 text-red-700' : 
                      product.status === 'Actif' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {product.stock <= 5 ? 'Rupture' : product.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => {
                          resetEditProductImage()
                          setEditingId(product.id)
                          setEditForm({ ...product })
                        }}
                        className="text-slate-400 hover:text-brand-blue p-2 rounded-lg bg-slate-50 hover:bg-slate-200 transition-colors inline-flex" 
                        title="Modifier"
                      >
                        <IconEye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (!handleDeleteProduct) return
                          const confirmed = window.confirm(`Supprimer définitivement le produit "${product.name}" ?`)
                          if (!confirmed) return
                          handleDeleteProduct(product.id)
                        }}
                        className="text-slate-400 hover:text-red-500 p-2 rounded-lg bg-slate-50 hover:bg-slate-200 transition-colors inline-flex"
                        title="Supprimer"
                      >
                        <IconArchive className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
