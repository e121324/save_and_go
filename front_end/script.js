
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

const get_info_button = document.getElementById("get_info_button"),
    direc_get_info = document.getElementById("direc_get_info"),
    key_get_info = document.getElementById("key_get_info");

const get_info_container = document.getElementById("get_info_container");

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
                if(data.msg === "Directory already encrypted"){
                    key_display.innerHTML = "<p style='color: red;'> Directory already encrypted <p>"
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


                get_info_container.setAttribute("class", "");
                get_info_container.innerHTML = "";
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




get_info_button.addEventListener("click", async e => {
    console.log(direc_get_info.value, key_get_info.value);

    // First let's get the dir info:
    await get_info(direc_get_info.value, key_get_info.value, get_info_container );

    get_info_container.setAttribute("class", "card card-body");

    /*

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    fetch("http://127.0.0.1:5010/get_dir_info", {
        method: "POST",
        body: JSON.stringify({
            "directory": direc_get_info.value,
            "key": key_get_info.value,
            "new_name": ""
        }),
        headers: myHeaders,
    })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            console.log(res.data.info[0].key)
        });

     */

    /* let res_dir = await retrieve_dir_data(direc_get_info.value, key_get_info.value);

    let res_files = await retrieve_files_data(direc_get_info.value, key_get_info.value);

    display_dir_info(get_info_container, res_dir, res_files);
*/
});