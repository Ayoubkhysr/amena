import { useState, useEffect } from 'react'
import { useStore } from '../../../context/StoreContext'
import { updateConfig } from '../../../services/configService'

export function AdminEnteteForm() {
  const { topHeaderText, setTopHeaderText } = useStore()
  const [formData, setFormData] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    if (topHeaderText !== undefined) {
      setFormData(topHeaderText)
    }
  }, [topHeaderText])

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage('')
    try {
      await updateConfig('top_header_text', formData)
      setTopHeaderText(formData)
      setSaveMessage('Enregistré avec succès !')
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (err) {
      console.error(err)
      setSaveMessage('Erreur lors de la sauvegarde.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Texte de l'En-tête (Barre Rouge)</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Texte affiché en haut du site
          </label>
          <textarea
            value={formData}
            onChange={(e) => setFormData(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 min-h-[100px]"
            placeholder="Ex: 5% de réduction sur votre premier achat sur notre Site. Coupon: ELAMINE5"
          />
          <p className="text-sm text-gray-500 mt-2">
            Laissez ce champ vide si vous ne souhaitez pas afficher la barre rouge.
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
        {saveMessage && (
          <span className={`text-sm ${saveMessage.includes('Erreur') ? 'text-red-500' : 'text-green-500'}`}>
            {saveMessage}
          </span>
        )}
      </div>
    </div>
  )
}
