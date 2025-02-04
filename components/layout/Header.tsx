'use client';

import { Bell, Search, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { logout } from '@/lib/redux/features/authSlice';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export function Header() {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { toast } = useToast();
	const { user } = useAppSelector((state) => state.auth);

	const handleLogout = async () => {
		try {
			await dispatch(logout()).unwrap();
			toast({
				title: 'Logged out successfully',
				description: 'You have been logged out of your account.',
			});
			router.push('/auth');
		} catch (error) {
			console.error('Logout error:', error);
			toast({
				title: 'Logout failed',
				description: 'Failed to log out. Please try again.',
				variant: 'destructive',
			});
		}
	};

	return (
		<header className='h-16 border-b flex items-center justify-between px-6 bg-white'>
			<div className='flex-1 max-w-xl'>
				<div className='relative'>
					<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
					<Input placeholder='Search...' className='pl-8' />
				</div>
			</div>
			<div className='flex items-center gap-4'>
				<button className='relative'>
					<Bell className='h-5 w-5 text-muted-foreground' />
					<span className='absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-white flex items-center justify-center'>
						3
					</span>
				</button>
				<div className='flex items-center gap-4'>
					<span className='text-sm text-muted-foreground'>{user?.email}</span>
					<Button
						variant='ghost'
						size='icon'
						onClick={handleLogout}
						title='Logout'
					>
						<LogOut className='h-4 w-4' />
					</Button>
				</div>
			</div>
		</header>
	);
}
