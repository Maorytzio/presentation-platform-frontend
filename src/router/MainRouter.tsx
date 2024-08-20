import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from '../App';
import PresentationPreview from '../pages/PresentationPreview';

function MainRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/presentation/:title" element={<PresentationPreview />} />
      </Routes>
    </Router>
  );
}

export default MainRouter;
