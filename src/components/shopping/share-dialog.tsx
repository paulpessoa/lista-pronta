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
import { SharePermissions } from './types';

interface ShareDialogProps {
  listId: string;
  listName: string;
  onShare: (email: string, permissions: SharePermissions) => void;
}

export function ShareDialog({ listId, listName, onShare }: ShareDialogProps) {
  console.log('ShareDialogProps', listId, listName, onShare);
  const [email, setEmail] = useState('');
  const [permissions, setPermissions] = useState<SharePermissions>({
    can_edit: true,
    can_delete: false,
    can_share: false,
    can_comment: false,
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
            Compartilhe {`"${listName}"`} com outras pessoas
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
                  checked={permissions.can_edit}
                  onCheckedChange={(checked) =>
                    setPermissions(p => ({ ...p, can_edit: checked === true }))
                  }
                />
                <label htmlFor="edit">Pode editar itens</label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="delete"
                  checked={permissions.can_delete}
                  onCheckedChange={(checked) =>
                    setPermissions(p => ({ ...p, can_delete: checked === true }))
                  }
                />
                <label htmlFor="delete">Pode excluir itens</label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="share"
                  checked={permissions.can_share}
                  onCheckedChange={(checked) =>
                    setPermissions(p => ({ ...p, can_share: checked === false }))
                  }
                />
                <label htmlFor="share">Pode compartilhar</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="comment"
                  checked={permissions.can_comment}
                  onCheckedChange={(checked) =>
                    setPermissions(p => ({ ...p, can_comment: checked === true }))
                  }
                />
                <label htmlFor="comment">Pode comentar</label>
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