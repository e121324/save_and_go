import os
from encryption_tools import encrypt, decrypt
from base64 import b64encode, b64decode


def store_keys(keys, directory):
    key = ""
    with open(directory + "/" + ".keys", "xb") as f:
        content = "\n".join(keys).encode(encoding="utf-8")

        key, new_content = encrypt(content, strong=True)
        f.write("\n".join(new_content).encode("utf-8"))
    return key


# load keys from file and delete file
def load_keys(directory, key):
    content = ""
    with open(directory + "/" + ".keys", "r+") as f:
        # TODO:
        #   * Verify that a key isn't cut in half due to the presence of a random new line
        content = f.read().split("\n")
        content = decrypt(key, content)

    os.remove(directory + "/" + ".keys")
    return content.split("\n")


def encrypt_file(path="", directory="", name="", new_name=""):
    key = ""
    file = path if path else directory + "/" + name
    with open(file, "r+b") as f:
        content = f.read()

        key, new_content = encrypt(content)
        _, encrypted_name = encrypt(name.encode("utf-8"), key=key)
        print( "just after ", decrypt(key, encrypted_name))

        f.seek(0)
        f.write("\n".join(new_content + encrypted_name).encode("utf-8"))
        f.truncate()

    os.rename(file, directory + "/" + new_name)
    return key


def decrypt_file(key, path="", directory="", name=""):
    file = path if path else directory + "/" + name

    new_name = ""
    with open(file, "r+") as f:
        content = f.read().split("\n")

        new_content = decrypt(key, content[:3])
        print(content[3:], key)
        new_name = decrypt(key, content[3:])

        f.seek(0)
        f.write(new_content)
        f.truncate()

    os.rename(file, directory + "/" + new_name)


def encrypt_directory(directory):
    keys = []

    for i in range(len(os.listdir(directory))):
        k = encrypt_file(directory=directory, name=os.listdir(directory)[i], new_name=str(i))
        keys.append(k)

    key = store_keys(keys, directory)

    return key


def decrypt_directory(directory, key):
    keys = load_keys(directory, key)

    for file in os.listdir(directory):
        decrypt_file(keys[int(file)], directory=directory, name=file)


direc = "C:\\Users\\emili_cydqq3g\\PycharmProjects\\save_and_go\\local_server\\test"

# k = encrypt_directory(direc)
# print(k)
k = "rb4N2XhFKrBRSkpLYNDBOpY8bthvxGoGSsxTACiKK7E="
decrypt_directory(direc, k)

# ['/5M=', '5YUUawnd+OrDnip1v34bxA==', 'coSqXUboAZg7PrA68L8GkA==']
# OPUkTwSMh5PbydMfdLzXCgUMvOQxgjX9Y3OpBUSyX5s=
#