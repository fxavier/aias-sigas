'use client';

import { useState, useEffect } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
	Search,
	Filter,
	Plus,
	Edit,
	Trash2,
	Loader2,
	Target,
	Crosshair,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
	fetchStrategicObjectives,
	addStrategicObjective,
	editStrategicObjective,
	removeStrategicObjective,
	fetchSpecificObjectives,
	addSpecificObjective,
	editSpecificObjective,
	removeSpecificObjective,
	setSelectedObjective,
} from '@/lib/redux/features/programsSlice';
import type {
	StrategicObjective,
	SpecificObjective,
} from '@/lib/supabase/types';

export default function Programs() {
	const dispatch = useAppDispatch();
	const {
		strategicObjectives,
		specificObjectives,
		isLoading,
		error,
		selectedObjective,
	} = useAppSelector((state) => state.programs);
	const [activeTab, setActiveTab] = useState('strategic');
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();

	useEffect(() => {
		const loadData = async () => {
			try {
				await Promise.all([
					dispatch(fetchStrategicObjectives()).unwrap(),
					dispatch(fetchSpecificObjectives()).unwrap(),
				]);
			} catch (error) {
				console.error('Error loading data:', error);
			}
		};
		loadData();
	}, [dispatch]);

	const handleSubmitStrategic = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			setIsSubmitting(true);
			const formData = new FormData(e.currentTarget);
			const data = {
				description: formData.get('description') as string,
				goals: formData.get('goals') as string,
				strategies_for_achievement: formData.get('strategies') as string,
			};

			if (selectedObjective) {
				await dispatch(
					editStrategicObjective({
						id: selectedObjective.id,
						objective: data,
					})
				).unwrap();
				toast({
					title: 'Strategic objective updated',
					description: 'The objective has been updated successfully.',
				});
			} else {
				await dispatch(addStrategicObjective(data)).unwrap();
				toast({
					title: 'Strategic objective created',
					description: 'The new objective has been saved successfully.',
				});
			}

			setIsDialogOpen(false);
			dispatch(setSelectedObjective(null));
		} catch (error) {
			console.error('Error submitting strategic objective:', error);
			toast({
				title: 'Error saving objective',
				description:
					'An error occurred while saving the objective. Please try again.',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleSubmitSpecific = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			setIsSubmitting(true);
			const formData = new FormData(e.currentTarget);
			const data = {
				strategic_objective: formData.get('strategic') as string,
				specific_objective: formData.get('specific') as string,
				actions_for_achievement: formData.get('actions') as string,
				responsible_person: formData.get('responsible') as string,
				necessary_resources: formData.get('resources') as string,
				indicator: formData.get('indicator') as string,
				goal: formData.get('goal') as string,
				monitoring_frequency: formData.get('frequency') as string,
				deadline: formData.get('deadline') as string,
				observation: formData.get('observation') as string,
			};

			if (selectedObjective) {
				await dispatch(
					editSpecificObjective({
						id: selectedObjective.id,
						objective: data,
					})
				).unwrap();
				toast({
					title: 'Specific objective updated',
					description: 'The objective has been updated successfully.',
				});
			} else {
				await dispatch(addSpecificObjective(data)).unwrap();
				toast({
					title: 'Specific objective created',
					description: 'The new objective has been saved successfully.',
				});
			}

			setIsDialogOpen(false);
			dispatch(setSelectedObjective(null));
		} catch (error) {
			console.error('Error submitting specific objective:', error);
			toast({
				title: 'Error saving objective',
				description:
					'An error occurred while saving the objective. Please try again.',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = async (id: string, type: 'strategic' | 'specific') => {
		try {
			if (type === 'strategic') {
				await dispatch(removeStrategicObjective(id)).unwrap();
			} else {
				await dispatch(removeSpecificObjective(id)).unwrap();
			}

			toast({
				title: 'Objective deleted',
				description: 'The objective has been deleted successfully.',
			});
		} catch (error) {
			console.error('Error deleting objective:', error);
			toast({
				title: 'Error deleting objective',
				description:
					'An error occurred while deleting the objective. Please try again.',
				variant: 'destructive',
			});
		}
	};

	const handleEdit = (objective: StrategicObjective | SpecificObjective) => {
		dispatch(setSelectedObjective(objective));
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
				<Button
					onClick={() => {
						dispatch(fetchStrategicObjectives());
						dispatch(fetchSpecificObjectives());
					}}
					className='mt-4'
				>
					Retry
				</Button>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold'>Programs Management</h1>
				<p className='text-muted-foreground'>
					Manage strategic and specific objectives
				</p>
			</div>

			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList>
					<TabsTrigger value='strategic'>
						<Target className='h-4 w-4 mr-2' />
						Strategic Objectives
					</TabsTrigger>
					<TabsTrigger value='specific'>
						<Crosshair className='h-4 w-4 mr-2' />
						Specific Objectives
					</TabsTrigger>
				</TabsList>

				<TabsContent value='strategic' className='space-y-4'>
					<div className='flex gap-4'>
						<div className='flex-1'>
							<div className='relative'>
								<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
								<Input
									placeholder='Search strategic objectives...'
									className='pl-8'
								/>
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
								if (!open) dispatch(setSelectedObjective(null));
							}}
						>
							<DialogTrigger asChild>
								<Button>
									<Plus className='h-4 w-4 mr-2' />
									New Strategic Objective
								</Button>
							</DialogTrigger>
							<DialogContent className='max-w-2xl'>
								<DialogHeader>
									<DialogTitle>
										{selectedObjective
											? 'Edit Strategic Objective'
											: 'Add Strategic Objective'}
									</DialogTitle>
								</DialogHeader>
								<form onSubmit={handleSubmitStrategic} className='space-y-6'>
									<div className='space-y-4'>
										<div className='space-y-2'>
											<Label htmlFor='description'>Description</Label>
											<Input
												id='description'
												name='description'
												defaultValue={
													(selectedObjective as StrategicObjective)?.description
												}
												required
											/>
										</div>
										<div className='space-y-2'>
											<Label htmlFor='goals'>Goals</Label>
											<Input
												id='goals'
												name='goals'
												defaultValue={
													(selectedObjective as StrategicObjective)?.goals
												}
												required
											/>
										</div>
										<div className='space-y-2'>
											<Label htmlFor='strategies'>
												Strategies for Achievement
											</Label>
											<Textarea
												id='strategies'
												name='strategies'
												defaultValue={
													(selectedObjective as StrategicObjective)
														?.strategies_for_achievement
												}
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
												dispatch(setSelectedObjective(null));
											}}
											disabled={isSubmitting}
										>
											Cancel
										</Button>
										<Button type='submit' disabled={isSubmitting}>
											{isSubmitting && (
												<Loader2 className='mr-2 h-4 w-4 animate-spin' />
											)}
											{selectedObjective ? 'Update' : 'Submit'}
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
									<TableHead>Description</TableHead>
									<TableHead>Goals</TableHead>
									<TableHead>Strategies</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{strategicObjectives.map((objective) => (
									<TableRow key={objective.id}>
										<TableCell>{objective.description}</TableCell>
										<TableCell>{objective.goals}</TableCell>
										<TableCell>
											{objective.strategies_for_achievement}
										</TableCell>
										<TableCell>
											<div className='flex gap-2'>
												<Button
													variant='outline'
													size='icon'
													onClick={() => handleEdit(objective)}
												>
													<Edit className='h-4 w-4' />
												</Button>
												<Button
													variant='outline'
													size='icon'
													className='text-destructive hover:text-destructive'
													onClick={() =>
														handleDelete(objective.id, 'strategic')
													}
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
				</TabsContent>

				<TabsContent value='specific' className='space-y-4'>
					<div className='flex gap-4'>
						<div className='flex-1'>
							<div className='relative'>
								<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
								<Input
									placeholder='Search specific objectives...'
									className='pl-8'
								/>
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
								if (!open) dispatch(setSelectedObjective(null));
							}}
						>
							<DialogTrigger asChild>
								<Button>
									<Plus className='h-4 w-4 mr-2' />
									New Specific Objective
								</Button>
							</DialogTrigger>
							<DialogContent className='max-w-2xl'>
								<DialogHeader>
									<DialogTitle>
										{selectedObjective
											? 'Edit Specific Objective'
											: 'Add Specific Objective'}
									</DialogTitle>
								</DialogHeader>
								<form onSubmit={handleSubmitSpecific} className='space-y-6'>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
										<div className='space-y-2'>
											<Label htmlFor='strategic'>Strategic Objective</Label>
											<Input
												id='strategic'
												name='strategic'
												defaultValue={
													(selectedObjective as SpecificObjective)
														?.strategic_objective
												}
												required
											/>
										</div>
										<div className='space-y-2'>
											<Label htmlFor='specific'>Specific Objective</Label>
											<Input
												id='specific'
												name='specific'
												defaultValue={
													(selectedObjective as SpecificObjective)
														?.specific_objective
												}
												required
											/>
										</div>
										<div className='space-y-2'>
											<Label htmlFor='actions'>Actions for Achievement</Label>
											<Textarea
												id='actions'
												name='actions'
												defaultValue={
													(selectedObjective as SpecificObjective)
														?.actions_for_achievement
												}
												required
											/>
										</div>
										<div className='space-y-2'>
											<Label htmlFor='responsible'>Responsible Person</Label>
											<Input
												id='responsible'
												name='responsible'
												defaultValue={
													(selectedObjective as SpecificObjective)
														?.responsible_person
												}
												required
											/>
										</div>
										<div className='space-y-2'>
											<Label htmlFor='resources'>Necessary Resources</Label>
											<Input
												id='resources'
												name='resources'
												defaultValue={
													(selectedObjective as SpecificObjective)
														?.necessary_resources
												}
												required
											/>
										</div>
										<div className='space-y-2'>
											<Label htmlFor='indicator'>Indicator</Label>
											<Input
												id='indicator'
												name='indicator'
												defaultValue={
													(selectedObjective as SpecificObjective)?.indicator
												}
												required
											/>
										</div>
										<div className='space-y-2'>
											<Label htmlFor='goal'>Goal</Label>
											<Input
												id='goal'
												name='goal'
												defaultValue={
													(selectedObjective as SpecificObjective)?.goal
												}
												required
											/>
										</div>
										<div className='space-y-2'>
											<Label htmlFor='frequency'>Monitoring Frequency</Label>
											<Input
												id='frequency'
												name='frequency'
												defaultValue={
													(selectedObjective as SpecificObjective)
														?.monitoring_frequency
												}
												required
											/>
										</div>
										<div className='space-y-2'>
											<Label htmlFor='deadline'>Deadline</Label>
											<Input
												id='deadline'
												name='deadline'
												type='date'
												defaultValue={
													(selectedObjective as SpecificObjective)?.deadline
												}
												required
											/>
										</div>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='observation'>Observations</Label>
										<Textarea
											id='observation'
											name='observation'
											defaultValue={
												(selectedObjective as SpecificObjective)?.observation
											}
											className='min-h-[100px]'
										/>
									</div>
									<div className='flex justify-end gap-4'>
										<Button
											type='button'
											variant='outline'
											onClick={() => {
												setIsDialogOpen(false);
												dispatch(setSelectedObjective(null));
											}}
											disabled={isSubmitting}
										>
											Cancel
										</Button>
										<Button type='submit' disabled={isSubmitting}>
											{isSubmitting && (
												<Loader2 className='mr-2 h-4 w-4 animate-spin' />
											)}
											{selectedObjective ? 'Update' : 'Submit'}
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
									<TableHead>Strategic Objective</TableHead>
									<TableHead>Specific Objective</TableHead>
									<TableHead>Responsible Person</TableHead>
									<TableHead>Deadline</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{specificObjectives.map((objective) => (
									<TableRow key={objective.id}>
										<TableCell>{objective.strategic_objective}</TableCell>
										<TableCell>{objective.specific_objective}</TableCell>
										<TableCell>{objective.responsible_person}</TableCell>
										<TableCell>{objective.deadline}</TableCell>
										<TableCell>
											<div className='flex gap-2'>
												<Button
													variant='outline'
													size='icon'
													onClick={() => handleEdit(objective)}
												>
													<Edit className='h-4 w-4' />
												</Button>
												<Button
													variant='outline'
													size='icon'
													className='text-destructive hover:text-destructive'
													onClick={() => handleDelete(objective.id, 'specific')}
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
				</TabsContent>
			</Tabs>
		</div>
	);
}
