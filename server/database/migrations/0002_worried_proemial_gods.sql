CREATE TABLE `developer_awards` (
	`id` blob PRIMARY KEY NOT NULL,
	`full_name` text NOT NULL,
	`email` text NOT NULL,
	`age` integer NOT NULL,
	`location` text,
	`project_name` text NOT NULL,
	`project_description` text NOT NULL,
	`repository_url` text NOT NULL,
	`website_url` text,
	`privacy_alignment` text NOT NULL,
	`why_deserve` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`admin_notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE INDEX `developer_awards_status_idx` ON `developer_awards` (`status`);--> statement-breakpoint
CREATE INDEX `developer_awards_createdAt_idx` ON `developer_awards` (`created_at`);--> statement-breakpoint
CREATE INDEX `developer_awards_email_idx` ON `developer_awards` (`email`);