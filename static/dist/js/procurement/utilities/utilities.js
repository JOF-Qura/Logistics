$(function () {
  // load datatable
  loadTable();

  formReset("hide");
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
        vendor_id: {
          required: true,
        },
        // compound rule
        utility_type: {
          required: true,
        },

        utility_amount: {
          required: true,
        },
        due_date: {
          required: true,
        },
        attachment: {
          required: true,
        },
      },
      messages: {
        vendor_id: {
          required: "please select a vendor",
        },

        utility_type: {
          required: "please provide utility type",
        },

        utility_amount: {
          required: "please provide utility amount",
        },
        due_date: {
          required: "please provide due date",
        },
        attachment: {
          required: "please provide attachment",
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

        for (var value of form_data.values()) {
          console.log(value);
        }

        if ($("#uuid").val() == "") {
          // add record
          // form_data.append("password", "P@ssw0rd");
          // form_data.append("c_password", "P@ssw0rd");

          //   console.log();
          $.ajax({
            url: apiURL + "utilities/",
            type: "POST",
            data: form_data,
            contentType: false,
            dataType: "json",
            // contentType: false,
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
                  "Utility Successfuly Created"
                );
                console.log(data);
                console.log("success");
                formReset("hide");
                loadTable();
              } else {
                notification("error", "Error!", "Error creating utility");
                console.log("error");
              }
            },
            error: function ({ responseJSON }) {
              console.log(responseJSON);
            },
          });
        } else {
          // form_data.append("_method", "PUT");

          $.ajax({
            url: apiURL + "utilities/" + $("#uuid").val(),
            type: "PUT",
            data: form_data,
            contentType: false,
            dataType: "json",
            // contentType: false,
            processData: false,
            cache: false,
            success: function (data) {
              if (data) {
                notification(
                  "success",
                  "Updated!",
                  "Utility Successfuly Updated"
                );
                console.log("success " + data);
                formReset("hide");

                loadTable();
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

// function to load vendor
loadVendor = () => {
  $.ajax({
    url: apiURL + "vendor/",
    type: "GET",
    dataType: "json",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
    },
    success: function (responseData) {
      if (responseData) {
        $("#vendor_id").empty();
        $.each(responseData, function (i, dataOptions) {
          var options = "";
          options =
            "<option value='" +
            dataOptions.id +
            "'>" +
            dataOptions.vendor_name +
            "</option>";

          $("#vendor_id").append(options);
        });
      } else {
        // notification("error", "Error!", responseData.message);
        console.log("error", "Error!", responseData.success);
      }
    },
    error: function ({ responseJSON }) {},
  });
};

loadVendor();

//   upload attachment
$("#buttonid").on("click", function () {
  document.getElementById("attachment").click();
});

// pass this to onupload function on change
$("#attachment").on("change", function () {
  onUpload(this);
});

// function to display uploaded attachment
function onUpload(input) {
  let originalFile = input.files[0];
  let reader = new FileReader();
  reader.readAsDataURL(originalFile);
  reader.onload = () => {
    let json = JSON.stringify({ dataURL: reader.result });
    // View the file
    let fileURL = JSON.parse(json).dataURL;
    let related_files_body = "";

    related_files_body +=
      '<div class="d-flex justify-content-between">' +
      "<li>" +
      '<a href="#modal-file" data-toggle="modal" onClick="return showFileModal(this,0)" data-id="' +
      fileURL +
      '" class="btn-link text-dark"><i class="far fa-fw fa-file-word"></i> ' +
      originalFile.name +
      "</a>" +
      "</li>" +
      '<p style="cursor:pointer;" onclick="removeFile(this.parentNode.parentNode,this.parentNode)"><i class="text-secondary fas fa-times"></i></p>' +
      "</div>";
    $("#related_files_body").append(related_files_body);

    $("#buttonid").hide();
  };
}

// show uploaded file in modal
showFileModal = (file, type, existed_file) => {
  $("#display_file").attr("src", "");
  if (type == 0) {
    let file_data = $(file).attr("data-id");
    $("#display_file").attr("src", file_data);
  } else {
    $("#display_file").attr(
      "src",
      apiURL + "utilities/related-file/" + existed_file
    );
  }
};

// remove uploaded file
removeFile = (parent_node, child_node) => {
  child_node.remove();
  utility_file = "";
  $("#attachment").val("");
  $("#buttonid").show();
};

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
    ajax: { url: apiURL + "utilities", dataSrc: "" },

    responsive: true,
    serverSide: false,
    dataType: "json",
    type: "GET",
    columns: [
      {
        data: "vendor.vendor_name",
        name: "vendor.vendor_name",
        searchable: true,
        width: "20%",
        // className: "dtr-control",
      },
      {
        data: "utility_type",
        name: "utility_type",
        searchable: true,
        width: "15%",

        // className: "dtr-control",
      },

      {
        data: null,
        name: null,
        searchable: true,
        width: "15%",
        render: function (aData, type, row) {
          return "\u20B1" + numberWithCommas(aData.utility_amount);
        },
      },

      {
        data: null,
        name: null,
        searchable: true,
        width: "15%",
        render: function (aData, type, row) {
          return moment(aData.due_date).format("MMMM D, YYYY");
        },
      },

      {
        data: null,
        name: null,
        searchable: true,
        width: "20%",
        render: function (aData, type, row) {
          return aData.attachment;
        },
      },

      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {
          let status = "";
          if (aData.status === "Paid" || aData.status == "paid") {
            '<label class="text-left badge badge-primary p-2 w-auto"> ' +
              aData.status +
              "</label> ";
          } else if (aData.status == "Pending" || aData.status == "pending") {
            status =
              '<label class="text-left badge badge-warning p-2 w-auto"> ' +
              aData.status +
              "</label> ";
          } else {
            status =
              '<label class="text-left badge badge-danger p-2 w-auto"> ' +
              aData.status +
              "</label> ";
          }
          return status;
        },
      },
      {
        data: null,
        width: "10%",
        render: function (aData, type, row) {
          let buttons = "";
          buttons +=
            '<div class="text center dropdown"><div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
            '<i class="fas fa-ellipsis-v"></i></div><div class="dropdown-menu dropdown-menu-right">' +
            //view
            '<div class="dropdown-item d-flex role="button" onClick="return editData(\'' +
            aData["id"] +
            "',0)\">" +
            '<div style="width: 2rem"> <i class= "fas fa-eye mr-1"></i></div>' +
            "<div> View</div></div>" +
            //edit
            '<div class="dropdown-item d-flex role="button" onClick="return editData(\'' +
            aData["id"] +
            "',1)\">" +
            '<div style="width: 2rem"> <i class= "fas fa-edit mr-1"></i></div>' +
            "<div> Edit</div></div>" +
            //delete
            '<div class="dropdown-item d-flex role="button" data-toggle="modal" data-target="#modal-status" onClick="return deleteData(\'' +
            aData["id"] +
            "')\"  >" +
            '<div style="width: 2rem"> <i class= "fas fa-trash mr-1"></i></div>' +
            "<div> Delete</div></div>" +
            "</div></div>";
          return buttons; // same class in i element removed it from a element
        },
      },
    ],
  });
};

