import {
	PrismaClient,
	UserRole,
	BudgetType,
	DurationUnit,
	ProjectStatus,
} from "../src/generated/prisma/client";
import bcrypt from "bcrypt";

import { PrismaPg } from "@prisma/adapter-pg";

import dotenv from "dotenv";
dotenv.config();

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
	console.log("🌱 Starting seed...");

	// --------------------------------------------------
	// PASSWORD
	// --------------------------------------------------

	const password = await bcrypt.hash("Password123!", 10);

	// --------------------------------------------------
	// USERS
	// --------------------------------------------------

	const users = await Promise.all([
		prisma.user.create({
			data: {
				name: "Jean Claude",
				email: "jean.claude@example.com",
				password,
				bio: "Business owner looking for reliable developers and designers.",
				phone: "+250788000001",
				location: "Kigali",
				role: UserRole.CLIENT,
				isVerified: true,
				isActive: true,
			},
		}),

		prisma.user.create({
			data: {
				name: "Aline Mukamana",
				email: "aline.mukamana@example.com",
				password,
				bio: "Entrepreneur building digital products for African businesses.",
				phone: "+250788000002",
				location: "Kigali",
				role: UserRole.CLIENT,
				isVerified: true,
				isActive: true,
			},
		}),

		prisma.user.create({
			data: {
				name: "David Okello",
				email: "david.okello@example.com",
				password,
				bio: "Startup founder looking for developers and technical consultants.",
				phone: "+256700000003",
				location: "Kampala",
				role: UserRole.CLIENT,
				isVerified: true,
				isActive: true,
			},
		}),

		prisma.user.create({
			data: {
				name: "Sarah Wanjiku",
				email: "sarah.wanjiku@example.com",
				password,
				bio: "E-commerce entrepreneur.",
				phone: "+254700000004",
				location: "Nairobi",
				role: UserRole.CLIENT,
				isVerified: false,
				isActive: true,
			},
		}),

		prisma.user.create({
			data: {
				name: "Emmanuel Habimana",
				email: "emmanuel.habimana@example.com",
				password,
				bio: "Small business owner.",
				phone: "+250788000005",
				location: "Kigali",
				role: UserRole.CLIENT,
				isVerified: true,
				isActive: false,
			},
		}),

		prisma.user.create({
			data: {
				name: "Brian Otieno",
				email: "brian.otieno@example.com",
				password,
				bio: "Marketing and e-commerce business owner.",
				phone: "+254700000006",
				location: "Nairobi",
				role: UserRole.CLIENT,
				isVerified: false,
				isActive: true,
			},
		}),

		prisma.user.create({
			data: {
				name: "Abdi Hassan",
				email: "abdi.hassan@example.com",
				password,
				bio: "Technology entrepreneur and startup founder.",
				phone: "+251900000007",
				location: "Addis Ababa",
				role: UserRole.CLIENT,
				isVerified: true,
				isActive: true,
			},
		}),

		prisma.user.create({
			data: {
				name: "Grace Uwase",
				email: "grace.uwase@example.com",
				password,
				bio: "Full-stack JavaScript developer specializing in React and Node.js.",
				phone: "+250788000008",
				location: "Kigali",
				role: UserRole.FREELANCER,
				isVerified: true,
				isActive: true,
			},
		}),

		prisma.user.create({
			data: {
				name: "Samuel Kimani",
				email: "samuel.kimani@example.com",
				password,
				bio: "Full-stack developer and API engineer.",
				phone: "+254700000009",
				location: "Nairobi",
				role: UserRole.FREELANCER,
				isVerified: true,
				isActive: true,
			},
		}),

		prisma.user.create({
			data: {
				name: "Patrick Mugisha",
				email: "patrick.mugisha@example.com",
				password,
				bio: "Mobile developer specializing in Flutter.",
				phone: "+256700000010",
				location: "Kampala",
				role: UserRole.FREELANCER,
				isVerified: false,
				isActive: true,
			},
		}),

		prisma.user.create({
			data: {
				name: "Fatima Ahmed",
				email: "fatima.ahmed@example.com",
				password,
				bio: "UI/UX designer and product designer.",
				phone: "+251900000011",
				location: "Addis Ababa",
				role: UserRole.FREELANCER,
				isVerified: true,
				isActive: true,
			},
		}),

		prisma.user.create({
			data: {
				name: "Eric Niyonzima",
				email: "eric.niyonzima@example.com",
				password,
				bio: "Frontend developer focused on React and Next.js.",
				phone: "+250788000012",
				location: "Kigali",
				role: UserRole.FREELANCER,
				isVerified: false,
				isActive: true,
			},
		}),

		prisma.user.create({
			data: {
				name: "Michael Ouma",
				email: "michael.ouma@example.com",
				password,
				bio: "Backend engineer specializing in Node.js and PostgreSQL.",
				phone: "+254700000013",
				location: "Nairobi",
				role: UserRole.FREELANCER,
				isVerified: true,
				isActive: false,
			},
		}),

		prisma.user.create({
			data: {
				name: "Alice Ingabire",
				email: "alice.ingabire@example.com",
				password,
				bio: "Graphic designer and brand identity specialist.",
				phone: "+250788000014",
				location: "Kigali",
				role: UserRole.FREELANCER,
				isVerified: true,
				isActive: true,
			},
		}),

		prisma.user.create({
			data: {
				name: "Admin User",
				email: "admin@example.com",
				password,
				bio: "Marketplace administrator.",
				phone: "+250788000015",
				location: "Kigali",
				role: UserRole.ADMIN,
				isVerified: true,
				isActive: true,
			},
		}),
	]);

	const [jean, aline, david, sarah, emmanuel, brian, abdi] = users;

	// --------------------------------------------------
	// PROJECTS
	// --------------------------------------------------

	const projects = [
		{
			clientId: jean.id,
			title: "Build React E-commerce Website",
			description:
				"Build a modern e-commerce website with product browsing, cart, checkout and customer accounts.",
			category: "Web Development",
			skills: ["React", "TypeScript", "Tailwind CSS", "Node.js"],
			budgetType: BudgetType.FIXED,
			budgetMin: 800000,
			budgetMax: 1500000,
			currency: "RWF",
			duration: 4,
			durationUnit: DurationUnit.WEEKS,
			status: ProjectStatus.OPEN,
			deadline: new Date("2026-10-20"),
		},

		{
			clientId: aline.id,
			title: "Next.js SaaS Dashboard",
			description:
				"Create a responsive SaaS dashboard with authentication, analytics and user management.",
			category: "Web Development",
			skills: ["Next.js", "React", "PostgreSQL", "Prisma"],
			budgetType: BudgetType.FIXED,
			budgetMin: 1500000,
			budgetMax: 3000000,
			currency: "RWF",
			duration: 2,
			durationUnit: DurationUnit.MONTHS,
			status: ProjectStatus.OPEN,
			deadline: new Date("2026-11-15"),
		},

		{
			clientId: david.id,
			title: "Node.js REST API Development",
			description:
				"Develop a secure REST API for a business management platform.",
			category: "Web Development",
			skills: ["Node.js", "Express", "PostgreSQL", "JWT"],
			budgetType: BudgetType.FIXED,
			budgetMin: 700000,
			budgetMax: 1200000,
			currency: "RWF",
			duration: 3,
			durationUnit: DurationUnit.WEEKS,
			status: ProjectStatus.IN_PROGRESS,
			deadline: new Date("2026-10-10"),
		},

		{
			clientId: sarah.id,
			title: "Full Stack Marketplace",
			description:
				"Build a marketplace platform connecting customers with service providers.",
			category: "Web Development",
			skills: ["React", "Node.js", "PostgreSQL", "Docker"],
			budgetType: BudgetType.FIXED,
			budgetMin: 2000000,
			budgetMax: 4000000,
			currency: "RWF",
			duration: 3,
			durationUnit: DurationUnit.MONTHS,
			status: ProjectStatus.OPEN,
			deadline: new Date("2026-12-20"),
		},

		{
			clientId: brian.id,
			title: "Convert Figma Design to React",
			description:
				"Convert an existing Figma design into a responsive React application.",
			category: "Web Development",
			skills: ["React", "Tailwind CSS", "Figma"],
			budgetType: BudgetType.FIXED,
			budgetMin: 500000,
			budgetMax: 900000,
			currency: "RWF",
			duration: 2,
			durationUnit: DurationUnit.WEEKS,
			status: ProjectStatus.COMPLETED,
			deadline: new Date("2026-09-30"),
		},

		{
			clientId: abdi.id,
			title: "Fix Next.js Authentication",
			description:
				"Fix authentication issues in an existing Next.js application.",
			category: "Web Development",
			skills: ["Next.js", "JWT", "TypeScript"],
			budgetType: BudgetType.HOURLY,
			budgetMin: 15000,
			budgetMax: 25000,
			currency: "RWF",
			duration: 5,
			durationUnit: DurationUnit.DAYS,
			status: ProjectStatus.OPEN,
			deadline: new Date("2026-10-05"),
		},

		{
			clientId: jean.id,
			title: "Flutter Food Delivery App",
			description:
				"Develop a food delivery mobile application with restaurants, orders and payments.",
			category: "Mobile Development",
			skills: ["Flutter", "Dart", "Firebase"],
			budgetType: BudgetType.FIXED,
			budgetMin: 1200000,
			budgetMax: 2500000,
			currency: "RWF",
			duration: 4,
			durationUnit: DurationUnit.MONTHS,
			status: ProjectStatus.OPEN,
			deadline: new Date("2027-01-10"),
		},

		{
			clientId: aline.id,
			title: "React Native Fitness App",
			description:
				"Build a fitness tracking mobile application with workout plans and progress tracking.",
			category: "Mobile Development",
			skills: ["React Native", "TypeScript", "Firebase"],
			budgetType: BudgetType.HOURLY,
			budgetMin: 12000,
			budgetMax: 20000,
			currency: "RWF",
			duration: 6,
			durationUnit: DurationUnit.WEEKS,
			status: ProjectStatus.IN_PROGRESS,
			deadline: new Date("2026-11-01"),
		},

		{
			clientId: david.id,
			title: "Mobile Banking UI",
			description:
				"Design and implement the user interface for a mobile banking application.",
			category: "Mobile Development",
			skills: ["Flutter", "Firebase", "UI Design"],
			budgetType: BudgetType.FIXED,
			budgetMin: 1000000,
			budgetMax: 2000000,
			currency: "RWF",
			duration: 2,
			durationUnit: DurationUnit.MONTHS,
			status: ProjectStatus.OPEN,
			deadline: new Date("2026-11-20"),
		},

		{
			clientId: sarah.id,
			title: "Android Business App",
			description:
				"Create an Android application for managing inventory and sales.",
			category: "Mobile Development",
			skills: ["Kotlin", "Android", "SQLite"],
			budgetType: BudgetType.FIXED,
			budgetMin: 800000,
			budgetMax: 1500000,
			currency: "RWF",
			duration: 6,
			durationUnit: DurationUnit.WEEKS,
			status: ProjectStatus.COMPLETED,
			deadline: new Date("2026-09-25"),
		},

		{
			clientId: brian.id,
			title: "SaaS Dashboard UI Design",
			description:
				"Design a modern SaaS dashboard with reusable components and responsive layouts.",
			category: "UI/UX Design",
			skills: ["Figma", "UI Design", "Wireframing"],
			budgetType: BudgetType.FIXED,
			budgetMin: 400000,
			budgetMax: 800000,
			currency: "RWF",
			duration: 2,
			durationUnit: DurationUnit.WEEKS,
			status: ProjectStatus.OPEN,
			deadline: new Date("2026-10-12"),
		},

		{
			clientId: abdi.id,
			title: "Mobile App UX Research",
			description:
				"Conduct UX research and produce user flows and wireframes for a mobile product.",
			category: "UI/UX Design",
			skills: ["UX Research", "Figma", "Wireframing"],
			budgetType: BudgetType.HOURLY,
			budgetMin: 10000,
			budgetMax: 18000,
			currency: "RWF",
			duration: 10,
			durationUnit: DurationUnit.DAYS,
			status: ProjectStatus.OPEN,
			deadline: new Date("2026-10-15"),
		},

		{
			clientId: jean.id,
			title: "E-commerce Website Design",
			description: "Design the complete UI/UX for an online shopping platform.",
			category: "UI/UX Design",
			skills: ["Figma", "Wireframing", "Prototyping"],
			budgetType: BudgetType.FIXED,
			budgetMin: 500000,
			budgetMax: 900000,
			currency: "RWF",
			duration: 3,
			durationUnit: DurationUnit.WEEKS,
			status: ProjectStatus.COMPLETED,
			deadline: new Date("2026-09-28"),
		},

		{
			clientId: aline.id,
			title: "Landing Page Design",
			description:
				"Design a high-converting landing page for a technology startup.",
			category: "UI/UX Design",
			skills: ["Figma", "UI Design", "Prototyping"],
			budgetType: BudgetType.FIXED,
			budgetMin: 200000,
			budgetMax: 400000,
			currency: "RWF",
			duration: 5,
			durationUnit: DurationUnit.DAYS,
			status: ProjectStatus.CANCELLED,
			deadline: new Date("2026-09-25"),
		},

		{
			clientId: david.id,
			title: "Brand Identity Design",
			description:
				"Create a complete visual identity including logo, colors and typography.",
			category: "Graphic Design",
			skills: ["Photoshop", "Illustrator", "Branding"],
			budgetType: BudgetType.FIXED,
			budgetMin: 300000,
			budgetMax: 700000,
			currency: "RWF",
			duration: 2,
			durationUnit: DurationUnit.WEEKS,
			status: ProjectStatus.OPEN,
			deadline: new Date("2026-10-18"),
		},

		{
			clientId: sarah.id,
			title: "Social Media Post Designs",
			description:
				"Create a collection of social media graphics for a growing brand.",
			category: "Graphic Design",
			skills: ["Photoshop", "Canva", "Graphic Design"],
			budgetType: BudgetType.HOURLY,
			budgetMin: 8000,
			budgetMax: 15000,
			currency: "RWF",
			duration: 1,
			durationUnit: DurationUnit.WEEKS,
			status: ProjectStatus.OPEN,
			deadline: new Date("2026-10-01"),
		},

		{
			clientId: brian.id,
			title: "Restaurant Logo Design",
			description:
				"Design a professional logo and brand mark for a restaurant.",
			category: "Graphic Design",
			skills: ["Illustrator", "Photoshop", "Logo Design"],
			budgetType: BudgetType.FIXED,
			budgetMin: 150000,
			budgetMax: 300000,
			currency: "RWF",
			duration: 5,
			durationUnit: DurationUnit.DAYS,
			status: ProjectStatus.COMPLETED,
			deadline: new Date("2026-09-20"),
		},

		{
			clientId: jean.id,
			title: "Technical Blog Writing",
			description:
				"Write high-quality technical articles about modern web development.",
			category: "Writing",
			skills: ["Technical Writing", "SEO", "JavaScript"],
			budgetType: BudgetType.HOURLY,
			budgetMin: 7000,
			budgetMax: 12000,
			currency: "RWF",
			duration: 2,
			durationUnit: DurationUnit.WEEKS,
			status: ProjectStatus.OPEN,
			deadline: new Date("2026-10-08"),
		},

		{
			clientId: aline.id,
			title: "SEO Website Content",
			description: "Create SEO optimized content for a business website.",
			category: "Writing",
			skills: ["SEO", "Copywriting", "Content Writing"],
			budgetType: BudgetType.FIXED,
			budgetMin: 300000,
			budgetMax: 700000,
			currency: "RWF",
			duration: 3,
			durationUnit: DurationUnit.WEEKS,
			status: ProjectStatus.IN_PROGRESS,
			deadline: new Date("2026-10-25"),
		},

		{
			clientId: abdi.id,
			title: "Product Description Writing",
			description: "Write product descriptions for an online store.",
			category: "Writing",
			skills: ["Copywriting", "SEO", "Product Writing"],
			budgetType: BudgetType.FIXED,
			budgetMin: 150000,
			budgetMax: 300000,
			currency: "RWF",
			duration: 5,
			durationUnit: DurationUnit.DAYS,
			status: ProjectStatus.OPEN,
			deadline: new Date("2026-10-02"),
		},

		{
			clientId: david.id,
			title: "Social Media Marketing Campaign",
			description: "Plan and execute a social media marketing campaign.",
			category: "Digital Marketing",
			skills: ["Facebook Ads", "Instagram", "Marketing"],
			budgetType: BudgetType.FIXED,
			budgetMin: 500000,
			budgetMax: 1000000,
			currency: "RWF",
			duration: 1,
			durationUnit: DurationUnit.MONTHS,
			status: ProjectStatus.OPEN,
			deadline: new Date("2026-11-01"),
		},

		{
			clientId: sarah.id,
			title: "Google Ads Campaign",
			description:
				"Set up and optimize Google Ads campaigns for an e-commerce business.",
			category: "Digital Marketing",
			skills: ["Google Ads", "SEO", "Analytics"],
			budgetType: BudgetType.HOURLY,
			budgetMin: 12000,
			budgetMax: 22000,
			currency: "RWF",
			duration: 3,
			durationUnit: DurationUnit.WEEKS,
			status: ProjectStatus.OPEN,
			deadline: new Date("2026-10-30"),
		},

		{
			clientId: brian.id,
			title: "SEO Optimization",
			description:
				"Improve the search engine visibility and technical SEO of a website.",
			category: "Digital Marketing",
			skills: ["SEO", "Google Analytics", "Technical SEO"],
			budgetType: BudgetType.FIXED,
			budgetMin: 400000,
			budgetMax: 900000,
			currency: "RWF",
			duration: 1,
			durationUnit: DurationUnit.MONTHS,
			status: ProjectStatus.CANCELLED,
			deadline: new Date("2026-10-10"),
		},

		{
			clientId: jean.id,
			title: "AI Chatbot Development",
			description: "Build an AI-powered chatbot for customer support.",
			category: "AI & Data",
			skills: ["Python", "OpenAI API", "Node.js", "PostgreSQL"],
			budgetType: BudgetType.FIXED,
			budgetMin: 1500000,
			budgetMax: 3000000,
			currency: "RWF",
			duration: 2,
			durationUnit: DurationUnit.MONTHS,
			status: ProjectStatus.OPEN,
			deadline: new Date("2026-11-30"),
		},

		{
			clientId: aline.id,
			title: "Data Analysis Dashboard",
			description:
				"Build an interactive dashboard for analyzing business data.",
			category: "AI & Data",
			skills: ["Python", "Pandas", "PostgreSQL", "Data Visualization"],
			budgetType: BudgetType.FIXED,
			budgetMin: 800000,
			budgetMax: 1500000,
			currency: "RWF",
			duration: 6,
			durationUnit: DurationUnit.WEEKS,
			status: ProjectStatus.IN_PROGRESS,
			deadline: new Date("2026-11-05"),
		},

		{
			clientId: abdi.id,
			title: "Machine Learning Prediction Model",
			description:
				"Develop a machine learning model to predict customer behavior.",
			category: "AI & Data",
			skills: ["Python", "Scikit-learn", "Machine Learning"],
			budgetType: BudgetType.FIXED,
			budgetMin: 1000000,
			budgetMax: 2000000,
			currency: "RWF",
			duration: 2,
			durationUnit: DurationUnit.MONTHS,
			status: ProjectStatus.OPEN,
			deadline: new Date("2026-12-01"),
		},

		{
			clientId: emmanuel.id,
			title: "WordPress Business Website",
			description:
				"Build a professional WordPress website for a local business.",
			category: "Web Development",
			skills: ["WordPress", "PHP", "CSS"],
			budgetType: BudgetType.FIXED,
			budgetMin: 400000,
			budgetMax: 800000,
			currency: "RWF",
			duration: 2,
			durationUnit: DurationUnit.WEEKS,
			status: ProjectStatus.OPEN,
			deadline: new Date("2026-10-15"),
		},

		{
			clientId: brian.id,
			title: "Shopify Store Setup",
			description:
				"Set up and customize a Shopify store with products and payment configuration.",
			category: "E-commerce",
			skills: ["Shopify", "Liquid", "E-commerce"],
			budgetType: BudgetType.FIXED,
			budgetMin: 500000,
			budgetMax: 1000000,
			currency: "RWF",
			duration: 3,
			durationUnit: DurationUnit.WEEKS,
			status: ProjectStatus.OPEN,
			deadline: new Date("2026-10-20"),
		},

		{
			clientId: david.id,
			title: "Database Optimization",
			description:
				"Analyze and optimize PostgreSQL queries, indexes and database performance.",
			category: "Database",
			skills: ["PostgreSQL", "SQL", "Database Optimization"],
			budgetType: BudgetType.HOURLY,
			budgetMin: 15000,
			budgetMax: 30000,
			currency: "RWF",
			duration: 10,
			durationUnit: DurationUnit.DAYS,
			status: ProjectStatus.COMPLETED,
			deadline: new Date("2026-09-30"),
		},

		{
			clientId: abdi.id,
			title: "API Performance Optimization",
			description:
				"Improve the performance and scalability of an existing Node.js API.",
			category: "Web Development",
			skills: ["Node.js", "PostgreSQL", "Redis", "Performance"],
			budgetType: BudgetType.FIXED,
			budgetMin: 700000,
			budgetMax: 1500000,
			currency: "RWF",
			duration: 3,
			durationUnit: DurationUnit.WEEKS,
			status: ProjectStatus.CANCELLED,
			deadline: new Date("2026-10-05"),
		},
	];

	// --------------------------------------------------
	// CREATE PROJECTS
	// --------------------------------------------------

	await prisma.project.createMany({
		data: projects,
	});

	console.log(`✅ Created ${users.length} users`);
	console.log(`✅ Created ${projects.length} projects`);
	console.log("🌱 Seed completed!");
}

main()
	.catch((error) => {
		console.error("❌ Seed failed:", error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
