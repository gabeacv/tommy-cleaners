-- Fix infinite recursion in profiles policy
-- By creating a SECURITY DEFINER function to check admin status

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update profiles select policy
DROP POLICY IF EXISTS "Public profiles are viewable by assigned users" ON profiles;
CREATE POLICY "Public profiles are viewable by assigned users" ON profiles
    FOR SELECT USING (
        auth.uid() = id 
        OR 
        (SELECT is_admin())
    );

-- Update other policies to use the helper function for consistency and safety
DROP POLICY IF EXISTS "Admin can CRUD all clients" ON clients;
CREATE POLICY "Admin can CRUD all clients" ON clients
    FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admin can CRUD all appointments" ON appointments;
CREATE POLICY "Admin can CRUD all appointments" ON appointments
    FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Only admin can view and update enquiries" ON enquiries;
CREATE POLICY "Only admin can view and update enquiries" ON enquiries
    FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admin can CRUD all availability" ON availability_constraints;
CREATE POLICY "Admin can CRUD all availability" ON availability_constraints
    FOR ALL USING (is_admin());
