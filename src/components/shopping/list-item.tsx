'use client';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import type { ShoppingItem } from './types';

interface ListItemProps {
  item: ShoppingItem;
  onToggleComplete: (itemId: number) => void;
  onDeleteItem: (itemId: number) => void;
}

export function ListItem({ item, onToggleComplete, onDeleteItem }: ListItemProps) {
  return (
    <li className="flex items-center justify-between p-2 hover:bg-muted rounded">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={item.checked}
          onChange={() => onToggleComplete(item.id)}
          className="w-4 h-4"
        />
        <span className={`${item.checked ? 'line-through text-muted-foreground' : ''}`}>
          {item.name}
        </span>
      </div>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => onDeleteItem(item.id)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </li>
  );
}
