import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        await new Promise(r => setTimeout(r, 600));
        const mockData = { token: 'mock-token-123', email, username: 'Demo User' };
        localStorage.setItem('user', JSON.stringify(mockData));
        localStorage.setItem('token', mockData.token);
        setUser(mockData);
        return mockData;
    };

    const signup = async (name, email, password) => {
        await new Promise(r => setTimeout(r, 600));
        const mockData = { token: 'mock-token-123', email, username: name };
        localStorage.setItem('user', JSON.stringify(mockData));
        localStorage.setItem('token', mockData.token);
        setUser(mockData);
        return mockData;
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
