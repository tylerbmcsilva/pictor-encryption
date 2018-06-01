
// Function to grab info from form
document.getElementById("login").addEventListener("submit", handleSignInSubmit);

async function handleSignInSubmit(e) {
  e.preventDefault();
  //showePreloader();

  const USER_EMAIL  = document.getElementById("email_login").value;
  const PASSWORD = document.getElementById("password_login").value;
  //const USER_KEY    = await getDataFromIndexedDB(USER_EMAIL);

  let payload = {
    email: USER_EMAIL,
    password: PASSWORD
  };
  let response = await postDataToUrl("/signin", payload);

  if(response.data.message==="success"){
    window.location.pathname = "/feed";
  }
  else {
    document.getElementById("login-error").innerHTML = "Incorrect email or password";
  }
}
