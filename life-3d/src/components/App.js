import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import World from './World';
import Home from './Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/world' element={<World />} />
      </Routes>
    </Router>
  );
}

export default App;
