document.getElementById("edit_location").addEventListener("click", getCurrentLocationData);
document.getElementById("edit_location_form").addEventListener("submit", handleEditLocationSubmit);
document.getElementById("edit_about").addEventListener("click", getCurrentAboutData);
document.getElementById("edit_about_form").addEventListener("submit", handleEditAboutSubmit);

async function handleEditLocationSubmit(event) {
    event.preventDefault();

    let city = document.getElementById("city").value;
    let state = document.getElementById("state").value;

    let data = {
      city: city,
      state:  state,
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
    // window.location.pathname = "/user/5432";
}

function getCurrentLocationData() {
  let location = document.getElementById("user-location").textContent.split(", ");
  let city = location[0];
  let state = location[1];

  document.getElementById("city").value = city;
  document.getElementById("state").value = state;

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
