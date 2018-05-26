// Function to grab info from form
document.getElementById("search").addEventListener("submit", handleSearchSubmit);
document.getElementById("deleteFriend").addEventListener("click", handleDeleteSubmit);

async function handleSearchSubmit(e) {
  e.preventDefault();
  const searchForThis  = document.getElementById("autocomplete-input").value;
  window.location.pathname = "/search/"+ searchForThis;
}

async function handleDeleteSubmit(e) {
  window.location.pathname = "/friends";
}
