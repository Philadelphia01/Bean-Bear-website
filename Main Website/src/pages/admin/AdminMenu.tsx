import React, { useState, useEffect } from 'react';
import { menuService } from '../../firebase/services';
import { Plus, Edit2, Trash2, Check, X, Upload, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadImageToCloudinary } from '../../services/cloudinary';

const AdminMenu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
  const [uploadingImage, setUploadingImage] = useState(false);

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'breakfast', name: 'Breakfast' },
    { id: 'pastries', name: 'Pastries' },
    { id: 'hot beverages', name: 'Hot Beverages' },
    { id: 'cold drinks', name: 'Cold Drinks' }
  ];

  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        const items = await menuService.getMenuItems();
        setMenuItems(items);
      } catch (error) {
        console.error('Error loading menu items:', error);
        toast.error('Failed to load menu items');
      } finally {
        setLoading(false);
      }
    };

    loadMenuItems();
  }, []);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      const imageUrl = await uploadImageToCloudinary(file, 'menu-items');
      setFormData(prev => ({ ...prev, image: imageUrl }));
      toast.success('Image uploaded successfully!');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(error.message || 'Failed to upload image. Please check your Cloudinary configuration.');
    } finally {
      setUploadingImage(false);
      // Reset file input
      e.target.value = '';
    }
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

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.title || !formData.title.trim()) {
        toast.error('Please enter a title');
        return;
      }
      if (!formData.price || formData.price <= 0) {
        toast.error('Please enter a valid price');
        return;
      }
      if (!formData.category) {
        toast.error('Please select a category');
        return;
      }
      if (!formData.image || !formData.image.trim()) {
        toast.error('Please enter an image URL');
        return;
      }

      const itemData = {
        title: formData.title.trim(),
        price: parseFloat(formData.price.toString()),
        category: formData.category,
        description: formData.description?.trim() || '',
        image: formData.image.trim(),
        allergens: formData.allergens ? formData.allergens.split(',').map(a => a.trim()).filter(a => a) : []
      };

      if (editingItem) {
        // Validate that editingItem is a valid Firestore document ID
        if (!editingItem || editingItem.trim() === '') {
          toast.error('Invalid menu item ID. Please try again.');
          return;
        }
        
        // First, refresh menu items to ensure we have the latest data
        let currentItems = menuItems;
        try {
          currentItems = await menuService.getMenuItems();
          setMenuItems(currentItems);
        } catch (refreshError) {
          console.warn('Could not refresh menu items before update:', refreshError);
        }
        
        // Check if the item exists in the current menu items list
        const existingItem = currentItems.find(item => item.id === editingItem);
        if (!existingItem) {
          // Item doesn't exist - don't create duplicate, just show error and close
          toast.error(`Menu item with ID "${editingItem}" not found. It may have been deleted. Please refresh the page.`);
          setEditingItem(null);
          setShowAddForm(false);
          // Reload menu items to get latest data
          try {
            const items = await menuService.getMenuItems();
            setMenuItems(items);
          } catch (reloadError) {
            console.error('Error reloading menu items:', reloadError);
          }
          return;
        }
        
        // Item exists, proceed with update
        await menuService.updateMenuItem(editingItem, itemData);
        toast.success('Menu item updated successfully');
        
        // Reload menu items after successful update
        const items = await menuService.getMenuItems();
        setMenuItems(items);
      } else {
        await menuService.addMenuItem(itemData);
        toast.success('Menu item added successfully');
        
        // Reload menu items after successful add
        const items = await menuService.getMenuItems();
        setMenuItems(items);
      }

      setEditingItem(null);
      setShowAddForm(false);
    } catch (error: any) {
      console.error('Error saving menu item:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to save menu item';
      if (error?.code === 'not-found') {
        errorMessage = 'Menu item not found. It may have been deleted. Please refresh the page.';
      } else if (error?.code === 'permission-denied') {
        errorMessage = 'Permission denied. Please check your authentication.';
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      
      // If it's a not-found error, reload menu items and close form (don't create duplicate)
      if (error?.code === 'not-found' || error?.message?.includes('not found')) {
        try {
          const items = await menuService.getMenuItems();
          setMenuItems(items);
          toast.error('Menu item not found. The item may have been deleted. Please refresh and try again.');
        } catch (reloadError) {
          console.error('Error reloading menu items:', reloadError);
        }
        setEditingItem(null);
        setShowAddForm(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    const itemToDelete = menuItems.find(item => item.id === id);
    if (window.confirm(`Are you sure you want to delete "${itemToDelete?.title}"? This action cannot be undone.`)) {
      try {
        await menuService.deleteMenuItem(id);
        toast.success('Menu item deleted successfully');

        // Reload menu items
        const items = await menuService.getMenuItems();
        setMenuItems(items);
      } catch (error) {
        console.error('Error deleting menu item:', error);
        toast.error('Failed to delete menu item');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading menu items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-serif">Menu Management</h1>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-primary text-dark rounded-md flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Item
        </button>
      </div>
      
      {/* Add/Edit Form */}
      {(showAddForm || editingItem) && (
        <div className="bg-dark-light rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">
            {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2">Price (R)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="input"
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="input"
                required
              >
                <option value="breakfast">Breakfast</option>
                <option value="pastries">Pastries</option>
                <option value="hot beverages">Hot Beverages</option>
                <option value="cold drinks">Cold Drinks</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-2">Image</label>
              <div className="space-y-2">
                {/* File Upload Button */}
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 px-4 py-2 bg-primary text-dark rounded-lg cursor-pointer hover:bg-primary-dark transition-colors text-sm font-medium">
                    {uploadingImage ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload to Cloudinary
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                  <span className="text-xs text-gray-400">or</span>
                </div>
                
                {/* URL Input */}
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Enter image URL (https://...) or use upload button above"
                  required
                />
                <p className="text-xs text-gray-500">
                  💡 <strong>Upload:</strong> Click "Upload to Cloudinary" to upload an image file, or enter a URL manually.
                  <br />
                  Supported formats: JPG, PNG, GIF, WebP (max 5MB)
                </p>
              </div>
              {formData.image && (
                <div className="mt-2">
                  <p className="text-xs text-gray-400 mb-1">Image Preview:</p>
                  <div className="w-32 h-32 rounded-md overflow-hidden bg-dark-lighter border border-gray-700">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-500 text-xs p-2 text-center">Invalid URL<br/>Check the path</div>';
                        }
                      }}
                      onLoad={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'block';
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.image.startsWith('http') || formData.image.startsWith('https') 
                      ? '✓ Using external URL' 
                      : formData.image.startsWith('/')
                      ? '✓ Using relative path (must be in public folder)'
                      : '⚠ Invalid URL format - Use https://... or /images/...'}
                  </p>
                </div>
              )}
            </div>
            
            <div className="md:col-span-2">
              <label className="block mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="input"
                rows={3}
                required
              ></textarea>
            </div>
            
            <div className="md:col-span-2">
              <label className="block mb-2">Allergens (comma separated)</label>
              <input
                type="text"
                name="allergens"
                value={formData.allergens}
                onChange={handleInputChange}
                className="input"
                placeholder="e.g. gluten, dairy, nuts"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 mt-6">
            <button 
              onClick={handleCancelEdit}
              className="px-4 py-2 border border-gray-600 rounded-md"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-primary text-dark rounded-md"
            >
              Save
            </button>
          </div>
        </div>
      )}
      
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`tab ${activeCategory === category.id ? 'active' : ''}`}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {/* Menu Items Table */}
      <div className="bg-dark-light rounded-lg overflow-hidden">
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
                      <div className="w-12 h-12 rounded-md mr-4 overflow-hidden bg-dark-lighter flex items-center justify-center flex-shrink-0 relative">
                        {item.image && item.image.trim() ? (
                          <>
                            <img 
                              src={item.image} 
                              alt={item.title} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Hide broken image and show placeholder
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  let placeholder = parent.querySelector('.image-placeholder') as HTMLElement;
                                  if (!placeholder) {
                                    placeholder = document.createElement('div');
                                    placeholder.className = 'image-placeholder w-full h-full flex items-center justify-center text-gray-500 text-xs absolute inset-0';
                                    placeholder.textContent = 'No img';
                                    parent.appendChild(placeholder);
                                  }
                                  placeholder.style.display = 'flex';
                                }
                              }}
                              onLoad={(e) => {
                                // Hide placeholder if image loads successfully
                                const target = e.target as HTMLImageElement;
                                const parent = target.parentElement;
                                if (parent) {
                                  const placeholder = parent.querySelector('.image-placeholder') as HTMLElement;
                                  if (placeholder) {
                                    placeholder.style.display = 'none';
                                  }
                                }
                              }}
                            />
                            <div className="image-placeholder w-full h-full flex items-center justify-center text-gray-500 text-xs absolute inset-0 hidden">
                              No img
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                            No img
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-gray-400">{item.description?.substring(0, 50) || 'No description'}...</div>
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
            {activeCategory === 'all' ? 'No menu items found' : `No items found in ${activeCategory} category`}
            {activeCategory === 'all' && (
              <p className="mt-2 text-sm">Click "Add New Item" to create your first menu item</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMenu;