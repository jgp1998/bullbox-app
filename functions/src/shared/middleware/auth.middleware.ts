import { HttpsError, CallableRequest } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";

/**
 * Validates that the request is authenticated.
 * @param {CallableRequest<unknown>} request The callable request object.
 * @param {string} boxId The ID of the box to check permissions for.
 * @param {string[]} roles Array of allowed roles.
 * @throws {HttpsError} if authentication or authorization fails.
 */
export async function validateRole(
  request: CallableRequest<unknown>,
  boxId: string,
  roles: string[],
): Promise<void> {
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "The function must be called while authenticated.",
    );
  }

  if (!boxId) {
    throw new HttpsError(
      "invalid-argument",
      "The function must be called with a boxId.",
    );
  }

  const db = getFirestore();
  const membershipId = `${request.auth.uid}_${boxId}`;
  const membershipDoc = await db.collection("memberships").doc(membershipId).get();

  if (!membershipDoc.exists) {
    throw new HttpsError(
      "permission-denied",
      "User is not a member of this box.",
    );
  }

  const membershipData = membershipDoc.data();

  // Fortress Integrity: Verify document ID follows naming convention and belongs to request user
  if (membershipDoc.id !== membershipId ||
      membershipData?.userId !== request.auth.uid ||
      membershipData?.boxId !== boxId) {
    throw new HttpsError(
      "permission-denied",
      "Security violation: Membership integrity check failed. Access denied.",
    );
  }

  if (membershipData?.status !== "active") {
    throw new HttpsError(
      "permission-denied",
      "User membership is not active. Current status: " + (membershipData?.status || "unknown"),
    );
  }

  const role = membershipData?.role;

  if (!roles.includes(role)) {
    throw new HttpsError(
      "permission-denied",
      "User does not have the required role for this action.",
    );
  }
}
