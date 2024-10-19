export interface ShoppingItem {
    id: number;
    name: string;
    completed: boolean;
  }
  
  export interface ShoppingList {
    id: number;
    name: string;
    items: ShoppingItem[];
    isPublic: boolean;
    createdAt: string;
  }
  
  export interface SharePermissions {
    canEdit: boolean;
    canDelete: boolean;
    canShare: boolean;
  }