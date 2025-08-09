import React, { useEffect, useState } from "react";
import api from "../services/api";

const AssignedList = () => {
  const [agents, setAgents] = useState([]);
  const [assignedCount, setAssignedCount] = useState(0);

  useEffect(() => {
    const fetchAssignedList = async () => {
      const userId = localStorage.getItem("agentId");
      if (!userId) return;

      try {
        const response = await api.get(`/agent/itemsList/${userId}`);
        setAgents(response.data);
        setAssignedCount(response.data.length);
      } catch (error) {
        console.error("Error fetching assigned items:", error);
      }
    };

    fetchAssignedList();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-900">
          Assigned List{" "}
          <span className="text-indigo-600">{assignedCount}</span>
        </h1>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-md">
            <thead className="bg-indigo-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-800 uppercase tracking-wide">
                  First Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-800 uppercase tracking-wide">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-800 uppercase tracking-wide">
                  Notes
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-800 uppercase tracking-wide">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {agents.map((agent, idx) => (
                <tr
                  key={agent._id}
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-indigo-50"
                  } hover:bg-indigo-200 cursor-pointer transition-colors`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                    {agent.FirstName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {agent.Phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {agent.Notes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                    {new Date(agent.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {agents.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-6 text-gray-500 font-medium"
                  >
                    No assigned items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssignedList;
