import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import { validateRole } from "../../shared/middleware/auth.middleware.js";

/**
 * Creates a new invitation for a user to join a box.
 * Requires 'administrator' role.
 */
export const createInvite = onCall(async (request) => {
    const { boxId, email, role } = request.data;

    // 1. Security check: Only administrators can create invites
    await validateRole(request, boxId, ['administrator']);

    const db = getFirestore();
    
    // 2. Business logic: Create the invite record
    const inviteRef = db.collection('invites').doc();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

    const inviteData = {
        boxId,
        email,
        role,
        status: 'pending',
        createdAt: new Date(),
        expiresAt,
        invitedBy: request.auth?.uid
    };

    await inviteRef.set(inviteData);

    return { success: true, inviteId: inviteRef.id };
});
