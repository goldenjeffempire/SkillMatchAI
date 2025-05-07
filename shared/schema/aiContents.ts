import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users'; // Adjust path if needed

export const aiContents = pgTable('aiContents', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  type: text('type').notNull(), // e.g. 'resume', 'cover_letter', 'ai_note'
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});
