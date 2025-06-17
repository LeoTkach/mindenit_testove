import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
                  <Select
                    onValueChange={(value) => {
                      const dep = departments.find(d => d.value === value);
                      if (dep) field.onChange(dep);
                    }}
                    value={field.value?.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments.map(dep => (
                        <SelectItem key={dep.value} value={dep.value}>
                          {dep.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Select
                    onValueChange={(value) => {
                      const c = countries.find(c => c.value === value);
                      if (c) field.onChange(c);
                    }}
                    value={field.value?.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countries.map(c => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Select
                    onValueChange={(value) => {
                      const s = statuses.find(s => s.value === value);
                      if (s) field.onChange(s);
                    }}
                    value={field.value?.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statuses.map(s => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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