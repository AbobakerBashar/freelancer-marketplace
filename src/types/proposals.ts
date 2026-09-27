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
	project: {
		title: string;
		skills: string[];
		client: {
			name: string;
		};
	};
};

export type ProposalsResponse = {
	success: boolean;
	message: string;
	proposals?: Proposal[];
};

export type ProposalResponse = {
	success: boolean;
	message: string;
	proposal?: Proposal;
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
