import React, { useEffect, useState, useCallback } from 'react';
import { useInterval } from '../hooks/use-interval';
import { Button } from './button';
import { Timer } from './timer';
import { secondsToTime } from '../utils/seconds-to-time';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const start = require('../sounds/among-us-roundstart.mp3');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pause = require('../sounds/fortnite.mp3');

const audioStartWorking = new Audio(start);
audioStartWorking.volume = 0.3;
const audioStopWorking = new Audio(pause);
audioStopWorking.volume = 0.3;

interface Props {
    pomodoroTime: number;
    shortRestTime: number;
    longRestTime: number;
    cycles: number;
}

export function PomodoroTimer(props: Props): JSX.Element {
    const [mainTime, setMainTime] = useState(props.pomodoroTime);
    const [timeCounting, setTimeCounting] = useState(false);
    const [working, setWorking] = useState(false);
    const [resting, setResting] = useState(false);
    const [cyclesQtdManager, setCyclesQtdManager] = useState(new Array(props.cycles - 1).fill(true));

    const [completedCycles, setCompletedCycles] = useState(0);
    const [fullWorkingTime, setFullWorkingTime] = useState(0);
    const [numberOfPomodoros, setNumberOfPomodoros] = useState(0);

    useInterval(
        () => {
            setMainTime(mainTime - 1);
            if (working) setFullWorkingTime(fullWorkingTime + 1);
        },
        timeCounting ? 1000 : null,
    );

    const configureWork = useCallback(() => {
        setTimeCounting(true);
        setWorking(true);
        setResting(false);
        setMainTime(props.pomodoroTime);
        audioStartWorking.play();
    }, [setTimeCounting, setWorking, setResting, setMainTime, props.pomodoroTime]);

    const configureRest = useCallback(
        (long: boolean) => {
            setTimeCounting(true);
            setWorking(false);
            setResting(true);

            if (long) {
                setMainTime(props.longRestTime);
            } else {
                setMainTime(props.shortRestTime);
            }

            audioStopWorking.play();
        },
        [setTimeCounting, setWorking, setResting, setMainTime, props.longRestTime, props.shortRestTime],
    );

    useEffect(() => {
        if (working) document.body.classList.add('working');
        if (working) document.body.classList.remove('rest-desc');
        if (resting) document.body.classList.add('rest-desc');
        if (resting) document.body.classList.remove('working');

        if (mainTime > 0) return;

        if (working && cyclesQtdManager.length > 0) {
            configureRest(false);
            cyclesQtdManager.pop();
        } else if (working && cyclesQtdManager.length <= 0) {
            configureRest(true);
            setCyclesQtdManager(new Array(props.cycles - 1).fill(true));
            setCompletedCycles(completedCycles + 1);
        }

        if (working) setNumberOfPomodoros(numberOfPomodoros + 1);
        if (resting) configureWork();
    }, [working, resting, mainTime, cyclesQtdManager, numberOfPomodoros, completedCycles, configureRest, setCyclesQtdManager, configureWork, props.cycles]);

    return (
        <div className="pomodoro">
            <h2>Você está: {working ? 'Trabalhando' : 'Descansando'}</h2>
            <Timer mainTimer={mainTime} />

            <div className="controls">
                <div>
                    <Button text="Trabalhando" onClick={() => configureWork()}></Button>
                    <Button text="Descansando" onClick={() => configureRest(false)}></Button>
                </div>
                <div>
                    <Button className={!working && !resting ? 'hidden' : ''} text={timeCounting ? 'Pausar' : 'Continuar'} onClick={() => setTimeCounting(!timeCounting)}></Button>
                </div>
            </div>

            <div className="details">
                <p>
                    Ciclos concluídos: <span>{completedCycles}</span>
                </p>
                <p>
                    Horas trabalhadas: <span>{secondsToTime(fullWorkingTime)}</span>
                </p>
                <p>
                    Pomodoros concluídos: <span>{numberOfPomodoros}</span>
                </p>
            </div>
        </div>
    );
}
