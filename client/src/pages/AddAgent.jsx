
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const  AddAgentModal =({ onClose, onSuccess }) =>{
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePhoneChange = (value) => setForm({ ...form, mobile: `+${value}` });

  const handleSubmit = async () => {
    try {
      await api.post('/agent/create', form);
      toast.success('Agent added successfully');
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error adding agent');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Add Agent</h2>
      <input name="name" placeholder="Name" onChange={handleChange} className="w-full px-4 py-2 border rounded" />
      <input name="email" placeholder="Email" onChange={handleChange} className="w-full px-4 py-2 border rounded" />
      <PhoneInput
        country={'in'}
        value={form.mobile.replace('+', '')}
        onChange={handlePhoneChange}
        inputClass="!w-full !py-2 !pl-12 !border !rounded"
        containerClass="!w-full"
      />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full px-4 py-2 border rounded" />
      <button onClick={handleSubmit} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Add Agent</button>
    </div>
  );
}

export default AddAgentModal;

