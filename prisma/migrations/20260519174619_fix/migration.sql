/*
  Warnings:

  - The primary key for the `roles_permissions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `permission_id` on the `roles_permissions` table. All the data in the column will be lost.
  - Added the required column `permission_code` to the `roles_permissions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "roles_permissions" DROP CONSTRAINT "roles_permissions_permission_id_fkey";

-- AlterTable
ALTER TABLE "roles_permissions" DROP CONSTRAINT "roles_permissions_pkey",
DROP COLUMN "permission_id",
ADD COLUMN     "permission_code" TEXT NOT NULL,
ADD CONSTRAINT "roles_permissions_pkey" PRIMARY KEY ("role_id", "permission_code");

-- AddForeignKey
ALTER TABLE "roles_permissions" ADD CONSTRAINT "roles_permissions_permission_code_fkey" FOREIGN KEY ("permission_code") REFERENCES "permissions"("code") ON DELETE CASCADE ON UPDATE CASCADE;
