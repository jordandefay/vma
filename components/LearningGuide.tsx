import Link from 'next/link'
import { CheckBadgeIcon, BookOpenIcon, AcademicCapIcon } from '@heroicons/react/24/outline'

export default function LearningGuide() {
  const guides = [
    {
      icon: CheckBadgeIcon,
      title: "Programme d'Alphabétisation",
      description: "Destiné aux grands débutants, ce programme vous apprend à lire et écrire l'alphabet arabe, à former des mots et des phrases simples. C'est le point de départ essentiel pour toute personne souhaitant s'initier à la langue arabe.",
      link: "/alphabetisation",
      buttonText: "Commencer ici",
      color: "amber"
    },
    {
      icon: BookOpenIcon,
      title: "Les Tomes de Médine",
      description: "Une méthode mondialement reconnue pour apprendre l'arabe classique de manière progressive. Idéale pour comprendre le Coran et les textes islamiques. Ce tome pose les fondations grammaticales et lexicales essentielles.",
      link: "/tomes-medine",
      buttonText: "Découvrir le Programme",
      color: "blue"
    },
    {
      icon: AcademicCapIcon,
      title: "Méthode Al Forqane",
      description: "Une approche structurée de l'arabe pour non-arabophones. Des bases phonétiques aux règles grammaticales, il vise précision et fluidité pour une connexion profonde aux textes sacrés.",
      link: "/al-forqane",
      buttonText: "Découvrir le programme",
      color: "green"
    }
  ]

  return (
    <section id="guide-apprentissage" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
          Notre Guide d'Apprentissage
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Découvrez nos différentes approches pédagogiques pour maîtriser la
          langue arabe, adaptées à vos objectifs et à votre niveau.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {guides.map((guide, index) => (
            <div
              key={index}
              className="guide-card bg-gray-50 p-8 rounded-lg text-center hover:shadow-lg transition flex flex-col items-center"
            >
              <div className={`bg-${guide.color}-100 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-5`}>
                <guide.icon className={`h-12 w-12 text-${guide.color}-600`} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                {guide.title}
              </h3>
              <p className="text-gray-600 text-sm mb-6 flex-grow">
                {guide.description}
              </p>
              <Link
                href={guide.link}
                className={`mt-auto bg-${guide.color}-600 hover:bg-${guide.color}-700 text-white px-6 py-2 rounded-md transition font-medium`}
              >
                {guide.buttonText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}