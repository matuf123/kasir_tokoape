import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  User,
  Search,
  Plus,
  Trash2,
  ChevronRight,
  CreditCard,
  Printer,
  MinusCircle,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Types ---
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
}

interface CartItem extends Product {
  quantity: number;
}

// --- Components ---

const Sidebar = ({ isOpen, toggle }: { isOpen: boolean, toggle: () => void }) => {
  const location = useLocation();

  const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/" },
    { title: "Kasir (POS)", icon: ShoppingCart, path: "/pos" },
    { title: "Produk", icon: Package, path: "/products" },
    { title: "Laporan", icon: BarChart3, path: "/reports" },
    { title: "Member", icon: Users, path: "/members" },
    { title: "Pengaturan", icon: Settings, path: "/settings" },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggle}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          x: isOpen ? 0 : -300,
          width: isOpen ? 84 : 0
        }}
        className="fixed lg:static inset-y-0 left-0 bg-white border-r border-gray-200 z-50 flex flex-col h-full lg:shadow-none"
      >
        <div className="py-6 flex flex-col items-center gap-10">
          <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <span className="font-bold text-xl">P</span>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-4 flex flex-col items-center">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                title={item.title}
                className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? "bg-blue-50 text-blue-600 shadow-sm" 
                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon size={22} className={isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"} />
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 mt-auto flex justify-center">
          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300">
             <User size={20} />
          </div>
        </div>
      </motion.aside>
    </>
  );
};

