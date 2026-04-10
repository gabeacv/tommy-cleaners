-- Helper function for admin check
CREATE OR REPLACE FUNCTION is_admin() RETURNS boolean AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
$$ LANGUAGE sql SECURITY DEFINER;

-- profiles policies
DROP POLICY IF EXISTS "Public profiles are viewable by assigned users" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users and admins can update profiles" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by assigned users" ON profiles;

CREATE POLICY "own row" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "admin all" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- clients policies
DROP POLICY IF EXISTS "Admin can CRUD all clients" ON clients;
DROP POLICY IF EXISTS "Employees can view assigned clients" ON clients;

CREATE POLICY "admin all" ON clients FOR ALL USING (is_admin());
CREATE POLICY "employee assigned" ON clients FOR SELECT USING (assigned_employee_id = auth.uid());

-- appointments policies
DROP POLICY IF EXISTS "Admin can CRUD all appointments" ON appointments;
DROP POLICY IF EXISTS "Employees can view own appointments" ON appointments;

CREATE POLICY "admin all" ON appointments FOR ALL USING (is_admin());
CREATE POLICY "employee own" ON appointments FOR SELECT USING (employee_id = auth.uid());

-- availability_constraints policies
DROP POLICY IF EXISTS "Admin can view all availability" ON availability_constraints;
DROP POLICY IF EXISTS "Employees can manage own availability" ON availability_constraints;
DROP POLICY IF EXISTS "Employees can CRUD own availability" ON availability_constraints;
DROP POLICY IF EXISTS "Admin can CRUD all availability" ON availability_constraints;

CREATE POLICY "own" ON availability_constraints FOR ALL USING (employee_id = auth.uid());
CREATE POLICY "admin read all" ON availability_constraints FOR SELECT USING (is_admin());

-- enquiries policies
DROP POLICY IF EXISTS "Only admin can view and update enquiries" ON enquiries;

CREATE POLICY "admin only" ON enquiries FOR ALL USING (is_admin());
