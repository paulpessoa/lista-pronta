"use client"
// app/lists/[id]/page.tsx
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface ListProps {
    params: { id: string };
}

export default function ListPage({ params }: ListProps) {
    const { id } = params;
    const [list, setList] = useState<any>(null);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        const fetchList = async () => {
            const { data, error } = await supabase
                .from('lists')
                .select('*')
                .eq('id', id)
                .single(); // Assuming you fetch one record by ID

            if (error) {
                setError(error);
            } else {
                setList(data);
            }
        };

        fetchList();
    }, [id]);

    if (error) return <div>Error: {error.message}</div>;
    if (!list) return <div>Loading...</div>;

    return (
        <div>
            <h1>List ID: {list.id}</h1>
            <p>{list.name}</p>
        </div>
    );
}
