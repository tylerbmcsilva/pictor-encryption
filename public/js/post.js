function main(window, document) {
  document.getElementById("new_post").addEventListener("submit", handleCreateFormSubmit);

  async function handleCreateFormSubmit(e) {
    e.preventDefault();
    showePreloader();

    const user_id   = parseInt(document.getElementById('user-id').value);
    const title     = document.getElementById('post-title').value;
    const post_type = document.getElementById('post-type').value ? document.getElementById('post-type').value : 'text';
    const body      = document.getElementById('post-body').value;
    const url       = document.getElementById('post-url').value;

    if(validateFormEntries(user_id, title, post_type) === false) {
      hidePreloader();
      return;
    }

    const payload = {
      user_id,
      title,
      body,
      url,
      post_type,
      date: (new Date()).toISOString()
    }

    const { data } = await postDataToUrl("/api/post/new", payload);
    console.log(data);
    window.location.pathname = `/post/${data.id}`;
  }

  function validateFormEntries(user_id, title, post_type) {
    if(user_id && title && post_type)
      return true;
    else
      return false;
  }

  async function postDataToUrl(url, data) {
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
