The goal of the project is to create a platform where users can park domain names and publish them. Visitors who land on a parked domain should see a form where they can make an offer for that domain. The form should require email verification before the offer can be submitted. Once an offer is made, the domain owner should receive an email notification.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Database**: [Postgres](https://www.postgresql.org/)
- **ORM**: [Drizzle](https://orm.drizzle.team/)
- **Package Manager**: [Bun](https://bun.sh/)
- **UI Library**: [Material-UI (MUI)](https://mui.com/)
- **Mail Sender Service**: [resend](https://resend.com/)

## Nextjs  Folder Routing 
- /app/ folder routing

## Getting Started

```bash
bun install
```

## Running Locally

Use the included setup script to create your `.env` file:

```bash
bun db:setup
```

Then, run the database migrations and seed the database:

```bash
bun db:generate
bun db:migrate
bun db:seed
```

Finally, run the Next.js development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action.
