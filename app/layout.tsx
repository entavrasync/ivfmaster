// Required by Next.js App Router. The actual <html>/<body> structure
// lives in app/[locale]/layout.tsx so that lang= is set per locale.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
