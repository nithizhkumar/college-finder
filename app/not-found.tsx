import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="text-6xl mb-4">🎓</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Page not found</h2>
      <p className="text-gray-500 mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="px-6 py-3 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800">
        Back to Home
      </Link>
    </div>
  );
}
