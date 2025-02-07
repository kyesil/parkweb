
import { db } from './drizzle';
import { domains, offers } from './schema';

const sampleDomains = [
  {
    name: 'example.com',
    description: 'A premium generic domain name',
    price: 5000,
    userId: 'user1',
  },
  {
    name: 'techstart.io',
    description: 'Perfect for tech startups',
    price: 3000,
    userId: 'user1',
  },
  {
    name: 'cryptomarket.com',
    description: 'Ideal for cryptocurrency projects',
    price: 8000,
    userId: 'user2',
  },
  {
    name: 'aitools.dev',
    description: 'Great domain for AI development tools',
    price: 2500,
    userId: 'user2',
  },
  {
    name: 'smarthouse.io',
    description: 'Perfect for smart home solutions',
    price: 4000,
    userId: 'user1',
  },
  {
    name: 'fooddelivery.app',
    description: 'Ready for food delivery business',
    price: 6000,
    userId: 'user3',
  },
  {
    name: 'travelguide.co',
    description: 'Perfect for travel related projects',
    price: 3500,
    userId: 'user2',
  },
  {
    name: 'fitnessguru.com',
    description: 'Ideal for fitness and health websites',
    price: 7000,
    userId: 'user3',
  },
  {
    name: 'learncode.dev',
    description: 'Perfect for coding education platform',
    price: 4500,
    userId: 'user1',
  },
  {
    name: 'greenearth.org',
    description: 'Ideal for environmental projects',
    price: 5500,
    userId: 'user2',
  },
];

const generateVerificationCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

async function main() {
  // Önce mevcut verileri temizle
  await db.delete(offers);
  await db.delete(domains);

  // Domainleri ekle
  console.log('Seeding domains...');
  for (const domain of sampleDomains) {
    await db.insert(domains).values(domain);
  }

  // Her domain için 1-3 arası rastgele teklif oluştur
  console.log('Seeding offers...');
  const insertedDomains = await db.select().from(domains);
  
  for (const domain of insertedDomains) {
    const numberOfOffers = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numberOfOffers; i++) {
      const offer = {
        domainId: domain.id,
        email: `offer${i + 1}_${domain.name.replace(/\./g, '_')}@example.com`,
        amount: Math.floor(domain.price??0 * (0.5 + Math.random())), // Domain fiyatının %50-150'si arası
        message: `I'm interested in purchasing ${domain.name}. This is offer #${i + 1}.`,
        verificationCode: generateVerificationCode(),
        isVerified: Math.random() > 0.5, // Rastgele doğrulanmış durumu
      };
      
      await db.insert(offers).values(offer);
    }
  }

  console.log('Seeding completed!');
  process.exit(0);
}

main().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
