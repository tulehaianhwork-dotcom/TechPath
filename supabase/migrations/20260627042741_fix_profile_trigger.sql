/*
# Fix Profile Auto-Creation Trigger

## Problem
The original trigger function had issues with permissions/context when running on auth.users inserts.
Supabase's auth system runs triggers in a specific security context.

## Fix
- Recreate the function with explicit schema qualification
- Grant execute permission to authenticator role
- Ensure the trigger can access public.profiles

## Notes
- This also handles the case where email is null (OAuth logins)
- Uses COALESCE for all potentially null fields
*/

-- Drop and recreate the function with proper permissions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      CASE 
        WHEN NEW.email IS NOT NULL THEN split_part(NEW.email, '@', 1)
        ELSE 'User'
      END
    ),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail the signup
  RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

-- Grant execute permission to the roles that need it
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticator;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO supabase_auth_admin;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- Also fix the profiles table to allow null email (OAuth users might not have one initially)
ALTER TABLE public.profiles ALTER COLUMN email DROP NOT NULL;
