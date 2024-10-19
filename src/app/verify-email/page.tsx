// app/verify-email/page.tsx
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import Link from 'next/link'

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <Card className="max-w-md w-full">
                <CardHeader>
                    <h2 className="text-2xl font-bold text-center">Verifique seu email</h2>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-gray-600">
                        Enviamos um link de verificação para seu email.
                        Por favor, verifique sua caixa de entrada e spam.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Link href="/">
                        <Button variant="outline">Voltar para página inicial</Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}