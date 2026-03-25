import './App.css'
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHabitThunk } from "./features/habit/habitSlice";
import { addUser, fetchRegisterUserThunk, fetchLoginUserThunk, } from './features/user/userSlice';
import type {RootState,  AppDispatch } from './store';
import { getCookie } from 'cookies-next';
import Habits from './habits';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const habits = useSelector((state: RootState) => state.habits.habits);
  const user = useSelector((state: RootState) => state.user.user);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const token = getCookie('habitToken');
    if (token) {
      dispatch(addUser(token));
    }
    if (user) {
      dispatch(fetchHabitThunk(user.toString()));
    }
  }, [dispatch, user]);

  const handleLogin = () => {
    dispatch(fetchLoginUserThunk({ username, password }));
  };

  const handleRegister = () => {
    dispatch(fetchRegisterUserThunk({ username, password }));
  };

  return (
    <div className="app-root">
      {!user && (
        <div className="login-wrapper">
          {/* Background effects */}
          <div className="bg-orb bg-orb-1" />
          <div className="bg-orb bg-orb-2" />
          <div className="bg-grid" />

          <div className="login-card">
            <div className="login-header">
              <div className="login-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h1 className="login-title">HabitFlow</h1>
              <p className="login-subtitle">
                {isRegistering ? 'Crea tu cuenta para comenzar' : 'Bienvenido de vuelta'}
              </p>
            </div>

            <div className="login-form">
              <div className="form-group">
                <label className="form-label">Usuario</label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Tu nombre de usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-input"
                    onKeyDown={(e) => e.key === 'Enter' && (isRegistering ? handleRegister() : handleLogin())}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Contraseña</label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    onKeyDown={(e) => e.key === 'Enter' && (isRegistering ? handleRegister() : handleLogin())}
                  />
                </div>
              </div>

              <button
                onClick={isRegistering ? handleRegister : handleLogin}
                className="btn-primary"
              >
                {isRegistering ? 'Crear cuenta' : 'Iniciar sesión'}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>

              <button
                onClick={() => setIsRegistering(!isRegistering)}
                className="btn-secondary"
              >
                {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {user && (
        <div className="habits-wrapper">
          <div className="bg-orb bg-orb-1" />
          <div className="bg-orb bg-orb-2" />
          <div className="bg-grid" />
          <Habits habits={habits} />
        </div>
      )}
    </div>
  );
}

export default App;
