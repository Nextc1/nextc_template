
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../utils/supabase';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { IconBrandGoogle } from "@tabler/icons-react";
import Loading from '@/components/Loader';



export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resetPassword, setResetPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                router.push('/');
            }
        };
        checkUser();
    }, [router]);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
            } else {
                // Wait for a moment to ensure the sign-in process completes
                await new Promise(resolve => setTimeout(resolve, 1000));
                // Use router.replace to refresh the home page
                router.replace('/');
                window.location.reload();

            }
        } catch (error) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
            });

            if (error) {
                setError(error.message);
            } else {
                // Wait for a moment to ensure the sign-in process completes
                await new Promise(resolve => setTimeout(resolve, 1000));
                // Use router.replace to refresh the home page
                router.replace('/');
            }
        } catch (error) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
                redirectTo: 'http://localhost:3000/api/auth/update-password', // Update this URL to your password update page
            });

            if (error) {
                setError(error.message);
            } else {
                setError('Password reset email sent. Please check your inbox.');
                setResetPassword(false); // Redirect back to sign in form
            }
        } catch (error) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <div className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
                    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-6">Sign In</h2>
                        {error && <div className="mb-4 text-red-500">{error}</div>}

                        {!resetPassword ? (
                            <>
                                <form onSubmit={handleSignIn} className="space-y-4">
                                    <div>
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="example@domain.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="w-full">
                                        Sign In
                                    </button>
                                </form>
                                <button
                                    onClick={handleGoogleSignIn}
                                    className="w-full mt-4 bg-red-500 text-white"
                                >
                                    <IconBrandGoogle className="h-5 w-5 inline mr-2" />
                                    Sign In with Google
                                </button>
                                <div className="mt-4 text-center">
                                    <p className="text-sm text-gray-600">
                                        Don't have an account?{' '}
                                        <a
                                            href="/api/auth/signup"
                                            className="text-blue-500 font-medium hover:underline"
                                        >
                                            Sign Up
                                        </a>
                                    </p>
                                    <button
                                        onClick={() => setResetPassword(true)}
                                        className="text-blue-500 font-medium hover:underline mt-4"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                            </>
                        ) : (
                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <div>
                                    <Label htmlFor="reset-email">Email Address</Label>
                                    <Input
                                        id="reset-email"
                                        type="email"
                                        placeholder="example@domain.com"
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="w-full">
                                    Send Password Reset Email
                                </button>
                                <button
                                    onClick={() => setResetPassword(false)}
                                    className="w-full mt-4 text-blue-500 font-medium hover:underline"
                                >
                                    Back to Sign In
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
