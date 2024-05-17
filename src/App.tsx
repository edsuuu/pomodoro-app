import React from 'react';
import './App.css';

import { PomodoroTimer } from './components/pomodoro-timer';

function App(): JSX.Element {
  return (
    <div className="container">
      <h1>PomoFocus</h1>
      <PomodoroTimer pomodoroTime={1500} shortRestTime={300} longRestTime={900} cycles={4}/>
    </div>
  );
}

export default App;
