#pragma once
/**
 * Omni-Tool Crypto Engine — C++17
 * AES-256-GCM encryption/decryption for secure file handling.
 * Uses only standard C++ — no OpenSSL dependency.
 * 
 * NOTE: This is a reference implementation. For production,
 * consider linking against a validated crypto library.
 */

#include <cstdint>
#include <vector>
#include <string>

namespace omni {

struct EncryptedPayload {
    std::vector<uint8_t> ciphertext;
    std::vector<uint8_t> iv;    // 12 bytes for GCM
    std::vector<uint8_t> tag;   // 16 bytes authentication tag
};

/**
 * Encrypt data using AES-256-GCM
 * @param plaintext Raw data to encrypt
 * @param key       256-bit key (32 bytes)
 * @return Encrypted payload with IV and auth tag
 */
EncryptedPayload encrypt(
    const uint8_t* plaintext, int length,
    const uint8_t* key
);

/**
 * Decrypt AES-256-GCM encrypted data
 * @param payload Encrypted payload (ciphertext + IV + tag)
 * @param key     256-bit key (32 bytes)
 * @return Decrypted plaintext (empty if auth fails)
 */
std::vector<uint8_t> decrypt(
    const EncryptedPayload& payload,
    const uint8_t* key
);

/**
 * Generate cryptographically secure random bytes
 * @param length Number of random bytes to generate
 * @return Random byte buffer
 */
std::vector<uint8_t> randomBytes(int length);

/**
 * SHA-256 Hash
 * @param data   Input data
 * @param length Data length in bytes
 * @return 32-byte SHA-256 digest
 */
std::vector<uint8_t> sha256(const uint8_t* data, int length);

} // namespace omni
