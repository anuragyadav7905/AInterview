import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Onboarding from './pages/Onboarding';
import Pricing from './pages/Pricing';
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

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/pricing" element={<Pricing />} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/onboarding" element={<Onboarding />} />
                        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
                        <Route path="/interview-setup" element={<Layout><InterviewSetup /></Layout>} />
                        <Route path="/interview/:id" element={<Layout><InterviewRoom /></Layout>} />
                        <Route path="/summary/:id" element={<Layout><InterviewSummary /></Layout>} />
                        <Route path="/interview/:id/summary" element={<Layout><InterviewSummary /></Layout>} /> {/* Double route handle */}
                        <Route path="/history" element={<Layout><History /></Layout>} />
                        <Route path="/progress" element={<Layout><Progress /></Layout>} />
                        <Route path="/profile" element={<Layout><Profile /></Layout>} />
                        <Route path="/settings" element={<Layout><Settings /></Layout>} />
                    </Route>

                    <Route path="/" element={<Landing />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
