CREATE TABLE `submitted_badges` (
	`submission_id` blob PRIMARY KEY NOT NULL,
	`badge_id` blob NOT NULL,
	`submitter_query_id` blob NOT NULL,
	`reviewer_query_id` blob,
	`status` text DEFAULT 'pending' NOT NULL,
	`submitted_at` integer NOT NULL,
	`reviewed_at` integer,
	FOREIGN KEY (`badge_id`) REFERENCES `badges`(`badge_id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`submitter_query_id`) REFERENCES `accounts`(`query_id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`reviewer_query_id`) REFERENCES `accounts`(`query_id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `submitted_badges_badge_id_idx` ON `submitted_badges` (`badge_id`);--> statement-breakpoint
CREATE INDEX `submitted_badges_submitter_query_id_idx` ON `submitted_badges` (`submitter_query_id`);--> statement-breakpoint
CREATE INDEX `submitted_badges_status_idx` ON `submitted_badges` (`status`);--> statement-breakpoint
CREATE INDEX `submitted_badges_submitted_at_idx` ON `submitted_badges` (`submitted_at`);