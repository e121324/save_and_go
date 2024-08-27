

const encrypt_dir_button = document.getElementById("encrypt_dir_button"),
    direc_en_input = document.getElementById("direc_en"),
    key_en_input = document.getElementById("key_en_input"),
    key_diplay = document.getElementById("key_diplay");

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
            key_diplay.innerHTML = [
                '<br>',
                ` <p>Your key is: <b>${data.key}</b> </p> `,
                '<p>  <i>Be sure to store it in a secure place! </i> </p>'
            ].join('');
        });

})