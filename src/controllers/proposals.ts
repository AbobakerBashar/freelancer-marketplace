import type { Request, Response } from "express";
import type {
	ProposalCreateInputs,
	ProposalResponse,
	ProposalsResponse,
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

export const getProposal = async (
	req: Request<{ id: string }>,
	res: Response<ProposalResponse>,
) => {
	const proposalId = req.params.id;
	const userId = req.user?.id;

	const proposal = await getProposalService(userId!, proposalId);
	res.status(200).json({
		success: true,
		message: "Proposal fetched successfully",
		proposal,
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
