const apiURL = "http://localhost:8000/api/v1/";
const webURL = "http://localhost:8000/";

const notification = (type, title, message) => {
  return toastr[type](message, title);
};

toastr.options = {
  positionClass: "toast-top-center",
};

$(function () {

  // clear local storage
  localStorage.removeItem("TOKEN");
  localStorage.removeItem("ID");
  localStorage.removeItem("employee_type");
  localStorage.removeItem("FIRSTNAME");
  localStorage.removeItem("LASTNAME");
  localStorage.clear();

  $("#loginForm")
    .on("submit", function (e) {
      e.preventDefault(); // prevent page refresh
    })
    .validate({
      rules: {
        // simple rule, converted to {required:true}
        email: {
          email: true,
          required: true,
        },
        // compound rule
        password: {
          required: true,
        },
      },
      messages: {
        email: {
          required: "please provide email",
          email: "please enter valid email",
        },

        password: {
          required: "please provide password",
        },
      },
      errorElement: "span",
      errorPlacement: function (error, element) {
        error.addClass("invalid-feedback");
        element.closest(".input-group").append(error);
      },
      highlight: function (element, errorClass, validClass) {
        $(element).addClass("is-invalid");
      },
      unhighlight: function (element, errorClass, validClass) {
        $(element).removeClass("is-invalid");
        $(element).addClass("is-valid");
      },
      submitHandler: function () {
        $.ajax({
          url: webURL + "login",
          // contentType: "application/x-www-form-urlencoded",
          type: "POST", // post, put, delete, get
          data: {
            username: $("#email").val(),
            password: $("#password").val(),
          },
          dataType: "json",
          success: function (data) {
            if (data.access_token) {

              console.log(data.employee_type.name);
              localStorage.setItem("TOKEN", data.access_token);
              localStorage.setItem("ID", data.data.id);
              localStorage.setItem("EMPLOYEETYPE", data.employee_type.name);
              localStorage.setItem("DEPARTMENTID", data.department.id);
              localStorage.setItem(
                "DEPARTMENTNAME",
                data.department.department_name
              );

              localStorage.setItem("FIRSTNAME", data.data.employees.first_name);
              localStorage.setItem("LASTNAME", data.data.employees.last_name);

              window.location.replace(webURL + "main-dashboard");
            }
          },
          error: function ({ responseJSON }) {
            notification("warning", responseJSON.detail);
          },
        });
      },
    });
});
