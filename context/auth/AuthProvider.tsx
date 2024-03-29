import { FC, useReducer, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Cookies from 'js-cookie';
import axios from 'axios';

import { AuthContext, authReducer } from './';
import { IUser } from '../../interfaces';
import { tesloApi } from '../../api';

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}

const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined
};

interface Props {
  children: JSX.Element | JSX.Element[];
}

export const AuthProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);
  const { data, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      dispatch({ type: '[Auth] - Login', payload: data?.user as IUser });
    }
  }, [data?.user, status]);

  // useEffect(() => {
  //   checkToken();
  // }, []);

  const checkToken = async () => {
    if (!Cookies.get('token')) return;

    try {
      const { data } = await tesloApi.get('/user/validate-token');
      const { token, user } = data;
      Cookies.set('token', token);
      dispatch({ type: '[Auth] - Login', payload: user });
    } catch (error) {
      Cookies.remove('token');
    }
  };

  const loginUser = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const { data } = await tesloApi.post('/user/login', { email, password });
      const { token, user } = data;
      Cookies.set('token', token);
      dispatch({ type: '[Auth] - Login', payload: user });
      return true;
    } catch (error) {
      return false;
    }
  };

  const registerUser = async (
    name: string,
    email: string,
    password: string
  ): Promise<{
    hasError: boolean;
    message?: string;
  }> => {
    try {
      const { data } = await tesloApi.post('/user/register', {
        name,
        email,
        password
      });
      const { token, user } = data;
      Cookies.set('token', token);
      dispatch({ type: '[Auth] - Login', payload: user });

      return {
        hasError: false
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          hasError: true,
          message: (error.response?.data as any).message
        };
      }

      return {
        hasError: true,
        message: 'No se pudo crear el usuario - intente de nuevo'
      };
    }
  };

  const logout = () => {
    Cookies.remove('cart');
    Cookies.remove('direction');
    signOut();

    // Cookies.remove('token');
    // router.reload();
  };

  return (
    <AuthContext.Provider value={{ ...state, loginUser, registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
