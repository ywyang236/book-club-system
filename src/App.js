import React from 'react';
import './App.css';
// import Navbar from './components/Navbar';
import UserList from './components/UserList';
// import HistoryList from './components/HistoryList';
import Background from './components/Background';


function App() {
  return (
    <div className="App">
      <Background />
      {/* <Navbar /> */}
      <UserList />
      {/* <HistoryList /> */}
    </div>
  );
}

export default App;
