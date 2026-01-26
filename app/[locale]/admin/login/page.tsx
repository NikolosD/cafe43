'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function AdminLogin() {
    const router = useRouter();
    const supabase = createClient();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        console.log('Attempting login with:', email);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        console.log('Supabase response:', { data, error });

        if (error) {
            console.error('Login error:', error.message);
            setError(error.message);
            setLoading(false);
        } else {
            // The original instruction had a malformed line: console.log('Login            if (error) throw error;
            // Assuming the intent was to add a new console log and potentially a check for a different 'error' if it existed.
            // However, within this 'else' block, the 'error' from signInWithPassword is null.
            // The most faithful interpretation of the instruction "Add a console log when login is successful to verify session"
            // and the provided code snippet's new log is to replace the old log with the new one.
            console.log("Login successful, session created");
            router.push('/admin/categories');
            router.refresh();
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4">
            <Card className="w-full max-w-md shadow-2xl border-white/20 bg-white/80 backdrop-blur-xl">
                <CardHeader className="space-y-1 text-center pb-2">
                    <CardTitle className="text-2xl font-bold tracking-tight">Admin Portal</CardTitle>
                    <CardDescription>Enter your credentials to manage the menu</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-11 bg-white/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-11 bg-white/50"
                            />
                        </div>

                        {error && (
                            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md font-medium text-center animate-in fade-in slide-in-from-top-1">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full h-11 text-base shadow-lg hover:shadow-xl transition-all" disabled={loading}>
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </Button>
                    </form>

                    <div className="text-xs text-center text-muted-foreground pt-4 border-t">
                        Secure access for Cafe 43 staff only
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
