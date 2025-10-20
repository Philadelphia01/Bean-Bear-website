import React, { useState } from 'react';
import { menuItems } from '../../data/menuItems';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminMenu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    price: 0,
    category: '',
    description: '',
    image: '',
    allergens: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'breakfast', name: 'Breakfast' },
    { id: 'pastries', name: 'Pastries' },
    { id: 'hot beverages', name: 'Hot Beverages' },
    { id: 'cold drinks', name: 'Cold Drinks' }
  ];

  const filteredItems = activeCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  const handleEditClick = (item: typeof menuItems[0]) => {
    setEditingItem(item.id);
    setFormData({
      id: item.id,
      title: item.title,
      price: item.price,
      category: item.category,
      description: item.description,
      image: item.image,
      allergens: item.allergens?.join(', ') || ''
    });
  };

  const handleAddNew = () => {
    setShowAddForm(true);
    setEditingItem(null);
    setFormData({
      id: `item-${Date.now()}`,
      title: '',
      price: 0,
      category: 'breakfast',
      description: '',
      image: '',
      allergens: ''
    });
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setShowAddForm(false);
  };

  const handleSave = () => {
    // In a real app, this would update the database
    console.log('Saving item:', formData);
    toast.success(`${editingItem ? 'Updated' : 'Added'} menu item successfully`);
    setEditingItem(null);
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      // In a real app, this would update the database
      console.log('Deleting item:', id);
      toast.success('Menu item deleted successfully');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-bold font-serif">Menu Management</h1>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-primary text-dark rounded-md flex items-center text-sm font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Item
        </button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingItem) && (
        <div className="bg-dark-light rounded-lg p-4 md:p-6 mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-bold mb-4">
            {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="input text-sm"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">Price (R)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="input text-sm"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="input text-sm"
                required
              >
                <option value="breakfast">Breakfast</option>
                <option value="pastries">Pastries</option>
                <option value="hot beverages">Hot Beverages</option>
                <option value="cold drinks">Cold Drinks</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm">Image URL</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="input text-sm"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block mb-2 text-sm">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="input text-sm"
                rows={3}
                required
              ></textarea>
            </div>

            <div className="sm:col-span-2">
              <label className="block mb-2 text-sm">Allergens (comma separated)</label>
              <input
                type="text"
                name="allergens"
                value={formData.allergens}
                onChange={handleInputChange}
                className="input text-sm"
                placeholder="e.g. gluten, dairy, nuts"
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

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`tab text-sm ${activeCategory === category.id ? 'active' : ''}`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Menu Items - Mobile Cards */}
      <div className="block md:hidden space-y-4 mb-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-dark-light rounded-lg p-4">
            <div className="flex items-center mb-3">
              <img
                src={item.image}
                alt={item.title}
                className="w-16 h-16 object-cover rounded-md mr-4"
              />
              <div className="flex-1">
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-sm text-gray-400 capitalize">{item.category}</p>
                <p className="text-primary font-bold">R {item.price.toFixed(2)}</p>
              </div>
            </div>

            <p className="text-sm text-gray-400 mb-3 line-clamp-2">{item.description}</p>

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditClick(item)}
                  className="p-2 text-blue-400 hover:text-blue-300 rounded"
                  title="Edit"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-red-400 hover:text-red-300 rounded"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-dark-light rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-dark-lighter">
              <tr>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-lighter">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-dark-lighter">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded-md mr-4"
                      />
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-gray-400">{item.description.substring(0, 50)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 capitalize">{item.category}</td>
                  <td className="px-6 py-4 font-medium">R {item.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="p-1 text-blue-400 hover:text-blue-300"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-red-400 hover:text-red-300"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredItems.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            No items found in this category
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMenu;