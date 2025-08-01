import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import AddAgentModal from "../pages/AddAgent";
import UploadModal from "./UploadList";
import EditAgent from "./EditAgent";

function Dashboard() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [users, setUsers] = useState([]);
  const [lists, setLists] = useState([]);
  const [showAddAgentModal, setShowAddAgentModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);

    if (storedRole === "admin") {
      fetchUsers();
    } else {
      fetchList();
    }
  }, []);

  const fetchList = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const res = await api.get(`/agent/list/${userId}`);
      setLists(res.data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/agent/usersList");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this agent?")) return;
    try {
      await api.delete(`/agent/delete/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {role === "admin" ? "Admin Dashboard" : "Agent Dashboard"}
          </h1>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>

        {role === "admin" ? (
          <>
            <div className="flex gap-4 mb-6 justify-end">
              <button
                onClick={() => setShowAddAgentModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
              >
                Add Agent
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
              >
                Upload List
              </button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-blue-200 text-gray-600 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-3">Name</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3 text-center">Mobile</th>
                      <th className="px-6 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((agent, index) => (
                      <tr
                        key={agent._id}
                        className={`border-b hover:bg-gray-100 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="px-6 py-3">{agent.name}</td>
                        <td className="px-6 py-3">{agent.email}</td>
                        <td className="px-6 py-3 text-center">{agent.mobile}</td>
                        <td className="px-6 py-3 space-x-2 text-center">
                          <button
                            onClick={() => setEditingAgent(agent)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(agent._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white shadow rounded-lg overflow-hidden mt-8">
              <h2 className="text-xl font-semibold text-gray-700 bg-gray-100 px-6 py-4 border-b">
                Your Assigned List
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-blue-200 text-gray-600 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-3">First Name</th>
                      <th className="px-6 py-3">Phone</th>
                      <th className="px-6 py-3">Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lists.map((item, index) => (
                      <tr
                        key={item._id || item.agentId}
                        className={`border-b hover:bg-gray-100 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="px-6 py-3">{item.FirstName}</td>
                        <td className="px-6 py-3">{item.Phone}</td>
                        <td className="px-6 py-3">{item.Notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {showAddAgentModal && (
        <div className="fixed inset-0 bg-opacity-30 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setShowAddAgentModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              &times;
            </button>
            <AddAgentModal
              onClose={() => setShowAddAgentModal(false)}
              onSuccess={fetchUsers}
            />
          </div>
        </div>
      )}

      {showUploadModal && (
        <div className="fixed inset-0 bg-opacity-30 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              &times;
            </button>
            <UploadModal onClose={() => setShowUploadModal(false)} />
          </div>
        </div>
      )}

      {/* Edit Agent Modal */}
      {editingAgent && (
        <EditAgent
          agent={editingAgent}
          onClose={() => setEditingAgent(null)}
          onSuccess={fetchUsers}
        />
      )}
    </div>
  );
}

export default Dashboard;
