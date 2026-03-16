import { useSelector,  useDispatch} from "react-redux"; 
import { markAsDoneThunk } from "./features/habitSlice";
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

const handleMarkAsDone = (habitId: string, dispatch: AppDispatch) => {
    dispatch(markAsDoneThunk({ habitId }));
}

const calculateProgress = (days: number): number => {
    const currentDays = days || 0; // Asegura que days sea un número, incluso si es undefined
    return Math.min((days / 66) * 100, 100);
};

export default function Habits({ habits }: HabitsProps) {
    const dispatch = useDispatch<AppDispatch>();
    const {status, error} = useSelector((state: RootState) => state.habits);

    return (
        <div className="w-full p-4 bg-white rounded-lg shadow-md mb-4">
            <h2>My Habits</h2>
            <ul className="habits-list">
                {habits.map((habit:Habit) => (
                    <li className={`flex items-center justify-between p-4 mb-2 rounded-lg bg-gray-100`} key={habit._id}>
                        <span className="text-black">{habit.title}</span>
                        <progress className='w-24' value={calculateProgress(habit.days)} max="100"></progress>
                                <button className="px-2 py-1 text-sm text-white bg-blue-500 rounded" 
                                    onClick={() => handleMarkAsDone(habit._id, dispatch)}>
                                    {status[habit._id] === "loading" ? "Processing" : "Mark as Done"}
                                </button>
                                {status[habit._id] === "failed" && <span className="text-red-500">{error[habit._id]}</span>}
                                {status[habit._id] === "succeeded" && <span className="text-green-500">Already marked as done!</span>}
                    </li>
                ))}
            </ul>
        </div>
    );
}   