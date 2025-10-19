-- AlterTable
CREATE SEQUENCE commandconfig_id_seq;
ALTER TABLE "CommandConfig" ALTER COLUMN "id" SET DEFAULT nextval('commandconfig_id_seq');
ALTER SEQUENCE commandconfig_id_seq OWNED BY "CommandConfig"."id";
