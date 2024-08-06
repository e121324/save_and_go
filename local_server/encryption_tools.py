from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
import json
from base64 import b64encode, b64decode


def encrypt(header, data):
    # Generate key and cipher
    key = get_random_bytes(16)
    cipher = AES.new(key, AES.MODE_GCM)  # Use Galois/Counter Mode

    cipher.update(header)
    cipher_text, tag = cipher.encrypt_and_digest(data)

    # Send key and parsed data
    return key, [ b64encode(x).decode('utf-8') for x in (header, cipher_text, cipher.nonce, tag) ]


def decryp(key, cipher_data):
    # Decode data and generate new cipher
    cipher_data = [ b64decode(e) for e in cipher_data]

    cipher = AES.new(key, AES.MODE_GCM, nonce=cipher_data[2])
    cipher.update(cipher_data[0])

    data = cipher.decrypt_and_verify(cipher_data[1], cipher_data[3])
    return data


# testing funcs:

header = b"header"
data = b"info123"

key, hidden_info = encrypt(header, data)
print(key, hidden_info)

found_data = decryp(key, hidden_info)
print(found_data)
