'use client'

import { useState } from 'react'
import { VehicleDocument } from '@prisma/client'
import { addVehicleDocumentAction, deleteVehicleDocumentAction } from '@/app/actions/document'
import { toast } from 'sonner'
import { Plus, Trash2, FileText, Loader2, ExternalLink } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const DOC_TYPES = ['Insurance', 'Registration Certificate', 'Pollution Certificate', 'Fitness Certificate', 'Road Tax', 'Other']

function daysUntil(date: Date) {
  return Math.ceil((new Date(date).getTime() - Date.now()) / 86_400_000)
}

export function VehicleDocuments({ vehicleId, documents }: { vehicleId: string; documents: VehicleDocument[] }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const res = await addVehicleDocumentAction({
      vehicleId,
      name: fd.get('name') as string,
      documentType: fd.get('documentType') as string,
      expiryDate: fd.get('expiryDate') as string || undefined,
      fileUrl: fd.get('fileUrl') as string || undefined,
    })
    setLoading(false)
    if (res.success) { toast.success('Document added'); setOpen(false) }
    else toast.error(res.error || 'Failed to add document')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this document?')) return
    setDeletingId(id)
    const res = await deleteVehicleDocumentAction(id)
    setDeletingId(null)
    if (res.success) toast.success('Document deleted')
    else toast.error(res.error || 'Failed to delete')
  }

  const selectClass = 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-slate-400">{documents.length} document{documents.length !== 1 ? 's' : ''}</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-3.5 w-3.5 mr-1.5" /> Add Document</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Vehicle Document</DialogTitle></DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label>Document Name</Label>
                <Input name="name" placeholder="e.g. Insurance Policy 2025" required />
              </div>
              <div className="space-y-1.5">
                <Label>Document Type</Label>
                <select name="documentType" className={selectClass} required>
                  {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Expiry Date <span className="text-gray-400">(optional)</span></Label>
                <Input name="expiryDate" type="date" />
              </div>
              <div className="space-y-1.5">
                <Label>File URL <span className="text-gray-400">(optional)</span></Label>
                <Input name="fileUrl" type="url" placeholder="https://..." />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={loading}>
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-1.5" />Saving...</> : 'Save Document'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-400 dark:text-slate-500 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl">
          <FileText className="h-8 w-8 mb-2 opacity-40" />
          <p className="text-sm">No documents added yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {documents.map(doc => {
            const days = doc.expiryDate ? daysUntil(doc.expiryDate) : null
            const expired = days !== null && days < 0
            const expiringSoon = days !== null && days >= 0 && days <= 30
            return (
              <div key={doc.id} className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/40 hover:bg-gray-100 dark:hover:bg-slate-800/60 transition-colors">
                <div className="h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{doc.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500 dark:text-slate-400 bg-gray-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">{doc.documentType}</span>
                    {doc.expiryDate && (
                      <span className={`text-xs font-medium ${expired ? 'text-red-600 dark:text-red-400' : expiringSoon ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-slate-400'}`}>
                        {expired ? `Expired ${Math.abs(days!)}d ago` : expiringSoon ? `Expires in ${days}d` : `Expires ${new Date(doc.expiryDate).toLocaleDateString()}`}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {doc.fileUrl && (
                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 flex items-center justify-center transition-colors" title="Open file">
                      <ExternalLink className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    </a>
                  )}
                  <button onClick={() => handleDelete(doc.id)} disabled={deletingId === doc.id} className="h-8 w-8 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 flex items-center justify-center transition-colors" title="Delete">
                    {deletingId === doc.id ? <Loader2 className="h-3.5 w-3.5 animate-spin text-red-500" /> : <Trash2 className="h-3.5 w-3.5 text-red-500" />}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
