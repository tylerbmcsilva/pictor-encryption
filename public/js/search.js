// Function to grab info from form
document.getElementById("search").addEventListener("submit", handleSearchSubmit);

async function handleSearchSubmit(e) {
  e.preventDefault();
  const searchForThis  = document.getElementById("autocomplete-input").value;
  window.location.pathname = "/search/"+ searchForThis;
}
