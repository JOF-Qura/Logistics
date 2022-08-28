$(function () {
  $(".select2").select2();

  // submit form
  $("#form_id")
    .on("submit", function (e) {
      e.preventDefault();
      // trimInputFields();
    })
    .validate({
      rules: {
        // simple rule, converted to {required:true}
        vendor_name: {
          required: true,
        },
        // compound rule

        contact_person: {
          required: true,
        },

        contact_no: {
          required: true,
        },
        // compound rule
        email: {
          required: true,
        },
        region: {
          required: true,
        },
        province: {
          required: true,
        },

        // municipality: {
        //   required: true,
        // },
      },
      messages: {
        vendor_name: {
          required: "please provide Vendor name",
        },
        contact_person: {
          required: "please provide contact person",
        },

        contact_no: {
          required: "please provide contact number",
        },
        email: {
          required: "please provide email",
        },

        region: {
          required: "please provide region",
        },

        province: {
          required: "please provide province",
        },
      },
      errorElement: "span",
      errorPlacement: function (error, element) {
        error.addClass("invalid-feedback");
        element.closest(".form-group").append(error);
      },
      highlight: function (element, errorClass, validClass) {
        $(element).addClass("is-invalid");
      },
      unhighlight: function (element, errorClass, validClass) {
        $(element).removeClass("is-invalid");
        $(element).addClass("is-valid");
      },
      submitHandler: function () {
        // var form_data = new FormData(this);
        var form_data = new FormData(document.getElementById("form_id"));
        console.log(form_data);
        // Display the values
        // for (var value of form_data.values()) {
        //   console.log(value);
        // }
        form_data.set("region", $("#region").find(":selected").text());
        form_data.set("province", $("#province").find(":selected").text());
        form_data.set(
          "municipality",
          $("#municipality").find(":selected").text()
        );
        form_data.set("barangay", $("#barangay").find(":selected").text());

        // form_data.append("_method", "PUT");

        console;
        $.ajax({
          url: apiURL + "vendor/" + localStorage.getItem("ID"),
          type: "PUT",
          data: form_data,

          dataType: "json",
          contentType: false,
          processData: false,
          cache: false,
          success: function (data) {
            if (data) {
              notification("success", "Updated!", "Vendor Successfuly Updated");
              console.log("success " + data);

              // $("#modal-xl").modal("hide");

              setTimeout(function () {
                window.location.reload();
              }, 2000);
            } else {
              console.log("error " + data.message);
            }
          },
          error: function ({ responseJSON }) {},
        });
      },
    });

  // load vendor info
  $.ajax({
    url: apiURL + "vendor/" + localStorage.getItem("ID"),
    type: "GET",
    dataType: "json",

    success: function (data) {
      if (data) {
        $("#uuid").val(data["id"]);
        $("#photo_path_placeholder").attr(
          "src",
          apiURL + "vendor/vendor-pic/" + data["vendor_logo"]
        );

        $("#vendor_name").val(data["vendor_name"]);
        $("#barangay").val(data["barangay"]);
        $("#street").val(data["street"]);
        $("#organization_type").val(data["organization_type"]);
        $("#vendor_website").val(data["vendor_website"]);

        $("#category_id").val(data.category["id"]).trigger("change");

        $("#contact_no").val(data["contact_no"]);
        $("#contact_person").val(data["contact_person"]);

        $("#email").val(data["email"]);

     

        // settimeout
        function setTimeoutPromise(delay) {
          return new Promise((resolve, reject) => {
            if (delay < 0) return reject("Delay must be greater than 0");

            setTimeout(() => {
              resolve(`You waited ${delay} milliseconds`);
            }, delay);
          });
        }

        setTimeoutPromise(1500)
          .then((msg) => {
            $("#region option:contains(" + data["region"] + ")")
              .attr("selected", "selected")
              .trigger("change");

            return setTimeoutPromise(3000);
          })
          .then((msg) => {
            $("#province option:contains(" + data["province"] + ")")
              .attr("selected", "selected")
              .trigger("change");

            return setTimeoutPromise(4500);
          })
          .then((msg) => {
            $("#municipality option:contains(" + data["municipality"] + ")")
              .attr("selected", "selected")
              .trigger("change");
            return setTimeoutPromise(6000);
          })
          .then((msg) => {
            $("#barangay option:contains(" + data["barangay"] + ")")
              .attr("selected", "selected")
              .trigger("change");
          });

        // setTimeout(() => {

        // $("#region option:contains(" + data["region"] + ")")
        //   .attr("selected", "selected")
        //   .trigger("change");
        // }, 1500);

        // setTimeout(() => {
        //   $("#province option:contains(" + data["province"] + ")")
        //     .attr("selected", "selected")
        //     .trigger("change");

        // }, 3000);

        // setTimeout(() => {
        //   $("#municipality option:contains(" + data["municipality"] + ")")
        //     .attr("selected", "selected")
        //     .trigger("change");

        // }, 4500);

        // setTimeout(() => {
        //   $("#barangay option:contains(" + data["barangay"] + ")")
        //     .attr("selected", "selected")
        //     .trigger("change");

        // }, 6000);
      } else {
        notification("error", "Error!", data.message);
      }
    },
    error: function (data) {},
  });
});

