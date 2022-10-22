import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    displayName: null,
    userId: null,
    username: null,
    isLogged: false,
    isAdmin: false
}

export const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        update(state, action) {
            state.displayName = action.payload.displayName;
            state.userId = action.payload.userId;
            state.username = action.payload.username;
            state.isLogged = action.payload.isLogged;
            state.isAdmin = action.payload.isAdmin;
        },
        logOut: state => {
            state.displayName = null;
            state.userId = null;
            state.username = null;
            state.isLogged = false;
            state.isAdmin = false;
        },
        logIn: state=> {
            state.isLogged = true;
        }
    }
})

export const { update, logOut, logIn } = userSlice.actions

export default userSlice.reducer