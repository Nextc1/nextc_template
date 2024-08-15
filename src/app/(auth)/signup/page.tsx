
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../utils/supabase';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/cn';
import { IconBrandGoogle } from "@tabler/icons-react";

const SignUp = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        country: '',
        password: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const { firstName, lastName, phoneNumber, email, country, password } = formData;

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        phone_number: phoneNumber,
                        country: country
                    }
                }
            });

            if (error) {
                if (error.message.includes('Email rate limit exceeded')) {
                    setError('Too many sign-up attempts. Please try again later.');
                } else {
                    setError('An error occurred during sign-up. Please try again.');
                }
                console.error(error);
            } else {
                const user = data.user;
                if (user) {
                    // Insert user details into the users table
                    const { error: insertError } = await supabase
                        .from('users')
                        .insert({
                            id: user.id,
                            first_name: firstName,
                            last_name: lastName,
                            phone_number: phoneNumber,
                            email: email,
                            country: country
                        });

                    if (insertError) {
                        setError('An error occurred while saving user details. Please try again.');
                        console.error(insertError);
                        // add check ur mail and confirm ------------------------------------------------------
                    } else if (data.session) {
                        localStorage.setItem('access_token', data.session.access_token);
                        router.push('/');
                    }
                }
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
            });

            if (error) {
                throw error;
            }

            supabase.auth.onAuthStateChange(async (event, session) => {
                if (event === 'SIGNED_IN' && session) {
                    const user = session.user;
                    console.log('User Metadata:', user.user_metadata);
                    
                    // Insert or update user details in the users table
                    const { error: insertError } = await supabase
                        .from('users')
                        .upsert({
                            id: user.id,
                            first_name: user.user_metadata?.first_name || '',
                            last_name: user.user_metadata?.last_name || '',
                            email: user.email,
                            profile_picture_url: user.user_metadata?.picture || ''
                        });
            
                    if (insertError) {
                        setError('An error occurred while saving user details. Please try again.');
                        console.error(insertError);
                    } else {
                        localStorage.setItem('access_token', session.access_token);
                        router.push('/');
                    }
                }
            });
            
        } catch (err) {
            setError('An unexpected error occurred. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    // const handleGoogleSignIn = async () => {
    //     setLoading(true);
    //     try {
    //         // Trigger Google OAuth sign-in
    //         const { error } = await supabase.auth.signInWithOAuth({
    //             provider: 'google',
    //         });

    //         if (error) {
    //             throw error;
    //         }

    //         // Handle authentication state change
    //         supabase.auth.onAuthStateChange(async (event, session) => {
    //             if (event === 'SIGNED_IN' && session) {
    //                 const user = session.user;

    //                 // Log the user ID
    //                 console.log( user.id);

    //                 // Insert or update user details in the users table
    //                 const { error: insertError } = await supabase
    //                     .from('users')
    //                     .upsert({
    //                         id: user.id,
    //                         first_name: user.user_metadata?.first_name || '',
    //                         last_name: user.user_metadata?.last_name || '',
    //                         email: user.email,
    //                         country: user.user_metadata?.country || ''
    //                     });

    //                 if (insertError) {
    //                     setError('An error occurred while saving user details. Please try again.');
    //                     console.error(insertError);
    //                 } else {
    //                     localStorage.setItem('access_token', session.access_token);
    //                     router.push('/');
    //                 }
    //             }
    //         });
    //     } catch (err) {
    //         setError('An unexpected error occurred. Please try again later.');
    //         console.error(err);
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    const navigateToSignIn = () => {
        router.push('/api/auth/signin');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-8">
            <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input glass dark:bg-black">
                <h2 className="font-bold text-xl text-gray-200 dark:text-neutral-200 mb-6">
                    Sign Up To Next-Carbon
                </h2>

                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form className="my-8" onSubmit={handleSignUp}>
                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                        <LabelInputContainer>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Tyler"
                                type="text"
                                required
                            />
                        </LabelInputContainer>
                        <LabelInputContainer>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Durden"
                                type="text"
                                required
                            />
                        </LabelInputContainer>
                    </div>
                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                        <LabelInputContainer>
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="123-456-7890"
                                type="tel"
                                required
                            />
                        </LabelInputContainer>
                        <LabelInputContainer>
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="projectmayhem@fc.com"
                                type="email"
                                required
                            />
                        </LabelInputContainer>
                    </div>
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="country">Country</Label>
                        <Input
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            placeholder="Country"
                            type="text"
                            required
                        />
                    </LabelInputContainer>
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            type="password"
                            required
                        />
                    </LabelInputContainer>
                    <button
                        className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Signing Up...' : 'Sign Up'} &rarr;
                        <BottomGradient />
                    </button>
                </form>
                <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
                <div className="flex flex-col space-y-4">
                    <button
                        onClick={handleGoogleSignIn}
                        className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                        disabled={loading}
                    >
                        <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                            {loading ? 'Signing In...' : 'Sign Up with Google'}
                        </span>
                        <BottomGradient />
                    </button>
                    <button
                        onClick={navigateToSignIn}
                        className="relative group/btn flex space-x-2 items-center justify-center px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                    >
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                            Already have an account? Sign In
                        </span>
                        <BottomGradient />
                    </button>
                </div>
            </div>
        </div>
    );
};

const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </>
    );
};

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    );
};

export default SignUp;

