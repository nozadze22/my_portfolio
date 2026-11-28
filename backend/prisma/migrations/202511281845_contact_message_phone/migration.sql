-- Contact form stores phone; column was missing on DBs that only ran init migration.
ALTER TABLE "contact_messages" ADD COLUMN IF NOT EXISTS "phone" TEXT;