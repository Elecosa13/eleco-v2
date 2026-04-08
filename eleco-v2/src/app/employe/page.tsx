'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function EmployePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [chantiers, setChantiers] = useState<any[]>([])
  const [vue, setVue] = useState<'accueil' | 'nouveau'>('accueil')
  const [nom, setNom] = useState('')
  const [adresse, setAdresse] = useState('')
  const [ssDossier, setSsDossier] = useState('')

  useEffect(() => {
    const s = localStorage.getItem('eleco_user')
    if (!s) { router.push('/'); return }
    const u = JSON.parse(s)
    if (u.role !== 'employe') { router.push('/admin'); return }
    setUser(u)
    supabase.from('chantiers').select('*').eq('actif', true).order('created_at', { ascending: false }).then(({ data }) => { if (data) setChantiers(data) })
  }, [])

  async function creerChantier(e: React.FormEvent) {
    e.preventDefault()
    const { data: c } = await supabase.from('chantiers').insert({ nom, adresse }).select().single()
    if (c && ssDossier) await supabase.from('sous_dossiers').insert({ chantier_id: c.id, nom: ssDossier })
    setNom(''); setAdresse(''); setSsDossier(''); setVue('accueil')
    supabase.from('chantiers').select('*').eq('actif', true).order('created_at', { ascending: false }).then(({ data }) => { if (data) setChantiers(data) })
  }

  if (!user) return null

  return (
    <div>
      <div className="top-bar">
        <div>
          <div style={{ fontWeight: 600, fontSize: '15px' }}>{vue === 'accueil' ? `Bonjour, ${user.prenom}` : 'Nouveau chantier'}</div>
          <div style={{ fontSize: '11px', color: '#888' }}>Espace employé</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {vue !== 'accueil' && <button className="btn-outline btn-sm" onClick={() => setVue('accueil')}>← Retour</button>}
          <button className="avatar" onClick={() => { localStorage.removeItem('eleco_user'); router.push('/') }} title="Déconnexion">{user.initiales}</button>
        </div>
      </div>
      <div className="page-content">
        {vue === 'accueil' && (
          <>
            <div style={{ background: '#FCEBEB', border: '1px solid #f09595', borderRadius: '6px', padding: '10px 14px', fontSize: '12px', color: '#A32D2D', display: 'flex', gap: '8px' }}>
              <span>🔒</span><span>Espace employé</span>
            </div>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontWeight: 600, fontSize: '14px' }}>Chantiers actifs</span>
                <button className="btn-primary btn-sm" style={{ width: 'auto' }} onClick={() => setVue('nouveau')}>+ Nouveau</button>
              </div>
              {chantiers.length === 0 && <div style={{ fontSize: '13px', color: '#888' }}>Aucun chantier</div>}
              {chantiers.map(c => (
                <div key={c.id} className="row-item" style={{ cursor: 'pointer' }} onClick={() => router.push(`/employe/chantier/${c.id}`)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: 34, height: 34, borderRadius: '8px', background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🏗️</div>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '13px' }}>{c.nom}</div>
                      <div style={{ fontSize: '11px', color: '#888' }}>{c.adresse || '—'}</div>
                    </div>
                  </div>
                  <span style={{ color: '#185FA5' }}>›</span>
                </div>
              ))}
            </div>
          </>
        )}
        {vue === 'nouveau' && (
          <form className="card" onSubmit={creerChantier} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="form-group"><label>Nom du chantier *</label><input type="text" value={nom} onChange={e => setNom(e.target.value)} required placeholder="Ex: Villa Müller" /></div>
            <div className="form-group"><label>Adresse</label><input type="text" value={adresse} onChange={e => setAdresse(e.target.value)} placeholder="Rue, NPA Ville" /></div>
            <div className="form-group"><label>Premier sous-dossier</label><input type="text" value={ssDossier} onChange={e => setSsDossier(e.target.value)} placeholder="Ex: Cuisine" /></div>
            <button type="submit" className="btn-primary">Créer le chantier</button>
          </form>
        )}
      </div>
    </div>
  )
}
