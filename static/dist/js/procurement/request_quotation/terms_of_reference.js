// const formDataRFQ = {};
const formDataTor = {};

$(function () {
  window.stepper = new Stepper(document.querySelector(".bs-stepper"));
  summerNotes();
  $("#email_loader").hide();
  $('.submit').hide()
  // load datatable
  formReset("hide");
  $(".select2").select2();

  // load items table
  pr_detail_table_quotation();

  // load terms of reference datatable
  loadTable();

  $("#form_id")
    .on("submit", function (e) {
      e.preventDefault();
      // trimInputFields();
    })
    .validate({
      ignore: ".summernote *",

      rules: {
        // simple rule, converted to {required:true}
        project_request_id: {
          required: true,
        },
        due_date: {
          required: true,
        },
        message: {
          required: true,
        },
        background: {
          required: true,
        },
        // compound rule
        objectives: {
          required: true,
        },

        scope_of_services: {
          required: true,
        },

        tor_deliverables: {
          required: true,
        },
  
        qualifications: {
          required: true,
        },

        
        reporting_working_arrangements: {
          required: true,
        },
        
      },
      messages: {

        purchase_requisition_id: {
          required: "please provide first name",

        },
        due_date: {
          required: "please provide a due date",

        },
        message: {
          required: "please provide a message",

        },
        background: {
          required: "please provide a background",

        },
        // compound rule
        objectives: {
          required: "please provide a objectives",

        },

        scope_of_services: {
          required: "please provide a scope of service",

        },

        tor_deliverables: {
          required: "please provide a deliverables",

        },
  
        qualifications: {
          required: "please provide a qualifications",
          
        },

        
        reporting_working_arrangements: {
          required: "please provide a reproting work arrangements",

        },
      },
      errorElement: "span",
      errorPlacement: function (error, element) {
        error.addClass("invalid-feedback");
        element.closest(".validate").append(error);
      },
      highlight: function (element, errorClass, validClass) {
        $(element).addClass("is-invalid");
      },
      unhighlight: function (element, errorClass, validClass) {
        $(element).removeClass("is-invalid");
        $(element).addClass("is-valid");
      },
      submitHandler: function () {
        let date = Date.now();

        formDataTor["vendor_id"] = $("#vendor_id").val();
        formDataTor["project_request_id"] = $("#project_request_id").val();
        formDataTor["status"] = $("#status").val();

       
     
        formDataTor["prepared_by"] = $("#prepared_by").val();

        formDataTor["background"] = $("#background").val();
        formDataTor["objective"] = $("#objectives").val();
        formDataTor["scope_of_service"] = $("#scope_of_services").val();
        formDataTor["qualifications"] = $("#qualifications").val();
        formDataTor["reporting_and_working_arrangements"] = $(
          "#reporting_working_arrangements"
        ).val();
        formDataTor["tor_deliverables"] = $("#tor_deliverables").val();
        // formDataTor["consultancy_type"] = "firm";
        // formDataTor["renumeration_type"] = "waw";
        // formDataTor["source_of_funds"] = "wew";
        // formDataTor["rate"] = "wew";
        // formDataTor["pocket_cost"] = "WEW";
        formDataTor["tor_annex_technical_specifications"] = $(
          "#annex_a_technical_specs"
        ).val();
        formDataTor["tor_annex_key_experts"] = $("#annex_b_key_experts").val();
        formDataTor["tor_annex_deliverables"] = $(
          "#annex_c_deliverable_amount"
        ).val();
        formDataTor["tor_annex_terms_conditions"] = $(
          "#annex_d_terms_conditions"
        ).val();

        // if ($("#request_quotation_id").val() == "") {
        // add record
       
        console.log(formDataTor)
            $.ajax({
              url: apiURL + "terms-of-reference/",
              type: "POST",
              // data: form_data,
              contentType: "application/json",
              data: JSON.stringify( formDataTor,
              ),
              dataType: "json",
              // contentType: false,
              processData: false,
              // cache: false,
              headers: {
                Accept: "application/json",
                Authorization: "Bearer " + localStorage.getItem("TOKEN"),
              },
              beforeSend: function () {
                $("#email_loader").show();
                $("#send_email_txt").hide();
              },
              success: function (data) {
                if (data) {
                  console.log(data)
                    if(file_arr.length != 0){
                      for(let i in file_arr){
                        let formDataFiles = new FormData();
                        formDataFiles.append('attachment', file_arr[i])
                        formDataFiles.append('terms_of_reference_id', data.id)

                        // for (let value of formDataFiles.values()) {
                        //   console.log(value);
                        // }
                        $.ajax({
                          url:
                          apiURL + "related-documents/",
                          type: "POST",
                          data: formDataFiles,
                          dataType: "json",
                          contentType: false,
                          processData: false,
                          cache: false,
                          success: function (data) {
                            
                          },
                          error: function ({ responseJSON }) {},
                        });


                      }
                    }

                    notification(
                        "success",
                        "Created!",
                        "TOR Successfuly Created"
                      );
                      formReset("hide");
                      loadTable();
                  // $("#modal-rfq").modal("hide");
                } else {
                  notification("error", "Error!", "Error creating TOR");
                  console.log("error");
                }
              },
              complete: function () {
                $("#email_loader").hide();
                $("#send_email_txt").show();
              },
              error: function ({ responseJSON }) {
                notification("error", "Error!", "Please fill out all fields");
                

              },
            });
        
        
     
      },
    });
});

