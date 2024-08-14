import os
from encryption_tools import encrypt, decrypt


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


def encrypt_directory(directory):
    keys = []
    for i in range(len(os.listdir(directory))):
        with open(directory + "/" + os.listdir(directory)[i], "r+b") as f:
            content = f.read()

            key, new_content = encrypt(content)
            keys.append(key)

            f.seek(0)
            f.write("\n".join(new_content).encode("utf-8"))
            f.truncate()
        # rename file to index in directory
        os.rename(directory + "/" + os.listdir(directory)[i], directory + "/" + str(i))

    key = store_keys(keys, directory)

    return key


def decrypt_directory(directory, key):
    keys = load_keys(directory, key)

    for file in os.listdir(directory):

        with open(directory + "/" + file, "r+") as f:
            content = f.read().split("\n")

            new_content = decrypt(keys[int(file)], content)

            f.seek(0)
            f.write(new_content)
            f.truncate()


direc = "C:\\Users\\emili_cydqq3g\\PycharmProjects\\save_and_go\\local_server\\test"



# k = encrypt_directory(direc)
# print(k)


k = "RW8Vk4RlmgDlA7jisk5HSlRchPgMkd0BgiOX5nR/0NM="

decrypt_directory(direc, k)
