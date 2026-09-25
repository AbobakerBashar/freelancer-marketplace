import prisma from "../config/prisma.js";
import type {
	ProposalCreateInputs,
	ProposalUpdateInputs,
} from "../types/proposals.js";
import { AppError } from "../utils/AppError.js";

export const getProposalsByProjectIdRepo = async (
	projectId: string,
	clientId: string,
) => {
	const proposals = await prisma.proposal.findMany({
		where: {
			projectId,
			project: {
				clientId,
			},
		},
	});
	return proposals;
};

export const getProposalsByFreelancerIdRepo = async (freelancerId: string) => {
	return await prisma.proposal.findMany({
		where: {
			freelancerId,
		},
	});
};

export const getProposalRepo = async (userId: string, id: string) => {
	return await prisma.proposal.findFirst({
		where: {
			AND: [
				{ id },
				{ OR: [{ freelancerId: userId }, { project: { clientId: userId } }] },
			],
		},
	});
};

export const createProposalRepo = async (
	freelancerId: string,
	projectId: string,
	proposalData: ProposalCreateInputs,
) => {
	return await prisma.proposal.create({
		data: {
			...proposalData,
			freelancerId,
			projectId,
		},
	});
};

export const updateProposalRepo = async (
	freelancerId: string,
	proposalId: string,
	proposalData: ProposalUpdateInputs,
) => {
	return await prisma.proposal.update({
		where: {
			id: proposalId,
			freelancerId,
		},
		data: proposalData,
	});
};

export const getProposalOwnership = async (id: string) => {
	return prisma.proposal.findUnique({
		where: { id },
		select: {
			freelancerId: true,
			project: {
				select: {
					clientId: true,
				},
			},
		},
	});
};

export const deleteProposalRepo = async (id: string) => {
	return await prisma.proposal.delete({
		where: { id },
	});
};

export const acceptProposalRepo = async (
	clientId: string,
	proposalId: string,
) => {
	return await prisma.$transaction(async (tx) => {
		const proposal = await tx.proposal.findUnique({
			where: { id: proposalId, project: { clientId } },
			select: {
				status: true,
				project: {
					select: {
						status: true,
					},
				},
			},
		});

		// Check if the proposal exists & if the client is authorized to accept it
		if (!proposal) {
			throw new AppError(
				404,
				"Proposal not found or you are not authorized to accept it",
			);
		}

		// Check if the proposal is already accepted
		if (proposal.status !== "PENDING") {
			throw new AppError(
				400,
				`Cannot accept proposal that is ${proposal.status}`,
			);
		}

		// Check if the project is OPEN or DRAFT
		if (proposal.project.status !== "OPEN") {
			throw new AppError(
				400,
				`Cannot accept proposal for a project that is ${proposal.project.status}`,
			);
		}

		// Update the proposal status to ACCEPTED
		const updatedProposal = await tx.proposal.update({
			where: { id: proposalId },
			data: { status: "ACCEPTED" },
		});

		// Update the project status to IN_PROGRESS
		await tx.project.update({
			where: { id: updatedProposal.projectId },
			data: { status: "IN_PROGRESS" },
		});

		return updatedProposal;
	});
};

export const rejectProposalRepo = async (
	clientId: string,
	proposalId: string,
) => {
	return await prisma.$transaction(async (tx) => {
		const proposal = await tx.proposal.findUnique({
			where: { id: proposalId, project: { clientId } },
			select: {
				status: true,
			},
		});

		// Check if the proposal exists & if the client is authorized to reject it
		if (!proposal) {
			throw new AppError(
				404,
				"Proposal not found or you are not authorized to reject it",
			);
		}

		//Check proposal status
		if (proposal.status !== "PENDING") {
			throw new AppError(
				400,
				`Cannot reject proposal that is ${proposal.status}`,
			);
		}

		// Update the proposal status to REJECTED
		const updatedProposal = await tx.proposal.update({
			where: { id: proposalId },
			data: { status: "REJECTED" },
		});

		return updatedProposal;
	});
};
