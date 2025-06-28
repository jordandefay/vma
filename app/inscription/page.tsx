'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const coursesData = [
  {
    id: "alphabétisation",
    name: "Programme Alphabétisation",
    prices: [
      { label: "Classe en particulier", value: "63.90", display: "63.90€/Personne (soit seulement 7,30€/h)" },
      { label: "Classe 2 personnes", value: "57.90", display: "57.90€/Personne (soit seulement 6,65€/h)" },
      { label: "Classe 3 personnes", value: "53.90", display: "53.90€/Personne (soit seulement 6,15€/h)" },
      { label: "Classe 4 personnes", value: "44.90", display: "44.90€/Personne (soit seulement 5,15€/h)" }
    ]
  },
  {
    id: "kitab-medine",
    name: "Programme Kitab de Médine",
    prices: [
      { label: "Classe en particulier", value: "63.90", display: "63.90€/Personne (soit seulement 7,30€/h)" },
      { label: "Classe 2 personnes", value: "57.90", display: "57.90€/Personne (soit seulement 6,65€/h)" },
      { label: "Classe 3 personnes", value: "53.90", display: "53.90€/Personne (soit seulement 6,15€/h)" },
      { label: "Classe 4 personnes", value: "44.90", display: "44.90€/Personne (soit seulement 5,15€/h)" }
    ]
  },
  {
    id: "al-forqane",
    name: "Programme Al Forqane",
    prices: [
      { label: "Classe en particulier", value: "73.90", display: "73.90€/Personne (soit seulement 7,39€/h)" },
      { label: "Classe 2 personnes", value: "67.90", display: "67.90€/Personne (soit seulement 6,79€/h)" },
      { label: "Classe 3 personnes", value: "63.90", display: "63.90€/Personne (soit seulement 6,39€/h)" },
      { label: "Classe 4 personnes", value: "54.90", display: "54.90€/Personne (soit seulement 5,49€/h)" }
    ]
  }
]

function InscriptionForm() {
  const searchParams = useSearchParams()
  const courseId = searchParams.get('courseId')
  
  const [selectedCourse, setSelectedCourse] = useState<any>(null)
  const [selectedPrice, setSelectedPrice] = useState('')
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    date_naissance: '',
    email: '',
    whatsapp: ''
  })
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [paymentCompleted, setPaymentCompleted] = useState(false)

  useEffect(() => {
    if (courseId) {
      const course = coursesData.find(c => c.id === courseId)
      if (course) {
        setSelectedCourse(course)
        if (course.prices && course.prices.length > 0) {
          setSelectedPrice(course.prices[0].value)
        }
      }
    }
  }, [courseId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!paymentCompleted) {
      setMessage('Veuillez d\'abord compléter le paiement PayPal.')
      return
    }
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/inscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          courseId: selectedCourse?.id,
          courseName: selectedCourse?.name,
          amountPaid: selectedPrice,
          currency: 'EUR'
        }),
      })
      
      const result = await response.json()
      
      if (result.status === 'success') {
        setMessage('Votre inscription a été enregistrée avec succès !')
        setFormData({
          nom: '',
          prenom: '',
          date_naissance: '',
          email: '',
          whatsapp: ''
        })
        setPaymentCompleted(false)
      } else {
        setMessage('Une erreur est survenue. Veuillez réessayer.')
      }
    } catch (error) {
      setMessage('Erreur de connexion. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const simulatePayment = () => {
    setPaymentCompleted(true)
    setMessage('Paiement simulé avec succès ! Vous pouvez maintenant soumettre votre inscription.')
  }

  if (!selectedCourse) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Cours non trouvé</h1>
        <p className="text-gray-600">Le cours demandé n'existe pas ou n'est pas disponible.</p>
      </div>
    )
  }

  return (
    <section className="py-16">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
          Inscription au Cours
        </h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">
            {selectedCourse.name}
          </h2>
          <p className="text-gray-600 mb-1">
            Vous êtes sur le point de vous inscrire au cours : <strong>{selectedCourse.name}</strong>.
          </p>
          
          {selectedCourse.prices && (
            <div className="mt-4">
              <label htmlFor="priceSelect" className="block text-sm font-medium text-gray-700 mb-2">
                Choisissez votre option de prix :
              </label>
              <select
                id="priceSelect"
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
              >
                {selectedCourse.prices.map((price: any, index: number) => (
                  <option key={index} value={price.value}>
                    {price.label}: {price.display}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div className="mt-4">
            <p className="text-xl font-bold text-amber-600">
              Prix : {selectedPrice} EUR
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-6">
            Vos Informations Personnelles
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div>
              <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">
                Prénom
              </label>
              <input
                type="text"
                id="prenom"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="date_naissance" className="block text-sm font-medium text-gray-700 mb-1">
              Date de naissance
            </label>
            <input
              type="date"
              id="date_naissance"
              name="date_naissance"
              value={formData.date_naissance}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
              Numéro Whatsapp (avec indicatif pays)
            </label>
            <input
              type="tel"
              id="whatsapp"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              required
              placeholder="+33 XXXXXXXXX"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Paiement Sécurisé
            </h3>
            <p className="text-gray-600 mb-4">
              Le montant à payer est de <strong>{selectedPrice} EUR</strong>.
            </p>
            
            {!paymentCompleted ? (
              <div className="text-center">
                <button
                  type="button"
                  onClick={simulatePayment}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition"
                >
                  Simuler le Paiement PayPal
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  (Simulation pour la démonstration)
                </p>
              </div>
            ) : (
              <div className="text-center p-4 bg-green-100 text-green-700 rounded-md">
                ✅ Paiement confirmé ! Vous pouvez maintenant finaliser votre inscription.
              </div>
            )}
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={isLoading || !paymentCompleted}
              className={`w-full py-3 px-4 rounded-md font-medium transition duration-150 ease-in-out ${
                paymentCompleted 
                  ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              {isLoading ? 'Envoi...' : paymentCompleted ? 'Finaliser l\'inscription' : 'Paiement requis d\'abord'}
            </button>
          </div>
        </form>

        {message && (
          <div className={`mt-6 text-center p-4 rounded-md ${
            message.includes('succès') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}
      </div>
    </section>
  )
}

export default function InscriptionPage() {
  return (
    <main>
      <Navigation />
      <Suspense fallback={<div className="text-center py-16">Chargement...</div>}>
        <InscriptionForm />
      </Suspense>
      <Footer />
    </main>
  )
}