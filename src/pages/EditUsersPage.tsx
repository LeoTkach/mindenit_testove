import { useState, useEffect, useMemo } from 'react';

import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import { users as initialUsers, type User } from '@/data/users';
import { UserEditForm } from '@/components/forms/UserEditForm';

export default function EditUsersPage() {
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('app_users');
    return savedUsers ? JSON.parse(savedUsers) : initialUsers;
  });

  const [selectedUserName, setSelectedUserName] = useState<string>('');
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | null>(null);

  useEffect(() => {
    localStorage.setItem('app_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    const userToEdit = users.find(u => u.name === selectedUserName);
    setSelectedUserForEdit(userToEdit ? { ...userToEdit } : null);
  }, [selectedUserName, users]);

  const handleUserSelect = (userName: string) => {
    setSelectedUserName(userName);
  };

  const handleSaveUser = (updatedUser: User) => {
    setUsers(currentUsers =>
      currentUsers.map(u => (u.name === selectedUserName ? updatedUser : u))
    );
    setSelectedUserName(updatedUser.name);
  };

  const handleCancelEdit = () => {
    const originalUser = users.find(u => u.name === selectedUserName);
    if (originalUser) {
      setSelectedUserForEdit({ ...originalUser });
    }
  };

  const userOptions: ComboboxOption[] = useMemo(() => 
    users.map(user => ({
      label: user.name,
      value: user.name,
    })), [users]
  );

  return (
    <div className="container mx-auto py-10">
      <div className="border rounded-lg p-8 bg-white shadow-sm max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-center">EDIT USER</h2>

        <div className="mb-10">
          <label htmlFor="user-select" className="text-sm font-medium text-gray-700">User</label>
          <Combobox
            options={userOptions}
            value={selectedUserName}
            onChange={handleUserSelect}
            placeholder="Select a user to edit"
            searchPlaceholder="Search user..."
            emptyText="No user found."
            className="mt-1"
          />
        </div>

        {selectedUserForEdit && (
          <UserEditForm
            initialUser={selectedUserForEdit}
            onSave={handleSaveUser}
            onCancelEdit={handleCancelEdit}
          />
        )}
      </div>
    </div>
  );
}