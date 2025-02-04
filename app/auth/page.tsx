'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { login, register } from '@/lib/redux/features/authSlice';
import { supabase } from '@/lib/supabase/supabaseClient';

export default function Auth() {
	const [isLogin, setIsLogin] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { toast } = useToast();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	// If already logged in, redirect to dashboard.
	useEffect(() => {
		async function checkSession() {
			const session = await supabase.auth.getSession();
			if (session) {
				router.push('/dashboard');
			}
		}
		checkSession();
	}, [router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			setIsLoading(true);
			if (isLogin) {
				await dispatch(login({ email, password })).unwrap();
				toast({
					title: 'Login successful',
					description: 'Welcome back!',
				});
				router.push('/dashboard');
			} else {
				await dispatch(register({ email, password })).unwrap();
				toast({
					title: 'Registration successful',
					description: 'Your account has been created.',
				});
				router.push('/dashboard');
			}
		} catch (error) {
			console.error('Auth error:', error);
			setErrorMessage(
				error instanceof Error ? error.message : 'An error occurred'
			);
			toast({
				title: isLogin ? 'Login failed' : 'Registration failed',
				description: errorMessage,
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-muted/10 p-6'>
			<Card className='w-full max-w-md p-6 space-y-6'>
				<div className='text-center'>
					<h1 className='text-2xl font-bold'>
						{isLogin ? 'Login' : 'Create Account'}
					</h1>
					<p className='text-muted-foreground'>
						{isLogin
							? 'Welcome back! Please login to your account.'
							: 'Create a new account to get started.'}
					</p>
				</div>

				{errorMessage && <p className='text-red-500'>{errorMessage}</p>}

				<form onSubmit={handleSubmit} className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='email'>Email</Label>
						<Input
							id='email'
							type='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div className='space-y-2'>
						<Label htmlFor='password'>Password</Label>
						<Input
							id='password'
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					<Button type='submit' className='w-full' disabled={isLoading}>
						{isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
						{isLogin ? 'Login' : 'Register'}
					</Button>
				</form>

				<div className='text-center'>
					<Button
						variant='link'
						onClick={() => setIsLogin(!isLogin)}
						className='text-sm'
					>
						{isLogin
							? "Don't have an account? Register"
							: 'Already have an account? Login'}
					</Button>
				</div>
			</Card>
		</div>
	);
}
