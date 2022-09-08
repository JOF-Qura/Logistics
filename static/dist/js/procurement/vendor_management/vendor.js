// function to redirect to vendor transaction page
const vendorTransactions = (id, vendorName) => {
  sessionStorage.setItem("vendorID", id);
  sessionStorage.setItem("vendor_name", vendorName);
  window.location.replace(baseURL + "procurement/vendor-transactions");
};


$(function () {
  $(".select2").select2();

  // load datatable
  loadTable();
  loadTableApplications();
  formReset("hide");
  $("#vendor_logo").change(function () {
		readURL(this);
	});

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

        // municipality: {
        //   required: "municipality is required",
    
        // },

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
        if ($("#uuid").val() == "") {
          // add record

          //   console.log();
          $.ajax({
            url: apiURL + "vendor/",
            data: form_data,
            dataType: "json",
            contentType: false,
            processData: false,
            cache: false,

            type: "POST",

            success: function (data) {
              if (data) {
                notification(
                  "success",
                  "Created!",
                  "Vendor Successfuly Created"
                );
                console.log(data);
                console.log("success");
                // $("#modal-xl").modal("hide");
                formReset("hide");
                $("#photo_path_placeholder").attr(
                  "src",
                  "https://avatars.dicebear.com/api/bottts/smile.svg"
                );

                loadTable();
              } else {
                notification("error", "Error!", "Error creating vendor");
                console.log("error");
              }
            },
            error: function ({ responseJSON }) {
              console.log(responseJSON);
            },
          });
        } else {
          // form_data.append("_method", "PUT");

          // update record
          $.ajax({
            url: apiURL + "vendor/" + $("#uuid").val(),
            type: "PUT",
            data: form_data,
        
            dataType: "json",
            contentType: false,
            processData: false,
            cache: false,
            success: function (data) {
              if (data) {
                notification(
                  "success",
                  "Updated!",
                  "Vendor Successfuly Updated"
                );
                console.log("success " + data);

                // $("#modal-xl").modal("hide");
                formReset("hide");
                loadTable();
                $("#photo_path_placeholder").attr(
                  "src",
                  "https://avatars.dicebear.com/api/bottts/smile.svg"
                );
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

// function to load category
loadCategory = () => {
  $.ajax({
    url: "http://localhost:8000/api/v1/category",
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

// datatable of vendor
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
    ajax: { url: apiURL + "vendor/", dataSrc: "" },

    responsive: true,
    serverSide: false,
    dataType: "json",
    type: "GET",
    columns: [
      {
        data: "vendor_name",
        name: "vendor_name",
        searchable: true,
        width: "10%",
        // className: "dtr-control",
      },
      {
        data: "category.category_name",
        name: "category.category_name",
        searchable: true,
        width: "10%",
        // className: "dtr-control",
      },
      {
        data: null,
        searchable: true,
        width: "15%",
        render: function (aData, type, row) {
          let address =
            aData.region + " " + aData.province + " " + aData.street;
          return address;
        },
      },
      {
        data: "contact_no",
        name: "contact_no",
        searchable: true,
        width: "10%",
        // className: "dtr-control",
      },
      {
        data: "email",
        name: "email",
        searchable: true,
        width: "10%",
        // className: "dtr-control",
      },
      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {
          if (aData.status == "Active" || aData.status == "active") {
            let status =
              '<label class="text-left badge badge-primary p-2 w-100" >Active</label>';

            return status;
          } else {
            let status =
              '<label class="text-left badge badge-dark p-2 w-100" >Blacklisted</label> ';
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
          
            if(aData.has_user == false){
         
            // create account
            buttons +=
            '<div class="dropdown-item d-flex role="button" data-toggle="modal" data-target="#modal-user" onClick="return createUser(\'' +
            aData["id"] +
            "',0)\">" +
            '<div style="width: 2rem"> <i class="fas fa-user-plus mr-1"></i></div>' +
            "<div> Create Account</div></div>";
            }
            else{
            // change password
            buttons +=
            '<div class="dropdown-item d-flex role="button" data-toggle="modal" data-target="#modal-user" onClick="return createUser(\'' +
            aData["id"] +
            "',1)\">" +
            '<div style="width: 2rem"> <i class= "fas fa-key mr-1"></i></div>' +
            "<div> Change Password</div></div>";
            }
          buttons +=
            '<div class="dropdown-item d-flex role="button" onClick="return vendorTransactions(\'' +
            aData.id +
            "', '" +
            aData.vendor_name +
            "',1)\">" +
            '<div style="width: 2rem"> <i class= "fas fa-percentage mr-1"></i></div>' +
            "<div>Transactions</div></div>";

          //delete
          if (aData.status == "Active" || aData.status == "active") {
            buttons +=
              '<div class="dropdown-item d-flex role="button" data-toggle="modal" data-target="#modal-blacklist" onClick="return changeStatus(\'' +
              aData["id"] +
              "',0)\"  >" +
              '<div style="width: 2rem"> <i class= "fas fa-trash mr-1"></i></div>' +
              "<div> Blacklist</div></div>";
          }

          //delete
          if (aData.status == "Blacklisted" || aData.status == "Blacklisted") {
            buttons +=
              '<div class="dropdown-item d-flex role="button" data-toggle="modal" data-target="#modal-blacklist" onClick="return changeStatus(\'' +
              aData["id"] +
              "',1)\"  >" +
              '<div style="width: 2rem"> <i class="fas fa-redo"></i></div>' +
              "<div> Reactivate</div></div>";
          }

          buttons += "</div></div>";
          return buttons; // same class in i element removed it from a element
        },
      },
    ],
  });
};

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



// create vendor user

createUser = (id,type)=>{
 $('#password').val("")
 


  if(type == 0){
    
    $.ajax({
      
      url: apiURL + "vendor/" + id,
      type: "GET",
      dataType: "json",
      success: function (data) {
        
        $('#user_uuid').val("")

        $('#vendor_id').val(data["id"])
        $('#vendor_email').val(data["email"])
        $("#user_type_id option:contains('outsider')")
              .attr("selected", "selected")
              .trigger("change");
  
        // $("#user_type_id").css("visibility","hidden")  
        
      
      },
  
      error: function (data) {},
    });
 $('#pass_text').text("Password")
 $('#changeStatus').text("Submit")
 $('.modal-title-user').html("Add User")

  }
  else{
    $.ajax({
      url: apiURL + "user/vendor/" + id,
      type: "GET",
      dataType: "json",
      success: function (data) {
        $('#user_uuid').val(data["id"])// user id
        $('#vendor_id').val(id)// id

        $('#vendor_email').val(data["email"])
        $("#user_type_id option:contains('outsider')")
              .attr("selected", "selected")
              .trigger("change");
  
        // $("#user_type_id").css("visibility","hidden")  
        
      
      },
  
      error: function (data) {},
    });
    $('#pass_text').text("New Password")
    $('#changeStatus').text("Update")
    $('.modal-title-user').html("Change Password")

  }

 
}

// user create update

submitUser = () =>{
  
      if ($("#user_uuid").val() == "") {
  
  
        $.ajax({
          url: apiURL + "user/",
          type: "POST",
          // data: form_data,
          contentType: "application/json",
          data: JSON.stringify({
            employee_id: $("#employee_id").val(),
            vendor_id: $("#vendor_id").val(),
  
            user_type_id: $("#user_type_id").val(),
  
            email: $("#vendor_email").val(),
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
        $("#modal-user").modal("hide");
      } else {
        // form_data.append("_method", "PUT");
  
        $.ajax({
          url: apiURL + "user/" + $("#user_uuid").val(),
          type: "PUT",
          // data: form_data,
          contentType: "application/json",
          data: JSON.stringify({
            employee_id: $("#employee_id").val(),
            
            user_type_id: $("#user_type_id").val(),
            email: $("#vendor_email").val(),
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
        $("#modal-user").modal("hide");
      }
    

}
  

 // datatable of vendor applications - not used
loadTableApplications = () => {
  $.ajaxSetup({
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
  });
  $("#data-table-applications").dataTable().fnClearTable();
  $("#data-table-applications").dataTable().fnDraw();
  $("#data-table-applications").dataTable().fnDestroy();
  $("#data-table-applications").DataTable({
    ajax: { url: apiURL + "vendor/pending", dataSrc: "" },

    responsive: true,
    serverSide: false,
    dataType: "json",
    type: "GET",
    columns: [
      {
        data: "vendor_name",
        name: "vendor_name",
        searchable: true,
        width: "10%",
        // className: "dtr-control",
      },
      {
        data: "category.category_name",
        name: "category.category_name",
        searchable: true,
        width: "10%",
        // className: "dtr-control",
      },
      {
        data: null,
        searchable: true,
        width: "15%",
        render: function (aData, type, row) {
          let address =
            aData.region + " " + aData.province + " " + aData.street;
          return address;
        },
      },
      {
        data: "contact_no",
        name: "contact_no",
        searchable: true,
        width: "10%",
        // className: "dtr-control",
      },
      {
        data: "email",
        name: "email",
        searchable: true,
        width: "10%",
        // className: "dtr-control",
      },
      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {
          if (aData.status == "Pending") {
            let status =
              '<label class="text-left badge badge-warning p-2 w-100" >Pending</label>';

            return status;
          } else if (aData.status == "Rejected") {
            let status =
              '<label class="text-left badge badge-danger p-2 w-100" >Rejected</label> ';
            return status;
          } else {
            let status =
              '<label class="text-left badge badge-primary p-2 w-100" >Accepted</label> ';
            return status;
          }
        },
      },

      {
        data: null,
        width: "10%",
        render: function (aData, type, row) {
          let buttons = "";
          buttons +=
            '<div class="text center dropdown"><div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
            '<i class="fas fa-ellipsis-v"></i></div><div class="dropdown-menu dropdown-menu-right">';
          //view
          buttons +=
            '<div class="dropdown-item d-flex role="button" data-toggle="modal" onClick="return acceptVendor(\'' +
            aData["id"] +
            "',0)\">" +
            '<div style="width: 2rem"> <i class= "fas fa-eye mr-1"></i></div>' +
            "<div> Accept Vendor</div></div>";

          buttons +=
            '<div class="dropdown-item d-flex role="button" data-toggle="modal" onClick="return rejectVendor(\'' +
            aData["id"] +
            "',1)\"  >" +
            '<div style="width: 2rem"> <i class= "fas fa-trash mr-1"></i></div>' +
            "<div> Reject Vendor</div></div>";

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
  $(".hide-password").show();
  $(".is-invalid").removeClass("is-invalid");
  $(".is-valid").removeClass("is-valid");

  $(".submit").html(
    "Submit" + '<i class="fas fa-check font-size-16 ml-2"></i>'
  );
  $("#form_id input, select, textarea").prop("disabled", false);
  $("#form_id input, select, textarea").val("");
  // $(".modal-title").html("Add Vendor");
  $(".submit").attr("class", "btn btn-primary submit");
};

// function to show details for viewing/updating
editData = (id, type) => {
  $(".is-invalid").removeClass("is-invalid");
  $(".is-valid").removeClass("is-valid");

  // $("#modal-xl").modal("show");

  $.ajax({
    url: apiURL + "vendor/" + id,
    type: "GET",
    dataType: "json",
    success: function (data) {
      if (data) {
        formReset("show");
        $("#uuid").val(data["id"]);
        $("#photo_path_placeholder").attr(
          "src",
          apiURL + "vendor/vendor-pic/" + data["vendor_logo"]
        );

        // console.log(apiURL + "vendor/vendor-pic/" + data["vendor_logo"]);
        $("#vendor_name").val(data["vendor_name"]);

        // $("#region").val(data["region"]);
        // $("#province").val(data["province"]);
        // $("#municipality").val(data["municipality"]);
        $("#barangay").val(data["barangay"]);
        $("#street").val(data["street"]);
        $("#organization_type").val(data["organization_type"]);
        $("#vendor_website").val(data["vendor_website"]);

        $("#category_id").val(data.category["id"]).trigger("change");

        $("#contact_no").val(data["contact_no"]);
        $("#contact_person").val(data["contact_person"]);

        $("#email").val(data["email"]);

        $("#username").val(data["username"]);
        // $("#password").val(data["password"]);


        $("#region option:contains(" + data["region"] + ")")
          .attr("selected", "selected")
          .trigger("change");

        setTimeout(() => {
          $("#province option:contains(" + data["province"] + ")")
            .attr("selected", "selected")
            .trigger("change");

        }, 2000);

        setTimeout(() => {
          $("#municipality option:contains(" + data["municipality"] + ")")
            .attr("selected", "selected")
            .trigger("change");

        }, 3500);


        setTimeout(() => {
          $("#barangay option:contains(" + data["barangay"] + ")")
            .attr("selected", "selected")
            .trigger("change");

        }, 5000);

        // if data is for viewing only
        if (type == 0) {
          $("#form_id input, select, textarea").prop("disabled", true);
          // $(".modal-title").html("View Vendor");
          $(".submit").hide();
          $(".hide-password").hide();
        } else {
          $("#form_id input, select, textarea").prop("disabled", false);
          // $("#form_id button").prop("disabled", false);
          $(".submit").show();
          
          // $(".modal-title").html("Update Vendor");
          $(".submit").html(
            "Update" + '<i class="fas fa-check font-size-16 ml-2"></i>'
          );
          $(".submit").attr("class", "btn btn-info submit");
          $(".hide-password").hide();
        }
      } else {
        notification("error", "Error!", data.message);
      }
    },
    error: function (data) {},
  });
};


// function to change status of vendor
changeStatus = (id, type) => {
  if (type == 0) {
    $(".modal-title-status").html("Blacklist Vendor");
    $(".blacklist-remarks").show();
$('#ReactivateData').hide()
$('#blacklistData').show()

    $.ajax({
      url: apiURL + "vendor/" + id,
      type: "GET",
      // headers: { Authorization: `Bearer ${localStorage.getItem("TOKEN")}` },
      success: (data) => {
        $("#blacklist_vendor_name").val(data["vendor_name"]);
        $("#blacklist_vendor_email").val(data["email"]);

        //if button (modal) is clicked
        $("#blacklistData").click(() => {
          $.ajax({
            url: apiURL + "vendor/blacklist/",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
              vendor_name: $("#blacklist_vendor_name").val(),
              vendor_email: $("#blacklist_vendor_email").val(),
              remarks: $("#blacklist_remarks").val(),
              vendor_id: id,
            }),
            dataType: "json",
            // contentType: false,
            processData: false,
            cache: false,
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + localStorage.getItem("TOKEN"),
            },
            // dataType: false,
            success: function (data) {
              if (data) {
                notification("info", "Blaklisted!", "Vendor Blaklisted");

                loadTable();
                $("#modal-blacklist").modal("hide");
              } else {
                notification("Warning", "Warning!", "Cant Blacklist Vendor");

                console.log("error" + data);
                loadTable();
                $("#modal-blacklist").modal("hide");
              }
            },
            error: function ({ responseJSON }) {},
          });
        });
      },
    });
  } else {
    $(".modal-title-status").html("Activate Vendor");
    $('#ReactivateData').show()
    $('#blacklistData').hide()
    $(".blacklist-remarks").hide();
    $.ajax({
      url: apiURL + "vendor/" + id,
      type: "GET",
      // headers: { Authorization: `Bearer ${localStorage.getItem("TOKEN")}` },
      success: (data) => {
        $("#blacklist_vendor_name").val(data["vendor_name"]);
        $("#blacklist_vendor_email").val(data["email"]);

        //if button (modal) is clicked
        $("#ReactivateData").click(() => {
          $.ajax({
            // url: apiURL + "workflow-approval/",
            url: apiURL + "vendor/status/" + id,

            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify({
              status: "Active",
            }),
            dataType: "json",
            processData: false,
            cache: false,
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + localStorage.getItem("TOKEN"),
            },
            success: function (data) {
              if (data) {
                notification("success","Success", "Vendor Activated");

                $("#modal-blacklist").modal("hide");
                loadTable();
              } else {
                $("#modal-blacklist").modal("hide");

                notification("error", "Error!", "Error activating vendor");
                loadTable();

                console.log("error");
              }
            },
            error: function ({ responseJSON }) {
              console.log(responseJSON);
            },
          });
        });
      },
    });
  }
};

// acceptVendor = (id) => {
//   console.log("wew");
//   $.ajax({
//     url: apiURL + "vendor-application/" + id,
//     // contentType: "application/x-www-form-urlencoded",
//     type: "PUT", // post, put, delete, get
//     contentType: "application/json",

//     data: JSON.stringify({
//       status: "active",
//     }),
//     dataType: "json",
//     processData: false,
//     cache: false,
//     success: function (data) {
//       if (data) {
//         notification("success", "Created!", "Vendor Successfuly Created");

//         $("#modal-application").modal("hide");
//         loadTable();
//         loadTableApplications();
//       } else {
//         notification("error", "Error!", "Error creating vendor");
//         console.log("error");
//       }
//     },
//     error: function ({ responseJSON }) {
//       $(".is-invalid").removeClass("is-invalid");
//       $(".is-valid").removeClass("is-valid");
//       notification("warning", "Error");
//     },
//   });
// };

// rejectVendor = (id) => {
//   $.ajax({
//     url: apiURL + "vendor-application/" + id,
//     // contentType: "application/x-www-form-urlencoded",
//     type: "PUT", // post, put, delete, get
//     contentType: "application/json",

//     data: JSON.stringify({
//       status: "Rejected",
//     }),
//     dataType: "json",
//     processData: false,
//     cache: false,
//     success: function (data) {
//       if (data) {
//         $("#modal-application").modal("hide");

//         notification("success", "Application Rejected");
//         loadTableApplications();
//       } else {
//         notification("warning", "Error");
//       }
//     },
//     error: function ({ responseJSON }) {
//       notification("success", "Eror warning");
//     },
//   });
// };
// 		action = show, hide
formReset = (action = "hide") => {
  $("html, body").animate({ scrollTop: 0 }, "slow");
  $(".submit").html(
    "Create" + '<i class="fas fa-plus font-size-16 ml-2"></i>'
  );
  $(".submit").attr("class", "btn btn-primary submit");
  if (action == "hide") {
    $(".is-invalid").removeClass("is-invalid");
    $(".is-valid").removeClass("is-valid");
    $(".invalid-feedback").hide();
    // hide and clear form
    $("#uuid").val("");
    $("#div_form").hide();
    $("#form_id")[0].reset();
    $('.add').show()

    $("#form_id input, select, textarea").prop("disabled", false);
    $("#photo_path_placeholder").attr(
      "src",
      "https://avatars.dicebear.com/api/bottts/smile.svg"
      );
    } else {
    
    // show
    $("#div_form").show();
    $("#form_id input, select, textarea").prop("disabled", false);
    $("#form_id button").prop("disabled", false);
    $('.add').hide()
  }
};


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

// for uploading image
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
