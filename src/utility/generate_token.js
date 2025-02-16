import CryptoJS from 'crypto-js';
async function encrypt(text, key) {
    const enc = new TextEncoder();
    const keyData = enc.encode(key);
    const textData = enc.encode(text);

    const cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'AES-GCM' },
        false,
        ['encrypt']
    );

    // Generate a random nonce
    const nonce = window.crypto.getRandomValues(new Uint8Array(12)); // 12 bytes for GCM

    // Encrypt the text
    const cipherText = await window.crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: nonce,
        },
        cryptoKey,
        textData
    );

    // Combine nonce and ciphertext
    const combined = new Uint8Array(nonce.byteLength + cipherText.byteLength);
    combined.set(nonce);
    combined.set(new Uint8Array(cipherText), nonce.byteLength);

    // Encode to base64
    return btoa(String.fromCharCode(...combined));
}

function getToken(){
    return localStorage.getItem('token')
}

export {encrypt, getToken}