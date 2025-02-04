'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Mail, Phone, Building2 } from 'lucide-react';

const departments = [
	{
		id: 1,
		name: 'Human Resources',
		head: 'John Smith',
		employees: 15,
		location: 'Floor 2, Wing A',
		contact: 'hr@company.com',
	},
	{
		id: 2,
		name: 'Operations',
		head: 'Sarah Johnson',
		employees: 25,
		location: 'Floor 3, Wing B',
		contact: 'operations@company.com',
	},
	{
		id: 3,
		name: 'Finance',
		head: 'Michael Brown',
		employees: 12,
		location: 'Floor 2, Wing B',
		contact: 'finance@company.com',
	},
];

export default function Department() {
	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold'>Departments</h1>
				<p className='text-muted-foreground'>
					Overview of all departments and their details
				</p>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{departments.map((dept) => (
					<Card key={dept.id} className='p-6'>
						<div className='flex items-center gap-4 mb-4'>
							<div className='h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center'>
								<Building2 className='h-6 w-6 text-primary' />
							</div>
							<div>
								<h2 className='font-semibold'>{dept.name}</h2>
								<p className='text-sm text-muted-foreground'>
									Managed by {dept.head}
								</p>
							</div>
						</div>

						<div className='space-y-4'>
							<div className='flex items-center gap-2 text-sm'>
								<Users className='h-4 w-4 text-muted-foreground' />
								<span>{dept.employees} Employees</span>
							</div>
							<div className='flex items-center gap-2 text-sm'>
								<Building2 className='h-4 w-4 text-muted-foreground' />
								<span>{dept.location}</span>
							</div>
							<div className='flex items-center gap-2 text-sm'>
								<Mail className='h-4 w-4 text-muted-foreground' />
								<span>{dept.contact}</span>
							</div>
						</div>

						<div className='mt-6 space-x-2'>
							<Button variant='outline' size='sm'>
								<Users className='h-4 w-4 mr-2' />
								View Team
							</Button>
							<Button variant='outline' size='sm'>
								<Phone className='h-4 w-4 mr-2' />
								Contact
							</Button>
						</div>
					</Card>
				))}
			</div>

			<Card className='p-6'>
				<h2 className='text-lg font-semibold mb-4'>Department Statistics</h2>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					<div className='p-4 bg-muted/50 rounded-lg'>
						<p className='text-sm text-muted-foreground'>Total Employees</p>
						<p className='text-2xl font-bold'>52</p>
					</div>
					<div className='p-4 bg-muted/50 rounded-lg'>
						<p className='text-sm text-muted-foreground'>Departments</p>
						<p className='text-2xl font-bold'>3</p>
					</div>
					<div className='p-4 bg-muted/50 rounded-lg'>
						<p className='text-sm text-muted-foreground'>Avg Team Size</p>
						<p className='text-2xl font-bold'>17</p>
					</div>
				</div>
			</Card>
		</div>
	);
}
