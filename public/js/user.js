document.getElementById("edit_basic").addEventListener("click", getCurrentBasicData);
document.getElementById("edit_basic_form").addEventListener("submit", handleEditBasicSubmit);
document.getElementById("edit_about").addEventListener("click", getCurrentAboutData);
document.getElementById("edit_about_form").addEventListener("submit", handleEditAboutSubmit);

async function handleEditBasicSubmit(event) {
    event.preventDefault();

    let firstName = document.getElementById("first_name").value;
    let lastName = document.getElementById("last_name").value;
    let location = document.getElementById("location").value;

    let data = {
      firstName: firstName,
      lastName: lastName,
      location: location,
      // email:      email,
      // key:        pem
    };
    let payload = data;
    // let payload = await encryptUsingRSA(SERVER_KEY, data);


    // Encrypt payload with server public key
    // POST data from form
    postDataToUrl("/api/user/update", payload);
    window.location.pathname = `${window.location.pathname}`;
}

async function handleEditAboutSubmit(event) {
    event.preventDefault();

    let phone = document.getElementById("phone").value;
    let gender = document.getElementById("gender").value;
    let birthdate = document.getElementById("birthdate").value;
    let language = document.getElementById("language").value;
    let school = document.getElementById("school").value;
    let work = document.getElementById("work").value;

    let data = {
      phone: phone,
      gender: gender,
      birthdate: birthdate,
      language: language,
      school: school,
      work: work,
      // email:      email,
      // key:        pem
    };
    let payload = data;
    // let payload = await encryptUsingRSA(SERVER_KEY, data);


    // Encrypt payload with server public key
    // POST data from form
    postDataToUrl("/api/user/update", payload);
    window.location.pathname = `${window.location.pathname}`;
}

function getCurrentBasicData() {
  let name = document.getElementById("user-name").textContent.split(" ");
  let firstName = name[0];
  let lastName = name[1];

  document.getElementById("first_name").value = firstName;
  document.getElementById("last_name").value = lastName;
  document.getElementById("location").value = document.getElementById("user-location").textContent;

  M.updateTextFields();
}

function getCurrentAboutData() {
  document.getElementById("phone").value = document.getElementById("user-phone").textContent;
  document.getElementById("gender").value = document.getElementById("user-gender").textContent;
  document.getElementById("birthdate").value = document.getElementById("user-birthdate").textContent;
  document.getElementById("language").value = document.getElementById("user-language").textContent;
  document.getElementById("school").value = document.getElementById("user-school").textContent;
  document.getElementById("work").value = document.getElementById("user-work").textContent;

  M.updateTextFields();
}

function postDataToUrl(url, data) {
  return axios.post(url, data)
    .catch(function(err) {
      // SILENTLY FAIL
      return;
    });
}
