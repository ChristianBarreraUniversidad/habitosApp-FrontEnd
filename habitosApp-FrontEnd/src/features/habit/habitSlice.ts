import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchAddHabit, fetchHabits, markAsDone } from './habitAPI';

type Habit = {
    _id: string;
    title: string;
    description: string;
    createdAt: string;
    days: number;
    lastDone: Date;
    lastUpdated: Date;
}

type HabitState = {
    habits: Habit[],
    status: Record<string, 'idle' | 'loading' | 'succeeded' | 'failed'>,
    error: Record<string, string | null>
}

const initialState: HabitState = {
    habits: [],
    status: {},
    error: {}
}
type markAsDoneThunkParams = {
    habitId: string;
}

export const fetchHabitThunk = createAsyncThunk('habits/fetchHabits',async (token: string) => { 
    return await fetchHabits(token); }
);

export const markAsDoneThunk = createAsyncThunk("habit/markAsDone", async ({habitId, token}: markAsDoneThunkParams & { token: string }, { rejectWithValue }) => {
    const responseJson = await markAsDone(habitId, token);
    console.log(responseJson);
    if (responseJson.message === "Habit marked as done") {
        return "Habito marcado como hecho";
    } else if (responseJson.message === "Habit restarted") { 
        return rejectWithValue(responseJson.message);
    } else {
        return rejectWithValue("Failed to mark habit as done");
    }
});

export const fetchAddHabitThunk = createAsyncThunk('habits/addHabit', async ({token, title, description}: { token: string, title: string, description: string, days?: number }) => {
    const response = await fetchAddHabit(token, title, description);
    const responseJson = await response.json();
    return responseJson;
});

const habitSlice = createSlice({
    name: 'habits',
    initialState,
    reducers: {
        addHabits: (state, action) => {
        state.habits = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchHabitThunk.fulfilled, (state, action) => {
                state.habits = action.payload;
            }).addCase(markAsDoneThunk.fulfilled, (state, action) => {
                const id = action.meta.arg.habitId;
                state.status[id] = 'succeeded';
                state.error[id] = action.payload as string;
            }).addCase(markAsDoneThunk.rejected, (state, action) => {
                state.status [action.meta.arg.habitId] = 'failed';
                state.error [action.meta.arg.habitId] = action.payload as string;
        })
    }
});

export const { addHabits } = habitSlice.actions;
export default habitSlice.reducer;