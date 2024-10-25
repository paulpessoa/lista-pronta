import { useEffect, useState } from "react";
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
          .from("lists")
          .select("*")

        if (error) {
          console.log("ERRO", error);
        }
        if (data) {
          console.log("data", data);
          setListsShop(data);
        }
      
      }
    };

    loadInitialLists();
  }, [user]);

  // Criar a lista
  const createList = async (listName: string) => {
    // Obtém o usuário logado
    const { data: user, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("Erro ao obter usuário:", userError);
      return { success: false, error: userError.message };
    }

    // Insere uma nova lista no banco de dados
    const { data, error } = await supabase
      .from("lists")
      .insert([{ name: listName, owner_id: user.user.id }]);

    if (error) {
      console.error("Erro ao criar lista:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
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
          checked: false,
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

  const toggleItemComplete = (listId: string, itemId: string) => {
    setListsShop((prev) =>
      prev.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            items: (list?.items || []).map((item) =>
              item.id === itemId
                ? { ...item, checked: !item.checked }
                : item
            ),
          };
        }
        return list;
      })
    );
  };

  const deleteItem = (listId: string, itemId: string) => {
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
