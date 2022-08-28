

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
        name: {
          required: true,
        },
        // compound rule
        description: {
          required: true,
        },

       
      },
      messages: {
        name: {
          required: "please provide type",
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
        // var form_data = new FormData(this);
        var form_data = new FormData(document.getElementById("form_id"));
        console.log(form_data);

        if ($("#uuid").val() == "") {
          // add record
          $.ajax({
            url: apiURL + "user-type/",
            type: "POST",
            // data: form_data,
            contentType: "application/json",
            data: JSON.stringify({
              name: $("#name").val(),
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
                notification("success", "Created!", "User Type Successfuly Created");
                console.log(data);
                console.log("success");
                $("#modal-xl").modal("hide");
                loadTable();
              } else {
                notification("error", "Error!", "Error creating user type");
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
            url: apiURL + "user-type/" + $("#uuid").val(),
            type: "PUT",
            // data: form_data,
            contentType: "application/json",
            data: JSON.stringify({
              name: $("#name").val(),
              description: $("#description").val(),
            }),
            dataType: "json",
            // contentType: false,
            processData: false,
            cache: false,
            success: function (data) {
              if (data) {
                notification("success", "Updated!", "User Type Successfuly Updated");
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
    ajax: { url: apiURL + "user-type", dataSrc: "" },

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
        data: "name",
        name: "name",
        searchable: true,
        width: "30%",
        // className: "dtr-control",
      },

      {
        data: "description",
        name: "description",
        searchable: true,
        width: "20%",
      },
      {
        data: null,
        width: "20%",
        render: function (aData, type, row) {
          let buttons = "";
          buttons +=
          '<div class="text center dropdown"><div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">'+
          '<i class="fas fa-ellipsis-v"></i></div><div class="dropdown-menu dropdown-menu-right">'+
        //view
        '<div class="dropdown-item d-flex role="button" onClick="return editData(\'' +
        aData["id"] + '\',0)">'+
        '<div style="width: 2rem"> <i class= "fas fa-eye mr-1"></i></div>'+
        '<div> View</div></div>'+
        //edit
          '<div class="dropdown-item d-flex role="button" onClick="return editData(\'' +
          aData["id"] + '\',1)">'+
          '<div style="width: 2rem"> <i class= "fas fa-edit mr-1"></i></div>'+
          '<div> Edit</div></div>'+
          //delete
      
        '<div class="dropdown-item d-flex role="button" data-toggle="modal" data-target="#modal-status" onClick="return deleteData(\'' +
        aData["id"] + '\')"  >'+
        '<div style="width: 2rem"> <i class= "fas fa-trash mr-1"></i></div>'+
        '<div> Delete</div></div>'+
          '</div></div>';
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
  $(".is-invalid").removeClass("is-invalid")
  $(".is-valid").removeClass("is-valid")
  $(".modal-title").html("Add User Type");

  $(".submit").html("Submit" + '<i class="fas fa-check ml-1"></i>');
  $("#form_id input, select, textarea").prop("disabled", false);
  $("#form_id input, select, textarea").val("");
 
};

// view, edit data
editData = (id, type) => {
  $(".is-invalid").removeClass("is-invalid")
  $(".is-valid").removeClass("is-valid")
  $("#modal-xl").modal("show");

  $.ajax({
    url: apiURL + "user-type/" + id,
    type: "GET",
    dataType: "json",
    success: function (data) {
      if (data) {
        $("#uuid").val(data["id"]);
        $("#name").val(data["name"]);
        $("#description").val(data["description"]);

        // setTimeout(() => {
        // 	$("#section_id").val(data.data["section_id"]).trigger("change");
        // }, 1500);

        // if data is for viewing only
        if (type == 0) {
          $("#form_id input, select, textarea").prop("disabled", true);
          $(".modal-title").html("View User Type");
          $(".submit").hide();
        } else {
          $("#form_id input, select, textarea").prop("disabled", false);
          // $("#form_id button").prop("disabled", false);
          $(".submit").show();
          $(".modal-title").html("Update User Type");
        
          $(".submit").html("Update" + '<i class="fas fa-check ml-1"></i>');
        }
      } else {
        notification("error", "Error!", data.message);
      }
    },
    error: function (data) {},
  });
};

// function to delete data
deleteData = (id) => {
  $("#modal-default").modal("show");
  $(".modal-title").html("Delete User Type");
  $("#del_uuid").val(id);
};

deleteData2 = (id) => {
  id = $("#del_uuid").val();
  $("#modal-default").modal("hide");

  console.log(id);
  $.ajax({
    url: apiURL + "user-type/" + id,
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
};
