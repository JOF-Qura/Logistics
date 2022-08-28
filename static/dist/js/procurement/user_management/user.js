

$(function () {

  // change displayed input on change of user type id
  $('#user_type_id').on("change", function(){
    console.log($('#user_type_id option:selected').text())
    if($('#user_type_id option:selected').text() == "insider"){
      $('#employee_row').show()
      $('#vendor_row').hide()
    }
    else{
      $('#vendor_row').show()
      $('#employee_row').hide()
   

    }
  })
  
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
        
      

        user_type_id: {
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
            url: apiURL + "user/",
            type: "POST",
            // data: form_data,
            contentType: "application/json",
            data: JSON.stringify({
              employee_id: $("#employee_id").val(),
              vendor_id: $("#vendor_id").val(),

              user_type_id: $("#user_type_id").val(),

              email: $("#email").val(),
              password: $("#password").val(),
         
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
                notification("success", "Created!", "User Successfuly Created");
                console.log(data);
                console.log("success");
                $("#modal-xl").modal("hide");
                loadTable();
              } else {
                notification("error", "Error!", "Error creating user");
                console.log("error");
              }
            },
            error: function ({ responseJSON }) {
              console.log(responseJSON.detail);
              notification("error", "Error!", responseJSON.detail);

            },
          });
        } else {
          // update record
          $.ajax({
            url: apiURL + "user/" + $("#uuid").val(),
            type: "PUT",
            // data: form_data,
            contentType: "application/json",
            data: JSON.stringify({
              employee_id: $("#employee_id").val(),
              user_type_id: $("#user_type_id").val(),
              email: $("#email").val(),
              password: $("#password").val(),
              vendor_id: $("#vendor_id").val(),

            }),
            dataType: "json",
            // contentType: false,
            processData: false,
            cache: false,
            success: function (data) {
              if (data) {
                notification("success", "Updated!", "User Successfuly Updated");
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


    $('#btnrandom').on("click", function() {
      let rand = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    
      String.prototype.shuffle = function () {
        let a = this.split(""),
            n = a.length;
    
        for(let i = n - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let tmp = a[i];
            a[i] = a[j];
            a[j] = tmp;
        }
        return a.join("");
      }
      $('#password').val(rand.shuffle().substr(0, 8))
      console.log(rand.shuffle().substr(0, 8))
    })
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


// function to load Employee
loadEmployee = () => {
	$.ajax({
		url: apiURL + "employee/",
		type: "GET",
		dataType: "json",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
		success: function (responseData) {
			if (responseData) {
        
				$("#employee_id").empty();
				$("#employee_id").append("<option val=''>Select Employee</option>");

				$.each(responseData, function (i, dataOptions) {
          var options = "";
					options =
						"<option value='" +
						dataOptions.id +
						"'>" +
						dataOptions.first_name +" "+ dataOptions.last_name 
						"</option>";

					$("#employee_id").append(options);
				});

			} else {
				// notification("error", "Error!", responseData.message);
				console.log("error", "Error!", responseData.success);

			}
		},
		error: function ({ responseJSON }) {},
	});
};

loadEmployee()

// function to load Vendor
loadVendor = () => {
	$.ajax({
		url: apiURL + "vendor/",
		type: "GET",
		dataType: "json",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
		success: function (responseData) {
			if (responseData) {
        
				$("#vendor_id").empty();
				$("#vendor_id").append("<option val=''>Select Vendor</option>");

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

loadVendor()


// function to load User Type
loadUserType = () => {
	$.ajax({
		url: apiURL + "user-type/",
		type: "GET",
		dataType: "json",
		success: function (responseData) {
			if (responseData) {
        
				$("#user_type_id").empty();
				$("#user_type_id").append("<option val=''>Select User Type</option>");

				$.each(responseData, function (i, dataOptions) {
          var options = "";
					options =
						"<option value='" +
						dataOptions.id +
						"'>" +
						dataOptions.name + 
						"</option>";

					$("#user_type_id").append(options);
				});

			} else {
				// notification("error", "Error!", responseData.message);
				console.log("error", "Error!", responseData.success);

			}
		},
		error: function ({ responseJSON }) {},
	});
};

loadUserType()

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
    ajax: { url: apiURL + "user", dataSrc: "" },
    
    responsive: true,
    serverSide: false,
    dataType: "json",
    type: "GET",
    columns: [
      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {
          if(aData.employees){
            return "Employee"
          }
          else{
            return "Vendor"

          }
        }
      },
      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {
          if(aData.employees){
            return aData.employees.first_name+" "+aData.employees.last_name
          }
          else{
            return aData.vendor.vendor_name

          }
        }
      },
      {
        data: "email",
        name: "email",
        searchable: true,
        width: "20%",
      },

 


      {
        data: "user_types.name",
        name: "user_types.name",
        searchable: true,
        width: "10%",
        // className: "dtr-control",
      },
      

 
      {
        data: null,
        width: "5%",
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
addData = () =>{
  $("#modal-xl").modal("show");
  $(".submit").show();
  $(".hide-password").show();
  $(".is-invalid").removeClass("is-invalid")
  $(".is-valid").removeClass("is-valid")
  $("#form_id")[0].reset();
  $('#employee_row').hide()
  $('#vendor_row').hide()
  $('#pass_text').text("Password")

  $(".submit").html("Submit" + '<i class="fas fa-check ml-1"></i>');
  $("#form_id input, select, textarea").prop("disabled", false);
  $("#form_id input, select, textarea").val("")
  $(".modal-title").html("Add User");

}

// function to show details for viewing/updating
editData = (id, type) => {
  $("#modal-xl").modal("show");
  $(".is-invalid").removeClass("is-invalid")
  $(".is-valid").removeClass("is-valid")
  $.ajax({
    url: apiURL + "user/" + id,
    type: "GET",
    dataType: "json",
    success: function (data) {
      if (data) {
        $("#uuid").val(data["id"]);
        $('#password').val("")
        $("#email").val(data["email"]);
        $("#user_type_id").val(data.user_types["id"]).trigger("change");
      
        if(data.employees != null){

          $("#employee_id").val(data.employees["id"]).trigger("change");
          $("#vendor_id").val("");

        }
        if(data.vendor != null){
          $("#employee_id").val("");

          $("#vendor_id").val(data.vendor["id"]).trigger("change");
        }
        
        $('#pass_text').text("New Password")



        // setTimeout(() => {
        // 	$("#section_id").val(data.data["section_id"]).trigger("change");
        // }, 1500);

        // if data is for viewing only
        if (type == 0) {
          $("#form_id input, select, textarea").prop("disabled", true);
          $(".modal-title").html("View User");
          $(".submit").hide();
          $(".hide-password").hide();

        }
        else{
          $("#form_id input, select, textarea").prop("disabled", false);
          // $("#form_id button").prop("disabled", false);
          $(".submit").show();
          $(".modal-title").html("Update User");
          $(".submit").html('Update' + '<i class="fas fa-check ml-1"></i>');
          $(".hide-password").hide();

        }
        $("#form_id select").prop("disabled", true);
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
  $(".modal-title").html("Delete User");
  $("#del_uuid").val(id);
};

deleteData2 = (id) => {
  id = $("#del_uuid").val();
  $("#modal-default").modal("hide");

  console.log(id);
  $.ajax({
    url: apiURL + "user/" + id,
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

