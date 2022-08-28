$(function () {

  
	// initialized select2
	$(".select2").select2();

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
        first_name: {
          required: true,
        },
        last_name: {
          required: true,
        },

        birthdate: {
          required: true,
        },
        address: {
          required: true,
        },

        contact_no: {
          required: true,
        },
        department_id: {
          required: true,
        },

        employee_type_id: {
          required: true,
        },

        email: {
          required: true,
        },
        password: {
          required: true,
        },
      },
      messages: {
        first_name: {
          required: "please provide first name",
        },

        last_name: {
          required: "please provide last_name",
        },

        birthdate: {
          required: "please provide birthdate",
        },
        contact_no: {
          required: "please provide contact_no",
        },
        address: {
          required: "please provide address",
        },
        email: {
          required: "please provide email",
          email: "please provide valid email"
        },
        password: {
          required: "please provide password",
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
          // add record
          $.ajax({
            url: apiURL + "employee/",
            type: "POST",
            // data: form_data,
            contentType: "application/json",
            data: JSON.stringify({
              first_name: $("#first_name").val(),
              middle_name: $("#middle_name").val(),
              last_name: $("#last_name").val(),
              birthdate: $("#birthdate").val(),
              contact_no: $("#contact_no").val(),
              // email: $("#email").val(),
              address: $("#address").val(),
              // password: $("#password").val(),
              employee_type_id: $("#employee_type_id").val(),
              department_id: $("#department_id").val(),
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
                notification("success", "Created!", "Employee Successfuly Created");
                console.log(data);
                console.log("success");
                $("#modal-xl").modal("hide");
                loadTable();
              } else {
                notification("error", "Error!", "Error creating employee");
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
            url: apiURL + "employee/" + $("#uuid").val(),
            type: "PUT",
            // data: form_data,
            contentType: "application/json",
            data: JSON.stringify({
              first_name: $("#first_name").val(),
              middle_name: $("#middle_name").val(),
              last_name: $("#last_name").val(),
              birthdate: $("#birthdate").val(),
              contact_no: $("#contact_no").val(),
              // email: $("#email").val(),
              address: $("#address").val(),
              // password: $("#password").val(),
              employee_type_id: $("#employee_type_id").val(),
              department_id: $("#department_id").val(),

            }),
            dataType: "json",
            // contentType: false,
            processData: false,
            cache: false,
            success: function (data) {
              if (data) {
                notification("success", "Updated!", "Employee Successfuly Updated");
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

// function to load department
loadDepartment = () => {
	$.ajax({
		url: apiURL + "department/",
		type: "GET",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
    },
		dataType: "json",
		success: function (responseData) {
			if (responseData) {
        
				$("#department_id").empty();
				$.each(responseData, function (i, dataOptions) {
          var options = "";
					options =
						"<option value='" +
						dataOptions.id +
						"'>" +
						dataOptions.department_name + 
						"</option>";

					$("#department_id").append(options);
				});

			} else {
				// notification("error", "Error!", responseData.message);
				console.log("error", "Error!", responseData.success);

			}
		},
		error: function ({ responseJSON }) {},
	});
};

loadDepartment();


// function to load Employee Type
loadEmployeeType = () => {
	$.ajax({
		url: apiURL + "employee-type/",
		type: "GET",
		dataType: "json",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
    },
		success: function (responseData) {
			if (responseData) {
        
				$("#employee_type_id").empty();
				$.each(responseData, function (i, dataOptions) {
          var options = "";
					options =
						"<option value='" +
						dataOptions.id +
						"'>" +
						dataOptions.name + 
						"</option>";

					$("#employee_type_id").append(options);
				});

			} else {
				// notification("error", "Error!", responseData.message);
				console.log("error", "Error!", responseData.success);

			}
		},
		error: function ({ responseJSON }) {},
	});
};

loadEmployeeType()

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
    ajax: { url: apiURL + "employee", dataSrc: "" },
    
    responsive: true,
    serverSide: false,
    dataType: "json",
    type: "GET",
    columns: [
 
      {
        data: null,
        name: null,
        searchable: true,
        width: "20%",
        render: function (aData, type, row) {
        return aData.first_name +" "+aData.last_name
        }
        // className: "dtr-control",
      },
      {
        data: "department.department_name",
        name: "department.department_name",
        searchable: true,
        width: "10%",
        // className: "dtr-control",
      },
      {
        data: "employee_types.name",
        name: "employee_types.name",
        searchable: true,
        width: "10%",
        // className: "dtr-control",
      },
      {
        data: "contact_no",
        name: "contact_no",
        searchable: true,
        width: "20%",
      },
      // {
      //   data: "email",
      //   name: "email",
      //   searchable: true,
      //   width: "20%",
      // },
      {
        data: null,
        width: "10%",
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


// show modal add
addData = () =>{
  $("#modal-xl").modal("show");
  $(".submit").show();
  $(".hide-password").show();
  $(".is-invalid").removeClass("is-invalid")
  $(".is-valid").removeClass("is-valid")

  $(".submit").html("Submit" + '<i class="fas fa-check ml-1"></i>');
  $("#form_id input, select, textarea").prop("disabled", false);
  $("#form_id input, select, textarea").val("")
  $(".modal-title").html("Add Employee");

}

// function to show details for viewing/updating
editData = (id, type) => {
  $("#modal-xl").modal("show");
  $(".is-invalid").removeClass("is-invalid")
  $(".is-valid").removeClass("is-valid")
  $.ajax({
    url: apiURL + "employee/" + id,
    type: "GET",
    dataType: "json",
    success: function (data) {
      if (data) {
        $("#uuid").val(data["id"]);
        $("#first_name").val(data["first_name"]);
        $("#middle_name").val(data["middle_name"]);
        $("#last_name").val(data["last_name"]);
        $("#birthdate").val(data["birthdate"]);

        $("#contact_no").val(data["contact_no"]);
        $("#address").val(data["address"]);

      
        $("#address").val(data["address"]);
				$("#department_id").val(data.department["id"]).trigger("change");
				$("#employee_type_id").val(data.employee_types["id"]).trigger("change");



        // setTimeout(() => {
        // 	$("#section_id").val(data.data["section_id"]).trigger("change");
        // }, 1500);

        // if data is for viewing only
        if (type == 0) {
          $("#form_id input, select, textarea").prop("disabled", true);
          $(".modal-title").html("View Employee");
          $(".submit").hide();
          $(".hide-password").hide();

        }
        else{
          $("#form_id input, select, textarea").prop("disabled", false);
          // $("#form_id button").prop("disabled", false);
          $(".submit").show();
          $(".modal-title").html("Update Employee");
          $(".submit").html('Update' + '<i class="fas fa-check ml-1"></i>');
          $(".hide-password").hide();

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
  $(".modal-title").html("Delete Employee");
  $("#del_uuid").val(id);
};

deleteData2 = (id) => {
  id = $("#del_uuid").val();
  $("#modal-default").modal("hide");

  console.log(id);
  $.ajax({
    url: apiURL + "employee/" + id,
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

