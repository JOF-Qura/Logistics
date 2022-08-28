$(function () {
  // initialized select2
  $(".select2").select2();

  // load datatable
  loadTable();

  $("#description").summernote({
    height: 150,
    minHeight: null, // set minimum height of editor
    maxHeight: null, // set maximum height of editor
    focus: true,

    toolbar: [
      ["style", ["style"]],
      [
        "font",
        [
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "superscript",
          "subscript",
          "clear",
        ],
      ],
      ["fontname", ["fontname"]],
      ["fontsize", ["fontsize"]],
      ["color", ["color"]],
      ["para", ["ol", "ul", "paragraph", "height"]],
      ["table", ["table"]],
      ["insert", ["link"]],
      ["view", ["undo", "redo", "fullscreen", "codeview", "help"]],
    ],
  });

  // submit form
  $("#form_id")
    .on("submit", function (e) {
      e.preventDefault();
      // trimInputFields();
    })
    .validate({
      ignore: ".summernote *",

      rules: {
        // product_pic: {
        //   required: true,
        // },
        // compound rule
        product_name: {
          required: true,
        },

        // category_id: {
        //   required: true,
        // },

        estimated_price: {
          required: true,
        },
      },
      messages: {
        // product_pic: {
        //   required: "please provide a picture",
        // },

        product_name: {
          required: "please provide product price",
        },
        estimated_price: {
          required: "please provide product price",
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

        if ($("#uuid").val() == "") {
          // add record

          $.ajax({
            url: apiURL + "product/",
            type: "POST",
            // data: form_data,
            // contentType: false,
            data: form_data,
            dataType: "json",
            contentType: false,
            processData: false,
            cache: false,
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + localStorage.getItem("TOKEN"),
            },
            success: function (data) {
              if (data) {
                notification(
                  "success",
                  "Created!",
                  "Product Successfuly Created"
                );
                console.log(data);
                console.log("success");
                $("#modal-xl").modal("hide");
                loadTable();
              } else {
                notification("error", "Error!", "Error creating product");
                console.log("error");
              }
            },
            error: function ({ responseJSON }) {
              // console.log(responseJSON.product_name)
              console.log(responseJSON);
            },
          });
        } else {
          // form_data.append("_method", "PUT");
          // update record
          $.ajax({
            url: apiURL + "product/" + $("#uuid").val(),
            type: "PUT",
            // data: form_data,
            contentType: "application/json",
            //form_data,
            data: JSON.stringify({
              // product_pic: $("#product_pic").val(),
              product_name: $("#product_name").val(),
              category_id: $("#category_id").val(),
              description: $("#description").val(),
              estimated_price: $("#estimated_price").val(),
            }),
            dataType: "json",
            // contentType: false,
            processData: false,
            cache: false,
            success: function (data) {
              if (data) {
                notification(
                  "success",
                  "Updated!",
                  "Product Successfuly Updated"
                );
                console.log("success " + data);

                $("#modal-xl").modal("hide");
                // formReset("hide");
                loadTable();
                // $("#photo_path_placeholder").attr(
                //   "src",
                //   "https://avatars.dicebear.com/api/bottts/smile.svg"
                // );
              } else {
                console.log("error " + data.message);
              }
            },
            error: function ({ responseJSON }) {},
          });
        }
      },
    });
});

// function to load Item Category
loadItemCategory = () => {
  $.ajax({
    url: apiURL + "category/",
    type: "GET",
    dataType: "json",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
    },
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

loadItemCategory();

// datatable

loadTable = () => {
  $.ajaxSetup({
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
  });
  $("#data-table").dataTable().fnClearTable();
  $("#data-table").dataTable().fnDraw();
  $("#data-table").dataTable().fnDestroy();
  $("#data-table").DataTable({
    ajax: { url: apiURL + "product/", dataSrc: "" },
    responsive: true,
    serverSide: false,
    dataType: "json",
    type: "GET",
    columns: [
      // {
      //   data: null,
      //   width: "auto",
      //   class: "text-center",
      //   render: function (aData, type, row) {
      //     // product image
      //     let image =
      //       aData.product_pic != null
      //         ? '<img src="' +
      //           apiURL +
      //           "product/product-pic/" +
      //           aData.product_pic +
      //           '" alt="Item image" class="img-50" style="width: 150px; height: 150px;" />'
      //         : "";

      //     return image;
      //   },
      // },
      {
        data: "product_name",
        name: "product_name",
        searchable: true,
        width: "10%",
        // class: "text-center",

        // className: "dtr-control",
      },

      {
        data: "category.category_name",
        name: "category.category_name",
        searchable: true,
        width: "10%",
        // class: "text-center",
      },

      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        // class: "text-center",
        render: function (aData, type, row) {
          return "\u20B1" + numberWithCommas(aData["estimated_price"]);
        },
      },
      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        // class: "text-center",
        render: function (aData, type, row) {
          return moment(aData["created_at"]).format("MMMM D, YYYY");
        },
      },
      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        // class: "text-center",
        render: function (aData, type, row) {
          if (aData.status === "Active" || aData.status === "active") {
            let status =
              '<label class="text-left badge badge-primary p-2 w-100"> ' +
              aData.status +
              "</label> ";
            return status;
          } else {
            let status =
              '<label class="text-left badge badge-danger p-2 w-100"> ' +
              aData.status +
              "</label> ";
            return status;
          }
        },
      },
      {
        data: null,
        width: "10%",
        class: "text-center",

        render: function (aData, type, row) {
          let buttons = "";
          buttons +=
            '<div class="text center dropdown"><div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
            '<i class="fas fa-ellipsis-v"></i></div><div class="dropdown-menu dropdown-menu-right">';
          //view
          buttons +=
            '<div class="dropdown-item d-flex role="button" onClick="return editData(\'' +
            aData["id"] +
            "',0)\">" +
            '<div style="width: 2rem"> <i class= "fas fa-eye mr-1"></i></div>' +
            "<div> View</div></div>";
          //edit
          buttons +=
            '<div class="dropdown-item d-flex role="button" onClick="return editData(\'' +
            aData["id"] +
            "',1)\">" +
            '<div style="width: 2rem"> <i class= "fas fa-edit mr-1"></i></div>' +
            "<div> Edit</div></div>";
          if (aData.status == "active" || aData.status == "Active") {
            //deactivate
            buttons +=
              '<div class="dropdown-item d-flex role="button" data-toggle="modal" data-target="#modal-status" onClick="return deleteData(\'' +
              aData["id"] +
              "',0)\"  >" +
              '<div style="width: 2rem"> <i class= "fas fa-trash mr-1"></i></div>' +
              "<div> Delete</div></div>";
          } else if (aData.status == "Inactive") {
            // activate
            buttons +=
              '<div class="dropdown-item d-flex role="button" data-toggle="modal" data-target="#modal-status" onClick="return deleteData(\'' +
              aData["id"] +
              "',1)\"  >" +
              '<div style="width: 2rem"> <i class= "fas fa-redo mr-1"></i></div>' +
              "<div> Activate</div></div>";
          }
          buttons += "</div></div>";

          return buttons; // same class in i element removed it from a element
        },
      },
    ],
  });
};

