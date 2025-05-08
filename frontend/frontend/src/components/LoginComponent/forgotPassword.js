document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("reset-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const oldPassword = document.getElementById("old-password").value;
        const newPassword = document.getElementById("new-password").value;

        const valid = await verifyOldPassword(username, oldPassword);

        if (valid) {
            const deleted = await deleteUser(username);
            if (deleted) {
                const added = await addNewUser(username, newPassword);
                if (added) {
                    alert("Password updated successfully!");
                    window.location.href = "LoginPage.html";
                } else {
                    alert("Failed to add new user.");
                }
            } else {
                alert("Failed to delete old user.");
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
        const allUsers = Object.values(users).flat(); // Flatten nested arrays

        console.log(allUsers); // Optional: to verify structure

        for (const user of allUsers) {
            if (user.username === username && user.password === oldPassword) {
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error("Error verifying password:", error);
        return false;
    }
}

async function deleteUser(username) {
    try {
        // Fetch all users to find the UID of the target user
        const response = await fetch('http://localhost:3000/routes/Login');
        if (!response.ok) {
            throw new Error(`Failed to fetch users: ${response.status}`);
        }

        const rawUsers = await response.json();
        const users = Object.values(rawUsers).flat();

        const targetUser = users.find(user => user.username === username);
        if (!targetUser) {
            console.error("User not found");
            return false;
        }

        const uid = targetUser.uid;

        // Send a DELETE request to remove the user by UID
        const deleteResponse = await fetch(`http://localhost:3000/routes/Login?uid=${uid}`, {
            method: 'DELETE', // Send a DELETE request
        });

        if (!deleteResponse.ok) {
            const errorText = await deleteResponse.text();
            throw new Error(`Failed to delete user: ${errorText}`);
        }

        console.log('User deleted successfully');
        return true;
    } catch (error) {
        console.error("Error deleting user:", error);
        return false;
    }
}

async function addNewUser(username, newPassword) {
    try {
        // Prepare the data for the new user
        const newUser = {
            username: username,
            password: newPassword,
        };

        // Send a POST request to add a new user
        const addResponse = await fetch('http://localhost:3000/routes/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        });

        if (!addResponse.ok) {
            const errorText = await addResponse.text();
            throw new Error(`Failed to add new user: ${errorText}`);
        }

        console.log('New user added successfully');
        return true;
    } catch (error) {
        console.error("Error adding new user:", error);
        return false;
    }
}
