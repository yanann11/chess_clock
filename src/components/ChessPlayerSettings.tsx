import { FC, useCallback, useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";

import { INITIAL_TIME, INITIAL_INCREMENT, CHESS_CLOCK_MAX_WIDTH, CHESS_CLOCK_MAX_HEIGHT } from "@/consts";
import { CHESS_PLAYER_COLOR } from "@/types";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { saveSettings } from "@/store/rootReducer";
import { AppDispatch } from "@/store";
import { formatTimeControl, generateSliderTimeSteps, generateSliderIncrementSteps, getSliderIndexByValue } from "@/helpers";

const presetTimeControls = [
    '1+0', '2+1', '3+0',
    '3+2', '5+0', '5+3',
    '10+0', '10+5', '15+10',
    '20+10', '30+0', 'custom'
];

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

    const [timeControlValue, setTimeControlValue] = useState(timeControl);
    const [customTime, setCustomTime] = useState(0);
    const [customIncrement, setCustomIncrement] = useState(0);
    const [useForBothPlayers, setUseForBothPlayers] = useState(true);

    // set initial values after closing dialog
    useEffect(() => {
        if (!open) {
            setCustomTime(getSliderIndexByValue(customTimeSteps, INITIAL_TIME / 60));
            setCustomIncrement(getSliderIndexByValue(customIncrementSteps, INITIAL_INCREMENT));
            setUseForBothPlayers(true);
        }
    }, [
        open,
        setUseForBothPlayers,
        setCustomTime,
        setCustomIncrement
    ]);

    const isCustomTimeControl = useMemo(() => timeControlValue === 'custom' || !presetTimeControls.includes(timeControlValue), [
        timeControlValue
    ]);

    const onDialogClose = useCallback(() => {
        let time, increment;
        if (isCustomTimeControl) {
            time = customTimeSteps[customTime];
            increment = customIncrementSteps[customIncrement];
        } else {        
            [time, increment] = timeControlValue.split('+').map((val) => Number(val));
        }
        dispatch(saveSettings({ color, time: time* 60, increment, useForBothPlayers }));
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                style={{ width: `${CHESS_CLOCK_MAX_WIDTH}px`, height: `${CHESS_CLOCK_MAX_HEIGHT}px`, maxWidth: "100vw", maxHeight: "100vh" }}
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
                                    onClick={() => setTimeControlValue(i)}
                                >
                                    {i === 'custom' ? 'Custom': i}
                                </Button>
                            );
                        })}
                    </div>
                    <div className={'flex items-center flex-col mt-2'}>
                        {formatTimeControl(isCustomTimeControl ? `${customTimeSteps[customTime]}+${customIncrementSteps[customIncrement]}` : timeControlValue)}
                    </div>
                    <Slider
                        disabled={!isCustomTimeControl}
                        id="sliderTime"
                        min={0}
                        max={customTimeSteps.length - 1}
                        step={1}
                        value={[customTime]}
                        onValueChange={([newIndex]) => setCustomTime(newIndex)}
                    />
                    <Slider
                        disabled={!isCustomTimeControl}
                        id="sliderIncrement"
                        min={0}
                        max={customIncrementSteps.length - 1}
                        step={1}
                        value={[customIncrement]}
                        onValueChange={([newIndex]) => setCustomIncrement(newIndex)}
                    />
                    <div className="flex items-center space-x-2">
                        <Switch id="airplane-mode" checked={useForBothPlayers} onCheckedChange={setUseForBothPlayers}/>
                        <Label htmlFor="airplane-mode">Use for both players</Label>
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
