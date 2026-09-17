import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { userRepository } from "@/repositories/user.repository";

if (!getApps().length) {
  initializeApp({ projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID });
}

export async function getAuthUser(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer "))
    throw new Error("Unauthorized: Missing token");

  try {
    const {
      uid: firebaseUid,
      email = "no-email",
      name = "User",
    } = await getAuth().verifyIdToken(authHeader.substring(7));

    let User = await userRepository.getUserByFirebaseUid(firebaseUid);

    if (!User) {
      User = await userRepository.upsertUser(
        firebaseUid,
        email,
        name || email.split("@")[0],
      );
    }

    return User;
  } catch {
    throw new Error("Unauthorized: Invalid token");
  }
}
