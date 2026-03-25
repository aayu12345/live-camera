import DashboardClient from '@/components/DashboardClient';

export default function Home() {
  return (
    <div className="main-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Weighbridge Data Entry</h1>
          <p className="page-subtitle">Secure, immutable logging of vehicle plates, weights, and images.</p>
        </div>
      </div>
      <DashboardClient />
    </div>
  );
}
