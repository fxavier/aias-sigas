'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import {
	MessageSquareWarning,
	Search,
	Filter,
	Plus,
	Eye,
	Edit,
	Trash2,
	Loader2,
} from 'lucide-react';

const STATUS_COLORS = {
	PENDING: 'bg-yellow-100 text-yellow-700',
	IN_PROGRESS: 'bg-blue-100 text-blue-700',
	COMPLETED: 'bg-green-100 text-green-700',
};

const PREFERED_CONTACT_METHOD = [
	{ value: 'EMAIL', label: 'Email' },
	{ value: 'PHONE', label: 'Phone' },
	{ value: 'FACE_TO_FACE', label: 'Face to Face' },
];

const PREFERED_LANGUAGE = [
	{ value: 'PORTUGUESE', label: 'Portuguese' },
	{ value: 'ENGLISH', label: 'English' },
	{ value: 'OTHER', label: 'Other' },
];

const grievances = [
	{
		id: 1,
		name: 'John Doe',
		company: 'ABC Corp',
		date: '2024-03-15',
		status: 'PENDING',
		contact: 'john@example.com',
		details: 'Workplace safety concern',
	},
	{
		id: 2,
		name: 'Jane Smith',
		company: 'XYZ Ltd',
		date: '2024-03-14',
		status: 'IN_PROGRESS',
		contact: '+1234567890',
		details: 'Working conditions issue',
	},
	{
		id: 3,
		name: 'Mike Johnson',
		company: 'DEF Industries',
		date: '2024-03-13',
		status: 'COMPLETED',
		contact: 'mike@example.com',
		details: 'Equipment maintenance concern',
	},
];

export default function Grievance() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			setIsSubmitting(true);
			// Add submission logic here

			toast({
				title: 'Grievance submitted successfully',
				description: 'The grievance has been recorded in the system.',
			});

			setIsDialogOpen(false);
		} catch (error) {
			console.error('Error submitting grievance:', error);
			toast({
				title: 'Error submitting grievance',
				description:
					'An error occurred while submitting the grievance. Please try again.',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold'>Grievance Management</h1>
				<p className='text-muted-foreground'>
					Track and manage worker grievances
				</p>
			</div>

			<div className='flex gap-4'>
				<div className='flex-1'>
					<div className='relative'>
						<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
						<Input placeholder='Search grievances...' className='pl-8' />
					</div>
				</div>
				<Button variant='outline'>
					<Filter className='h-4 w-4 mr-2' />
					Filter
				</Button>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button>
							<Plus className='h-4 w-4 mr-2' />
							New Grievance
						</Button>
					</DialogTrigger>
					<DialogContent className='max-w-2xl'>
						<DialogHeader>
							<DialogTitle>Submit New Grievance</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleSubmit} className='space-y-6'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label htmlFor='name'>Name</Label>
									<Input id='name' placeholder='Enter name' required />
								</div>
								<div className='space-y-2'>
									<Label htmlFor='company'>Company</Label>
									<Input
										id='company'
										placeholder='Enter company name'
										required
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='date'>Date</Label>
									<Input id='date' type='date' required />
								</div>
								<div className='space-y-2'>
									<Label htmlFor='contact_method'>
										Preferred Contact Method
									</Label>
									<Select>
										<SelectTrigger>
											<SelectValue placeholder='Select contact method' />
										</SelectTrigger>
										<SelectContent>
											{PREFERED_CONTACT_METHOD.map((method) => (
												<SelectItem key={method.value} value={method.value}>
													{method.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='contact'>Contact Details</Label>
									<Input
										id='contact'
										placeholder='Enter contact details'
										required
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='language'>Preferred Language</Label>
									<Select>
										<SelectTrigger>
											<SelectValue placeholder='Select language' />
										</SelectTrigger>
										<SelectContent>
											{PREFERED_LANGUAGE.map((language) => (
												<SelectItem key={language.value} value={language.value}>
													{language.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='details'>Grievance Details</Label>
								<Textarea
									id='details'
									placeholder='Describe the grievance in detail'
									className='min-h-[100px]'
									required
								/>
							</div>
							<div className='flex justify-end gap-4'>
								<Button
									type='button'
									variant='outline'
									onClick={() => setIsDialogOpen(false)}
									disabled={isSubmitting}
								>
									Cancel
								</Button>
								<Button type='submit' disabled={isSubmitting}>
									{isSubmitting && (
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
									)}
									Submit Grievance
								</Button>
							</div>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				<Card className='p-4 bg-yellow-50 border-yellow-200'>
					<div className='flex items-center gap-2 text-yellow-700'>
						<MessageSquareWarning className='h-4 w-4' />
						<h3 className='font-medium'>Pending</h3>
					</div>
					<p className='text-2xl font-bold text-yellow-700 mt-2'>
						{grievances.filter((g) => g.status === 'PENDING').length}
					</p>
				</Card>
				<Card className='p-4 bg-blue-50 border-blue-200'>
					<div className='flex items-center gap-2 text-blue-700'>
						<MessageSquareWarning className='h-4 w-4' />
						<h3 className='font-medium'>In Progress</h3>
					</div>
					<p className='text-2xl font-bold text-blue-700 mt-2'>
						{grievances.filter((g) => g.status === 'IN_PROGRESS').length}
					</p>
				</Card>
				<Card className='p-4 bg-green-50 border-green-200'>
					<div className='flex items-center gap-2 text-green-700'>
						<MessageSquareWarning className='h-4 w-4' />
						<h3 className='font-medium'>Completed</h3>
					</div>
					<p className='text-2xl font-bold text-green-700 mt-2'>
						{grievances.filter((g) => g.status === 'COMPLETED').length}
					</p>
				</Card>
			</div>

			<Card>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Company</TableHead>
							<TableHead>Date</TableHead>
							<TableHead>Contact</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className='text-right'>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{grievances.map((grievance) => (
							<TableRow key={grievance.id}>
								<TableCell>{grievance.name}</TableCell>
								<TableCell>{grievance.company}</TableCell>
								<TableCell>{grievance.date}</TableCell>
								<TableCell>{grievance.contact}</TableCell>
								<TableCell>
									<span
										className={`px-2 py-1 rounded-full text-xs ${
											STATUS_COLORS[
												grievance.status as keyof typeof STATUS_COLORS
											]
										}`}
									>
										{grievance.status}
									</span>
								</TableCell>
								<TableCell className='text-right'>
									<div className='flex justify-end gap-2'>
										<Button variant='outline' size='icon'>
											<Eye className='h-4 w-4' />
										</Button>
										<Button variant='outline' size='icon'>
											<Edit className='h-4 w-4' />
										</Button>
										<Button
											variant='outline'
											size='icon'
											className='text-destructive hover:text-destructive'
										>
											<Trash2 className='h-4 w-4' />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Card>
		</div>
	);
}
