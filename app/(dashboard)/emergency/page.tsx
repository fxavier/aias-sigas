'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { AlertTriangle, Plus, Trash2, Loader2, Edit } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
	fetchIncidents,
	addIncident,
	editIncident,
	removeIncident,
	setSelectedIncident,
} from '@/lib/redux/features/emergencySlice';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getDepartments } from '@/lib/supabase/services/departmentsService';
import type { Department } from '@/lib/supabase/types';

const TIPO_INCIDENTE = [
	{ value: 'Humano', label: 'Humano' },
	{ value: 'Segurança', label: 'Segurança' },
	{ value: 'Infraestruturas', label: 'Infraestruturas' },
	{ value: 'Ambiental', label: 'Ambiental' },
	{ value: 'Social', label: 'Social' },
	{ value: 'Outros', label: 'Outros' },
];

const NATUREZA_EXTENSAO = [
	{ value: 'Intoxicação leve', label: 'Intoxicação leve' },
	{ value: 'Intoxicação grave', label: 'Intoxicação grave' },
	{ value: 'Ferimento leve', label: 'Ferimento leve' },
	{ value: 'Ferimento grave', label: 'Ferimento grave' },
	{ value: 'Morte', label: 'Morte' },
	{ value: 'Nenhum', label: 'Nenhum' },
	{ value: 'Outros', label: 'Outros' },
];

const POSSIVEIS_CAUSAS_METODOLOGIA = [
	{
		value: 'Falta de procedimentos para actividade',
		label: 'Falta de procedimentos para actividade',
	},
	{
		value: 'Falhas no procedimento existente',
		label: 'Falhas no procedimento existente',
	},
	{ value: 'Falta de plano de trabalho', label: 'Falta de plano de trabalho' },
	{ value: 'Falha na comunicação', label: 'Falha na comunicação' },
	{ value: 'Outros', label: 'Outros' },
];

const POSSIVEIS_CAUSAS_EQUIPAMENTOS = [
	{ value: 'Falha de equipamento', label: 'Falha de equipamento' },
	{ value: 'Equipamento inapropriado', label: 'Equipamento inapropriado' },
	{
		value: 'Falha na protecção do equipamento',
		label: 'Falha na protecção do equipamento',
	},
	{ value: 'Falha na sinalização', label: 'Falha na sinalização' },
	{
		value: 'Espaço inapropriado para equipamento',
		label: 'Espaço inapropriado para equipamento',
	},
	{ value: 'Outros', label: 'Outros' },
];

const POSSIVEIS_CAUSAS_MATERIAL = [
	{ value: 'Ferramenta defeituosa', label: 'Ferramenta defeituosa' },
	{ value: 'Falha na ferramenta', label: 'Falha na ferramenta' },
	{ value: 'Falta de inventário', label: 'Falta de inventário' },
	{ value: 'EPI inadequado', label: 'EPI inadequado' },
	{ value: 'Outros', label: 'Outros' },
];

const POSSIVEIS_CAUSAS_COLABORADORES = [
	{ value: 'Falta de treinamento', label: 'Falta de treinamento' },
	{ value: 'Negligência do colaborador', label: 'Negligência do colaborador' },
	{
		value: 'Negligência do operador sazonal',
		label: 'Negligência do operador sazonal',
	},
	{
		value: 'Não concordância com procedimentos',
		label: 'Não concordância com procedimentos',
	},
	{
		value: 'Uso inadequado de equipamento',
		label: 'Uso inadequado de equipamento',
	},
	{ value: 'Outros', label: 'Outros' },
];

const POSSIVEIS_CAUSAS_AMBIENTE_SEGURANCA = [
	{ value: 'Agentes perigosos', label: 'Agentes perigosos' },
	{ value: 'Falta de sinalização', label: 'Falta de sinalização' },
	{ value: 'Pavimento irregular', label: 'Pavimento irregular' },
	{ value: 'Pavimento escorregadio', label: 'Pavimento escorregadio' },
	{ value: 'Outros', label: 'Outros' },
];

