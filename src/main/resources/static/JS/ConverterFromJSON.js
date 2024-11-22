const getUsers = "http://localhost:8080/api/users";
const getAuthUser = "http://localhost:8080/api/auth_user";

document.addEventListener("DOMContentLoaded", async () => {

    populateUserTableAndHeader();
    populateUsersTableAndModals();
});

function populateUserTableAndHeader() {
    await fetch(getAuthUser)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Ошибка сети: " + response.status);
                }
                return response.json();
            })
            .then(authUser => {
                if (document.getElementById('authUserTable') != null) {
                    populateAuthUserTable(authUser);
                }
                populateHeader(authUser);
            })
            .catch(error => {
                console.error("Ошибка при загрузке данных: ", error);
            });
}

function populateUsersTableAndModals() {
    await fetch(getUsers)
        .then(response => {
            if (!response.ok) {
                throw new Error("Ошибка сети: " + response.status);
            }
            return response.json();
        })
        .then(users => {
            populateUsersTable(users);
        })
        .catch(error => {
            console.error("Ошибка при загрузке данных: ", error);
        });
}

function populateHeader(authUser) {
    const email = document.getElementById("emailHead");
    const roles = document.getElementById("rolesHead");

    email.textContent = authUser.email;
    roles.textContent = " with roles: " + authUser.stringRoles;
}

function populateAuthUserTable(authUser) {
    const authUserTable = document.querySelector('#authUserTable tbody');
    authUserTable.innerHTML = `
        <tr>
            <td>${authUser.id}</td>
            <td>${authUser.name}</td>
            <td>${authUser.surname}</td>
            <td>${authUser.age}</td>
            <td>${authUser.email}</td>
            <td>${authUser.username}</td>
            <td>${authUser.stringRoles}</td>
        </tr>
    `;
}

function populateUsersTable(users) {
    const usersTable = document.querySelector('#usersTable');

    usersTable.innerHTML = '';
    users.forEach(user => {
        usersTable.innerHTML += `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.surname}</td>
                <td>${user.age}</td>
                <td>${user.email}</td>
                <td>${user.username}</td>
                <td>${user.stringRoles}</td>
                <td>
                    <a class="btn btn-info btn-lg text-white"
                       data-bs-toggle="modal"
                       data-bs-target="#edit"
                       onclick="populateEditModal(${user})">edit</a>
                </td>
                <td>
                    <a class="btn btn-danger btn-lg text-white"
                     data-bs-toggle="modal"
                     data-bs-target="#delete"
                     onclick="populateDeleteModal(${user})">delete</a>
                </td>
            </tr>
        `;
    });
}

function populateEditModal(user) {
    document.getElementById('idEditUser').value = user.id;
    document.getElementById('nameEditUser').value = user.name;
    document.getElementById('surnameEditUser').value = user.surname;
    document.getElementById('ageEditUser').value = user.age;
    document.getElementById('emailEditUser').value = user.email;
    document.getElementById('usernameEditUser').value = user.username;
    document.getElementById('passwordEditUser').value = user.password;

    const rolesEditUser = Array.from(user.roles).map(role => role.name);

    const options = document.getElementById('rolesEditUser').querySelectorAll('option');
    options.forEach(option => {
        if (rolesEditUser.includes(option.value)) {
            option.selected = true;
        } else {
            option.selected = false;
        }
    });
}

function populateDeleteModal(user) {
    document.getElementById('idDeleteUser').value = user.id;
    document.getElementById('nameDeleteUser').value = user.name;
    document.getElementById('surnameDeleteUser').value = user.surname;
    document.getElementById('ageDeleteUser').value = user.age;
    document.getElementById('emailDeleteUser').value = user.email;
    document.getElementById('usernameDeleteUser').value = user.username;
    document.getElementById('passwordDeleteUser').value = user.password;

    const rolesDeleteUser = Array.from(user.roles).map(role => role.name);

    const selectRoleDelete = document.getElementById('rolesDeleteUser');
    selectRoleDelete.innerHTML = ``;
    rolesDeleteUser.forEach(role => {
        const option = document.createElement('option');
        option.value = role;
        option.textContent = role;
        selectRoleDelete.appendChild(option);
    });
}