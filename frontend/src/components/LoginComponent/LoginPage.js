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
    document.getElementById('create-btn').addEventListener("click", async ()=> await createAccount(document.getElementById("new-username").value, document.getElementById("new-password").value, Date.now() + Math.floor(Math.random() * 1000)));
    nav("home-view");
});

async function login(){
    const [valid, uid] = await checkUser();
    console.log(uid);
    if (valid) {
        document.getElementById("error").style.display ='none';
        document.getElementById("correct").style.display ='block';
        console.log(uid)
        sessionStorage.setItem("userToken", uid);
        window.location.href = "../InputComponent/ExpensesPage.html";
    }
    else {
        document.getElementById("error").style.display ='block';
        document.getElementById("correct").style.display ='none';
    }
}

async function checkUser() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  console.log("Checking user:", username, password);  // Debugging line
  try {
      const response = await fetch('http://localhost:3000/routes/Login');
      const data = await response.json();
      console.log("Users from backend:", data.Login);  // Accessing the Login array
      
      for (const user of data.Login) { // Iterating over the Login array
          console.log("Checking user:", user); // Debugging line
          if (user.username === username && user.password === password) { // Make sure you're matching with 'username' not 'email'
              return [true, user.uid];
          }
      }
      return [false, 0];
  } catch (error) {
      console.error("Login check error:", error);
      return [false, 0];
  }
}

async function createAccount(email, password, uid) {
  try {
    const response = await fetch("http://localhost:3000/routes/Login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password: password, uid: uid })
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