'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
	AlertTriangle,
	FileText,
	Clock,
	Plus,
	Upload,
	Loader2,
	Trash2,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/supabaseClient';

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
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();

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

	async function onSubmit(data: FormValues) {
		try {
			setIsSubmitting(true);

			// Insert form data into the "emergency_reports" table in Supabase
			const { error } = await supabase.from('emergency_reports').insert(data);

			if (error) {
				throw error;
			}

			toast({
				title: 'Relatório enviado com sucesso',
				description: 'O incidente foi registrado no sistema.',
			});

			form.reset();
		} catch (error: any) {
			console.error('Error submitting form:', error);
			toast({
				title: 'Erro ao enviar relatório',
				description:
					error.message ||
					'Ocorreu um erro ao tentar salvar o relatório. Tente novamente.',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
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
										<FormItem>
											<FormLabel>Departamento</FormLabel>
											<FormControl>
												<Input {...field} placeholder='Departamento' />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='data'
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
