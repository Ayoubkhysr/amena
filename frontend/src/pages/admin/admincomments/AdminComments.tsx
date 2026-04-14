import { IconMessage, IconStar } from '../../../components/admin'

export type ReviewStatus = 'En attente' | 'Approuvé' | 'Rejeté'

export type Review = {
  id: number
  author: string
  product: string
  rating: number
  comment: string
  date: string
  status: ReviewStatus
}

export type AdminCommentsProps = {
  reviews: Review[]
  activeSection: string
  handleReviewStatus: (id: number, newStatus: ReviewStatus) => void
}

export function AdminComments({ reviews, activeSection, handleReviewStatus }: AdminCommentsProps) {
  let filteredReviews = reviews;
  if (activeSection === 'avis-attente') filteredReviews = reviews.filter((r: Review) => r.status === 'En attente');
  else if (activeSection === 'avis-approuves') filteredReviews = reviews.filter((r: Review) => r.status === 'Approuvé');
  else if (activeSection === 'avis-rejetes') filteredReviews = reviews.filter((r: Review) => r.status === 'Rejeté');

  if (filteredReviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-brand-surface py-24 text-center">
        <IconMessage className="h-8 w-8 text-Brand-light mb-4 opacity-50" />
        <h3 className="text-lg font-bold text-brand-blue">Aucun avis trouvé</h3>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          Il n'y a aucun avis dans cette catégorie pour le moment.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {filteredReviews.map((review: Review) => (
        <div key={review.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex justify-between items-start gap-4 flex-col sm:flex-row">
            <div className="flex-1">
              <h4 className="font-bold text-brand-blue text-base">{review.author}</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {review.date} &bull; Produit : <span className="font-semibold text-slate-700">{review.product}</span>
              </p>
              <div className="my-2 flex text-amber-400 gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <IconStar key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} />
                ))}
              </div>
              <p className="text-sm text-slate-700 mt-2 leading-relaxed bg-slate-50 p-3 rounded-lg">{review.comment}</p>
            </div>
            <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto">
              <span className={`inline-flex px-2.5 py-1 text-xs font-bold rounded-full w-fit ${review.status === 'En attente' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                  review.status === 'Approuvé' ? 'bg-green-100 text-green-700 border border-green-200' :
                    'bg-red-100 text-red-700 border border-red-200'
                }`}>
                {review.status}
              </span>

              {['avis-tous', 'avis-attente', 'avis-rejetes'].includes(activeSection) || activeSection === 'avis-approuves' ? (
                <div className="flex gap-2 w-full sm:w-auto justify-end">
                  {review.status !== 'Approuvé' && (
                    <button
                      onClick={() => handleReviewStatus(review.id, 'Approuvé')}
                      className="px-4 py-2 bg-green-50 hover:bg-green-500 hover:text-white text-green-600 text-xs font-bold rounded-lg transition-all duration-200 border border-green-200 shadow-sm flex-1 sm:flex-none"
                    >
                      Approuver
                    </button>
                  )}
                  {review.status !== 'Rejeté' && (
                    <button
                      onClick={() => handleReviewStatus(review.id, 'Rejeté')}
                      className="px-4 py-2 bg-red-50 hover:bg-red-500 hover:text-white text-red-600 text-xs font-bold rounded-lg transition-all duration-200 border border-red-200 shadow-sm flex-1 sm:flex-none"
                    >
                      Rejeter
                    </button>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
