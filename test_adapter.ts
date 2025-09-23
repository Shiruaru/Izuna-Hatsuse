
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// This is just to check the type definitions
async function testAdapter() {
  const pool = new Pool({ connectionString: 'postgresql://user:password@localhost:5432/mydb' });
  
  // Create the adapter
  const adapter = new PrismaPg(pool);
  
  // Check what properties and methods are available on the adapter
  console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(adapter)));
  
  // Create the Prisma client with the adapter
  const prisma = new PrismaClient({ adapter });
  
  return prisma;
}

testAdapter().catch(console.error);
