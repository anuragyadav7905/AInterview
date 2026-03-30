import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get('/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // Keep UI simple by just nesting token back inside
                setUser({ ...res.data, token });
            } catch (err) {
                console.error("Token validation failed:", err);
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                }
            } finally {
                setLoading(false);
            }
        };

        validateToken();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post('/api/auth/login', { email, password });
            const userData = res.data;
            
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', userData.token);
            setUser(userData);
            return userData;
        } catch (error) {
            throw error.response?.data?.message || 'Login failed. Please verify your credentials.';
        }
    };

    const signup = async (username, email, password) => {
        try {
            const res = await axios.post('/api/auth/signup', { username, email, password });
            const userData = res.data;

            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', userData.token);
            setUser(userData);
            return userData;
        } catch (error) {
            throw error.response?.data?.message || 'Signup failed. Please try again.';
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
