'use client';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Share2 } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface ShareDialogProps {
  listId: number;
  listName: string;
  onShare: (email: string, permissions: SharePermissions) => void;
}

export function ShareDialog({ listId, listName, onShare }: ShareDialogProps) {
  const [email, setEmail] = useState('');
  const [permissions, setPermissions] = useState<SharePermissions>({
    canEdit: true,
    canDelete: false,
    canShare: false,
  });

  const handleShare = () => {
    if (!email.trim()) return;
    onShare(email, permissions);
    setEmail('');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Share2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Compartilhar Lista</DialogTitle>
          <DialogDescription>
            Compartilhe "{listName}" com outras pessoas
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Digite o email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Permissões</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit"
                  checked={permissions.canEdit}
                  onCheckedChange={(checked) => 
                    setPermissions(p => ({...p, canEdit: checked === true}))
                  }
                />
                <label htmlFor="edit">Pode editar itens</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="delete"
                  checked={permissions.canDelete}
                  onCheckedChange={(checked) => 
                    setPermissions(p => ({...p, canDelete: checked === true}))
                  }
                />
                <label htmlFor="delete">Pode excluir itens</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="share"
                  checked={permissions.canShare}
                  onCheckedChange={(checked) => 
                    setPermissions(p => ({...p, canShare: checked === true}))
                  }
                />
                <label htmlFor="share">Pode compartilhar</label>
              </div>
            </div>
          </div>
        </div>
        
        <Button onClick={handleShare} className="w-full">
          Compartilhar
        </Button>
      </DialogContent>
    </Dialog>
  );
}