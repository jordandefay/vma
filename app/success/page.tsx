'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Vérification de votre paiement...</p>
      </div>
    )
  }

  return (
    <section className="py-16">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Paiement réussi !
          </h1>
          
          <p className="text-gray-600 mb-6">
            Merci pour votre achat. Votre paiement a été traité avec succès.
          </p>
          
          {sessionId && (
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <p className="text-sm text-gray-600">
                Numéro de session : <span className="font-mono">{sessionId}</span>
              </p>
            </div>
          )}
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Un email de confirmation vous sera envoyé prochainement avec tous les détails de votre achat.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md font-medium transition"
              >
                Voir mon tableau de bord
              </Link>
              <Link
                href="/"
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-medium transition"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function SuccessPage() {
  return (
    <main>
      <Navigation />
      <Suspense fallback={
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      }>
        <SuccessContent />
      </Suspense>
      <Footer />
    </main>
  )
}