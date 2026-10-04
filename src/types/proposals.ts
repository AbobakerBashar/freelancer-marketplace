import z from "zod";
import {
	proposalCreateSchema,
	proposalUpdateSchema,
} from "../schemas/proposals.js";

export type ProposalCreateInputs = z.infer<typeof proposalCreateSchema>;

export type ProposalUpdateInputs = z.infer<typeof proposalUpdateSchema>;

export type Proposal = ProposalCreateInputs & {
	id: string;
	freelancerId: string;
	projectId: string;
	createdAt: Date;
	updatedAt: Date;
	status: string;
	bidAmount: number;
};

export type ProposalWithProject = Proposal & {
	project: {
		title: string;
		currency: string;
		description: string;
		budgetMax: number;
		budgetMin: number;
		skills: string[];
		client: {
			name: string;
		};
	};
};

export type ProposalsResponse = {
	success: boolean;
	message: string;
	proposals?: ProposalWithProject[];
};

export type ProposalResponse = {
	success: boolean;
	message: string;
	proposal?: ProposalWithProject;
};

export type ProposalStat = {
	status: string;
	count: number;
};

export type ProposalStatsResponse = {
	success: boolean;
	message: string;

	stats?: {
		pending: number;
		accepted: number;
		rejected: number;
		withdrawn: number;
		totalCount: number;
	};
};

export type ProjectsProposalsCountRes = {
	success: boolean;
	message: string;
	proposalsCounts?: {
		projectId: string;
		proposalsCount: number;
	}[];
};
