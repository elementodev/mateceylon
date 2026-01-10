import React, { useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { useStorage } from '../hooks/useStorage';
import { Link } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import './Admin.css';

function ManageMenu() {
    const { data: menuItems, loading, addDocument, deleteDocument, updateDocument } = useFirestore('menu_items');
    const { uploadFile, deleteFile } = useStorage();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'mains',
        isVegetarian: false,
        isSpecial: false
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const categories = [
        { id: 'appetizers', name: 'Appetizers' },
        { id: 'mains', name: 'Main Courses' },
        { id: 'bbq', name: 'BBQ Specialties' },
        { id: 'desserts', name: 'Desserts' },
        { id: 'beverages', name: 'Beverages' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            let imageUrl = formData.imageUrl;

            if (file) {
                // If editing and there's an old image, delete it (optional, but good practice to clean up)
                // Note: Logic to delete old image could be added here if we tracked the old URL better
                imageUrl = await uploadFile(file, 'menu_items');
            }

            const dataToSave = { ...formData, imageUrl };

            if (isEditing) {
                await updateDocument(editId, dataToSave);
                setIsEditing(false);
                setEditId(null);
            } else {
                await addDocument(dataToSave);
            }
            setFormData({
                name: '',
                description: '',
                price: '',
                category: 'mains',
                isVegetarian: false,
                isSpecial: false,
                imageUrl: ''
            });
            setFile(null);
            document.getElementById('menuFileInput').value = '';
            alert('Menu item saved successfully!');
        } catch (error) {
            console.error("Error saving menu item:", error);
            alert('Failed to save menu item.');
        }
        setUploading(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await deleteDocument(id);
            } catch (error) {
                console.error("Error deleting item:", error);
            }
        }
    };

    const handleEdit = (item) => {
        setFormData({
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            isVegetarian: item.isVegetarian || false,
            isSpecial: item.isSpecial || false,
            imageUrl: item.imageUrl || ''
        });
        setIsEditing(true);
        setEditId(item.id);
        setFile(null); // Reset file input
        const fileInput = document.getElementById('menuFileInput');
        if (fileInput) fileInput.value = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) return <div style={{ padding: '2rem', color: 'white' }}>Loading menu items...</div>;

    return (
        <AdminLayout title="Manage Menu Items" subtitle="Add, edit, or remove dishes from your menu">

            {/* Add/Edit Form */}
            <div className="admin-form">
                <h3 className="section-title">{isEditing ? 'Edit Item' : 'Add New Item'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label>Name</label>
                        <input
                            type="text"
                            required
                            className="form-control"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label>Description</label>
                        <textarea
                            required
                            className="form-control"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            style={{ height: '80px', resize: 'vertical' }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Price (e.g. Rs. 850)</label>
                        <input
                            type="text"
                            required
                            className="form-control"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select
                            className="form-control"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label>Image (Optional)</label>
                        <input
                            id="menuFileInput"
                            type="file"
                            accept="image/*"
                            className="form-control"
                            onChange={(e) => setFile(e.target.files[0])}
                            style={{ padding: '0.8rem' }}
                        />
                        {formData.imageUrl && !file && (
                            <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#888' }}>
                                Current image: <a href={formData.imageUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#cd9f2b' }}>View</a>
                            </div>
                        )}
                    </div>

                    <div className="form-group" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: '#fff' }}>
                            <input
                                type="checkbox"
                                checked={formData.isVegetarian}
                                onChange={(e) => setFormData({ ...formData, isVegetarian: e.target.checked })}
                                style={{ marginRight: '0.5rem', width: '20px', height: '20px' }}
                            />
                            Vegetarian
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: '#fff' }}>
                            <input
                                type="checkbox"
                                checked={formData.isSpecial}
                                onChange={(e) => setFormData({ ...formData, isSpecial: e.target.checked })}
                                style={{ marginRight: '0.5rem', width: '20px', height: '20px' }}
                            />
                            Chef's Special
                        </label>
                    </div>

                    <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ marginRight: '1rem', opacity: uploading ? 0.7 : 1, cursor: uploading ? 'not-allowed' : 'pointer' }}
                            disabled={uploading}
                        >
                            {uploading ? 'Processsing...' : (isEditing ? 'Update Item' : 'Add Item')}
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setFormData({
                                        name: '',
                                        description: '',
                                        price: '',
                                        category: 'mains',
                                        isVegetarian: false,
                                        isSpecial: false,
                                        imageUrl: ''
                                    });
                                    setFile(null);
                                    if (document.getElementById('menuFileInput')) document.getElementById('menuFileInput').value = '';
                                }}
                                style={{
                                    padding: '0.8rem 2rem',
                                    backgroundColor: '#444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase'
                                }}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* List View */}
            <div className="admin-table-container">
                <h3 className="section-title">Existing Items</h3>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {menuItems.map(item => (
                            <tr key={item.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <img
                                            src={item.imageUrl || "https://images.unsplash.com/photo-1544025162-d76690b60944?w=600&q=80"}
                                            alt={item.name}
                                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                        <div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#fff' }}>{item.name}</div>
                                            <div style={{ fontSize: '0.9rem', color: '#888' }}>{item.description}</div>
                                            <div style={{ marginTop: '0.5rem' }}>
                                                {item.isVegetarian && <span style={{ backgroundColor: '#065f46', color: '#d1fae5', fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', marginRight: '5px' }}>Veg</span>}
                                                {item.isSpecial && <span style={{ backgroundColor: '#92400e', color: '#fef3c7', fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px' }}>Special</span>}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ textTransform: 'capitalize' }}>{item.category}</td>
                                <td>{item.price}</td>
                                <td>
                                    <button
                                        onClick={() => handleEdit(item)}
                                        style={{ marginRight: '1rem', border: 'none', background: 'none', color: '#cd9f2b', cursor: 'pointer', fontWeight: 'bold' }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="btn-danger"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {menuItems.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No menu items found. Add one above!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}

export default ManageMenu;