// all approved project request
loadProjectRequisition = () => {
  $.ajax({
    url: "/projects/approval_status/Approved",
    type: "GET",
    dataType: "json",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
    success: function (responseData) {
      if (responseData) {
        $("#project_request_id").empty();
        $("#project_request_id").append(
          "<option disabled selected>Select Project Request</option>"
        );

        $.each(responseData, function (i, dataOptions) {
          let options = "";

          options =
            "<option value='" +
            dataOptions.id +
            "'>" +
            dataOptions.name +
            "</option>";

          $("#project_request_id").append(options);
        });
      } else {
        // notification("error", "Error!", responseData.message);
        console.log("error", "Error!", responseData.success);
      }
    },
    error: function ({ responseJSON }) {},
  });
};

loadProjectRequisition();

// view purchase requisition
viewPR = () => {
  if($("#purchase_requisition_id").val() != null){
    console.log($("#purchase_requisition_id").val())
    $("#modal-xl").modal("show");

  }
  //   console.log(id);
  // $.ajax({
  //   url: apiURL + "purchase-requisition/" + $('#purchase_requisition_id').val(),
  //   type: "GET",
  //   dataType: "json",
  //   success: function (data) {
  //     if (data) {
  //       $("#pr_number").html(
  //         formatPurchaseRequestNo(data["purchase_requisition_number"])
  //       );
  //       $("#status").html(data["status"]);
  //       $("#department").html(data.u_created_by.department["department_name"]);
  //       $("#requested_by").html(data.u_created_by["first_name"]);
  //       $("#purpose").html(data["purpose"]);
  //       $("#date_requested").html(
  //         moment(data["date_requested"]).format("MMMM D, YYYY")
  //       );

  //       prd_table.clear().draw();

  //       for (var pr_item in data.purchase_requisition_detail) {
  //         if (data.purchase_requisition_detail[pr_item].product_id === null) {
  //           prd_table.row
  //             .add([
  //               data.purchase_requisition_detail[pr_item].new_category,
  //               data.purchase_requisition_detail[pr_item].new_product_name,
  //               data.purchase_requisition_detail[pr_item].quantity,
  //             ])
  //             .draw();
  //         } else {
  //           prd_table.row
  //             .add([
  //               data.purchase_requisition_detail[pr_item].product.category
  //                 .category_name,
  //               data.purchase_requisition_detail[pr_item].product.product_name,
  //               data.purchase_requisition_detail[pr_item].quantity,
  //             ])
  //             .draw();
  //         }
  //       }

  //     } else {
  //       notification("error", "Error!", data.detail);

  //       console.log("error" + data);
  //       loadTable();
  //     }
  //   },
  //   error: function ({ responseJSON }) {},
  // });
};


