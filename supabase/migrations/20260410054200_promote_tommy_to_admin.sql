-- Promote 'tommy@tommy.com' to admin
UPDATE profiles
SET role = 'admin'
WHERE email = 'tommy@tommy.com';
