// app/unauthorized/page.tsx
export default function Unauthorized() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Unauthorized</h1>
        <p className="mt-3">You don't have permission to access this page.</p>
      </div>
    </main>
  );
}