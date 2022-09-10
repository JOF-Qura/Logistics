$('#logout_form').on('submit', function (e) {
    e.preventDefault();
    window.location.replace('/')
    sessionStorage.clear();
});

$(document).ready(function () {
    $('#full_name').html(sessionStorage.getItem("name"));
    $('#user_type').html(sessionStorage.getItem("type"));
    $('#department').html(sessionStorage.getItem("DEPARTMENTNAME"));
});