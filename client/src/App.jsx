import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import InterviewSetup from './pages/InterviewSetup';
import InterviewRoom from './pages/InterviewRoom';
import InterviewSummary from './pages/InterviewSummary';
import History from './pages/History';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import CVUpload from './components/CVUpload';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/cv-demo" element={<div style={{ minHeight: '100vh', background: 'var(--bg-dark, #0a0e14)', padding: '50px' }}><CVUpload /></div>} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
                        <Route path="/interview-setup" element={<Layout><InterviewSetup /></Layout>} />
                        <Route path="/interview/:id" element={<InterviewRoom />} />
                        <Route path="/summary/:id" element={<Layout><InterviewSummary /></Layout>} />
                        <Route path="/history" element={<Layout><History /></Layout>} />
                        <Route path="/progress" element={<Layout><Progress /></Layout>} />
                        <Route path="/profile" element={<Layout><Profile /></Layout>} />
                        <Route path="/settings" element={<Layout><Settings /></Layout>} />
                    </Route>

                    {/* Fallback Route */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
