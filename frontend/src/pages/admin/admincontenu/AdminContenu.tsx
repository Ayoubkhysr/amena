import { useState } from 'react'
import { IconImage, IconSettings, IconEye, IconArchive, IconSettings as IconCheck } from '../../../components/admin'

export type Banner = {
  id: string
  title: string
  imageUrl: string
  targetUrl: string
  position: number
  status: 'Actif' | 'Inactif'
}

export type StaticPage = {
  id: string
  title: string
  slug: string
  lastModified: string
  status: 'Publiée' | 'Brouillon'
}

export type AdminContenuProps = {
  activeSection: string
  banners: Banner[]
  staticPages: StaticPage[]
  handleEditBanner?: (b: Banner) => void
  handleEditPage?: (p: StaticPage) => void
  handleAddBanner?: (b: Banner) => void
  handleAddPage?: (p: StaticPage) => void
}

export function AdminContenu({ activeSection, banners, staticPages, handleEditBanner, handleEditPage, handleAddBanner, handleAddPage }: AdminContenuProps) {
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null)
  const [editingPageId, setEditingPageId] = useState<string | null>(null)
  const [editBannerForm, setEditBannerForm] = useState<Banner | null>(null)
  const [editPageForm, setEditPageForm] = useState<StaticPage | null>(null)

  const [isAddingBanner, setIsAddingBanner] = useState(false)
  const [newBannerForm, setNewBannerForm] = useState<Banner>({ id: '', title: '', imageUrl: '', targetUrl: '', position: 1, status: 'Actif' })

  const [isAddingPage, setIsAddingPage] = useState(false)
  const [newPageForm, setNewPageForm] = useState<StaticPage>({ id: '', title: '', slug: '', lastModified: new Date().toISOString().split('T')[0], status: 'Brouillon' })

  if (activeSection === 'contenu-bannieres') {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm animate-admin-panel-in">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-brand-blue uppercase tracking-wider">Bannières / Slider</h3>
            <p className="mt-1 text-xs text-slate-500">Gérez les visuels de la page d'accueil de la boutique.</p>
          </div>
          <button 
            onClick={() => {
              setIsAddingBanner(true)
              setNewBannerForm({ id: `B${Date.now()}`, title: '', imageUrl: '', targetUrl: '', position: banners.length + 1, status: 'Actif' })
            }}
            className="bg-brand-blue text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-brand-light transition-colors"
          >
            Ajouter une bannière
          </button>
        </header>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 bg-slate-50">
                <th className="px-4 py-3 rounded-tl-lg">ID</th>
                <th className="px-4 py-3">Bannière</th>
                <th className="px-4 py-3">Lien de redirection</th>
                <th className="px-4 py-3">Position</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isAddingBanner && (
                <tr className="border-b border-slate-200 bg-brand-blue/5">
                  <td className="px-4 py-4 font-semibold text-brand-blue text-xs italic">Nouveau</td>
                  <td className="px-4 py-4">
                    <div className="space-y-2">
                      <input 
                        type="text" 
                        placeholder="Titre"
                        value={newBannerForm.title} 
                        onChange={(e) => setNewBannerForm({...newBannerForm, title: e.target.value})}
                        className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm focus:border-brand-blue focus:outline-none"
                      />
                      <input 
                        type="text" 
                        placeholder="URL de l'image"
                        value={newBannerForm.imageUrl} 
                        onChange={(e) => setNewBannerForm({...newBannerForm, imageUrl: e.target.value})}
                        className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm focus:border-brand-blue focus:outline-none"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <input 
                      type="text"
                      placeholder="Ex: /promotions"
                      value={newBannerForm.targetUrl} 
                      onChange={(e) => setNewBannerForm({...newBannerForm, targetUrl: e.target.value})}
                      className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm focus:border-brand-blue focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <input 
                      type="number" 
                      value={newBannerForm.position} 
                      onChange={(e) => setNewBannerForm({...newBannerForm, position: parseInt(e.target.value, 10)})}
                      className="w-full max-w-[80px] rounded-md border border-slate-300 px-2 py-2 text-sm focus:border-brand-blue focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <select 
                      value={newBannerForm.status}
                      onChange={(e) => setNewBannerForm({...newBannerForm, status: e.target.value as 'Actif'|'Inactif'})}
                      className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm focus:border-brand-blue focus:outline-none"
                    >
                      <option>Actif</option>
                      <option>Inactif</option>
                    </select>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => {
                          if (handleAddBanner) handleAddBanner(newBannerForm)
                          setIsAddingBanner(false)
                        }}
                        className="rounded-md bg-brand-blue px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-light transition-colors"
                      >
                        Ajouter
                      </button>
                      <button 
                        onClick={() => setIsAddingBanner(false)}
                        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        Annul.
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              {banners.map((banner) => {
                const isEditing = editingBannerId === banner.id

                if (isEditing && editBannerForm) {
                  return (
                    <tr key={banner.id} className="border-b border-slate-200 bg-brand-blue/5">
                      <td className="px-4 py-4 font-semibold text-slate-500">{banner.id}</td>
                      <td className="px-4 py-4">
                        <div className="space-y-2">
                          <input 
                            type="text" 
                            placeholder="Titre"
                            value={editBannerForm.title} 
                            onChange={(e) => setEditBannerForm({...editBannerForm, title: e.target.value})}
                            className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm focus:border-brand-blue focus:outline-none"
                          />
                          <input 
                            type="text" 
                            placeholder="URL de l'image"
                            value={editBannerForm.imageUrl} 
                            onChange={(e) => setEditBannerForm({...editBannerForm, imageUrl: e.target.value})}
                            className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm focus:border-brand-blue focus:outline-none"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <input 
                          type="text" 
                          value={editBannerForm.targetUrl} 
                          onChange={(e) => setEditBannerForm({...editBannerForm, targetUrl: e.target.value})}
                          className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm focus:border-brand-blue focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <input 
                          type="number" 
                          value={editBannerForm.position} 
                          onChange={(e) => setEditBannerForm({...editBannerForm, position: parseInt(e.target.value, 10)})}
                          className="w-full max-w-[80px] rounded-md border border-slate-300 px-2 py-2 text-sm focus:border-brand-blue focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <select 
                          value={editBannerForm.status}
                          onChange={(e) => setEditBannerForm({...editBannerForm, status: e.target.value as 'Actif'|'Inactif'})}
                          className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm focus:border-brand-blue focus:outline-none"
                        >
                          <option>Actif</option>
                          <option>Inactif</option>
                        </select>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => {
                              if (handleEditBanner) handleEditBanner(editBannerForm)
                              setEditingBannerId(null)
                            }}
                            className="rounded-md bg-brand-blue px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-light transition-colors"
                          >
                            Sauver
                          </button>
                          <button 
                            onClick={() => setEditingBannerId(null)}
                            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                          >
                            Annul.
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                }

                return (
                  <tr key={banner.id} className="border-b border-slate-100 last:border-none transition duration-150 hover:bg-slate-50">
                    <td className="px-4 py-4 font-semibold text-slate-500">{banner.id}</td>
                    <td className="px-4 py-4 font-bold text-brand-blue">
                      <div className="flex items-center gap-3">
                        {banner.imageUrl ? (
                          <img src={banner.imageUrl} alt={banner.title} className="h-12 w-20 shrink-0 rounded-lg object-cover border border-slate-200 bg-slate-100" />
                        ) : (
                          <div className="flex h-12 w-20 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 border border-slate-200">
                            <IconImage className="h-5 w-5" />
                          </div>
                        )}
                        <span className="truncate max-w-[150px]">{banner.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600 truncate max-w-[200px]" title={banner.targetUrl}>
                      {banner.targetUrl}
                    </td>
                    <td className="px-4 py-4">
                      {banner.position}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] uppercase font-extrabold ${banner.status === 'Actif' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {banner.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => { setEditingBannerId(banner.id); setEditBannerForm({...banner}) }}
                          className="text-slate-400 hover:text-brand-blue p-2 rounded-lg bg-slate-50 hover:bg-slate-200 transition-colors inline-flex" 
                          title="Modifier"
                        >
                          <IconEye className="h-4 w-4" />
                        </button>
                        <button className="text-slate-400 hover:text-red-500 p-2 rounded-lg bg-slate-50 hover:bg-slate-200 transition-colors inline-flex" title="Archiver">
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

  if (activeSection === 'contenu-pages') {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm animate-admin-panel-in">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-brand-blue uppercase tracking-wider">Pages statiques</h3>
            <p className="mt-1 text-xs text-slate-500">Gérez le contenu des pages informatives (À propos, CGV, etc.).</p>
          </div>
          <button 
            onClick={() => {
              setIsAddingPage(true)
              setNewPageForm({ id: `P${Date.now()}`, title: '', slug: '', lastModified: new Date().toISOString().split('T')[0], status: 'Brouillon' })
            }}
            className="bg-brand-blue text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-brand-light transition-colors"
          >
            Créer une page
          </button>
        </header>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 bg-slate-50">
                <th className="px-4 py-3 rounded-tl-lg">ID</th>
                <th className="px-4 py-3">Titre de la page</th>
                <th className="px-4 py-3">Slug (URL)</th>
                <th className="px-4 py-3">Dernière modification</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isAddingPage && (
                <tr className="border-b border-slate-200 bg-brand-blue/5">
                  <td className="px-4 py-4 font-semibold text-brand-blue text-xs italic">Nouv.</td>
                  <td className="px-4 py-4">
                    <input 
                      type="text" 
                      placeholder="Titre de la page"
                      value={newPageForm.title} 
                      onChange={(e) => setNewPageForm({...newPageForm, title: e.target.value})}
                      className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm focus:border-brand-blue focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <input 
                      type="text" 
                      placeholder="slug-de-la-page"
                      value={newPageForm.slug} 
                      onChange={(e) => setNewPageForm({...newPageForm, slug: e.target.value})}
                      className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm focus:border-brand-blue focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-4 text-slate-500">
                    {newPageForm.lastModified}
                  </td>
                  <td className="px-4 py-4">
                    <select 
                      value={newPageForm.status}
                      onChange={(e) => setNewPageForm({...newPageForm, status: e.target.value as 'Publiée'|'Brouillon'})}
                      className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm focus:border-brand-blue focus:outline-none"
                    >
                      <option>Publiée</option>
                      <option>Brouillon</option>
                    </select>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => {
                          if (handleAddPage) handleAddPage(newPageForm)
                          setIsAddingPage(false)
                        }}
                        className="rounded-md bg-brand-blue px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-light transition-colors"
                      >
                        Ajouter
                      </button>
                      <button 
                        onClick={() => setIsAddingPage(false)}
                        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        Annul.
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              {staticPages.map((page) => {
                const isEditing = editingPageId === page.id

                if (isEditing && editPageForm) {
                  return (
                    <tr key={page.id} className="border-b border-slate-200 bg-brand-blue/5">
                      <td className="px-4 py-4 font-semibold text-slate-500">{page.id}</td>
                      <td className="px-4 py-4">
                        <input 
                          type="text" 
                          value={editPageForm.title} 
                          onChange={(e) => setEditPageForm({...editPageForm, title: e.target.value})}
                          className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm focus:border-brand-blue focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <input 
                          type="text" 
                          value={editPageForm.slug} 
                          onChange={(e) => setEditPageForm({...editPageForm, slug: e.target.value})}
                          className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm focus:border-brand-blue focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-4 text-slate-500">
                        {editPageForm.lastModified}
                      </td>
                      <td className="px-4 py-4">
                        <select 
                          value={editPageForm.status}
                          onChange={(e) => setEditPageForm({...editPageForm, status: e.target.value as 'Publiée'|'Brouillon'})}
                          className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm focus:border-brand-blue focus:outline-none"
                        >
                          <option>Publiée</option>
                          <option>Brouillon</option>
                        </select>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => {
                              if (handleEditPage) handleEditPage({...editPageForm, lastModified: new Date().toISOString().split('T')[0]})
                              setEditingPageId(null)
                            }}
                            className="rounded-md bg-brand-blue px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-light transition-colors"
                          >
                            Sauver
                          </button>
                          <button 
                            onClick={() => setEditingPageId(null)}
                            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                          >
                            Annul.
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                }

                return (
                  <tr key={page.id} className="border-b border-slate-100 last:border-none transition duration-150 hover:bg-slate-50">
                    <td className="px-4 py-4 font-semibold text-slate-500">{page.id}</td>
                    <td className="px-4 py-4 font-bold text-brand-blue">
                      {page.title}
                    </td>
                    <td className="px-4 py-4 text-slate-600">/{page.slug}</td>
                    <td className="px-4 py-4 text-slate-500">{page.lastModified}</td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] uppercase font-extrabold ${page.status === 'Publiée' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-amber-700'}`}>
                        {page.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => { setEditingPageId(page.id); setEditPageForm({...page}) }}
                          className="text-slate-400 hover:text-brand-blue p-2 rounded-lg bg-slate-50 hover:bg-slate-200 transition-colors inline-flex" 
                          title="Modifier"
                        >
                          <IconEye className="h-4 w-4" />
                        </button>
                        <button className="text-slate-400 hover:text-red-500 p-2 rounded-lg bg-slate-50 hover:bg-slate-200 transition-colors inline-flex" title="Archiver">
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

  return null
}
