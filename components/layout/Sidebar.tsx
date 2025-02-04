'use client';

import {
	LayoutDashboard,
	FileText,
	AlertTriangle,
	Building2,
	MessageSquareWarning,
	Users,
	FolderKanban,
	BarChart2,
	BookOpen,
	ShieldAlert,
	Menu,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const navigation = [
	{ name: 'Dashboard', href: '/', icon: LayoutDashboard },
	{ name: 'Department', href: '/department', icon: Building2 },
	{ name: 'Documents', href: '/documents', icon: FileText },
	{ name: 'Emergency', href: '/emergency', icon: AlertTriangle },
	{ name: 'Grievance', href: '/grievance', icon: MessageSquareWarning },
	{ name: 'Org Capacity', href: '/org-capacity', icon: Users },
	{ name: 'Programs', href: '/programs', icon: FolderKanban },
	{ name: 'Reports', href: '/reports', icon: BarChart2 },
	{ name: 'Resources', href: '/resources', icon: BookOpen },
	{ name: 'Risk Management', href: '/risk-management', icon: ShieldAlert },
];

export function Sidebar() {
	const pathname = usePathname();
	const [isCollapsed, setIsCollapsed] = useState(false);

	return (
		<div
			className={cn(
				'border-r bg-white h-screen flex flex-col transition-all duration-300',
				isCollapsed ? 'w-[4.5rem]' : 'w-60'
			)}
		>
			<div
				className={cn(
					'p-6 flex items-center',
					isCollapsed ? 'justify-center' : 'justify-between'
				)}
			>
				{!isCollapsed && <h1 className='text-2xl font-bold'>SGAS</h1>}
				<Button
					variant='ghost'
					size='icon'
					onClick={() => setIsCollapsed(!isCollapsed)}
					className='h-8 w-8'
				>
					<Menu className='h-4 w-4' />
				</Button>
			</div>
			<nav className='flex-1'>
				<ul className={cn('space-y-2', isCollapsed ? 'px-2' : 'px-4')}>
					{navigation.map((item) => {
						const Icon = item.icon;
						return (
							<li key={item.name}>
								<Link
									href={item.href}
									className={cn(
										'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative group',
										pathname === item.href
											? 'bg-primary text-primary-foreground'
											: 'hover:bg-muted'
									)}
								>
									<Icon className='h-4 w-4 flex-shrink-0' />
									{!isCollapsed && item.name}
									{isCollapsed && (
										<div className='absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50'>
											{item.name}
										</div>
									)}
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>
		</div>
	);
}
