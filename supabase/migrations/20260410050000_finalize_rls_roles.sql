-- Update profiles update policy to allow admin full access
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users and admins can update profiles" ON profiles
    FOR UPDATE USING (auth.uid() = id OR is_admin());

-- Update availability_constraints to "admin reads all" as requested
-- Current policy "Admin can CRUD all availability" allows ALL
DROP POLICY IF EXISTS "Admin can CRUD all availability" ON availability_constraints;
CREATE POLICY "Admin can view all availability" ON availability_constraints
    FOR SELECT USING (is_admin());

-- Ensure employees can manage their own availability
DROP POLICY IF EXISTS "Employees can CRUD own availability" ON availability_constraints;
CREATE POLICY "Employees can manage own availability" ON availability_constraints
    FOR ALL USING (employee_id = auth.uid());

-- Ensure enquiries is admin only (already exists but just for completeness)
DROP POLICY IF EXISTS "Only admin can view and update enquiries" ON enquiries;
CREATE POLICY "Only admin can view and update enquiries" ON enquiries
    FOR ALL USING (is_admin());
