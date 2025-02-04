'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
	AlertTriangle,
	FileText,
	Building2,
	Users,
	ClipboardList,
	FileSearch,
	Scale,
	Files,
	Upload,
} from 'lucide-react';

const DURATION_CHOICES = [
	{ value: 'CURTO_PRAZO', label: 'Curto Prazo' },
	{ value: 'MEDIO_PRAZO', label: 'Médio Prazo' },
	{ value: 'LONGO_PRAZO', label: 'Longo Prazo' },
];

const EXTENSION_CHOICES = [
	{ value: 'LOCAL', label: 'Local' },
	{ value: 'REGIONAL', label: 'Regional' },
	{ value: 'NACIONAL', label: 'Nacional' },
	{ value: 'GLOBAL', label: 'Global' },
];

const INTENSITY_CHOICES = [
	{ value: 'BAIXA', label: 'Baixa' },
	{ value: 'MEDIA', label: 'Média' },
	{ value: 'ALTA', label: 'Alta' },
];

const LIFE_CYCLE_CHOICES = [
	{ value: 'PRE_CONSTRUCAO', label: 'Pré-Construção' },
	{ value: 'CONSTRUCAO', label: 'Construção' },
	{ value: 'OPERACAO', label: 'Operação' },
	{ value: 'DESATIVACAO', label: 'Desativação' },
	{ value: 'ENCERRAMENTO', label: 'Encerramento' },
	{ value: 'REINTEGRACAO_RESTAURACAO', label: 'Reintegração/Restauração' },
];

const PROBABILITY_CHOICES = [
	{ value: 'IMPROVAVEL', label: 'Improvável' },
	{ value: 'PROVAVEL', label: 'Provável' },
	{ value: 'ALTAMENTE_PROVAVEL', label: 'Altamente Provável' },
	{ value: 'DEFINITIVA', label: 'Definitiva' },
];

const STATUTE_CHOICES = [
	{ value: 'POSITIVO', label: 'Positivo' },
	{ value: 'NEGATIVO', label: 'Negativo' },
];

const ACTIVITY_TYPE_CHOICES = [
	{ value: 'TURISTICA', label: 'Turística' },
	{ value: 'INDUSTRIAL', label: 'Industrial' },
	{ value: 'AGRO_PECUARIA', label: 'Agro-Pecuária' },
	{ value: 'ENERGETICA', label: 'Energética' },
	{ value: 'SERVICOS', label: 'Serviços' },
	{ value: 'OUTRA', label: 'Outra' },
];

const PROVINCES = [
	{ value: 'MAPUTO', label: 'Maputo' },
	{ value: 'MAPUTO_CITY', label: 'Maputo City' },
	{ value: 'GAZA', label: 'Gaza' },
	{ value: 'INHAMBANE', label: 'Inhambane' },
	{ value: 'SOFALA', label: 'Sofala' },
	{ value: 'MANICA', label: 'Manica' },
	{ value: 'TETE', label: 'Tete' },
	{ value: 'ZAMBEZIA', label: 'Zambezia' },
	{ value: 'NAMPULA', label: 'Nampula' },
	{ value: 'CABO_DELGADO', label: 'Cabo Delgado' },
	{ value: 'NIASSA', label: 'Niassa' },
];

const DOCUMENT_STATE_CHOICES = [
	{ value: 'REVISION', label: 'Revisão' },
	{ value: 'INUSE', label: 'Em uso' },
	{ value: 'OBSOLETE', label: 'Obsoleto' },
];

const DOCUMENT_TYPES = [
	{ value: 'POLICY', label: 'Policy' },
	{ value: 'PROCEDURE', label: 'Procedure' },
	{ value: 'FORM', label: 'Form' },
	{ value: 'REPORT', label: 'Report' },
	{ value: 'MANUAL', label: 'Manual' },
];

const documents = [
	{
		id: 1,
		code: 'DOC-2024-001',
		documentName: 'Environmental Impact Assessment',
	},
	{
		id: 2,
		code: 'DOC-2024-002',
		documentName: 'Safety Procedures Manual',
	},
];

