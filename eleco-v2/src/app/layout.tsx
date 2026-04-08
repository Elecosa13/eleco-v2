import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = { title: 'Eleco SA', description: 'Gestion chantiers' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="fr"><body>{children}</body></html>
}
