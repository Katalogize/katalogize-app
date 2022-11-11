import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    displayName: null,
    userId: null,
    username: null,
    isLogged: false,
    isAdmin: false,
    picture: null
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
            state.picture = action.payload.picture;
        },
        logOut: state => {
            state.displayName = null;
            state.userId = null;
            state.username = null;
            state.isLogged = false;
            state.isAdmin = false;
            state.picture = null;
        },
        logIn: state=> {
            state.isLogged = true;
        },
        updatePicture(state, action) {
            state.picture = action.payload.picture;
        }
    }
})

export const { update, logOut, logIn, updatePicture } = userSlice.actions

export default userSlice.reducer