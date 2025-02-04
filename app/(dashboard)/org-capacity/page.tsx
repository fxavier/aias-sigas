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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
	Search,
	Filter,
	Plus,
	Eye,
	Edit,
	Trash2,
	GraduationCap,
	ClipboardList,
	CheckSquare,
} from 'lucide-react';

const TRAINING_TYPE = [
	{ value: 'Internal', label: 'Internal' },
	{ value: 'External', label: 'External' },
];

const MONTHS = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

const ANSWER_CHOICES = [
	{ value: 'Satisfactory', label: 'Satisfactory' },
	{ value: 'Partially Satisfactory', label: 'Partially Satisfactory' },
	{ value: 'Unsatisfactory', label: 'Unsatisfactory' },
];

const EFFECTIVENESS = [
	{ value: 'Effective', label: 'Effective' },
	{ value: 'Not effective', label: 'Not effective' },
];

const trainingNeeds = [
	{
		id: 1,
		filledBy: 'John Doe',
		date: '2024-03-15',
		department: 'HR',
		training: 'Safety Training',
		objective: 'Improve workplace safety awareness',
	},
];

const trainingPlans = [
	{
		id: 1,
		title: 'Workplace Safety',
		type: 'Internal',
		month: 'March',
		status: 'Planned',
		trainees: 25,
	},
];

const evaluations = [
	{
		id: 1,
		training: 'Safety Training',
		trainee: 'Jane Smith',
		date: '2024-03-10',
		effectiveness: 'Effective',
	},
];

