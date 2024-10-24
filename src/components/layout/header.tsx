"use client"
import React, { useState } from 'react';
import {
    Moon, Sun,
    NotebookTabs,
    LogOut,
    ClipboardList,
} from "lucide-react";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';



export default function Header() {
    const router = useRouter();
    const { user, signOut, loading } = useAuth();
    const [isDark, setIsDark] = useState(false);

    // Toggle dark mode by adding/removing class to html element
    const toggleDarkMode = () => {
        const html = document.documentElement;
        html.classList.toggle('dark');
        setIsDark(!isDark);
    };

    return (
        <div className="font-sans">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-8">
                    <div className="flex items-center text-2xl font-bold cursor-pointer" onClick={() => router.push("/")}>
                        <NotebookTabs className="mr-2" />
                        Lista Pronta</div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleDarkMode}
                        >
                            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        </Button>
                        {user && !loading ? (
                            <div className="flex items-center gap-2">
                                <Button variant="outline" onClick={() => router.push('/lists')}>
                                    <ClipboardList className="w-4 h-4" />
                                    Minhas Listas</Button>
                                <Button onClick={signOut} className="flex items-center gap-2" variant="ghost">
                                    <LogOut className="w-4 h-4" />
                                    Sair
                                </Button>
                            </div>
                        ) : (
                            <div className='flex justify-end items-center gap-2'>
                                <Button variant="outline" onClick={() => router.push('/magic-link')} className="flex items-center gap-2">
                                    <LogIn className="w-4 h-4" />
                                    Acesso Rápido
                                </Button>
                                <Button onClick={() => router.push('/login')} className="flex items-center gap-2">
                                    <LogIn className="w-4 h-4" />
                                    Login
                                </Button>
                            </div>
                        )}


                    </div>
                </div>
            </header>
        </div>
    );
}




