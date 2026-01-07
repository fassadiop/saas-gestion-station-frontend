"use client"

import Link from "next/link"

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-6xl font-bold text-red-600">403</h1>
      <h2 className="mt-4 text-xl font-semibold text-gray-800">
        Accès interdit
      </h2>
      <p className="mt-2 text-gray-600 text-center max-w-md">
        Vous n’avez pas les droits nécessaires pour accéder à cette page.
      </p>

      <Link
        href="/dashboard"
        className="mt-6 px-6 py-2 rounded bg-primary text-white hover:bg-primary/90"
      >
        Retour au tableau de bord
      </Link>
    </div>
  )
}
