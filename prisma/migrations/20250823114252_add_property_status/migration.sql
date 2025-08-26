-- CreateEnum
CREATE TYPE "public"."PropertyStatus" AS ENUM ('draft', 'published', 'suspended');

-- AlterTable
ALTER TABLE "public"."Property" ADD COLUMN     "status" "public"."PropertyStatus" NOT NULL DEFAULT 'draft';
