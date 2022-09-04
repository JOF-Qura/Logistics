const webURL = "http://localhost:8000/vendor/";
const apiURL = "http://localhost:8000/";

const notification = (type, title, message) => {
  return toastr[type](message, title);
};

toastr.options = {
  positionClass: "toast-top-center",
};

$(function () {
  localStorage.removeItem("TOKEN");
  localStorage.removeItem("ID");
  localStorage.removeItem("VENDORNAME");
  localStorage.removeItem("INDUSTRY");
  localStorage.removeItem("VENDORSTATUS");

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
          url: apiURL + "homies/vendor-login",
          // contentType: "application/x-www-form-urlencoded",
          type: "POST", // post, put, delete, get
          data: {
            username: $("#email").val(),
            password: $("#password").val(),
          },
          dataType: "json",
          success: function (data) {
            if (data.access_token) {
              console.log(data)
              localStorage.setItem("TOKEN", data.access_token);
              localStorage.setItem("ID", data.data.id);
              // localStorage.setItem("USERID", data.data.id);

              localStorage.setItem("VENDORNAME", data.data.vendor_name);
              // localStorage.setItem("INDUSTRY", data.vendor.industry);
              localStorage.setItem("VENDORSTATUS", data.status);

              $.getJSON(
                "https://api.ipify.org?format=json",
                function (ip_data) {
                  localStorage.setItem("CLIENT_IP", ip_data.ip);
                }
              )
                .done(function () {
                  vendorLoginAjax()
                 
                })
                .fail(function () {
                  vendorLoginAjax()
                })
                .always(function () {
                  window.location.replace(webURL + "dashboard");
                  // console.log(data.id)
                });

              // }, 2000);
            }
          },
          error: function ({ responseJSON }) {
            notification("warning", "Incorrect Email or Password");
 
          },
        });
      },
    });
});

// function to insert vendor time log
vendorLoginAjax = () =>{
  $.ajax({
    url: apiURL + "api/v1/vendor-time-log",
    // contentType: "application/x-www-form-urlencoded",
    type: "POST", // post, put, delete, get
    data: JSON.stringify({
      logged_type: "Logged In",
      client_ip: localStorage.getItem("CLIENT_IP"),
      vendor_id: localStorage.getItem("ID"),
    }),
    contentType: "application/json",
    processData: false,
    cache: false,
    dataType: "json",
    success: function (data) {
      if (data) {
      }
    },
    error: function ({ responseJSON }) {
      // notification("warning","Incorrect Email or Password");
    },
  });
}