const POSSIVEIS_CAUSAS_MEDICOES = [
	{
		value: 'Falta no instrumento de medição',
		label: 'Falta no instrumento de medição',
	},
	{
		value: 'Instrumento de ajustamento inadequado',
		label: 'Instrumento de ajustamento inadequado',
	},
	{
		value: 'Falha no instrumento de calibração',
		label: 'Falha no instrumento de calibração',
	},
	{ value: 'Falta de inspenção', label: 'Falta de inspenção' },
	{ value: 'Outros', label: 'Outros' },
];

const formSchema = z.object({
	nome: z.string().min(1, 'Nome é obrigatório'),
	funcao: z.string().min(1, 'Função é obrigatória'),
	departamento: z.string().min(1, 'Departamento é obrigatório'),
	data: z.string().min(1, 'Data é obrigatória'),
	hora: z.string().min(1, 'Hora é obrigatória'),
	local: z.string().min(1, 'Local é obrigatório'),
	actividade_em_curso: z.string().min(1, 'Atividade em curso é obrigatória'),
	descricao_do_acidente: z
		.string()
		.min(1, 'Descrição do acidente é obrigatória'),
	tipo_de_incidente: z.string().min(1, 'Tipo de incidente é obrigatório'),
	equipamento_envolvido: z
		.string()
		.min(1, 'Equipamento envolvido é obrigatório'),
	observacao: z.string().optional(),
	colaborador_envolvido_outro_acidente_antes: z.enum(['Sim', 'Não']),
	realizada_analise_risco_impacto_ambiental_antes: z.enum(['Sim', 'Não']),
	existe_procedimento_para_actividade: z.enum(['Sim', 'Não']),
	colaborador_recebeu_treinamento: z.enum(['Sim', 'Não']),
	incidente_envolve_empreteiro: z.enum(['Sim', 'Não']),
	nome_comercial_empreteiro: z.string().optional(),
	natureza_e_extensao_incidente: z
		.string()
		.min(1, 'Natureza e extensão do incidente é obrigatória'),
	possiveis_causas_acidente_metodologia: z
		.string()
		.min(1, 'Causa metodológica é obrigatória'),
	possiveis_causas_acidente_equipamentos: z
		.string()
		.min(1, 'Causa relacionada a equipamentos é obrigatória'),
	possiveis_causas_acidente_material: z
		.string()
		.min(1, 'Causa relacionada a material é obrigatória'),
	possiveis_causas_acidente_colaboradores: z
		.string()
		.min(1, 'Causa relacionada a colaboradores é obrigatória'),
	possiveis_causas_acidente_ambiente_e_seguranca: z
		.string()
		.min(1, 'Causa relacionada a ambiente e segurança é obrigatória'),
	possiveis_causas_acidente_medicoes: z
		.string()
		.min(1, 'Causa relacionada a medições é obrigatória'),
	fotografia_frontal: z.any(),
	fotografia_posterior: z.any(),
	fotografia_lateral_direita: z.any(),
	fotografia_lateral_esquerda: z.any(),
	fotografia_do_melhor_angulo: z.any(),
	fotografia: z.any(),
	investigacao: z.array(
		z.object({
			nome: z.string().min(1, 'Nome é obrigatório'),
			empresa: z.string().min(1, 'Empresa é obrigatória'),
			actividade: z.string().min(1, 'Atividade é obrigatória'),
			data: z.string().min(1, 'Data é obrigatória'),
		})
	),
	acoes_imediatas: z.array(
		z.object({
			accao: z.string().min(1, 'Ação é obrigatória'),
			descricao: z.string().min(1, 'Descrição é obrigatória'),
			responsavel: z.string().min(1, 'Responsável é obrigatório'),
			data: z.string().min(1, 'Data é obrigatória'),
		})
	),
});

