'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

interface CreateListFormProps {
  onCreateList: (name: string) => void;
}

export function CreateListForm({ onCreateList }: CreateListFormProps) {
  const [newListName, setNewListName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    onCreateList(newListName);
    setNewListName('');
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Criar Nova Lista</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="Nome da nova lista"
            className="flex-1"
          />
          <Button type="submit" className="whitespace-nowrap">
            <Plus className="w-4 h-4 mr-2" />
            Criar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}