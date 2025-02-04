'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchUser } from '@/lib/redux/features/authSlice';
import Footer from '@/components/layout/Footer';

import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const dispatch = useAppDispatch();
	const { user, isLoading } = useAppSelector((state) => state.auth);
	const router = useRouter();

	useEffect(() => {
		const initAuth = async () => {
			try {
				await dispatch(fetchUser()).unwrap();
			} catch {
				router.push('/auth');
			}
		};

		initAuth();
	}, [dispatch, router]);

	if (isLoading) {
		return (
			<div className='h-screen w-full flex items-center justify-center'>
				<Loader2 className='h-8 w-8 animate-spin' />
			</div>
		);
	}

	if (!user) {
		return null;
	}

	return (
		<div className='flex h-screen'>
			<Sidebar />
			<div className='flex-1 flex flex-col'>
				<Header />
				<main className='flex-1 overflow-y-auto bg-muted/10 p-6'>
					{children}
				</main>
				<Footer />
			</div>
		</div>
	);
}