// view purchase requisition on change
$("#purchase_requisition_id").on("change", function () {
  console.log(this.value);

  //   load pr

  $("#modal-xl").modal("show");

  $(".view_pr_button").show();
  //   console.log(id);
  $.ajax({
    url: apiURL + "purchase-requisition/" + this.value,
    type: "GET",
    dataType: "json",
    success: function (data) {
      if (data) {
        $("#pr_number").html(
          formatPurchaseRequestNo(data["purchase_requisition_number"])
        );
        $("#status").html(data["status"]);
        $("#department").html(data.u_created_by.department["department_name"]);
        $("#requested_by").html(data.u_created_by["first_name"]);
        $("#purpose").html(data["purpose"]);
        $("#budget").val(data["budget"]);

        $("#date_requested").html(
          moment(data["date_requested"]).format("MMMM D, YYYY")
        );

        prd_table.clear().draw();

        for (let pr_item in data.purchase_requisition_detail) {
          if (data.purchase_requisition_detail[pr_item].product_id === null) {
            $("#quotation_code").val(
              data.purchase_requisition_detail[pr_item].new_category
                .slice(0, 2)
                .toUpperCase() +
                " - " +
                data["purchase_requisition_number"]
            );
            prd_table.row
              .add([
                data.purchase_requisition_detail[pr_item].new_category,
                data.purchase_requisition_detail[pr_item].new_product_name,
                data.purchase_requisition_detail[pr_item].quantity,
              ])
              .draw();
          } else {
            $("#quotation_code").val(
              data.purchase_requisition_detail[
                pr_item
              ].product.category.category_name
                .slice(0, 2)
                .toUpperCase() +
                " - " +
                data["purchase_requisition_number"]
            );
            prd_table.row
              .add([
                data.purchase_requisition_detail[pr_item].product.category
                  .category_name,
                data.purchase_requisition_detail[pr_item].product.product_name,
                data.purchase_requisition_detail[pr_item].quantity,
              ])
              .draw();
          }
        }
      } else {
        notification("error", "Error!", data.detail);

        console.log("error" + data);
        loadTable();
      }
    },
    error: function ({ responseJSON }) {},
  });
});


// load catagory
loadTableCategory = () => {
  $.ajax({
    url: apiURL + "category/",
    type: "GET",
    dataType: "json",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
    success: function (responseData) {
      if (responseData) {
        $("#vendor-list").empty();
        $.each(responseData, function (i, dataOptions) {
          let vendor_list = "";

          vendor_list +=
            '<div class="card collapsed-card">' +
            '<div class="card-header">' +
            '<h3 class="card-title">' +
            dataOptions.category_name +
            "</h3>" +
            '<div class="card-tools">' +
            '<button type="button" class="btn btn-tool" data-card-widget="collapse">' +
            '<i class="fas fa-plus"></i>' +
            "</button></div></div>" +
            '<div class="card-body">' +
            '<div class="container">' +
            '<div class="row">';
          if (dataOptions.vendor_procurement != "") {
            for (let k = 0; k < dataOptions.vendor_procurement.length; k++) {
              vendor_list +=
                '<div class="col-md-2">' +
                '<input type="checkbox" style="max-width: 25px; max-height: 25px;" class="form-control vendors" value = "' +
                dataOptions.vendor_procurement[k].id +
                '"></div>' +
                '<div class="col-md-10">' +
                "<h6>" +
                dataOptions.vendor_procurement[k].vendor_name +
                "</h6>" +
                "</div>";
            }
          }

          vendor_list += "</div></div></div></div>";

          $("#vendor-list").append(vendor_list);
        });
      } else {
        // notification("error", "Error!", responseData.message);
        console.log("error", "Error!", responseData.success);
      }
    },
    error: function ({ responseJSON }) {},
  });
};

loadTableCategory();

//   purchase request table
pr_detail_table_quotation = () => {
  $("#pr-detail-table").dataTable().fnClearTable();
  $("#pr-detail-table").dataTable().fnDraw();
  $("#pr-detail-table").dataTable().fnDestroy();
  prd_table = $("#pr-detail-table").DataTable({
    info: false,
    paging: false,
    searching: false,
    ordering: false,
  });
};


