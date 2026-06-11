import './globals.css'

export const metadata = {
  title: 'Sorteo · Playa Blanca Resort',
  description: 'Gran Final Monte Tabor 2026 · La aventura de estar juntos',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
