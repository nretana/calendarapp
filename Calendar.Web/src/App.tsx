import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

//Layout
import DefaultLayout from '@components/ui/layout/DefaulLayout';
import WideLayout from '@components/ui/layout/WideLayout';
import SkeletonLayout from '@components/skeletons/SkeletonLayout';

//Pages
import HomePage from './pages/HomePage';

import './App.scss';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));

function App() {
  return (
      <div className='app'>
        <Suspense fallback={<SkeletonLayout />}>
          <Routes>
            <Route path='/' element={<WideLayout />} >
              <Route index element={<HomePage />} />
              <Route path='*' element={<HomePage />} />
            </Route>
            <Route path='/' element={<DefaultLayout />} >
              <Route path='/dashboard' element={<DashboardPage />} />
            </Route>
          </Routes>
        </Suspense>
      </div>
  );
}

export default App;
