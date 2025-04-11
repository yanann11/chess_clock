// initial time control - 10+5
export const INITIAL_TIME = 10 * 60;
export const INITIAL_INCREMENT = 5;

export const HOUR = 3600; // 60*60 seconds;
export const MINUTE = 60; // 60 seconds;

export const CHESS_CLOCK_WIDTH = 300; // px
export const CHESS_CLOCK_HEIGHT = 600; // px

export const TIME_CONTROL = {
    '60+0': "1+0", '120+1': "2+1", '180+0': "3+0",
    '180+2': "3+2", '300+0': "5+0", '300+3': "5+3",
    '600+0': "10+0", '600+5': "10+5", '900+10': "15+10",
    '1200+10': "20+10", '1800+0': "30+0", 'custom': "Custom"
};
