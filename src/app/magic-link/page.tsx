'use client'
import { AlertCircle } from "lucide-react"
import { useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import Link from 'next/link'
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/components/ui/alert'
import { Label } from '@/components/ui/label'

export default function MagicLinkPage() {
    const [email, setEmail] = useState('')
    const { signInWithOtp } = useAuth()
    const [error, setError] = useState<string>('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await signInWithOtp(email)
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'Erro ao criar conta')
            } else {
                setError('Erro ao criar conta')
            }
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <Card className="w-[400px]">
                <CardHeader>
                    <h2 className="text-center text-3xl font-bold tracking-tight">
                        Acesso rápido</h2>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="phone">
                                Email
                            </Label>
                            <Input
                                type="email"
                                placeholder="email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? 'Autenticando...' : 'Acessar'}
                        </Button>
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center text-sm">
                    Ainda não tem uma conta?{' '}
                    <Link href="/register" className="ml-1 text-blue-600 hover:text-blue-500">
                        Nova conta
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}