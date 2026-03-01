import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [token, setToken] = useState(localStorage.getItem('token') || null);

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();



    useEffect(() => {

        if (token) {

            const storedUser = localStorage.getItem('user');

            if (storedUser) {

                setUser(JSON.parse(storedUser));

            }

        }

        setLoading(false);



        const interceptor = axios.interceptors.response.use(

            (response) => response,

            (error) => {

                if (

                    error.response &&

                    error.response.status === 403 &&

                    error.response.data.message.includes('blocked')

                ) {

                    logout();

                }

                return Promise.reject(error);

            }

        );



        return () => axios.interceptors.response.eject(interceptor);

    }, [token]);




    const login = async (email, password) => {

        try {

            const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });   // ✅ fixed

            const { token, user } = res.data;



            setToken(token);

            setUser(user);



            localStorage.setItem('token', token);

            localStorage.setItem('user', JSON.stringify(user));



            return { success: true };

        }

        catch (err) {

            return {

                success: false,

                message: err.response?.data?.message || 'Login failed'

            };

        }

    };




    const register = async (userData) => {

        try {

            const res = await axios.post(`${API_URL}/api/auth/register`, userData);   // ✅ fixed

            return {

                success: true,

                message: res.data.message

            };

        }

        catch (err) {

            return {

                success: false,

                message: err.response?.data?.message || 'Registration failed'

            };

        }

    };




    const logout = () => {

        setToken(null);

        setUser(null);

        localStorage.removeItem('token');

        localStorage.removeItem('user');

        navigate('/login');

    };




    return (

        <AuthContext.Provider

            value={{

                user,

                setUser,

                token,

                loading,

                login,

                register,

                logout

            }}

        >

            {children}

        </AuthContext.Provider>

    );

};



export const useAuth = () => useContext(AuthContext);