// show modal of create
addData = () => {
  $("#modal-xl").modal("show");
  $(".submit").show();
  $("#form_id input, select, textarea").prop("disabled", false);
  $("#form_id input, select, textarea").val("");
  $(".modal-title").html("Add Product");
  $(".is-invalid").removeClass("is-invalid");
  $(".is-valid").removeClass("is-valid");
  $("#description").summernote("code", "");

  $("#description").summernote("enable");

  $(".submit").html("Submit" + '<i class="fas fa-check ml-1"></i>');
};

// function to show details for viewing/updating
editData = (id, type) => {
  console.log(id);
  $("#modal-xl").modal("show");
  $(".is-invalid").removeClass("is-invalid");
  $(".is-valid").removeClass("is-valid");

  $.ajax({
    url: apiURL + "product/" + id,
    type: "GET",
    dataType: "json",
    success: function (data) {
      if (data) {
        $("#uuid").val(data["id"]);
        // $("#product_pic").val(data["product_pic"]);
        $("#product_name").val(data["product_name"]);
        $("#category_id").val(data.category["id"]).trigger("change");
        $("#estimated_price").val(data["estimated_price"]);
        $("#description").summernote("code", data["description"]);

        // setTimeout(() => {
        // 	$("#section_id").val(data.data["section_id"]).trigger("change");
        // }, 1500);

        // if data is for viewing only
        if (type == 0) {
          $("#description").summernote("disable");
          $("#form_id input, select, textarea").prop("disabled", true);
          $(".modal-title").html("View Product");
          $(".submit").hide();
        } else {
          $("#description").summernote("enable");

          $("#form_id input, select, textarea").prop("disabled", false);
          // $("#form_id button").prop("disabled", false);
          $(".submit").show();
          $(".modal-title").html("Update Product");

          $(".submit").html("Update" + '<i class="fas fa-check ml-1"></i>');
        }
      } else {
        notification("error", "Error!", data.message);
      }
    },
    error: function (data) {},
  });
};


// delete data
deleteData = (id, type) => {
  let product_status = "";
  $("#del_uuid").val(id);
  if (type == 0) {
    product_status = "Inactive";
    $(".delete-modal-title").html("Deactivate product");

    $(".product-modal-body").html(
      "Are you sure you want to Deativate this product?"
    );
    $("#changeStatus").attr("class", "btn btn-danger");
    $("#changeStatus").html("Yes, Deactivate it");
  } else {
    $(".product-modal-body").html(
      "Are you sure you want to Activate this product?"
    );
    $("#changeStatus").attr("class", "btn btn-primary");

    $(".delete-modal-title").html("Activate product");
    $("#changeStatus").html("Yes, Activate it");

    product_status = "Active";
  }

  changeStatus = () => {
    console.log(apiURL + "product/" + $("#del_uuid").val());
    $.ajax({
      url: apiURL + "product/" + $("#del_uuid").val(),
      type: "DELETE",
      dataType: "json",
      contentType: "application/json",

      data: JSON.stringify({
        status: product_status,
      }),
      success: function (data) {
        if (type == 0) {
          notification("info", "Success!", "Product Deactivated");
        } else {
          notification("success", "Success!", "Product Activated");
        }
        loadTable();
      },
      error: function ({ responseJSON }) {},
    });
    $("#changeStatus").attr("data-dismiss", "modal");
  };
};
