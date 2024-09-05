import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-4 text-dark-green-c">
      <h2 className="text-5xl">404 | Not Found</h2>
      <Link href="/" className="text-xl font-medium hover:underline">
        Return Home
      </Link>
    </div>
  );
}
