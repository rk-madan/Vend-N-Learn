import React, { useState, useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaBox, FaShoppingBag, FaUsers, FaChartLine, FaPlus,
    FaTrash, FaEdit, FaTimes, FaSearch, FaBell, FaCog,
    FaSignOutAlt, FaRocket, FaCheckCircle, FaExclamationTriangle,
    FaPlusCircle, FaArrowRight, FaFilter, FaLayerGroup, FaArrowUp
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

const AdminDashboard = () => {
    const { token, user, logout } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({ productCount: 0, orderCount: 0, userCount: 0, totalSales: 0 });
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [selectedProductForStock, setSelectedProductForStock] = useState('');
    const [restockAmount, setRestockAmount] = useState({ global: '' });

    // Categories for dropdowns - Standardized
    const categories = ['All', 'Pen', 'Pencil', 'Notebook', 'Scale', 'Eraser', 'Other'];

    const [formData, setFormData] = useState({
        sku: '', name: '', description: '', price: '', image: '', category: '', stock: 10
    });

    // --- ROBUST DATA FETCHING WITH ERROR REPORTING ---
    const fetchData = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const headers = { 'Authorization': `Bearer ${token}` };

            // Helper to fetch and report error
            const fetchWithReport = async (url, name) => {
                const res = await fetch(url, { headers });
                if (!res.ok) {
                    const text = await res.text();
                    console.error(`${name} Fetch Failed:`, res.status, text);
                    toast.error(`Error loading ${name}: ${res.status} ${res.statusText}`);
                    // Return empty based on type to prevent crash
                    return name === 'Stats' ? {} : [];
                }
                return res.json();
            };

            // Independent fetches
            const statsData = await fetchWithReport(`${API_BASE}/admin/stats`, 'Stats');
            const productsData = await fetchWithReport(`${API_BASE}/admin/products`, 'Products');
            const ordersData = await fetchWithReport(`${API_BASE}/admin/orders`, 'Orders');
            const usersData = await fetchWithReport(`${API_BASE}/admin/users`, 'Users');

            if (statsData) setStats(statsData);
            if (Array.isArray(productsData)) setProducts(productsData);
            if (Array.isArray(ordersData)) setOrders(ordersData);
            if (Array.isArray(usersData)) setUsers(usersData);

        } catch (err) {
            console.error("Dashboard Network Error:", err);
            toast.error('Network Error: Check Server Connection');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token]);

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        const url = editingProduct
            ? `${API_BASE}/admin/products/${editingProduct._id}`
            : `${API_BASE}/admin/products`;
        const method = editingProduct ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                toast.success(editingProduct ? 'Product Updated' : 'Product Added');
                setShowProductForm(false);
                setEditingProduct(null);
                setFormData({ sku: '', name: '', description: '', price: '', image: '', category: '', stock: 10 });
                fetchData();
            } else {
                const error = await res.json();
                toast.error(error.message || 'Operation failed');
            }
        } catch (err) {
            toast.error('Connection error');
        }
    };

    const handleAddStock = async (id, amount) => {
        if (!id) return toast.error('Please select a product first');
        if (!amount || amount <= 0) return toast.error('Enter a valid quantity');
        try {
            const res = await fetch(`${API_BASE}/admin/products/${id}/stock`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ quantity: amount })
            });
            if (res.ok) {
                toast.success('Stock Updated Successfully');
                setRestockAmount(prev => ({ ...prev, [id]: '', global: '' }));
                fetchData(); // Refresh to show new stock
            } else {
                const errText = await res.text();
                toast.error(`Failed: ${errText}`);
            }
        } catch (err) { toast.error('Stock update failed'); }
    };

    const handleProductDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
        try {
            const res = await fetch(`${API_BASE}/admin/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success('Product Deleted');
                fetchData();
            } else {
                toast.error('Delete failed');
            }
        } catch (err) {
            toast.error('Delete failed');
        }
    };

    if (!user || (!user.isAdmin && user.role !== 'admin')) {
        return <Layout><div style={{ textAlign: 'center', padding: '10rem 2rem' }}><h2>Access Denied</h2><p>Admin permissions required.</p></div></Layout>;
    }

    // Filter Logic - Case Insensitive
    const filteredProducts = products.filter(p => {
        const matchesSearch = (p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku?.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCat = (filterCategory === 'All' || p.category?.toLowerCase() === filterCategory.toLowerCase());
        return matchesSearch && matchesCat;
    });

    // Flexible Stock Dropdown - Matches Category OR Name (for broader matching like Shop)
    const stockDropdownProducts = products.filter(p => {
        if (filterCategory === 'All') return true;
        const cat = p.category?.toLowerCase() || '';
        const name = p.name?.toLowerCase() || '';
        const filter = filterCategory.toLowerCase();

        // Match if category is exact match OR if name contains the category (e.g. "Space Pen" in "Pen")
        return cat === filter || name.includes(filter);
    });

    return (
        <Layout>
<div
    className="admin-layout"
    style={{ display: 'flex', minHeight: '92vh', background: '#f8fafc' }}
>               {/* --- SIDEBAR --- */}
<div className="admin-sidebar" style={sidebarWrapperStyle}>                    <div style={{ padding: '0 1rem', marginBottom: '3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <div style={logoBoxStyle}><FaCog size={22} /></div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b' }}>JusVend Admin</h3>
                        </div>
                    </div>

                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        <SidebarLink icon={<FaChartLine />} label="Dashboard" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                        <SidebarLink icon={<FaBox />} label="Products" active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
                        <SidebarLink icon={<FaShoppingBag />} label="Orders" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
                        <SidebarLink icon={<FaUsers />} label="Users" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
                    </nav>

                    <div style={logoutCardStyle}>
                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ fontWeight: 800, color: '#1e293b' }}>JusVend Admin</div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>Administrator</div>
                        </div>
                        <button onClick={logout} style={logoutButtonStyle}><FaSignOutAlt /> Log Out</button>
                    </div>
                </div>

                {/* --- CONTENT --- */}
<div
    className="admin-content"
    style={{
        flex: 1,
        padding: '1rem',
        overflowX: 'auto'
    }}
>                   <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={spinnerContainerStyle}>
                                <div className="loader-ring"></div>
                                <p style={{ marginTop: '20px', fontWeight: 600, color: '#64748b' }}>Syncing Dashboard Data...</p>
                            </motion.div>
                        ) : (
                            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

                                {activeTab === 'overview' && (
                                    <>
                                        <HeaderSection title="Dashboard Overview" subtitle="Welcome back, Admin." />
                                        <div style={statsGridStyle}>
                                            <BigStatCard label="Total Products" value={stats.productCount || 0} icon={<FaBox />} color="#3b82f6" />
                                            <BigStatCard label="Total Orders" value={stats.orderCount || 0} icon={<FaShoppingBag />} color="#f59e0b" />
                                            <BigStatCard label="Total Users" value={stats.userCount || 0} icon={<FaUsers />} color="#8b5cf6" />
                                            <BigStatCard label="Total Sales" value={`₹${stats.totalSales?.toLocaleString() || 0}`} icon={<FaChartLine />} color="#10b981" />
                                        </div>
                                    </>
                                )}

                                {activeTab === 'products' && (
                                    <>
                                        <div style={headerActionStyle}>
                                            <HeaderSection title="Product Management" subtitle="Manage inventory and stock." />
                                            <button className="btn-glow" onClick={() => { setEditingProduct(null); setShowProductForm(true); }} style={headerButtonStyle}>
                                                <FaPlusCircle /> Add New Product
                                            </button>
                                        </div>

                                        {/* STOCK MANAGER */}
                                        <div className="glass-panel-m" style={stockManagerStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem' }}>
                                                <div style={toolIconStyle}><FaArrowUp /></div>
                                                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e293b' }}>Quick Stock Update</h3>
                                            </div>
                                            <div style={stockToolGrid}>
                                                <div style={{ flex: 1 }}>
                                                    <label style={inputLabelStyle}>1. Category Filter</label>
                                                    <select
                                                        value={filterCategory}
                                                        onChange={(e) => { setFilterCategory(e.target.value); setSelectedProductForStock(''); }}
                                                        style={selectInputStyle}
                                                    >
                                                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                                    </select>
                                                </div>
                                                <div style={{ flex: 2 }}>
                                                    <label style={inputLabelStyle}>2. Select Product</label>
                                                    <select
                                                        value={selectedProductForStock}
                                                        onChange={(e) => setSelectedProductForStock(e.target.value)}
                                                        style={selectInputStyle}
                                                    >
                                                        <option value="">-- Choose a Product --</option>
                                                        {stockDropdownProducts.length > 0 ? (
                                                            stockDropdownProducts.map(p => (
                                                                <option key={p._id} value={p._id}>
                                                                    {p.name} (Current Stock: {p.stock})
                                                                </option>
                                                            ))
                                                        ) : (
                                                            <option disabled>No products in "<strong>{filterCategory}</strong>"</option>
                                                        )}
                                                    </select>
                                                </div>
                                                <div style={{ width: '160px' }}>
                                                    <label style={inputLabelStyle}>3. Qty to Add</label>
                                                    <input
                                                        type="number"
                                                        placeholder="0"
                                                        value={restockAmount.global || ''}
                                                        onChange={(e) => setRestockAmount({ ...restockAmount, global: e.target.value })}
                                                        style={textInputStyle}
                                                    />
                                                </div>
                                                <button onClick={() => handleAddStock(selectedProductForStock, restockAmount.global)} style={stockAddButtonStyle}>Add Stock</button>
                                            </div>
                                        </div>

                                        {/* SEARCH AND FILTERS */}
                                        <div style={searchBarWrapper}>
                                            <div className="search-box">
                                                <FaSearch color="#94a3b8" />
                                                <input
                                                    placeholder="Search products..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    style={searchFieldStyle}
                                                />
                                            </div>
                                        </div>

                                        {/* TABLE */}
                                        <div className="glass-panel-m" style={{ padding: '0', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
                                            <table style={modernTableStyle}>
                                                <thead style={tableHeaderStyle}>
                                                    <tr>
                                                        <th style={thStyle}>PRODUCT</th>
                                                        <th style={thStyle}>SKU</th>
                                                        <th style={thStyle}>CATEGORY</th>
                                                        <th style={thStyle}>PRICE</th>
                                                        <th style={thStyle}>STOCK</th>
                                                        <th style={thStyle}>ACTIONS</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredProducts.length > 0 ? filteredProducts.map(p => (
                                                        <tr key={p._id} className="modern-tr">
                                                            <td style={tdStyle}>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                                                    <div style={tableImgBox}><img src={p.image} alt={p.name} style={tableImgStyle} /></div>
                                                                    <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>{p.name}</div>
                                                                </div>
                                                            </td>
                                                            <td style={{ ...tdStyle, fontFamily: 'monospace' }}>{p.sku}</td>
                                                            <td style={tdStyle}><span style={categoryBadgeStyle(p.category)}>{p.category}</span></td>
                                                            <td style={{ ...tdStyle, fontWeight: 700 }}>₹{p.price}</td>
                                                            <td style={tdStyle}>
                                                                <span style={{ fontWeight: 700, color: p.stock < 5 ? '#ef4444' : '#10b981' }}>
                                                                    {p.stock} Units
                                                                </span>
                                                            </td>
                                                            <td style={tdStyle}>
                                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                                    <button onClick={() => { setEditingProduct(p); setFormData({ ...p }); setShowProductForm(true); }} style={editBtnStyle}>
                                                                        <FaEdit /> Edit
                                                                    </button>
                                                                    <button onClick={() => handleProductDelete(p._id)} style={removeBtnStyle}>
                                                                        <FaTrash /> Remove
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )) : (
                                                        <tr>
                                                            <td colSpan="6" style={emptyStateTd}>
                                                                <div style={emptyStateWrapper}>
                                                                    <div style={emptyIconBox}><FaBox size={40} /></div>
                                                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', marginBottom: '10px' }}>No Products Found</h3>
                                                                    <p style={{ opacity: 0.6, marginBottom: '1.5rem' }}>Try changing the filters or add a new product.</p>
                                                                    <button onClick={() => setShowProductForm(true)} style={headerButtonStyle}>Add Product</button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}

                                {activeTab === 'orders' && (
                                    <>
                                        <HeaderSection title="Order Management" subtitle="View and manage customer orders." />
                                        <div className="glass-panel-m" style={{ padding: '0', overflow: 'hidden' }}>
                                            <table style={modernTableStyle}>
                                                <thead style={tableHeaderStyle}>
                                                    <tr>
                                                        <th style={thStyle}>ORDER ID</th>
                                                        <th style={thStyle}>USER</th>
                                                        <th style={thStyle}>ITEMS</th>
                                                        <th style={thStyle}>TOTAL</th>
                                                        <th style={thStyle}>DATE</th>
                                                        <th style={thStyle}>STATUS</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {orders.length > 0 ? orders.map(order => (
                                                        <tr key={order._id} className="modern-tr">
                                                            <td style={tdStyle}>{order._id.substring(0, 8)}...</td>
                                                            <td style={tdStyle}>{order.user?.name || 'Guest'}</td>
                                                            <td style={tdStyle}>{order.items?.length || 0} Items</td>
                                                            <td style={{ ...tdStyle, fontWeight: 'bold' }}>₹{order.totalAmount}</td>
                                                            <td style={tdStyle}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                                            <td style={tdStyle}>
                                                                <span style={{ padding: '4px 10px', borderRadius: '8px', background: order.isPaid ? '#ecfdf5' : '#fef2f2', color: order.isPaid ? '#10b981' : '#ef4444', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                                                    {order.isPaid ? 'PAID' : 'PENDING'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    )) : (
                                                        <tr><td colSpan="6" style={emptyStateTd}>No orders found.</td></tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}

                                {activeTab === 'users' && (
                                    <>
                                        <HeaderSection title="User Directory" subtitle="Registered members list." />
                                        <div className="glass-panel-m" style={{ padding: '0', overflow: 'hidden' }}>
                                            <table style={modernTableStyle}>
                                                <thead style={tableHeaderStyle}>
                                                    <tr>
                                                        <th style={thStyle}>NAME</th>
                                                        <th style={thStyle}>EMAIL</th>
                                                        <th style={thStyle}>ROLE</th>
                                                        <th style={thStyle}>JOINED</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {users.length > 0 ? users.map(u => (
                                                        <tr key={u._id} className="modern-tr">
                                                            <td style={{ ...tdStyle, fontWeight: 'bold' }}>{u.name}</td>
                                                            <td style={tdStyle}>{u.email}</td>
                                                            <td style={tdStyle}>
                                                                <span style={{ padding: '4px 10px', borderRadius: '8px', background: u.isAdmin ? '#eff6ff' : '#f8fafc', color: u.isAdmin ? '#3b82f6' : '#64748b', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                                                    {u.isAdmin ? 'ADMIN' : 'MEMBER'}
                                                                </span>
                                                            </td>
                                                            <td style={tdStyle}>{new Date(u.createdAt).toLocaleDateString()}</td>
                                                        </tr>
                                                    )) : (
                                                        <tr><td colSpan="4" style={emptyStateTd}>No users found.</td></tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}

                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* --- PRODUCT FORM MODAL --- */}
                <AnimatePresence>
                    {showProductForm && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={modalOverlayStyle}>
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={modalCardStyle}>
                                <div style={modalHeader}>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                                    <button onClick={() => setShowProductForm(false)} style={closeBtnStyle}><FaTimes /></button>
                                </div>

                                <form onSubmit={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                    <FormInput label="Product Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <FormInput label="SKU" value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} required />
                                        <div style={{ flex: 1 }}>
                                            <label style={inputLabelStyle}>Category</label>
                                            <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={modalSelectStyle} required>
                                                <option value="" disabled>Select Category</option>
                                                {categories.filter(c => c !== 'All').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <FormInput label="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} textarea />
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <FormInput label="Price (₹)" type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                                        <FormInput label="Stock" type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} required />
                                    </div>
                                    <FormInput label="Image URL" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} required />
                                    <button type="submit" className="btn-glow" style={submitButtonStyle}>
                                        {editingProduct ? 'Save Changes' : 'Add Product'}
                                    </button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style>{`
                .btn-glow {
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
                    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
                }
                .btn-glow:hover {
                    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
                    transform: translateY(-2px);
                }
                .modern-tr { transition: all 0.2s ease; cursor: default; }
                .modern-tr:hover { background: #f1f5f9 !important; }
                .loader-ring {
                    width: 50px;
                    height: 50px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #3b82f6;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .search-box {
                    display: flex;
                    align-items: center;
                    background: white;
                    padding: 1rem 1.5rem;
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.03);
                    gap: 15px;
                    border: 1px solid #e2e8f0;
                }
                @media (max-width:768px){

    .admin-layout{
        flex-direction:column !important;
    }

    .admin-sidebar{
        width:100% !important;
        min-width:100% !important;
        height:auto !important;
        position:relative !important;
        border-right:none !important;
        border-bottom:1px solid #e2e8f0;
    }

    .admin-content{
        width:100% !important;
        padding:1rem !important;
    }
}
            `}</style>
        </Layout>
    );
};

// --- STYLED HELPERS ---
const SidebarLink = ({ icon, label, active, onClick }) => (
    <div onClick={onClick} style={sidebarLinkStyle(active)}>
        <span style={{ fontSize: '1.2rem' }}>{icon}</span>
        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{label}</span>
    </div>
);

const BigStatCard = ({ label, value, icon, growth, color }) => (
    <div className="glass-panel-m" style={statCardStyle(color)}>
        <div style={statIconBox(color)}>{icon}</div>
        <div style={{ marginTop: '1rem' }}>
            <div style={statLabelStyle}>{label}</div>
            <div style={statValueStyle}>{value}</div>
        </div>
    </div>
);

const FormInput = ({ label, textarea, ...props }) => (
    <div style={{ flex: 1 }}>
        <label style={inputLabelStyle}>{label}</label>
        {textarea ? (
            <textarea {...props} style={formTextareaStyle} rows="3" />
        ) : (
            <input {...props} style={formInputStyle} />
        )}
    </div>
);

const HeaderSection = ({ title, subtitle }) => (
    <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={h1Style}>{title}</h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>{subtitle}</p>
    </div>
);

// --- CSS-IN-JS OBJECTS ---
const sidebarWrapperStyle = {
    width: '260px',
    minWidth: '260px',
    background: 'white',
    borderRight: '1px solid #e2e8f0',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto'
};
const logoBoxStyle = { width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' };
const sidebarLinkStyle = (active) => ({
    display: 'flex', alignItems: 'center', gap: '15px', padding: '1rem 1.2rem', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s',
    background: active ? '#f1f5f9' : 'transparent', color: active ? '#1d4ed8' : '#64748b'
});
const logoutCardStyle = { marginTop: 'auto', padding: '1.5rem', background: '#f8fafc', borderRadius: '20px', border: '1px solid #e2e8f0' };
const logoutButtonStyle = { width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'white', color: '#ef4444', border: '1px solid #fee2e2', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' };
const h1Style = { fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a', marginBottom: '0.5rem' };
const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
    gap: '1rem',
    marginBottom: '2rem'
};
const statCardStyle = (color) => ({ padding: '2rem', borderRadius: '24px', border: `1px solid #e2e8f0`, background: 'white' });
const statIconBox = (color) => ({ width: '48px', height: '48px', borderRadius: '14px', background: `${color}10`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' });
const statLabelStyle = { fontSize: '0.9rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem' };
const statValueStyle = { fontSize: '2rem', fontWeight: 800, color: '#1e293b' };
const headerActionStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' };
const headerButtonStyle = { display: 'flex', alignItems: 'center', gap: '10px', padding: '1rem 2rem', borderRadius: '16px', background: '#3b82f6', color: 'white', border: 'none', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' };
const stockManagerStyle = { padding: '2rem', background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', marginBottom: '3rem' };
const toolIconStyle = { width: '36px', height: '36px', borderRadius: '10px', background: '#f59e0b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const stockToolGrid = { display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-end' };
const inputLabelStyle = { display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' };
const selectInputStyle = { width: '100%', padding: '0.9rem', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', outline: 'none' };
const textInputStyle = { width: '100%', padding: '0.9rem', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.95rem', fontWeight: 600, outline: 'none' };
const stockAddButtonStyle = { padding: '0.9rem 2rem', borderRadius: '14px', background: '#1e293b', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', transition: '0.3s' };
const searchBarWrapper = { marginTop: '-1rem', marginBottom: '2rem' };
const searchFieldStyle = { border: 'none', background: 'transparent', flex: 1, fontSize: '1.1rem', fontWeight: 600, outline: 'none', color: '#1e293b' };
const modernTableStyle = { width: '100%', borderCollapse: 'separate', borderSpacing: '0 0' };
const tableHeaderStyle = { background: '#f8fafc', borderBottom: '2px solid #e2e8f0' };
const thStyle = { padding: '1.5rem', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textAlign: 'left', letterSpacing: '0.05em' };
const tdStyle = { padding: '1.5rem', borderBottom: '1px solid #f1f5f9' };
const tableImgBox = { width: '60px', height: '60px', background: 'white', padding: '6px', borderRadius: '14px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const tableImgStyle = { width: '100%', height: '100%', objectFit: 'contain' };
const categoryBadgeStyle = (cat) => ({ padding: '6px 12px', borderRadius: '10px', background: '#f1f5f9', color: '#475569', fontSize: '0.75rem', fontWeight: 700 });
const editBtnStyle = { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '10px', border: 'none', background: '#e0f2fe', color: '#0369a1', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' };
const removeBtnStyle = { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '10px', border: 'none', background: '#fee2e2', color: '#b91c1c', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' };
const emptyStateTd = { padding: '8rem 2rem', textAlign: 'center' };
const emptyStateWrapper = { display: 'flex', flexDirection: 'column', alignItems: 'center' };
const emptyIconBox = { width: '80px', height: '80px', borderRadius: '24px', background: '#f1f5f9', color: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000, padding: '2rem' };
const modalCardStyle = { width: '100%', maxWidth: '650px', padding: '3rem', background: 'white', borderRadius: '32px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 50px 100px rgba(0,0,0,0.2)' };
const modalHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' };
const closeBtnStyle = { cursor: 'pointer', background: '#f1f5f9', padding: '10px', borderRadius: '12px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: '#64748b' };
const formInputStyle = { width: '100%', padding: '1rem', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '1rem', fontWeight: 600, outline: 'none', transition: '0.3s' };
const formTextareaStyle = { width: '100%', padding: '1rem', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '1rem', fontWeight: 600, outline: 'none', resize: 'none' };
const modalSelectStyle = { width: '100%', padding: '1rem', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', outline: 'none' };
const submitButtonStyle = { width: '100%', marginTop: '2rem', padding: '1.2rem', borderRadius: '16px', background: '#3b82f6', color: 'white', border: 'none', fontSize: '1rem', fontWeight: 800, cursor: 'pointer' };
const spinnerContainerStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' };

export default AdminDashboard;
