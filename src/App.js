import React, { Component } from 'react';
import './App.css';
import WeatherWidget from './components/WeatherWidget';

class App extends Component {
  render() {
    return (
      <div className="App">
        <p>Hello!!!</p>
        <WeatherWidget></WeatherWidget>
      </div>
    );
  }
}

export default App;
