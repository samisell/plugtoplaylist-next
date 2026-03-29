const { Client } = require('pg');
const url = 'postgresql://postgres.dpppkszilbyjkskctyse:SAMIsell%40100%25@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true';
const client = new Client({ connectionString: url });

async function seed() {
  try {
    await client.connect();
    console.log('Connected to DB');
    
    const plans = [
      { 
        name: 'Starter', 
        description: 'Perfect for emerging artists looking to get started', 
        price: 49, 
        duration: 14, 
        playlistPlacements: 5, 
        features: JSON.stringify(['5 Playlist Placements', 'Basic Social Promotion', '2-Week Campaign Duration', 'Email Support', 'Basic Analytics']) 
      },
      { 
        name: 'Premium', 
        description: 'Our most popular plan for serious artists', 
        price: 149, 
        duration: 28, 
        playlistPlacements: 15, 
        features: JSON.stringify(['15 Playlist Placements', 'Full Social Promotion', '4-Week Campaign Duration', 'Priority Support', 'Advanced Analytics', 'Email Marketing Blast', 'Dedicated Manager']) 
      },
      { 
        name: 'Professional', 
        description: 'For established artists seeking maximum exposure', 
        price: 349, 
        duration: 56, 
        playlistPlacements: 50, 
        features: JSON.stringify(['50+ Playlist Placements', 'Full Social Promotion', '8-Week Campaign Duration', '24/7 Priority Support', 'Premium Analytics Dashboard', 'Full Email Marketing Campaign', 'PR & Press Coverage', 'Personal Account Manager']) 
      }
    ];

    for (const p of plans) {
      // Use "Plan" (singular)
      const q = `
        INSERT INTO "Plan" (name, description, price, duration, "playlistPlacements", features, "isActive", "priority", "createdAt", "updatedAt") 
        VALUES ($1, $2, $3, $4, $5, $6, true, $7, NOW(), NOW())
        ON CONFLICT (name) DO NOTHING
      `;
      const priority = p.name === 'Starter' ? 'normal' : p.name === 'Premium' ? 'high' : 'premium';
      await client.query(q, [p.name, p.description, p.price, p.duration, p.playlistPlacements, p.features, priority]);
    }
    console.log('Seeding complete successfully');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await client.end();
  }
}

seed();
