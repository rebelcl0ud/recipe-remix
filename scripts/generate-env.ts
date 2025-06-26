import { randomBytes } from "crypto";
import { writeFileSync, existsSync } from "fs";
import { resolve } from "path";

const envPath = resolve(process.cwd(), ".env");
const examplePath = resolve(process.cwd(), ".env.example");

// env.example
if (!existsSync(examplePath)) {
  const exampleContent = `
        # example .env file for project

        SESSION_SECRET="your-session-secret-here"
        DATABASE_URL="file:./dev.db"  
    `;
  writeFileSync(examplePath, exampleContent);
  console.log("📝.env.example file created");
}

// .env
if (existsSync(envPath)) {
  console.warn("⚠️.env file already exists-- skipping generation");
  process.exit(0);
}

const secretSession = randomBytes(32).toString("hex");

const envContent = `
    # auto-generate .env file

    # cookie signing
    SESSION_SECRET=${secretSession}

    # local sqlite db path (used by prisma)
    DATABASE_URL="file:./dev.db"

    # add other env-specific below as needed
    # [example]STRIPE_KEY=
`;

writeFileSync(envPath, envContent);
console.log("📝.env file created with SESSION_SECRET");
