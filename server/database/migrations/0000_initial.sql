CREATE TABLE `accounts` (
	`query_id` blob PRIMARY KEY NOT NULL,
	`account_hash` blob NOT NULL UNIQUE,
	`hash_version` integer NOT NULL DEFAULT 1,
	`pin_hash` text,
	`is_admin` integer NOT NULL DEFAULT 0,
	`referrer` blob,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	`last_accessed` integer NOT NULL,
	FOREIGN KEY (`referrer`) REFERENCES `accounts`(`query_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_accountHash_idx` ON `accounts` (`account_hash`);
--> statement-breakpoint
CREATE INDEX `accounts_lastAccessed_idx` ON `accounts` (`last_accessed`);
--> statement-breakpoint
CREATE INDEX `accounts_referrer_idx` ON `accounts` (`referrer`);
--> statement-breakpoint
CREATE TABLE `badges` (
	`badge_id` blob PRIMARY KEY NOT NULL,
	`query_id` blob NOT NULL,
	`name_encrypted` text NOT NULL,
	`description_encrypted` text,
	`svg_encrypted` text NOT NULL,
	`metadata_encrypted` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`query_id`) REFERENCES `accounts`(`query_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `badges_query_id_idx` ON `badges` (`query_id`);
--> statement-breakpoint
CREATE INDEX `badges_created_at_idx` ON `badges` (`created_at`);
--> statement-breakpoint
CREATE TABLE `feedback` (
	`id` blob PRIMARY KEY NOT NULL,
	`message` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `feedback_createdAt_idx` ON `feedback` (`created_at`);
