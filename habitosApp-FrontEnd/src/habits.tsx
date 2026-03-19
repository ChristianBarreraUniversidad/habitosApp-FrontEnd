import { useState } from "react";
import { useSelector,  useDispatch} from "react-redux"; 
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
}

type HabitsProps = {
    habits: Habit[];
}
const handleMarkAsDone = (habitId: string, dispatch: AppDispatch,  token: string) => {
    dispatch(markAsDoneThunk({ habitId, token }));
    if (token) {
        dispatch(fetchHabitThunk(token));
    }
}

export default function Habits({habits}: HabitsProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { status, error } = useSelector((state: RootState) => state.habits);
    const user = useSelector((state: RootState) => state.user.user);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    
    const calculateProgress = (days: number): number => {
        return Math.min((days / 66) * 100, 100);
    };

    const handleAddHabit = () => {
        if (title && description) {
            dispatch(fetchAddHabitThunk({ token: user ? user.toString() : '', title, description}));
            setTitle('');
            setDescription('');
            dispatch(fetchHabitThunk(user ? user.toString() : ''));
        }
    };
    

return (
    <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl mt-8 mx-auto border border-gray-100">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-900 tracking-tight">Habits</h1>
        
        <ul className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {habits.length > 0 ? (
                habits.map((habit: Habit) => (
                    <li className="p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm" key={habit._id}>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-800 font-semibold">{habit.title}</span>
                            <div className="flex items-center space-x-2">
                                <button 
                                    className={`px-3 py-1.5 text-xs font-bold text-white rounded-lg transition-all active:scale-95 ${
                                        status[habit._id] === "succeeded" 
                                        ? "bg-green-500 cursor-default" 
                                        : "bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-100"
                                    }`}
                                    onClick={() => handleMarkAsDone(habit._id, dispatch, user ? user.toString() : '')}
                                    disabled={status[habit._id] === "loading"}
                                >
                                    {status[habit._id] === "loading" ? "Processing..." : 
                                     status[habit._id] === "succeeded" ? "Done!" : "Mark as Done"}
                                </button>
                            </div>
                        </div>

                        <div className="relative pt-1">
                            <progress className="w-full h-2 rounded-full overflow-hidden [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-blue-500 transition-all" 
                                value={calculateProgress(habit.days)} 
                                max="100">
                            </progress>
                        </div>

                        {status[habit._id] === "failed" && <p className="text-xs text-red-500 mt-2">Error: {error[habit._id]}</p>}
                        {status[habit._id] === "succeeded" && <p className="text-xs text-green-600 mt-1 font-medium italic">Already marked as done!</p>}
                    </li>
                ))
            ) : (
                <li className="text-gray-400 text-center py-4 italic">No habits available.</li>
            )}
        </ul>

        <div className="mt-10 pt-6 border-t border-gray-100">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Agrega un habito nuevo</h2>
            <div className="space-y-3">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Nombre del hábito"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-black sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="¿De qué trata?"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-black sm:text-sm"
                    />
                </div>
                <button
                    onClick={handleAddHabit}
                    className="w-full mt-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg shadow-green-100 transition-all active:scale-95"
                >
                    Add Habit
                </button>
            </div>
        </div>
    </div>
);
}