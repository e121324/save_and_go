import os
from encryption_tools import encrypt, decrypt
from base64 import b64encode, b64decode

import pickle

# TODO:
#  * Change the way of storing the encrypted data in the files

def store_keys(keys, directory):
    key = ""
    with open(directory + "/" + ".keys", "xb") as f:
        content = "\n".join(keys).encode(encoding="utf-8")
        print(content)
        key, new_content = encrypt(content, strong=True)
        f.write(bytearray(pickle.dumps(new_content)))
    return key

# load keys from file and delete file
def load_keys(directory, key):
    content = ""
    with open(directory + "/" + ".keys", "r+b") as f:
        content = f.read()
        content = pickle.loads(content)
        content = decrypt(key, content)

    # os.remove(directory + "/" + ".keys")
    return content.split("\n")


def encrypt_directory(directory):
    keys = []
    for i in range(len(os.listdir(directory))):
        with open(directory + "/" + os.listdir(directory)[i], "r+b") as f:

            content = f.read()

            key, new_content = encrypt(content)
            keys.append(key)

            f.seek(0)
            f.write( bytearray(pickle.dumps(new_content)) )
            f.truncate()
        # rename file to index in directory
        os.rename(directory + "/" + os.listdir(directory)[i], directory + "/" + str(i))


    key = store_keys(keys, directory)

    return key

def decrypt_directory(directory, key):
    pass


# print(encrypt_directory("/Users/emilev/PycharmProjects/save_and_go/local_server/test"))

print(load_keys("/Users/emilev/PycharmProjects/save_and_go/local_server/test", "PVvqIsWt38lR1qiyIGUim+zHOIHe8MYoBNgaPcjkvbs="))