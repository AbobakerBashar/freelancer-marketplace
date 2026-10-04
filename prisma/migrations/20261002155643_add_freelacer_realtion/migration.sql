-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "freelancerId" UUID,
ADD COLUMN     "userId" UUID;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
