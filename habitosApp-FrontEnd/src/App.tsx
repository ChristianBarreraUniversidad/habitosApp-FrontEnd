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


  useEffect(() => {
    const token = getCookie('habitToken');
    console.log('Token from cookie:', token);
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
  }

return (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
    {!user && (
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800">Bienvenido</h1>
          <p className="text-slate-500 mt-2">Ingresa tus credenciales para continuar</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Username</label>
            <input
              type="text"
              placeholder="Tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-col space-y-3 pt-2">
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
            >
              Iniciar Sesión
            </button>
            
            <button
              onClick={handleRegister}
              className="w-full py-3 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-xl transition-all active:scale-[0.98]"
            >
              Crear cuenta
            </button>
          </div>
        </div>
      </div>
    )}
    
    {user && (
      <div className="w-full max-w-4xl">
        <Habits habits={habits} />
      </div>
    )}
  </div>
);
}

export default App; 
