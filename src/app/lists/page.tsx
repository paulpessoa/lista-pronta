"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingList } from '@/components/shopping/shopping-list';
import { useAuth } from '@/components/providers/AuthProvider';

export default function ListsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    const checkUser = async () => {
      if (!user) {
        router.push('/login');
      }
    };
    checkUser();
  }, [router, user]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return <ShoppingList />;
}
