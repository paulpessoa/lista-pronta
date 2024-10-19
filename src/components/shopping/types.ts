export type ShoppingItem = {
    id: number;
    name: string;
    completed: boolean;
  }
  
  export type ShoppingList = {
    id: number;
    name: string;
    items: ShoppingItem[];
    isPublic: boolean;
    createdAt: string;
  }
  
  export type SharePermissions = {
    canEdit: boolean;
    canDelete: boolean;
    canShare: boolean;
  }