// function to load category
loadCategory = () => {
  $.ajax({
    url: apiURL + "category/",
    type: "GET",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
    },
    dataType: "json",
    success: function (responseData) {
      if (responseData) {
        $("#category_id").empty();
        $("#application_category_id").empty();

        $.each(responseData, function (i, dataOptions) {
          var options = "";
          options =
            "<option value='" +
            dataOptions.id +
            "'>" +
            dataOptions.category_name +
            "</option>";

          $("#category_id").append(options);
          $("#application_category_id").append(options);
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


// PSGC API

let region = localStorage.getItem("region") || null;
let province = localStorage.getItem("province") || null;
let municipality = localStorage.getItem("municipality") || null;
let barangay = localStorage.getItem("barangay") || null;
let street = localStorage.getItem("street") || null;
let full_address = localStorage.getItem("full_address") || null;

function setRegion() {
  // Get region from storage (in this case, localStorage)
  let region = localStorage.getItem("region") || null;
  $.ajax({
    type: "get",
    url: apiURL + "vendor/psgc/api/regions",
    dataType: "json",
    success: function (response) {
      $("[name=region]").append(`
                <option value="">Choose Region</option>
            `);
      response.forEach((el) => {
        // Create element builder
        let builder;
        // Compare if region is same with code
        if (el.code == region) {
          p_region = el.code;
          // Add "selected" attribute if match
          builder = `
                        <option selected value="${el.code}">${el.name} (${el.regionName})</option>
                    `;
        } else {
          // Otherwise, add as option
          builder = `
                        <option value="${el.code}">${el.name} (${el.regionName})</option>
                    `;
        }
        // Add element builder to select
        $("[name=region]").append(builder);
      });
    },
  });
}

function setProvince(code, value = null) {
  $("[name=province]").prop("readonly", false);
  $("[name=province]").empty();
  $("[name=barangay]").prop("readonly", true);
  $("[name=barangay]").empty();
  $("[name=municipality]").prop("readonly", true);
  $("[name=municipality]").empty();
  $("[name=province]").append(`
        <option value="">Choose Province</option>
    `);

  $.ajax({
    type: "get",
    url: apiURL + "vendor/psgc/api/regions/" + code + "/provinces",
    dataType: "json",
    success: function (response) {
      response.forEach((el) => {
        if (el.code == value) {
          builder = `
                            <option selected value="${el.code}">${el.name}</option>
                        `;
        } else {
          builder = `
                            <option value="${el.code}">${el.name}</option>
                        `;
        }
        $("[name=province]").append(builder);
      });
    },
  });
}

function setMunicipality(code, region, value = null) {
  $("[name=municipality]").prop("readonly", false);
  $("[name=municipality]").empty();
  $("[name=barangay]").prop("readonly", true);
  $("[name=barangay]").empty();
  $("[name=municipality]").append(`
        <option value="">Choose Municipality</option>
    `);

  $.ajax({
    type: "get",
    url:
      apiURL + "vendor/psgc/api/provinces/" + code + "/cities-municipalities",
    dataType: "json",
    success: function (response) {
      response.forEach((el) => {
        if (el.code == value) {
          builder = `
                            <option selected value="${el.code}">${el.name}</option>
                        `;
        } else {
          builder = `
                            <option value="${el.code}">${el.name}</option>
                        `;
        }
        $("[name=municipality]").append(builder);
      });
    },
  });
}

function setBarangay(code, value = null) {
  $("[name=barangay]").prop("readonly", false);
  $("[name=barangay]").empty();

  $.ajax({
    type: "get",
    url:
      apiURL + "vendor/psgc/api/cities-municipalities/" + code + "/barangays",
    dataType: "json",
    success: function (response) {
      $("[name=barangay]").append(`
                <option value="">Choose Barangay</option>
            `);
      response.forEach((el) => {
        if (el.code == value) {
          builder = `
                        <option selected value="${el.code}">${el.name}</option>
                    `;
        } else {
          builder = `
                        <option value="${el.code}">${el.name}</option>
                    `;
        }
        $("[name=barangay]").append(builder);
      });
    },
  });
}

function setAddress() {
  setProvince(region, province);
  setMunicipality(province, region, municipality);
  setBarangay(municipality, barangay);
  $("[name=street]").val(street);
  $("#address").text(full_address);
}

$(document).ready(() => {
  $("[name=region]").select2({
    width: "100%",
    placeholder: { id: "", text: "Select Region" },
  });
  $("[name=province]").select2({
    width: "100%",
    placeholder: { id: "", text: "Select Region First" },
  });
  $("[name=municipality]").select2({
    width: "100%",
    placeholder: { id: "", text: "Select Province First" },
  });
  $("[name=barangay]").select2({
    width: "100%",
    placeholder: { id: "", text: "Select Municipality First" },
  });

  // Get Regions First
  setRegion();

  // OnChange Event of REGION to fill respective PROVINCES
  $("[name=region]").on("change", function () {
    region = $(this).val();
    setProvince(region);
  });

  // OnChange Event of PROVINCE to fill respective MUNICIPALITIES
  $("[name=province]").on("change", function () {
    province = $(this).val();
    setMunicipality(province, region);
  });

  // OnChange Event of MUNICIPALITY to fill respective BARANGAYS
  $("[name=municipality]").on("change", function () {
    municipality = $(this).val();
    setBarangay(municipality);
  });

  // If there is an existing address, fill up the form
  if (full_address != null) {
    setAddress();
  }
});

function saveAddress() {
  // Get INPUT values
  let region_val = $("#region").val();
  let province_val = $("#province").val();
  let municipality_val = $("#municipality").val();
  let barangay_val = $("#barangay").val();
  let street_val = $("#street").val();

  // Get SELECTED text (using Select2)
  let barangay_text = $("[name=barangay]").select2("data")[0].text;
  let municipality_text = $("[name=municipality]").select2("data")[0].text;
  let province_text = $("[name=province]").select2("data")[0].text;
  let region_text = $("[name=region]").select2("data")[0].text.split(" (")[0];
  let full_address_text = `${street_val}, ${barangay_text}, ${municipality_text}, ${province_text}, ${region_text}`;

  // Invalidate incomplete address
  if (
    region_val == "" ||
    province_val == "" ||
    municipality_val == "" ||
    barangay_val == "" ||
    street_val == ""
  ) {
    alert("Invalid Address");
  } else {
    // Save data to storage
    localStorage.setItem("region", region_val);
    localStorage.setItem("province", province_val);
    localStorage.setItem("municipality", municipality_val);
    localStorage.setItem("barangay", barangay_val);
    localStorage.setItem("street", street_val);
    localStorage.setItem("full_address", full_address_text);

    // Retrieve new data from storage
    // Alternatively, we can store new data in variables instead of retrieving from storage
    region = localStorage.getItem("region");
    province = localStorage.getItem("province");
    municipality = localStorage.getItem("municipality");
    barangay = localStorage.getItem("barangay");
    street = localStorage.getItem("street");
    full_address = localStorage.getItem("full_address");

    console.log({
      region,
      province,
      municipality,
      barangay,
      street,
      full_address,
    });

    // Set address dynamically
    setAddress();
  }
}

// Save details on click
$("#save").on("click", saveAddress);

// Clear on click
$("#clear").on("click", function () {
  // Remove from storage
  localStorage.removeItem("region");
  localStorage.removeItem("province");
  localStorage.removeItem("municipality");
  localStorage.removeItem("barangay");
  localStorage.removeItem("street");
  localStorage.removeItem("full_address");

  // Reset Variables
  region = "";
  province = "";
  municipality = "";
  barangay = "";
  street = "";
  full_address = "";

  // Reset Form
  $("#address").text("");
  setRegion();
  $("#region").val("");
  $("#province").val("").empty();
  $("#municipality").val("").empty();
  $("#barangay").val("").empty();
  $("#street").val("").empty();
});

readURL = (input) => {
  var url = input.value;
  var ext = url.substring(url.lastIndexOf(".") + 1).toLowerCase();
  if (
    input.files &&
    input.files[0] &&
    (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")
  ) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $("#photo_path_placeholder").attr("src", e.target.result);
    };

    reader.readAsDataURL(input.files[0]);
  } else {
    //$("#img").attr("src", "/assets/no_preview.png");
  }
};