type FormValues = z.infer<typeof formSchema>;

export default function Emergency() {
	const dispatch = useAppDispatch();
	const { incidents, selectedIncident, isLoading, error } = useAppSelector(
		(state) => state.emergency
	);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();
	const [departments, setDepartments] = useState<Department[]>([]);
	const [open, setOpen] = useState(false);
	const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			nome: '',
			funcao: '',
			departamento: '',
			data: '',
			hora: '',
			local: '',
			actividade_em_curso: '',
			descricao_do_acidente: '',
			tipo_de_incidente: '',
			equipamento_envolvido: '',
			observacao: '',
			colaborador_envolvido_outro_acidente_antes: 'Não',
			realizada_analise_risco_impacto_ambiental_antes: 'Não',
			existe_procedimento_para_actividade: 'Não',
			colaborador_recebeu_treinamento: 'Não',
			incidente_envolve_empreteiro: 'Não',
			nome_comercial_empreteiro: '',
			natureza_e_extensao_incidente: '',
			possiveis_causas_acidente_metodologia: '',
			possiveis_causas_acidente_equipamentos: '',
			possiveis_causas_acidente_material: '',
			possiveis_causas_acidente_colaboradores: '',
			possiveis_causas_acidente_ambiente_e_seguranca: '',
			possiveis_causas_acidente_medicoes: '',
			investigacao: [
				{
					nome: '',
					empresa: '',
					actividade: '',
					data: '',
				},
			],
			acoes_imediatas: [
				{
					accao: '',
					descricao: '',
					responsavel: '',
					data: '',
				},
			],
		},
	});

	const {
		fields: investigacaoFields,
		append: appendInvestigacao,
		remove: removeInvestigacao,
	} = useFieldArray({
		control: form.control,
		name: 'investigacao',
	});

	const {
		fields: acoesFields,
		append: appendAcao,
		remove: removeAcao,
	} = useFieldArray({
		control: form.control,
		name: 'acoes_imediatas',
	});

	const envolveEmpreteiro = form.watch('incidente_envolve_empreteiro');

	useEffect(() => {
		dispatch(fetchIncidents());
	}, [dispatch]);

	useEffect(() => {
		if (selectedIncident) {
			form.reset(selectedIncident);
		}
	}, [selectedIncident, form]);

	useEffect(() => {
		const fetchDepartments = async () => {
			try {
				setIsLoadingDepartments(true);
				const data = await getDepartments();
				setDepartments(data ?? []);
			} catch (error) {
				console.error('Error fetching departments:', error);
				toast({
					title: 'Erro ao carregar departamentos',
					description: 'Não foi possível carregar a lista de departamentos.',
					variant: 'destructive',
				});
			} finally {
				setIsLoadingDepartments(false);
			}
		};
		fetchDepartments();
	}, [toast]);

	async function onSubmit(data: FormValues) {
		try {
			setIsSubmitting(true);

			const photos: Record<string, File> = {};
			const photoFields = [
				'fotografia_frontal',
				'fotografia_posterior',
				'fotografia_lateral_direita',
				'fotografia_lateral_esquerda',
				'fotografia_do_melhor_angulo',
				'fotografia',
			];

			photoFields.forEach((field) => {
				if (data[field as keyof typeof data]?.[0]) {
					photos[field] = data[field as keyof typeof data][0];
				}
			});

			const incidentData = { ...data };
			photoFields.forEach((field) => {
				delete incidentData[field as keyof typeof incidentData];
			});

			if (selectedIncident) {
				await dispatch(
					editIncident({
						id: selectedIncident.id,
						incident: incidentData,
						photos: Object.keys(photos).length > 0 ? photos : undefined,
					})
				).unwrap();

				toast({
					title: 'Incidente atualizado',
					description: 'O incidente foi atualizado com sucesso.',
				});
			} else {
				await dispatch(
					addIncident({
						incident: incidentData,
						photos,
					})
				).unwrap();

				toast({
					title: 'Incidente registrado',
					description: 'O novo incidente foi registrado com sucesso.',
				});
			}

			form.reset();
			dispatch(setSelectedIncident(null));
		} catch (error) {
			console.error('Error submitting incident:', error);
			toast({
				title: 'Erro ao salvar incidente',
				description:
					'Ocorreu um erro ao tentar salvar o incidente. Tente novamente.',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	}

	const handleDelete = async (id: string) => {
		try {
			await dispatch(removeIncident(id)).unwrap();
			toast({
				title: 'Incidente excluído',
				description: 'O incidente foi excluído com sucesso.',
			});
		} catch (error) {
			console.error('Error deleting incident:', error);
			toast({
				title: 'Erro ao excluir incidente',
				description:
					'Ocorreu um erro ao tentar excluir o incidente. Tente novamente.',
				variant: 'destructive',
			});
		}
	};

	if (error) {
		return (
			<div className='flex flex-col items-center justify-center h-full'>
				<p className='text-destructive'>{error}</p>
				<Button onClick={() => dispatch(fetchIncidents())} className='mt-4'>
					Tentar novamente
				</Button>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center gap-4'>
				<AlertTriangle className='h-8 w-8 text-destructive' />
				<div>
					<h1 className='text-3xl font-bold'>Relatório de Incidente</h1>
					<p className='text-muted-foreground'>
						Registre informações sobre incidentes e acidentes
					</p>
				</div>
			</div>

			<Card className='p-6'>
				<h2 className='text-lg font-semibold mb-4'>Incidentes Registrados</h2>
				{isLoading ? (
					<div className='flex items-center justify-center py-8'>
						<Loader2 className='h-8 w-8 animate-spin' />
					</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Data</TableHead>
								<TableHead>Nome</TableHead>
								<TableHead>Departamento</TableHead>
								<TableHead>Tipo de Incidente</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className='text-right'>Ações</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{incidents.map((incident) => (
								<TableRow key={incident.id}>
									<TableCell>{incident.data}</TableCell>
									<TableCell>{incident.nome}</TableCell>
									<TableCell>{incident.departamento}</TableCell>
									<TableCell>{incident.tipo_de_incidente}</TableCell>
									<TableCell>
										<span className='px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800'>
											Em análise
										</span>
									</TableCell>
									<TableCell className='text-right'>
										<div className='flex justify-end gap-2'>
											<Button
												variant='outline'
												size='icon'
												onClick={() => dispatch(setSelectedIncident(incident))}
											>
												<Edit className='h-4 w-4' />
											</Button>
											<Button
												variant='outline'
												size='icon'
												className='text-destructive hover:text-destructive'
												onClick={() => handleDelete(incident.id)}
											>
												<Trash2 className='h-4 w-4' />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</Card>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
					<Card className='p-6'>
						<div className='space-y-6'>
							<h2 className='text-xl font-semibold'>Informações Básicas</h2>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<FormField
									control={form.control}
									name='nome'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Nome</FormLabel>
											<FormControl>
												<Input {...field} placeholder='Nome completo' />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='funcao'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Função</FormLabel>
											<FormControl>
												<Input {...field} placeholder='Função' />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='departamento'
									render={({ field }) => (
										<FormItem className='flex flex-col'>
											<FormLabel>Departamento</FormLabel>
											<Popover open={open} onOpenChange={setOpen}>
												<PopoverTrigger asChild>
													<FormControl>
														<Button
															variant='outline'
															role='combobox'
															aria-expanded={open}
															className={cn(
																'w-full justify-between',
																!field.value && 'text-muted-foreground'
															)}
															disabled={isLoadingDepartments}
														>
															{isLoadingDepartments ? (
																<Loader2 className='h-4 w-4 animate-spin' />
															) : field.value ? (
																departments.find(
																	(dept) => dept.name === field.value
																)?.name
															) : (
																'Selecione o departamento...'
															)}
															<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
														</Button>
													</FormControl>
												</PopoverTrigger>
												<PopoverContent className='w-[200px] p-0'>
													<Command>
														<CommandInput placeholder='Procurar departamento...' />
														<CommandEmpty>
															Nenhum departamento encontrado.
														</CommandEmpty>
														<CommandGroup>
															{departments.map((dept) => (
																<CommandItem
																	key={dept.id}
																	value={dept.name}
																	onSelect={() => {
																		form.setValue('departamento', dept.name);
																		setOpen(false);
																	}}
																>
																	<Check
																		className={cn(
																			'mr-2 h-4 w-4',
																			field.value === dept.name
																				? 'opacity-100'
																				: 'opacity-0'
																		)}
																	/>
																	{dept.name}
																</CommandItem>
															))}
														</CommandGroup>
													</Command>
												</PopoverContent>
											</Popover>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='hora'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Hora</FormLabel>
											<FormControl>
												<Input {...field} type='time' />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='local'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Local</FormLabel>
											<FormControl>
												<Input {...field} placeholder='Local do incidente' />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
					</Card>

					<Card className='p-6'>
						<div className='space-y-6'>
							<h2 className='text-xl font-semibold'>Detalhes do Incidente</h2>
							<div className='space-y-4'>
								<FormField
									control={form.control}
									name='actividade_em_curso'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Atividade em Curso</FormLabel>
											<FormControl>
												<Textarea
													{...field}
													placeholder='Descreva a atividade em curso'
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='descricao_do_acidente'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Descrição do Acidente</FormLabel>
											<FormControl>
												<Textarea
													{...field}
													placeholder='Descreva detalhadamente o acidente'
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='tipo_de_incidente'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Tipo de Incidente</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder='Selecione o tipo de incidente' />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{TIPO_INCIDENTE.map((tipo) => (
														<SelectItem key={tipo.value} value={tipo.value}>
															{tipo.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='equipamento_envolvido'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Equipamento Envolvido</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder='Equipamento envolvido no incidente'
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='observacao'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Observações</FormLabel>
											<FormControl>
												<Textarea
													{...field}
													placeholder='Observações adicionais sobre o incidente'
													className='min-h-[100px]'
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
					</Card>

					<Card className='p-6'>
						<div className='space-y-6'>
							<h2 className='text-xl font-semibold'>
								Possíveis Causas do Acidente
							</h2>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<FormField
									control={form.control}
									name='possiveis_causas_acidente_metodologia'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Metodologia</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder='Selecione a causa' />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{POSSIVEIS_CAUSAS_METODOLOGIA.map((causa) => (
														<SelectItem key={causa.value} value={causa.value}>
															{causa.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='possiveis_causas_acidente_equipamentos'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Equipamentos</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder='Selecione a causa' />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{POSSIVEIS_CAUSAS_EQUIPAMENTOS.map((causa) => (
														<SelectItem key={causa.value} value={causa.value}>
															{causa.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='possiveis_causas_acidente_material'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Material</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder='Selecione a causa' />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{POSSIVEIS_CAUSAS_MATERIAL.map((causa) => (
														<SelectItem key={causa.value} value={causa.value}>
															{causa.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='possiveis_causas_acidente_colaboradores'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Colaboradores</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder='Selecione a causa' />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{POSSIVEIS_CAUSAS_COLABORADORES.map((causa) => (
														<SelectItem key={causa.value} value={causa.value}>
															{causa.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='possiveis_causas_acidente_ambiente_e_seguranca'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Ambiente e Segurança</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder='Selecione a causa' />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{POSSIVEIS_CAUSAS_AMBIENTE_SEGURANCA.map((causa) => (
														<SelectItem key={causa.value} value={causa.value}>
															{causa.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='possiveis_causas_acidente_medicoes'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Medições</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder='Selecione a causa' />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{POSSIVEIS_CAUSAS_MEDICOES.map((causa) => (
														<SelectItem key={causa.value} value={causa.value}>
															{causa.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
					</Card>

					<Card className='p-6'>
						<div className='space-y-6'>
							<h2 className='text-xl font-semibold'>Fotografias</h2>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<FormField
									control={form.control}
									name='fotografia_frontal'
									render={({ field: { onChange, ...field } }) => (
										<FormItem>
											<FormLabel>Fotografia Frontal</FormLabel>
											<FormControl>
												<Input
													type='file'
													accept='image/*'
													onChange={(e) => onChange(e.target.files)}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='fotografia_posterior'
									render={({ field: { onChange, ...field } }) => (
										<FormItem>
											<FormLabel>Fotografia Posterior</FormLabel>
											<FormControl>
												<Input
													type='file'
													accept='image/*'
													onChange={(e) => onChange(e.target.files)}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='fotografia_lateral_direita'
									render={({ field: { onChange, ...field } }) => (
										<FormItem>
											<FormLabel>Fotografia Lateral Direita</FormLabel>
											<FormControl>
												<Input
													type='file'
													accept='image/*'
													onChange={(e) => onChange(e.target.files)}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='fotografia_lateral_esquerda'
									render={({ field: { onChange, ...field } }) => (
										<FormItem>
											<FormLabel>Fotografia Lateral Esquerda</FormLabel>
											<FormControl>
												<Input
													type='file'
													accept='image/*'
													onChange={(e) => onChange(e.target.files)}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='fotografia_do_melhor_angulo'
									render={({ field: { onChange, ...field } }) => (
										<FormItem>
											<FormLabel>Fotografia do Melhor Ângulo</FormLabel>
											<FormControl>
												<Input
													type='file'
													accept='image/*'
													onChange={(e) => onChange(e.target.files)}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='fotografia'
									render={({ field: { onChange, ...field } }) => (
										<FormItem>
											<FormLabel>Fotografia Adicional</FormLabel>
											<FormControl>
												<Input
													type='file'
													accept='image/*'
													onChange={(e) => onChange(e.target.files)}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
					</Card>

					<Card className='p-6'>
						<div className='space-y-6'>
							<h2 className='text-xl font-semibold'>Informações Adicionais</h2>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<FormField
									control={form.control}
									name='colaborador_envolvido_outro_acidente_antes'
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Colaborador envolvido em outro acidente antes?
											</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value='Sim'>Sim</SelectItem>
													<SelectItem value='Não'>Não</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='realizada_analise_risco_impacto_ambiental_antes'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Análise de risco realizada antes?</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value='Sim'>Sim</SelectItem>
													<SelectItem value='Não'>Não</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='existe_procedimento_para_actividade'
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Existe procedimento para a atividade?
											</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value='Sim'>Sim</SelectItem>
													<SelectItem value='Não'>Não</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='colaborador_recebeu_treinamento'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Colaborador recebeu treinamento?</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value='Sim'>Sim</SelectItem>
													<SelectItem value='Não'>Não</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='incidente_envolve_empreteiro'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Incidente envolve empreiteiro?</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value='Sim'>Sim</SelectItem>
													<SelectItem value='Não'>Não</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								{form.watch('incidente_envolve_empreteiro') === 'Sim' && (
									<FormField
										control={form.control}
										name='nome_comercial_empreteiro'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Nome Comercial do Empreiteiro</FormLabel>
												<FormControl>
													<Input {...field} placeholder='Nome do empreiteiro' />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								)}
							</div>
						</div>
					</Card>

					<Card className='p-6'>
						<div className='space-y-6'>
							<h2 className='text-xl font-semibold'>Equipe de Investigação</h2>
							<div className='space-y-4'>
								{investigacaoFields.map((field, index) => (
									<div
										key={field.id}
										className='space-y-4 p-4 border rounded-lg'
									>
										<div className='flex justify-between items-center'>
											<h3 className='font-medium'>Membro {index + 1}</h3>
											{index > 0 && (
												<Button
													type='button'
													variant='ghost'
													size='sm'
													onClick={() => removeInvestigacao(index)}
												>
													<Trash2 className='h-4 w-4' />
												</Button>
											)}
										</div>
										<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
											<FormField
												control={form.control}
												name={`investigacao.${index}.nome`}
												render={({ field }) => (
													<FormItem>
														<FormLabel>Nome</FormLabel>
														<FormControl>
															<Input
																{...field}
																placeholder='Nome do investigador'
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name={`investigacao.${index}.empresa`}
												render={({ field }) => (
													<FormItem>
														<FormLabel>Empresa</FormLabel>
														<FormControl>
															<Input {...field} placeholder='Empresa' />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name={`investigacao.${index}.actividade`}
												render={({ field }) => (
													<FormItem>
														<FormLabel>Atividade</FormLabel>
														<FormControl>
															<Input {...field} placeholder='Atividade' />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name={`investigacao.${index}.data`}
												render={({ field }) => (
													<FormItem>
														<FormLabel>Data</FormLabel>
														<FormControl>
															<Input {...field} type='date' />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</div>
								))}
								<Button
									type='button'
									variant='outline'
									onClick={() =>
										appendInvestigacao({
											nome: '',
											empresa: '',
											actividade: '',
											data: '',
										})
									}
								>
									<Plus className='h-4 w-4 mr-2' />
									Adicionar Membro
								</Button>
							</div>
						</div>
					</Card>

					<Card className='p-6'>
						<div className='space-y-6'>
							<h2 className='text-xl font-semibold'>Ações Imediatas</h2>
							<div className='space-y-4'>
								{acoesFields.map((field, index) => (
									<div
										key={field.id}
										className='space-y-4 p-4 border rounded-lg'
									>
										<div className='flex justify-between items-center'>
											<h3 className='font-medium'>Ação {index + 1}</h3>
											{index > 0 && (
												<Button
													type='button'
													variant='ghost'
													size='sm'
													onClick={() => removeAcao(index)}
												>
													<Trash2 className='h-4 w-4' />
												</Button>
											)}
										</div>
										<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
											<FormField
												control={form.control}
												name={`acoes_imediatas.${index}.accao`}
												render={({ field }) => (
													<FormItem>
														<FormLabel>Ação</FormLabel>
														<FormControl>
															<Input
																{...field}
																placeholder='Descrição da ação'
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name={`acoes_imediatas.${index}.descricao`}
												render={({ field }) => (
													<FormItem>
														<FormLabel>Descrição</FormLabel>
														<FormControl>
															<Textarea
																{...field}
																placeholder='Detalhes da ação'
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name={`acoes_imediatas.${index}.responsavel`}
												render={({ field }) => (
													<FormItem>
														<FormLabel>Responsável</FormLabel>
														<FormControl>
															<Input
																{...field}
																placeholder='Nome do responsável'
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name={`acoes_imediatas.${index}.data`}
												render={({ field }) => (
													<FormItem>
														<FormLabel>Data</FormLabel>
														<FormControl>
															<Input {...field} type='date' />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</div>
								))}
								<Button
									type='button'
									variant='outline'
									onClick={() =>
										appendAcao({
											accao: '',
											descricao: '',
											responsavel: '',
											data: '',
										})
									}
								>
									<Plus className='h-4 w-4 mr-2' />
									Adicionar Ação
								</Button>
							</div>
						</div>
					</Card>

					<div className='flex justify-end gap-4'>
						<Button type='button' variant='outline' disabled={isSubmitting}>
							Cancelar
						</Button>
						<Button type='submit' disabled={isSubmitting}>
							{isSubmitting && (
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							)}
							Enviar Relatório
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
