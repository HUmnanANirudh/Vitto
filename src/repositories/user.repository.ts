import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const userRepository = {
  async getUserByFirebaseUid(firebaseUid: string) {
    const [user] = await db.select().from(users).where(eq(users.firebaseUid, firebaseUid));
    return user;
  },

  async upsertUser(firebaseUid: string, email: string, name: string) {
    const [user] = await db
      .insert(users)
      .values({ firebaseUid, email, name })
      .onConflictDoUpdate({ target: users.email, set: { firebaseUid } })
      .returning();
    return user;
  },
};
