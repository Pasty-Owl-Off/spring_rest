const getUsers = "http://localhost:8080/api/users";
const getAuthUser = "http://localhost:8080/api/auth_user";
const postNewUser = "http://localhost:8080/api/new";
const postUpdateUser = "http://localhost:8080/api/update";
const postDeleteUser = "http://localhost:8080/api/delete";
const getRoles = "http://localhost:8080/api/roles";
const csrfToken = getCookie('XSRF-TOKEN');

document.addEventListener("DOMContentLoaded", () => {
    populateUserTableAndHeader();
    if (document.getElementById('usersTable') != null) {
        populateUsersTableAndModals();
    }

    if (document.getElementById('editUserButtonModal') != null) {
        document.getElementById('editUserButtonModal').addEventListener('click', (event) => {
            event.preventDefault();

            const userEdit = {
                id: Number(document.getElementById('idEditUser').value),
                name: document.getElementById('nameEditUser').value,
                surname: document.getElementById('surnameEditUser').value,
                age: Number(document.getElementById('ageEditUser').value),
                email: document.getElementById('emailEditUser').value,
                username: document.getElementById('usernameEditUser').value,
                password: document.getElementById('passwordEditUser').value,
                roles: Array.from(document.getElementById('rolesEditUser').selectedOptions).map(option => option.value)
            };

            fetch(postUpdateUser, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': csrfToken
                 },
                body: JSON.stringify(userEdit)
            })
                .then(response => {
                    if (response.ok) {
                        const closeButton = document.getElementById('closeButtonEditModal');
                        if (closeButton) {
                            closeButton.click();
                        }
                        populateUsersTableAndModals();
                    } else {
                        return response.json().then(errors => {
                            displayValidationErrorsForEdit(errors);
                        })
                    }
                })
                .catch(error => {
                    console.error('Ошибка при отправке запроса: ', error);
                });
        });
    }

    if (document.getElementById('newUserButton') != null) {
        document.getElementById('newUserButton').addEventListener('click', async (event) => {
            event.preventDefault();

            const newUser = {
                id: null,
                name: document.getElementById('name').value,
                surname: document.getElementById('surname').value,
                age: Number(document.getElementById('age').value),
                email: document.getElementById('email').value,
                username: document.getElementById('username').value,
                password: document.getElementById('password').value,
                passwordConfirm: document.getElementById('passwordConfirm').value,
                roles: Array.from(document.getElementById('roles').selectedOptions).map(option => option.value)
            };

            fetch(postNewUser, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': csrfToken
                 },
                body: JSON.stringify(newUser)
            })
                .then(response => {
                    if (response.ok) {
                        populateUsersTableAndModals();
                        const errorFields = Array.from(document.querySelectorAll('[id$="NewUserError"]'));
                        errorFields.forEach(errorField => errorField.textContent = '');

                        alert('New user is created');
                    } else {
                        return response.json().then(errors => {
                        displayValidationErrorsForNew(errors);
                        })
                    }
                })
                .catch(error => {
                            console.error('Ошибка при отправке запроса: ', error);
                });
        });
    }

    if (document.getElementById('deleteUserButtonModal') != null) {
        document.getElementById('deleteUserButtonModal').addEventListener('click', async (event) => {
            const idDeleteUser = Number(document.getElementById('idDeleteUser').value);

            fetch(postDeleteUser, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': csrfToken
                 },
                body: JSON.stringify(idDeleteUser)
            })
                .then(response => {
                    if (response.ok) {
                        const closeButton = document.getElementById('closeButtonDeleteModal');
                        if (closeButton) {
                            closeButton.click();
                        }
                        populateUsersTableAndModals();
                    }
                })
                .catch(error => {
                    console.error('Ошибка при отправке запроса: ', error);
                })
        });
    }
});

