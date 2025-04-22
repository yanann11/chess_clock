import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { INITIAL_TIME, INITIAL_INCREMENT } from "@/consts"
import { CHESS_CLOCK_STATUS, CHESS_PLAYER_COLOR, CHESS_CLOCK_STATE, SAVE_SETTINGS_ACTION, CHESS_PLAYER_STATE } from "@/types";

const WhitePlayerInitialState: CHESS_PLAYER_STATE = {
    color: CHESS_PLAYER_COLOR.WHITE,
    time: INITIAL_TIME,
    increment: INITIAL_INCREMENT,
    isActive: false,
    clicks: 0
};

const BlackPlayerInitialState: CHESS_PLAYER_STATE = Object.assign({}, WhitePlayerInitialState, {
    color: CHESS_PLAYER_COLOR.BLACK
});

const initialState: CHESS_CLOCK_STATE = {
    status: CHESS_CLOCK_STATUS.INITIAL,
    players: {
        [CHESS_PLAYER_COLOR.WHITE]: WhitePlayerInitialState,
        [CHESS_PLAYER_COLOR.BLACK]: BlackPlayerInitialState
    }
 };

const rootSlice = createSlice({
  name: 'root',
  initialState,
  reducers: {
    start: (state) => {
        state.status = CHESS_CLOCK_STATUS.RUNNING;
        const activeChessPlayerColor = selectActiveClessPlayer(state);

        state.players[activeChessPlayerColor] = {
            ...state.players[activeChessPlayerColor], 
            isActive: true 
        };
    },
    pause: (state) => {
        state.status = CHESS_CLOCK_STATUS.PAUSED;
    },
    reset: (state) => {
        state.status = initialState.status;
        state.players = initialState.players;
    },
    finish: (state) => {
        state.status = CHESS_CLOCK_STATUS.FINISHED;
    },
    chessPlayerClick: (state, action: PayloadAction<CHESS_PLAYER_COLOR>) => {
        const color = action.payload;
        const chessPlayer = selectChessPlayer(state, color);      
        state.players[color] = {
            ...chessPlayer, 
            clicks: chessPlayer.clicks + 1,
            isActive: false 
        };

        const anotherChessPlayer = selectAnotherChessPlayer(state, color);
        state.players[anotherChessPlayer.color] = {
            ...anotherChessPlayer, 
            isActive: true 
        };
    },
    saveSettings: (state, action: PayloadAction<SAVE_SETTINGS_ACTION>) => {
        const { color, time, increment, useForBothPlayers }  = action.payload;

        const chessPlayer = selectChessPlayer(state, color);
        state.players[color] = {
            ...chessPlayer, 
            time,
            increment 
        };
 
        if (useForBothPlayers) {
            const anotherChessPlayer = selectAnotherChessPlayer(state, color);
            state.players[anotherChessPlayer.color] = {
                ...anotherChessPlayer, 
                time,
                increment 
            };
        }
    }
  },
});

export const selectStatus = (state: RootState) => state.status;

export const selectActiveClessPlayer = (state: RootState): CHESS_PLAYER_COLOR => {
    for (const chessPlayer of Object.values(state.players)) {
        if (chessPlayer.isActive) {
            return  chessPlayer.color;
        }
    }
    return CHESS_PLAYER_COLOR.WHITE;
};

export const selectChessPlayer = (state: RootState, color: CHESS_PLAYER_COLOR): CHESS_PLAYER_STATE => state.players[color];

export const selectAnotherChessPlayer = (state: RootState, color: CHESS_PLAYER_COLOR): CHESS_PLAYER_STATE =>
    state.players[color === CHESS_PLAYER_COLOR.WHITE ? CHESS_PLAYER_COLOR.BLACK : CHESS_PLAYER_COLOR.WHITE];


export const { start, pause, reset, finish, chessPlayerClick, saveSettings } = rootSlice.actions;
export default rootSlice.reducer;
