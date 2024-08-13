from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
import json
from base64 import b64encode, b64decode


def encrypt(data, strong = False,  header = b""):
    # Generate key and cipher
    key = get_random_bytes(32 if strong else 16)
    cipher = AES.new(key, AES.MODE_GCM)  # Use Galois/Counter Mode

    if header:
        cipher.update(header)
    cipher_text, tag = cipher.encrypt_and_digest(data)

    # Send key and parsed data
    return b64encode(key).decode("utf-8"), [ b64encode(x).decode('utf-8') for x in (header, cipher_text, cipher.nonce, tag) ]


def decrypt(key, cipher_data):
    # Decode data and generate new cipher
    cipher_data = [ b64decode(e) for e in cipher_data]

    cipher = AES.new(b64decode(key), AES.MODE_GCM, nonce=cipher_data[2])
    if cipher_data[0]:
        cipher.update(cipher_data[0])

    data = cipher.decrypt_and_verify(cipher_data[1], cipher_data[3])
    return data

