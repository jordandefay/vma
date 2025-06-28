'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Bars3Icon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline'
import { supabase } from '@/lib/supabase'

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [subscription, setSubscription] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    checkUser()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user)
        fetchSubscription(session?.user?.id)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setSubscription(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    if (user) {
      fetchSubscription(user.id)
    }
  }

  const fetchSubscription = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .maybeSingle()

      setSubscription(data)
    } catch (error) {
      console.error('Error fetching subscription:', error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const getSubscriptionPlanName = () => {
    if (!subscription || !subscription.price_id) return null
    
    // Map price IDs to plan names
    const planNames: { [key: string]: string } = {
      'price_1RexhqAxIe6WFk2wc4kv8Uqc': 'Alphabétisation Solo',
      'price_1Rf0NQAxIe6WFk2wg0YaL66w': 'Alphabétisation Duo',
      'price_1Rf0OnAxIe6WFk2wyO6aAfIf': 'Alphabétisation Trio',
      'price_1Rf0PnAxIe6WFk2wE0C2BRMU': 'Alphabétisation Quatro',
      'price_1Rf0QuAxIe6WFk2wM1g4RELg': 'Kitab de Médine Solo',
      'price_1Rf0RmAxIe6WFk2wz3MtXN1X': 'Kitab de Médine Duo',
      'price_1Rf0TFAxIe6WFk2wS7sW7ESD': 'Kitab de Médine Trio',
      'price_1Rf0U4AxIe6WFk2wXAaRqgdU': 'Kitab de Médine Quatro',
      'price_1Rf0VEAxIe6WFk2wkMpDj0IQ': 'Al Forqane Solo',
      'price_1Rf0XFAxIe6WFk2wd1s8BueL': 'Al Forqane Duo',
      'price_1Rf0ZMAxIe6WFk2wmyV9w5At': 'Al Forqane Trio',
      'price_1Rf0aRAxIe6WFk2wzsjbuxVY': 'Al Forqane Quatro',
    }
    
    return planNames[subscription.price_id] || 'Plan actif'
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo1.png"
                alt="Logo de Voix du Monde Arabe"
                width={120}
                height={96}
                className="h-20 sm:h-24 w-auto"
              />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#accueil" className="text-gray-800 hover:text-amber-600 transition">
              Accueil
            </Link>
            <Link href="/cours" className="text-gray-800 hover:text-amber-600 transition">
              Nos Cours
            </Link>
            <Link href="/#guide-apprentissage" className="text-gray-800 hover:text-amber-600 transition">
              Guide d'Apprentissage
            </Link>
            <Link href="/#methode" className="text-gray-800 hover:text-amber-600 transition">
              Méthode
            </Link>
            <Link href="/#contact" className="text-gray-800 hover:text-amber-600 transition">
              Contact
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {subscription && subscription.subscription_status === 'active' && (
                  <div className="hidden sm:block">
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      {getSubscriptionPlanName()}
                    </span>
                  </div>
                )}
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 text-gray-800 hover:text-amber-600 transition"
                >
                  <UserIcon className="h-5 w-5" />
                  <span className="hidden sm:inline">Tableau de bord</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-800 transition text-sm"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/essai-gratuit"
                  className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition text-sm sm:text-base"
                >
                  Essai Gratuit
                </Link>
                <Link
                  href="/auth/login"
                  className="text-gray-800 hover:text-amber-600 transition text-sm sm:text-base"
                >
                  Connexion
                </Link>
              </>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden focus:outline-none"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6 text-gray-800" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-gray-800" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg pb-4">
          <Link
            href="/#accueil"
            className="block py-2 px-4 text-sm text-gray-800 hover:bg-amber-50 hover:text-amber-600 transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            Accueil
          </Link>
          <Link
            href="/cours"
            className="block py-2 px-4 text-sm text-gray-800 hover:bg-amber-50 hover:text-amber-600 transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            Nos Cours
          </Link>
          <Link
            href="/#guide-apprentissage"
            className="block py-2 px-4 text-sm text-gray-800 hover:bg-amber-50 hover:text-amber-600 transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            Guide d'Apprentissage
          </Link>
          <Link
            href="/#methode"
            className="block py-2 px-4 text-sm text-gray-800 hover:bg-amber-50 hover:text-amber-600 transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            Méthode
          </Link>
          <Link
            href="/#contact"
            className="block py-2 px-4 text-sm text-gray-800 hover:bg-amber-50 hover:text-amber-600 transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </Link>
          {user ? (
            <>
              {subscription && subscription.subscription_status === 'active' && (
                <div className="px-4 py-2">
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    {getSubscriptionPlanName()}
                  </span>
                </div>
              )}
              <Link
                href="/dashboard"
                className="block py-2 px-4 text-sm text-amber-600 font-semibold hover:bg-amber-50 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tableau de bord
              </Link>
              <button
                onClick={() => {
                  handleLogout()
                  setMobileMenuOpen(false)
                }}
                className="block w-full text-left py-2 px-4 text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                href="/essai-gratuit"
                className="block py-2 px-4 text-sm text-amber-600 font-semibold hover:bg-amber-50 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Essai Gratuit
              </Link>
              <Link
                href="/auth/login"
                className="block py-2 px-4 text-sm text-gray-800 hover:bg-amber-50 hover:text-amber-600 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Connexion
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}