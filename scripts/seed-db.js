const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function seed() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log("🚀 Starting database seed...");

  // 1. Clean existing data
  console.log("🧹 Cleaning old data...");
  const { error: cleanError } = await supabase.rpc('truncate_all_tables'); 
  
  // If RPC doesn't exist, do it manually
  if (cleanError) {
    console.log("Manual cleaning...");
    await supabase.from('appointments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('clients').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('enquiries').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('availability_constraints').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  }

  // 2. Seed Enquiries
  console.log("📩 Seeding enquiries...");
  const enquiries = [
    { first_name: 'Marcus', last_name: 'Thorne', email: 'marcus.thorne@example.com', phone: '0412 345 678', property_type: 'Residential', area: 'Richmond', message: 'Hi, I just moved into a 2-bedroom apartment in Richmond and it needs a thorough deep clean before I unpack. Are you available this Friday?', status: 'new' },
    { first_name: 'Olivia', last_name: 'Grace', email: 'olivia.g@webmail.com', phone: '0423 456 789', property_type: 'Residential', area: 'South Yarra', message: 'Looking for a regular weekly cleaner for my townhouse. I have two cats, so someone comfortable with pets is a must!', status: 'reviewed' },
    { first_name: 'Green Valley', last_name: 'School', email: 'admin@greenvalleyschool.edu.au', phone: '03 9876 5432', property_type: 'Corporate', area: 'Kew', message: 'We are looking for a new cleaning contractor for our primary school campus. Can you provide a quote for daily evening cleaning?', status: 'new' },
    { first_name: 'Robert', last_name: 'Pattinson', email: 'robp@spam.com', phone: '555-0199', property_type: 'Residential', area: 'Unknown', message: 'GET RICH QUICK SCHEME LINK HERE...', status: 'archived' },
    { first_name: 'Sophia', last_name: 'Loren', email: 'sophia.l@cinema.it', phone: '0434 567 890', property_type: 'Residential', area: 'St Kilda', message: 'I need a move-out/bond clean for my studio apartment next Wednesday. Please let me know your rates.', status: 'new' },
    { first_name: 'James', last_name: 'Cook', email: 'j.cook@explorer.com', phone: '0455 123 456', property_type: 'Residential', area: 'Docklands', message: 'Regular fortnightly clean requested. 1 bedroom apartment.', status: 'reviewed' },
    { first_name: 'Elena', last_name: 'Fisher', email: 'elena@fortune.com', phone: '0466 789 012', property_type: 'Residential', area: 'Brighton', message: 'Big house, needs 2 cleaners for 4 hours every Monday.', status: 'new' }
  ];
  await supabase.from('enquiries').insert(enquiries);

  // 3. Get existing profiles to link
  const { data: profiles } = await supabase.from('profiles').select('id, role');
  const employeeId = profiles.find(p => p.role === 'employee')?.id || profiles[0]?.id;
  const adminId = profiles.find(p => p.role === 'admin')?.id || profiles[0]?.id;

  // 4. Seed Clients
  console.log("👥 Seeding clients...");
  const clients = [
    { first_name: 'Sarah', last_name: 'Jenkins', address: '123 Baker St, Richmond VIC 3121', phone: '0400 111 222', email: 'sarah.j@outlook.com', allergies: 'Peanuts, Strong bleach scents', notes: 'Key is under the mat. Please focus on the kitchen tiles.', property_type: 'Residential', assigned_employee_id: employeeId, schedule: { days: ["Monday", "Wednesday"], frequency: "weekly", time: "10:00 AM" }, status: 'active' },
    { first_name: 'TechSolutions', last_name: 'Office', address: 'Level 4, 500 Collins St, Melbourne VIC 3000', phone: '03 9000 1234', email: 'facilities@techsolutions.com.au', property_type: 'Corporate', assigned_employee_id: adminId, schedule: { days: ["Friday"], frequency: "monthly", time: "6:00 PM" }, status: 'active' },
    { first_name: 'David', last_name: 'Miller', address: '45 Highland Terrace, Kew VIC 3101', phone: '0411 222 333', email: 'dave.miller@gmail.com', allergies: 'Dust mites', notes: 'Large dog named Buster. Friendly but barks.', property_type: 'Residential', assigned_employee_id: employeeId, schedule: { days: ["Tuesday"], frequency: "fortnightly", time: "9:30 AM" }, status: 'active' },
    { first_name: 'Emma', last_name: 'Wilson', address: '12 Seaside Parade, St Kilda VIC 3182', phone: '0422 333 444', email: 'emma.wilson@icloud.com', notes: 'Leave the windows slightly open when finished.', property_type: 'Residential', schedule: { days: ["Thursday"], frequency: "weekly", time: "2:00 PM" }, status: 'active' },
    { first_name: 'Blue River', last_name: 'Cafe', address: '88 River Rd, Docklands VIC 3008', phone: '03 9555 6666', email: 'hello@bluerivercafe.com.au', notes: 'Clean grease traps and floors. Use food-safe chemicals.', property_type: 'Corporate', assigned_employee_id: employeeId, schedule: { days: ["Monday"], frequency: "weekly", time: "5:00 AM" }, status: 'active' },
    { first_name: 'Olivia', last_name: 'Grace', address: '77 Toorak Rd, South Yarra VIC 3141', phone: '0423 456 789', email: 'olivia.g@webmail.com', allergies: 'Lavender', notes: 'Converted from enquiry. Prefers natural cleaning products.', property_type: 'Residential', assigned_employee_id: employeeId, schedule: { days: ["Thursday"], frequency: "weekly", time: "11:00 AM" }, status: 'active' }
  ];
  const { data: insertedClients } = await supabase.from('clients').insert(clients).select();

  // 5. Seed Appointments
  if (insertedClients) {
    console.log("📅 Seeding appointments...");
    const appointments = insertedClients.slice(0, 5).map(client => ({
      client_id: client.id,
      employee_id: client.assigned_employee_id || adminId,
      scheduled_at: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      duration_minutes: 240,
      notes: 'Routine cleaning'
    }));
    await supabase.from('appointments').insert(appointments);
  }

  console.log("✅ Seeding complete!");
}

seed().catch(err => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
