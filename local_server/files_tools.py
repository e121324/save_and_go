import os
from encryption_tools import encrypt, decrypt


def store_data(data, directory, name, key=""):
    with open(directory + "/" + name, "xb") as f:
        content = "\n".join(data).encode(encoding="utf-8")

        key, new_content = encrypt(content, key=key, strong=True)
        f.write("\n".join(new_content).encode("utf-8"))
    return key


# load keys from file and delete file
def load_data(directory, key, name, destroy=True):
    content = ""
    with open(directory + "/" + name, "r+") as f:
        # TODO:
        #   * Verify that a key isn't cut in half due to the presence of a random new line
        content = f.read().split("\n")
        content = decrypt(key, content).decode("utf-8")

    if destroy:
        os.remove(directory + "/" + name)
    return content.split("\n")


def encrypt_file(path="", directory="", name="", new_name="", key=""):
    # key = ""
    file = path if path else directory + "/" + name
    with open(file, "r+b") as f:
        content = f.read()

        key, new_content = encrypt(content, key=key)
        _, encrypted_name = encrypt(name.encode("utf-8"), key=key)
        # print( "just after ", decrypt(key, encrypted_name))

        f.seek(0)
        f.write("\n".join(new_content + encrypted_name).encode("utf-8"))
        f.truncate()

    os.rename(file, directory + "/" + new_name)
    return key


def decrypt_file(key, path="", directory="", name="", rewrite=True, name_only=False):
    file = path if path else directory + "/" + name

    new_name = ""
    new_content = ""
    with open(file, "r") as f:
        content = f.read().split("\n")

        if not name_only:
            new_content = decrypt(key, content[:3])
        # print(content[3:], key)
        new_name = decrypt(key, content[3:]).decode("utf-8")

    if rewrite:
        with open(file, "wb") as f:
            f.seek(0)
            f.write(new_content)
            f.truncate()

        os.rename(file, directory + "/" + new_name)
        return new_name
    else:
        return (new_name, new_content) if not name_only else new_name


def get_files_in_dir(directory):
    return [f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f))]


def encrypt_directory(directory, nested=False, key="", new_name=""):
    keys = []
    dir_data = []
    # First encrypt all files in the directory

    files = get_files_in_dir(directory)

    for i in range(len(files)):
        k = encrypt_file(directory=directory, name=files[i], new_name=str(i), key=key)
        keys.append(k)

    # Then encrypt the keys and store them in a file

    key = store_data(keys, directory, ".keys", key=key) if keys else key

    # Get the directories
    directories = [f for f in os.listdir(directory) if os.path.isdir(os.path.join(directory, f))]

    for i in range(len(directories)):
        k = encrypt_directory(directory + "/" + directories[i], nested=True)
        dir_data.append(k)
        dir_data.append(directories[i])
        os.rename(directory + "/" + directories[i], directory + "/d" + str(i))

    # Store the keys and titles of the directories in a file encrypted with the same key as the other keys

    key = store_data(dir_data, directory, name=".dir", key=key) if directories else key

    base, tmp = os.path.split(directory)
    if not tmp:
        base = os.path.dirname(base)
    if new_name:
        os.rename(directory, os.path.join(base, new_name))

    return key


def decrypt_directory(directory, key, new_name=""):
    keys = []
    if os.path.isfile(directory + "/.keys"):
        keys = load_data(directory, key, ".keys")
    dir_data = []
    if os.path.isfile(directory + "/.dir"):
        dir_data = load_data(directory, key, ".dir")

    already_decrypted = []
    if os.path.isfile(directory + "/.changes"):
        already_decrypted = load_data(directory, key, ".changes")

    # Decrypt the files first
    # files = get_files_in_dir(directory)
    # print(files)
    for i in range(len(keys)):
        if str(i) in already_decrypted:
            continue
        try:
            decrypt_file(keys[i], directory=directory, name=str(i))
        except ValueError:
            print(f"File not decrypted: {i}")

    # Decrypt the directories and their name
    for i in range(0, len(dir_data), 2):
        if not os.path.isdir(os.path.join(directory, f"d{i // 2}")):
            print(f"Already decrypted d{i // 2}")
            continue
        try:
            os.rename(directory + "/d" + str(i // 2), directory + "/" + dir_data[i + 1])
            decrypt_directory(directory + "/" + dir_data[i + 1], dir_data[i])
        except Exception as e:
            print(f"Something went wrong {e}")

    base, tmp = os.path.split(directory)
    if not tmp:
        base = os.path.dirname(base)
    if new_name:
        os.rename(directory, os.path.join(base, new_name))


def are_dir_encrypted(dir):
    return os.path.isfile(os.path.join(dir, ".dir"))


def are_files_encrypted(dir):
    return os.path.isfile(os.path.join(dir, ".keys"))


def already_encrypted(dir):
    return are_dir_encrypted(dir) or are_files_encrypted(dir)


# direc = "/Users/emilev/PycharmProjects/save_and_go/local_server/test"

# k2 = encrypt_directory(direc)
# print(k2)
# k2 = "tUyAYow1YCHsG6j9tRmm9Wm+ihq7CSj55Erv/6WQLMY="
# input()
# decrypt_directory(direc, k2)

# print(load_data(direc, k2, ".dir", False))

# ['/5M=', '5YUUawnd+OrDnip1v34bxA==', 'coSqXUboAZg7PrA68L8GkA==']
# OPUkTwSMh5PbydMfdLzXCgUMvOQxgjX9Y3OpBUSyX5s=
#
