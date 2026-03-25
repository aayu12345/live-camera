import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'VisionTrack | Weighbridge Data Entry',
  description: 'Data entry dashboard for weighbridge management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <nav className="navbar">
          <div className="nav-logo">
            <i className="fa-solid fa-microchip"></i>
            VisionTrack
            <span className="nav-badge">DATA ENTRY</span>
          </div>
          <div className="nav-right">
            <span className="status-pill"><span className="status-dot"></span> System Online</span>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
