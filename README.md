# Save&Go 

---

Tool to encrypt directories using AES Encryption implementation of pycryptodome lib with a web based GUI using bootstrap and vanilla js connected with a flask API that runs on waitress(WSGI  server).


### Contents:
- [Features](#features)
- [Quick start](#quick-start) 
- [Key Feature](#key-feature) ⭐⭐✨

<img src="/imgs/i1.png" alt="interface" width="500px">

## Features

---

### Simple encryption and decryption for directories 

> In the directories utilities sections, by clicking the  `Encrypt directory ` 
> button, you can enter the path of the directory to encrypt 
> and, after clicking in the  `Encrypt` button,  you will receive a 256 bits key.
> 
> Be SURE to STORE your key in a SAFE place !!
> Because 256 bits AES encryption is quite strong...


> Additionally, you can input your own custom 256 bits by clicking in  `Set my own key`

<img src="/imgs/i2.png" alt="interface" width="500px">

> For decryption, click on `Decrypt directory` and enter the path of the encrypted directory and the 
> the 256 bits key

<img src="/imgs/i3.png" alt="interface" width="500px">

#### Key feature

>With save and go you are able to access files and nested directories without the need to decrypt the whole directory
>
>Just enter the path of the **encrypted** directory and your 256 bits 

<img src="/imgs/i4.png" alt="interface" width="500px">


## Quick-start

---

Automatic start:
2. Install all the dependencies of the `requirements.txt` file
2. Start `start.py` file, it will open the interface and run the local server

Manual start, alternatively you can(after installing the dependencies): 
1. Start the local server via waitress with the command:

    `waitress-serve --host 127.0.0.1 --port=5010 local_server.main:app`
2. Open the html file located in `/front-end/main.html`