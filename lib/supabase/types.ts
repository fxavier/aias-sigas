//import { Database } from './database.types';

export type WasteManagement = {
	id: string;
	waste_route: string;
	labelling: string;
	storage: string;
	transportation_company_method: string;
	disposal_company: string;
	special_instructions?: string;
	created_at: string;
	updated_at: string;
};

export type WasteTransferLog = {
	id: string;
	waste_type: string;
	how_is_waste_contained: string;
	how_much_waste: number;
	reference_number: string;
	date_of_removal: string;
	transfer_company: string;
	special_instructions?: string;
	created_at: string;
	updated_at: string;
};

export type StrategicObjective = {
	id: string;
	description: string;
	goals: string;
	strategies_for_achievement: string;
	created_at: string;
	updated_at: string;
};

export type SpecificObjective = {
	id: string;
	strategic_objective: string;
	specific_objective: string;
	actions_for_achievement: string;
	responsible_person: string;
	necessary_resources: string;
	indicator: string;
	goal: string;
	monitoring_frequency: string;
	deadline: string;
	observation?: string;
	created_at: string;
	updated_at: string;
};

export type Department = {
	id: string;
	name: string;
	head: string;
	employees: number;
	location: string;
	contact: string;
	created_at: string;
	updated_at: string;
};

export type IncidentReport = {
	id: string;
	nome: string;
	funcao: string;
	departamento: string;
	data: string;
	hora: string;
	local: string;
	actividade_em_curso: string;
	descricao_do_acidente: string;
	tipo_de_incidente: string;
	equipamento_envolvido: string;
	observacao?: string;
	colaborador_envolvido_outro_acidente_antes: 'Sim' | 'Não';
	realizada_analise_risco_impacto_ambiental_antes: 'Sim' | 'Não';
	existe_procedimento_para_actividade: 'Sim' | 'Não';
	colaborador_recebeu_treinamento: 'Sim' | 'Não';
	incidente_envolve_empreteiro: 'Sim' | 'Não';
	nome_comercial_empreteiro?: string;
	natureza_e_extensao_incidente: string;
	created_at: string;
	updated_at: string;
};

export type WorkerGrievance = {
	id: string;
	name: string;
	company: string;
	date: string;
	prefered_contact_method: 'EMAIL' | 'PHONE' | 'FACE_TO_FACE';
	contact: string;
	prefered_language: 'PORTUGUESE' | 'ENGLISH' | 'OTHER';
	other_language?: string;
	grievance_details: string;
	status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
	created_at: string;
	updated_at: string;
};

export type TrainingNeed = {
	id: string;
	filled_by: string;
	date: string;
	department_id: string;
	department?: Department;
	training: string;
	training_objective: string;
	proposal_of_training_entity: string;
	potential_training_participants: string;
	created_at: string;
	updated_at: string;
};

export type TrainingPlan = {
	id: string;
	updated_by: string;
	date: string;
	year: number;
	training_area: string;
	training_title: string;
	training_objective: string;
	training_type: 'Internal' | 'External';
	training_entity: string;
	duration: string;
	number_of_trainees: number;
	training_recipients: string;
	training_month: string;
	training_status: 'Planned' | 'Completed';
	observations?: string;
	created_at: string;
	updated_at: string;
};

export type TrainingEvaluationQuestion = {
	id: string;
	question: string;
	created_at: string;
	updated_at: string;
};

export type TrainingEffectiveness = {
	id: string;
	training: string;
	date: string;
	department_id: string;
	department?: Department;
	trainee: string;
	immediate_supervisor: string;
	training_evaluation_question_id: string;
	training_evaluation_question?: TrainingEvaluationQuestion;
	answer: 'Satisfactory' | 'Partially Satisfactory' | 'Unsatisfactory';
	human_resource_evaluation: 'effective' | 'ineffective';
	created_at: string;
	updated_at: string;
};

export type Position = {
	id: string;
	name: string;
	created_at: string;
	updated_at: string;
};

export type Training = {
	id: string;
	name: string;
	created_at: string;
	updated_at: string;
};

export type ToolboxTalk = {
	id: string;
	name: string;
	created_at: string;
	updated_at: string;
};

export type TrainingMatrix = {
	id: string;
	date: string;
	position_id: string;
	position?: Position;
	training_id: string;
	training?: Training;
	toolbox_talks_id: string;
	toolbox_talks?: ToolboxTalk;
	effectiveness: 'EFFECTIVE' | 'NOT_EFFECTIVE';
	actions_training_not_effective?: string;
	approved_by: string;
	created_at: string;
	updated_at: string;
};

export type DocumentType = {
	id: string;
	name: string;
	description?: string;
	created_at: string;
	updated_at: string;
};

export type Document = {
	id: string;
	code: string;
	creation_date: string;
	revision_date: string;
	document_name: string;
	document_type_id: string;
	document_type?: DocumentType;
	document_path: string;
	document_state: 'REVISION' | 'INUSE' | 'OBSOLETE';
	retention_period: string;
	disposal_method: string;
	observation?: string;
	created_by?: string;
	created_at: string;
	updated_at: string;
};
