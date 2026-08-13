'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { UserRole } from '@/lib/types';
import {
  ShieldCheck,
  Shield,
  UserPlus,
  Trash2,
  Edit,
  LogOut,
  HeartHandshake,
  CheckCircle2,
  AlertCircle,
  Database,
  Receipt,
  X,
} from 'lucide-react';

export const UserProfilePage: React.FC = () => {
  const {
    user,
    isLiveMode,
    usersList,
    createUserAccount,
    deleteUserAccount,
    updateUserProfile,
    logout,
    transactions,
  } = useFinance();

  // Edit Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [fullNameInput, setFullNameInput] = useState(user?.full_name || '');
  const [emailInput, setEmailInput] = useState(user?.email || '');
  const [partnerNameInput, setPartnerNameInput] = useState(user?.couple_partner_name || '');

  // Create User Modal State (Admin)
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('user');
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalSuccess, setModalSuccess] = useState<string | null>(null);

  const isAdmin = user?.role === 'admin';

  // Save Edit Profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      full_name: fullNameInput,
      email: emailInput,
      couple_partner_name: partnerNameInput,
    });
    setIsEditingProfile(false);
  };

  // Handle Add New User by Admin
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setModalSuccess(null);

    if (!newUsername.trim() || !newPassword || !newFullName.trim()) {
      setModalError('Vui lòng điền đầy đủ Tên đăng nhập, Mật khẩu và Họ tên!');
      return;
    }

    const res = createUserAccount({
      username: newUsername.trim(),
      password: newPassword,
      full_name: newFullName.trim(),
      email: newEmail.trim() || `${newUsername.trim()}@system.local`,
      role: newRole,
    });

    if (res.success) {
      setModalSuccess(res.message);
      setTimeout(() => {
        setIsAddUserModalOpen(false);
        setNewUsername('');
        setNewPassword('');
        setNewFullName('');
        setNewEmail('');
        setNewRole('user');
        setModalSuccess(null);
      }, 1000);
    } else {
      setModalError(res.message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Banner Card */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            {/* User Avatar */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-rose-500/20 border-2 border-rose-400/40 text-rose-300 flex items-center justify-center font-black text-2xl sm:text-3xl shadow-lg shrink-0">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {user?.full_name || 'Người dùng'}
                </h1>
                {isAdmin ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wider uppercase bg-rose-500 text-white border border-rose-400 shadow-xs flex items-center space-x-1">
                    <Shield className="w-3 h-3 fill-current" />
                    <span>ADMINISTRATOR</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                    USER MEMBER
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 flex items-center space-x-2">
                <span>User: <strong className="text-rose-300">{user?.username || 'admin'}</strong></span>
                <span>•</span>
                <span>{user?.email || 'Chưa cập nhật email'}</span>
              </p>
              
              <div className="pt-1 flex items-center space-x-2">
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-rose-200 border border-white/10">
                  <HeartHandshake className="w-3 h-3 text-rose-400" />
                  <span>Cặp đôi: {user?.couple_partner_name || 'Chưa cấu hình'}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <button
              onClick={() => {
                setFullNameInput(user?.full_name || '');
                setEmailInput(user?.email || '');
                setPartnerNameInput(user?.couple_partner_name || '');
                setIsEditingProfile(true);
              }}
              className="flex-1 md:flex-initial flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/15 backdrop-blur-md transition-all active:scale-95"
            >
              <Edit className="w-4 h-4 text-rose-300" />
              <span>Sửa Hồ Sơ</span>
            </button>

            <button
              onClick={() => {
                if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?')) {
                  logout();
                }
              }}
              className="flex-1 md:flex-initial flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-lg transition-all active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng Xuất</span>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Form Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <Edit className="w-4 h-4 text-rose-500" />
                <span>Chỉnh Sửa Hồ Sơ Cá Nhân</span>
              </h3>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Họ và Tên</label>
                <input
                  type="text"
                  value={fullNameInput}
                  onChange={(e) => setFullNameInput(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Liên Hệ</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên Cặp Đôi (Đám cưới & Thu chi)</label>
                <input
                  type="text"
                  value={partnerNameInput}
                  onChange={(e) => setPartnerNameInput(e.target.value)}
                  placeholder="Nhập tên cặp đôi..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Lưu Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Panel Section: Manage Users */}
      {isAdmin && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
                  <span>Quản Lý Người Dùng Hệ Thống</span>
                  <span className="text-xs px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full font-bold">
                    Admin Privileges
                  </span>
                </h3>
                <p className="text-xs text-slate-500">Tạo tài khoản và cấp quyền cho thành viên khác</p>
              </div>
            </div>

            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-slate-900 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tạo Tài Khoản Mới</span>
            </button>
          </div>

          {/* User List Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                  <th className="p-3">Username</th>
                  <th className="p-3">Họ và Tên</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Vai Trò</th>
                  <th className="p-3 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-900">@{u.username}</td>
                    <td className="p-3 font-semibold">{u.full_name}</td>
                    <td className="p-3 text-slate-500">{u.email}</td>
                    <td className="p-3">
                      {u.role === 'admin' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-700 border border-rose-200">
                          ADMIN
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          USER
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {u.username !== 'admin' ? (
                        <button
                          onClick={() => {
                            if (confirm(`Bạn có chắc chắn muốn xóa tài khoản @${u.username} không?`)) {
                              deleteUserAccount(u.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Xóa người dùng"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Mặc định</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-rose-600" />
                <span>Tạo Tài Khoản Mới (Admin Only)</span>
              </h3>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}
            {modalSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{modalSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên Đăng Nhập (Username)</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Ví dụ: huy_user, yen_nhi..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mật Khẩu Mới</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Họ và Tên Người Dùng</label>
                <input
                  type="text"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="Nhập họ tên người dùng..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email (Không bắt buộc)</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phân Quyền (Role)</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                >
                  <option value="user">USER (Thành viên thông thường)</option>
                  <option value="admin">ADMINISTRATOR (Full quyền quản trị)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Khởi Tạo Tài Khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Account System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Tổng giao dịch</p>
            <h4 className="text-xl font-extrabold text-slate-900">{transactions.length} bản ghi</h4>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Lưu Trữ Dữ Liệu</p>
            <h4 className="text-sm font-bold text-slate-900">
              {isLiveMode ? 'Supabase Live Cloud' : 'LocalStorage cục bộ'}
            </h4>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Bảo Mật Tài Khoản</p>
            <h4 className="text-sm font-bold text-slate-900">256-bit Encryption</h4>
          </div>
        </div>
      </div>
    </div>
  );
};
