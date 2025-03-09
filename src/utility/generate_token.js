import CryptoJS from 'crypto-js';
import forge from 'node-forge';
// async function encrypt(text, key) {
//     const enc = new TextEncoder();
//     const keyData = enc.encode(key);
//     const textData = enc.encode(text);

//     const cryptoKey = await window.crypto.subtle.importKey(
//         'raw',
//         keyData,
//         { name: 'AES-GCM' },
//         false,
//         ['encrypt']
//     );

//     // Generate a random nonce
//     const nonce = window.crypto.getRandomValues(new Uint8Array(12)); // 12 bytes for GCM

//     // Encrypt the text
//     const cipherText = await window.crypto.subtle.encrypt(
//         {
//             name: 'AES-GCM',
//             iv: nonce,
//         },
//         cryptoKey,
//         textData
//     );

//     // Combine nonce and ciphertext
//     const combined = new Uint8Array(nonce.byteLength + cipherText.byteLength);
//     combined.set(nonce);
//     combined.set(new Uint8Array(cipherText), nonce.byteLength);

//     // Encode to base64
//     return btoa(String.fromCharCode(...combined));
// }

// function encrypt(text, key) {
//     const keyData = CryptoJS.enc.Utf8.parse(key);
//     const nonce = CryptoJS.lib.WordArray.random(12); // 12 bytes for GCM
    
//     const encrypted = CryptoJS.AES.encrypt(text, keyData, {
//         mode: CryptoJS.mode.GCM,
//         iv: nonce,
//         format: CryptoJS.format.OpenSSL
//     });
    
//     // Combine nonce and ciphertext
//     const combined = nonce.concat(encrypted.ciphertext);
    
//     // Encode to base64
//     return CryptoJS.enc.Base64.stringify(combined);
// }

function encrypt(text, key) {
    // Convert key and plaintext to bytes
    const keyBytes = forge.util.createBuffer(forge.util.encodeUtf8(key)).getBytes();
    const textBytes = forge.util.encodeUtf8(text);

    // Generate a random IV (nonce)
    const iv = forge.random.getBytesSync(12); // AES-GCM recommends a 12-byte IV

    // Create cipher
    const cipher = forge.cipher.createCipher('AES-GCM', keyBytes);
    cipher.start({ iv: iv });
    cipher.update(forge.util.createBuffer(textBytes));
    cipher.finish();

    // Get encrypted data and authentication tag
    const encrypted = cipher.output.getBytes();
    const tag = cipher.mode.tag.getBytes(); // 16-byte authentication tag

    // Combine IV, encrypted text, and tag
    const combined = iv + encrypted + tag;

    // Encode to Base64
    return forge.util.encode64(combined);
}

function getToken(){
    return localStorage.getItem('token')
}

export {encrypt, getToken}