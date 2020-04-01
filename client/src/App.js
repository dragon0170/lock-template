import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';

let socket;

function handleClickEnterCube() {
  socket.emit('enter cube', 10)
}

function handleClickUnlockCube() {
  socket.emit('release lock', 10)
}

function handleClickLockCube() {
  socket.emit('acquire lock', 10)
}

function handleClickLeaveCube() {
  socket.emit('leave cube', 10)
}

function App() {
  const [isLocked, setIsLocked] = useState(false);
  const [isLockAcquired, setIsLockAcquired] = useState(false);
  useEffect(() => {
    socket = io('http://localhost:8000');
    socket.on('connect', () => {
      console.log('connected');
    });
    socket.on('update lock status', (locked) => {
      console.log('locked: ', locked);
      setIsLocked(locked);
    });
    socket.on('locked', (result) => {
      console.log('acquire lock result: ', result);
      setIsLockAcquired(result);
    });
    socket.on('unlocked', (result) => {
      console.log('release lock result: ', result);
      setIsLockAcquired(!result);
    });
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        {isLockAcquired && <p>I acquired a lock</p>}
        <button onClick={handleClickEnterCube}>
          Enter Cube
        </button>
        <button onClick={handleClickLockCube} disabled={isLocked || isLockAcquired}>
          Lock Cube
        </button>
        <button onClick={handleClickUnlockCube} disabled={!isLockAcquired}>
          Unlock Cube
        </button>
        <button onClick={handleClickLeaveCube}>
          Leave Cube
        </button>
      </header>
    </div>
  );
}

export default App;
