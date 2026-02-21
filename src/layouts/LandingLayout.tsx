import { Outlet } from 'react-router-dom';
import { LandingHeader } from '@/components/organisms/LandingHeader';
import { LandingFooter } from '@/components/organisms/LandingFooter';

export default function LandingLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <LandingFooter />
    </div>
  );
}
