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
		bidAmount: Number(proposal.bidAmount),
	}));
};

export const getProposalsByFreelancerIdService = async (
	freelancerId: string,
) => {
	const proposals = await getProposalsByFreelancerIdRepo(freelancerId);
	return proposals.map((proposal) => ({
		...proposal,
		bidAmount: Number(proposal.bidAmount),
	}));
};

export const getProposalService = async (userId: string, id: string) => {
	const proposal = await getProposalRepo(userId, id);

	if (!proposal)
		throw new AppError(
			404,
			"Proposal not found or you are not authorized to view it",
		);
	return {
		...proposal,
		bidAmount: Number(proposal.bidAmount),
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
		bidAmount: Number(updatedProposal.bidAmount),
	};
};
