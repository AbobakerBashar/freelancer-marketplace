import {
	getProposalsByProjectIdRepo,
	getProposalsByFreelancerIdRepo,
	getProposalRepo,
	createProposalRepo,
	updateProposalRepo,
	deleteProposalRepo,
	getProposalOwnership,
	acceptProposalRepo,
	rejectProposalRepo,
	getProposalsStatsByUserIdRepo,
	getProjectsProposalsCount,
	withdrawRepo,
} from "../repositories/proposals.js";
import type {
	ProposalCreateInputs,
	ProposalUpdateInputs,
} from "../types/proposals.js";
import { AppError } from "../utils/AppError.js";

export const getProposalsByProjectIdService = async (
	projectId: string,
	clientId: string,
) => {
	const proposals = await getProposalsByProjectIdRepo(projectId, clientId);
	return proposals.map((proposal) => ({
		...proposal,
		project: {
			...proposal.project,
			budgetMax: Number(proposal.project.budgetMax || ""),
			budgetMin: Number(proposal.project.budgetMin || ""),
		},
		bidAmount: Number(proposal.bidAmount),
	}));
};

export const getProposalsByFreelancerIdService = async (
	freelancerId: string,
) => {
	const proposals = await getProposalsByFreelancerIdRepo(freelancerId);
	return proposals.map((proposal) => ({
		...proposal,
		project: {
			...proposal.project,
			budgetMax: Number(proposal.project.budgetMax || ""),
			budgetMin: Number(proposal.project.budgetMin || ""),
		},
		bidAmount: Number(proposal.bidAmount),
	}));
};

export const getProjectsProposalsCountService = async (clientId?: string) => {
	const proposalsCounts = await getProjectsProposalsCount(clientId);

	const formattedCounts = proposalsCounts.map((count) => ({
		projectId: count.projectId,
		proposalsCount: count._count.id,
	}));

	return formattedCounts;
};

export const getProposalsStatsByUserIdService = async (userId: string) => {
	const stats = await getProposalsStatsByUserIdRepo(userId);

	// Calculate total count
	const totalCount =
		stats.pending + stats.accepted + stats.rejected + stats.withdrawn;

	return {
		...stats,
		totalCount,
	};
};

export const getProposalService = async (
	proposalId: string,
	freelancerId: string | undefined,
) => {
	const proposal = await getProposalRepo(proposalId, freelancerId);

	if (!proposal)
		throw new AppError(
			404,
			"Proposal not found or you are not authorized to view it",
		);

	return {
		...proposal,
		bidAmount: Number(proposal.bidAmount),
		project: {
			...proposal.project,
			budgetMax: Number(proposal.project.budgetMax || ""),
			budgetMin: Number(proposal.project.budgetMin || ""),
		},
	};
};

export const createProposalService = async (
	freelancerId: string,
	projectId: string,
	proposalData: ProposalCreateInputs,
) => {
	const proposal = await createProposalRepo(
		freelancerId,
		projectId,
		proposalData,
	);
	return {
		...proposal,
		project: {
			...proposal.project,
			budgetMax: Number(proposal.project.budgetMax || ""),
			budgetMin: Number(proposal.project.budgetMin || ""),
		},
		bidAmount: Number(proposal.bidAmount),
	};
};

export const updateProposalService = async (
	freelancerId: string,
	proposalId: string,
	proposalData: ProposalUpdateInputs,
) => {
	const proposal = await updateProposalRepo(
		freelancerId,
		proposalId,
		proposalData,
	);

	return {
		...proposal,
		project: {
			...proposal.project,
			budgetMax: Number(proposal.project.budgetMax || ""),
			budgetMin: Number(proposal.project.budgetMin || ""),
		},
		bidAmount: Number(proposal.bidAmount),
	};
};

export const deleteProposalService = async (
	freelancerId: string,
	id: string,
) => {
	// Check ownership
	const propsal = await getProposalOwnership(id);

	if (!propsal || propsal.freelancerId !== freelancerId)
		throw new AppError(
			404,
			"Proposal not fount or you are not authorized to delete it",
		);

	return await deleteProposalRepo(id);
};

export const acceptProposalService = async (
	clientId: string,
	proposalId: string,
) => {
	const updatedProposal = await acceptProposalRepo(clientId, proposalId);
	return {
		...updatedProposal,
		project: {
			...updatedProposal.project,
			budgetMax: Number(updatedProposal.project.budgetMax || ""),
			budgetMin: Number(updatedProposal.project.budgetMin || ""),
		},
		bidAmount: Number(updatedProposal.bidAmount),
	};
};

export const rejectProposalService = async (
	clientId: string,
	proposalId: string,
) => {
	const updatedProposal = await rejectProposalRepo(clientId, proposalId);
	return {
		...updatedProposal,
		project: {
			...updatedProposal.project,
			budgetMax: Number(updatedProposal.project.budgetMax || ""),
			budgetMin: Number(updatedProposal.project.budgetMin || ""),
		},
		bidAmount: Number(updatedProposal.bidAmount),
	};
};

export const withdrawService = async (
	freelancerId: string,
	proposalId: string,
) => {
	const proposal = await withdrawRepo(freelancerId, proposalId);

	return {
		...proposal,
		project: {
			...proposal.project,
			budgetMax: Number(proposal.project.budgetMax || ""),
			budgetMin: Number(proposal.project.budgetMin || ""),
		},
		bidAmount: Number(proposal.bidAmount),
	};
};
