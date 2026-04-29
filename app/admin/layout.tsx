// Minimal admin layout — auth guard is in app/admin/(protected)/layout.tsx
// This wrapper exists so /admin/login doesn't get caught by the auth guard
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
