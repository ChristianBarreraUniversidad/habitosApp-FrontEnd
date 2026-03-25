import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { markAsDoneThunk, fetchHabitThunk, fetchAddHabitThunk } from "./features/habit/habitSlice";
import type { RootState, AppDispatch } from "./store";

type Habit = {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  days: number;
  lastDone: Date;
  lastUpdated: Date;
};

type HabitsProps = {
  habits: Habit[];
};

const handleMarkAsDone = async (habitId: string, dispatch: AppDispatch, token: string) => {
    try {
        await dispatch(markAsDoneThunk({ habitId, token })).unwrap();
        console.log("Hábito actualizado con éxito");
    } catch (error) {
        console.error("Error al marcar el hábito:", error);
    }
};

export default function Habits({ habits }: HabitsProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.habits);
  const user = useSelector((state: RootState) => state.user.user);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(false);

  const calculateProgress = (days: number): number => {
    return Math.min((days / 66) * 100, 100);
  };

  const getProgressColor = (days: number): string => {
    const pct = (days / 66) * 100;
    if (pct >= 100) return '#10b981';
    if (pct >= 60) return '#3b82f6';
    if (pct >= 30) return '#8b5cf6';
    return '#f59e0b';
  };

  const handleAddHabit = () => {
    if (title && description) {
      dispatch(fetchAddHabitThunk({ token: user ? user.toString() : '', title, description }));
      setTitle('');
      setDescription('');
      setShowForm(false);
      dispatch(fetchHabitThunk(user ? user.toString() : ''));
    }
  };

  return (
    <div className="habits-container">
      {/* Header */}
      <div className="habits-header">
        <div>
          <h1 className="habits-title">Mis Hábitos</h1>
          <p className="habits-subtitle">{habits.length} hábito{habits.length !== 1 ? 's' : ''} activo{habits.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn-add" onClick={() => setShowForm(!showForm)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            {showForm
              ? <path d="M18 6L6 18M6 6l12 12"/>
              : <path d="M12 5v14M5 12h14"/>
            }
          </svg>
          {showForm ? 'Cancelar' : 'Nuevo'}
        </button>
      </div>

      {/* Add habit form */}
      <div className={`add-form ${showForm ? 'add-form-open' : ''}`}>
        <div className="add-form-inner">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nombre del hábito</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Leer 30 minutos"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Descripción</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="¿Por qué es importante?"
                className="form-input"
              />
            </div>
          </div>
          <button onClick={handleAddHabit} className="btn-confirm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Agregar hábito
          </button>
        </div>
      </div>

      {/* Habits list */}
      <div className="habits-list">
        {habits.length > 0 ? (
          habits.map((habit: Habit) => {
            const progress = calculateProgress(habit.days);
            const color = getProgressColor(habit.days);
            return (
              <div className="habit-card" key={habit._id}>
                <div className="habit-card-top">
                  <div className="habit-info">
                    <span className="habit-title">{habit.title}</span>
                    <span className="habit-days">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v6l4 2"/>
                      </svg>
                      {habit.days} / 66 días
                    </span>
                  </div>
                  <button
                    className={`btn-done ${status[habit._id] === 'succeeded' ? 'btn-done-success' : ''}`}
                    onClick={() => handleMarkAsDone(habit._id, dispatch, user ? user.toString() : '')}
                    disabled={status[habit._id] === 'loading'}
                  >
                    {status[habit._id] === 'loading' ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="spin">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                    ) : status[habit._id] === 'succeeded' ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                        Listo
                      </>
                    ) : (
                      'Marcar'
                    )}
                  </button>
                </div>

                {/* Progress bar */}
                <div className="progress-wrapper">
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${progress}%`, background: color }}
                    />
                  </div>
                  <span className="progress-pct" style={{ color }}>{Math.round(progress)}%</span>
                </div>

                {status[habit._id] === 'failed' && (
                  <p className="habit-error">⚠ {error[habit._id]}</p>
                )}
              </div>
            );
          })
        ) : (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
            <p>No tienes hábitos todavía.</p>
            <span>¡Agrega uno para comenzar!</span>
          </div>
        )}
      </div>
    </div>
  );
}
