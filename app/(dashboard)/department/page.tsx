'use client';

import { useEffect, useState } from 'react';
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
/* import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'; */
import { useToast } from '@/hooks/use-toast';
import {
	Search,
	Filter,
	Plus,
	Edit,
	Trash2,
	Loader2,
	Building2,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
	fetchDepartments,
	addDepartment,
	editDepartment,
	removeDepartment,
	setSelectedDepartment,
} from '@/lib/redux/features/departmentsSlice';

export default function Department() {
	const dispatch = useAppDispatch();
	const { departments, isLoading, error, selectedDepartment } = useAppSelector(
		(state) => state.departments
	);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();

	useEffect(() => {
		dispatch(fetchDepartments());
	}, [dispatch]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			setIsSubmitting(true);
			const formData = new FormData(e.currentTarget);
			const data = {
				name: formData.get('name') as string,
				description: formData.get('description') as string,
			};

			if (selectedDepartment) {
				await dispatch(
					editDepartment({
						id: selectedDepartment.id,
						department: data,
					})
				).unwrap();
				toast({
					title: 'Department updated',
					description: 'The department has been updated successfully.',
				});
			} else {
				await dispatch(addDepartment(data)).unwrap();
				toast({
					title: 'Department created',
					description: 'The new department has been created successfully.',
				});
			}

			setIsDialogOpen(false);
			dispatch(setSelectedDepartment(null));
		} catch (error) {
			console.error('Error submitting department:', error);
			toast({
				title: 'Error saving department',
				description:
					'An error occurred while saving the department. Please try again.',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = async (id: string) => {
		try {
			await dispatch(removeDepartment(id)).unwrap();
			toast({
				title: 'Department deleted',
				description: 'The department has been deleted successfully.',
			});
		} catch (error) {
			console.error('Error deleting department:', error);
			toast({
				title: 'Error deleting department',
				description:
					'An error occurred while deleting the department. Please try again.',
				variant: 'destructive',
			});
		}
	};

	const handleEdit = (department: (typeof departments)[0]) => {
		dispatch(setSelectedDepartment(department));
		setIsDialogOpen(true);
	};

	if (isLoading) {
		return (
			<div className='flex items-center justify-center h-full'>
				<Loader2 className='h-8 w-8 animate-spin' />
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex flex-col items-center justify-center h-full'>
				<p className='text-destructive'>{error}</p>
				<Button onClick={() => dispatch(fetchDepartments())} className='mt-4'>
					Retry
				</Button>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold'>Departments</h1>
				<p className='text-muted-foreground'>
					Overview of all departments and their details
				</p>
			</div>

			<div className='flex gap-4'>
				<div className='flex-1'>
					<div className='relative'>
						<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
						<Input placeholder='Search departments...' className='pl-8' />
					</div>
				</div>
				<Button variant='outline'>
					<Filter className='h-4 w-4 mr-2' />
					Filter
				</Button>
				<Dialog
					open={isDialogOpen}
					onOpenChange={(open) => {
						setIsDialogOpen(open);
						if (!open) dispatch(setSelectedDepartment(null));
					}}
				>
					<DialogTrigger asChild>
						<Button>
							<Plus className='h-4 w-4 mr-2' />
							New Department
						</Button>
					</DialogTrigger>
					<DialogContent className='max-w-2xl'>
						<DialogHeader>
							<DialogTitle>
								{selectedDepartment ? 'Edit Department' : 'Add New Department'}
							</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleSubmit} className='space-y-6'>
							<div className='space-y-4'>
								<div className='space-y-2'>
									<Label htmlFor='name'>Department Name</Label>
									<Input
										id='name'
										name='name'
										defaultValue={selectedDepartment?.name}
										required
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='description'>Description</Label>
									<Textarea
										id='description'
										name='description'
										defaultValue={selectedDepartment?.description}
										required
									/>
								</div>
							</div>
							<div className='flex justify-end gap-4'>
								<Button
									type='button'
									variant='outline'
									onClick={() => {
										setIsDialogOpen(false);
										dispatch(setSelectedDepartment(null));
									}}
									disabled={isSubmitting}
								>
									Cancel
								</Button>
								<Button type='submit' disabled={isSubmitting}>
									{isSubmitting && (
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
									)}
									{selectedDepartment ? 'Update' : 'Create'} Department
								</Button>
							</div>
						</form>
					</DialogContent>
				</Dialog>
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
							</div>
						</div>

						<div className='space-y-4'>
							<p className='text-sm text-muted-foreground'>
								{dept.description}
							</p>
						</div>

						<div className='mt-6 flex justify-end gap-2'>
							<Button
								variant='outline'
								size='icon'
								onClick={() => handleEdit(dept)}
							>
								<Edit className='h-4 w-4' />
							</Button>
							<Button
								variant='outline'
								size='icon'
								className='text-destructive hover:text-destructive'
								onClick={() => handleDelete(dept.id)}
							>
								<Trash2 className='h-4 w-4' />
							</Button>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}
