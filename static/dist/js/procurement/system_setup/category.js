
$(function () {
  // load datatable
  loadTable();

  // submit form
  $("#form_id")
    .on("submit", function (e) {
      e.preventDefault();
      // trimInputFields();
    })
    .validate({
      rules: {
        // simple rule, converted to {required:true}
        category_name: {
          required: true,
        },
        // compound rule
        description: {
          required: true,
        },

      },
      messages: {
        category_name: {
          required: "please provide category name",
        },

        description: {
          required: "please provide description",
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
        if ($("#uuid").val() == "") {
          //   console.log();
          // add record
          $.ajax({
            url: apiURL + "category/",
            type: "POST",
            // data: form_data,
            contentType: "application/json",
            data: JSON.stringify({
              category_name: $("#category_name").val(),
              description: $("#description").val(),
            }),
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
                notification("success", "Created!", "Item Category Successfuly Created");
                console.log(data);
                console.log("success");
                $("#modal-xl").modal("hide");
                loadTable();
              } else {
                notification("error", "Error!", "Error creating category");
                console.log("error");
              }
            },
            error: function ({ responseJSON }) {
              console.log(responseJSON);
            },
          });
        } else {
          // update record
          $.ajax({
            url: apiURL + "category/" + $("#uuid").val(),
            type: "PUT",
            // data: form_data,
            contentType: "application/json",
            data: JSON.stringify({
              category_name: $("#category_name").val(),
              description: $("#description").val(),
            }),
            dataType: "json",
            // contentType: false,
            processData: false,
            cache: false,
            success: function (data) {
              if (data) {
                notification("success", "Updated!", "Category Successfuly Updated");
                console.log("success " + data);

                $("#modal-xl").modal("hide");
                // formReset("hide");
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

// datatable

loadTable = () => {
  $.ajaxSetup({
    headers: {
      Accept: "application/json",
			Authorization: "Bearer " + localStorage.getItem('TOKEN'),
			ContentType: "application/x-www-form-urlencoded",
    },
  });
  $("#data-table").dataTable().fnClearTable();
  $("#data-table").dataTable().fnDraw();
  $("#data-table").dataTable().fnDestroy();
  $("#data-table").DataTable({
    ajax: { url: apiURL + "category", dataSrc: "" },

    responsive: true,
    serverSide: false,
    dataType: "json",
    type: "GET",
    columns: [
      // {
      //   data: "id",
      //   name: "id",
      //   searchable: true,
      //   width: "20%",
      //   // className: "dtr-control",
      // },
      {
        data: "category_name",
        name: "category_name",
        searchable: true,
        width: "10%",
        // className: "dtr-control",
      },

      {
        data: "description",
        name: "description",
        searchable: true,
        width: "40%",
      },

      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        class: "text-center",
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
        width: "5%",
        render: function (aData, type, row) {
          let buttons = "";
          buttons +=
            '<div class="text center dropdown"><div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
            '<i class="fas fa-ellipsis-v"></i></div><div class="dropdown-menu dropdown-menu-right">'
            //view
            buttons +=  '<div class="dropdown-item d-flex role="button" onClick="return editData(\'' +
            aData["id"] +
            "',0)\">" +
            '<div style="width: 2rem"> <i class= "fas fa-eye mr-1"></i></div>' +
            "<div> View</div></div>";
            //edit
            buttons +=  '<div class="dropdown-item d-flex role="button" onClick="return editData(\'' +
            aData["id"] +
            "',1)\">" +
            '<div style="width: 2rem"> <i class= "fas fa-edit mr-1"></i></div>' +
            "<div> Edit</div></div>";
            if(aData.status == "active" || aData.status == "Active"){

            //deactivate
            buttons +=   '<div class="dropdown-item d-flex role="button" data-toggle="modal" data-target="#modal-status" onClick="return deleteData(\'' +
            aData["id"] +
            "',0)\"  >" +
            '<div style="width: 2rem"> <i class= "fas fa-trash mr-1"></i></div>' +
            "<div> Delete</div></div>";
             } else if(aData.status == "Inactive"){
            // activate
            buttons +=   '<div class="dropdown-item d-flex role="button" data-toggle="modal" data-target="#modal-status" onClick="return deleteData(\'' +
            aData["id"] +
            "',1)\"  >" +
            '<div style="width: 2rem"> <i class= "fas fa-redo mr-1"></i></div>' +
            "<div> Activate</div></div>";
           }
            buttons +=  "</div></div>";

            
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
  $(".modal-title").html("Add Category");
  $(".is-invalid").removeClass("is-invalid")
  $(".is-valid").removeClass("is-valid")


  $(".submit").html("Submit" + '<i class="fas fa-check ml-1"></i>');
};

// function to show details for viewing/updating
editData = (id, type) => {
  $(".is-invalid").removeClass("is-invalid")
  $(".is-valid").removeClass("is-valid")
 

  $("#modal-xl").modal("show");

  $.ajax({
    url: apiURL + "category/" + id,
    type: "GET",
    dataType: "json",
    success: function (data) {
      if (data) {
        $("#uuid").val(data["id"]);
        $("#category_name").val(data["category_name"]);
        $("#description").val(data["description"]);

        // setTimeout(() => {
        // 	$("#section_id").val(data.data["section_id"]).trigger("change");
        // }, 1500);

        // if data is for viewing only
        if (type == 0) {
          $("#form_id input, select, textarea").prop("disabled", true);
          $(".modal-title").html("View Category");
          $(".submit").hide();
        } else {
          $("#form_id input, select, textarea").prop("disabled", false);
          // $("#form_id button").prop("disabled", false);
          $(".submit").show();
          $(".modal-title").html("Update Category");
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
deleteData = (id,type) => {
  let product_status='';
  $("#del_uuid").val(id);
  if(type == 0){
    product_status = "Inactive"
    $(".delete-modal-title").html("Deactivate category");

    $(".product-modal-body").html("Are you sure you want to Deativate this category?");
    $("#changeStatus").attr('class', 'btn btn-danger');
    $("#changeStatus").html("Yes, Deactivate it")
  }
  else{
    $(".product-modal-body").html("Are you sure you want to Activate this category?");
    $("#changeStatus").attr('class', 'btn btn-primary');

    $(".delete-modal-title").html("Activate category");
    $("#changeStatus").html("Yes, Activate it")

    product_status = "Active"

  }

  console.log(id);
  changeStatus = () => {
    $.ajax({
      url: apiURL + "category/" + $("#del_uuid").val(),
      type: "DELETE",
      dataType: "json",
      contentType: "application/json",

      data: JSON.stringify({
        
        status: product_status,
      }),
      success: function (data) {
        if(type == 0){

          notification("info", "Success!", "Category Deactivated");
        }else{
          notification("success", "Success!", "Category Activated");
          
        }
        loadTable();
    
      },
      error: function ({ responseJSON }) {},
    });
    $("#changeStatus").attr("data-dismiss", "modal");
  };
};
