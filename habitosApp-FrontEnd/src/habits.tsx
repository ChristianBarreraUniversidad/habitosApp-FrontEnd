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

export default function Habits({ habits }: HabitsProps) {
    return (
        <div className="w-full p-4 bg-white rounded-lg shadow-md mb-4">
            <h2>My Habits</h2>
            <ul className="habits-list">
                {habits.map((habit:Habit) => (
                    <li className={`flex items-center justify-between p-4 mb-2 rounded-lg bg-gray-100`} key={habit._id}>
                        <span className="text-black">{habit.title}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}   