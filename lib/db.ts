import { PrismaClient } from '@prisma/client'
import { PrismaPlanetScale } from '@prisma/adapter-planetscale'
import { Client } from '@planetscale/database'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not set')
}

const client = new Client({ url: connectionString })

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPlanetScale(client),
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma