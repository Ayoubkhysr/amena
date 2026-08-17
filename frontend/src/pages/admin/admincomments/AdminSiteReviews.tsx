import { useState, useEffect } from 'react'
import { SiteReviewsService, SiteReviewResponse, SiteReviewRequest } from '../../../generated'
import { IconMessage, IconStar, IconTrash } from '../../../components/admin'

export function AdminSiteReviews() {
  const [reviews, setReviews] = useState<SiteReviewResponse[]>([])
  const [loading, setLoading] = useState(true)

  // form state
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')
  const [rating, setRating] = useState(5)
  const [reviewDate, setReviewDate] = useState('')

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const data = await SiteReviewsService.getSiteReviews()
      setReviews(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet avis ?")) return;
    try {
      await SiteReviewsService.deleteSiteReview({ id })
      setReviews(prev => prev.filter(r => r.id !== id))
    } catch (e) {
      console.error(e)
      alert("Erreur lors de la suppression.")
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!author || !content) return

    try {
      const request: SiteReviewRequest = {
        author,
        content,
        rating,
        reviewDate: reviewDate || new Date().toISOString().split('T')[0]
      }
      const saved = await SiteReviewsService.createSiteReview({ requestBody: request })
      setReviews(prev => [...prev, saved])
      
      // reset form
      setAuthor('')
      setContent('')
      setRating(5)
      setReviewDate('')
    } catch (err) {
      console.error(err)
      alert("Erreur lors de l'ajout.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-brand-blue flex items-center gap-2">
          <IconMessage className="w-5 h-5" />
          Ajouter un avis
        </h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Auteur</label>
              <input type="text" value={author} onChange={e => setAuthor(e.target.value)} required
                className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date de l'avis</label>
              <input type="date" value={reviewDate} onChange={e => setReviewDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Note (1-5)</label>
            <div className="flex gap-2 text-amber-400">
              {[1, 2, 3, 4, 5].map(star => (
                <button type="button" key={star} onClick={() => setRating(star)} className="focus:outline-none">
                  <IconStar className={`h-6 w-6 ${star <= rating ? 'fill-current' : 'text-slate-200'}`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Commentaire</label>
            <textarea value={content} onChange={e => setContent(e.target.value)} required rows={3}
              className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue" />
          </div>
          <button type="submit" className="rounded-lg bg-brand-blue px-4 py-2 font-bold text-white hover:bg-blue-700 transition-colors">
            Publier l'avis
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-brand-blue border-b pb-2">Avis publiés</h3>
        {loading ? (
          <p className="text-sm text-slate-500">Chargement...</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-slate-500">Aucun avis publié pour le moment.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md flex justify-between items-start gap-4 flex-col sm:flex-row">
              <div className="flex-1">
                <h4 className="font-bold text-brand-blue text-base">{review.author}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{review.reviewDate}</p>
                <div className="my-2 flex text-amber-400 gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <IconStar key={i} className={`h-4 w-4 ${i < (review.rating || 5) ? 'fill-current' : 'text-slate-200'}`} />
                  ))}
                </div>
                <p className="text-sm text-slate-700 mt-2 leading-relaxed bg-slate-50 p-3 rounded-lg">{review.content}</p>
              </div>
              <button onClick={() => review.id && handleDelete(review.id)}
                className="px-3 py-1.5 bg-red-50 hover:bg-red-500 hover:text-white text-red-600 text-xs font-bold rounded-lg transition-all duration-200 border border-red-200 shadow-sm flex items-center gap-1">
                <IconTrash className="w-4 h-4" /> Supprimer
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