const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
  return (
    <header className="h-[70px] bg-white border-b border-gray-200 sticky top-0 z-30 px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="p-2 hover:bg-gray-100 rounded-lg lg:hidden">
          <Menu size={20} />
        </button>
        <div className="relative hidden md:block group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search products or scan barcode..." 
            className="pl-12 pr-6 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 w-[400px] transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 pl-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-tight">Budi Setiawan</p>
            <p className="text-xs text-gray-400 font-medium tracking-wide">KASIR • SHIFT PAGI</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

// --- Pages ---

const DashboardPage = () => {
  const [data, setData] = useState<{ totalOmzet: number, totalTransactions: number, recentTransactions: any[] }>({
    totalOmzet: 0,
    totalTransactions: 0,
    recentTransactions: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reports/dashboard")
      .then(res => res.json())
      .then(d => {
        setData(d);
        setIsLoading(false);
      });
  }, []);

  const stats = [
    { label: "Total Omzet", value: `Rp ${data.totalOmzet.toLocaleString("id-ID")}`, delta: "+0%", icon: BarChart3, color: "blue" },
    { label: "Total Transaksi", value: data.totalTransactions.toString(), delta: "+0%", icon: ShoppingCart, color: "green" },
    { label: "Produk Aktif", value: "...", delta: "0", icon: Package, color: "purple" },
    { label: "Points Member", value: "...", delta: "0", icon: Users, color: "orange" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <motion.div 
            whileHover={{ y: -4 }}
            key={stat.label} 
            className="card p-6"
          >
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                <stat.icon size={24} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900">{isLoading ? "..." : stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-black text-gray-900 uppercase tracking-wider text-sm">Penjualan Terakhir</h3>
            <Link to="/reports" className="text-xs text-blue-600 font-black hover:underline uppercase tracking-widest">Lihat Semua</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] uppercase bg-gray-50 text-gray-400 font-black tracking-widest">
                <tr>
                  <th className="px-6 py-4">Invoice</th>
                  <th className="px-6 py-4">Waktu</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr><td colSpan={4} className="p-8 text-center text-gray-400">Loading...</td></tr>
                ) : data.recentTransactions.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-gray-400">Belum ada transaksi</td></tr>
                ) : (
                  data.recentTransactions.map((t: any) => (
                    <tr key={t._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900">#TRX-{t._id.substring(t._id.length-6).toUpperCase()}</td>
                      <td className="px-6 py-4 text-gray-500 font-medium">{new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="px-6 py-4 font-black">Rp {t.total.toLocaleString("id-ID")}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600 transition-colors">
                          <Printer size={16} />
                        </button>
                      </td>
                    </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card h-fit">
          <div className="p-6 border-b border-gray-50">
            <h3 className="font-black text-gray-900 uppercase tracking-wider text-sm">Status Toko</h3>
          </div>
          <div className="p-6 space-y-4">
             <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm font-bold">Koneksi Database</span>
                <span className="flex items-center gap-2 text-green-600 text-xs font-black uppercase tracking-widest">
                  <CheckCircle2 size={12} /> Terhubung
                </span>
             </div>
             <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm font-bold">Sistem POS</span>
                <span className="text-blue-600 text-xs font-black uppercase tracking-widest">Aktif</span>
             </div>
             <div className="pt-4 border-t border-dashed border-gray-100">
               <div className="p-4 bg-gray-50 rounded-xl">
                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Pemberitahuan</p>
                 <p className="text-sm font-bold text-gray-700">Semua sistem berjalan normal.</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductsPage = () => {
   const [products, setProducts] = useState<any[]>([]);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [editingProduct, setEditingProduct] = useState<any>(null);
   const [formData, setFormData] = useState({ name: "", price: 0, stock: 0, category: "Sembako" });

   useEffect(() => { fetchProducts(); }, []);

   const fetchProducts = () => fetch("/api/products").then(res => res.json()).then(setProducts);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const method = editingProduct ? "PUT" : "POST";
      const url = editingProduct ? `/api/products/${editingProduct._id}` : "/api/products";
      
      const res = await fetch(url, {
         method,
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(formData)
      });
      if (res.ok) {
         fetchProducts();
         setIsModalOpen(false);
         setEditingProduct(null);
         setFormData({ name: "", price: 0, stock: 0, category: "Sembako" });
      }
   };

   const deleteProduct = async (id: string) => {
      if (confirm("Delete this product?")) {
         await fetch(`/api/products/${id}`, { method: "DELETE" });
         fetchProducts();
      }
   };

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h2 className="text-2xl font-black text-gray-900">Kelola Produk</h2>
               <p className="text-sm text-gray-500 font-medium">Tambah, edit, atau hapus stok produk toko.</p>
            </div>
            <button onClick={() => { setEditingProduct(null); setFormData({ name: "", price: 0, stock: 0, category: "Sembako" }); setIsModalOpen(true); }} className="btn btn-primary px-6">
               <Plus size={20} /> Tambah Produk
            </button>
         </div>

         <div className="card overflow-hidden">
            <table className="w-full text-left">
               <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-100">
                  <tr>
                     <th className="px-6 py-4">Nama Produk</th>
                     <th className="px-6 py-4">Kategori</th>
                     <th className="px-6 py-4">Harga</th>
                     <th className="px-6 py-4">Stok</th>
                     <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {products.map(p => (
                     <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900">{p.name}</td>
                        <td className="px-6 py-4"><span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black uppercase text-gray-500">{p.category}</span></td>
                        <td className="px-6 py-4 font-black text-blue-600">Rp {p.price.toLocaleString("id-ID")}</td>
                        <td className="px-6 py-4 font-bold text-gray-700">{p.stock}</td>
                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                           <button onClick={() => { setEditingProduct(p); setFormData({ name: p.name, price: p.price, stock: p.stock, category: p.category }); setIsModalOpen(true); }} className="p-2 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors">
                              <Settings size={16} />
                           </button>
                           <button onClick={() => deleteProduct(p._id)} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors">
                              <Trash2 size={16} />
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         <AnimatePresence>
            {isModalOpen && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                  <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-3xl w-full max-w-md p-8 relative shadow-2xl">
                     <h3 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-wider">{editingProduct ? "Edit Produk" : "Tambah Produk Baru"}</h3>
                     <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                           <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Nama Produk</label>
                           <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="input" placeholder="Masukkan nama produk..." />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Harga (Rp)</label>
                              <input type="number" required value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="input" />
                           </div>
                           <div>
                              <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Stok</label>
                              <input type="number" required value={formData.stock} onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })} className="input" />
                           </div>
                        </div>
                        <div>
                           <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Kategori</label>
                           <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="input">
                              <option>Sembako</option>
                              <option>Minuman</option>
                              <option>Snack</option>
                              <option>Kebutuhan Rumah</option>
                           </select>
                        </div>
                        <div className="pt-4 flex gap-3">
                           <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 btn btn-secondary uppercase tracking-widest text-xs">Batal</button>
                           <button type="submit" className="flex-1 btn btn-primary uppercase tracking-widest text-xs">Simpan</button>
                        </div>
                     </form>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>
      </div>
   );
};

const MembersPage = () => {
   const [members, setMembers] = useState<any[]>([]);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [editingMember, setEditingMember] = useState<any>(null);
   const [formData, setFormData] = useState({ name: "", phone: "", email: "" });

   useEffect(() => { fetchMembers(); }, []);

   const fetchMembers = () => fetch("/api/members").then(res => res.json()).then(setMembers);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const method = editingMember ? "PUT" : "POST";
      const url = editingMember ? `/api/members/${editingMember._id}` : "/api/members";
      
      const res = await fetch(url, {
         method,
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(formData)
      });
      if (res.ok) {
         fetchMembers();
         setIsModalOpen(false);
         setEditingMember(null);
         setFormData({ name: "", phone: "", email: "" });
      }
   };

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h2 className="text-2xl font-black text-gray-900">Program Member</h2>
               <p className="text-sm text-gray-500 font-medium">Kelola data pelanggan setia dan poin loyalitas.</p>
            </div>
            <button onClick={() => { setEditingMember(null); setFormData({ name: "", phone: "", email: "" }); setIsModalOpen(true); }} className="btn btn-primary px-6">
               <Plus size={20} /> Tambah Member
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map(m => (
               <motion.div layout key={m._id} className="card p-6 flex flex-col justify-between">
                  <div>
                     <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                           <Users size={24} />
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Total Poin</p>
                           <p className="text-xl font-black text-blue-600">{m.points || 0}</p>
                        </div>
                     </div>
                     <h3 className="font-bold text-gray-900 text-lg mb-1">{m.name}</h3>
                     <p className="text-sm text-gray-500 font-medium mb-3">{m.phone || "No phone"}</p>
                     <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Email</p>
                        <p className="text-xs font-bold text-gray-700 truncate">{m.email || "-"}</p>
                     </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-50 flex gap-2">
                     <button onClick={() => { setEditingMember(m); setFormData({ name: m.name, phone: m.phone, email: m.email }); setIsModalOpen(true); }} className="flex-1 btn btn-secondary text-xs uppercase tracking-widest py-2">Edit</button>
                     <button onClick={async () => { if(confirm("Delete member?")) { await fetch(`/api/members/${m._id}`, { method: "DELETE" }); fetchMembers(); } }} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                  </div>
               </motion.div>
            ))}
         </div>

         <AnimatePresence>
            {isModalOpen && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                  <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-3xl w-full max-w-md p-8 relative shadow-2xl">
                     <h3 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-wider">{editingMember ? "Edit Member" : "Registrasi Member"}</h3>
                     <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                           <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Nama Lengkap</label>
                           <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="input" />
                        </div>
                        <div>
                           <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Nomor Telepon</label>
                           <input type="text" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="input" />
                        </div>
                        <div>
                           <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Email</label>
                           <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="input" />
                        </div>
                        <div className="pt-4 flex gap-3">
                           <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 btn btn-secondary uppercase tracking-widest text-xs">Batal</button>
                           <button type="submit" className="flex-1 btn btn-primary uppercase tracking-widest text-xs">Simpan</button>
                        </div>
                     </form>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>
      </div>
   );
};

const ReportsPage = () => {
   const [history, setHistory] = useState<any[]>([]);

   useEffect(() => {
      fetch("/api/reports/dashboard")
         .then(res => res.json())
         .then(data => setHistory(data.recentTransactions));
   }, []);

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h2 className="text-2xl font-black text-gray-900">Laporan Penjualan</h2>
               <p className="text-sm text-gray-500 font-medium">Rekapitulasi seluruh transaksi yang terjadi.</p>
            </div>
            <button className="btn btn-secondary px-6">
               <Printer size={20} /> Cetak Laporan
            </button>
         </div>

         <div className="card">
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-100">
                     <tr>
                        <th className="px-6 py-4">ID Transaksi</th>
                        <th className="px-6 py-4">Tanggal & Waktu</th>
                        <th className="px-6 py-4">Metode</th>
                        <th className="px-6 py-4">Total Belanja</th>
                        <th className="px-6 py-4 text-right">Detail</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {history.map(t => (
                        <tr key={t._id} className="hover:bg-gray-50/50 transition-colors">
                           <td className="px-6 py-4 font-bold text-gray-900">#TRX-{t._id.substring(t._id.length-8).toUpperCase()}</td>
                           <td className="px-6 py-4 text-gray-500 font-medium">{new Date(t.createdAt).toLocaleString()}</td>
                           <td className="px-6 py-4"><span className="px-3 py-1 bg-blue-50 rounded-full text-[10px] font-black uppercase text-blue-600">{t.paymentMethod}</span></td>
                           <td className="px-6 py-4 font-black">Rp {t.total.toLocaleString("id-ID")}</td>
                           <td className="px-6 py-4 text-right">
                              <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
                                 <PlusCircle size={16} />
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
};

const SettingsPage = () => {
   const [settings, setSettings] = useState({ storeName: "", address: "", phone: "", taxRate: 0 });

   useEffect(() => {
      fetch("/api/settings").then(res => res.json()).then(setSettings);
   }, []);

   const handleSave = async () => {
      const res = await fetch("/api/settings", {
         method: "PUT",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(settings)
      });
      if (res.ok) alert("Pengaturan berhasil disimpan!");
   };

   return (
      <div className="space-y-6 max-w-4xl mx-auto">
         <div className="flex items-center justify-between">
            <div>
               <h2 className="text-2xl font-black text-gray-900">Konfigurasi Toko</h2>
               <p className="text-sm text-gray-500 font-medium">Sesuaikan identitas toko dan parameter pajak.</p>
            </div>
            <button onClick={handleSave} className="btn btn-primary px-8">
               Simpan Perubahan
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-8 space-y-4">
               <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Informasi Umum</h3>
               <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Nama Toko</label>
                  <input type="text" value={settings.storeName} onChange={e => setSettings({ ...settings, storeName: e.target.value })} className="input" />
               </div>
               <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Nomor Telepon Toko</label>
                  <input type="text" value={settings.phone} onChange={e => setSettings({ ...settings, phone: e.target.value })} className="input" />
               </div>
               <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Alamat Lengkap</label>
                  <textarea value={settings.address} onChange={e => setSettings({ ...settings, address: e.target.value })} className="input h-24" />
               </div>
            </div>

            <div className="card p-8 space-y-4">
               <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Sistem & Pajak</h3>
               <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Pajak PPN (%)</label>
                  <input type="number" value={settings.taxRate} onChange={e => setSettings({ ...settings, taxRate: Number(e.target.value) })} className="input" />
               </div>
               <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Mata Uang</label>
                  <select className="input cursor-not-allowed" disabled>
                     <option>Rupiah (IDR)</option>
                  </select>
               </div>
               <div className="pt-6">
                  <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100 flex gap-4">
                     <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
                     <p className="text-xs text-yellow-800 leading-relaxed font-medium">Perubahan pada pengaturan pajak akan langsung berdampak pada perhitungan total di halaman POS.</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

// --- POS Components ---

const POSPage = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("Semua");
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchMembers();
  }, []);

  const fetchMembers = () => fetch("/api/members").then(res => res.json()).then(setMembers);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.map((p: any) => ({ ...p, id: p._id || p.id })));
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map(item => ({ productId: item.id, name: item.name, price: item.price, quantity: item.quantity })),
          total: total,
          paymentMethod: "cash",
          memberId: selectedMember?._id
        })
      });
      if (res.ok) {
        setIsReceiptOpen(true);
      }
    } catch (err) {
      console.error("Payment failed:", err);
    }
  };

  const categories = ["Semua", "Sembako", "Minuman", "Snack", "Kebutuhan Rumah"];

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (category === "Semua" || p.category === category)
  );

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col lg:flex-row gap-0 -m-6 overflow-hidden">
      {/* Product Selection */}
      <div className="flex-1 flex flex-col gap-6 p-8 overflow-hidden bg-gray-50">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border duration-200 ${
                category === cat 
                  ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20" 
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 pr-2">
          {isLoading ? (
            [1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="card p-4 animate-pulse border-none shadow-sm">
                <div className="aspect-square bg-white border border-gray-100 rounded-xl mb-4" />
                <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-5 bg-gray-200 rounded w-full" />
              </div>
            ))
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full h-full flex flex-col items-center justify-center text-gray-400">
               <Package size={64} className="mb-4 opacity-10" />
               <p className="font-semibold text-lg">No products found</p>
               <p className="text-sm">Try using different search terms or categories</p>
            </div>
          ) : (
            filteredProducts.map(product => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.98 }}
              key={product.id}
              onClick={() => addToCart(product)}
              className="card p-4 cursor-pointer hover:border-blue-400 transition-all group bg-white border-gray-200"
            >
              <div className="aspect-square bg-gray-50 rounded-xl mb-4 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 transition-colors overflow-hidden border border-gray-50">
                <Package size={40} strokeWidth={1} />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{product.category}</p>
              <h4 className="font-bold text-gray-900 line-clamp-2 leading-tight h-10 text-sm">{product.name}</h4>
              <div className="mt-3">
                <p className="font-black text-blue-600 text-base">Rp {product.price.toLocaleString("id-ID")}</p>
              </div>
            </motion.div>
          )))}
        </div>
      </div>

      {/* Cart / Summary */}
      <div className="w-full lg:w-[360px] flex-shrink-0 flex flex-col h-full bg-white border-l border-gray-200 overflow-hidden relative">
        <div className="p-8 pb-4 flex items-center justify-between">
          <h3 className="font-black text-gray-900 text-xl">Active Order</h3>
          <button 
            onClick={() => setCart([])}
            className="text-blue-600 font-bold text-sm hover:underline"
          >
            Clear All
          </button>
        </div>

        {/* Member Selection */}
        <div className="px-8 mb-4">
           <div className="relative group">
              <Users size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" />
              <select 
                value={selectedMember?._id || ""} 
                onChange={(e) => setSelectedMember(members.find(m => m._id === e.target.value))}
                className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/10 appearance-none"
              >
                <option value="">Guest (No Member)</option>
                {members.map(m => (
                  <option key={m._id} value={m._id}>{m.name} ({m.phone})</option>
                ))}
              </select>
           </div>
           {selectedMember && (
             <div className="mt-2 p-2 bg-blue-50 rounded-lg flex items-center justify-between">
                <span className="text-[10px] font-black text-blue-600 uppercase">Points: {selectedMember.points || 0}</span>
                <button onClick={() => setSelectedMember(null)} className="text-blue-600 hover:text-red-500 transition-colors">
                   <X size={12} />
                </button>
             </div>
           )}
        </div>

        <div className="flex-1 overflow-y-auto p-8 pt-4 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-300">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart size={24} />
              </div>
              <p className="font-bold text-sm">Cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <motion.div 
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={item.id} 
                className="flex justify-between items-start group"
              >
                <div className="flex-1 pr-4">
                  <h4 className="text-sm font-bold text-gray-900 leading-tight">{item.name}</h4>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex items-center gap-2">
                       <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-400 hover:text-red-500 transition-colors">
                         <MinusCircle size={16} />
                       </button>
                       <span className="text-xs font-black text-gray-700 w-4 text-center">{item.quantity}</span>
                       <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-400 hover:text-blue-600 transition-colors">
                         <PlusCircle size={16} />
                       </button>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">x Rp {item.price.toLocaleString("id-ID")}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-gray-900">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <div className="p-8 bg-white border-t-2 border-dashed border-gray-100">
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-sm text-gray-500 font-bold">
              <span>Subtotal</span>
              <span className="text-gray-900">Rp {total.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 font-bold">
              <span>Discount</span>
              <span className="text-red-500">- Rp 0</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 font-bold">
              <span>Tax (PPN 11%)</span>
              <span className="text-gray-900">Rp {(total * 0.11).toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <span className="text-gray-900 font-black text-base uppercase">Total</span>
              <span className="text-3xl font-black text-blue-600">Rp {(total * 1.11).toLocaleString("id-ID", { maximumFractionDigits: 0 })}</span>
            </div>
          </div>

          <button 
            disabled={cart.length === 0}
            onClick={handlePayment}
            className="w-full btn btn-primary py-5 text-base uppercase tracking-widest disabled:opacity-30 disabled:shadow-none"
          >
            CONFIRM PAYMENT
          </button>

          {/* Mini Struk Preview */}
          <div className="mt-6 p-4 bg-[#FFFBEB] border border-[#FEF3C7] rounded-xl font-mono text-[10px] text-gray-700 space-y-2 opacity-80 scale-95 origin-bottom translate-y-2 group">
             <div className="text-center border-b border-amber-200 pb-2 mb-2 font-bold uppercase tracking-wider">
               Toko Sejahtera Makmur<br/>Jakarta Selatan
             </div>
             <div className="flex justify-between items-center">
               <span>#TRX-{Math.floor(Date.now()/100000)}</span>
               <span>{new Date().toLocaleDateString()}</span>
             </div>
             <div className="divide-y divide-amber-100">
               {cart.slice(0, 2).map(item => (
                 <div key={item.id} className="flex justify-between py-1">
                   <span>{item.name.substring(0, 15).toUpperCase()} ({item.quantity})</span>
                   <span>{(item.price * item.quantity).toLocaleString("id-ID")}</span>
                 </div>
               ))}
               {cart.length > 2 && <div className="py-1 italic text-center text-gray-400">... {cart.length - 2} more items</div>}
             </div>
             <div className="border-t border-amber-200 pt-2 font-bold flex justify-between tracking-tighter">
               <span>TOTAL</span>
               <span>Rp {(total * 1.11).toLocaleString("id-ID", { maximumFractionDigits: 0 })}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Structured Receipt Modal */}
      <AnimatePresence>
        {isReceiptOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReceiptOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden relative shadow-2xl"
            >
              <div className="bg-blue-600 p-8 text-center text-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-16 -translate-y-16" />
                 <CheckCircle2 size={48} className="mx-auto mb-4" />
                 <h3 className="text-2xl font-bold">Pembayaran Berhasil!</h3>
                 <p className="opacity-80 mt-1">ID: #INV-20240412-001</p>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div className="text-gray-900">
                        <span className="font-bold">{item.quantity}x</span> {item.name}
                      </div>
                      <span className="font-bold text-gray-900">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-dashed border-gray-200 space-y-3">
                  <div className="flex justify-between text-gray-500 font-medium">
                    <span>Metode Pembayaran</span>
                    <span className="text-gray-900 uppercase">Tunai</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-900 font-bold text-lg">Total</span>
                    <span className="text-2xl font-black text-blue-600">Rp {total.toLocaleString("id-ID")}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-6">
                  <button 
                    onClick={() => {
                      setCart([]);
                      setIsReceiptOpen(false);
                    }}
                    className="flex-1 btn btn-secondary py-3 font-bold"
                  >
                    Tutup
                  </button>
                  <button className="flex-1 btn btn-primary py-3 font-bold">
                    <Printer size={18} />
                    Cetak Struk
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          
          <div className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/pos" element={<POSPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/members" element={<MembersPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}
