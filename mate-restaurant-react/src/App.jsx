import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
// import SmoothScroll from './components/SmoothScroll'; // REMOVED: Causing lag

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const Menu = lazy(() => import('./pages/Menu'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const Gallery = lazy(() => import('./pages/Gallery'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./admin/Login'));
const Dashboard = lazy(() => import('./admin/Dashboard'));
const ManageMenu = lazy(() => import('./admin/ManageMenu'));
const ManageGallery = lazy(() => import('./admin/ManageGallery'));
const ManageServices = lazy(() => import('./admin/ManageServices'));

import { useLocation } from 'react-router-dom';

function Layout({ children }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Navigation />}
      {children}
      {!isAdmin && <Footer />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Suspense fallback={
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#141414', color: '#cd9f2b' }}>
              Loading...
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/admin/menu" element={
                <PrivateRoute>
                  <ManageMenu />
                </PrivateRoute>
              } />
              <Route path="/admin/gallery" element={
                <PrivateRoute>
                  <ManageGallery />
                </PrivateRoute>
              } />
              <Route path="/admin/services" element={
                <PrivateRoute>
                  <ManageServices />
                </PrivateRoute>
              } />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
