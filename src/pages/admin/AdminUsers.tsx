import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, UserPlus, Edit2, Trash2, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

// Mock users data
const mockUsers = [
  { id: '1', name: 'John Smith', email: 'owner@coffee.com', role: 'owner' },
  { id: '2', name: 'Sarah Johnson', email: 'manager@coffee.com', role: 'manager' },
  { id: '3', name: 'Mike Brown', email: 'supervisor@coffee.com', role: 'supervisor' },
  { id: '4', name: 'Emily Davis', email: 'waiter1@coffee.com', role: 'waiter' },
  { id: '5', name: 'David Wilson', email: 'waiter2@coffee.com', role: 'waiter' }
];

const AdminUsers: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [users, setUsers] = useState(mockUsers);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    role: 'waiter',
    password: ''
  });

  const canEditUsers = hasPermission('supervisor');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditClick = (userData: typeof users[0]) => {
    setEditingUser(userData.id);
    setFormData({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      password: ''
    });
    setShowAddForm(false);
  };

  const handleAddNew = () => {
    setShowAddForm(true);
    setEditingUser(null);
    setFormData({
      id: `user-${Date.now()}`,
      name: '',
      email: '',
      role: 'waiter',
      password: ''
    });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setShowAddForm(false);
  };

  const handleSave = () => {
    // In a real app, this would update the database
    console.log('Saving user:', formData);
    toast.success(`${editingUser ? 'Updated' : 'Added'} user successfully`);

    if (editingUser) {
      // Update existing user
      setUsers(prev => prev.map(u => u.id === editingUser ? { ...formData, id: u.id } : u));
    } else {
      // Add new user
      setUsers(prev => [...prev, { ...formData, id: `user-${Date.now()}` }]);
    }

    setEditingUser(null);
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      // In a real app, this would update the database
      console.log('Deleting user:', id);
      setUsers(prev => prev.filter(u => u.id !== id));
      toast.success('User deleted successfully');
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-500/20 text-purple-500';
      case 'supervisor':
        return 'bg-red-500/20 text-red-500';
      case 'manager':
        return 'bg-blue-500/20 text-blue-500';
      case 'waiter':
        return 'bg-green-500/20 text-green-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-bold font-serif">User Management</h1>
        {canEditUsers && (
          <button
            onClick={handleAddNew}
            className="px-4 py-2 bg-primary text-dark rounded-md flex items-center text-sm font-medium"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add New User
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {canEditUsers && (showAddForm || editingUser) && (
        <div className="bg-dark-light rounded-lg p-4 md:p-6 mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-bold mb-4">
            {editingUser ? 'Edit User' : 'Add New User'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input text-sm"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input text-sm"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="input text-sm"
                required
              >
                {hasPermission('owner') && <option value="owner">Owner</option>}
                {hasPermission('supervisor') && <option value="supervisor">Supervisor</option>}
                {hasPermission('manager') && <option value="manager">Manager</option>}
                <option value="waiter">Waiter</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm">Password {editingUser && '(leave blank to keep current)'}</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="input text-sm"
                required={!editingUser}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4 md:mt-6">
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 border border-gray-600 rounded-md text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary text-dark rounded-md text-sm"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Users - Mobile Cards */}
      <div className="block md:hidden space-y-4 mb-6">
        {users.map((userData) => (
          <div key={userData.id} className="bg-dark-light rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-dark rounded-full flex items-center justify-center mr-4">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{userData.name}</h3>
                <p className="text-sm text-gray-400">{userData.email}</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(userData.role)}`}>
                  <Shield className="w-3 h-3 mr-1" />
                  {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                </span>
              </div>
            </div>

            {canEditUsers && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditClick(userData)}
                  className="flex-1 py-2 text-blue-400 hover:text-blue-300 text-sm"
                >
                  Edit
                </button>
                {user?.id !== userData.id && (
                  <button
                    onClick={() => handleDelete(userData.id)}
                    className="flex-1 py-2 text-red-400 hover:text-red-300 text-sm"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-dark-light rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-dark-lighter">
              <tr>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">Role</th>
                {canEditUsers && (
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-lighter">
              {users.map((userData) => (
                <tr key={userData.id} className="hover:bg-dark-lighter">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-dark rounded-full flex items-center justify-center mr-3">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div className="font-medium">{userData.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{userData.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeClass(userData.role)}`}>
                      <Shield className="w-3 h-3 mr-1" />
                      {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                    </span>
                  </td>
                  {canEditUsers && (
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditClick(userData)}
                          className="p-1 text-blue-400 hover:text-blue-300"
                          title="Edit"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        {user?.id !== userData.id && (
                          <button
                            onClick={() => handleDelete(userData.id)}
                            className="p-1 text-red-400 hover:text-red-300"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Info - Hidden on mobile for space */}
      <div className="hidden lg:block mt-8">
        <h2 className="text-xl font-bold mb-4">Role Permissions</h2>

        <div className="bg-dark-light rounded-lg p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Permissions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-lighter">
                <tr>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeClass('owner')}`}>
                      <Shield className="w-3 h-3 mr-1" />
                      Owner
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    Full access to all features, including user management, reports, and analytics.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeClass('supervisor')}`}>
                      <Shield className="w-3 h-3 mr-1" />
                      Supervisor
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    Full access: manage menu, orders, and staff.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeClass('manager')}`}>
                      <Shield className="w-3 h-3 mr-1" />
                      Manager
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    Update menu, manage staff schedules.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeClass('waiter')}`}>
                      <Shield className="w-3 h-3 mr-1" />
                      Waiter
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    View orders and update their status.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;