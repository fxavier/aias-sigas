'use client';

import { useEffect, useState, ChangeEvent, useRef, DragEvent } from 'react';
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
	Search,
	Filter,
	Plus,
	Edit,
	Trash2,
	Loader2,
	FileText,
	File as FileIcon,
	Image as ImageIcon,
	Download,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
	fetchDocuments,
	addDocument,
	editDocument,
	setSelectedDocument,
	deleteDocument,
} from '@/lib/redux/features/documentsSlice';
import { getPublicUrl } from '@/lib/supabase/services/storageService';
import type { Document } from '@/lib/supabase/types';

const DOCUMENT_STATE_CHOICES = [
	{ value: 'REVISION', label: 'Revisão' },
	{ value: 'INUSE', label: 'Em uso' },
	{ value: 'OBSOLETE', label: 'Obsoleto' },
];

function isErrorWithMessage(error: unknown): error is { message: string } {
	return (
		typeof error === 'object' &&
		error !== null &&
		'message' in error &&
		typeof (error as Record<string, unknown>).message === 'string'
	);
}

export default function Documents() {
	const dispatch = useAppDispatch();
	const { documents, documentTypes, isLoading, error, selectedDocument } =
		useAppSelector((state) => state.documents);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [selectedFileName, setSelectedFileName] = useState<string>('');
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { toast } = useToast();

	useEffect(() => {
		dispatch(fetchDocuments());
	}, [dispatch]);

	// Handle drag over events to allow drop
	const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
	};

	// On drop, retrieve the file from the event and process it
	const handleDrop = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		const file = e.dataTransfer.files?.[0];
		if (file) {
			// Create a synthetic event for onChange
			handleFileChange({
				target: { files: [file] },
			} as unknown as ChangeEvent<HTMLInputElement>);
		}
	};

	// Clicking the drop zone triggers the hidden file input
	const handleClickDropZone = () => {
		fileInputRef.current?.click();
	};

	// When a file is selected, validate its type and store its name.
	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const allowedTypes = [
				'application/pdf',
				'image/jpeg',
				'image/png',
				'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
				'application/vnd.ms-excel',
				'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			];
			if (!allowedTypes.includes(file.type)) {
				alert(
					'Invalid file type. Allowed types are PDF, JPEG, PNG, DOCX, XLS and XLSX.'
				);
				return;
			}
			setSelectedFileName(file.name);
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			setIsSubmitting(true);
			const formData = new FormData(e.currentTarget);
			// Build the document data object.
			const data: Partial<Document> & { file?: File } = {
				code: formData.get('code') as string,
				creation_date: formData.get('creation_date') as string,
				revision_date: formData.get('revision_date') as string,
				document_name: formData.get('document_name') as string,
				document_type_id: formData.get('document_type_id') as string,
				// The document_path field will be handled by your Redux thunk if a file is provided.
				document_state: formData.get('document_state') as
					| 'REVISION'
					| 'INUSE'
					| 'OBSOLETE',
				retention_period: formData.get('retention_period') as string,
				disposal_method: formData.get('disposal_method') as string,
				observation: formData.get('observation') as string,
			};

			// Check for file input; if a file exists, attach it.
			const file = formData.get('file') as File;
			if (file && file.size > 0) {
				// Optionally, you can sanitize the file name here if needed.
				setSelectedFileName(file.name);
				data.file = file;
			}

			if (selectedDocument) {
				await dispatch(
					editDocument({ id: selectedDocument.id, document: data })
				).unwrap();
				toast({
					title: 'Document updated',
					description: 'The document has been updated successfully.',
				});
			} else {
				await dispatch(addDocument(data)).unwrap();
				toast({
					title: 'Document created',
					description: 'The new document has been saved successfully.',
				});
			}

			setIsDialogOpen(false);
			dispatch(setSelectedDocument(null));
			setSelectedFileName('');
		} catch (error: unknown) {
			let errorMessage = 'An unknown error occurred';
			if (isErrorWithMessage(error)) {
				errorMessage = error.message;
			}
			console.error('Error submitting document:', errorMessage);
			toast({
				title: 'Error saving document',
				description:
					'An error occurred while saving the document. Please try again.',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = async (id: string) => {
		try {
			await dispatch(deleteDocument(id)).unwrap();
			toast({
				title: 'Document deleted',
				description: 'The document has been deleted successfully.',
			});
		} catch (error) {
			console.error('Error deleting document:', error);
			toast({
				title: 'Error deleting document',
				description:
					'An error occurred while deleting the document. Please try again.',
				variant: 'destructive',
			});
		}
	};

	const handleEdit = (document: Document) => {
		dispatch(setSelectedDocument(document));
		setSelectedFileName('');
		setIsDialogOpen(true);
	};

	// Allow file download for editing
	const handleDownload = (filePath: string) => {
		const url = getPublicUrl(filePath);
		window.open(url, '_blank');
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
				<Button onClick={() => dispatch(fetchDocuments())} className='mt-4'>
					Retry
				</Button>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold'>Document Management</h1>
				<p className='text-muted-foreground'>
					Manage and track all system documents
				</p>
			</div>

			<div className='flex gap-4'>
				<div className='flex-1'>
					<div className='relative'>
						<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
						<Input placeholder='Search documents...' className='pl-8' />
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
						if (!open) dispatch(setSelectedDocument(null));
					}}
				>
					<DialogTrigger asChild>
						<Button>
							<Plus className='h-4 w-4 mr-2' />
							New Document
						</Button>
					</DialogTrigger>
					<DialogContent className='max-w-2xl'>
						<DialogHeader>
							<DialogTitle>
								{selectedDocument ? 'Edit Document' : 'Add New Document'}
							</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleSubmit} className='space-y-6'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label htmlFor='code'>Document Code</Label>
									<Input
										id='code'
										name='code'
										defaultValue={selectedDocument?.code}
										required
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='document_name'>Document Name</Label>
									<Input
										id='document_name'
										name='document_name'
										defaultValue={selectedDocument?.document_name}
										required
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='document_type_id'>Document Type</Label>
									<Select
										name='document_type_id'
										defaultValue={selectedDocument?.document_type_id}
									>
										<SelectTrigger>
											<SelectValue placeholder='Select document type' />
										</SelectTrigger>
										<SelectContent>
											{documentTypes.map((type) => (
												<SelectItem key={type.id} value={type.id}>
													{type.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='document_state'>Document State</Label>
									<Select
										name='document_state'
										defaultValue={selectedDocument?.document_state}
									>
										<SelectTrigger>
											<SelectValue placeholder='Select state' />
										</SelectTrigger>
										<SelectContent>
											{DOCUMENT_STATE_CHOICES.map((state) => (
												<SelectItem key={state.value} value={state.value}>
													{state.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='creation_date'>Creation Date</Label>
									<Input
										id='creation_date'
										name='creation_date'
										type='date'
										defaultValue={selectedDocument?.creation_date}
										required
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='revision_date'>Revision Date</Label>
									<Input
										id='revision_date'
										name='revision_date'
										type='date'
										defaultValue={selectedDocument?.revision_date}
										required
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='retention_period'>Retention Period</Label>
									<Input
										id='retention_period'
										name='retention_period'
										type='date'
										defaultValue={selectedDocument?.retention_period}
										required
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='disposal_method'>Disposal Method</Label>
									<Input
										id='disposal_method'
										name='disposal_method'
										defaultValue={selectedDocument?.disposal_method}
										required
									/>
								</div>
							</div>
							{/* File Upload Field */}
							<div className='space-y-2'>
								<Label htmlFor='file'>Document File</Label>
								<div
									onDragOver={handleDragOver}
									onDrop={handleDrop}
									onClick={handleClickDropZone}
									className='border border-dashed p-4 rounded cursor-pointer text-center'
								>
									{selectedFileName ? (
										<div>Selected file: {selectedFileName}</div>
									) : selectedDocument?.document_path ? (
										<div>
											Current file:{' '}
											{selectedDocument.document_path.split('/').pop()}
										</div>
									) : (
										<div>Drag and drop a file here, or click to select one</div>
									)}
								</div>
								<Input
									id='file'
									name='file'
									type='file'
									accept='.pdf,.docx,.xls,.xlsx,image/jpeg,image/png'
									onChange={handleFileChange}
									ref={fileInputRef}
									style={{ display: 'none' }}
									required={!selectedDocument?.document_path}
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='observation'>Observations</Label>
								<Textarea
									id='observation'
									name='observation'
									defaultValue={selectedDocument?.observation}
									className='min-h-[100px]'
								/>
							</div>
							<div className='flex justify-end gap-4'>
								<Button
									type='button'
									variant='outline'
									onClick={() => {
										setIsDialogOpen(false);
										dispatch(setSelectedDocument(null));
									}}
									disabled={isSubmitting}
								>
									Cancel
								</Button>
								<Button type='submit' disabled={isSubmitting}>
									{isSubmitting && (
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
									)}
									{selectedDocument ? 'Update' : 'Create'} Document
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
							<TableHead>Code</TableHead>
							<TableHead>Name</TableHead>
							<TableHead>Type</TableHead>
							<TableHead>State</TableHead>
							<TableHead>Creation Date</TableHead>
							<TableHead>Revision Date</TableHead>
							<TableHead>File</TableHead>
							<TableHead className='text-right'>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{documents.map((doc) => (
							<TableRow key={doc.id}>
								<TableCell>{doc.code}</TableCell>
								<TableCell>{doc.document_name}</TableCell>
								<TableCell>{doc.document_type?.name}</TableCell>
								<TableCell>{doc.document_state}</TableCell>
								<TableCell>{doc.creation_date}</TableCell>
								<TableCell>{doc.revision_date}</TableCell>
								<TableCell>
									{doc.document_path ? (
										<a
											href={getPublicUrl(doc.document_path)}
											target='_blank'
											rel='noopener noreferrer'
											className='flex items-center space-x-2'
										>
											{doc.document_path.endsWith('.pdf') ? (
												<FileText className='w-4 h-4' />
											) : doc.document_path.match(/\.(jpg|jpeg|png)$/i) ? (
												<ImageIcon className='w-4 h-4' />
											) : (
												<FileIcon className='w-4 h-4' />
											)}
											<span>{doc.document_path.split('/').pop()}</span>
										</a>
									) : (
										'No file'
									)}
								</TableCell>
								<TableCell className='text-right'>
									<div className='flex justify-end gap-2'>
										{doc.document_path && (
											<Button
												variant='outline'
												size='icon'
												onClick={() => handleDownload(doc.document_path)}
											>
												<Download className='h-4 w-4' />
											</Button>
										)}
										<Button
											variant='outline'
											size='icon'
											onClick={() => handleEdit(doc)}
										>
											<Edit className='h-4 w-4' />
										</Button>
										<Button
											variant='outline'
											size='icon'
											className='text-destructive hover:text-destructive'
											onClick={() => handleDelete(doc.id)}
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
