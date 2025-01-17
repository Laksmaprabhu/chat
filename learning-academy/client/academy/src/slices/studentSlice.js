import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userId: '', // Default empty string
    username: '',
    email: '', // Added email for more user details
};

const studentSlice = createSlice({
    name: 'student',
    initialState,
    reducers: {
        setUserData: (state, action) => {
            state.userId = action.payload.userId;
            state.username = action.payload.username;
            state.email = action.payload.email;
        },
    },
});

export const { setUserData } = studentSlice.actions;
export default studentSlice.reducer;

