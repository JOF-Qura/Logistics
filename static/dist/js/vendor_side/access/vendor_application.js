// NOT USED


const apiURL = "http://localhost:8000/api/v1/";
// const webURL = "http://localhost:8000/vendor/";

const notification = (type, title, message) => {
  return toastr[type](message, title);
};

toastr.options = {
  positionClass: "toast-top-center",
};

$(function () {
  $(".select2").select2();

  $("#applicationForm")
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
        vendor_name: {
          required: true,
        },

        // compound rule
        contact_no: {
          required: true,
        },
        contact_person: {
          required: true,
        },

        // compound rule
        vendor_website: {
          required: true,
        },
        organization_type: {
          required: true,
        },

        // compound rule
        region: {
          required: true,
        },
        province: {
          required: true,
        },

        // compound rule
        municipality: {
          required: true,
        },

        email: {
          required: true,
        },

        street: {
          required: true,
        },
      },
      messages: {
        email: {
          required: "please provide email",
          email: "please enter valid email",
        },

        // compound rule
        vendor_name: {
          required: "please provide vendor name",
        },

        // compound rule
        contact_no: {
          required: "please provide contact no",
        },
        contact_person: {
          required: "please provide contact person",
        },

        // compound rule
        vendor_website: {
          required: "please provide vendor_website",
        },
        organization_type: {
          required: "please provide organization_type",
        },

        // compound rule
        region: {
          required: "please provide region",
        },
        province: {
          required: "please provide province",
        },

        // compound rule
        municipality: {
          required: "please provide municipality",
        },

        email: {
          required: "please provide email",
        },

        street: {
          required: "please provide street",
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
          url: apiURL + "vendor-application",
          // contentType: "application/x-www-form-urlencoded",
          type: "POST", // post, put, delete, get
          contentType: "application/json",

          data: JSON.stringify({
            vendor_name: $("#vendor_name").val(),
            contact_no: $("#contact_no").val(),
            contact_person: $("#contact_person").val(),
            vendor_website: $("#vendor_website").val(),
            email: $("#email").val(),
            organization_type: $("#organization_type").val(),

            region: $("#region").val(),
            province: $("#province").val(),
            municipality: $("#municipality").val(),
            barangay: $("#barangay").val(),
            street: $("#street").val(),
            category_id: $("#category_id").val(),
          }),
          dataType: "json",
          processData: false,
          cache: false,
          success: function (data) {
            if (data) {
              $(".is-invalid").removeClass("is-invalid");
              $(".is-valid").removeClass("is-valid");
              $("#applicationForm")[0].reset();
              notification("success", "Application Successfully Submitted");
            }
          },
          error: function ({ responseJSON }) {
            $(".is-invalid").removeClass("is-invalid");
            $(".is-valid").removeClass("is-valid");
            notification("warning", "Email Already Exist");
          },
        });
      },
    });
});

// function to load category
loadCategory = () => {
  $.ajax({
    url: apiURL + "category/",
    type: "GET",
    // headers: {
    //   Accept: "application/json",
    //   Authorization: "Bearer " + localStorage.getItem("TOKEN"),
    // },
    dataType: "json",
    success: function (responseData) {
      if (responseData) {
        $("#category_id").empty();
        $.each(responseData, function (i, dataOptions) {
          var options = "";
          options =
            "<option value='" +
            dataOptions.id +
            "'>" +
            dataOptions.category_name +
            "</option>";

          $("#category_id").append(options);
        });
      } else {
        // notification("error", "Error!", responseData.message);
        console.log("error", "Error!", responseData.success);
      }
    },
    error: function ({ responseJSON }) {},
  });
};

loadCategory();
