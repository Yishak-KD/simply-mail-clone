import axios from 'axios';

export interface KBUser {
  date: string;
  uid: string;
  authProvider: string;
  name?: string;
  email: string;
  isDeleted?: boolean;
}

/**
 * Fetches all user records from Kedus Bible's Firebase backend.
 *
 * This function retrieves all user data.
 * It processes the response by filtering out any users marked as deleted and sanitizes
 * user names by removing non-alphabetical characters. When a user's name is exactly "-- --" or
 * contains less than three valid alphabetical characters after sanitization, the name is set
 * to undefined.
 */
export async function fetchKBUsersFromFirebase(): Promise<KBUser[] | []> {
  try {
    const response = await axios.post(
      `${process.env.KEDUS_BIBLE_APP_FIREBASE_BASE_ENDPOINT}/fetchAllUsers`
    );

    if (!response) {
      return [];
    }

    const users = response.data.data as KBUser[];
    const sanitizedUsers = users
      .filter((user) => !user.isDeleted)
      .map((user) => {
        if (user.name) {
          // Remove any characters that are not letters (A–Z or a–z)
          const validLetters = user.name.replace(/[^A-Za-z]/g, '');
          if (user.name === '-- --' || validLetters.length < 3) {
            return { ...user, name: undefined };
          }
        }
        return user;
      });

    return sanitizedUsers;
  } catch (error) {
    console.warn('Error fetching users from Firebase:', error);
    return [];
  }
}
