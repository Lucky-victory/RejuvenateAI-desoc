import { relations } from 'drizzle-orm';
import {
  index,
  int,
  longtext,
  mediumtext,
  mysqlEnum,
  mysqlTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/mysql-core';

export const articles = mysqlTable(
  'articles',
  {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 120 }).notNull(),
    intro: varchar('intro', { length: 255 }),
    image: mediumtext('image'),
    slug: varchar('slug', { length: 255 }).notNull(),
    content: longtext('content'),
    status: mysqlEnum('status', ['published', 'draft', 'deleted']).default(
      'draft'
    ),
    views: int('views').default(0),
    authorId: int('author_id').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').onUpdateNow(),
  },
  (t) => ({
    titleIdx: index('title_idx').on(t.title),
    slugIdx: index('slug_idx').on(t.slug),
    authorIdIdx: index('author_id__idx').on(t.authorId),
  })
);
export const mealPlans = mysqlTable(
  'meal_plans',
  {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 120 }).notNull(),
    intro: varchar('intro', { length: 255 }),
    image: mediumtext('image'),
    slug: varchar('slug', { length: 255 }).notNull(),
    content: longtext('content'),
    status: mysqlEnum('status', ['published', 'draft', 'deleted']).default(
      'draft'
    ),
    views: int('views').default(0),
    time: varchar('time', {
      enum: ['breakfast', 'lunch', 'dinner', 'snack'],
      length: 50,
    }).notNull(),
    authorId: int('author_id').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').onUpdateNow(),
  },
  (t) => ({
    titleIdx: index('title_idx').on(t.title),
    slugIdx: index('slug_idx').on(t.slug),
    authorIdIdx: index('author_id__idx').on(t.authorId),
  })
);
export const fitnessPlans = mysqlTable(
  'fitness_plans',
  {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 120 }).notNull(),
    views: int('views').default(0),
    image: mediumtext('image'),
    slug: varchar('slug', { length: 255 }).notNull(),
    content: longtext('content'),
    status: mysqlEnum('status', ['published', 'draft', 'deleted']).default(
      'draft'
    ),

    authorId: int('author_id').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').onUpdateNow(),
  },
  (t) => ({
    titleIdx: index('title_idx').on(t.title),
    slugIdx: index('slug_idx').on(t.slug),
    authorIdIdx: index('author_id__idx').on(t.authorId),
  })
);
export const users = mysqlTable(
  'users',
  {
    id: serial('id').primaryKey(),
    fullName: varchar('full_name', { length: 120 }),
    username: varchar('username', { length: 50 }).unique().notNull(),
    password: varchar('password', { length: 255 }),
    email: varchar('email', { length: 255 }).unique(),
    address: varchar('address', { length: 40 }).notNull().unique(),
    avatar: varchar('avatar', { length: 255 }),
    userType: mysqlEnum('user_type', ['member', 'nutritionist'])
      .default('member')
      .notNull(),
    role: mysqlEnum('role', ['admin', 'user']).default('user'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').onUpdateNow(),
  },
  (t) => ({
    emailIdx: index('email_idx').on(t.email),
    userTypeIdx: index('user_type_idx').on(t.userType),
    addressIdx: uniqueIndex('address_idx').on(t.address),
    usernameIdx: uniqueIndex('username_idx').on(t.username),
  })
);
export const userRelations = relations(users, ({ one, many }) => ({
  fitnessPlans: many(fitnessPlans),
  mealPlans: many(mealPlans),
  articles: many(articles),
}));

export const articlesRelations = relations(articles, ({ one, many }) => ({
  author: one(users, {
    fields: [articles.authorId],
    references: [users.id],
  }),
}));
export const mealPlansRelations = relations(mealPlans, ({ one, many }) => ({
  author: one(users, {
    fields: [mealPlans.authorId],
    references: [users.id],
  }),
}));
export const fitnessPlansRelations = relations(
  fitnessPlans,
  ({ one, many }) => ({
    author: one(users, {
      fields: [fitnessPlans.authorId],
      references: [users.id],
    }),
  })
);
