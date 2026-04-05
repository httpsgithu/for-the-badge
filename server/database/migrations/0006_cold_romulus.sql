-- Migration to change age from integer to text for encryption support
-- WARNING: This migration will delete existing data as it needs to be re-encrypted
-- This is acceptable for development/testing phase

PRAGMA foreign_keys=OFF;--> statement-breakpoint

-- Drop existing data since it's unencrypted and needs to be re-submitted with encryption
DELETE FROM `award_votes`;--> statement-breakpoint
DELETE FROM `developer_awards`;--> statement-breakpoint

-- Create new table with text age field
CREATE TABLE `__new_developer_awards` (
	`id` blob PRIMARY KEY NOT NULL,
	`account_id` blob,
	`full_name` text NOT NULL,
	`email` text NOT NULL,
	`age` text NOT NULL,
	`location` text,
	`project_name` text NOT NULL,
	`project_description` text NOT NULL,
	`repository_url` text NOT NULL,
	`website_url` text,
	`privacy_alignment` text NOT NULL,
	`why_deserve` text NOT NULL,
	`show_on_starboard` integer DEFAULT true NOT NULL,
	`vote_count` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`admin_notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`query_id`) ON UPDATE no action ON DELETE cascade
);--> statement-breakpoint

-- Drop old table
DROP TABLE `developer_awards`;--> statement-breakpoint

-- Rename new table
ALTER TABLE `__new_developer_awards` RENAME TO `developer_awards`;--> statement-breakpoint

PRAGMA foreign_keys=ON;--> statement-breakpoint

-- Recreate indexes
CREATE INDEX `developer_awards_status_idx` ON `developer_awards` (`status`);--> statement-breakpoint
CREATE INDEX `developer_awards_createdAt_idx` ON `developer_awards` (`created_at`);--> statement-breakpoint
CREATE INDEX `developer_awards_email_idx` ON `developer_awards` (`email`);--> statement-breakpoint
CREATE INDEX `developer_awards_account_idx` ON `developer_awards` (`account_id`);
