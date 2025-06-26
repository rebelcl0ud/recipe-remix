import { createCookieSessionStorage } from "@remix-run/node";

type SessionData = {
  userId: string;
};

type SessionFlashData = {
  error: string;
};

if (!process.env.SESSION_SECRET) {
  throw new Response("SESSION_SECRET is not set in the env");
}

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: "__session",
      // domain: 'remix.run', // ?
      // expires: '', // maxAge overrides, new Date not rec
      httpOnly: true,
      maxAge: 3600,
      path: "/",
      sameSite: "lax",
      secrets: [process.env.SESSION_SECRET],
      secure: process.env.NODE_ENV === "production",
    },
  });

export { getSession, commitSession, destroySession };
