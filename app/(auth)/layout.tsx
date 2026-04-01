export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="thunder-bg min-h-screen flex items-center justify-center p-6">
      {children}
    </div>
  )
}
