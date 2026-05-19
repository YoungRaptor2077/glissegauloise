export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-noir-mat min-h-screen">{children}</body>
    </html>
  );
}
