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
            if (action.payload.displayName != null) {
                state.displayName = action.payload.displayName;
            }
            if (action.payload.userId != null) {
                state.userId = action.payload.userId;
            } 
            if (action.payload.username != null) {
                state.username = action.payload.username;
            }
            if (action.payload.username != null) {
                state.isLogged = action.payload.isLogged;
            }
            if (action.payload.isAdmin != null) {
                state.isAdmin = action.payload.isAdmin;
            }
            if (action.payload.picture != null) {
                state.picture = action.payload.picture;
            }
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