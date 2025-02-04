'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
	Search,
	Filter,
	Plus,
	Eye,
	Edit,
	Trash2,
	Loader2,
	Recycle,
} from 'lucide-react';

const wasteLogs = [
	{
		id: 1,
		type: 'Hazardous Waste',
		reference: 'WTL-2024-001',
		date: '2024-03-15',
		company: 'Eco Disposal Inc.',
		quantity: 500,
	},
];

export default function Reports() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			setIsSubmitting(true);
			// Add submission logic here

			toast({
				title: 'Waste transfer log submitted successfully',
				description: 'The log has been saved in the system.',
			});

			setIsDialogOpen(false);
		} catch (error) {
			console.error('Error submitting log:', error);
			toast({
				title: 'Error submitting log',
				description:
					'An error occurred while saving the log. Please try again.',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold'>Waste Transfer Logs</h1>
					<p className='text-muted-foreground'>
						Track and manage waste disposal activities
					</p>
				</div>
				<div className='flex items-center gap-4'>
					<div className='flex items-center gap-2 text-sm text-muted-foreground'>
						<Recycle className='h-4 w-4' />
						<span>Total Transfers: {wasteLogs.length}</span>
					</div>
				</div>
			</div>

			<div className='flex gap-4'>
				<div className='flex-1'>
					<div className='relative'>
						<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
						<Input
							placeholder='Search waste transfer logs...'
							className='pl-8'
						/>
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
							New Transfer Log
						</Button>
					</DialogTrigger>
					<DialogContent className='max-w-2xl'>
						<DialogHeader>
							<DialogTitle>Add Waste Transfer Log</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleSubmit} className='space-y-6'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label htmlFor='waste_type'>Waste Type</Label>
									<Input
										id='waste_type'
										placeholder='Enter waste type'
										required
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='contained'>How is Waste Contained</Label>
									<Input
										id='contained'
										placeholder='Enter containment method'
										required
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='quantity'>How Much Waste</Label>
									<Input
										id='quantity'
										type='number'
										placeholder='Enter quantity'
										min='0'
										required
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='reference'>Reference Number</Label>
									<Input
										id='reference'
										placeholder='Enter reference number'
										required
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='date'>Date of Removal</Label>
									<Input id='date' type='date' required />
								</div>
								<div className='space-y-2'>
									<Label htmlFor='company'>Transfer Company</Label>
									<Input
										id='company'
										placeholder='Enter company name'
										required
									/>
								</div>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='instructions'>Special Instructions</Label>
								<Textarea
									id='instructions'
									placeholder='Enter any special instructions'
									className='min-h-[100px]'
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
									Submit Log
								</Button>
							</div>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			<Card>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Reference</TableHead>
							<TableHead>Waste Type</TableHead>
							<TableHead>Date</TableHead>
							<TableHead>Company</TableHead>
							<TableHead>Quantity</TableHead>
							<TableHead className='text-right'>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{wasteLogs.map((log) => (
							<TableRow key={log.id}>
								<TableCell>{log.reference}</TableCell>
								<TableCell>{log.type}</TableCell>
								<TableCell>{log.date}</TableCell>
								<TableCell>{log.company}</TableCell>
								<TableCell>{log.quantity} kg</TableCell>
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
