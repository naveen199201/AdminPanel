import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddAgent from './pages/AddAgent';
import UploadList from './pages/UploadList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-agent" element={<AddAgent />} />
        <Route path="/upload" element={<UploadList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
