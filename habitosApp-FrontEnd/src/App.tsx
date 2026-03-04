import './App.css'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHabitThunk } from './features/habitSlice'
import type { RootState, AppDispatch}  from './store'
import Habits from './habits'
import habits from './habits';


function App() {
  const dispatch = useDispatch<AppDispatch>();
  
  const habits = useSelector((state: RootState) => state.habits.habits);

  useEffect(() => {
    dispatch(fetchHabitThunk())
  }, [dispatch])

  return (
    <div>
      <Habits habits={habits} />
    </div>
  );
}

console.log("HABITS EN REDUX:", habits);

export default App;
