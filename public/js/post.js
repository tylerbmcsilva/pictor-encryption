function main(window, document) {
  console.log('LOADED');
  const EDIT_POST = window.location.pathname.includes('/edit');

  document.getElementById("post-form").addEventListener("submit", handleFormSubmit);

  async function handleFormSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log(EDIT_POST);
    showePreloader();

    const user_id   = parseInt(document.getElementById('user-id').value);
    const title     = document.getElementById('post-title').value;
    const post_type = 'text';
    const body      = document.getElementById('post-body').value;
    const url       = document.getElementById('post-url').value;

    if(validateFormEntries(user_id, title, post_type) === false) {
      hidePreloader();
      return;
    }

    const payload = {
      user_id,
      title,
      body: body ? body : '',
      url:  url ? url : '',
      post_type,
      date: (new Date()).toISOString()
    }

    if(EDIT_POST) {
      console.log('EDIT!');
      const postId    = window.location.pathname.split('/')[2];
      console.log(postId);
      const { data }  = await putDataToUrl(`/api/post/${postId}`, payload);
      window.location.pathname = `/post/${postId}`;
    } else {
      console.log('new post');
      const { data }  = await postDataToUrl('/api/post/new', payload);
      window.location.pathname = `/post/${data.id}`;
    }
  }

  function validateFormEntries(user_id, title, post_type) {
    if(user_id && title && post_type)
      return true;
    else
      return false;
  }
}

!function(w,d) {
  main(w,d);
}(window, document);
