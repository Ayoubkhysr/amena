import { useState, useEffect } from 'react'
import { useStore } from '../../../context/StoreContext'
import { updateConfig } from '../../../services/configService'
import { uploadBannerImage } from '../../../services/bannerService'

export function AdminAboutForm() {
  const { aboutConfig, setAboutConfig } = useStore()
  const [formData, setFormData] = useState<any>({
    heroTitle: 'ELAMINE,',
    heroSubtitle: '10 Ans à vos cotés !',
    heroImageUrl: '/images/Rectangle 244.png',
    historyTitle: 'Votre quotidien, C\'est notre Rayon !',
    historyText: 'Depuis 10 ans, AMENA...',
    historyImageUrl: '/images/Rectangle 239.png',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [pendingHeroImage, setPendingHeroImage] = useState<File | null>(null)
  const [pendingHistoryImage, setPendingHistoryImage] = useState<File | null>(null)

  useEffect(() => {
    if (aboutConfig) {
      setFormData(prev => ({ ...prev, ...aboutConfig }))
    }
  }, [aboutConfig])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      let finalHeroImageUrl = formData.heroImageUrl
      if (pendingHeroImage) {
        finalHeroImageUrl = await uploadBannerImage(pendingHeroImage)
      }
      
      let finalHistoryImageUrl = formData.historyImageUrl
      if (pendingHistoryImage) {
        finalHistoryImageUrl = await uploadBannerImage(pendingHistoryImage)
      }

      const newData = {
        ...formData,
        heroImageUrl: finalHeroImageUrl,
        historyImageUrl: finalHistoryImageUrl
      }

      const saved = await updateConfig('about_page', newData)
      setAboutConfig(saved)
      setFormData(saved)
      setPendingHeroImage(null)
      setPendingHistoryImage(null)
      alert('Configuration enregistrée avec succès.')
    } catch (e) {
      console.error(e)
      alert('Erreur lors de l\'enregistrement.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm mb-8 animate-admin-panel-in">
      <header className="mb-6">
        <h3 className="text-lg font-bold text-brand-blue uppercase tracking-wider">Configuration de la page À propos</h3>
        <p className="mt-1 text-xs text-slate-500">Personnalisez les textes et les images de la section À propos.</p>
      </header>

      <div className="space-y-6">
        {/* Hero Section */}
        <div className="border border-slate-100 rounded-lg p-4 bg-slate-50">
          <h4 className="font-bold text-slate-700 mb-4">Section Principale (Hero)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Titre</label>
              <input 
                type="text" 
                value={formData.heroTitle}
                onChange={e => setFormData({...formData, heroTitle: e.target.value})}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Sous-titre</label>
              <input 
                type="text" 
                value={formData.heroSubtitle}
                onChange={e => setFormData({...formData, heroSubtitle: e.target.value})}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 mb-1">Image Hero</label>
              <div className="flex items-center gap-4">
                {formData.heroImageUrl && !pendingHeroImage && (
                  <img src={formData.heroImageUrl} alt="Hero" className="h-16 w-16 object-cover rounded border" />
                )}
                {pendingHeroImage && (
                  <div className="h-16 w-16 bg-brand-blue/10 flex items-center justify-center rounded border border-brand-blue text-xs text-brand-blue font-bold">
                    Nouv.
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setPendingHeroImage(e.target.files[0])
                    }
                  }}
                  className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-blue/10 file:text-brand-blue hover:file:bg-brand-blue/20 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="border border-slate-100 rounded-lg p-4 bg-slate-50">
          <h4 className="font-bold text-slate-700 mb-4">Section Histoire</h4>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Titre de l'histoire</label>
              <input 
                type="text" 
                value={formData.historyTitle}
                onChange={e => setFormData({...formData, historyTitle: e.target.value})}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Texte de l'histoire</label>
              <textarea 
                rows={5}
                value={formData.historyText}
                onChange={e => setFormData({...formData, historyText: e.target.value})}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Image Histoire</label>
              <div className="flex items-center gap-4">
                {formData.historyImageUrl && !pendingHistoryImage && (
                  <img src={formData.historyImageUrl} alt="History" className="h-16 w-16 object-cover rounded border" />
                )}
                {pendingHistoryImage && (
                  <div className="h-16 w-16 bg-brand-blue/10 flex items-center justify-center rounded border border-brand-blue text-xs text-brand-blue font-bold">
                    Nouv.
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setPendingHistoryImage(e.target.files[0])
                    }
                  }}
                  className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-blue/10 file:text-brand-blue hover:file:bg-brand-blue/20 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-brand-blue text-white px-6 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-brand-light transition-colors disabled:opacity-50"
        >
          {isSaving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  )
}
