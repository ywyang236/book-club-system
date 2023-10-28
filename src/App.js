import React from 'react';
import UserList from './components/UserList';
// import HistoryList from './components/HistoryList';
import Background from './components/Background';


function App() {
  return (
    <div className="App">
      <Background />
      <UserList />
      {/* <HistoryList /> */}
    </div>
  );
}

export default App;
