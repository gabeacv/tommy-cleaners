-- Create the profiles table
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    phone TEXT,
    address TEXT,
    email TEXT UNIQUE,
    role TEXT CHECK (role IN ('admin', 'employee')) DEFAULT 'employee',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Function to check if current user is an admin
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

-- Profile policies
CREATE POLICY "Public profiles are viewable by assigned users" ON profiles
    FOR SELECT USING (auth.uid() = id OR is_admin());

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Create clients table
CREATE TABLE clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    allergies TEXT,
    notes TEXT,
    property_type TEXT CHECK (property_type IN ('Residential', 'Corporate')) DEFAULT 'Residential',
    assigned_employee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    schedule JSONB, -- { "days": ["Monday", "Wednesday"], "frequency": "weekly", "time": "10:00 AM" }
    status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Client policies
CREATE POLICY "Admin can CRUD all clients" ON clients
    FOR ALL USING (is_admin());

CREATE POLICY "Employees can view assigned clients" ON clients
    FOR SELECT USING (assigned_employee_id = auth.uid());

-- Create appointments table
CREATE TABLE appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
    employee_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 240,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Appointment policies
CREATE POLICY "Admin can CRUD all appointments" ON appointments
    FOR ALL USING (is_admin());

CREATE POLICY "Employees can view own appointments" ON appointments
    FOR SELECT USING (employee_id = auth.uid());

-- Create enquiries table
CREATE TABLE enquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    property_type TEXT,
    area TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Enquiry policies
CREATE POLICY "Anyone can insert enquiries" ON enquiries
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admin can view and update enquiries" ON enquiries
    FOR ALL USING (is_admin());

-- Create availability_constraints table
CREATE TABLE availability_constraints (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    label TEXT, -- e.g. "School run"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE availability_constraints ENABLE ROW LEVEL SECURITY;

-- Availability policies
CREATE POLICY "Admin can CRUD all availability" ON availability_constraints
    FOR ALL USING (is_admin());

CREATE POLICY "Employees can CRUD own availability" ON availability_constraints
    FOR ALL USING (employee_id = auth.uid());

-- Function to handle new user profile creation on sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email, COALESCE(new.raw_user_meta_data->>'role', 'employee'));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