function populateUserTableAndHeader() {
    fetch(getAuthUser)
        .then(response => {
            if (!response.ok) {
                throw new Error("Ошибка сети: " + response.status);
            }
            return response.json();
        })
        .then(data => {
            const authUser = data;
            if (document.getElementById('authUserTable') != null) {
                populateAuthUserTable(authUser);
            }
            populateHeader(authUser);
        })
        .catch (error => {
            console.error("Ошибка при загрузке данных: ", error);
        });
}

function populateUsersTableAndModals() {
    fetch(getUsers)
        .then(response => {
            if (!response.ok) {
                throw new Error("Ошибка сети: " + response.status);
            }
            return response.json();
        })
        .then(data => {
            const users = data;
            populateUsersTable(users);
            setRolesOfOption();
        })
        .catch (error => {
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
                       data-toggle="modal"
                       data-target="#edit"
                       onclick="populateEditModal(${user.id})">Edit</a>
                </td>
                <td>
                    <a class="btn btn-danger btn-lg text-white"
                     data-toggle="modal"
                     data-target="#delete"
                     onclick="populateDeleteModal(${user.id})">Delete</a>
                </td>
            </tr>
        `;
    });
}

function populateEditModal(id) {
    getUserById(id)
        .then(user => {
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
                if (rolesEditUser.includes(option.textContent)) {
                    option.selected = true;
                } else {
                    option.selected = false;
                }
            });
        })
        .catch(error => {
            console.error("Ошибка при загрузке данных: ", error);
        });
}

async function populateDeleteModal(id) {
    getUserById(id)
        .then(user => {
            document.getElementById('idDeleteUser').value = user.id;
            document.getElementById('nameDeleteUser').value = user.name;
            document.getElementById('surnameDeleteUser').value = user.surname;
            document.getElementById('ageDeleteUser').value = user.age;
            document.getElementById('emailDeleteUser').value = user.email;
            document.getElementById('usernameDeleteUser').value = user.username;

            const rolesDeleteUser = Array.from(user.roles);

            const selectRoleDelete = document.getElementById('rolesDeleteUser');
            selectRoleDelete.innerHTML = ``;
            rolesDeleteUser.forEach(role => {
                const option = document.createElement('option');
                option.value = role.id;
                option.textContent = role.name;
                selectRoleDelete.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Ошибка при загрузке данных: ", error);
        });
}

function displayValidationErrorsForEdit(errors) {
    const errorFields = Array.from(document.querySelectorAll('[id$="EditUserError"]'));
    errorFields.forEach(errorField => errorField.textContent = '');

    for (const [field, message] of Object.entries(errors)) {
        const errorElement = document.querySelector(`#${field}EditUserError`);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }
}

function displayValidationErrorsForNew(errors) {
    const errorFields = Array.from(document.querySelectorAll('[id$="NewUserError"]'));
    errorFields.forEach(errorField => errorField.textContent = '');

    for (const [field, message] of Object.entries(errors)) {
        const errorElement = document.querySelector(`#${field}NewUserError`);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }
}

function getUserById(id) {
    return fetch('/api/user?id=' + id)
        .then(response => {
            if (!response.ok) {
                throw new Error("Ошибка сети: " + response.status);
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch (error => {
            console.error("Ошибка при загрузке данных: ", error);
        });
}

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
    return null;
}

function getAllRoles() {
    return fetch(getRoles)
        .then(response => {
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error("Ошибка при загрузке данных: ", error);
        });
}

function setRolesOfOption() {
    const selectorEdit = document.getElementById('rolesEditUser');
    const selectorNew = document.getElementById('roles');

    selectorEdit.innerHTML = '';
    selectorNew.innerHTML = '';

    getAllRoles()
        .then(roles => {
            roles.forEach(role => {
                const optionNew = document.createElement('option');
                optionNew.value = role.id;
                optionNew.textContent = role.name;
                selectorNew.appendChild(optionNew);

                const optionEdit = document.createElement('option');
                optionEdit.value = role.id;
                optionEdit.textContent = role.name;
                selectorEdit.appendChild(optionEdit);
            });
        })
        .catch(error => {
            console.error("Ошибка при загрузке данных: ", error);
        });
}