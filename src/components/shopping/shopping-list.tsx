/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useShoppingLists } from '@/hooks/useShoppingLists';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { CreateListForm } from './create-list-form';
import { ListItem } from './list-item';
import { ShareDialog } from './share-dialog';
import type { SharePermissions } from './types';
import ListManagement from './list-management';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export function ShoppingList() {
  const [newItem, setNewItem] = useState('');

  const {
    lists,
    createList,
    addItem,
  } = useShoppingLists();

  const handleShare = (listId: string, email: string, permissions: SharePermissions) => {
    console.log('Compartilhando lista', { listId, email, permissions });
  };

  const handleUpdateList = async (listData) => {
    const { data, error } = await supabase
      .from('lists')
      .update({
        name: listData.name,
      })
      .eq('id', listData.id);

    if (error) throw error;
  };

  const handleDeleteList = async (listId) => {
    const { error } = await supabase
      .from('lists')
      .delete()
      .eq('id', listId);

    if (error) throw error;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <CreateListForm onCreateList={createList} />
      <div className="space-y-4">
        {lists && lists.map((list) => (
          <Card key={list.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <Link href={`/lists/${list.id}`}>
                  <CardTitle >{list.name}</CardTitle>
                </Link>
                <div className="flex gap-2">
                  <ListManagement
                    list={{
                      id: list.id,
                      name: list.name,
                    }}
                    onUpdate={handleUpdateList}
                    onDelete={handleDeleteList}
                  />

                  <ShareDialog
                    listId={list.id}
                    listName={list.name}
                    onShare={(email, permissions) =>
                      handleShare(list.id, email, permissions)
                    }
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="Adicionar item"
                  className="flex-1"
                />
                <Button
                  onClick={() => {
                    addItem(list.id, newItem);
                    setNewItem('');
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {list?.items ? (
                <ul className="space-y-2">
                  {list.items.map((item) => (
                    <ListItem
                      key={item.id}
                      item={item}

                    />
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Nenhum item na lista</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
