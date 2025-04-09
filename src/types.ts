export enum CHESS_CLOCK_STATUS {
    INITIAL = 'initial',
    RUNNING = 'running',
    PAUSED = 'paused',
    FINISHED = 'finished'
};

export enum CHESS_PLAYER_COLOR {
    WHITE = 'white',
    BLACK = 'black'
};

export type CHESS_PLAYER_STATE = {
    color: CHESS_PLAYER_COLOR, 
    time: number,
    increment: number,
    isActive: boolean,
    clicks: number,
};

export interface CHESS_CLOCK_STATE {
    status: CHESS_CLOCK_STATUS;
    players: Record<CHESS_PLAYER_COLOR, CHESS_PLAYER_STATE>;
};

export interface SAVE_SETTINGS_ACTION {
    color: CHESS_PLAYER_COLOR;
    time: number;
    increment: number;
    useForBothPlayers: boolean;
}
