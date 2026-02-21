import { PrismaClient } from '../src/generated/prisma/client.ts'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  // ---------------------------------------------------------------------------
  // Tags — 15 across 5 categories
  // ---------------------------------------------------------------------------
  const tagData = [
    // Academic
    { name: 'Engineering' },
    { name: 'Computer Science' },
    { name: 'Pre-Med' },
    // Social
    { name: 'Social' },
    { name: 'Networking' },
    { name: 'Leadership' },
    // Athletic
    { name: 'Sports' },
    { name: 'Fitness' },
    { name: 'Outdoors' },
    // Creative
    { name: 'Music' },
    { name: 'Art' },
    { name: 'Dance' },
    // Tech
    { name: 'Robotics' },
    { name: 'AI & Machine Learning' },
    { name: 'Cybersecurity' },
  ]

  const tags: { [name: string]: { id: number; name: string } } = {}
  for (const t of tagData) {
    const tag = await prisma.tag.upsert({
      where: { name: t.name },
      update: {},
      create: t,
    })
    tags[tag.name] = tag
  }

  console.log(`Seeded ${Object.keys(tags).length} tags`)

  // ---------------------------------------------------------------------------
  // Communities — 8 clubs, each with 2–4 tags
  // ---------------------------------------------------------------------------
  const communityData = [
    {
      name: 'Gator Robotics',
      description: 'Build, compete, and innovate with autonomous robots at UF.',
      avatarUrl: 'https://picsum.photos/seed/robotics/200',
      tagNames: ['Robotics', 'Engineering', 'Computer Science'],
    },
    {
      name: 'AI Society',
      description: 'Explore machine learning, NLP, and AI research together.',
      avatarUrl: 'https://picsum.photos/seed/ai/200',
      tagNames: ['AI & Machine Learning', 'Computer Science', 'Engineering'],
    },
    {
      name: 'Pre-Med Alliance',
      description: 'Support network and resources for pre-medical students.',
      avatarUrl: 'https://picsum.photos/seed/premed/200',
      tagNames: ['Pre-Med', 'Networking', 'Leadership'],
    },
    {
      name: 'Gator Dance Collective',
      description: 'Competitive and recreational dance — all styles welcome.',
      avatarUrl: 'https://picsum.photos/seed/dance/200',
      tagNames: ['Dance', 'Social', 'Fitness'],
    },
    {
      name: 'Outdoor Adventure Club',
      description: 'Hiking, kayaking, camping, and everything in between.',
      avatarUrl: 'https://picsum.photos/seed/outdoor/200',
      tagNames: ['Outdoors', 'Fitness', 'Social'],
    },
    {
      name: 'Cybersecurity Club',
      description: 'CTF competitions, red team labs, and security workshops.',
      avatarUrl: 'https://picsum.photos/seed/cyber/200',
      tagNames: ['Cybersecurity', 'Computer Science', 'AI & Machine Learning'],
    },
    {
      name: 'Music Collective',
      description: 'Live sessions, open mics, and music production workshops.',
      avatarUrl: 'https://picsum.photos/seed/music/200',
      tagNames: ['Music', 'Art', 'Social'],
    },
    {
      name: 'Student Leadership Forum',
      description: 'Develop leadership skills through workshops and mentorship.',
      avatarUrl: 'https://picsum.photos/seed/leadership/200',
      tagNames: ['Leadership', 'Networking', 'Social'],
    },
  ]

  const communities: { [name: string]: { id: number; name: string } } = {}
  for (const c of communityData) {
    const community = await prisma.community.upsert({
      where: { name: c.name },
      update: {},
      create: {
        name: c.name,
        description: c.description,
        avatarUrl: c.avatarUrl,
        tags: {
          connect: c.tagNames.map((n) => ({ name: n })),
        },
      },
    })
    communities[community.name] = community
  }

  console.log(`Seeded ${Object.keys(communities).length} communities`)

  // ---------------------------------------------------------------------------
  // Users — 5 users with varying interest profiles
  // ---------------------------------------------------------------------------
  // user1: tech-heavy interests, many interactions → EASE can learn from them
  // user2: tag-only interests, no interactions      → cold-start / Jaccard only
  // user3: mixed interests, some interactions       → full hybrid
  // user4: interests + interactions, different tags → full hybrid
  // user5: no tags, no interactions                 → popularity baseline
  const userData = [
    {
      username: 'alice_tech',
      password: 'hashed_pw_1',
      interestTags: ['Engineering', 'Robotics', 'AI & Machine Learning', 'Computer Science'],
    },
    {
      username: 'bob_creative',
      password: 'hashed_pw_2',
      interestTags: ['Music', 'Dance', 'Art', 'Social'],
    },
    {
      username: 'carol_mixed',
      password: 'hashed_pw_3',
      interestTags: ['Leadership', 'Networking', 'Computer Science'],
    },
    {
      username: 'dave_outdoor',
      password: 'hashed_pw_4',
      interestTags: ['Outdoors', 'Fitness', 'Sports', 'Social'],
    },
    {
      username: 'eve_blank',
      password: 'hashed_pw_5',
      interestTags: [], // no interests, no interactions — tests popularity baseline
    },
  ]

  const users: { [username: string]: { id: number; username: string } } = {}
  for (const u of userData) {
    const user = await prisma.user.upsert({
      where: { username: u.username },
      update: {},
      create: {
        username: u.username,
        password: u.password,
        interests: {
          connect: u.interestTags.map((n) => ({ name: n })),
        },
      },
    })
    users[user.username] = user
  }

  console.log(`Seeded ${Object.keys(users).length} users`)

  // ---------------------------------------------------------------------------
  // Memberships — some users already joined some clubs
  // ---------------------------------------------------------------------------
  const membershipData = [
    { username: 'alice_tech', communityName: 'Gator Robotics' },
    { username: 'alice_tech', communityName: 'AI Society' },
    { username: 'carol_mixed', communityName: 'Student Leadership Forum' },
    { username: 'dave_outdoor', communityName: 'Outdoor Adventure Club' },
  ]

  for (const m of membershipData) {
    await prisma.membership.upsert({
      where: {
        userId_communityId: {
          userId: users[m.username].id,
          communityId: communities[m.communityName].id,
        },
      },
      update: {},
      create: {
        userId: users[m.username].id,
        communityId: communities[m.communityName].id,
      },
    })
  }

  console.log(`Seeded ${membershipData.length} memberships`)

  // ---------------------------------------------------------------------------
  // Interactions — ~14 rows across different types and user profiles
  //
  // weights: view=0.5, click=1.0, rsvp=2.0, join=3.0
  //
  // alice_tech: heavy interactions on tech clubs → EASE learns her profile well
  // carol_mixed: moderate interactions            → full hybrid
  // dave_outdoor: a few interactions             → mild EASE signal
  // bob_creative: NO interactions                → Jaccard-only cold-start
  // eve_blank: NO tags, NO interactions          → popularity baseline
  // ---------------------------------------------------------------------------
  type InteractionType = 'view' | 'click' | 'rsvp' | 'join'
  const weightMap: Record<InteractionType, number> = {
    view: 0.5,
    click: 1.0,
    rsvp: 2.0,
    join: 3.0,
  }

  const interactionData: {
    username: string
    communityName: string
    type: InteractionType
  }[] = [
    // alice_tech — heavy interactions across tech clubs
    { username: 'alice_tech', communityName: 'Cybersecurity Club', type: 'view' },
    { username: 'alice_tech', communityName: 'Cybersecurity Club', type: 'click' },
    { username: 'alice_tech', communityName: 'Cybersecurity Club', type: 'rsvp' },
    { username: 'alice_tech', communityName: 'AI Society', type: 'join' },
    { username: 'alice_tech', communityName: 'Gator Robotics', type: 'join' },
    { username: 'alice_tech', communityName: 'Student Leadership Forum', type: 'view' },

    // carol_mixed — moderate interactions
    { username: 'carol_mixed', communityName: 'AI Society', type: 'view' },
    { username: 'carol_mixed', communityName: 'AI Society', type: 'click' },
    { username: 'carol_mixed', communityName: 'Cybersecurity Club', type: 'view' },
    { username: 'carol_mixed', communityName: 'Student Leadership Forum', type: 'join' },
    { username: 'carol_mixed', communityName: 'Pre-Med Alliance', type: 'view' },

    // dave_outdoor — a few interactions outside memberships
    { username: 'dave_outdoor', communityName: 'Music Collective', type: 'view' },
    { username: 'dave_outdoor', communityName: 'Outdoor Adventure Club', type: 'join' },
    { username: 'dave_outdoor', communityName: 'Gator Dance Collective', type: 'click' },
  ]

  for (const i of interactionData) {
    await prisma.interaction.create({
      data: {
        userId: users[i.username].id,
        communityId: communities[i.communityName].id,
        type: i.type,
        weight: weightMap[i.type],
      },
    })
  }

  console.log(`Seeded ${interactionData.length} interactions`)
  console.log('Seed complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
