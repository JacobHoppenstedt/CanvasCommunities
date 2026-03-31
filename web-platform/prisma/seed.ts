import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from '../src/generated/prisma/client';
import bcrypt from "bcrypt";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(
  pool as unknown as ConstructorParameters<typeof PrismaPg>[0]
);
const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 10;

async function main() {
  console.log("Resetting tables...");

  // Delete child tables first (to avoid foreign key constraints)
  await prisma.recommendation.deleteMany({});
  await prisma.interaction.deleteMany({});
  await prisma.membership.deleteMany({});
  await prisma.$executeRaw`DELETE FROM "_UserInterests";`;
  await prisma.$executeRaw`DELETE FROM "_CommunityTags";`;
  await prisma.tag.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.community.deleteMany({});

  // Reset sequences so IDs start from 1
  await prisma.$executeRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "Community_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "Tag_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "Membership_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "Interaction_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "Recommendation_id_seq" RESTART WITH 1;`;

  console.log("Tables cleared, seeding new data...");

  // ---------------------------------------------------------------------------
  // Tags
  // ---------------------------------------------------------------------------
  const tagData = [
    // Tech
    { name: 'Computer Science' },
    { name: 'Engineering' },
    { name: 'Robotics' },
    { name: 'AI & Machine Learning' },
    { name: 'Cybersecurity' },
    { name: 'Data Science' },
    { name: 'Web Development' },
    { name: 'Mobile Development' },
    { name: 'Game Development' },
    { name: 'Open Source' },
    // Science & Health
    { name: 'Pre-Med' },
    { name: 'Biology' },
    { name: 'Chemistry' },
    { name: 'Physics' },
    { name: 'Environmental Science' },
    { name: 'Public Health' },
    { name: 'Neuroscience' },
    { name: 'Pharmacy'},
    { name: 'Medicine'},
    { name: 'Agricultural and Life Sciences'},
    { name: 'Nursing'},
    { name: 'Dentistry'},
    // Social & Leadership
    { name: 'Social' },
    { name: 'Networking' },
    { name: 'Leadership' },
    { name: 'Community Service' },
    { name: 'Volunteering' },
    { name: 'Mentorship' },
    { name: 'Ambassador'},
    // Creative
    { name: 'Music' },
    { name: 'Art' },
    { name: 'Dance' },
    { name: 'Photography' },
    { name: 'Film & Media' },
    { name: 'Creative Writing' },
    { name: 'Theater' },
    // Athletic & Outdoors
    { name: 'Sports' },
    { name: 'Fitness' },
    { name: 'Outdoors' },
    { name: 'Martial Arts' },
    { name: 'Yoga & Wellness' },
    { name: 'Military' },
    // Professional & Academic
    { name: 'Business' },
    { name: 'Finance' },
    { name: 'Entrepreneurship' },
    { name: 'Law' },
    { name: 'Research' },
    { name: 'Academic' },
    { name: 'Construction Design & Planning'},
    { name: 'Education'},
    { name: 'Journalism & Communications'},
    { name: 'Liberal Arts and Sciences'},
    // Culture & Identity
    { name: 'Cultural' },
    { name: 'International' },
    { name: 'Diversity' },
    { name: 'Language' },
    { name: 'Multicultural Greek Council'},
    // Lifestyle
    { name: 'Food' },
    { name: 'Gaming' },
    { name: 'Sustainability' },
    { name: 'Mental Health' }

  ];

  const tags: { [name: string]: { id: number; name: string } } = {};
  for (const t of tagData) {
    const tag = await prisma.tag.create({ data: t });
    tags[tag.name] = tag;
  }
  console.log(`Seeded ${Object.keys(tags).length} tags`);

  // ---------------------------------------------------------------------------
  // Communities
  // ---------------------------------------------------------------------------
  const communityData = [
    // ── Tech ──
    { name: 'Gator Robotics', description: 'Build, compete, and innovate with autonomous robots at UF.', avatarUrl: 'https://picsum.photos/seed/robotics/200', tagNames: ['Robotics', 'Engineering', 'Computer Science'] },
    { name: 'AI Society', description: 'Explore machine learning, NLP, and AI research together.', avatarUrl: 'https://picsum.photos/seed/ai/200', tagNames: ['AI & Machine Learning', 'Computer Science', 'Data Science'] },
    { name: 'Cybersecurity Club', description: 'CTF competitions, red team labs, and security workshops.', avatarUrl: 'https://picsum.photos/seed/cyber/200', tagNames: ['Cybersecurity', 'Computer Science'] },
    { name: 'Open Source Gators', description: 'Contribute to open source projects and learn collaborative development.', avatarUrl: 'https://picsum.photos/seed/opensource/200', tagNames: ['Open Source', 'Web Development', 'Computer Science'] },
    { name: 'UF ACM Chapter', description: 'Talks, coding nights, and career panels for CS students.', avatarUrl: 'https://picsum.photos/seed/acm/200', tagNames: ['Computer Science', 'Academic', 'Networking'] },
    { name: 'Mobile App Builders', description: 'Build iOS and Android apps from scratch in weekly workshops.', avatarUrl: 'https://picsum.photos/seed/mobile/200', tagNames: ['Mobile Development', 'Computer Science', 'Engineering'] },
    { name: 'Data Science Society', description: 'Kaggle competitions, data viz workshops, and industry talks.', avatarUrl: 'https://picsum.photos/seed/datasci/200', tagNames: ['Data Science', 'AI & Machine Learning', 'Research'] },
    { name: 'Game Dev Club', description: 'Build games with Unity and Unreal — weekly game jams and showcases.', avatarUrl: 'https://picsum.photos/seed/gamedev/200', tagNames: ['Game Development', 'Computer Science', 'Art'] },
    { name: 'Web Dev Workshop', description: 'Learn modern web development: React, Next.js, APIs, and deployment.', avatarUrl: 'https://picsum.photos/seed/webdev/200', tagNames: ['Web Development', 'Computer Science', 'Open Source'] },
    { name: 'Gator Hardware Lab', description: 'Arduino, Raspberry Pi, and embedded systems projects.', avatarUrl: 'https://picsum.photos/seed/hardware/200', tagNames: ['Engineering', 'Robotics', 'Computer Science'] },

    // ── Science & Health ──
    { name: 'Pre-Med Alliance', description: 'Support network and resources for pre-medical students.', avatarUrl: 'https://picsum.photos/seed/premed/200', tagNames: ['Pre-Med', 'Networking', 'Mentorship'] },
    { name: 'Biomedical Engineering Society', description: 'Bridging engineering and medicine through design challenges.', avatarUrl: 'https://picsum.photos/seed/biomed/200', tagNames: ['Engineering', 'Biology', 'Pre-Med'] },
    { name: 'Chemistry Club', description: 'Lab demos, study groups, and chemistry career exploration.', avatarUrl: 'https://picsum.photos/seed/chem/200', tagNames: ['Chemistry', 'Academic', 'Research'] },
    { name: 'Physics Society', description: 'Stargazing nights, physics demos, and research talks.', avatarUrl: 'https://picsum.photos/seed/physics/200', tagNames: ['Physics', 'Academic', 'Research'] },
    { name: 'Environmental Action Coalition', description: 'Campus sustainability campaigns and conservation projects.', avatarUrl: 'https://picsum.photos/seed/enviro/200', tagNames: ['Environmental Science', 'Sustainability', 'Volunteering'] },
    { name: 'Neuroscience Explorers', description: 'Brain-related research discussions and lab tours.', avatarUrl: 'https://picsum.photos/seed/neuro/200', tagNames: ['Neuroscience', 'Biology', 'Research'] },
    { name: 'Public Health Brigade', description: 'Health education, screenings, and community outreach.', avatarUrl: 'https://picsum.photos/seed/pubhealth/200', tagNames: ['Public Health', 'Community Service', 'Volunteering'] },
    { name: 'Pre-Dental Society', description: 'DAT prep, shadowing opportunities, and dental school mentorship.', avatarUrl: 'https://picsum.photos/seed/predent/200', tagNames: ['Pre-Med', 'Academic', 'Mentorship'] },

    // ── Social & Leadership ──
    { name: 'Student Leadership Forum', description: 'Develop leadership skills through workshops and mentorship.', avatarUrl: 'https://picsum.photos/seed/leadership/200', tagNames: ['Leadership', 'Networking', 'Social'] },
    { name: 'Gators Give Back', description: 'Weekly service projects focused on food insecurity and education.', avatarUrl: 'https://picsum.photos/seed/giveback/200', tagNames: ['Community Service', 'Volunteering', 'Social'] },
    { name: 'Peer Mentorship Network', description: 'Upperclassmen mentoring freshmen through the college transition.', avatarUrl: 'https://picsum.photos/seed/mentors/200', tagNames: ['Mentorship', 'Leadership', 'Social'] },
    { name: 'Mental Health Advocates', description: 'Promoting mental wellness, peer support, and stress management.', avatarUrl: 'https://picsum.photos/seed/mentalhealth/200', tagNames: ['Mental Health', 'Community Service', 'Social'] },
    { name: 'Debate Society', description: 'Competitive debate, public speaking practice, and argument workshops.', avatarUrl: 'https://picsum.photos/seed/debate/200', tagNames: ['Academic', 'Leadership', 'Social'] },

    // ── Creative Arts ──
    { name: 'Music Collective', description: 'Live sessions, open mics, and music production workshops.', avatarUrl: 'https://picsum.photos/seed/music/200', tagNames: ['Music', 'Art', 'Social'] },
    { name: 'Gator Dance Collective', description: 'Competitive and recreational dance — all styles welcome.', avatarUrl: 'https://picsum.photos/seed/dance/200', tagNames: ['Dance', 'Social', 'Fitness'] },
    { name: 'Photography Guild', description: 'Photo walks, editing workshops, and gallery exhibitions.', avatarUrl: 'https://picsum.photos/seed/photo/200', tagNames: ['Photography', 'Art', 'Social'] },
    { name: 'Film & Documentary Club', description: 'Short film production, screenings, and filmmaker Q&As.', avatarUrl: 'https://picsum.photos/seed/film/200', tagNames: ['Film & Media', 'Art', 'Creative Writing'] },
    { name: 'Creative Writing Circle', description: 'Poetry slams, fiction workshops, and campus literary magazine.', avatarUrl: 'https://picsum.photos/seed/writing/200', tagNames: ['Creative Writing', 'Art', 'Social'] },
    { name: 'Theater Troupe', description: 'Semester productions, improv nights, and acting workshops.', avatarUrl: 'https://picsum.photos/seed/theater/200', tagNames: ['Theater', 'Art', 'Social'] },
    { name: 'Digital Art & Design', description: 'UI/UX, illustration, 3D modeling, and design critiques.', avatarUrl: 'https://picsum.photos/seed/digitalart/200', tagNames: ['Art', 'Web Development', 'Game Development'] },
    { name: 'A Cappella Ensemble', description: 'Auditioned vocal group performing pop, jazz, and originals.', avatarUrl: 'https://picsum.photos/seed/acappella/200', tagNames: ['Music', 'Social'] },

    // ── Athletic & Outdoors ──
    { name: 'Outdoor Adventure Club', description: 'Hiking, kayaking, camping, and everything in between.', avatarUrl: 'https://picsum.photos/seed/outdoor/200', tagNames: ['Outdoors', 'Fitness', 'Social'] },
    { name: 'Intramural Soccer League', description: 'Join or form a team for friendly intramural soccer.', avatarUrl: 'https://picsum.photos/seed/soccer/200', tagNames: ['Sports', 'Fitness', 'Social'] },
    { name: 'UF Tennis Club', description: 'Casual hitting sessions and ladder matches for all levels.', avatarUrl: 'https://picsum.photos/seed/tennis/200', tagNames: ['Sports', 'Fitness'] },
    { name: 'Rock Climbing Crew', description: 'Indoor bouldering sessions and weekend outdoor climbing trips.', avatarUrl: 'https://picsum.photos/seed/climbing/200', tagNames: ['Fitness', 'Outdoors', 'Social'] },
    { name: 'Yoga & Mindfulness', description: 'Free yoga sessions, meditation workshops, and wellness retreats.', avatarUrl: 'https://picsum.photos/seed/yoga/200', tagNames: ['Yoga & Wellness', 'Mental Health', 'Fitness'] },
    { name: 'Martial Arts Federation', description: 'Training in karate, jiu-jitsu, taekwondo, and self-defense.', avatarUrl: 'https://picsum.photos/seed/martialarts/200', tagNames: ['Martial Arts', 'Fitness', 'Sports'] },
    { name: 'Running & Track Club', description: 'Group runs, 5K training plans, and race day meetups.', avatarUrl: 'https://picsum.photos/seed/running/200', tagNames: ['Fitness', 'Sports', 'Social'] },
    { name: 'Gator Surf Club', description: 'Weekend surf trips, beach meetups, and coastal cleanups.', avatarUrl: 'https://picsum.photos/seed/surf/200', tagNames: ['Outdoors', 'Sports', 'Social'] },
    { name: 'Ultimate Frisbee', description: 'Pickup games and tournament travel team — all skill levels.', avatarUrl: 'https://picsum.photos/seed/frisbee/200', tagNames: ['Sports', 'Fitness', 'Social'] },

    // ── Professional & Business ──
    { name: 'Entrepreneurship Club', description: 'Startup pitch nights, founder talks, and venture building.', avatarUrl: 'https://picsum.photos/seed/startup/200', tagNames: ['Entrepreneurship', 'Business', 'Networking'] },
    { name: 'Finance & Investment Society', description: 'Stock market simulations, portfolio workshops, and Wall Street prep.', avatarUrl: 'https://picsum.photos/seed/finance/200', tagNames: ['Finance', 'Business', 'Academic'] },
    { name: 'Pre-Law Society', description: 'LSAT prep, law school panels, and mock trial practice.', avatarUrl: 'https://picsum.photos/seed/prelaw/200', tagNames: ['Law', 'Academic', 'Networking'] },
    { name: 'Women in STEM', description: 'Mentorship, networking, and advocacy for women in technical fields.', avatarUrl: 'https://picsum.photos/seed/wistem/200', tagNames: ['Engineering', 'Leadership', 'Diversity'] },
    { name: 'Consulting Club', description: 'Case study workshops, mock interviews, and firm networking.', avatarUrl: 'https://picsum.photos/seed/consulting/200', tagNames: ['Business', 'Networking', 'Leadership'] },

    // ── Cultural & International ──
    { name: 'International Student Association', description: 'Cultural showcases, language tables, and global networking.', avatarUrl: 'https://picsum.photos/seed/intl/200', tagNames: ['International', 'Cultural', 'Social'] },
    { name: 'Hispanic-Latinx Student Assembly', description: 'Cultural celebrations, academic support, and community building.', avatarUrl: 'https://picsum.photos/seed/latinx/200', tagNames: ['Cultural', 'Diversity', 'Social'] },
    { name: 'Asian Pacific Islander Alliance', description: 'Heritage events, advocacy, and social gatherings for AAPI students.', avatarUrl: 'https://picsum.photos/seed/aapi/200', tagNames: ['Cultural', 'Diversity', 'Social'] },
    { name: 'Language Exchange Club', description: 'Practice languages with native speakers over coffee and activities.', avatarUrl: 'https://picsum.photos/seed/language/200', tagNames: ['Language', 'International', 'Social'] },
    { name: 'BETA CHI THETA', description: 'The purpose of Beta Theta is to assemble motivated young men to uphold the six founding pillars by which it stands', avatarURL: 'https://picsum.photos/seed/betatheta/200', tagNames: ['Multicultural Greek Council', 'Mentorship', 'Cultural']},
    { name: 'GAMMA ETA', description: 'Gamma Eta Sorority, Inc. is a diverse sorority that aims to foster strong female leadership within the University of Florida campus. We challenge our members to help them reach their maximum potential. We are a social sorority that stands for the pillars of sisterhood, service, strength, scholarship, leadership, unity, and diversity. We seek to make a mark on this campus and on each other.', avatarURL: 'https://picsum.photos/seed/gammaeta/200', tagNames: ['Multicultural Greek Council', 'Mentorship', 'Cultural']},
    { name: 'PI DELTA PSI', description: 'Educate ourselves and others about Asian American culture and striving to be leaders in the community through academic achievement, cultural awareness, righteousness, and friendship/loyalty.', avatarURL: 'https://picsum.photos/seed/pidelta/200', tagNames: ['Multicultural Greek Council', 'Mentorship', 'Cultural']},

    // ── Lifestyle ──
    { name: 'Gator Grilling Club', description: 'Fire up the grill, learn recipes, and host campus cookouts.', avatarUrl: 'https://picsum.photos/seed/grilling/200', tagNames: ['Food', 'Social'] },
    { name: 'Board Game Society', description: 'Weekly game nights: strategy, party, and tabletop RPGs.', avatarUrl: 'https://picsum.photos/seed/boardgames/200', tagNames: ['Gaming', 'Social'] },
    { name: 'Esports & Competitive Gaming', description: 'Competitive teams in League, Valorant, and Smash Bros.', avatarUrl: 'https://picsum.photos/seed/esports/200', tagNames: ['Gaming', 'Computer Science', 'Social'] },


    // Addtional Batches of data from gatorconnect
    { 
      name: '180 Degrees Consulting at UF',
      description: 'Pro bono consulting for nonprofits and social enterprises, fostering professional development and social impact.',
      avatarUrl: 'https://picsum.photos/seed/180dc/200',
      tagNames: ['Business', 'Entrepreneurship', 'Community Service', 'Leadership', 'Networking']
    },
    { 
      name: '360BHM',
      description: 'Educational and cultural series celebrating Black heritage, culture, and contributions.',
      avatarUrl: 'https://picsum.photos/seed/360bhm/200',
      tagNames: ['Cultural', 'Diversity', 'Social', 'Education']
    },
    { 
      name: '3D Printing Club',
      description: 'Hands-on additive manufacturing, CAD design, and prototyping workshops.',
      avatarUrl: 'https://picsum.photos/seed/3dprint/200',
      tagNames: ['Engineering', 'Robotics', 'Computer Science']
    },
    { 
      name: 'A Private Inn',
      description: 'Mystery and detective fiction club focused on discussion and collaborative puzzle-solving.',
      avatarUrl: 'https://picsum.photos/seed/mystery/200',
      tagNames: ['Creative Writing', 'Academic', 'Social']
    },
    { 
      name: 'A Reason to Give',
      description: 'Serving the homeless community through weekly meal initiatives.',
      avatarUrl: 'https://picsum.photos/seed/give/200',
      tagNames: ['Community Service', 'Volunteering', 'Social']
    },
    { 
      name: 'Academic Allies',
      description: 'Tutoring and mentorship to improve academic outcomes in underserved communities.',
      avatarUrl: 'https://picsum.photos/seed/academically/200',
      tagNames: ['Mentorship', 'Education', 'Community Service']
    },
    { 
      name: 'Academy of Managed Care Pharmacy',
      description: 'Promotes education and awareness of managed care pharmacy practices.',
      avatarUrl: 'https://picsum.photos/seed/amcp/200',
      tagNames: ['Pharmacy', 'Medicine', 'Academic']
    },
    { 
      name: 'Academy of Managed Care Pharmacy - Orlando Campus',
      description: 'Supports student education and development in managed care pharmacy.',
      avatarUrl: 'https://picsum.photos/seed/amcporlando/200',
      tagNames: ['Pharmacy', 'Medicine', 'Academic']
    },
    { 
      name: 'Accent A Cappella',
      description: 'Competitive all-gender a cappella group performing nationally.',
      avatarUrl: 'https://picsum.photos/seed/accent/200',
      tagNames: ['Music', 'Art', 'Social']
    },
    { 
      name: 'Active Minds at Florida',
      description: 'Promotes mental health awareness and student well-being initiatives.',
      avatarUrl: 'https://picsum.photos/seed/activeminds/200',
      tagNames: ['Mental Health', 'Community Service', 'Social']
    },
    { 
      name: 'Adgorithm',
      description: 'Focuses on computational advertising, AI, and data-driven marketing technologies.',
      avatarUrl: 'https://picsum.photos/seed/adgorithm/200',
      tagNames: ['AI & Machine Learning', 'Data Science', 'Business', 'Computer Science']
    },
    { 
      name: 'Advanced Professional Degree Consulting Club',
      description: 'Prepares advanced degree students for careers in consulting through case prep and networking.',
      avatarUrl: 'https://picsum.photos/seed/apdconsulting/200',
      tagNames: ['Business', 'Networking', 'Leadership', 'Entrepreneurship']
    },
    { 
      name: 'AeroGator',
      description: 'Aircraft design team focused on aerospace engineering, performance optimization, and hands-on experience.',
      avatarUrl: 'https://picsum.photos/seed/aerogator/200',
      tagNames: ['Engineering', 'Research', 'Academic']
    },
    { 
      name: 'African Student Union',
      description: 'Supports African students and promotes awareness of African culture and issues.',
      avatarUrl: 'https://picsum.photos/seed/asu/200',
      tagNames: ['Cultural', 'Diversity', 'Social']
    },
    { 
      name: 'Agricultural and Biological Engineering GSO',
      description: 'Supports graduate students in agricultural and biological engineering through academic and community engagement.',
      avatarUrl: 'https://picsum.photos/seed/abegso/200',
      tagNames: ['Agricultural and Life Sciences', 'Engineering', 'Academic']
    },
    { 
      name: 'Agricultural and Life Sciences College Council',
      description: 'Provides leadership and representation for CALS students and organizations.',
      avatarUrl: 'https://picsum.photos/seed/calscouncil/200',
      tagNames: ['Leadership', 'Agricultural and Life Sciences', 'Academic']
    },
    { 
      name: 'Agricultural Economics Club',
      description: 'Explores agribusiness, resource economics, and industry connections.',
      avatarUrl: 'https://picsum.photos/seed/agecon/200',
      tagNames: ['Agricultural and Life Sciences', 'Business', 'Finance']
    },
    { 
      name: 'Agricultural Operations Management Club',
      description: 'Promotes careers and leadership in agricultural operations management.',
      avatarUrl: 'https://picsum.photos/seed/agops/200',
      tagNames: ['Agricultural and Life Sciences', 'Business', 'Leadership']
    },
    { 
      name: 'Agriculture Edu & Commun Grad Stu Assoc',
      description: 'Supports graduate students in agricultural education and communication.',
      avatarUrl: 'https://picsum.photos/seed/aecgsa/200',
      tagNames: ['Agricultural and Life Sciences', 'Education', 'Academic']
    },
    { 
      name: 'Agronomy Graduate Student Organization',
      description: 'Enhances the graduate student experience in agronomy through networking and events.',
      avatarUrl: 'https://picsum.photos/seed/agronomy/200',
      tagNames: ['Agricultural and Life Sciences', 'Networking', 'Academic']
    },
    { 
      name: 'Agronomy-Soils Club',
      description: 'Promotes knowledge of agronomy, soils, and environmental systems.',
      avatarUrl: 'https://picsum.photos/seed/soils/200',
      tagNames: ['Agricultural and Life Sciences', 'Environmental Science', 'Academic']
    },
    { 
      name: 'AI in Healthcare Club',
      description: 'Explores applications of AI in healthcare through projects and collaboration.',
      avatarUrl: 'https://picsum.photos/seed/aihealth/200',
      tagNames: ['AI & Machine Learning', 'Medicine', 'Data Science', 'Research']
    },
    { 
      name: 'AI Security and Risk Association',
      description: 'Focuses on AI alignment, governance, and security challenges.',
      avatarUrl: 'https://picsum.photos/seed/aisra/200',
      tagNames: ['AI & Machine Learning', 'Cybersecurity', 'Research']
    },
    { 
      name: 'Alagarto Printmaking Guild',
      description: 'Promotes printmaking techniques and artistic expression.',
      avatarUrl: 'https://picsum.photos/seed/printmaking/200',
      tagNames: ['Art', 'Creative Writing', 'Social']
    },
    { 
      name: 'Arabic Debate',
      description: 'Forum for Arabic language practice and debate, fostering communication and cultural exchange.',
      avatarUrl: 'https://picsum.photos/seed/arabicdebate/200',
      tagNames: ['Language', 'Leadership', 'Academic', 'Cultural']
    },
    { 
      name: 'Archery Club',
      description: 'Competitive and recreational archery with opportunities for team development and tournaments.',
      avatarUrl: 'https://picsum.photos/seed/archery/200',
      tagNames: ['Sports', 'Fitness']
    },
    { 
      name: 'Architrave',
      description: 'Student-run publication showcasing design, architecture, and student work.',
      avatarUrl: 'https://picsum.photos/seed/architrave/200',
      tagNames: ['Art', 'Journalism & Communications', 'Creative Writing']
    },
    { 
      name: 'Arcoiris',
      description: 'Safe and affirming space for Hispanic/Latine LGBTQIA+ students fostering inclusion and support.',
      avatarUrl: 'https://picsum.photos/seed/arcoiris/200',
      tagNames: ['Cultural', 'Diversity', 'Social', 'Mental Health']
    },
    { 
      name: 'Argentine Student Association',
      description: 'Promotes Argentine culture and fosters community among students.',
      avatarUrl: 'https://picsum.photos/seed/argentina/200',
      tagNames: ['Cultural', 'International', 'Social']
    },
    { 
      name: 'Argentine Tango Club',
      description: 'Learn, practice, and perform Argentine tango through lessons and events.',
      avatarUrl: 'https://picsum.photos/seed/tango/200',
      tagNames: ['Dance', 'Social', 'Fitness']
    },
    { 
      name: 'Armed Forces Student Dental Association',
      description: 'Supports dental students interested in military careers through mentorship and networking.',
      avatarUrl: 'https://picsum.photos/seed/afsdental/200',
      tagNames: ['Dentistry', 'Military', 'Networking', 'Mentorship']
    },
    { 
      name: "Army Fightin' Gator Student Association",
      description: 'Develops leadership through military principles and student engagement.',
      avatarUrl: 'https://picsum.photos/seed/army/200',
      tagNames: ['Military', 'Leadership', 'Social']
    },
    { 
      name: 'Art History Association',
      description: 'Explores art history through lectures, exhibitions, and community engagement.',
      avatarUrl: 'https://picsum.photos/seed/arthistory/200',
      tagNames: ['Art', 'Academic', 'Social']
    },
    { 
      name: 'Artists for Mental Health Club',
      description: 'Combines art and outreach to promote mental wellness and community support.',
      avatarUrl: 'https://picsum.photos/seed/artmental/200',
      tagNames: ['Art', 'Mental Health', 'Community Service']
    },
    { 
      name: 'Arts in Health',
      description: 'Uses artistic expression to promote physical, emotional, and community health.',
      avatarUrl: 'https://picsum.photos/seed/artshealth/200',
      tagNames: ['Art', 'Mental Health', 'Community Service']
    },
    { 
      name: 'AscenDance Salsa Club',
      description: 'Latin dance club offering lessons, performances, and social events.',
      avatarUrl: 'https://picsum.photos/seed/salsa/200',
      tagNames: ['Dance', 'Social', 'Fitness', 'Cultural']
    },
    { 
      name: 'Asian & Pacific American Law Students',
      description: 'Supports Asian and Pacific Islander law students through networking and resources.',
      avatarUrl: 'https://picsum.photos/seed/apalsa/200',
      tagNames: ['Law', 'Cultural', 'Networking']
    },
    { 
      name: 'Asian American Centric Thespians',
      description: 'Promotes AANHPID representation through theater and performance.',
      avatarUrl: 'https://picsum.photos/seed/aact/200',
      tagNames: ['Theater', 'Art', 'Cultural']
    },
    { 
      name: 'Asian American Student Dental Association',
      description: 'Builds community among Asian American dental students.',
      avatarUrl: 'https://picsum.photos/seed/aasda/200',
      tagNames: ['Dentistry', 'Cultural', 'Networking']
    },
    { 
      name: 'Asian American Student Union',
      description: 'Promotes awareness, advocacy, and community for Asian American students.',
      avatarUrl: 'https://picsum.photos/seed/aasu/200',
      tagNames: ['Cultural', 'Diversity', 'Leadership', 'Social']
    },
    { 
      name: 'Asian Business Student Association',
      description: 'Develops students professionally through networking, mentorship, and cultural engagement.',
      avatarUrl: 'https://picsum.photos/seed/absa/200',
      tagNames: ['Business', 'Networking', 'Cultural', 'Mentorship']
    },
    { 
      name: 'Block and Bridle Club',
      description: 'Professional organization promoting animal sciences, agriculture, leadership, and service.',
      avatarUrl: 'https://picsum.photos/seed/blockbridle/200',
      tagNames: ['Agricultural and Life Sciences', 'Leadership', 'Community Service']
    },
    { 
      name: 'Blue Solutions',
      description: 'Empowers students to lead environmental and marine sustainability initiatives.',
      avatarUrl: 'https://picsum.photos/seed/bluesolutions/200',
      tagNames: ['Environmental Science', 'Sustainability', 'Leadership']
    },
    { 
      name: 'BlueScript',
      description: 'Screenwriting club offering workshops, peer feedback, and creative collaboration.',
      avatarUrl: 'https://picsum.photos/seed/bluescript/200',
      tagNames: ['Creative Writing', 'Film & Media', 'Art']
    },
    { 
      name: 'Bob Graham Center Student Fellows',
      description: 'Promotes civic engagement, leadership, and public service through discussion and projects.',
      avatarUrl: 'https://picsum.photos/seed/bobgraham/200',
      tagNames: ['Leadership', 'Community Service', 'Academic']
    },
    { 
      name: 'Bodybuilding and Fitness Club',
      description: 'Supports students in fitness, bodybuilding, nutrition, and athletic development.',
      avatarUrl: 'https://picsum.photos/seed/bodybuilding/200',
      tagNames: ['Fitness', 'Sports']
    },
    { 
      name: 'Bold Campus Ministry',
      description: 'Faith-based community focused on fellowship, spiritual growth, and outreach.',
      avatarUrl: 'https://picsum.photos/seed/ministry/200',
      tagNames: ['Social', 'Community Service']
    },
    { 
      name: 'Bowling Club',
      description: 'Casual and competitive bowling with social events and skill development.',
      avatarUrl: 'https://picsum.photos/seed/bowling/200',
      tagNames: ['Sports', 'Social']
    },
    { 
      name: 'Brazilian Student Association',
      description: 'Promotes Brazilian culture through social, academic, and service events.',
      avatarUrl: 'https://picsum.photos/seed/brazil/200',
      tagNames: ['Cultural', 'International', 'Social']
    },
    { 
      name: 'Brazilian-Portuguese Club',
      description: 'Promotes Portuguese language learning and Brazilian/Portuguese cultural exchange.',
      avatarUrl: 'https://picsum.photos/seed/portuguese/200',
      tagNames: ['Language', 'Cultural', 'International']
    },
    { 
      name: 'Bridge',
      description: 'Provides computers to underserved students to reduce the digital divide.',
      avatarUrl: 'https://picsum.photos/seed/bridge/200',
      tagNames: ['Community Service', 'Volunteering', 'Education']
    },
    { 
      name: 'Bridge to Soar',
      description: 'Volunteers with elementary schools to support literacy and education.',
      avatarUrl: 'https://picsum.photos/seed/soar/200',
      tagNames: ['Community Service', 'Volunteering', 'Mentorship']
    },
    { 
      name: 'Bright Moves',
      description: 'Inclusive fitness and community programs for individuals with autism.',
      avatarUrl: 'https://picsum.photos/seed/brightmoves/200',
      tagNames: ['Fitness', 'Community Service', 'Mental Health']
    },
    { 
      name: 'Caribbean Law Students Association',
      description: 'Explores Caribbean culture, heritage, and legal issues while fostering community awareness.',
      avatarUrl: 'https://picsum.photos/seed/cariblaw/200',
      tagNames: ['Law', 'Cultural', 'International', 'Networking']
    },
    { 
      name: 'Caribbean Students Association',
      description: 'Builds community and promotes Caribbean culture while unifying students across the islands.',
      avatarUrl: 'https://picsum.photos/seed/caribbean/200',
      tagNames: ['Cultural', 'International', 'Social']
    },
    { 
      name: 'Catholic Gator Coalition',
      description: 'Faith-based organization focused on spiritual growth and community among Catholic students.',
      avatarUrl: 'https://picsum.photos/seed/catholic/200',
      tagNames: ['Social', 'Community Service']
    },
    { 
      name: 'Central American Latin Organization',
      description: 'Promotes Central American culture through education, events, and community engagement.',
      avatarUrl: 'https://picsum.photos/seed/calor/200',
      tagNames: ['Cultural', 'International', 'Social']
    },
    { 
      name: "Changemakers' Dialogue",
      description: 'Empowers students through dialogue, leadership development, and community-building conversations.',
      avatarUrl: 'https://picsum.photos/seed/changemakers/200',
      tagNames: ['Leadership', 'Social', 'Community Service']
    },
    { 
      name: 'Changing Health & Attitudes - Girls',
      description: 'Women-focused wellness organization promoting fitness, health, and supportive community.',
      avatarUrl: 'https://picsum.photos/seed/chaarg/200',
      tagNames: ['Fitness', 'Mental Health', 'Social']
    },
    { 
      name: 'Chemical Engineering Peer Advisors',
      description: 'Supports chemical engineering students through mentorship, advising, and professional development.',
      avatarUrl: 'https://picsum.photos/seed/chepa/200',
      tagNames: ['Engineering', 'Mentorship', 'Academic']
    },
    { 
      name: 'Chi Epsilon',
      description: 'Honors and promotes excellence in civil and environmental engineering.',
      avatarUrl: 'https://picsum.photos/seed/chiepsilon/200',
      tagNames: ['Engineering', 'Academic', 'Leadership']
    },
    { 
      name: 'CHI OMEGA',
      description: 'Women’s organization focused on leadership, friendship, and personal development.',
      avatarUrl: 'https://picsum.photos/seed/chiomega/200',
      tagNames: ['Leadership', 'Social']
    },
    { 
      name: 'CHI PHI',
      description: 'Fraternity focused on leadership, integrity, and lifelong brotherhood.',
      avatarUrl: 'https://picsum.photos/seed/chiphi/200',
      tagNames: ['Leadership', 'Social']
    },
    { 
      name: 'Daily Bread',
      description: 'Christian community focused on faith, personal growth, and professional development.',
      avatarUrl: 'https://picsum.photos/seed/dailybread/200',
      tagNames: ['Social', 'Community Service', 'Leadership']
    },
    { 
      name: 'Dairy Science Club',
      description: 'Promotes involvement in the dairy industry through networking, competitions, and outreach.',
      avatarUrl: 'https://picsum.photos/seed/dairy/200',
      tagNames: ['Agricultural and Life Sciences', 'Networking', 'Academic']
    },
    { 
      name: 'Dance in a Suitcase',
      description: 'Supports dance students through professional development, events, and performances.',
      avatarUrl: 'https://picsum.photos/seed/suitcase/200',
      tagNames: ['Dance', 'Art', 'Social']
    },
    { 
      name: 'Dance Marathon',
      description: 'Raises funds and awareness for children’s healthcare through large-scale campus events.',
      avatarUrl: 'https://picsum.photos/seed/dancemarathon/200',
      tagNames: ['Community Service', 'Leadership', 'Social']
    },
    { 
      name: 'Danza Dance Company',
      description: 'Student-run dance organization focused on performance, creativity, and collaboration.',
      avatarUrl: 'https://picsum.photos/seed/danza/200',
      tagNames: ['Dance', 'Art', 'Social']
    },
    { 
      name: 'Data Science and Informatics',
      description: 'Explores data science, AI, and machine learning through workshops and projects.',
      avatarUrl: 'https://picsum.photos/seed/dsi/200',
      tagNames: ['Data Science', 'AI & Machine Learning', 'Computer Science']
    },
    { 
      name: 'Data Science for Sustainable Development',
      description: 'Applies data science to social impact and sustainability projects.',
      avatarUrl: 'https://picsum.photos/seed/dssd/200',
      tagNames: ['Data Science', 'Sustainability', 'Community Service', 'Research']
    },
    { 
      name: 'DCP Ambassadors',
      description: 'Represents the college through leadership, outreach, and student engagement.',
      avatarUrl: 'https://picsum.photos/seed/dcp/200',
      tagNames: ['Leadership', 'Academic', 'Networking']
    },
    { 
      name: 'Dedicated Leaders for Tomorrow',
      description: 'Develops professional, networking, and career-readiness skills for students.',
      avatarUrl: 'https://picsum.photos/seed/dlt/200',
      tagNames: ['Leadership', 'Business', 'Networking']
    },
    { 
      name: 'Delight',
      description: 'Faith-based women’s community focused on connection and personal growth.',
      avatarUrl: 'https://picsum.photos/seed/delight/200',
      tagNames: ['Social', 'Community Service']
    },
    { 
      name: 'Delta Alpha Pi Honor Society',
      description: 'Supports high-achieving students with disabilities through community and advocacy.',
      avatarUrl: 'https://picsum.photos/seed/dap/200',
      tagNames: ['Academic', 'Diversity', 'Community Service']
    },
    { 
      name: 'DELTA CHI',
      description: 'Fraternity focused on friendship, character development, and academic success.',
      avatarUrl: 'https://picsum.photos/seed/deltachi/200',
      tagNames: ['Leadership', 'Social']
    },
    { 
      name: 'Eco-Gator',
      description: 'Promotes environmental sustainability awareness for future business leaders.',
      avatarUrl: 'https://picsum.photos/seed/ecogator/200',
      tagNames: ['Sustainability', 'Business', 'Environmental Science']
    },
    { 
      name: 'ECSEADS',
      description: 'Supports doctoral students in early childhood and special education through networking and development.',
      avatarUrl: 'https://picsum.photos/seed/ecseads/200',
      tagNames: ['Education', 'Academic', 'Networking']
    },
    { 
      name: 'Ecuadorian Culture and Heritage Association',
      description: 'Promotes Ecuadorian culture, heritage, and community through events and education.',
      avatarUrl: 'https://picsum.photos/seed/ecuador/200',
      tagNames: ['Cultural', 'International', 'Social']
    },
    { 
      name: 'EFGH Original Music Club',
      description: 'Provides a space for students to create, perform, and share original music.',
      avatarUrl: 'https://picsum.photos/seed/efghmusic/200',
      tagNames: ['Music', 'Art', 'Social']
    },
    { 
      name: 'Elevate Agency',
      description: 'Student-run advertising agency offering real-world marketing and branding experience.',
      avatarUrl: 'https://picsum.photos/seed/elevate/200',
      tagNames: ['Business', 'Journalism & Communications', 'Leadership']
    },
    { 
      name: 'Empower Youth Initiative',
      description: 'Promotes health education and wellness for children through community outreach.',
      avatarUrl: 'https://picsum.photos/seed/empoweryouth/200',
      tagNames: ['Community Service', 'Volunteering', 'Public Health']
    },
    { 
      name: 'Empowered Business Consulting',
      description: 'Works with global communities to build economic opportunities through consulting and financial literacy.',
      avatarUrl: 'https://picsum.photos/seed/empoweredbiz/200',
      tagNames: ['Business', 'Entrepreneurship', 'Community Service']
    },
    { 
      name: 'EMPRESS',
      description: 'Asian-interest sisterhood focused on empowerment, leadership, and community.',
      avatarUrl: 'https://picsum.photos/seed/empress/200',
      tagNames: ['Cultural', 'Leadership', 'Social']
    },
    { 
      name: 'Enactus Club',
      description: 'Uses entrepreneurial action to create sustainable and socially impactful solutions.',
      avatarUrl: 'https://picsum.photos/seed/enactus/200',
      tagNames: ['Entrepreneurship', 'Business', 'Community Service']
    },
    { 
      name: 'End Overdose',
      description: 'Works to prevent overdose deaths through education and public health initiatives.',
      avatarUrl: 'https://picsum.photos/seed/endoverdose/200',
      tagNames: ['Public Health', 'Community Service', 'Volunteering']
    },
    { 
      name: 'Endodontics Interest Group',
      description: 'Explores careers and academics related to the field of endodontics.',
      avatarUrl: 'https://picsum.photos/seed/endodontics/200',
      tagNames: ['Dentistry', 'Academic', 'Networking']
    },
    { 
      name: 'F.E.M. Films',
      description: 'Empowers female filmmakers to create, collaborate, and build industry networks.',
      avatarUrl: 'https://picsum.photos/seed/femfilms/200',
      tagNames: ['Film & Media', 'Art', 'Networking']
    },
    { 
      name: 'FACES Modeling Troupe, Inc.',
      description: 'Explores modeling, fashion, and performance while promoting community service and health awareness.',
      avatarUrl: 'https://picsum.photos/seed/faces/200',
      tagNames: ['Art', 'Social', 'Leadership']
    },
    { 
      name: 'Falling Gator Skydiving Club',
      description: 'Promotes skydiving through community, education, and shared experiences.',
      avatarUrl: 'https://picsum.photos/seed/skydiving/200',
      tagNames: ['Outdoors', 'Sports', 'Social']
    },
    { 
      name: 'Fast-A-Thon Committee',
      description: 'Hosts events to educate about Islamic culture and raise funds for charity.',
      avatarUrl: 'https://picsum.photos/seed/fastathon/200',
      tagNames: ['Cultural', 'Community Service', 'Social']
    },
    { 
      name: 'Federalist Society',
      description: 'Focuses on legal and constitutional discussions from a public policy perspective.',
      avatarUrl: 'https://picsum.photos/seed/federalist/200',
      tagNames: ['Law', 'Academic', 'Leadership']
    },
    { 
      name: 'Fellows of Chemical Biology',
      description: 'Promotes collaboration and academic engagement in chemical biology.',
      avatarUrl: 'https://picsum.photos/seed/chembiology/200',
      tagNames: ['Biology', 'Chemistry', 'Research']
    },
    { 
      name: 'Fellowship of Christian Athletes',
      description: 'Combines faith and athletics to build community and leadership.',
      avatarUrl: 'https://picsum.photos/seed/fca/200',
      tagNames: ['Sports', 'Leadership', 'Social']
    },
    { 
      name: 'Female Leadership and Charity Club',
      description: 'Empowers communities through fundraising, education, and leadership development.',
      avatarUrl: 'https://picsum.photos/seed/flcc/200',
      tagNames: ['Leadership', 'Community Service', 'Mentorship']
    },
    { 
      name: 'Filipino Student Association',
      description: 'Promotes Filipino culture, unity, and community engagement.',
      avatarUrl: 'https://picsum.photos/seed/fsa/200',
      tagNames: ['Cultural', 'International', 'Social']
    },
    { 
      name: 'Financial Wellness in Medicine',
      description: 'Educates future physicians on financial literacy and stability.',
      avatarUrl: 'https://picsum.photos/seed/finmed/200',
      tagNames: ['Medicine', 'Finance', 'Academic']
    },
    { 
      name: 'Fine Arts College Council',
      description: 'Supports student organizations within the College of the Fine Arts.',
      avatarUrl: 'https://picsum.photos/seed/finearts/200',
      tagNames: ['Art', 'Leadership', 'Academic']
    },
    { 
      name: 'First Generation Leadership Program',
      description: 'Develops leadership skills through mentorship, networking, and professional opportunities.',
      avatarUrl: 'https://picsum.photos/seed/fglp/200',
      tagNames: ['Leadership', 'Mentorship', 'Networking']
    },
    { 
      name: 'Gator Armwrestling',
      description: 'Promotes armwrestling through athletic development and safe technique.',
      avatarUrl: 'https://picsum.photos/seed/armwrestling/200',
      tagNames: ['Sports', 'Fitness']
    },
    { 
      name: 'Gator Astrobiology',
      description: 'Explores astrobiology through education, research opportunities, and networking.',
      avatarUrl: 'https://picsum.photos/seed/astrobio/200',
      tagNames: ['Biology', 'Physics', 'Research', 'Academic']
    },
    { 
      name: 'Gator at Remote Area Medical',
      description: 'Provides volunteer opportunities delivering medical services to underserved communities.',
      avatarUrl: 'https://picsum.photos/seed/gram/200',
      tagNames: ['Medicine', 'Community Service', 'Volunteering']
    },
    { 
      name: 'Gator Autonomous Racing',
      description: 'Designs and builds autonomous vehicles through engineering, AI, and robotics.',
      avatarUrl: 'https://picsum.photos/seed/autonomous/200',
      tagNames: ['Engineering', 'AI & Machine Learning', 'Robotics']
    },
    { 
      name: 'Gator Awaaz',
      description: 'Performs and promotes fusion of South Asian and Western music traditions.',
      avatarUrl: 'https://picsum.photos/seed/awaaz/200',
      tagNames: ['Music', 'Cultural', 'Art']
    },
    { 
      name: 'Gator Badminton Club',
      description: 'Provides practice and competitive opportunities for badminton players of all levels.',
      avatarUrl: 'https://picsum.photos/seed/badminton/200',
      tagNames: ['Sports', 'Fitness', 'Social']
    },
    { 
      name: 'Gator BassMasters (Bass Fishing Club)',
      description: 'Competitive collegiate bass fishing team competing nationally.',
      avatarUrl: 'https://picsum.photos/seed/bassfishing/200',
      tagNames: ['Outdoors', 'Sports']
    },
    { 
      name: 'Gator Beach Volleyball',
      description: 'Club for practicing and competing in beach volleyball.',
      avatarUrl: 'https://picsum.photos/seed/beachvolleyball/200',
      tagNames: ['Sports', 'Fitness']
    },
    { 
      name: 'Gator Bhangra',
      description: 'Promotes and performs traditional Punjabi Bhangra dance.',
      avatarUrl: 'https://picsum.photos/seed/bhangra/200',
      tagNames: ['Dance', 'Cultural', 'Social']
    },
    { 
      name: 'Gator Billiards Club',
      description: 'Provides a space for students to play billiards and socialize.',
      avatarUrl: 'https://picsum.photos/seed/billiards/200',
      tagNames: ['Gaming', 'Social']
    },
    { 
      name: 'Gator Brazilian Jiu Jitsu',
      description: 'Teaches and practices Brazilian Jiu-Jitsu in a welcoming environment.',
      avatarUrl: 'https://picsum.photos/seed/bjj/200',
      tagNames: ['Martial Arts', 'Fitness', 'Sports']
    },
    { 
      name: "Gator Bricks N' Studs",
      description: 'Community for LEGO-style building, creativity, and collaborative design.',
      avatarUrl: 'https://picsum.photos/seed/bricks/200',
      tagNames: ['Art', 'Gaming', 'Social']
    },
  ];

  const communities: { [name: string]: { id: number; name: string } } = {};
  for (const c of communityData) {
    const community = await prisma.community.create({
      data: {
        name: c.name,
        description: c.description,
        avatarUrl: c.avatarUrl,
        tags: {
          connect: c.tagNames.map((n) => ({ name: n })),
        },
      },
    });
    communities[community.name] = community;
  }
  console.log(`Seeded ${Object.keys(communities).length} communities`);

  // ---------------------------------------------------------------------------
  // Users — diverse profiles for testing recommendations
  // ---------------------------------------------------------------------------
  const userData = [
    {
      username: 'alice',
      password: 'alice123',
      interestTags: ['Computer Science', 'AI & Machine Learning', 'Web Development', 'Open Source'],
    },
    {
      username: 'bob',
      password: 'bob123',
      interestTags: ['Gaming', 'Music', 'Social'],
    },
    {
      username: 'carol',
      password: 'carol123',
      interestTags: ['Pre-Med', 'Biology', 'Neuroscience', 'Research'],
    },
    {
      username: 'alice_tech',
      password: 'alice123',
      interestTags: ['Engineering', 'Robotics', 'AI & Machine Learning', 'Computer Science', 'Data Science'],
    },
    {
      username: 'bob_creative',
      password: 'bob123',
      interestTags: ['Music', 'Dance', 'Art', 'Photography', 'Theater'],
    },
    {
      username: 'carol_mixed',
      password: 'carol123',
      interestTags: ['Leadership', 'Networking', 'Computer Science', 'Entrepreneurship'],
    },
    {
      username: 'dave_outdoor',
      password: 'dave123',
      interestTags: ['Outdoors', 'Fitness', 'Sports', 'Social', 'Martial Arts'],
    },
    {
      username: 'eve_blank',
      password: 'eve123',
      interestTags: [], // no interests — tests popularity baseline
    },
    {
      username: 'frank_science',
      password: 'frank123',
      interestTags: ['Physics', 'Chemistry', 'Environmental Science', 'Research', 'Academic'],
    },
    {
      username: 'grace_social',
      password: 'grace123',
      interestTags: ['Community Service', 'Volunteering', 'Mental Health', 'Social', 'Cultural'],
    },
    {
      username: 'henry_business',
      password: 'henry123',
      interestTags: ['Business', 'Finance', 'Entrepreneurship', 'Leadership', 'Networking'],
    },
    {
      username: 'iris_creative',
      password: 'iris123',
      interestTags: ['Art', 'Creative Writing', 'Film & Media', 'Photography', 'Music'],
    },
  ];

  const users: { [username: string]: { id: number; username: string } } = {};
  for (const u of userData) {
    const hashedPassword = await bcrypt.hash(u.password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        username: u.username,
        password: hashedPassword,
        interests: {
          connect: u.interestTags.map((n) => ({ name: n })),
        },
      },
    });
    users[user.username] = user;
  }
  console.log(`Seeded ${Object.keys(users).length} users`);

  // ---------------------------------------------------------------------------
  // Memberships — spread across communities
  // ---------------------------------------------------------------------------
  const membershipData = [
    // alice — tech clubs
    { username: 'alice', communityName: 'UF ACM Chapter' },
    { username: 'alice', communityName: 'Open Source Gators' },
    { username: 'alice', communityName: 'Web Dev Workshop' },
    // bob — gaming & social
    { username: 'bob', communityName: 'Esports & Competitive Gaming' },
    { username: 'bob', communityName: 'Board Game Society' },
    { username: 'bob', communityName: 'Music Collective' },
    // carol — pre-med
    { username: 'carol', communityName: 'Pre-Med Alliance' },
    { username: 'carol', communityName: 'Neuroscience Explorers' },
    // alice_tech — engineering heavy
    { username: 'alice_tech', communityName: 'Gator Robotics' },
    { username: 'alice_tech', communityName: 'AI Society' },
    { username: 'alice_tech', communityName: 'Data Science Society' },
    // bob_creative — arts
    { username: 'bob_creative', communityName: 'Gator Dance Collective' },
    { username: 'bob_creative', communityName: 'Photography Guild' },
    { username: 'bob_creative', communityName: 'Theater Troupe' },
    // carol_mixed — leadership + tech
    { username: 'carol_mixed', communityName: 'Student Leadership Forum' },
    { username: 'carol_mixed', communityName: 'Consulting Club' },
    { username: 'carol_mixed', communityName: 'Entrepreneurship Club' },
    // dave_outdoor — outdoor & fitness
    { username: 'dave_outdoor', communityName: 'Outdoor Adventure Club' },
    { username: 'dave_outdoor', communityName: 'Rock Climbing Crew' },
    { username: 'dave_outdoor', communityName: 'Martial Arts Federation' },
    // frank_science
    { username: 'frank_science', communityName: 'Physics Society' },
    { username: 'frank_science', communityName: 'Chemistry Club' },
    { username: 'frank_science', communityName: 'Environmental Action Coalition' },
    // grace_social
    { username: 'grace_social', communityName: 'Gators Give Back' },
    { username: 'grace_social', communityName: 'Mental Health Advocates' },
    { username: 'grace_social', communityName: 'International Student Association' },
    // henry_business
    { username: 'henry_business', communityName: 'Finance & Investment Society' },
    { username: 'henry_business', communityName: 'Entrepreneurship Club' },
    { username: 'henry_business', communityName: 'Consulting Club' },
    // iris_creative
    { username: 'iris_creative', communityName: 'Film & Documentary Club' },
    { username: 'iris_creative', communityName: 'Creative Writing Circle' },
    { username: 'iris_creative', communityName: 'A Cappella Ensemble' },
  ];

  await prisma.membership.createMany({
    data: membershipData.map((m) => ({
      userId: users[m.username].id,
      communityId: communities[m.communityName].id,
    })),
    skipDuplicates: true,
  });
  console.log(`Seeded ${membershipData.length} memberships`);

  // ---------------------------------------------------------------------------
  // Interactions — simulate realistic user behavior
  // ---------------------------------------------------------------------------
  type InteractionType = 'view' | 'click' | 'rsvp' | 'join';
  const weightMap: Record<InteractionType, number> = {
    view: 0.5,
    click: 1.0,
    rsvp: 2.0,
    join: 3.0,
  };

  const interactionData: { username: string; communityName: string; type: InteractionType }[] = [
    // alice — exploring more tech
    { username: 'alice', communityName: 'AI Society', type: 'view' },
    { username: 'alice', communityName: 'AI Society', type: 'click' },
    { username: 'alice', communityName: 'Cybersecurity Club', type: 'view' },
    { username: 'alice', communityName: 'Data Science Society', type: 'view' },
    { username: 'alice', communityName: 'Data Science Society', type: 'click' },
    { username: 'alice', communityName: 'Mobile App Builders', type: 'view' },
    { username: 'alice', communityName: 'Game Dev Club', type: 'view' },

    // alice_tech — deep into engineering
    { username: 'alice_tech', communityName: 'Cybersecurity Club', type: 'view' },
    { username: 'alice_tech', communityName: 'Cybersecurity Club', type: 'click' },
    { username: 'alice_tech', communityName: 'Cybersecurity Club', type: 'rsvp' },
    { username: 'alice_tech', communityName: 'Gator Hardware Lab', type: 'view' },
    { username: 'alice_tech', communityName: 'Gator Hardware Lab', type: 'click' },
    { username: 'alice_tech', communityName: 'Women in STEM', type: 'view' },

    // bob — gaming and music
    { username: 'bob', communityName: 'Game Dev Club', type: 'view' },
    { username: 'bob', communityName: 'Game Dev Club', type: 'click' },
    { username: 'bob', communityName: 'A Cappella Ensemble', type: 'view' },
    { username: 'bob', communityName: 'Gator Grilling Club', type: 'view' },

    // carol — med school track
    { username: 'carol', communityName: 'Biomedical Engineering Society', type: 'view' },
    { username: 'carol', communityName: 'Biomedical Engineering Society', type: 'click' },
    { username: 'carol', communityName: 'Public Health Brigade', type: 'view' },
    { username: 'carol', communityName: 'Public Health Brigade', type: 'rsvp' },
    { username: 'carol', communityName: 'Pre-Dental Society', type: 'view' },
    { username: 'carol', communityName: 'Chemistry Club', type: 'view' },

    // carol_mixed — leadership pipeline
    { username: 'carol_mixed', communityName: 'AI Society', type: 'view' },
    { username: 'carol_mixed', communityName: 'AI Society', type: 'click' },
    { username: 'carol_mixed', communityName: 'Women in STEM', type: 'view' },
    { username: 'carol_mixed', communityName: 'Pre-Law Society', type: 'view' },
    { username: 'carol_mixed', communityName: 'Debate Society', type: 'view' },
    { username: 'carol_mixed', communityName: 'Debate Society', type: 'click' },

    // dave_outdoor — fitness & adventure
    { username: 'dave_outdoor', communityName: 'Running & Track Club', type: 'view' },
    { username: 'dave_outdoor', communityName: 'Running & Track Club', type: 'click' },
    { username: 'dave_outdoor', communityName: 'Gator Surf Club', type: 'view' },
    { username: 'dave_outdoor', communityName: 'Ultimate Frisbee', type: 'view' },
    { username: 'dave_outdoor', communityName: 'Yoga & Mindfulness', type: 'view' },
    { username: 'dave_outdoor', communityName: 'Intramural Soccer League', type: 'view' },
    { username: 'dave_outdoor', communityName: 'Intramural Soccer League', type: 'click' },

    // bob_creative — browsing art scene
    { username: 'bob_creative', communityName: 'Film & Documentary Club', type: 'view' },
    { username: 'bob_creative', communityName: 'Film & Documentary Club', type: 'click' },
    { username: 'bob_creative', communityName: 'Creative Writing Circle', type: 'view' },
    { username: 'bob_creative', communityName: 'Digital Art & Design', type: 'view' },
    { username: 'bob_creative', communityName: 'A Cappella Ensemble', type: 'view' },
    { username: 'bob_creative', communityName: 'Music Collective', type: 'view' },
    { username: 'bob_creative', communityName: 'Music Collective', type: 'click' },

    // grace_social — community building
    { username: 'grace_social', communityName: 'Peer Mentorship Network', type: 'view' },
    { username: 'grace_social', communityName: 'Peer Mentorship Network', type: 'click' },
    { username: 'grace_social', communityName: 'Hispanic-Latinx Student Assembly', type: 'view' },
    { username: 'grace_social', communityName: 'Language Exchange Club', type: 'view' },
    { username: 'grace_social', communityName: 'Public Health Brigade', type: 'view' },

    // henry_business — professional development
    { username: 'henry_business', communityName: 'Pre-Law Society', type: 'view' },
    { username: 'henry_business', communityName: 'Pre-Law Society', type: 'click' },
    { username: 'henry_business', communityName: 'Student Leadership Forum', type: 'view' },
    { username: 'henry_business', communityName: 'Women in STEM', type: 'view' },
    { username: 'henry_business', communityName: 'Debate Society', type: 'view' },

    // iris_creative — art & media exploration
    { username: 'iris_creative', communityName: 'Photography Guild', type: 'view' },
    { username: 'iris_creative', communityName: 'Photography Guild', type: 'click' },
    { username: 'iris_creative', communityName: 'Digital Art & Design', type: 'view' },
    { username: 'iris_creative', communityName: 'Digital Art & Design', type: 'click' },
    { username: 'iris_creative', communityName: 'Theater Troupe', type: 'view' },
    { username: 'iris_creative', communityName: 'Music Collective', type: 'view' },
  ];

  await prisma.interaction.createMany({
    data: interactionData.map((i) => ({
      userId: users[i.username].id,
      communityId: communities[i.communityName].id,
      type: i.type,
      weight: weightMap[i.type],
    })),
  });
  console.log(`Seeded ${interactionData.length} interactions`);
  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
