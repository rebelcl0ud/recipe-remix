import { prisma } from "../app/lib/prisma.server";

async function fixNullUsernames() {
  const updateUsername = await prisma.user.updateMany({
    where: {
      username: null,
    },
    data: {
      username: "friend",
    },
  });

  console.log(`✅ updated ${updateUsername} users w default username 'friend'`);
}

fixNullUsernames()
  .then(async () => {
    console.log("🏁 migration complete");
    process.exit(0);
  })
  .catch(async (e) => {
    console.error("🧟‍♀️ migration failed", e);
    process.exit(1);
  });
