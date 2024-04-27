// App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CovidDati from './datatable';
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CovidDati />} />
      </Routes>
    </Router>
  );
};

export default App;
