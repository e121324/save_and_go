
// Boostrap func

const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
}

// My funcs

const encrypt_dir_button = document.getElementById("encrypt_dir_button"),
    direc_en_input = document.getElementById("direc_en"),
    key_en_input = document.getElementById("key_en_input"),
    key_display = document.getElementById("key_display");

const decrypt_dir_button = document.getElementById("decrypt_dir_button"),
    direc_de_input = document.getElementById("direc_de_input"),
    key_de_input = document.getElementById("key_de_input");

encrypt_dir_button.addEventListener("click", e => {
    console.log(direc_en_input.value, key_en_input.value);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    fetch("http://127.0.0.1:5010/encrypt_dir", {
        method: "POST",
        body: JSON.stringify({
            "directory": direc_en_input.value,
            "key": key_en_input.value,
            "new_name": ""
        }),
        headers: myHeaders,
    })
        .then(res => res.json())
        .then(data => {
            if (data.status === "ok") {
                key_display.innerHTML = [
                    '<br>',
                    ` <p>Your key is: <b>${data.key}</b> </p> `,
                    '<p>  <i>Be sure to store it in a secure place! </i> </p>'
                ].join('');
                appendAlert("Encryption successful", "success");
            } else {

                if(data.msg === "Incorrect padding") {
                    appendAlert("Enter a 256 bits key or leave it blank to automatically generate one.", "danger");
                } else {
                    appendAlert(data.msg, "danger");
                }

            }
        });

})

decrypt_dir_button.addEventListener("click", e => {
    console.log(direc_de_input.value, key_de_input.value);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    fetch("http://127.0.0.1:5010/decrypt_dir", {
        method: "POST",
        body: JSON.stringify({
            "directory": direc_de_input.value,
            "key": key_de_input.value,
            "new_name": ""
        }),
        headers: myHeaders,
    })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if(data.status === "ok"){
                appendAlert("Decryption successful", "success");
            } else {

                if(data.msg === "Incorrect padding") {
                    appendAlert("Your key is not 256 bits!", "warning");
                } else if (data.msg === "MAC check failed"){
                    appendAlert("MAC check failed, wrong key!", "danger");
                } else {
                    appendAlert(data.msg, "danger");
                }

            }
        });

});