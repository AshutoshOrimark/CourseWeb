import * as CryptoJS from 'crypto-js';

const encryptionKey = 'abcd@1234'; // Replace with a secure key

/**
 * Encrypts the given data using AES encryption.
 * @param data The data to encrypt.
 * @returns The encrypted string.
 */
export function encryptData(data: string): string {
  if (!data || data.trim() === '') {
    console.warn('Data to encrypt is empty or invalid.');
    return ''; // Return an empty string if data is invalid
  }
  return CryptoJS.AES.encrypt(data, encryptionKey).toString();
}

/**
 * Decrypts the given encrypted data using AES decryption.
 * @param data The encrypted data to decrypt.
 * @returns The decrypted string.
 */
export function decryptData(data: string): string {
  if (!data || data.trim() === '') {
    console.warn('Data to decrypt is empty or invalid.');
    return ''; // Return an empty string if data is invalid
  }
  try {
    const bytes = CryptoJS.AES.decrypt(data, encryptionKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedData) {
      throw new Error('Failed to decrypt data. Invalid encryption key or corrupted data.');
    }
    return decryptedData;
  } catch (error) {
    console.error('Decryption error:', error);
    return ''; // Return an empty string if decryption fails
  }
}