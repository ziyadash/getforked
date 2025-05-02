import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Resolve relative to the file itself
const publicKeyPath = path.resolve(__dirname, '../public_key.pem');
const privateKeyPath = path.resolve(__dirname, '../private_key.pem');

// Generate key pair if not already present
if (!fs.existsSync(publicKeyPath) || !fs.existsSync(privateKeyPath)) {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });

  fs.writeFileSync(publicKeyPath, publicKey);
  fs.writeFileSync(privateKeyPath, privateKey);
  console.log('Key pair generated and saved to PEM files.');
} else {
  console.log('Key pair already exists — skipping regeneration.');
}

// Read once at startup
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

/**
 * Decrypts a base64-encoded string using the private key.
 */
export function decryptData(base64Encrypted: string): string {
  const buffer = Buffer.from(base64Encrypted, 'base64');
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    buffer
  );
  return decrypted.toString('utf8');
}

/**
 * Encrypts plaintext using the public key and returns a base64-encoded string.
 */
export function encryptWithPublicKey(plain: string): string {
  const publicKeyPem = fs.readFileSync(publicKeyPath, 'utf8');
  const buffer = Buffer.from(plain, 'utf8');
  const encrypted = crypto.publicEncrypt(
    {
      key: publicKeyPem,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    buffer
  );
  return encrypted.toString('base64');
}
