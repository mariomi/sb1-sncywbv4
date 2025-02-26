/*
  # Add contact messages and menu items tables

  1. New Tables
    - `contact_messages`
      - For storing contact form submissions
      - Includes status tracking (unread, read, replied, archived)
    - `menu_items`
      - For storing menu items
      - Supports translations and special items
      - Includes active/inactive status

  2. Security
    - Enable RLS on both tables
    - Add policies for admin access
*/

-- Create contact_messages table
CREATE TABLE contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived'))
);

-- Create menu_items table
CREATE TABLE menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  translation text,
  description text NOT NULL,
  price text NOT NULL,
  category text NOT NULL CHECK (category IN ('mare', 'terra', 'pizza')),
  subcategory text NOT NULL CHECK (subcategory IN ('antipasti', 'primi', 'secondi', 'classic', 'special', 'vegetali')),
  is_special boolean DEFAULT false,
  min_persons integer,
  active boolean DEFAULT true
);

-- Enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Policies for contact_messages
CREATE POLICY "Anyone can create contact messages"
  ON contact_messages
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read contact messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update contact messages"
  ON contact_messages
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policies for menu_items
CREATE POLICY "Anyone can read menu items"
  ON menu_items
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage menu items"
  ON menu_items
  FOR ALL
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX idx_contact_messages_status ON contact_messages (status);
CREATE INDEX idx_contact_messages_created_at ON contact_messages (created_at DESC);
CREATE INDEX idx_menu_items_category ON menu_items (category, subcategory);
CREATE INDEX idx_menu_items_active ON menu_items (active);