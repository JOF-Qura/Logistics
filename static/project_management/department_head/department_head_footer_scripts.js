// var department_id

$('#logout_form').on('submit', function (e) {
    // e.preventDefault();
    // window.location.replace('/')
    // sessionStorage.clear();
    $.ajax(
        {
            url: "http://localhost:8000/" + "auth/logout",
            type: "POST",
            success: function (data)
            {
                sessionStorage.removeItem("TOKEN");
                sessionStorage.removeItem("USER_EMAIL");
                sessionStorage.removeItem("USER_TYPE");
                sessionStorage.clear();
                localStorage.clear();
                
                window.location.replace("http://localhost:8000/");
            }
        });
});

$(document).ready(function () {
    $('#full_name').html(sessionStorage.getItem("name"));
    $('#user_type').html(sessionStorage.getItem("type"));
    $('#department').html(sessionStorage.getItem("DEPARTMENTNAME"));
});