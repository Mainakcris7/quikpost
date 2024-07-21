// New post route

var nav_links = document.querySelectorAll(".nav-link")
if (window.location.pathname === "/posts/create" || window.location.pathname === "/posts/create/") {
    nav_links[1].classList.add("active")
} else if (window.location.pathname === "/posts" || window.location.pathname === "/posts/") {
    nav_links[0].classList.add("active")
}

// Show password

let passwordInput = document.querySelector("#login-password")
let showPassword = document.querySelector(".show-password")

showPassword.addEventListener("click", () => {
    showPassword.classList.toggle("hide")
    if (showPassword.classList.contains("hide")) {   // show password
        passwordInput.type = 'text';
        showPassword.innerHTML = `<i class="fa-solid fa-eye-slash"></i>`
    }
    else {  // hide password{}
        passwordInput.type = 'password';
        showPassword.innerHTML = `<i class="fa-solid fa-eye"></i>`
    }
})

