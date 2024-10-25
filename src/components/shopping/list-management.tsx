/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {

} from '@/components/ui/dropdown-menu';
import { Pencil, Trash2, LockIcon, UnlockIcon } from 'lucide-react';

interface Props {
    list: {
        id: string;
        name: string;
    };
    onUpdate: (list: any) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

const ListManagement = ({ list, onUpdate, onDelete }: Props) => {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [name, setName] = useState(list?.name || '');
    const [isPublic, setIsPublic] = useState(false);

    const handleSave = async () => {
        try {
            await onUpdate({
                id: list.id,
                name,
            });
            setIsEditDialogOpen(false);
        } catch (error) {
            console.error('Error updating list:', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Tem certeza que deseja deletar esta lista?')) {
            try {
                await onDelete(list.id);
                setIsEditDialogOpen(false);
            } catch (error) {
                console.error('Error deleting list:', error);
            }
        }
    };

    return (



        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                >
                    {<Pencil className="w-4 h-4" />}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className='flex flex-row items-center '>
                    <DialogTitle>Editar Lista</DialogTitle>
                    <div className='flex flex-row items-center space-x-2'>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setIsPublic(!isPublic)}>
                            {isPublic ?
                                <LockIcon className="w-4 h-4" />
                                :
                                <UnlockIcon className="w-4 h-4" />
                            }
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleDelete} className="text-red-600">
                            <Trash2 className="w-4 h-4" />

                        </Button>

                    </div>


                </DialogHeader>
                <div className="space-y-4">
                    <Input
                        className="w-full"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Digite o nome da lista"
                    />
                    <Button onClick={handleSave} className="w-full">
                        Salvar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>


    );
};

export default ListManagement;