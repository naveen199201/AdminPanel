import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/DashBoard';
import AddAgent from './pages/AddAgent';
import UploadList from './pages/UploadList';
import AssignedList from './pages/AssignedList';
import TasksList from './pages/TasksList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-agent" element={<AddAgent />} />
        <Route path="/upload" element={<UploadList />} />
        <Route path="/itemsList/:id" element={<AssignedList />} />
        <Route path="/tasks" element={<TasksList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
