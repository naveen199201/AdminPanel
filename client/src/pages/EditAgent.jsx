import { useState, useEffect } from "react";
import api from "../services/api";

const EditAgent = ({ agent, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  // Initialize form values when agent changes
  useEffect(() => {
    if (agent) {
      setForm({
        name: agent.name || "",
        email: agent.email || "",
        mobile: agent.mobile || "",
      });
    }
  }, [agent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/agent/update/${agent._id}`, form);
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  if (!agent) return null;

  return (
    <div className="fixed inset-0 bg-opacity-30 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">Edit Agent</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Mobile</label>
            <input
              type="text"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditAgent;
