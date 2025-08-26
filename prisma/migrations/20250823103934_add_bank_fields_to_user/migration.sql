-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "bankAccountName" TEXT,
ADD COLUMN     "bankAccountNumber" TEXT,
ADD COLUMN     "bankBranchCode" TEXT,
ADD COLUMN     "bankCurrency" TEXT,
ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "bankVerified" BOOLEAN DEFAULT false;
