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
    document.getElementById('create-acc').addEventListener("click", ()=> nav("create-acc-view"));

    document.getElementById('login-btn').addEventListener("click", async ()=> await login());
    document.getElementById('create-btn').addEventListener("click", async ()=> await createAccount(document.getElementById("new-username").value,document.getElementById("new-password").value));


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
    try {
        const response = await fetch('http://localhost:3000/routes/Login');
        const users = await response.json();
        const values = Object.values(users);

        for (const user of values) {
            if (user.email === username && user.password === password) {
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error("Login check error:", error);
        return false;
    }
}

async function createAccount(email, password) {
  try {
    const response = await fetch("http://localhost:3000/routes/Login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Account created:", result);
      return true;
    } else {
      console.warn("Account creation failed:", response.status);
      return false;
    }
  } catch (error) {
    console.error("Error creating account:", error);
    return false;
  }
}