export default function OrgCapacity() {
	const [activeTab, setActiveTab] = useState('needs');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			setIsSubmitting(true);
			// Add submission logic here

			toast({
				title: 'Record submitted successfully',
				description: 'The record has been saved in the system.',
			});
		} catch (error) {
			console.error('Error submitting record:', error);
			toast({
				title: 'Error submitting record',
				description:
					'An error occurred while saving the record. Please try again.',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold'>Organizational Capacity</h1>
				<p className='text-muted-foreground'>
					Manage training needs, plans, and evaluations
				</p>
			</div>

			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList>
					<TabsTrigger value='needs'>
						<GraduationCap className='h-4 w-4 mr-2' />
						Training Needs
					</TabsTrigger>
					<TabsTrigger value='plans'>
						<ClipboardList className='h-4 w-4 mr-2' />
						Training Plans
					</TabsTrigger>
					<TabsTrigger value='evaluations'>
						<CheckSquare className='h-4 w-4 mr-2' />
						Effectiveness Assessment
					</TabsTrigger>
				</TabsList>

				<TabsContent value='needs' className='space-y-4'>
					<div className='flex gap-4'>
						<div className='flex-1'>
							<div className='relative'>
								<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
								<Input
									placeholder='Search training needs...'
									className='pl-8'
								/>
							</div>
						</div>
						<Button variant='outline'>
							<Filter className='h-4 w-4 mr-2' />
							Filter
						</Button>
						<Dialog>
							<DialogTrigger asChild>
								<Button>
									<Plus className='h-4 w-4 mr-2' />
									New Training Need
								</Button>
							</DialogTrigger>
							<DialogContent className='max-w-2xl'>
								<DialogHeader>
									<DialogTitle>Add Training Need</DialogTitle>
								</DialogHeader>
								<form onSubmit={handleSubmit} className='space-y-6'>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
										<div className='space-y-2'>
											<Label htmlFor='filled_by'>Filled By</Label>
											<Input id='filled_by' required />
										</div>
										<div className='space-y-2'>
											<Label htmlFor='date'>Date</Label>
											<Input id='date' type='date' required />
										</div>
										<div className='space-y-2'>
											<Label htmlFor='department'>Department</Label>
											<Input id='department' required />
										</div>
										<div className='space-y-2'>
											<Label htmlFor='training'>Training</Label>
											<Input id='training' required />
										</div>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='objective'>Training Objective</Label>
										<Textarea id='objective' required />
									</div>
									<div className='space-y-2'>
										<Label htmlFor='entity'>Proposal of Training Entity</Label>
										<Input id='entity' required />
									</div>
									<div className='space-y-2'>
										<Label htmlFor='participants'>
											Potential Training Participants
										</Label>
										<Textarea id='participants' required />
									</div>
									<div className='flex justify-end gap-4'>
										<Button type='button' variant='outline'>
											Cancel
										</Button>
										<Button type='submit' disabled={isSubmitting}>
											Submit
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
									<TableHead>Filled By</TableHead>
									<TableHead>Date</TableHead>
									<TableHead>Department</TableHead>
									<TableHead>Training</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{trainingNeeds.map((need) => (
									<TableRow key={need.id}>
										<TableCell>{need.filledBy}</TableCell>
										<TableCell>{need.date}</TableCell>
										<TableCell>{need.department}</TableCell>
										<TableCell>{need.training}</TableCell>
										<TableCell>
											<div className='flex gap-2'>
												<Button variant='outline' size='icon'>
													<Eye className='h-4 w-4' />
												</Button>
												<Button variant='outline' size='icon'>
													<Edit className='h-4 w-4' />
												</Button>
												<Button
													variant='outline'
													size='icon'
													className='text-destructive'
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

				<TabsContent value='plans' className='space-y-4'>
					<div className='flex gap-4'>
						<div className='flex-1'>
							<div className='relative'>
								<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
								<Input
									placeholder='Search training plans...'
									className='pl-8'
								/>
							</div>
						</div>
						<Button variant='outline'>
							<Filter className='h-4 w-4 mr-2' />
							Filter
						</Button>
						<Dialog>
							<DialogTrigger asChild>
								<Button>
									<Plus className='h-4 w-4 mr-2' />
									New Training Plan
								</Button>
							</DialogTrigger>
							<DialogContent className='max-w-2xl'>
								<DialogHeader>
									<DialogTitle>Add Training Plan</DialogTitle>
								</DialogHeader>
								<form onSubmit={handleSubmit} className='space-y-6'>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
										<div className='space-y-2'>
											<Label htmlFor='updated_by'>Updated By</Label>
											<Input id='updated_by' required />
										</div>
										<div className='space-y-2'>
											<Label htmlFor='date'>Date</Label>
											<Input id='date' type='date' required />
										</div>
										<div className='space-y-2'>
											<Label htmlFor='year'>Year</Label>
											<Input id='year' type='number' required />
										</div>
										<div className='space-y-2'>
											<Label htmlFor='training_area'>Training Area</Label>
											<Input id='training_area' required />
										</div>
										<div className='space-y-2'>
											<Label htmlFor='training_title'>Training Title</Label>
											<Input id='training_title' required />
										</div>
										<div className='space-y-2'>
											<Label htmlFor='training_type'>Training Type</Label>
											<Select>
												<SelectTrigger>
													<SelectValue placeholder='Select type' />
												</SelectTrigger>
												<SelectContent>
													{TRAINING_TYPE.map((type) => (
														<SelectItem key={type.value} value={type.value}>
															{type.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='objective'>Training Objective</Label>
										<Textarea id='objective' required />
									</div>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
										<div className='space-y-2'>
											<Label htmlFor='training_entity'>Training Entity</Label>
											<Input id='training_entity' required />
										</div>
										<div className='space-y-2'>
											<Label htmlFor='duration'>Duration</Label>
											<Input id='duration' required />
										</div>
										<div className='space-y-2'>
											<Label htmlFor='number_of_trainees'>
												Number of Trainees
											</Label>
											<Input id='number_of_trainees' type='number' required />
										</div>
										<div className='space-y-2'>
											<Label htmlFor='training_month'>Training Month</Label>
											<Select>
												<SelectTrigger>
													<SelectValue placeholder='Select month' />
												</SelectTrigger>
												<SelectContent>
													{MONTHS.map((month) => (
														<SelectItem key={month} value={month}>
															{month}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='recipients'>Training Recipients</Label>
										<Textarea id='recipients' required />
									</div>
									<div className='space-y-2'>
										<Label htmlFor='observations'>Observations</Label>
										<Textarea id='observations' />
									</div>
									<div className='flex justify-end gap-4'>
										<Button type='button' variant='outline'>
											Cancel
										</Button>
										<Button type='submit' disabled={isSubmitting}>
											Submit
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
									<TableHead>Title</TableHead>
									<TableHead>Type</TableHead>
									<TableHead>Month</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Trainees</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{trainingPlans.map((plan) => (
									<TableRow key={plan.id}>
										<TableCell>{plan.title}</TableCell>
										<TableCell>{plan.type}</TableCell>
										<TableCell>{plan.month}</TableCell>
										<TableCell>{plan.status}</TableCell>
										<TableCell>{plan.trainees}</TableCell>
										<TableCell>
											<div className='flex gap-2'>
												<Button variant='outline' size='icon'>
													<Eye className='h-4 w-4' />
												</Button>
												<Button variant='outline' size='icon'>
													<Edit className='h-4 w-4' />
												</Button>
												<Button
													variant='outline'
													size='icon'
													className='text-destructive'
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

				<TabsContent value='evaluations' className='space-y-4'>
					<div className='flex gap-4'>
						<div className='flex-1'>
							<div className='relative'>
								<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
								<Input placeholder='Search evaluations...' className='pl-8' />
							</div>
						</div>
						<Button variant='outline'>
							<Filter className='h-4 w-4 mr-2' />
							Filter
						</Button>
						<Dialog>
							<DialogTrigger asChild>
								<Button>
									<Plus className='h-4 w-4 mr-2' />
									New Evaluation
								</Button>
							</DialogTrigger>
							<DialogContent className='max-w-2xl'>
								<DialogHeader>
									<DialogTitle>
										Add Training Effectiveness Assessment
									</DialogTitle>
								</DialogHeader>
								<form onSubmit={handleSubmit} className='space-y-6'>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
										<div className='space-y-2'>
											<Label htmlFor='training'>Training</Label>
											<Input id='training' required />
										</div>
										<div className='space-y-2'>
											<Label htmlFor='date'>Date</Label>
											<Input id='date' type='date' required />
										</div>
										<div className='space-y-2'>
											<Label htmlFor='department'>Department</Label>
											<Input id='department' required />
										</div>
										<div className='space-y-2'>
											<Label htmlFor='trainee'>Trainee</Label>
											<Input id='trainee' required />
										</div>
										<div className='space-y-2'>
											<Label htmlFor='supervisor'>Immediate Supervisor</Label>
											<Input id='supervisor' required />
										</div>
										<div className='space-y-2'>
											<Label htmlFor='answer'>Evaluation Answer</Label>
											<Select>
												<SelectTrigger>
													<SelectValue placeholder='Select answer' />
												</SelectTrigger>
												<SelectContent>
													{ANSWER_CHOICES.map((choice) => (
														<SelectItem key={choice.value} value={choice.value}>
															{choice.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='effectiveness'>
											Human Resource Evaluation
										</Label>
										<Select>
											<SelectTrigger>
												<SelectValue placeholder='Select effectiveness' />
											</SelectTrigger>
											<SelectContent>
												{EFFECTIVENESS.map((choice) => (
													<SelectItem key={choice.value} value={choice.value}>
														{choice.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div className='flex justify-end gap-4'>
										<Button type='button' variant='outline'>
											Cancel
										</Button>
										<Button type='submit' disabled={isSubmitting}>
											Submit
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
									<TableHead>Training</TableHead>
									<TableHead>Trainee</TableHead>
									<TableHead>Date</TableHead>
									<TableHead>Effectiveness</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{evaluations.map((evaluation) => (
									<TableRow key={evaluation.id}>
										<TableCell>{evaluation.training}</TableCell>
										<TableCell>{evaluation.trainee}</TableCell>
										<TableCell>{evaluation.date}</TableCell>
										<TableCell>{evaluation.effectiveness}</TableCell>
										<TableCell>
											<div className='flex gap-2'>
												<Button variant='outline' size='icon'>
													<Eye className='h-4 w-4' />
												</Button>
												<Button variant='outline' size='icon'>
													<Edit className='h-4 w-4' />
												</Button>
												<Button
													variant='outline'
													size='icon'
													className='text-destructive'
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
