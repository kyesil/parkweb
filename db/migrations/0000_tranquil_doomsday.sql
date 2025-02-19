CREATE TABLE "domains" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"price" integer,
	"user_id" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "domains_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "offers" (
	"id" serial PRIMARY KEY NOT NULL,
	"domain" varchar(255),
	"email" varchar(255) NOT NULL,
	"amount" integer NOT NULL,
	"message" varchar(255),
	"verification_code" varchar(5),
	"verification_expiry" timestamp,
	"is_verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "offers" ADD CONSTRAINT "offers_domain_domains_name_fk" FOREIGN KEY ("domain") REFERENCES "public"."domains"("name") ON DELETE no action ON UPDATE no action;