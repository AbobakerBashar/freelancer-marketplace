export async function proposalsSeed(prisma: any) {
  const freelancers = await prisma.user.findMany({
    where: {
      role: "FREELANCER",
    },
    select: {
      id: true,
    },
  });

  const projects = await prisma.project.findMany({
    where: {
      status: {
        in: ["OPEN", "DRAFT"],
      },
    },
    select: {
      id: true,
    },
  });

  if (freelancers.length === 0 || projects.length === 0) {
    throw new Error(
      "You need freelancers and projects before creating proposals.",
    );
  }

  await prisma.proposal.createMany({
    data: [
      {
        projectId: projects[0].id,
        freelancerId: freelancers[0].id,
        coverLetter:
          "I have strong experience building full-stack applications with React, Next.js, Node.js, and PostgreSQL.",
        bidAmount: 750,
        deliveryDays: 14,
        status: "PENDING",
      },

      {
        projectId: projects[0].id,
        freelancerId: freelancers[1].id,
        coverLetter:
          "I can build this project with a clean and scalable architecture and deliver it within the requested timeframe.",
        bidAmount: 900,
        deliveryDays: 18,
        status: "REJECTED",
      },

      {
        projectId: projects[1].id,
        freelancerId: freelancers[0].id,
        coverLetter:
          "I would be happy to work on this project. I have experience with the technologies mentioned in the description.",
        bidAmount: 500,
        deliveryDays: 10,
        status: "ACCEPTED",
      },
    ],
  });
}
