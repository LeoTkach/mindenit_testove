import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  emptyText = 'No results found.',
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const sortedOptions = React.useMemo(() => {
    const selectedOnes = options.filter(o => selected.includes(o.value));
    const unselectedOnes = options.filter(o => !selected.includes(o.value));
    return [...selectedOnes, ...unselectedOnes];
  }, [options, selected]);
  
  const selectedLabels = React.useMemo(() => 
      new Set(
          options
          .filter(o => selected.includes(o.value))
          .map(o => o.label)
      )
  , [options, selected]);

  const customFilter = (itemValue: string, search: string): number => {
    if (selectedLabels.has(itemValue)) {
        return 1;
    }
    if (itemValue.toLowerCase().startsWith(search.toLowerCase())) {
        return 1;
    }
    return 0;
  };


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
          onClick={() => setOpen(!open)}
        >
          <span className="truncate">
            {selected.length === 0
              ? placeholder
              : `${selected.length} selected`}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command filter={customFilter}>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            {sortedOptions.map((option) => (
              <CommandItem
                key={option.value}
                value={option.label}
                onSelect={() => onChange(option.value)}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    selected.includes(option.value)
                      ? 'opacity-100'
                      : 'opacity-0'
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}