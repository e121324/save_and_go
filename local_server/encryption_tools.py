from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
import json
from base64 import b64encode, b64decode


def encrypt(data, key = "", strong=False, header=b""):
    # Generate key and cipher
    if not key:
        key = get_random_bytes(32 if strong else 16)
    else:
        key = b64decode(key)
    cipher = AES.new(key, AES.MODE_GCM)  # Use Galois/Counter Mode

    if header:
        cipher.update(header)
    cipher_text, tag = cipher.encrypt_and_digest(data)

    # Send key and parsed data

    # TODO:
    #  * Rewrite in a better way...
    data_to_send = (header, cipher_text, cipher.nonce, tag) if header else (cipher_text, cipher.nonce, tag)

    return b64encode(key).decode("utf-8"), [b64encode(x).decode('utf-8') for x in data_to_send]


def decrypt(key, cipher_data):
    # Decode data and generate new cipher
    cipher_data = [b64decode(e) for e in cipher_data]

    header = len(cipher_data) == 4

    cipher = AES.new(b64decode(key), AES.MODE_GCM, nonce=cipher_data[2 if header else 1])

    if header:
        cipher.update(cipher_data[0])

    data = cipher.decrypt_and_verify(cipher_data[1 if header else 0], cipher_data[3 if header else 2])
    return data.decode("utf-8")


# testing funcs:

""" 
header = b"header"
data = b"info123"

k, hidden_info = encrypt(data, header=header)
print(k, hidden_info)

_, info2 = encrypt(b"coco", key=k)
print(info2)
print(decrypt(k, info2))

found_data = decrypt(k, hidden_info)
print(found_data)
"""

