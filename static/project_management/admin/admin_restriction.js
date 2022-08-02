$(document).ready(function () {
    var user_type = sessionStorage.getItem('USER_TYPE')
    if (user_type != 'Admin') {
      window.location.replace('/error_page')
    }
    else{
      $('#user_type').html('Administrator');
    }
});