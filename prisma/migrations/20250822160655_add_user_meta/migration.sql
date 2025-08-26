-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "phone" TEXT;
