# Save&Go

Tool to encrypt directories using AES Encryption implementation of pycryptodome lib with a web based GUI using bootstrap and vanilla js connected with a flask API that runs on waitress(WSGI  server).

>With save and go you are able to access files and nested 
> directories inside an encrypted directory without the need to decrypt the whole directory.

### Contents:
- [Features](#features)
  - [Simple encryption and decryption for directories](#simple-encryption-and-decryption-for-directories)
  - [Key Feature](#key-feature) ⭐⭐✨
- [Quick start](#quick-start) 


<img src="/imgs/i1.png" alt="interface" width="500px">

# Features


### Simple encryption and decryption for directories

> In the directories utilities sections, by clicking the  `Encrypt directory` 
> button, you can enter the path of the directory to encrypt 
> and, after clicking in the  `Encrypt` button,  you will receive a 256 bits key.
> 
> Be SURE to STORE your key in a SAFE place !!
> Because 256 bits AES encryption is quite strong...


> Additionally, you can input your own custom 256 bits
> key by clicking in  `Set my own key`.

<img src="/imgs/i2.png" alt="interface" width="500px">

> For decryption, click on `Decrypt directory` and enter the path of the encrypted directory and the 
> the 256 bits key-

<img src="/imgs/i3.png" alt="interface" width="500px">

### Encryption and decryption for files and nested directories inside and encrypted directory

#### Key feature
⭐⭐✨

>With save and go you are able to access files and nested 
> directories inside an encrypted directory
> without the need to decrypt the whole directory.
>
>Just enter the path of the **encrypted** directory and your 256 bits key.

<img src="/imgs/i4.png" alt="interface" width="500px">

> You will then get a table with the infromation about the contents
> of your encrypted directory ,
> 
> And you will be able to encrypt and decrypt your files 
> and directories individually without the need of decrypting
> the whole directory 


<img src="/imgs/i5.png" alt="interface" width="1000px">

> In addition, you can continue to iterate and get information 
> about the content of nested directories and apply the same operations
> as before

<img src="/imgs/i6.png" alt="interface" width="1000px">



# Quick-start

> Keep in mind that encryption and decryption can be slow with large amounts of data,
> 
> And don't hesitate to try all the functionalities with our `/dummy_folder`! 

Automatic start:

2. Install all the dependencies of the `requirements.txt` file
2. Start `start.py` file, it will open the interface and run the local server

Manual start, alternatively you can(after installing the dependencies): 
1. Start the local server via waitress with the command:

    `waitress-serve --host 127.0.0.1 --port=5010 local_server.main:app`
2. Open the html file located in `/front-end/main.html`
