import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import type { ShoppingList } from "@/components/shopping/types";

export const useShoppingLists = () => {
  const { user } = useAuth();
  const [listsShop, setListsShop] = useState<ShoppingList[]>([]);
  const [lastChange, setLastChange] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Carregar listas iniciais
  useEffect(() => {
    const loadInitialLists = async () => {
      if (user) {
        // Carregar do Supabase se estiver logado
        const { data, error } = await supabase
          .from("lists_shopping")
          .select(
            `id, name, created_at, is_public, items: list_items (*, list_id)`
          )
          .eq("user_id", user.id);

        if (!error && data) {
          setListsShop(
            data.map((list: any) => ({ ...list, user_id: user.id }))
          );
        }
      } else {
        // Carregar do localStorage se não estiver logado
        const savedLists = localStorage.getItem("lists_shopping_local");
        if (savedLists) {
          setListsShop(JSON.parse(savedLists));
        }
      }
    };

    loadInitialLists();
  }, [user]);

  // Salvar no localStorage quando não estiver logado
  useEffect(() => {
    if (!user) {
      localStorage.setItem("list_shopping_local", JSON.stringify(listsShop));
    }
    if (listsShop.length > 0) {
      setLastChange(new Date());
    }
  }, [listsShop, user]);

  // Sincronização automática a cada 2 minutos quando houver mudanças
  useEffect(() => {
    if (!user || !lastChange) return;

    const syncInterval = setInterval(async () => {
      await handleSync();
    }, 1 * 60 * 1000); // 2 minutos

    return () => clearInterval(syncInterval);
  }, [user, lastChange]);

  const handleSync = async () => {
    if (!user || isSyncing) return;

    try {
      setIsSyncing(true);

      // Preparar dados para sincronização
      const listsWithUserId = listsShop.map((list) => ({
        ...list,
        user_id: user.id,
      }));

      // Upsert das listas
      const { error } = await supabase
        .from("lists_shopping")
        .upsert(listsWithUserId, {
          onConflict: "id",
          ignoreDuplicates: false,
        });

      if (error) throw error;

      setLastChange(null);
    } catch (error) {
      console.error("Erro na sincronização:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Criar a lista
  const createList = async (name: string) => {
    if (!user) return;

    const { data: newList, error } = await supabase
      .from("lists_shopping")
      .insert([
        {
          name,
          user_id: user?.id ? user.id : null,
          created_by: user.id,
          is_public: false,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar lista:", error);
      return;
    }

    // Adicionar a nova lista ao estado com array vazio de items
    setListsShop((prev) => [...prev, { ...newList, items: [] }]);
  };

  // Adicionar Item
  const addItem = async (listId: string, itemName: string) => {
    if (!user || !itemName.trim()) return;

    const { data: newItem, error } = await supabase
      .from("list_items")
      .insert([
        {
          list_id: listId,
          name: itemName,
          completed: false,
          created_by: user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Erro ao adicionar item:", error);
      return;
    }

    // Atualizar o estado local
    // setListsShop((prev) =>
    //   prev.map((list) =>
    //     list.id === listId ? { ...list, items: [...list.items, newItem] } : list
    //   )
    // );

    setListsShop((prev) =>
      prev.map((list) =>
        list.id === listId
          ? { ...list, items: [...(list.items ?? []), newItem] }
          : list
      )
    );
  };

  const getListItems = async (listId: string) => {
    const { data: listItems, error } = await supabase
      .from("list_items")
      .select("*")
      .eq("list_id", listId);

    if (error) {
      console.error("Erro ao carregar itens da lista:", error);
      return;
    }

    return listItems;
  };

  const toggleItemComplete = (listId: string, itemId: number) => {
    setListsShop((prev) =>
      prev.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            items: list.items.map((item) =>
              item.id === itemId
                ? { ...item, completed: !item.completed }
                : item
            ),
          };
        }
        return list;
      })
    );
  };

  const deleteItem = (listId: string, itemId: number) => {
    setListsShop((prev) =>
      prev.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            items: list.items.filter((item) => item.id !== itemId),
          };
        }
        return list;
      })
    );
  };

  const deleteList = (listId: string) => {
    setListsShop((prev) => prev.filter((list) => list.id !== listId));
  };

  const toggleListPublic = (listId: string) => {
    setListsShop((prev) =>
      prev.map((list) =>
        list.id === listId ? { ...list, isPublic: !list.is_public } : list
      )
    );
  };

  return {
    listsShop,
    isSyncing,
    createList,
    getListItems,
    addItem,
    toggleItemComplete,
    deleteItem,
    deleteList,
    toggleListPublic,
    handleSync,
  };
};
