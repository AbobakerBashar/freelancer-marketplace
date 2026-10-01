import type { Request, Response } from "express";
import type {
	ProjectsProposalsCountRes,
	ProposalCreateInputs,
	ProposalResponse,
	ProposalsResponse,
	ProposalStatsResponse,
	ProposalUpdateInputs,
} from "../types/proposals.js";
import {
	getProposalsByProjectIdService,
	getProposalsByFreelancerIdService,
	createProposalService,
	updateProposalService,
	deleteProposalService,
	getProposalService,
	acceptProposalService,
	rejectProposalService,
	getProposalsStatsByUserIdService,
	getProjectsProposalsCountService,
	withdrawService,
} from "../services/proposals.js";

export const getProposalsByProjectId = async (
	req: Request<{ id: string }>,
	res: Response<ProposalsResponse>,
) => {
	const projectId = req.params.id;
	const clientId = req.user?.id;

	const proposals = await getProposalsByProjectIdService(projectId, clientId!);

	res.status(200).json({
		success: true,
		message: "Proposals fetched successfully",
		proposals,
	});
};

export const getProposalsByFreelancerId = async (
	req: Request,
	res: Response<ProposalsResponse>,
) => {
	const freelancerId = req.user?.id;

	const proposals = await getProposalsByFreelancerIdService(freelancerId!);

	res.status(200).json({
		success: true,
		message: "Proposals fetched successfully",
		proposals,
	});
};

export const getProposalsStatesByUserId = async (
	req: Request,
	res: Response<ProposalStatsResponse>,
) => {
	const userId = req.user?.id;
	const stats = await getProposalsStatsByUserIdService(userId!);

	res.status(200).json({
		success: true,
		message: "Proposal states fetched successfully",
		stats,
	});
};

export const getProposal = async (
	req: Request<{ id: string }>,
	res: Response<ProposalResponse>,
) => {
	const proposalId = req.params.id;
	const freelancerId = req.query?.freelancerId as string | undefined;

	const proposal = await getProposalService(proposalId, freelancerId);
	res.status(200).json({
		success: true,
		message: "Proposal fetched successfully",
		proposal,
	});
};

export const getProjectsProposalsCount = async (
	req: Request,
	res: Response<ProjectsProposalsCountRes>,
) => {
	const clientId = req.query?.clientId as string | undefined;
	const proposalsCounts = await getProjectsProposalsCountService(clientId);

	res.status(200).json({
		success: true,
		message: "Proposals counts fetched successfully",
		proposalsCounts,
	});
};

export const createProposal = async (
	req: Request<{ id: string }, {}, ProposalCreateInputs>,
	res: Response<ProposalResponse>,
) => {
	const freelancerId = req.user?.id;
	const role = req.user?.role;
	const projectId = req.params.id;

	if (role !== "FREELANCER") {
		return res.status(403).json({
			success: false,
			message: "Only freelancers can create proposals",
		});
	}

	const proposal = await createProposalService(
		freelancerId!,
		projectId,
		req.body,
	);

	res.status(201).json({
		success: true,
		message: "Proposal created successfully",
		proposal,
	});
};

export const updateProposal = async (
	req: Request<{ id: string }, {}, ProposalUpdateInputs>,
	res: Response<ProposalResponse>,
) => {
	const proposalId = req.params.id;
	const flreelancerId = req.user?.id;

	const proposal = await updateProposalService(
		flreelancerId!,
		proposalId,
		req.body,
	);

	res.status(200).json({
		success: true,
		message: "Proposal updated successfully",
		proposal,
	});
};

export const deleteProposal = async (
	req: Request<{ id: string }>,
	res: Response<ProposalResponse>,
) => {
	const freelancerId = req.user?.id;
	const proposalId = req.params.id;

	await deleteProposalService(freelancerId!, proposalId);

	res.status(204).json({
		success: true,
		message: "Proposal deleted successfully!",
	});
};

export const acceptProposal = async (
	req: Request<{ id: string }>,
	res: Response<ProposalResponse>,
) => {
	const clientId = req.user?.id;
	const proposalId = req.params.id;

	const proposal = await acceptProposalService(clientId!, proposalId);

	res.status(200).json({
		success: true,
		message: "Proposal accepted successfully",
		proposal,
	});
};

export const rejectProposal = async (
	req: Request<{ id: string }>,
	res: Response<ProposalResponse>,
) => {
	const clientId = req.user?.id;
	const proposalId = req.params.id;

	const proposal = await rejectProposalService(clientId!, proposalId);

	res.status(200).json({
		success: true,
		message: "Proposal rejected successfully",
		proposal,
	});
};

export const withdraw = async (
	req: Request<{ id: string }>,
	res: Response<ProposalResponse>,
) => {
	const freelancerId = req.user?.id;
	const proposalId = req.params.id;

	const proposal = await withdrawService(freelancerId!, proposalId);

	res.status(200).json({
		success: true,
		message: "You successfully withdrawn!",
		proposal,
	});
};
