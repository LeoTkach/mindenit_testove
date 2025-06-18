import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input.tsx';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';

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

interface UserEditFormProps {
  initialUser: User | null;
  onSave: (updatedUser: User) => void;
  onCancelEdit: () => void;
}

export function UserEditForm({ initialUser, onSave, onCancelEdit }: UserEditFormProps) {
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

  const { reset, clearErrors, formState } = form;
  const { isDirty, isValid } = formState;

  const memoizedInitialUser = useMemo(() => {
    if (!initialUser) return null;
    return {
      name: initialUser.name,
      department: initialUser.department,
      country: initialUser.country,
      status: initialUser.status,
    };
  }, [initialUser]);

  useEffect(() => {
    if (memoizedInitialUser) {
      reset(memoizedInitialUser);
    } else {
      clearErrors();
      reset();
    }
  }, [memoizedInitialUser, reset, clearErrors]);

  const departmentOptions: ComboboxOption[] = useMemo(() => departments.map(d => ({ label: d.name, value: d.value })), []);
  const countryOptions: ComboboxOption[] = useMemo(() => countries.map(c => ({ label: c.name, value: c.value })), []);
  const statusOptions: ComboboxOption[] = useMemo(() => statuses.map(s => ({ label: s.name, value: s.value })), []);

  const onSubmit = (data: UserFormValues) => {
    onSave(data as User);
    reset(data, { keepValues: true, keepDirty: false, keepDefaultValues: false });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">User Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    const selectedDep = departments.find(d => d.value === value);
                    if (selectedDep) field.onChange(selectedDep);
                  }}
                  placeholder="Select department"
                  searchPlaceholder="Search department..."
                />
                <FormMessage />
              </FormItem>
            )}
          />

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
                    const selectedCountry = countries.find(c => c.value === value);
                    if (selectedCountry) field.onChange(selectedCountry);
                  }}
                  placeholder="Select country"
                  searchPlaceholder="Search country..."
                />
                <FormMessage />
              </FormItem>
            )}
          />

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
                    const selectedStatus = statuses.find(s => s.value === value);
                    if (selectedStatus) field.onChange(selectedStatus);
                  }}
                  placeholder="Select status"
                  searchPlaceholder="Search status..."
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 mt-10">
          {isDirty && (
            <Button variant="outline" type="button" onClick={onCancelEdit}>
              Undo
            </Button>
          )}
          <Button type="submit" disabled={!isDirty || !isValid}>
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}