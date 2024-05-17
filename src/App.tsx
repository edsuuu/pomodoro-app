import React from 'react';
import './App.css';

import { PomodoroTimer } from './components/pomodoro-timer';

function App(): JSX.Element {
  return (
    <div className="App">
      <h1>hello</h1>
      <PomodoroTimer defaultPomodoroTime={3600}/>
    </div>
  );
}

export default App;
