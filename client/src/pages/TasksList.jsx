import React, { useEffect, useState } from "react";
import api from "../services/api"; // your axios instance

const TasksList = () => {
  const [tasksList, setTasksList] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, usersRes] = await Promise.all([
          api.get(`/auth/list`),
          api.get(`/agent/usersList`), // Adjust endpoint as needed
        ]);
        setTasksList(tasksRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Helper to get user/agent name by ID
  const getAssignedName = (agentId) => {
    const user = users.find((u) => u._id === agentId);
    return user ? user.name || user.FirstName || "Unknown" : "Unassigned";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Assigned Tasks</h2>
      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {["First Name", "Phone", "Notes", "Assigned To", "Created At", "Updated At"].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasksList.map((task, idx) => (
              <tr
                key={task._id}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.FirstName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{task.Phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{task.Notes}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{getAssignedName(task.agentId)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(task.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(task.updatedAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {tasksList.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center px-6 py-4 text-gray-500">
                  No tasks assigned.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TasksList;
