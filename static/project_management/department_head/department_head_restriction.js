$(document).ready(function () {
    var user_type = sessionStorage.getItem('user_type')
    if (user_type != 'Department Head') {
      window.location.replace('/error_page')
    }
    else{
      $('#user_type').html('Department Head');
    }
});