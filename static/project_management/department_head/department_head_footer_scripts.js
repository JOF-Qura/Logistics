// var department_id

$('#logout_form').on('submit', function (e) {
    e.preventDefault();
    sessionStorage.clear();
    window.location.replace('/')
});

// $(document).ready(function () {
//     $.ajax({
//         url: '/employee/user/' + user_id,
//         type: "GET",
//         dataType: "JSON",

//         success: function (data) {
//             var first_name = data.first_name.charAt(0).toUpperCase() + data.first_name.slice(1);
//             var last_name = data.last_name.charAt(0).toUpperCase() + data.last_name.slice(1);
//             var suffix_name = data.suffix_name.charAt(0).toUpperCase() + data.suffix_name.slice(1);
//             $('#full_name').html(first_name + ' ' + last_name + ' ' + suffix_name);

//             department = data.departments.name
//             department_id = data.department_id

//             $('#department').html(department);
//         }
//     })
// });