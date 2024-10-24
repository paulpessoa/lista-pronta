'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useShoppingLists } from '@/hooks/useShoppingLists';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Unlock, Plus, Trash2 } from 'lucide-react';
import { CreateListForm } from './create-list-form';
import { ListItem } from './list-item';
import { ShareDialog } from './share-dialog';
import type { SharePermissions } from './types';

export function ShoppingList() {
  const { user, loading } = useAuth();
  const [newItem, setNewItem] = useState('');

  const {
    listsShop,
    createList,
    addItem,
    toggleItemComplete,
    deleteItem,
    deleteList,
    toggleListPublic,
  } = useShoppingLists();

  const handleShare = (listId: string, email: string, permissions: SharePermissions) => {
    console.log('Compartilhando lista', { listId, email, permissions });
  };




  return (
    <div className="max-w-4xl mx-auto p-4">

      <CreateListForm onCreateList={createList} />

      <div className="space-y-4">
        {listsShop.map(list => (
          <Card key={list.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{list.name}</CardTitle>
                <div className="flex gap-2">
                  {user && !loading && (
                    <>
                      <ShareDialog
                        listId={list.id}
                        listName={list.name}
                        onShare={(email, permissions) => handleShare(list.id, email, permissions)}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleListPublic(list.id)}
                      >
                        {list.is_public ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </Button>
                    </>
                  )}
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteList(list.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
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
                <Button onClick={() => {
                  addItem(list.id, newItem);
                  setNewItem('');
                }}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {list?.items ? (
                <ul className="space-y-2">
                  {list.items.map(item => (
                    <ListItem
                      key={item.id}
                      item={item}
                      onToggleComplete={() => toggleItemComplete(list.id, item.id)}
                      onDeleteItem={() => deleteItem(list.id, item.id)}
                    />
                  ))}
                </ul>
              )
                : <p className="text-gray-500">Nenhum item na lista</p>
              }
            </CardContent>
          </Card>
        ))}
      </div>


    </div>
  );
}