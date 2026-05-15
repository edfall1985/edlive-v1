import {
  mysqlTable,
  int,
  varchar,
  text,
  timestamp,
  datetime,
  boolean,
  uniqueIndex,
  json,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  display_name: varchar("display_name", { length: 150 }),
  avatar_url: varchar("avatar_url", { length: 500 }),
  role: mysqlEnum("role", ["owner", "admin", "moderator", "mc", "user"])
    .default("user"),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
});

export const debates = mysqlTable("debates", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  motion: text("motion"),
  description: text("description"),
  status: mysqlEnum("status", ["scheduled", "live", "paused", "ended"])
    .default("scheduled"),
  session_type: mysqlEnum("session_type", ["viewer", "education", "enjoy"])
    .default("education"),
  current_phase: varchar("current_phase", { length: 50 }).default("opening"),
  tiktok_live_url: varchar("tiktok_live_url", { length: 500 }),
  started_at: datetime("started_at", { mode: "date" }),
  ended_at: datetime("ended_at", { mode: "date" }),
  created_by: int("created_by").references(() => users.id),
  created_at: timestamp("created_at").defaultNow(),
});

export const speakers = mysqlTable("speakers", {
  id: int("id").autoincrement().primaryKey(),
  debate_id: int("debate_id").notNull().references(() => debates.id, { onDelete: "cascade" }),
  user_id: int("user_id").references(() => users.id),
  display_name: varchar("display_name", { length: 150 }).notNull(),
  title: varchar("title", { length: 200 }),
  avatar_url: varchar("avatar_url", { length: 500 }),
  position: mysqlEnum("position", ["pro", "kontra"]).notNull(),
  speaking_order: int("speaking_order").default(0),
  total_speaking_time: int("total_speaking_time").default(0),
  is_speaking: boolean("is_speaking").default(false),
  is_active: boolean("is_active").default(true),
});

export const debatePhases = mysqlTable("debate_phases", {
  id: int("id").autoincrement().primaryKey(),
  debate_id: int("debate_id").notNull().references(() => debates.id, { onDelete: "cascade" }),
  phase_name: varchar("phase_name", { length: 50 }).notNull(),
  duration_seconds: int("duration_seconds").default(300),
  started_at: datetime("started_at", { mode: "date" }),
  ended_at: datetime("ended_at", { mode: "date" }),
});

export const votes = mysqlTable("votes", {
  id: int("id").autoincrement().primaryKey(),
  debate_id: int("debate_id").notNull().references(() => debates.id, { onDelete: "cascade" }),
  user_id: int("user_id").references(() => users.id),
  vote_type: mysqlEnum("vote_type", ["pro", "kontra"]).notNull(),
  category: mysqlEnum("category", [
    "most_logical", "most_convincing", "most_data_based", "most_emotional",
  ]),
  speaker_id: int("speaker_id").references(() => speakers.id),
  session_id: varchar("session_id", { length: 100 }),
  created_at: timestamp("created_at").defaultNow(),
}, (table) => ({
  unique_vote: uniqueIndex("unique_vote").on(table.debate_id, table.user_id, table.category),
}));

export const comments = mysqlTable("comments", {
  id: int("id").autoincrement().primaryKey(),
  debate_id: int("debate_id").notNull().references(() => debates.id, { onDelete: "cascade" }),
  user_id: int("user_id").references(() => users.id),
  display_name: varchar("display_name", { length: 100 }),
  content: text("content").notNull(),
  likes_count: int("likes_count").default(0),
  is_highlighted: boolean("is_highlighted").default(false),
  is_moderated: boolean("is_moderated").default(false),
  session_id: varchar("session_id", { length: 100 }),
  created_at: timestamp("created_at").defaultNow(),
});

export const media = mysqlTable("media", {
  id: int("id").autoincrement().primaryKey(),
  debate_id: int("debate_id").notNull().references(() => debates.id, { onDelete: "cascade" }),
  user_id: int("user_id").references(() => users.id),
  title: varchar("title", { length: 255 }),
  media_type: mysqlEnum("media_type", [
    "image", "video", "pdf", "article", "link", "chart",
  ]).notNull(),
  url: varchar("url", { length: 500 }).notNull(),
  description: text("description"),
  is_approved: boolean("is_approved").default(false),
  created_at: timestamp("created_at").defaultNow(),
});

export const aiSummaries = mysqlTable("ai_summaries", {
  id: int("id").autoincrement().primaryKey(),
  debate_id: int("debate_id").notNull().references(() => debates.id, { onDelete: "cascade" }),
  summary_type: mysqlEnum("summary_type", ["summary", "fallacy", "insight", "knowledge"]).notNull(),
  content: json("content"),
  ai_provider: varchar("ai_provider", { length: 50 }).default("gemini"),
  created_at: timestamp("created_at").defaultNow(),
});

export const typingChallenges = mysqlTable("typing_challenges", {
  id: int("id").autoincrement().primaryKey(),
  debate_id: int("debate_id").notNull().references(() => debates.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  prompt: text("prompt").notNull(),
  team_target: mysqlEnum("team_target", ["pro", "kontra", "all"]).default("all"),
  response_emoji: varchar("response_emoji", { length: 50 }),
  started_at: datetime("started_at", { mode: "date" }),
  ended_at: datetime("ended_at", { mode: "date" }),
  is_active: boolean("is_active").default(false),
  created_at: timestamp("created_at").defaultNow(),
});

export const challengeResponses = mysqlTable("challenge_responses", {
  id: int("id").autoincrement().primaryKey(),
  challenge_id: int("challenge_id").notNull().references(() => typingChallenges.id, { onDelete: "cascade" }),
  user_id: int("user_id").references(() => users.id),
  response: text("response"),
  session_id: varchar("session_id", { length: 100 }),
  created_at: timestamp("created_at").defaultNow(),
});
