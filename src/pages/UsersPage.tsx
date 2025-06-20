import { useState, useMemo, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Combobox } from '@/components/ui/combobox';
import { MultiSelect } from '@/components/ui/multiselect';
import { users as initialUsers, type User } from '@/data/users';
import departments from '@/data/departments';
import countries from '@/data/countries';
import statuses from '@/data/statuses';
import { Trash } from 'lucide-react';
import { AddUserDialogForm } from '@/components/forms/AddUserDialogForm';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('app_users');
    return savedUsers ? JSON.parse(savedUsers) : initialUsers;
  });

  const [selectedDepartments, setSelectedDepartments] = useState<string[]>(() => {
    const saved = localStorage.getItem('app_selectedDepartments');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedCountry, setSelectedCountry] = useState<string>(() => {
    return localStorage.getItem('app_selectedCountry') || 'ALL';
  });

  const [selectedStatus, setSelectedStatus] = useState<string>(() => {
    return localStorage.getItem('app_selectedStatus') || 'ALL';
  });

  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('app_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('app_selectedDepartments', JSON.stringify(selectedDepartments));
  }, [selectedDepartments]);

  useEffect(() => {
    localStorage.setItem('app_selectedCountry', selectedCountry);
  }, [selectedCountry]);

  useEffect(() => {
    localStorage.setItem('app_selectedStatus', selectedStatus);
  }, [selectedStatus]);

  const areOtherFiltersDisabled = selectedDepartments.length < 3;

  useEffect(() => {
    if (areOtherFiltersDisabled) {
      setSelectedCountry('ALL');
      setSelectedStatus('ALL');
    }
  }, [selectedDepartments, areOtherFiltersDisabled]);

  const handleDepartmentSelect = (departmentValue: string) => {
    setSelectedDepartments(prev =>
      prev.includes(departmentValue)
        ? prev.filter(d => d !== departmentValue)
        : [...prev, departmentValue]
    );
  };

  const resetFilters = () => {
    setSelectedDepartments([]);
    setSelectedCountry('ALL');
    setSelectedStatus('ALL');
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const departmentMatch =
        selectedDepartments.length === 0 ||
        selectedDepartments.includes(user.department.value);

      const countryMatch =
        areOtherFiltersDisabled ||
        selectedCountry === 'ALL' ||
        user.country.value === selectedCountry;

      const statusMatch =
        areOtherFiltersDisabled ||
        selectedStatus === 'ALL' ||
        user.status.value === selectedStatus;

      return departmentMatch && countryMatch && statusMatch;
    });
  }, [users, selectedDepartments, selectedCountry, selectedStatus, areOtherFiltersDisabled]);

  const handleAddUser = (newUser: User) => {
    setUsers(prevUsers => [...prevUsers, newUser]);
    setIsAddUserDialogOpen(false);
  };

  const handleDeleteUser = (userName: string) => {
    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      setUsers(prevUsers => prevUsers.filter(user => user.name !== userName));
    }
  };
  
  const departmentOptions = departments.map(d => ({ label: d.name, value: d.value }));
  const countryOptions = [{ label: 'All Countries', value: 'ALL' }, ...countries.map(c => ({ label: c.name, value: c.value }))];
  
  const statusOptions = statuses.map(s => ({ label: s.name, value: s.value }));


  return (
    <div className="container mx-auto py-10">
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <h2 className="text-2xl font-semibold mb-4 text-center">USERS</h2>
        <p className="text-center text-muted-foreground mb-6">
          Please add at least 3 departments to be able to proceed next steps.
        </p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            
            <MultiSelect
                options={departmentOptions}
                selected={selectedDepartments}
                onChange={handleDepartmentSelect}
                placeholder="Select departments"
                searchPlaceholder="Search..."
                className="w-[200px]"
            />
            
            <Combobox
              options={countryOptions}
              value={selectedCountry}
              onChange={setSelectedCountry}
              disabled={areOtherFiltersDisabled}
              placeholder="Select country"
              searchPlaceholder="Search country..."
              className="w-[180px]"
            />
            
            <Combobox
              options={statusOptions}
              value={selectedStatus}
              onChange={setSelectedStatus}
              disabled={areOtherFiltersDisabled}
              placeholder="Select status"
              searchPlaceholder="Search status..."
              className="w-[180px]"
            />

            <Button variant="ghost" onClick={resetFilters}>
              <Trash className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
          <Dialog
            open={isAddUserDialogOpen}
            onOpenChange={setIsAddUserDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>Add User</Button>
            </DialogTrigger>
            <AddUserDialogForm
              onAddUser={handleAddUser}
              onClose={() => setIsAddUserDialogOpen(false)}
            />
          </Dialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map(user => (
              <TableRow key={user.name}>
                <TableCell
                  className="font-medium"
                >
                  {user.name}
                </TableCell>
                <TableCell>{user.department.name}</TableCell>
                <TableCell>{user.country.name}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status.value === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : user.status.value === 'DISABLED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {user.status.name}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteUser(user.name)}
                  >
                    <Trash className="h-5 w-5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}