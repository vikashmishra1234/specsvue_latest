export default function NavigatingLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-md bg-black/30 space-y-4">
      <p className="text-white text-2xl font-semibold">Navigating...</p>
      <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
