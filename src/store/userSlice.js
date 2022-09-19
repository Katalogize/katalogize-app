import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    firstName: null,
    lastName: null,
    userId: null,
    username: null,
    isLogged: false
}

export const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        update(state, action) {
            state.firstName = action.payload.firstName;
            state.lastName = action.payload.lastName;
            state.userId = action.payload.userId;
            state.username = action.payload.username;
            state.isLogged = action.payload.isLogged;
        },
        logOut: state => {
            state.firstName = null;
            state.lastName = null;
            state.userId = null;
            state.username = null;
            state.isLogged = false;
        },
        logIn: state=> {
            state.isLogged = true;
        }
    }
})

export const { update, logOut, logIn } = userSlice.actions

export default userSlice.reducer