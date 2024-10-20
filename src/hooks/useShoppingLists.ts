import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import type { ShoppingList } from "@/components/shopping/types";

export const useShoppingLists = () => {
  const { user } = useAuth();
  const [listsShop, setListsShop] = useState<ShoppingList[]>([]);

  // Carregar listas iniciais
  useEffect(() => {
    const loadInitialLists = async () => {
      if (user) {
        // Carregar listas próprias e compartilhadas
        const { data, error } = await supabase
          .from("lists_shopping")
          .select(
            `
            id, 
            name, 
            created_at, 
            is_public,
            user_id,
            items: list_items (*)
          `
          )
          .or(`user_id.eq.${user.id},is_public.eq.true`);

        if (!error && data) {
          // Organiza as listas em próprias e compartilhadas
          const ownLists = data.filter((list) => list.user_id === user.id);
          const sharedLists = data.filter(
            (list) => list.user_id !== user.id && list.is_public
          );

          setListsShop([...ownLists, ...sharedLists]);
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
  }, [listsShop, user]);

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
            items: (list?.items || []).map((item) =>
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
            items: (list?.items || []).filter((item) => item.id !== itemId),
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
    createList,
    getListItems,
    addItem,
    toggleItemComplete,
    deleteItem,
    deleteList,
    toggleListPublic,
  };
};
