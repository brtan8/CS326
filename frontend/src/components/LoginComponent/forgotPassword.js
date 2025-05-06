document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("reset-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const oldPassword = document.getElementById("old-password").value;
        const newPassword = document.getElementById("new-password").value;

        const valid = await verifyOldPassword(username, oldPassword);

        if (valid) {
            const updated = await updatePassword(username, newPassword);
            if (updated) {
                alert("Password updated successfully!");
                window.location.href = "LoginPage.html";
            } else {
                alert("Failed to update password.");
            }
        } else {
            alert("Invalid old password or user not found.");
        }
    });
});

async function verifyOldPassword(username, oldPassword) {
    try {
        const response = await fetch('http://localhost:3000/routes/Login');
        const users = await response.json();
        const values = Object.values(users);

        for (const user of values) {
            if (user.email === username && user.password === oldPassword) {
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error("Error verifying password:", error);
        return false;
    }
}

async function updatePassword(username, newPassword) {
    try {
        // Step 1: Fetch all users
        const response = await fetch('http://localhost:3000/routes/Login');
        const users = await response.json();

        // Step 2: Find the key and UID for the user by username (email)
        let targetKey = null;
        let uid = null;

        for (const [key, user] of Object.entries(users)) {
            if (user.email === username) {
                targetKey = key;
                uid = user.uid;
                break;
            }
        }

        if (!targetKey || !uid) {
            console.error("User not found");
            return false;
        }

        // Step 3: DELETE user entry by username (email)
        const deleteResponse = await fetch(`http://localhost:3000/routes/Login?email=${encodeURIComponent(username)}`, {
            method: "DELETE",
        });
        
        

        if (!deleteResponse.ok) {
            console.error("Failed to delete user entry");
            return false;
        }

        // Step 4: POST new entry with same UID and updated password
        const updateResponse = await fetch("http://localhost:3000/routes/Login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: username, password: newPassword, uid: uid })
        });

        return updateResponse.ok;
    } catch (error) {
        console.error("Error updating password:", error);
        return false;
    }
}



