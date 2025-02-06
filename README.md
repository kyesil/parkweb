# Next.js and Postgres Starter Template

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Database**: [Postgres](https://www.postgresql.org/)
- **ORM**: [Drizzle](https://orm.drizzle.team/)
- **Package Manager**: [Bun](https://bun.sh/)
- **UI Library**: [Material-UI (MUI)](https://mui.com/)

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
