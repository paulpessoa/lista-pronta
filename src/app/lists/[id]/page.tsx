"use client";
// app/lists/[id]/page.tsx
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useShoppingLists } from '@/hooks/useShoppingLists';
import { ListItem } from '@/components/shopping/list-item';
import { useAuth } from '@/components/providers/AuthProvider';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ListProps {
    params: { id: string };
}

export default function ListPage({ params }: ListProps) {
    const { user } = useAuth()
    const { id } = params;

    const [list, setList] = useState<any>(null);
    const [newItem, setNewItem] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const { addItem } = useShoppingLists();

    // Fetch list and items
    // Carregar a lista e os itens associados
    useEffect(() => {
        const fetchListAndItems = async () => {
            setLoading(true);
            if (user) {
                // Buscar a lista e seus itens relacionados do Supabase
                const { data, error } = await supabase
                    .from('lists')
                    .select(
                        `id, name, created_at, items: list_items (*, list_id)`
                    )
                    .eq('id', id)
                    .eq('owner_id', user.id)
                    .maybeSingle();

                if (error) {
                    setError(error);
                } else {
                    setList(data); // Armazena a lista no estado
                }
            }
            setLoading(false);
        };

        fetchListAndItems();
    }, [id, user]);

    // Add a new item
    const handleAddItem = async () => {
        await addItem(id, newItem);
        setNewItem(''); // Clear input after adding item

        // Refetch the list to get updated items
        const { data } = await supabase
            .from('lists')
            .select('*, items(*)')
            .eq('id', id)
            .single();

        setList(data); // Update the list with the new items
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="max-w-4xl mx-auto p-4 min-h-[80vh]">

            <div className="space-y-4">
                <Card >
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle >{list?.name}</CardTitle>

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
                                    // addItem(list.id, newItem);
                                    handleAddItem()
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

            </div>
        </div>
    );
}