// load vendor
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
        $.each(responseData, function (i, dataOptions) {
          let options = "";
          options =
            "<option value='" +
            dataOptions.id +
            "'>" +
            dataOptions.vendor_name +
            "</option>";

          $("#vendor_id").append(options);
          $("#recipient").append(options);
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

// request for quotation datatable
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
    ajax: { 
      url: apiURL + "terms-of-reference",
      dataSrc: "",
    //   error: function(xhr, error, thrown) {
    //     if(thrown == "Unauthorized"){
    //    window.location.replace(baseURL+"login");

    //     }
    // } 
  },

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
          return aData.tor_number
        },
      },

      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {
          return aData.prepared_by;
        },
      },
      {
        data: null,
        name: null,
        searchable: true,
        width: "15%",
        render: function (aData, type, row) {
          return moment(aData["created_at"]).format("MMMM D, YYYY");
        },
      },
      {
        data: null,
        name: null,
        searchable: true,
        width: "15%",
        render: function (aData, type, row) {
          if (aData.status === "Pending") {
            let status =
              '<label class="text-left badge badge-warning p-2 w-100"> ' +
              aData.status +
              "</label> ";
            return status;
          } else if (aData.status === "Approved") {
            let status =
              '<label class="text-left badge badge-primary p-2 w-100"> ' +
              aData.status +
              "</label> ";
            return status;
          }else {
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

          if (aData["status"] == "Pending") {
            // buttons +=
            //   '<div class="dropdown-item d-flex role="button" onClick="return editData(\'' +
            //   aData["id"] +
            //   "',1)\">" +
            //   '<div style="width: 2rem"> <i class= "fas fa-edit mr-1"></i></div>' +
            //   "<div> Edit</div></div>";

            //cancel
            buttons +=
              '<div class="dropdown-item d-flex role="button" onClick="return redoData(\'' +
              aData["id"] +
              "',1)\">" +
              '<div style="width: 2rem"> <i class= "fas fa-times mr-1"></i></div>' +
              "<div> Cancel</div></div>";
          }
          if (aData.status == "Cancelled") {
            //resend
            buttons +=
              '<div class="dropdown-item d-flex role="button" onClick="return redoData(\'' +
              aData["id"] +
              "',2)\">" +
              '<div style="width: 2rem"> <i class= "fas fa-redo mr-1"></i></div>' +
              "<div> Resend</div></div>";
          }
          buttons += "</div></div>";
          return buttons; // same class in i element removed it from a element
        },
      },
    ],
  });
};

// function to show details for viewing/updating
editData = (id, type) => {
  $.ajax({
    url: apiURL + "terms-of-reference/" + id,
    type: "GET",
    dataType: "json",
    success: function (data) {
      if (data) {
        console.log(data)
        $('#summernote_forms').hide()
        $('#summnernote_div').show();
        $('#next_page_btn').hide()
        formReset("show");
        console.log(data);
        $("#related_files_body").empty()
        let related_files_body =""
        for(let i in data.related_documents){
          console.log(data.related_documents[i].attachment)
   
          related_files_body += '<div >' +
          '<li>' + '<a href="#modal-file" data-toggle="modal" onClick="return showFileModal(this,1,\'' + data.related_documents[i].attachment + '\')" data-id="'+data.related_documents[i].attachment+'" class="btn-link text-dark"><i class="far fa-fw fa-file-word"></i> '+data.related_documents[i].attachment+'</a>' 
          + '</li></div>'
        }
console.log(data.project_request_id)

        $('#project_request_id').val(data.project_request_id).trigger("change")
        
        $("#related_files_body").append(related_files_body)
        // formDataRFQ["vendor_id"] = "";
        // $("#status").val();
        // $("#purchase_requisition_id").val(data.purchase_requisition["id"]).trigger("change");
        $("#terms_of_reference_id").val(data["id"])
        $("#message").val(data["message"]);
        $("#due_date").val(data["due_date"]);
 
        // $("#prepared_by").val(data["prepared_by"]);
        $("#prepared_by").val("prepared by");

        $("#background_div").append(data["background"]);

        $("#deliverables_div").append(data["tor_deliverables"]);

        $("#objectives_div").append(data["objective"]);
        $("#scope_of_services_div").append(
          data["scope_of_service"]
        );
        $("#qualifications_div").append(data["qualifications"]);
        $("#reporting_working_arrangements_div").append(
          data["reporting_and_working_arrangements"]
        );

        // formDataTor["consultancy_type"] = "firm";

        // formDataTor["renumeration_type"] = "waw";
        // formDataTor["source_of_funds"] = "wew"
        // formDataTor["rate"] = "wew";
        // formDataTor["pocket_cost"] = "WEW"
        $("#tor_deliverables").summernote(
          "code",
          data["tor_deliverables"]
        );

    
        if (
          data["tor_annex_technical_specifications"] != ""
        ) {
          $("#annex_a_technical_specs").summernote(
            "code",
            data["tor_annex_technical_specifications"]
          );

          $("#annex_technical_specs").show();
        }
        if (data["tor_annex_key_experts"] != "") {
          $("#annex_b_key_experts").summernote(
            "code",
            data["tor_annex_key_experts"]
          );
          $("#annex_evaluation_criteria").show();
        }
        if (data["tor_annex_deliverables"] != "") {
          $("#annex_b_key_experts").summernote(
            "code",
            data["tor_annex_deliverables"]
          );

          $("#annex_renumeration_payment").show();
        }
        if (data["tor_annex_terms_conditions"] != "") {
          $("#annex_d_terms_conditions").summernote(
            "code",
            data["tor_annex_terms_conditions"]
          );
          $("#annex_terms_conditions").show();
        }

        // if data is for viewing only
        if (type == 0) {
          $("#form_id input, select, textarea").prop("disabled", true);
  $('#add-files-button').hide()
          $(".send-email").hide();
          $(".print").hide();
          $(".submit").hide();
          $("#view_pr").show();
        } else{
          $("#form_id input, select, textarea").prop("disabled", false);
          // $(".modal-title").html("PR");
          $(".print").show();
          $(".send-email").hide();
        } 
      } else {
        notification("error", "Error!", data.message);
      }
    },
    error: function (data) {},
  });
};

