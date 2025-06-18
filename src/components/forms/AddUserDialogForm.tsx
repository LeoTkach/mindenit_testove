import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import departments from '@/data/departments';
import countries from '@/data/countries';
import statuses from '@/data/statuses';
import { type User } from '@/data/users';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { userSchema, type UserFormValues } from '@/schemas/userSchema';

interface AddUserDialogProps {
  onAddUser: (user: User) => void;
  onClose: () => void;
}

export function AddUserDialogForm({ onAddUser, onClose }: AddUserDialogProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      department: { name: '', value: '' },
      country: { name: '', value: '' },
      status: { name: '', value: '' },
    },
    mode: 'onChange',
  });

  const departmentOptions: ComboboxOption[] = useMemo(() => departments.map(d => ({ label: d.name, value: d.value })), []);
  const countryOptions: ComboboxOption[] = useMemo(() => countries.map(c => ({ label: c.name, value: c.value })), []);
  const statusOptions: ComboboxOption[] = useMemo(() => statuses.map(s => ({ label: s.name, value: s.value })), []);


  const onSubmit = (data: UserFormValues) => {
    onAddUser(data as User);
    form.reset();
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-center text-2xl font-semibold">
          ADD USER
        </DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 py-4">
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div>
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                   <Combobox
                      options={departmentOptions}
                      value={field.value?.value || ''}
                      onChange={(value) => {
                        const dep = departments.find(d => d.value === value);
                        if (dep) field.onChange(dep);
                      }}
                      placeholder="Select department"
                      searchPlaceholder="Search department..."
                    />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                    <Combobox
                      options={countryOptions}
                      value={field.value?.value || ''}
                      onChange={(value) => {
                        const c = countries.find(c => c.value === value);
                        if (c) field.onChange(c);
                      }}
                      placeholder="Select country"
                      searchPlaceholder="Search country..."
                    />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Combobox
                      options={statusOptions}
                      value={field.value?.value || ''}
                      onChange={(value) => {
                        const s = statuses.find(s => s.value === value);
                        if (s) field.onChange(s);
                      }}
                      placeholder="Select status"
                      searchPlaceholder="Search status..."
                    />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-2 flex justify-end gap-2 mt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add</Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}