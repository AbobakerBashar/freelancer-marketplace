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
		include: {
			project: {
				select: {
					title: true,
					skills: true,
					currency: true,
					description: true,
					budgetMax: true,
					budgetMin: true,
					client: {
						select: {
							name: true,
						},
					},
				},
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
		include: {
			project: {
				select: {
					title: true,
					currency: true,
					description: true,
					budgetMax: true,
					budgetMin: true,
					skills: true,
					client: {
						select: {
							name: true,
						},
					},
				},
			},
		},
	});
};

export const getProjectsProposalsCount = async (clientId?: string) => {
	return await prisma.proposal.groupBy({
		where: {
			project: {
				clientId,
			},
		},
		by: ["projectId"],
		_count: {
			id: true,
		},
	});
};

export const getProposalsStatsByUserIdRepo = async (userId: string) => {
	function pendingCount() {
		return prisma.proposal.count({
			where: {
				freelancerId: userId,
				status: "PENDING",
			},
		});
	}

	function acceptedCount() {
		return prisma.proposal.count({
			where: {
				freelancerId: userId,
				status: "ACCEPTED",
			},
		});
	}

	function rejectedCount() {
		return prisma.proposal.count({
			where: {
				freelancerId: userId,
				status: "REJECTED",
			},
		});
	}

	function withdrawnCount() {
		return prisma.proposal.count({
			where: {
				freelancerId: userId,
				status: "WITHDRAWN",
			},
		});
	}

	const [pending, accepted, rejected, withdrawn] = await prisma.$transaction([
		pendingCount(),
		acceptedCount(),
		rejectedCount(),
		withdrawnCount(),
	]);
	return {
		pending,
		accepted,
		rejected,
		withdrawn,
	};
};

export const getProposalRepo = async (
	proposalId: string,
	freelancerId: string | undefined,
) => {
	return await prisma.proposal.findFirst({
		where: {
			AND: [{ id: proposalId }, { freelancerId }],
		},
		include: {
			project: {
				select: {
					title: true,
					currency: true,
					skills: true,
					description: true,
					budgetMax: true,
					budgetMin: true,
					client: {
						select: {
							name: true,
						},
					},
				},
			},
		},
	});
};

export const createProposalRepo = async (
	freelancerId: string,
	projectId: string,
	proposalData: ProposalCreateInputs,
) => {
	return await prisma.$transaction(async (tx) => {
		tx.$executeRaw`SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;`;

		// Lock the project row to prevent concurrent modifications
		await tx.$executeRaw`SELECT status FROM "Project" WHERE id = ${projectId} FOR UPDATE;`;

		// Fetch the project to check its status
		const project = await tx.project.findUnique({
			where: { id: projectId },
			select: { status: true },
		});

		// Check if the project exists
		if (!project) {
			throw new AppError(404, "Project not found.");
		}

		// Check if the project is OPEN or DRAFT
		if (project.status !== "OPEN" && project.status !== "DRAFT") {
			throw new AppError(
				400,
				`Cannot create proposal for a project that is ${project.status}`,
			);
		}

		// Create the proposal
		return await tx.proposal.create({
			data: {
				...proposalData,
				freelancerId,
				projectId,
			},
			include: {
				project: {
					select: {
						title: true,
						currency: true,
						skills: true,
						description: true,
						budgetMax: true,
						budgetMin: true,
						client: {
							select: {
								name: true,
							},
						},
					},
				},
			},
		});
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
		include: {
			project: {
				select: {
					title: true,
					currency: true,
					skills: true,
					description: true,
					budgetMax: true,
					budgetMin: true,
					client: {
						select: {
							name: true,
						},
					},
				},
			},
		},
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
			include: {
				project: {
					select: {
						title: true,
						currency: true,
						skills: true,
						description: true,
						budgetMax: true,
						budgetMin: true,
						client: {
							select: {
								name: true,
							},
						},
					},
				},
			},
		});

		// Update the project status to IN_PROGRESS
		await tx.project.update({
			where: { id: updatedProposal.projectId },
			data: { status: "IN_PROGRESS" },
		});

		// Create conversation for CLIENT & FREELANCER
		await tx.conversation.create({
			data: {
				projectId: updatedProposal.projectId,
				participants: {
					create: [
						{ participantId: updatedProposal.freelancerId },
						{ participantId: clientId },
					],
				},
			},
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
			include: {
				project: {
					select: {
						title: true,
						currency: true,
						skills: true,
						description: true,
						budgetMax: true,
						budgetMin: true,
						client: {
							select: {
								name: true,
							},
						},
					},
				},
			},
		});

		return updatedProposal;
	});
};

export const withdrawRepo = async (
	freelancerId: string,
	proposalId: string,
) => {
	const proposal = await prisma.proposal.findUnique({
		where: { id: proposalId },
		select: { status: true },
	});

	if (!proposal) throw new AppError(404, "Proposal not found");
	// Check if allowed to withdraw
	if (proposal.status !== "PENDING")
		throw new AppError(
			400,
			`Cannot withdraw from proposal that is ${proposal.status}`,
		);

	// Withdraw
	return await prisma.proposal.update({
		where: { id: proposalId, freelancerId },
		data: { status: "WITHDRAWN" },
		include: {
			project: {
				select: {
					title: true,
					currency: true,
					skills: true,
					description: true,
					budgetMax: true,
					budgetMin: true,
					client: {
						select: {
							name: true,
						},
					},
				},
			},
		},
	});
};