// function to delete data
// deleteData = (id) => {
//   $("#modal-default").modal("show");
//   $(".modal-title").html("Delete Quotation");
//   $("#del_uuid").val(id);
// };

// deleteData2 = (id) => {
//   id = $("#del_uuid").val();
//   $("#modal-default").modal("hide");

//   console.log(id);
//   $.ajax({
//     url: apiURL + "request-quotation/" + id,
//     type: "DELETE",
//     dataType: "json",
//     success: function (data) {
//       if (data) {
//         // notification("success", "Success!", data.message);
//         console.log("success" + data);
//         loadTable();
//       } else {
//         notification("info", "Deleted!", "Record Deleted");

//         console.log("error" + data);
//         loadTable();
//       }
//     },
//     error: function ({ responseJSON }) {},
//   });
// };

// change status 
const formStatus = {};
redoData = (id, type) => {
  if (type == 1) {
    $("#modal-default").modal("show");
    $(".cancel-request").html(
      '<i class="text-secondary fas fa-exclamation-triangle mr-2"></i>' +
        "Cancel TOR"
    );
    $(".request-modal-body").html("Are you sure you want to Cancel this tor?");
    $("#changeStatus").attr('class', 'btn btn-info');

    $("#changeStatus").html("Yes, Cancel it")

    $("#resend").hide();

    $("#uuid").val(id);
    formStatus["status"] = "Cancelled";
  } else {
    $(".budget-row").hide();
    $(".request-modal-body").html("Are you sure you want to resend this tor?");
    $("#changeStatus").html("Yes, Resend it")
    $("#changeStatus").attr('class', 'btn btn-primary');

    $("#modal-default").modal("show");
    $(".cancel-request").html(
      '<i class="text-secondary fas fa-exclamation-triangle mr-2"></i>' +
        "Resend TOR"
    );

    $("#cancel").hide();
    $("#resend").show();

    $("#uuid").val(id);

    formStatus["status"] = "Pending";
  }

  
};


