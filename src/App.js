import logo from './logo.svg';
import './App.css';
import ExcelUploader from './ExcelUploader';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
  <ExcelUploader/>
  // <Router>
  //     <Routes>
  //       <Route path="/" element={<FileUpload />} />
  //       <Route path="/graphical-analysis" element={<GraphicalAnalysis />} />
  //     </Routes>
  //   </Router>
  );
}

export default App;
