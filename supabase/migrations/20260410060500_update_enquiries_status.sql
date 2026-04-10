-- Update enquiries table status column
ALTER TABLE enquiries ALTER COLUMN status SET DEFAULT 'new';

-- Update existing 'pending' statuses to 'new'
UPDATE enquiries SET status = 'new' WHERE status = 'pending';

-- Add check constraint for status values
ALTER TABLE enquiries ADD CONSTRAINT enquiries_status_check CHECK (status IN ('new', 'reviewed', 'archived'));
