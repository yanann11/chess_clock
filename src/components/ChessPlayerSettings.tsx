import { FC, useCallback, useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";

import { INITIAL_TIME, INITIAL_INCREMENT, TIME_CONTROL } from "@/consts";
import { CHESS_PLAYER_COLOR } from "@/types";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { saveSettings } from "@/store/rootReducer";
import { AppDispatch } from "@/store";
import {
    getTimeControlValue, extractTimeControlValue, formatTimeControl, 
    generateSliderTimeSteps, generateSliderIncrementSteps, getSliderIndexByValue, getChessClockSize } from "@/helpers";
import { useWindowSize } from "@/hooks/useWindowSize";

type TimeControlKey = keyof typeof TIME_CONTROL;
const presetTimeControls: TimeControlKey[] = Object.keys(TIME_CONTROL) as TimeControlKey[];

const customTimeSteps = generateSliderTimeSteps();
const customIncrementSteps = generateSliderIncrementSteps();

type ChessPlayerSettingsProps = {
    color: CHESS_PLAYER_COLOR;
    open: boolean;
    timeControl: string;
    setOpen: (open: boolean) => void;
    onClose: () => void;
};

const ChessPlayerSettings :FC<ChessPlayerSettingsProps> = ({color, open, setOpen, onClose, timeControl}) => {
    const dispatch = useDispatch<AppDispatch>();

    const windowSize =  useWindowSize();
    const chessClockSize = getChessClockSize(windowSize);

    const [timeControlValue, setTimeControlValue] = useState(timeControl);
    const [customTime, setCustomTime] = useState(0);
    const [customIncrement, setCustomIncrement] = useState(0);
    const [useForBothPlayers, setUseForBothPlayers] = useState(true);

    // set initial values after closing dialog
    useEffect(() => {
        if (!open) {
            setCustomTime(getSliderIndexByValue(customTimeSteps, INITIAL_TIME));
            setCustomIncrement(getSliderIndexByValue(customIncrementSteps, INITIAL_INCREMENT));
            setUseForBothPlayers(true);
        }
    }, [
        open,
        setCustomTime,
        setCustomIncrement,
        setUseForBothPlayers
    ]);

    // sync timeControlValue with sliders' values
    useEffect(() => {
        const newTimeControlValue = getTimeControlValue(customTimeSteps[customTime], customIncrementSteps[customIncrement]);
        setTimeControlValue(newTimeControlValue);          
    }, [
        customTime,
        customIncrement,
        setTimeControlValue,
    ]);

    const isCustomTimeControl = useMemo(() => timeControlValue === 'custom' || !(timeControlValue in TIME_CONTROL), [
        timeControlValue
    ]);

    // save settings
    const onDialogClose = useCallback(() => {
        const [time, increment] = isCustomTimeControl ?
            [customTimeSteps[customTime], customIncrementSteps[customIncrement]] :
            extractTimeControlValue(timeControlValue);
        dispatch(saveSettings({ color, time: time, increment, useForBothPlayers }));
        onClose(); 
    }, [
        color,
        isCustomTimeControl,
        timeControlValue,
        customTime,
        customIncrement,
        useForBothPlayers,
        onClose
    ]);

    // update sliders for current timeControlValue
    const onTimeControlClick = useCallback((i: TimeControlKey) => {
        setTimeControlValue(i);
        if (i === 'custom') {
            return;
        }
        const [time, increment] = extractTimeControlValue(i);
        setCustomTime(getSliderIndexByValue(customTimeSteps, time));
        setCustomIncrement(getSliderIndexByValue(customIncrementSteps, increment))
    }, [
        setTimeControlValue,
        setCustomTime,
        setCustomIncrement,
    ]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                style={{ width: chessClockSize.width, height: chessClockSize.height }}
            >
                <DialogHeader>
                    <DialogTitle>{'Chess clock settings'}</DialogTitle>
                    <DialogDescription/>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-3 items-center gap-4">
                        {presetTimeControls.map((i) =>{
                            const isActive = i === 'custom' && isCustomTimeControl || i === timeControlValue;
                            return (
                                <Button
                                    key={i}
                                    variant={isActive ? "default" : "secondary"}
                                    onClick={() => onTimeControlClick(i)}
                                >
                                    {TIME_CONTROL[i]}
                                </Button>
                            );
                        })}
                    </div>
                    <div className={'flex items-center flex-col mt-2'}>
                        {formatTimeControl(isCustomTimeControl ? getTimeControlValue(customTimeSteps[customTime], customIncrementSteps[customIncrement]) : timeControlValue)}
                    </div>
                    <Slider
                        id="sliderTime"
                        min={0}
                        max={customTimeSteps.length - 1}
                        step={1}
                        value={[customTime]}
                        onValueChange={([newIndex]) => setCustomTime(newIndex)}
                    />
                    <Slider
                        id="sliderIncrement"
                        min={0}
                        max={customIncrementSteps.length - 1}
                        step={1}
                        value={[customIncrement]}
                        onValueChange={([newIndex]) => setCustomIncrement(newIndex)}
                    />
                    <div className="flex items-center space-x-2">
                        <Switch id="useForBothPlayers" checked={useForBothPlayers} onCheckedChange={setUseForBothPlayers}/>
                        <Label htmlFor="useForBothPlayers">Use for both players</Label>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={onDialogClose}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export { ChessPlayerSettings };
