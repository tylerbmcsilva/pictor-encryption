function main(window, document) {

  document.getElementById("edit_about_form").addEventListener("submit", handleEditAboutSubmit);

  async function handleEditAboutSubmit(event) {
    event.preventDefault();
    let firstName = document.getElementById("user-firstname").value;
    let lastName = document.getElementById("user-lastname").value;
    let location = document.getElementById("user-location").value;
    let phone = document.getElementById("user-phone").value;
    let gender = document.getElementById("user-gender").value;
    let birthdate = document.getElementById("user-birthdate").value;
    let language = document.getElementById("user-language").value;
    let school = document.getElementById("user-school").value;
    let work = document.getElementById("user-work").value;

    let data = {
      first_name: firstName,
      last_name: lastName,
      location: location,
      json_block: {
        phone: phone,
        gender: gender,
        birthdate: birthdate,
        language: language,
        school: school,
        work: work,
      }
      // email:      email,
      // key:        pem
    };
    let payload = data;
    // let payload = await encryptUsingRSA(SERVER_KEY, data);
    // Encrypt payload with server public key

    // POST data from form
    postDataToUrl(`${window.location.origin}/api${window.location.pathname}/update`, payload);
    window.location.pathname = `${window.location.pathname}`;
  }

  function postDataToUrl(url, data) {
    return axios.post(url, data)
      .catch(function(err) {
        // SILENTLY FAIL
        return;
      });
  }
}


!function(w,d) {
  w.addEventListener('DOMContentLoaded', main(w,d));
}(window, document);
