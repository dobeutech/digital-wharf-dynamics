-- Create ccpa_requests table for CCPA privacy request tracking
CREATE TABLE public.ccpa_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_id text NOT NULL UNIQUE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  address text,
  request_types text[] NOT NULL,
  additional_info text,
  status text NOT NULL DEFAULT 'pending',
  ip_address text,
  user_agent text,
  submitted_at timestamp with time zone DEFAULT now(),
  processed_at timestamp with time zone,
  response_deadline timestamp with time zone,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create contact_submissions table for contact form entries
CREATE TABLE public.contact_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  sms_consent boolean DEFAULT false,
  marketing_consent boolean DEFAULT false,
  status text NOT NULL DEFAULT 'new',
  ip_address text,
  user_agent text,
  submitted_at timestamp with time zone DEFAULT now(),
  responded_at timestamp with time zone,
  notes text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.ccpa_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- CCPA Requests RLS Policies
CREATE POLICY "Public can submit CCPA requests"
ON public.ccpa_requests
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can manage CCPA requests"
ON public.ccpa_requests
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Contact Submissions RLS Policies
CREATE POLICY "Public can submit contact forms"
ON public.contact_submissions
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can manage contact submissions"
ON public.contact_submissions
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Create indexes for performance
CREATE INDEX idx_ccpa_requests_email ON public.ccpa_requests(email);
CREATE INDEX idx_ccpa_requests_status ON public.ccpa_requests(status);
CREATE INDEX idx_ccpa_requests_reference_id ON public.ccpa_requests(reference_id);
CREATE INDEX idx_contact_submissions_email ON public.contact_submissions(email);
CREATE INDEX idx_contact_submissions_status ON public.contact_submissions(status);

-- Trigger to update updated_at on ccpa_requests
CREATE TRIGGER update_ccpa_requests_updated_at
BEFORE UPDATE ON public.ccpa_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();