import { useAuth } from "@/components/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import type { ShoppingList } from "@/components/shopping/types";
import { useEffect, useState } from "react";

export const useShoppingLists = () => {
  const { user } = useAuth();
  const [lists, setLists] = useState([]);
  const getLists = async () => {
    if (user) {
      try {
        const { data, error } = await supabase
          .from("lists")
          .select(`id, name, created_at, items: list_items (*, list_id)`); // No .maybeSingle()

        if (error) {
          console.error("Error fetching lists:", error);
          // Handle error appropriately (e.g., display an error message to the user)
        } else {
          return data as ShoppingList[];
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        // Handle unexpected errors
      }
    }
  };

  // Criar a lista
  const createList = async (listName: string) => {
    if (!user) return { success: false, error: "Usuário não autenticado" };

    // Insere uma nova lista no banco de dados
    const { data, error } = await supabase
      .from("lists")
      .insert([{ name: listName, owner_id: user.id }])
      .select();

    if (error) {
      console.error("Erro ao criar lista:", error);
      return { success: false, error: error.message };
    }

    getLists();

    return { success: true, data: data[0] };
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

    await getLists();
  };

  // Obter itens da lista
  const getListItems = async (listId: string) => {
    const { data: listItems, error } = await supabase
      .from("list_items")
      .select("*")
      .eq("list_id", listId);

    if (error) {
      console.error("Erro ao carregar itens da lista:", error);
      return;
    }

    // Atualizar o estado local com os itens da lista
    getLists();

    return listItems;
  };

  // Alternar item completo
  const toggleItemChecked = async (
    list_id: string,
    id: string,
    value: boolean
  ) => {
    if (!id) return;

    const { error } = await supabase
      .from("list_items")
      .update({ checked: value })
      .eq("id", id)
      .eq("list_id", list_id)
      .select();

    if (error) {
      console.error("Erro ao alternar item:", error);
      return;
    }

    // Atualizar o estado local
    getLists();
  };

  // Deletar item
  const deleteItem = async (id: string) => {
    const { error } = await supabase.from("list_items").delete().eq("id", id);

    if (error) {
      console.error("Erro ao deletar item:", error);
      return;
    }
  };

  // Deletar lista
  const deleteList = async (listId: string) => {
    const { error } = await supabase.from("lists").delete().eq("id", listId);

    if (error) {
      console.error("Erro ao deletar lista:", error);
      return;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lista = await getLists();
        setLists(lista);
      } catch (error) {
        console.error("Erro ao buscar listas:", error);
      }
    };
    fetchData();
  }, []);

  return {
    lists,
    createList,
    getListItems,
    addItem,
    toggleItemChecked,
    deleteItem,
    deleteList,
    getLists,
  };
};
