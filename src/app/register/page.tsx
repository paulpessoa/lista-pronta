// app/register/page.tsx
'use client'
import { useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'

interface FormData {
    email: string
    password: string
    confirmPassword: string
    phone?: string
}

export default function RegisterPage() {
    const router = useRouter()
    const { signUp } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string>('')

    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const validateForm = () => {
        if (!formData.email || !formData.password) {
            setError('Email e senha são obrigatórios')
            return false
        }

        if (!formData.email.includes('@')) {
            setError('Email inválido')
            return false
        }

        if (formData.password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres')
            return false
        }

        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem')
            return false
        }

        if (formData.phone && !/^\+?\d{10,}$/.test(formData.phone)) {
            setError('Número de telefone inválido')
            return false
        }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!validateForm()) {
            return
        }

        try {
            setLoading(true)
            // Criando objeto com dados opcionais do telefone
            const userData = {
                email: formData.email,
                password: formData.password,
                phone: formData.phone || undefined,
                options: {
                    data: {
                        phone: formData.phone || null
                    }
                }
            }

            await signUp(userData.email, userData.password)

            // Redireciona para página de verificação ou login
            router.push('/verify-email')
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'Erro ao criar conta')
            } else {
                setError('Erro ao criar conta')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <h2 className="text-center text-3xl font-bold tracking-tight">
                        Criar nova conta
                    </h2>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="seu@email.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="******"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="******"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">
                                Telefone (opcional)
                            </Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+55 (11) 98765-4321"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? 'Criando conta...' : 'Criar conta'}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex justify-center text-sm">
                    Já tem uma conta?{' '}
                    <Link href="/login" className="ml-1 text-blue-600 hover:text-blue-500">
                        Faça login
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
