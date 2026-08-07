
import { Search, Eye, Edit, Trash } from 'lucide-react';

export default function AdminUsers({

  users,
  selectedUser,
  setSelectedUser,
  isEditingUser,
  setIsEditingUser,
  userForm,
  setUserForm,
  handleSaveUser,
  handleDeleteUser,
  userSearch,
  setUserSearch,
  userRoleFilter,
  setUserRoleFilter,
  userStatusFilter,
  setUserStatusFilter
}) {
  const safeUsers = Array.isArray(users) ? users : [];

  const filteredUsers = safeUsers.filter(u => {
    const matchesSearch = (u.username || '').toLowerCase().includes(userSearch.toLowerCase()) || 
                          (u.email || '').toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === '' || u.role === userRoleFilter;
    const matchesStatus = userStatusFilter === '' || u.status === userStatusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left side: Users list */}
        <div className="lg:col-span-2 bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-[9px] uppercase tracking-widest text-decor-gold font-medium block">Registry Controls</span>
              <h3 className="font-serif text-lg text-white uppercase tracking-wider">Client & Administrative Database</h3>
            </div>
            <button 
              onClick={() => {
                setSelectedUser(null);
                setIsEditingUser(true);
                setUserForm({ id: null, username: '', email: '', phone: '', gender: 'Not Specified', address: '', role: 'CUSTOMER', status: 'ACTIVE', profileImage: '', password: '' });
              }}
              className="bg-decor-gold text-black hover:bg-decor-gold-light text-[9px] tracking-widest uppercase px-3 py-1.5 font-semibold transition-colors cursor-pointer"
            >
              Create System Account
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full bg-decor-ivory border border-white/10 focus:border-decor-gold rounded-xs px-3 py-2 text-xs text-white focus:outline-none pl-8"
              />
              <Search size={13} className="absolute left-2.5 top-3 text-zinc-500" />
            </div>
            <div>
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="w-full bg-decor-ivory border border-white/10 focus:border-decor-gold rounded-xs px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="">All Roles</option>
                <option value="CUSTOMER">Customer Role</option>
                <option value="ADMIN">Admin Role</option>
              </select>
            </div>
            <div>
              <select
                value={userStatusFilter}
                onChange={(e) => setUserStatusFilter(e.target.value)}
                className="w-full bg-decor-ivory border border-white/10 focus:border-decor-gold rounded-xs px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="BLOCKED">BLOCKED</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10 text-[9px] uppercase tracking-widest text-zinc-400 font-semibold bg-decor-ivory/40">
                  <th className="py-2.5 px-3">Avatar</th>
                  <th className="py-2.5 px-3">Username</th>
                  <th className="py-2.5 px-3">Email Address</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs font-light text-zinc-300">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-white/10/40 hover:bg-[#1C1C1E]/50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-decor-gold/20 flex items-center justify-center border border-zinc-800">
                          {user.profileImage ? (
                            <img src={user.profileImage} alt={user.username} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] font-semibold text-white font-mono uppercase">
                              {(user.username || user.email || '?').charAt(0)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-medium text-white">{user.username || user.email}</td>
                      <td className="py-3 px-3 text-zinc-400">{user.email}</td>
                      <td className="py-3 px-3 font-mono text-[10px]">
                        <span className={`px-2 py-0.5 rounded-sm text-[8px] font-bold ${
                          user.role === 'ADMIN' ? 'bg-decor-gold/20 text-decor-gold border border-decor-gold/30' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedUser(user);
                            setIsEditingUser(false);
                          }}
                          className="text-zinc-400 hover:text-white p-1 cursor-pointer transition-colors"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedUser(user);
                            setIsEditingUser(true);
                            setUserForm({
                              id: user.id,
                              username: user.username,
                              email: user.email,
                              phone: user.phone || '',
                              gender: user.gender || 'Not Specified',
                              address: user.address || '',
                              role: user.role || 'CUSTOMER',
                              status: user.status || 'ACTIVE',
                              profileImage: user.profileImage || '',
                              password: ''
                            });
                          }}
                          className="text-zinc-400 hover:text-decor-gold p-1 cursor-pointer transition-colors"
                          title="Edit User"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-zinc-400 hover:text-red-500 p-1 cursor-pointer transition-colors"
                          title="Delete User"
                        >
                          <Trash size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-500 italic">No users found in database.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right side: Editor or detail card */}
        <div className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-sm self-start sticky top-24">
          {isEditingUser ? (
            <div className="space-y-6">
              <h4 className="font-serif text-sm text-white uppercase tracking-wider border-b border-white/10 pb-2 font-semibold text-center">
                {userForm.id ? "Edit User Record" : "Add System Account"}
              </h4>
              
              <form onSubmit={handleSaveUser} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-decor-gold block">Email Address *</label>
                  <input 
                    type="email" 
                    required
                    value={userForm.email}
                    onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                    className="w-full bg-decor-ivory border border-white/10 focus:border-decor-gold rounded-xs px-3 py-1.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-decor-gold block">Username / Full Name</label>
                  <input 
                    type="text" 
                    value={userForm.username}
                    onChange={(e) => setUserForm({...userForm, username: e.target.value})}
                    className="w-full bg-decor-ivory border border-white/10 focus:border-decor-gold rounded-xs px-3 py-1.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-decor-gold block">Contact Phone</label>
                  <input 
                    type="text" 
                    value={userForm.phone}
                    onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                    className="w-full bg-decor-ivory border border-white/10 focus:border-decor-gold rounded-xs px-3 py-1.5 text-xs text-white focus:outline-none font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-decor-gold block">Gender</label>
                    <select
                      value={userForm.gender}
                      onChange={(e) => setUserForm({...userForm, gender: e.target.value})}
                      className="w-full bg-decor-ivory border border-white/10 focus:border-decor-gold rounded-xs px-3 py-1.5 text-xs text-white focus:outline-none bg-black/40 backdrop-blur-md"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Not Specified">Not Specified</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-decor-gold block">System Role</label>
                    <select
                      value={userForm.role}
                      onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                      className="w-full bg-decor-ivory border border-white/10 focus:border-decor-gold rounded-xs px-3 py-1.5 text-xs text-white focus:outline-none bg-black/40 backdrop-blur-md"
                    >
                      <option value="CUSTOMER">CUSTOMER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-decor-gold block">Account Status</label>
                  <select
                    value={userForm.status}
                    onChange={(e) => setUserForm({...userForm, status: e.target.value})}
                    className="w-full bg-decor-ivory border border-white/10 focus:border-decor-gold rounded-xs px-3 py-1.5 text-xs text-white focus:outline-none bg-black/40 backdrop-blur-md"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="BLOCKED">BLOCKED</option>
                  </select>
                </div>

                <div className="space-y-1 border-t border-white/10 pt-3">
                  <label className="text-[9px] uppercase tracking-widest text-red-400 block font-semibold">
                    {userForm.id ? "Password Reset (Optional)" : "Password *"}
                  </label>
                  <input 
                    type="password" 
                    value={userForm.password}
                    onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                    className="w-full bg-decor-ivory border border-white/10 focus:border-red-400 rounded-xs px-3 py-1.5 text-xs text-white focus:outline-none"
                    placeholder={userForm.id ? "Leave empty to keep current" : "Minimum 8 chars"}
                  />
                </div>

                <div className="flex space-x-3 pt-3">
                  <button 
                    type="submit" 
                    className="flex-1 bg-decor-gold hover:bg-decor-gold-light text-black text-[9px] tracking-widest uppercase py-2.5 font-bold transition-colors rounded-sm cursor-pointer"
                  >
                    Save Account
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setIsEditingUser(false);
                      if(!selectedUser) setUserForm({ id: null, username: '', email: '', phone: '', gender: 'Not Specified', address: '', role: 'CUSTOMER', status: 'ACTIVE', profileImage: '', password: '' });
                    }}
                    className="flex-1 bg-transparent border border-white/10 text-zinc-400 hover:text-white text-[9px] tracking-widest uppercase py-2.5 font-medium transition-colors rounded-sm cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : selectedUser ? (
            <div className="space-y-6">
              <h4 className="font-serif text-sm text-white uppercase tracking-wider border-b border-white/10 pb-2 font-semibold text-center">
                User Profile Details
              </h4>
              <div className="flex flex-col items-center space-y-3 pb-4 border-b border-white/10">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-decor-gold/25 flex items-center justify-center border border-decor-gold">
                  {selectedUser.profileImage ? (
                    <img src={selectedUser.profileImage} alt={selectedUser.username} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-semibold text-white uppercase">{(selectedUser.username || selectedUser.email || '?').charAt(0)}</span>
                  )}
                </div>
                <div className="text-center">
                  <h5 className="font-serif text-base text-white">{selectedUser.username || selectedUser.email}</h5>
                  <span className="text-[9px] uppercase tracking-widest text-decor-gold">{selectedUser.role}</span>
                </div>
              </div>

              <div className="space-y-4 text-xs font-light text-zinc-400">
                <div>
                  <span className="text-[8px] uppercase tracking-widest text-zinc-500 block">Email Address</span>
                  <span className="text-white font-medium">{selectedUser.email}</span>
                </div>
                <div>
                  <span className="text-[8px] uppercase tracking-widest text-zinc-500 block">Contact Phone</span>
                  <span className="text-white font-medium font-mono">{selectedUser.phone || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-[8px] uppercase tracking-widest text-zinc-500 block">Gender</span>
                  <span className="text-white font-medium capitalize">{selectedUser.gender || 'Not Specified'}</span>
                </div>
                <div>
                  <span className="text-[8px] uppercase tracking-widest text-zinc-500 block">User Account Status</span>
                  <span className={`px-2 py-0.5 rounded-sm text-[8px] font-bold inline-block mt-1 ${
                    selectedUser.status !== 'BLOCKED' ? 'bg-green-950/20 text-green-500 border border-green-900/30' : 'bg-red-950/20 text-red-500 border border-red-900/30'
                  }`}>
                    {selectedUser.status || 'ACTIVE'}
                  </span>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-white/10">
                <button 
                  onClick={() => {
                    setIsEditingUser(true);
                    setUserForm({
                      id: selectedUser.id,
                      username: selectedUser.username,
                      email: selectedUser.email,
                      phone: selectedUser.phone || '',
                      gender: selectedUser.gender || 'Not Specified',
                      address: selectedUser.address || '',
                      role: selectedUser.role || 'CUSTOMER',
                      status: selectedUser.status || 'ACTIVE',
                      profileImage: selectedUser.profileImage || '',
                      password: ''
                    });
                  }}
                  className="flex-1 bg-decor-gold text-black hover:bg-decor-gold-light text-[9px] tracking-widest uppercase py-2.5 font-bold transition-colors rounded-sm cursor-pointer"
                >
                  Modify Record
                </button>
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="flex-1 bg-transparent border border-white/10 text-zinc-400 hover:text-white text-[9px] tracking-widest uppercase py-2.5 font-medium transition-colors rounded-sm cursor-pointer"
                >
                  Close Panel
                </button>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-center p-4">
              <p className="text-xs text-zinc-500 font-light leading-relaxed uppercase tracking-wider">
                Select a User from the database list on the left to inspect profile details, reset passwords, or update account roles.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
