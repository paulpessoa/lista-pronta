"use client"

import React, { useState, useEffect } from 'react';
import { LogIn, Share2, Lock, Unlock, Plus, Trash2, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { Alert, AlertDescription } from '@/components/ui/alert';

const ShoppingList = () => {
  const [lists, setLists] = useState(() => {
    const savedLists = window.localStorage.getItem('shopping-lists');
    return savedLists ? JSON.parse(savedLists) : [];
  });
  const [newListName, setNewListName] = useState('');
  const [newItem, setNewItem] = useState('');
  const [selectedList, setSelectedList] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    localStorage.setItem('shopping-lists', JSON.stringify(lists));
  }, [lists]);

  const createList = () => {
    if (!newListName.trim()) return;
    const newList = {
      id: Date.now(),
      name: newListName,
      items: [],
      isPublic: false,
      createdAt: new Date().toISOString()
    };
    setLists([...lists, newList]);
    setNewListName('');
  };

  const addItem = (listId) => {
    if (!newItem.trim()) return;
    setLists(lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          items: [...list.items, { id: Date.now(), name: newItem, completed: false }]
        };
      }
      return list;
    }));
    setNewItem('');
  };

  const toggleItemComplete = (listId, itemId) => {
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

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Prio List</h1>
        {!isAuthenticated && (
          <Button onClick={() => setIsAuthenticated(true)} className="flex items-center gap-2">
            <LogIn className="w-4 h-4" />
            Login
          </Button>
        )}
      </div>

      {/* Create New List */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Criar Nova Lista</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="Nome da nova lista"
            />
            <Button onClick={createList}>
              <Plus className="w-4 h-4 mr-2" />
              Criar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lists */}
      <div className="space-y-4">
        {lists.map(list => (
          <Card key={list.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{list.name}</CardTitle>
                <div className="flex gap-2">
                  {isAuthenticated && (
                    <>
                      <Button variant="outline" size="icon">
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setLists(lists.map(l =>
                            l.id === list.id ? { ...l, isPublic: !l.isPublic } : l
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
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Add Item Form */}
              <div className="flex gap-2 mb-4">
                <Input
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="Adicionar item"
                />
                <Button onClick={() => addItem(list.id)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Items List */}
              <ul className="space-y-2">
                {list.items.map(item => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        title='Marcar como concluído'
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleItemComplete(list.id, item.id)}
                        className="w-4 h-4"
                      />
                      <span className={item.completed ? 'line-through text-gray-500' : ''}>
                        {item.name}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ShoppingList;