import { FirebaseError } from "firebase/app";

/**
 * Newer Firebase Auth versions collapse wrong-password/user-not-found into
 * "auth/invalid-credential" to avoid leaking which part of the pair was
 * wrong -- map all three to the same message rather than assuming only one
 * code will ever show up.
 */
export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Incorrect email or password.";
      case "auth/invalid-email":
        return "Enter a valid email address.";
      case "auth/email-already-in-use":
        return "An account with this email already exists. Try logging in instead.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      case "auth/too-many-requests":
        return "Too many attempts. Please wait a moment and try again.";
      case "auth/network-request-failed":
        return "Network error — check your connection and try again.";
      case "auth/unauthorized-domain":
        return "This domain isn't authorized for sign-in yet. Contact support.";
      case "auth/popup-blocked":
        return "Your browser blocked the sign-in popup. Please allow popups and try again.";
      case "auth/operation-not-allowed":
        return "This sign-in method isn't enabled yet. Contact support.";
      default:
        return "Something went wrong. Please try again.";
    }
  }
  return "Something went wrong. Please try again.";
}

/** Popup dismissals are a user action, not a failure -- don't toast these. */
export function isDismissedPopupError(error: unknown): boolean {
  return (
    error instanceof FirebaseError &&
    (error.code === "auth/popup-closed-by-user" || error.code === "auth/cancelled-popup-request")
  );
}