// view, update utilities
editData = (id, type) => {
  $(".is-invalid").removeClass("is-invalid");
  $(".is-valid").removeClass("is-valid");

  formReset("show");

  $.ajax({
    url: apiURL + "utilities/" + id,
    type: "GET",
    dataType: "json",
    success: function (data) {
      if (data) {
        $("#uuid").val(data["id"]);

        $("#utility_type").val(data["utility_type"]);
        $("#utility_amount").val(data["utility_amount"]);
        $("#due_date").val(data["due_date"]);
        $("#notes").val(data["notes"]);
        $("#vendor_id").val(data.vendor["id"]).trigger("change");
        $("#vendor_id").val(data.vendor["id"]).trigger("change");

        $("#related_files_body").empty();
        if (data["attachment"] != "") {
          $("#buttonid").hide();

          let related_files_body = "";
          related_files_body +=
            '<div class="d-flex justify-content-between">' +
            "<li>" +
            '<a href="#modal-file" data-toggle="modal" onClick="return showFileModal(this,1,\'' +
            data.attachment +
            '\')" data-id="' +
            data.attachment +
            '" class="btn-link text-dark"><i class="far fa-fw fa-file-word"></i> ' +
            data.attachment +
            "</a>" +
            '</li><p style="cursor:pointer;" onclick="removeFile(this.parentNode.parentNode,this.parentNode)"><i class="text-secondary fas fa-times"></i></p></div>';
          $("#related_files_body").append(related_files_body);
        } else {
          $("#buttonid").show();
        }

        // setTimeout(() => {
        // 	$("#section_id").val(data.data["section_id"]).trigger("change");
        // }, 1500);

        // if data is for viewing only
        if (type == 0) {
          $("#form_id input, select, textarea").prop("disabled", true);
          $(".modal-title").html("View utility");
          $(".submit").hide();
        } else {
          $("#form_id input, select, textarea").prop("disabled", false);
          // $("#form_id button").prop("disabled", false);
          $(".submit").show();
          $(".modal-title").html("Update utility");
          $(".submit").html("Update" + '<i class="fas fa-check ml-1"></i>');
        }
      } else {
        notification("error", "Error!", data.message);
      }
    },
    error: function (data) {},
  });
};

// delete utility
deleteData = (id) => {
  $("#del_uuid").val(id);
  $("#modal-default").modal("hide");
  $(".modal-title").html("Delete utility");

  console.log(id);
  $("#changeStatus").click(() => {
    $.ajax({
      url: apiURL + "utilities/" + id,
      type: "DELETE",
      dataType: "json",
      success: function (data) {
        if (data) {
          // notification("success", "Success!", data.message);
          console.log("success" + data);
          loadTable();
        } else {
          notification("info", "Deleted!", "Record Deleted");

          console.log("error" + data);
          loadTable();
        }
      },
      error: function ({ responseJSON }) {},
    });
    $("#changeStatus").attr("data-dismiss", "modal");
  });
};

// 		action = show, hide
formReset = (action = "hide") => {
  $("html, body").animate({ scrollTop: 0 }, "slow");

  if (action == "hide") {
    $(".is-invalid").removeClass("is-invalid");
    $(".is-valid").removeClass("is-valid");
    $(".invalid-feedback").hide();
    // hide and clear form
    $("#uuid").val("");
    $("#div_form").hide();
    $(".create_button").show();
    $("#form_id input, select, textarea").prop("disabled", false);
  } else {
    // show
    $("#div_form").show();
    $(".create_button").hide();

    $("#form_id input, select, textarea").prop("disabled", false);
    $("#form_id button").prop("disabled", false);
  }
};
