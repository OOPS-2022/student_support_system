import './App.css';
import react from 'react';

function App() {
  return (
  <div className='App'>
    <h1>Login</h1>
    <div className='form'>
    <label>Username:</label>
    <input type="text" name="Username"/>
    <label>Password:</label>
    <input type="text" name="Password"/>
    <button>Submit</button>
    </div>
  </div>
  );
}

export default App;
