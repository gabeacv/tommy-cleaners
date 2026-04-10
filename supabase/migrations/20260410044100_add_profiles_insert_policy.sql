-- Add INSERT policy for users to create their own profile
-- This handles cases where the trigger might have failed initially
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);
