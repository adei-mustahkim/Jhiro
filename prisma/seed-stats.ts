import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Upsert stats CMS section
  const existing = await prisma.cMSContent.findUnique({
    where: { section_locale: { section: 'stats', locale: 'ID' } },
  })

  const data = {
    stat1Value: '50',
    stat1Label: 'produk diluncurkan',
    stat2Value: '30+',
    stat2Label: 'partner bisnis',
    stat3Value: '3+ th',
    stat3Label: 'pengalaman kolektif',
    stat4Value: '4.9/5',
    stat4Label: 'kepuasan partner',
  }

  if (existing) {
    await prisma.cMSContent.update({
      where: { id: existing.id },
      data: { content: data },
    })
    console.log('Updated existing stats CMS section')
  } else {
    await prisma.cMSContent.create({
      data: {
        section: 'stats',
        locale: 'ID',
        content: data,
      },
    })
    console.log('Created new stats CMS section')
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
