// components/shopping/shopping-list.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogIn, Lock, Unlock, Plus, Trash2 } from 'lucide-react';
import { CreateListForm } from './create-list-form';
import { ListItem } from './list-item';
import { ShareDialog } from './share-dialog';
import type { ShoppingList, ShoppingItem, SharePermissions } from './types';

export function ShoppingList() {
  const [lists, setLists] = useState<ShoppingList[]>(() => {
    if (typeof window !== 'undefined') {
      const savedLists = localStorage.getItem('shopping-lists');
      return savedLists ? JSON.parse(savedLists) : [];
    }
    return [];
  });
  
  const [newItem, setNewItem] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('shopping-lists', JSON.stringify(lists));
    }
  }, [lists]);

  const handleCreateList = (name: string) => {
    const newList: ShoppingList = {
      id: Date.now(),
      name,
      items: [],
      isPublic: false,
      createdAt: new Date().toISOString()
    };
    setLists([...lists, newList]);
  };

  const handleAddItem = (listId: number) => {
    if (!newItem.trim()) return;
    setLists(lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          items: [...list.items, { 
            id: Date.now(), 
            name: newItem, 
            completed: false 
          }]
        };
      }
      return list;
    }));
    setNewItem('');
  };

  const handleShare = (listId: number, email: string, permissions: SharePermissions) => {
    // Aqui implementaremos a integração com o Supabase posteriormente
    console.log('Compartilhando lista', { listId, email, permissions });
  };

  const handleToggleComplete = (listId: number, itemId: number) => {
    setLists(lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          items: list.items.map(item => 
            item.id === itemId ? { ...item, completed: !item.completed } : item
          )
        };
      }
      return list;
    }));
  };

  const handleDeleteItem = (listId: number, itemId: number) => {
    setLists(lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          items: list.items.filter(item => item.id !== itemId)
        };
      }
      return list;
    }));
  };

  const handleDeleteList = (listId: number) => {
    setLists(lists.filter(list => list.id !== listId));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Prio List</h1>
        {!isAuthenticated && (
          <Button 
            onClick={() => setIsAuthenticated(true)} 
            className="flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            Login
          </Button>
        )}
      </div>

      <CreateListForm onCreateList={handleCreateList} />

      <div className="space-y-4">
        {lists.map(list => (
          <Card key={list.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{list.name}</CardTitle>
                <div className="flex gap-2">
                  {isAuthenticated && (
                    <>
                      <ShareDialog
                        listId={list.id}
                        listName={list.name}
                        onShare={(email, permissions) => handleShare(list.id, email, permissions)}
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => {
                          setLists(lists.map(l => 
                            l.id === list.id ? {...l, isPublic: !l.isPublic} : l
                          ));
                        }}
                      >
                        {list.isPublic ? (
                          <Unlock className="w-4 h-4" />
                        ) : (
                          <Lock className="w-4 h-4" />
                        )}
                      </Button>
                    </>
                  )}
                  <Button 
                    variant="destructive" 
                    size="icon"
                    onClick={() => handleDeleteList(list.id)}
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
                <Button onClick={() => handleAddItem(list.id)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <ul className="space-y-2">
                {list.items.map(item => (
                  <ListItem
                    key={item.id}
                    item={item}
                    onToggleComplete={() => handleToggleComplete(list.id, item.id)}
                    onDeleteItem={() => handleDeleteItem(list.id, item.id)}
                  />
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}