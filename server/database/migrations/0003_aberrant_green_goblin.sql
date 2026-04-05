CREATE TABLE `award_votes` (
	`submission_id` blob NOT NULL,
	`account_id` blob NOT NULL,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`submission_id`, `account_id`),
	FOREIGN KEY (`submission_id`) REFERENCES `developer_awards`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`query_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `award_votes_submission_idx` ON `award_votes` (`submission_id`);--> statement-breakpoint
CREATE INDEX `award_votes_account_idx` ON `award_votes` (`account_id`);--> statement-breakpoint
ALTER TABLE `developer_awards` ADD `show_on_starboard` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `developer_awards` ADD `vote_count` integer DEFAULT 0 NOT NULL;