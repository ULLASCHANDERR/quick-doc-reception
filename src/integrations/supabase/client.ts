// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bylizabdloqdygvodyza.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5bGl6YWJkbG9xZHlndm9keXphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5NjY3MTAsImV4cCI6MjA2MDU0MjcxMH0.E76Ld3bHdSuC3IXWETQapTAlw_-w7T2r9G1wzmGh0oY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);