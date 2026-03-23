import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding Default Video Presets...')

  const defaultPresets = [
    {
      name: 'Standard MP4 (H.264)',
      tool: 'pro-editor',
      isGlobal: true,
      settings: {
        codec: 'libx264',
        preset: 'medium',
        crf: 23,
        format: 'mp4'
      }
    },
    {
      name: 'High Quality (H.265)',
      tool: 'pro-editor',
      isGlobal: true,
      settings: {
        codec: 'libx265',
        preset: 'slow',
        crf: 18,
        format: 'mp4'
      }
    },
    {
      name: 'Web Optimized (WebM VP9)',
      tool: 'pro-editor',
      isGlobal: true,
      settings: {
        codec: 'libvpx-vp9',
        deadline: 'good',
        crf: 30,
        format: 'webm'
      }
    },
    {
      name: 'YouTube 4K Export',
      tool: 'pro-editor',
      isGlobal: true,
      settings: {
        codec: 'libx264',
        preset: 'slow',
        crf: 18,
        resolution: '3840x2160',
        format: 'mp4'
      }
    }
  ]

  for (const preset of defaultPresets) {
    await prisma.videoPreset.create({
      data: preset
    })
  }

  console.log('Seed completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