export default function RiskManagement() {
	const [activeTab, setActiveTab] = useState('preliminary');

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold'>Risk Management</h1>
					<p className='text-muted-foreground'>
						Environmental and Social Risk Management System
					</p>
				</div>
			</div>

			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className='space-y-4'
			>
				<TabsList className='grid grid-cols-3 lg:grid-cols-7 w-full'>
					<TabsTrigger value='preliminary'>
						<FileSearch className='mr-2 h-4 w-4' />
						Preliminary Info
					</TabsTrigger>
					<TabsTrigger value='screening'>
						<ClipboardList className='mr-2 h-4 w-4' />
						Screening
					</TabsTrigger>
					<TabsTrigger value='assessment'>
						<Scale className='mr-2 h-4 w-4' />
						Assessment
					</TabsTrigger>
					<TabsTrigger value='departments'>
						<Building2 className='mr-2 h-4 w-4' />
						Departments
					</TabsTrigger>
					<TabsTrigger value='legal'>
						<FileText className='mr-2 h-4 w-4' />
						Legal Requirements
					</TabsTrigger>
					<TabsTrigger value='documents'>
						<Files className='mr-2 h-4 w-4' />
						Documents
					</TabsTrigger>
					<TabsTrigger value='mitigation'>
						<AlertTriangle className='mr-2 h-4 w-4' />
						Mitigation
					</TabsTrigger>
				</TabsList>

				<TabsContent value='preliminary' className='space-y-4'>
					<Card className='p-6'>
						<h2 className='text-lg font-semibold mb-4'>
							Preliminary Environmental Information
						</h2>
						<div className='space-y-4'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label htmlFor='activity_name'>Activity Name</Label>
									<Input id='activity_name' placeholder='Enter activity name' />
								</div>
								<div className='space-y-2'>
									<Label htmlFor='activity_type'>Activity Type</Label>
									<Select>
										<SelectTrigger>
											<SelectValue placeholder='Select activity type' />
										</SelectTrigger>
										<SelectContent>
											{ACTIVITY_TYPE_CHOICES.map((type) => (
												<SelectItem key={type.value} value={type.value}>
													{type.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='address'>Address</Label>
									<Input id='address' placeholder='Enter address' />
								</div>
								<div className='space-y-2'>
									<Label htmlFor='province'>Province</Label>
									<Select>
										<SelectTrigger>
											<SelectValue placeholder='Select province' />
										</SelectTrigger>
										<SelectContent>
											{PROVINCES.map((province) => (
												<SelectItem key={province.value} value={province.value}>
													{province.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='email'>Email</Label>
									<Input id='email' type='email' placeholder='Enter email' />
								</div>
								<div className='space-y-2'>
									<Label htmlFor='phone'>Phone</Label>
									<Input id='phone' placeholder='Enter phone number' />
								</div>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='description'>Infrastructure Description</Label>
								<Textarea
									id='description'
									placeholder='Describe the activity infrastructure'
									className='min-h-[100px]'
								/>
							</div>
							<Button>Submit Preliminary Information</Button>
						</div>
					</Card>
				</TabsContent>

				<TabsContent value='screening' className='space-y-4'>
					<Card className='p-6'>
						<h2 className='text-lg font-semibold mb-4'>
							Environmental and Social Screening
						</h2>
						<div className='space-y-4'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label htmlFor='subproject'>Subproject Name</Label>
									<Input id='subproject' placeholder='Enter subproject name' />
								</div>
								<div className='space-y-2'>
									<Label htmlFor='contract'>Contract Reference</Label>
									<Input id='contract' placeholder='Enter contract reference' />
								</div>
								<div className='space-y-2'>
									<Label htmlFor='contractor'>Contractor Name</Label>
									<Input id='contractor' placeholder='Enter contractor name' />
								</div>
								<div className='space-y-2'>
									<Label htmlFor='cost'>Estimated Cost</Label>
									<Input
										id='cost'
										type='number'
										placeholder='Enter estimated cost'
									/>
								</div>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='biodiversity'>
									Biodiversity Impact Assessment
								</Label>
								<Textarea
									id='biodiversity'
									placeholder='Describe potential impacts on biodiversity'
									className='min-h-[100px]'
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='consultation'>
									Consultation and Engagement
								</Label>
								<Textarea
									id='consultation'
									placeholder='Describe consultation and engagement activities'
									className='min-h-[100px]'
								/>
							</div>
							<Button>Submit Screening Form</Button>
						</div>
					</Card>
				</TabsContent>

				<TabsContent value='assessment' className='space-y-4'>
					<Card className='p-6'>
						<h2 className='text-lg font-semibold mb-4'>
							Risk and Impact Assessment
						</h2>
						<div className='space-y-4'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label htmlFor='life_cycle'>Life Cycle Stage</Label>
									<Select>
										<SelectTrigger>
											<SelectValue placeholder='Select life cycle stage' />
										</SelectTrigger>
										<SelectContent>
											{LIFE_CYCLE_CHOICES.map((stage) => (
												<SelectItem key={stage.value} value={stage.value}>
													{stage.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='intensity'>Impact Intensity</Label>
									<Select>
										<SelectTrigger>
											<SelectValue placeholder='Select intensity' />
										</SelectTrigger>
										<SelectContent>
											{INTENSITY_CHOICES.map((intensity) => (
												<SelectItem
													key={intensity.value}
													value={intensity.value}
												>
													{intensity.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='probability'>Probability</Label>
									<Select>
										<SelectTrigger>
											<SelectValue placeholder='Select probability' />
										</SelectTrigger>
										<SelectContent>
											{PROBABILITY_CHOICES.map((prob) => (
												<SelectItem key={prob.value} value={prob.value}>
													{prob.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='extension'>Impact Extension</Label>
									<Select>
										<SelectTrigger>
											<SelectValue placeholder='Select extension' />
										</SelectTrigger>
										<SelectContent>
											{EXTENSION_CHOICES.map((ext) => (
												<SelectItem key={ext.value} value={ext.value}>
													{ext.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='measures'>Description of Measures</Label>
								<Textarea
									id='measures'
									placeholder='Describe mitigation measures'
									className='min-h-[100px]'
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='effectiveness'>Effectiveness Assessment</Label>
								<Textarea
									id='effectiveness'
									placeholder='Assess the effectiveness of measures'
									className='min-h-[100px]'
								/>
							</div>
							<Button>Submit Assessment</Button>
						</div>
					</Card>
				</TabsContent>

				<TabsContent value='legal' className='space-y-4'>
					<Card className='p-6'>
						<h2 className='text-lg font-semibold mb-4'>
							Legal Requirements Control
						</h2>
						<div className='space-y-4'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label htmlFor='document_number'>Document Number</Label>
									<Input
										id='document_number'
										placeholder='Enter document number'
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='document_title'>Document Title</Label>
									<Input
										id='document_title'
										placeholder='Enter document title'
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='effective_date'>Effective Date</Label>
									<Input id='effective_date' type='date' />
								</div>
								<div className='space-y-2'>
									<Label htmlFor='status'>Status</Label>
									<Select>
										<SelectTrigger>
											<SelectValue placeholder='Select status' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='ACTIVE'>Active</SelectItem>
											<SelectItem value='REVOKED'>Revoked</SelectItem>
											<SelectItem value='AMENDED'>Amended</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='legal_description'>Description</Label>
								<Textarea
									id='legal_description'
									placeholder='Enter legal requirement description'
									className='min-h-[100px]'
								/>
							</div>
							<Button>Add Legal Requirement</Button>
						</div>
					</Card>
				</TabsContent>

				<TabsContent value='documents' className='space-y-4'>
					<Card className='p-6'>
						<h2 className='text-lg font-semibold mb-4'>Select Documents</h2>
						<div className='space-y-4'>
							<div className='space-y-2'>
								<Label htmlFor='document'>Document</Label>
								<Select>
									<SelectTrigger>
										<SelectValue placeholder='Select a document' />
									</SelectTrigger>
									<SelectContent>
										{documents.map((doc) => (
											<SelectItem key={doc.id} value={doc.id.toString()}>
												{doc.code} - {doc.documentName}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<Button variant='outline' className='w-full'>
								<FileText className='mr-2 h-4 w-4' />
								Add Selected Document
							</Button>
						</div>
					</Card>
				</TabsContent>

				<TabsContent value='mitigation' className='space-y-4'>
					<Card className='p-6'>
						<h2 className='text-lg font-semibold mb-4'>
							Embedded Mitigation Measures
						</h2>
						<div className='space-y-4'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label htmlFor='item_number'>Item Number</Label>
									<Input id='item_number' placeholder='Enter item number' />
								</div>
								<div className='space-y-2'>
									<Label htmlFor='issue'>Issue</Label>
									<Input id='issue' placeholder='Enter issue' />
								</div>
								<div className='space-y-2'>
									<Label htmlFor='impact'>Potential Impact Managed</Label>
									<Input id='impact' placeholder='Enter potential impact' />
								</div>
								<div className='space-y-2'>
									<Label htmlFor='timing'>Timing</Label>
									<Input id='timing' placeholder='Enter timing' />
								</div>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='mitigation_measure'>Mitigation Measure</Label>
								<Textarea
									id='mitigation_measure'
									placeholder='Describe the mitigation measure'
									className='min-h-[100px]'
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='responsibility'>
									Implementation Responsibility
								</Label>
								<Input
									id='responsibility'
									placeholder='Enter responsible party'
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='verification'>Means of Verification</Label>
								<Input
									id='verification'
									placeholder='Enter verification method'
								/>
							</div>
							<Button>Add Mitigation Measure</Button>
						</div>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
