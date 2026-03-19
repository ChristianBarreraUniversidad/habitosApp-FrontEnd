import { configureStore } from '@reduxjs/toolkit'
import habitReducer from './features/habit/habitSlice';
import userReducer from "./features/user/userSlice";
export const store = configureStore({
    reducer: {
    habits: habitReducer,
    user: userReducer,
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch