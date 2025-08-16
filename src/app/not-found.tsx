// app/not-found.js
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-gray-800">
      <h1 className="text-9xl font-bold">404</h1>
      <h2 className="mt-4 text-2xl font-semibold">Página não encontrada</h2>
      <p className="mt-2 max-w-md text-center text-gray-600">
        Ups! Parece tentaste entrar numa pagina que não existe. Volta para a
        loja e continua nas tuas compras. 🚀
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-white shadow-md transition hover:bg-blue-700"
      >
        Home
      </Link>
    </div>
  );
}
