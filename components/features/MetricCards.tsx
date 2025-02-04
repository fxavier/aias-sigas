'use client';

import {
	ArrowUpRight,
	ArrowDownRight,
	DollarSign,
	Percent,
} from 'lucide-react';
import { Card } from '@/components/ui/card';

const metrics = [
	{
		title: 'Total Balance',
		value: '$24,563.00',
		change: '+14.5%',
		trend: 'up',
		icon: DollarSign,
	},
	{
		title: 'Total Savings',
		value: '$12,345.00',
		change: '+8.2%',
		trend: 'up',
		icon: DollarSign,
	},
	{
		title: 'Total Expenses',
		value: '$4,567.00',
		change: '-2.4%',
		trend: 'down',
		icon: DollarSign,
	},
	{
		title: 'Investment Returns',
		value: '18.2%',
		change: '+5.1%',
		trend: 'up',
		icon: Percent,
	},
];

export function MetricCards() {
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
			{metrics.map((metric) => {
				const Icon = metric.icon;
				const TrendIcon = metric.trend === 'up' ? ArrowUpRight : ArrowDownRight;
				const trendColor =
					metric.trend === 'up' ? 'text-green-500' : 'text-red-500';

				return (
					<Card key={metric.title} className='p-6'>
						<div className='flex items-center justify-between'>
							<div className='h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center'>
								<Icon className='h-6 w-6 text-primary' />
							</div>
							<div className={`flex items-center gap-1 text-sm ${trendColor}`}>
								{metric.change}
								<TrendIcon className='h-4 w-4' />
							</div>
						</div>
						<div className='mt-4'>
							<p className='text-sm text-muted-foreground'>{metric.title}</p>
							<p className='text-2xl font-bold'>{metric.value}</p>
						</div>
					</Card>
				);
			})}
		</div>
	);
}
