
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Attempting to connect to the database...')
    await prisma.$connect()
    console.log('Successfully connected to the database!')
    const userCount = await prisma.user.count()
    console.log(`Successfully queried the database. Total users: ${userCount}`)
  } catch (error) {
    console.error('Failed to connect to the database:')
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
