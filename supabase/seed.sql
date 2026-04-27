-- Clean existing data
TRUNCATE TABLE appointments CASCADE;
TRUNCATE TABLE clients CASCADE;
TRUNCATE TABLE enquiries CASCADE;
TRUNCATE TABLE availability_constraints CASCADE;

-- Seed Enquiries (Inbox)
INSERT INTO enquiries (id, first_name, last_name, email, phone, property_type, area, message, status, created_at)
VALUES
  (gen_random_uuid(), 'Marcus', 'Thorne', 'marcus.thorne@example.com', '0412 345 678', 'Residential', 'Richmond', 'Hi, I just moved into a 2-bedroom apartment in Richmond and it needs a thorough deep clean before I unpack. Are you available this Friday?', 'new', now() - interval '2 hours'),
  (gen_random_uuid(), 'Olivia', 'Grace', 'olivia.g@webmail.com', '0423 456 789', 'Residential', 'South Yarra', 'Looking for a regular weekly cleaner for my townhouse. I have two cats, so someone comfortable with pets is a must!', 'reviewed', now() - interval '1 day'),
  (gen_random_uuid(), 'Green Valley', 'School', 'admin@greenvalleyschool.edu.au', '03 9876 5432', 'Corporate', 'Kew', 'We are looking for a new cleaning contractor for our primary school campus. Can you provide a quote for daily evening cleaning?', 'new', now() - interval '3 days'),
  (gen_random_uuid(), 'Robert', 'Pattinson', 'robp@spam.com', '555-0199', 'Residential', 'Unknown', 'GET RICH QUICK SCHEME LINK HERE...', 'archived', now() - interval '5 days'),
  (gen_random_uuid(), 'Sophia', 'Loren', 'sophia.l@cinema.it', '0434 567 890', 'Residential', 'St Kilda', 'I need a move-out/bond clean for my studio apartment next Wednesday. Please let me know your rates.', 'new', now() - interval '1 hour'),
  (gen_random_uuid(), 'James', 'Cook', 'j.cook@explorer.com', '0455 123 456', 'Residential', 'Docklands', 'Regular fortnightly clean requested. 1 bedroom apartment.', 'reviewed', now() - interval '4 days'),
  (gen_random_uuid(), 'Elena', 'Fisher', 'elena@fortune.com', '0466 789 012', 'Residential', 'Brighton', 'Big house, needs 2 cleaners for 4 hours every Monday.', 'new', now() - interval '6 hours');

-- Seed Clients
-- Note: Using subqueries for assigned_employee_id to link to existing profiles if any exist
-- Otherwise it will be NULL
INSERT INTO clients (id, first_name, last_name, address, phone, email, allergies, notes, property_type, assigned_employee_id, schedule, status, created_at)
VALUES
  (gen_random_uuid(), 'Sarah', 'Jenkins', '123 Baker St, Richmond VIC 3121', '0400 111 222', 'sarah.j@outlook.com', 'Peanuts, Strong bleach scents', 'Key is under the mat. Please focus on the kitchen tiles.', 'Residential', (SELECT id FROM profiles WHERE role = 'employee' LIMIT 1), '{"days": ["Monday", "Wednesday"], "frequency": "weekly", "time": "10:00 AM"}', 'active', now() - interval '30 days'),
  (gen_random_uuid(), 'TechSolutions', 'Office', 'Level 4, 500 Collins St, Melbourne VIC 3000', '03 9000 1234', 'facilities@techsolutions.com.au', NULL, 'After hours only. Security code: 4489.', 'Corporate', (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1), '{"days": ["Friday"], "frequency": "monthly", "time": "6:00 PM"}', 'active', now() - interval '60 days'),
  (gen_random_uuid(), 'David', 'Miller', '45 Highland Terrace, Kew VIC 3101', '0411 222 333', 'dave.miller@gmail.com', 'Dust mites', 'Large dog named Buster. Friendly but barks.', 'Residential', (SELECT id FROM profiles WHERE role = 'employee' OFFSET 1 LIMIT 1), '{"days": ["Tuesday"], "frequency": "fortnightly", "time": "9:30 AM"}', 'active', now() - interval '15 days'),
  (gen_random_uuid(), 'Emma', 'Wilson', '12 Seaside Parade, St Kilda VIC 3182', '0422 333 444', 'emma.wilson@icloud.com', NULL, 'Leave the windows slightly open when finished.', 'Residential', NULL, '{"days": ["Thursday"], "frequency": "weekly", "time": "2:00 PM"}', 'active', now() - interval '10 days'),
  (gen_random_uuid(), 'Blue River', 'Cafe', '88 River Rd, Docklands VIC 3008', '03 9555 6666', 'hello@bluerivercafe.com.au', NULL, 'Clean grease traps and floors. Use food-safe chemicals.', 'Corporate', (SELECT id FROM profiles WHERE role = 'employee' LIMIT 1), '{"days": ["Monday"], "frequency": "weekly", "time": "5:00 AM"}', 'active', now() - interval '45 days'),
  -- Connecting an enquiry to a client (Olivia Grace from enquiries above)
  (gen_random_uuid(), 'Olivia', 'Grace', '77 Toorak Rd, South Yarra VIC 3141', '0423 456 789', 'olivia.g@webmail.com', 'Lavender', 'Converted from enquiry. Prefers natural cleaning products.', 'Residential', (SELECT id FROM profiles WHERE role = 'employee' LIMIT 1), '{"days": ["Thursday"], "frequency": "weekly", "time": "11:00 AM"}', 'active', now() - interval '1 day');

-- Seed Appointments
-- Link appointments to the clients we just created
INSERT INTO appointments (id, client_id, employee_id, scheduled_at, duration_minutes, notes, created_at)
SELECT 
  gen_random_uuid(), 
  id, 
  COALESCE(assigned_employee_id, (SELECT id FROM profiles LIMIT 1)), 
  (now() + (interval '1 day' * (floor(random() * 7) + 1)))::date + time '10:00:00',
  240,
  'Routine cleaning',
  now()
FROM clients
WHERE status = 'active'
LIMIT 5;

-- Seed Availability Constraints for employees
INSERT INTO availability_constraints (id, employee_id, day_of_week, start_time, end_time, label, created_at)
SELECT 
  gen_random_uuid(), 
  id, 
  1, -- Monday
  '08:00:00', 
  '10:00:00', 
  'School run', 
  now()
FROM profiles 
WHERE role = 'employee';
