/**
 * Emscripten Embind — Crypto Engine C++ ↔ JavaScript Bridge
 */

#include <emscripten/bind.h>
#include <emscripten/val.h>
#include "crypto_engine.h"

using namespace emscripten;

static val js_sha256(val jsData, int length) {
    auto vec = convertJSArrayToNumberVector<uint8_t>(jsData);
    auto result = omni::sha256(vec.data(), length);
    return val(typed_memory_view(result.size(), result.data()));
}

static val js_randomBytes(int length) {
    auto result = omni::randomBytes(length);
    return val(typed_memory_view(result.size(), result.data()));
}

static val js_encrypt(val jsPlaintext, int length, val jsKey) {
    auto plaintext = convertJSArrayToNumberVector<uint8_t>(jsPlaintext);
    auto key = convertJSArrayToNumberVector<uint8_t>(jsKey);
    auto result = omni::encrypt(plaintext.data(), length, key.data());

    val obj = val::object();
    obj.set("ciphertext", val(typed_memory_view(result.ciphertext.size(), result.ciphertext.data())));
    obj.set("iv", val(typed_memory_view(result.iv.size(), result.iv.data())));
    obj.set("tag", val(typed_memory_view(result.tag.size(), result.tag.data())));
    return obj;
}

static val js_decrypt(val jsCiphertext, val jsIv, val jsTag, val jsKey) {
    omni::EncryptedPayload payload;
    payload.ciphertext = convertJSArrayToNumberVector<uint8_t>(jsCiphertext);
    payload.iv = convertJSArrayToNumberVector<uint8_t>(jsIv);
    payload.tag = convertJSArrayToNumberVector<uint8_t>(jsTag);
    auto key = convertJSArrayToNumberVector<uint8_t>(jsKey);

    auto result = omni::decrypt(payload, key.data());
    if (result.empty()) {
        return val::null();
    }
    return val(typed_memory_view(result.size(), result.data()));
}

EMSCRIPTEN_BINDINGS(omni_crypto_engine) {
    function("sha256", &js_sha256);
    function("randomBytes", &js_randomBytes);
    function("encrypt", &js_encrypt);
    function("decrypt", &js_decrypt);
}
