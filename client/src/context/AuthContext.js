import axios from 'axios';
import React, { useContext, createContext, useState, useEffect } from 'react';
import { TOKEN_ID, ADMIN_TOKEN_ID } from '../utils/constants';
import { Navigate, useNavigate } from 'react-router-dom';
const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const restoreUser = async () => {
    const token = localStorage.getItem(TOKEN_ID);
    if (token) {
      try {
        const res = await axios.get('/api/user/getuser', {
          headers: {
            authorization: token,
          },
        });

        console.log('authcontext', res);
        if (res.data.success) {
          setUser(res.data.data);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
    setLoading(false);
  };
  const restoreAdmin = async () => {
    console.log('restoreadmin');
    const token = localStorage.getItem(ADMIN_TOKEN_ID);
    console.log(token);
    if (token) {
      try {
        console.log('in try');
        const res = await axios.get('/api/admin/getadmin', {
          headers: {
            authorization: token,
          },
        });

        console.log('restoreadminresult', res);
        if (res.data.success) {
          setAdmin(res.data.data);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const admintoken = localStorage.getItem(ADMIN_TOKEN_ID);
    const usertoken = localStorage.getItem(TOKEN_ID);
    if (usertoken) restoreUser();
    if (admintoken) restoreAdmin();
  }, []);

  // method to handle user registration
  const userRegister = async (
    name,
    email,
    password,
    mobileNumber,
    registrationNumber,
    course,
    college
  ) => {
    try {
      let col = JSON.parse(college);
      const data = {
        name,
        email: col.isMahe ? email + '@learner.manipal.edu' : email,
        password,
        mobileNumber,
        registrationNumber,
        course,
        college: col.name,
      };
      console.log(data);
      const res = await axios.post('/api/user/register', data);
      if (!res.data.success) return res.data;
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  // method to handle user login
  const userLogin = async (email, password) => {
    try {
      const res = await axios.post('/api/user/login', {
        email,
        password,
      });
      if (!res.data.success) return res.data;
      localStorage.setItem(TOKEN_ID, res.data.data.token);
      restoreUser();
      return res.data;
    } catch (err) {
      throw err;
    }
  };
  // method to handle admin login
  const adminLogin = async (email, password) => {
    try {
      const res = await axios.post('/api/admin/login', {
        email,
        password,
      });
      console.log('admin', res);
      if (!res.data.success) return res.data;
      localStorage.setItem(ADMIN_TOKEN_ID, res.data.data.token);
      restoreAdmin();
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  // method to handle user logout
  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem(TOKEN_ID);
      navigate('/');
    } catch (err) {
      throw err;
    }
  };
  const adminlogout = async () => {
    try {
      setUser(null);
      localStorage.removeItem(ADMIN_TOKEN_ID);
      navigate('/admin');
    } catch (err) {
      throw err;
    }
  };

  // method to handle category login
  const categoryLogin = async (categoryId, password) => {
    try {
      const res = await axios.post('/category/login', {
        categoryId,
        password,
      });
      if (!res.data.success) return res.data;

      localStorage.setItem(TOKEN_ID, res.data.data.token);
      restoreUser();
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const value = {
    user: user,
    admin: admin,
    userRegister: userRegister,
    userLogout: logout,
    userLogin: userLogin,
    adminLogin: adminLogin,
    adminLogout: adminlogout,
    // categoryLogin: categoryLogin,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
