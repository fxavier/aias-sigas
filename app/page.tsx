'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Calendar, Users, AlertTriangle } from 'lucide-react';

const metrics = [
	{
		title: 'Total Departments',
		value: '12',
		icon: Users,
		change: '+2 this month',
	},
	{
		title: 'Active Programs',
		value: '24',
		icon: Calendar,
		change: '4 starting soon',
	},
	{
		title: 'Risk Incidents',
		value: '3',
		icon: AlertTriangle,
		change: '-2 from last month',
	},
	{
		title: 'Performance Score',
		value: '92%',
		icon: BarChart,
		change: '+5% increase',
	},
];

const recentActivities = [
	{ id: 1, title: 'Emergency Response Plan Updated', time: '2 hours ago' },
	{ id: 2, title: 'New Department Policy Added', time: '5 hours ago' },
	{ id: 3, title: 'Risk Assessment Completed', time: '1 day ago' },
];

export default function Dashboard() {
	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold'>Dashboard</h1>
				<p className='text-muted-foreground'>
					Welcome to your management dashboard
				</p>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
				{metrics.map((metric) => {
					const Icon = metric.icon;
					return (
						<Card key={metric.title} className='p-6'>
							<div className='flex items-center justify-between'>
								<div className='h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center'>
									<Icon className='h-6 w-6 text-primary' />
								</div>
							</div>
							<div className='mt-4'>
								<p className='text-sm text-muted-foreground'>{metric.title}</p>
								<p className='text-2xl font-bold'>{metric.value}</p>
								<p className='text-sm text-muted-foreground mt-1'>
									{metric.change}
								</p>
							</div>
						</Card>
					);
				})}
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				<Card className='p-6'>
					<h2 className='text-lg font-semibold mb-4'>Recent Activities</h2>
					<div className='space-y-4'>
						{recentActivities.map((activity) => (
							<div
								key={activity.id}
								className='flex items-center justify-between'
							>
								<p className='text-sm'>{activity.title}</p>
								<span className='text-sm text-muted-foreground'>
									{activity.time}
								</span>
							</div>
						))}
					</div>
				</Card>

				<Card className='p-6'>
					<h2 className='text-lg font-semibold mb-4'>Quick Actions</h2>
					<div className='grid grid-cols-2 gap-4'>
						<Button variant='outline'>View Reports</Button>
						<Button variant='outline'>Manage Programs</Button>
						<Button variant='outline'>Update Policies</Button>
						<Button variant='outline'>Emergency Contacts</Button>
					</div>
				</Card>
			</div>
		</div>
	);
}
