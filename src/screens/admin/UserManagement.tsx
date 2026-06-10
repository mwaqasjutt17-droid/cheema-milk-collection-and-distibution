import React, { useState } from 'react';
import { Search, Plus, Edit2, ShieldOff, Shield, Trash2, Power, PowerOff } from 'lucide-react';
import { Role } from '../../types';
import { useUserContext, User } from '../../contexts/UserContext';

export default function UserManagement() {
  const { users, addUser, updateUser, deleteUser, toggleUserStatus } = useUserContext();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    phone: '',
    role: 'Driver' as User['role'],
  });

  const filteredUsers = users.filter((u) => 
    u.fullName.toLowerCase().includes(search.toLowerCase()) || 
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateUser(editingId, formData);
    } else {
      addUser({ ...formData, status: 'Active' });
    }
    closeModal();
  };

  const openModal = (user?: User) => {
    if (user) {
      setEditingId(user.id);
      setFormData({
        fullName: user.fullName,
        username: user.username,
        phone: user.phone,
        role: user.role
      });
    } else {
      setEditingId(null);
      setFormData({
        fullName: '',
        username: '',
        phone: '',
        role: 'Driver',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="bg-white border rounded-xl flex flex-col overflow-hidden shadow-sm flex-1">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="font-bold text-slate-800">User Roster</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1.5 w-3.5 h-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-48 pl-8 pr-3 py-1 border border-slate-200 rounded-md bg-slate-50 text-slate-700 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <button 
              onClick={() => openModal()}
              className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-md hover:bg-blue-700 transition-colors"
            >
              + Add User
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-50 border-b z-10">
              <tr>
                <th className="px-6 py-3 text-[10px] uppercase font-bold text-slate-500">Full Name</th>
                <th className="px-6 py-3 text-[10px] uppercase font-bold text-slate-500">Username</th>
                <th className="px-6 py-3 text-[10px] uppercase font-bold text-slate-500">Role</th>
                <th className="px-6 py-3 text-[10px] uppercase font-bold text-slate-500">Status</th>
                <th className="px-6 py-3 text-[10px] uppercase font-bold text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className={`hover:bg-slate-50 transition-colors ${user.status === 'Inactive' ? 'opacity-50' : ''}`}>
                  <td className="px-6 py-4 text-sm font-bold text-slate-700">{user.fullName}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono">{user.username}</td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full w-max ${
                      user.status === 'Active' 
                        ? 'text-green-600 bg-green-100' 
                        : 'text-slate-500 bg-slate-100'
                    }`}>
                      {user.status === 'Active' ? '• ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-3 items-center">
                      <button onClick={() => openModal(user)} className="text-blue-600 font-bold text-xs hover:text-blue-800" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => toggleUserStatus(user.id)} className={`${user.status === 'Active' ? 'text-slate-500 hover:text-slate-700' : 'text-green-600 hover:text-green-800'} font-bold text-xs`} title={user.status === 'Active' ? 'Disable' : 'Enable'}>
                        {user.status === 'Active' ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                      </button>
                      <button onClick={() => deleteUser(user.id)} className="text-red-500 font-bold text-xs hover:text-red-700" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-4">{editingId ? 'Edit User' : 'Add New User'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Full Name</label>
                <input required type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full px-3 py-1.5 border rounded bg-slate-50 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Username</label>
                <input required type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} className="w-full px-3 py-1.5 border rounded bg-slate-50 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Phone Number</label>
                <input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-1.5 border rounded bg-slate-50 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Role</label>
                <select required value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full px-3 py-1.5 border rounded bg-slate-50 text-sm focus:ring-1 focus:ring-blue-500 outline-none">
                  <option value="Driver">Driver</option>
                  <option value="Accountant">Accountant</option>
                  <option value="Lab Technician">Lab Technician</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="flex space-x-3 mt-6 pt-4 border-t border-slate-100">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 text-sm font-bold rounded-md hover:bg-slate-200">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-md hover:bg-blue-700">Save User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
