import type { ReactNode } from 'react'

interface AdminSectionCardProps {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}

function AdminSectionCard({ title, description, actions, children }: AdminSectionCardProps) {
  return (
    <section className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm shadow-slate-200/40 transition-all duration-300 ease-out hover:border-teal-200/80 hover:shadow-md hover:shadow-slate-200/60">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-500 via-teal-400 to-cyan-500 opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="p-6 pt-7">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h2>
            {description ? <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-500">{description}</p> : null}
          </div>
          {actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
        </div>
        <div className="transition-opacity duration-300">{children}</div>
      </div>
    </section>
  )
}

export default AdminSectionCard
