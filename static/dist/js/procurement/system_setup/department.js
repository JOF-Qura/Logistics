
// function to redirect to budget plan setup page
const manageBudget = (id, departmentName) => { 
  sessionStorage.setItem('departmentID', id);
  sessionStorage.setItem('department_name', departmentName);
  window.location.replace(baseURL + 'procurement/budget-plan-setup/'); 
};


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
        department_name: {
          required: true,
        },
        // compound rule
        contact_no: {
          required: true,
        },

        department_head: {
          required: true,
        },
 
      },
      messages: {
        department_name: {
          required: "please provide department name",
        },

        contact_no: {
          required: "please provide contact_no",
        },

        department_head: {
          required: "please provide department head",
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
        // var form_data = new FormData(document.getElementById("form_id"));
        // console.log(form_data);

        if ($("#uuid").val() == "") {
          // add record
 
          $.ajax({
            url: apiURL + "department/",
            type: "POST",
            // data: form_data,
            contentType: "application/json",
            data: JSON.stringify({
              // department_pic: $("#department_pic").val(),
              department_name: $("#department_name").val(),
              contact_no: $("#contact_no").val(),
              department_head: $("#department_head").val(),
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
                notification("success", "Created!", "Department Successfuly Created");
                console.log(data);
                console.log("success");
                $("#modal-xl").modal("hide");
                loadTable();
              } else {
                notification("error", "Error!", "Error creating department");
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
            url: apiURL + "department/" + $("#uuid").val(),
            type: "PUT",
            // data: form_data,
            contentType: "application/json",
            data: JSON.stringify({
              department_name: $("#department_name").val(),
              contact_no: $("#contact_no").val(),
              department_head: $("#department_head").val(),

            }),
            dataType: "json",
            // contentType: false,
            processData: false,
            cache: false,
            success: function (data) {
              if (data) {
                notification("success", "Updated!", "Department Successfuly Updated");
                console.log("success " + data);

                $("#modal-xl").modal("hide");
          
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
    ajax: { url: apiURL + "department", dataSrc: "" },

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
        data: "department_name",
        name: "department_name",
        searchable: true,
        width: "30%",
        // className: "dtr-control",
      },

      {
        data: "contact_no",
        name: "contact_no",
        searchable: true,
        width: "20%",
      },

      {
        data: "department_head",
        name: "department_head",
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

          // budget plan
          '<div class="dropdown-item d-flex role="button" data-toggle="modal" onClick="return manageBudget(\'' + aData.id + '\', \''
          + aData.department_name + '\')"  >'+
          '<div style="width: 2rem"> <i class= "fas fa-tasks mr-1"></i></div>'+
          '<div>Manage budget plan</div></div>'+
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
  $("#form_id input, select, textarea").prop("disabled", false);
  $("#form_id input, select, textarea").val("");
  $(".modal-title").html("Add department");

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
    url: apiURL + "department/" + id,
    type: "GET",
    dataType: "json",
    success: function (data) {
      if (data) {
        $("#uuid").val(data["id"]);
        $("#department_name").val(data["department_name"]);
        $("#contact_no").val(data["contact_no"]);
        $("#department_head").val(data["department_head"]);


        // setTimeout(() => {
        // 	$("#section_id").val(data.data["section_id"]).trigger("change");
        // }, 1500);

        // if data is for viewing only
        if (type == 0) {
          $("#form_id input, select, textarea").prop("disabled", true);
          $(".modal-title").html("View department");
          $(".submit").hide();
        } else {
          $("#form_id input, select, textarea").prop("disabled", false);
          // $("#form_id button").prop("disabled", false);
          $(".submit").show();
          $(".modal-title").html("Update department");
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
deleteData = (id) => {
  $("#del_uuid").val(id);
  $("#modal-default").modal("hide");
  $(".modal-title").html("Delete department");

  console.log(id);
  $('#changeStatus').click(()=>{
  $.ajax({
    url: apiURL + "department/" + id,
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
  $('#changeStatus').attr('data-dismiss','modal');

})
};