changeStatus = () => {
  $.ajax({
    url: apiURL +
    "terms-of-reference/" +
    $("#uuid").val(),

    type: "PUT",
    contentType: "application/json",
    data: JSON.stringify({
 
      status: formStatus["status"],
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
        if (formStatus["status"] == "Cancelled") {
          notification("info", "TOR Cancelled");
        } else {
          notification("success", "TOR Resent");
        }
        $("#modal-status").modal("hide");
        loadTable();

      } else {
        $("#modal-status").modal("hide");

        notification("error", "Error!", "Error approving TOR");

        console.log("error");
      }
    },
    error: function ({ responseJSON }) {
      console.log(responseJSON);
    },
  });
  $('#changeStatus').attr('data-dismiss','modal');
}

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
    // $(".view_pr_button").hide();
    $("#annex_technical_specs").hide();
    $("#annex_evaluation_criteria").hide();
    $("#annex_renumeration_payment").hide();
    $("#annex_terms_conditions").hide();
    $("#related_files_body").empty()
  
    $("#request_quotation_id").val("")

    $("#view_pr").hide();
    window.stepper = new Stepper(document.querySelector(".bs-stepper"));

    $("#form_id")[0].reset();
    //   new_product.splice(0, new_product.length);
    $("#form_id input, select, textarea").prop("disabled", false);
  } else {
    $("#view_pr").hide();
  $('#add-files-button').show()
  // $('#summernote_forms').show()

    window.stepper = new Stepper(document.querySelector(".bs-stepper"));
    $("#related_files_body").empty()

    // show
    $("#prepared_by").val(
      // localStorage.getItem("FIRSTNAME") + " " + localStorage.getItem("LASTNAME")
      "Prepared by"
    );
    $("#div_form").show();
    // $("#rfq_tor").html("Request For Quotation");

    $("#form_id input, select, textarea").prop("disabled", false);
    $("#form_id button").prop("disabled", false);
  }
};


// insert annex
addAnnex = () => {
  if ($("#select_annex").val() == "technical_specifications") {
    $("#annex_technical_specs").show();
  } else if ($("#select_annex").val() == "evaluation_criteria") {
    $("#annex_evaluation_criteria").show();
  } else if ($("#select_annex").val() == "renumeration_payment") {
    $("#annex_renumeration_payment").show();
  } else if ($("#select_annex").val() == "terms_and_conditions") {
    $("#annex_terms_conditions").show();
  }
  $("#modal-select-annex").modal("hide");
};


// upload attachment
$('#buttonid').on("click", function(){
  document.getElementById('fileid').click();

})

var file_arr = []

// function to display selected attachment
function onUpload(input) {  
  let originalFile = input.files[0];
  let reader = new FileReader();
  reader.readAsDataURL(originalFile);
  reader.onload = () => {
    let json = JSON.stringify({ dataURL: reader.result });
    // View the file
    let fileURL = JSON.parse(json).dataURL;
    let related_files_body =""
   
    related_files_body += '<div class="d-flex justify-content-between">' +
    '<li>' + '<a href="#modal-file" data-toggle="modal" onClick="return showFileModal(this,0)" data-id="'+fileURL+'" class="btn-link text-dark"><i class="far fa-fw fa-file-word"></i> '+originalFile.name+'</a>' 
    + '</li>' + '<p style="cursor:pointer;" onclick="removeFile(this.parentNode.parentNode,this.parentNode)"><i class="text-secondary fas fa-times"></i></p>' + '</div>'
    $("#related_files_body").append(related_files_body)
    
    file_arr.push(originalFile)
 
  };
}

// function to show selected attachment
showFileModal= (file,type,existed_file) =>{
$('#display_file').attr("src", "")
if(type == 0){
  let file_data = $(file).attr('data-id');
  $('#display_file').attr("src", file_data)
  console.log(file_arr)

}
else{
  $('#display_file').attr("src", apiURL+"related-documents/related-file/"+existed_file)

}
}


// remove selected attachment
removeFile = (parent_node,child_node) =>{
let remove_idx = Array.prototype.indexOf.call(parent_node.children, child_node)
child_node.remove()
file_arr.splice(remove_idx, 1);

}

$('#fileid').on("change", function(){
  // console.log($('#fileid').val())
  onUpload(this);

})


// summernotes
summerNotes = () => {
  $(document).ready(function () {
    $("#background").summernote({
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

    $("#objectives").summernote({
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


    $("#scope_of_services").summernote({
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


    $("#tor_deliverables").summernote({
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


    $("#qualifications").summernote({
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

    $("#reporting_working_arrangements").summernote({
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

    $("#annex_a_technical_specs").summernote({
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

    $("#annex_b_key_experts").summernote({
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

    $("#annex_c_deliverable_amount").summernote({
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

    $("#annex_d_terms_conditions").summernote({
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
  });
};
