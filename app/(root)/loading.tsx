import { Loader } from "lucide-react";

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div className="flex min-h-screen items-center justify-center animate-spin">
      <Loader />
    </div>
  );
}
