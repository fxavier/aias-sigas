'use client';

import { Bell, Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function Header() {
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
				<button className='flex items-center gap-2'>
					<div className='h-8 w-8 rounded-full bg-muted flex items-center justify-center'>
						<User className='h-4 w-4 text-muted-foreground' />
					</div>
				</button>
			</div>
		</header>
	);
}
