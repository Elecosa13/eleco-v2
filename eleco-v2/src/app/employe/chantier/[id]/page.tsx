'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ChantierPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [chantier, setChantier] = useState<any>(null)
  const [sds, setSds] = useState<any[]>([])
  const [nouveauNom, setNouveauNom] = useState('')
  const [ajout, setAjout] = useState(false)

  useEffect(() => {
    const s = localStorage.getItem('eleco_user')
    if (!s) { router.push('/'); return }
    supabase.from('chantiers').select('*').eq('id', id).single().then(({ data }) => { if (data) setChantier(data) })
    chargerSds()
  }, [id])

  function chargerSds() {
    supabase.from('sous_dossiers').select('*').eq('chantier_id', id).order('created_at').then(({ data }) => { if (data) setSds(data) })
  }

  async function ajouterSd(e: React.FormEvent) {
    e.preventDefault()
    await supabase.from('sous_dossiers').insert({ chantier_id: id, nom: nouveauNom })
    setNouveauNom(''); setAjout(false); chargerSds()
  }

  return (
    <div>
      <div className="top-bar">
        <div>
          <button onClick={() => router.push('/employe')} style={{ background: 'none', border: 'none', color: '#185FA5', fontSize: '13px', cursor: 'pointer', padding: 0 }}>← Retour</button>
          <div style={{ fontWeight: 600, fontSize: '15px', marginTop: '4px' }}>{chantier?.nom}</div>
        </div>
      </div>
      <div className="page-content">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontWeight: 600, fontSize: '14px' }}>Sous-dossiers</span>
            <button className="btn-primary btn-sm" style={{ width: 'auto' }} onClick={() => setAjout(!ajout)}>+ Nouveau</button>
          </div>
          {ajout && (
            <form onSubmit={ajouterSd} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input type="text" placeholder="Nom du sous-dossier" value={nouveauNom} onChange={e => setNouveauNom(e.target.value)} required style={{ flex: 1 }} />
              <button type="submit" className="btn-primary btn-sm" style={{ width: 'auto' }}>OK</button>
            </form>
          )}
          {sds.length === 0 && !ajout && <div style={{ fontSize: '13px', color: '#888' }}>Aucun sous-dossier</div>}
          {sds.map(sd => (
            <div key={sd.id} className="row-item" style={{ cursor: 'pointer' }} onClick={() => router.push(`/employe/rapport/${sd.id}`)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: 34, height: 34, borderRadius: '8px', background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>📁</div>
                <div style={{ fontWeight: 500, fontSize: '13px' }}>{sd.nom}</div>
              </div>
              <span style={{ color: '#185FA5' }}>›</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
