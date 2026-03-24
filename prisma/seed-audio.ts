import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Default Audio Presets & Mastering Chains...')

  // 18. Seed Default Audio Presets
  await prisma.audioPreset.createMany({
    data: [
      { name: 'Podcast Vocals Pro', tool: 'audio-equalizer', settings: { lowCut: 80, presence: 3000 }, isGlobal: true },
      { name: 'Lo-Fi Tape', tool: 'pitch-shifter', settings: { pitch: -2, distortion: 10 }, isGlobal: true },
      { name: 'Vocal Isolation Max', tool: 'voice-isolator', settings: { aggressiveness: 'high' }, isGlobal: true },
    ],
    skipDuplicates: true
  })

  // Seed Default Mastering Chains for Mastering Hub
  await prisma.masteringChain.createMany({
    data: [
      { 
        name: 'Radio Hit Default', 
        chain: [{ type: 'compressor' }, { type: 'eq' }, { type: 'limiter' }], 
        isGlobal: true 
      },
    ],
    skipDuplicates: true
  })

  console.log('Audio Seeding complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
