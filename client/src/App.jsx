import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import InterviewSetup from './pages/InterviewSetup';
import InterviewRoom from './pages/InterviewRoom';
import InterviewSummary from './pages/InterviewSummary'; // Added import
import History from './pages/History'; // Added import
import Progress from './pages/Progress'; // Added import
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
                        <Route path="/interview-setup" element={<Layout><InterviewSetup /></Layout>} />
                        <Route path="/interview/:id" element={<Layout><InterviewRoom /></Layout>} />
                        <Route path="/summary/:id" element={<Layout><InterviewSummary /></Layout>} />
                        <Route path="/interview/:id/summary" element={<Layout><InterviewSummary /></Layout>} /> {/* Double route handle */}
                        <Route path="/history" element={<Layout><History /></Layout>} />
                        <Route path="/progress" element={<Layout><Progress /></Layout>} />
                    </Route>

                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
