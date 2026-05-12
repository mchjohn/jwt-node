import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../../../generated/prisma/client.js";
import { ENV } from "../../config/env.js";

const adapter = new PrismaPg({ connectionString: ENV.DATABASE_URL });
const prismaClient = new PrismaClient({ adapter });

export { prismaClient };
