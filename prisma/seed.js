const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean up
  await prisma.announcement.deleteMany();
  await prisma.event.deleteMany();
  await prisma.galleryImage.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin
  const adminPassword = await bcrypt.hash('AdminPassword123!', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@trichyskaters.com',
      passwordHash: adminPassword,
      name: 'Trichy Skaters Admin',
      role: 'ADMIN',
    },
  });

  // Create regular skater
  const skaterPassword = await bcrypt.hash('SkaterPassword123!', 10);
  const skater = await prisma.user.create({
    data: {
      email: 'skater@gmail.com',
      passwordHash: skaterPassword,
      name: 'Rohan Dev',
      role: 'USER',
    },
  });

  console.log('Users created successfully.');

  // Create Announcements
  await prisma.announcement.create({
    data: {
      title: 'New Training Schedule for State Championship',
      content: 'Morning practice session starts at 5:30 AM instead of 6:00 AM from next Monday. Presence is mandatory for all tournament skaters.',
      isPin: true,
    },
  });
  await prisma.announcement.create({
    data: {
      title: 'Safety Gear Requirements',
      content: 'All members must wear helmets, knee pads, elbow pads, and wrist guards during track practices.',
      isPin: false,
    },
  });

  // Create Events
  await prisma.event.create({
    data: {
      name: 'Trichy Open Skating Championship 2026',
      slug: 'trichy-open-skating-championship-2026',
      description: 'Annual speed skating event open to all age categories. Participation certificates and trophies for winners.',
      date: new Date('2026-09-15T09:00:00Z'),
      time: '09:00 AM - 05:00 PM',
      location: 'Trichy Club Roller Rink, Anna Nagar',
      coverImage: '/logo.jpg',
    },
  });
  await prisma.event.create({
    data: {
      name: 'Weekend Roller Hockey Workshop',
      slug: 'weekend-roller-hockey-workshop',
      description: 'A special two-day coaching clinic led by national-level hockey coach Mr. Selvam.',
      date: new Date('2026-10-10T10:00:00Z'),
      time: '10:00 AM - 01:00 PM',
      location: 'Anna Stadium Indoor Hall, Trichy',
      coverImage: '/logo.jpg',
    },
  });

  // Create Posts
  await prisma.post.create({
    data: {
      title: 'Essential Maintenance Tips for Speed Skates',
      slug: 'essential-maintenance-tips-for-speed-skates',
      content: 'Keeping your bearings clean, checking frame alignment, and rotating wheels are the keys to maintaining high speed and longevity of your skates...',
      category: 'Training',
      images: JSON.stringify(['/logo.jpg']),
      status: 'APPROVED',
      authorId: admin.id,
    },
  });
  await prisma.post.create({
    data: {
      title: 'Trichy Skaters Dominate Tamil Nadu State Selection',
      slug: 'trichy-skaters-dominate-state-selection',
      content: 'Proud moment for the club as 5 of our junior speed skaters got selected to represent the state in the upcoming National Speed Skating Championships...',
      category: 'Competition',
      images: JSON.stringify(['/logo.jpg']),
      status: 'APPROVED',
      authorId: admin.id,
    },
  });
  await prisma.post.create({
    data: {
      title: 'How to Perfect Your Cross-Over Technique',
      slug: 'perfect-your-cross-over-technique',
      content: 'Cross-overs are essential for maintaining speed around corners. This guide outlines the key leg extension, hip rotation, and ankle angle adjustments required for a clean cross-over.',
      category: 'Training',
      images: JSON.stringify(['/logo.jpg']),
      status: 'PENDING',
      authorId: skater.id,
    },
  });

  // Create Achievements
  await prisma.achievement.create({
    data: {
      skaterName: 'Kavin Raj',
      competitionName: '59th National Roller Skating Championships',
      position: 'GOLD',
      category: 'Speed Skating 500m Rink',
      eventDate: new Date('2025-12-18'),
      description: 'Won the gold medal in the under-14 boys speed skating category with a personal record time of 45.2 seconds.',
      photoUrl: '/logo.jpg',
      certificateUrl: null,
      status: 'APPROVED',
      submittedById: skater.id,
    },
  });
  await prisma.achievement.create({
    data: {
      skaterName: 'Nila Sekar',
      competitionName: 'South Zone Invitational Skating Meet',
      position: 'SILVER',
      category: 'Road Race 1000m',
      eventDate: new Date('2026-03-24'),
      description: 'Secured the 2nd position in the junior girls category after a fierce sprint finish.',
      photoUrl: '/logo.jpg',
      certificateUrl: null,
      status: 'APPROVED',
      submittedById: skater.id,
    },
  });
  await prisma.achievement.create({
    data: {
      skaterName: 'Rahul Kumar',
      competitionName: 'District Speed Roller Skating Championship',
      position: 'GOLD',
      category: 'Time Trial 300m',
      eventDate: new Date('2026-07-05'),
      description: 'Set a new district record in the senior category.',
      photoUrl: '/logo.jpg',
      certificateUrl: null,
      status: 'PENDING',
      submittedById: skater.id,
    },
  });

  // Create Gallery Images
  await prisma.galleryImage.create({
    data: {
      url: '/logo.jpg',
      caption: 'Team photo at Anna Stadium Track Practice',
      category: 'Training',
      uploadedById: admin.id,
    },
  });
  await prisma.galleryImage.create({
    data: {
      url: '/logo.jpg',
      caption: 'Gold Medalists holding the championship trophy',
      category: 'Winners',
      uploadedById: admin.id,
    },
  });

  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
