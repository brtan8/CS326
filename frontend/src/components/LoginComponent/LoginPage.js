document.addEventListener("DOMContentLoaded", () => {
    function nav(viewId) {
        document.querySelectorAll(".view").forEach(view =>{
            view.style.display ='none';
        });
    
        document.getElementById(viewId).style.display = "block";
    }

    document.getElementById('home').addEventListener("click", ()=> nav("home-view"));
    document.getElementById('about-us').addEventListener("click", ()=> nav("about-view"));
    document.getElementById('login').addEventListener("click", ()=> nav("login-view"));

    document.getElementById('login-btn').addEventListener("click", async ()=> await login());

    nav("home-view");
});

async function login(){
    const valid = await checkUser()
    if (valid) {
        document.getElementById("error").style.display ='none';
        document.getElementById("correct").style.display ='block';
    }
    else {
        document.getElementById("error").style.display ='block';
        document.getElementById("correct").style.display ='none';
    }
}

async function checkUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try{
        const response = await fetch('Users.json');
        const users = await response.json(); // Parse the JSON from the response

        for (const u of users) {
            if (u.email === username && u.password === password) {
                return true;
            }
        }
        return false;
    }
    catch(error){
    return false;
    }
}