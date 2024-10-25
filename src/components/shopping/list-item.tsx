'use client';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import type { ShoppingItem } from './types';
import { useShoppingLists } from '@/hooks/useShoppingLists';

interface ListItemProps {
  item: ShoppingItem;
}

export function ListItem({ item }: ListItemProps) {
  const { toggleItemChecked, deleteItem } = useShoppingLists();
  return (
    <li className="flex items-center justify-between p-2 hover:bg-muted rounded">
      <div className="flex items-center gap-2">
        <input
          title='Marcar / Desmarcar'
          type="checkbox"
          checked={item.checked}
          onChange={() => toggleItemChecked(item.list_id, item.id, !item.checked)}
          className="w-4 h-4 cursor-pointer"
        />
        <span className={`${item.checked ? 'line-through text-muted-foreground' : ''}`}>
          {item.name}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => deleteItem(item.id)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </li>
  );
}
