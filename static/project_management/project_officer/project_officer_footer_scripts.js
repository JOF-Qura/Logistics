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
    $.ajax({
        url: '/employees/user/' + sessionStorage.getItem("id"),
        type: "GET",
        dataType: "JSON",

        success: function (data) {
            // var first_name = data.first_name.charAt(0).toUpperCase() + data.first_name.slice(1);
            // var last_name = data.last_name.charAt(0).toUpperCase() + data.last_name.slice(1);
            // var suffix_name = data.suffix_name.charAt(0).toUpperCase() + data.suffix_name.slice(1);
            // $('#full_name').html(first_name + ' ' + last_name + ' ' + suffix_name);

            var department = data.departments.name
            var manager_id = data.employee_id
            var department_id = data.department_id

            sessionStorage.setItem("manager_id", manager_id);
            sessionStorage.setItem("department_id", department_id);

            // $('#department').html(department);
        }
    })
    
    $('#full_name').html(sessionStorage.getItem("name"));
    $('#user_type').html(sessionStorage.getItem("type"));
    $('#department').html(sessionStorage.getItem("DEPARTMENTNAME"));
});