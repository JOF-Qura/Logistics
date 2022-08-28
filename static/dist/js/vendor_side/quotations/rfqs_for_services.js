const formDataDetail = {};
const formData = {};
bidding_items_id = [];

$(function () {
  window.stepper = new Stepper(document.querySelector(".bs-stepper"));

  // initialized select2
  $(".select2").select2();
  // load datatable
  loadTable();

  formReset("hide");
});

// rfq datatable
loadTable = () => {
  $.ajaxSetup({
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
  });
  console.log()
  $("#data-table").dataTable().fnClearTable();
  $("#data-table").dataTable().fnDraw();
  $("#data-table").dataTable().fnDestroy();
  $("#data-table").DataTable({
    ajax: {
      url: apiURL + "request-quotation/vendor/" + localStorage.getItem("ID")+ "/all",
      dataSrc: "",
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
          return formatRfqNo(aData.request_quotation_number);
        },
      },

      {
        data: "prepared_by",
        name: "prepared_by",
        searchable: true,
        width: "10%",
      },
      {
        data: "message",
        name: "message",
        searchable: true,
        width: "15%",
      },

      {
        data: null,
        name: null,
        searchable: true,
        width: "15%",
        render: function (aData, type, row) {
          return (
            moment(aData["due_date"]).format("MMMM D, YYYY") +
            "<br>" +
            "<em class='text-secondary'>" +
            moment(aData["due_date"]).fromNow() +
            "</em>"
          );
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
        width: "15%",
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

          // if (aData.has_proposal != true) {
          //   buttons +=
          //     '<div class="dropdown-item d-flex role="button" onClick="return createProposal(\'' +
          //     aData["id"] +
          //     "', '" +
          //     aData["request_quotation_number"] +
          //     "')\">" +
          //     '<div style="width: 2rem"> <i class= "fas fa-plus mr-1"></i></div>' +
          //     "<div> Create Proposal</div></div>";
          // }
          buttons += "</div></div>";
          return buttons; // same class in i element removed it from a element
        },
      },
    ],
  });
};

viewPR = () => {
  if($("#purchase_requisition_id").val() != null){
    console.log($("#purchase_requisition_id").val())
    $("#modal-xl").modal("show");

 
      $("#pr-detail-table").dataTable().fnClearTable();
      $("#pr-detail-table").dataTable().fnDraw();
      $("#pr-detail-table").dataTable().fnDestroy();
      prd_table = $("#pr-detail-table").DataTable({
        info: false,
        paging: false,
        searching: false,
        ordering: false,
      });
 

  $.ajax({
    url: apiURL + "purchase-requisition/" + $('#purchase_requisition_id').val(),
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
        $("#date_requested").html(
          moment(data["date_requested"]).format("MMMM D, YYYY")
        );

        prd_table.clear().draw();

        for (var pr_item in data.purchase_requisition_detail) {
          if (data.purchase_requisition_detail[pr_item].product_id === null) {
            prd_table.row
              .add([
                data.purchase_requisition_detail[pr_item].new_category,
                data.purchase_requisition_detail[pr_item].new_product_name,
                data.purchase_requisition_detail[pr_item].quantity,
              ])
              .draw();
          } else {
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

}
//   console.log(id);
};

showFileModal= (existed_file) =>{
  $('#display_file').attr("src", "")

    $('#display_file').attr("src", apiURL+"related-documents/related-file/"+existed_file)
  
  
  }

// function to show details for viewing/updating
editData = (id, type) => {
  $.ajax({
    url: apiURL + "request-quotation/" + id,
    type: "GET",
    dataType: "json",
    success: function (data) {
      if (data) {
        console.log(data)
        if (data["status"] == "Pending") {
          $("#approve_rfq").show();
          $("#reject_rfq").show();
        } else {
          $("#approve_rfq").hide();
          $("#reject_rfq").hide();
        }
        formReset("show");

        $("#related_files_body").empty()
        let related_files_body =""
        for(let i in data.related_documents){
          console.log(data.related_documents[i].attachment)
   
          related_files_body += '<div >' +
          '<li>' + '<a href="#modal-file" data-toggle="modal" onClick="return showFileModal(\'' + data.related_documents[i].attachment + '\')" data-id="'+data.related_documents[i].attachment+'" class="btn-link text-dark"><i class="far fa-fw fa-file-word"></i> '+data.related_documents[i].attachment+'</a>' 
          + '</li></div>'
        }
        
        $("#related_files_body").append(related_files_body)

        
        $("#rfq_number").html(formatRfqNo(data["request_quotation_number"]));
        $("#purchase_requisition_id").val(data.purchase_requisition["id"]);
        $("#purchase_requisition_number").val(formatPurchaseRequestNo(data.purchase_requisition["purchase_requisition_number"]));


        
        $("#request_quotation_id").val(data["id"]);
        $("#prepared_by").val(
          data.u_created_by["first_name"] + " " + data.u_created_by["last_name"]
        );
        $("#due_date").val(moment(data["due_date"]).format("MMMM D, YYYY"));
        $("#message").val(data["message"]);
        $("#budget").val(data.purchase_requisition["given_budget"]);
        $("#quotation_code").val(data["quotation_code"]);

        // $("#view_tor_background").html(data.terms_of_reference["background"]);
        // $("#view_tor_objectives").html(data.terms_of_reference["objective"]);

        // $("#view_tor_scope_of_sevices").html(
        //   data.terms_of_reference["scope_of_service"]
        // );
        // $("#view_tor_qualifications").html(
        //   data.terms_of_reference["qualifications"]
        // );
        
        // $("#view_tor_reporting_arrangemnets").html(
        //   data.terms_of_reference["reporting_and_working_arrangements"]
        // );
        // $("#view_tor_deliverables").append(
        //   data.terms_of_reference["tor_deliverables"]
        // );

        // $("#view_technical_specs").append(
        //   data.terms_of_reference["tor_annex_technical_specifications"]
        // );
        // $("#view_evaluation_criteria").append(
        //   data.terms_of_reference["tor_annex_key_experts"]
        // );
        // $("#view_drenumeration_payment").append(
        //   data.terms_of_reference["tor_annex_deliverables"]
        // );
        // $("#view_terms_conditions").append(
        //   data.terms_of_reference["tor_annex_terms_conditions"]
        // );

        // $("#user_type_id").val(data.user_type["id"]).trigger("change");

        // setTimeout(() => {
        // 	$("#section_id").val(data.data["section_id"]).trigger("change");
        // }, 1500);

        // if data is for viewing only

      } else {
        notification("error", "Error!", data.message);
      }
    },
    error: function (data) {},
  });
};

// 		action = show, hide
formReset = (action = "hide") => {
  $("html, body").animate({ scrollTop: 0 }, "slow");

  if (action == "hide") {
    // hide and clear form
    //  total = 0;
    $("#uuid").val("");
    $("#div_form").hide();
    window.stepper = new Stepper(document.querySelector(".bs-stepper"));

  } else if (action == "show") {
    // show
    $("#div_form").show();
    $("#view_tor_deliverables").empty();

    $("#view_technical_specs").empty();
    $("#view_evaluation_criteria").empty();
    $("#view_drenumeration_payment").empty();
    $("#view_terms_conditions").empty();
    $("#form_id input, select, textarea").prop("disabled", false);
    $("#form_id button").prop("disabled", false);
    window.stepper = new Stepper(document.querySelector(".bs-stepper"));

  }
};

changeStatus = (type) => {
  $("#modal-approval").modal("show");
  if (type == 0) {
    $("#approve").hide();
    $("#reject").show();
    $(".reason-row").hide();
    $("#approver").html("Rejected by");
  } else {
    $("#approve").show();
    $("#reject").hide();
    $(".reason-row").show();
    $("#approver").html("Approve by");
  }
};

// changeStatus = () => {
//   console.log(
//     apiURL +
//       "request-quotation/update_status/" +
//       $("#request_quotation_id").val()
//   );
//   $.ajax({
//     url:
//       apiURL +
//       "request-quotation/update_status/" +
//       $("#request_quotation_id").val(),
//     type: "PUT",
//     dataType: "json",
//     contentType: "application/json",

//     data: JSON.stringify({
//       status: "Approved",
//     }),
//     success: function (data) {
//       console.log(data)
//       notification("success", "Success!", "RFQ Approved");
//       formReset("hide");
//       $.ajax({
//         url:
//           apiURL +
//           "vendor-audit-trail",
//         type: "POST",
//         dataType: "json",
//         contentType: "application/json",
    
//         data: JSON.stringify({
//           crud: "Update Status",
//           table:"request_quotation",
//           payload:JSON.stringify(data),
//           client_ip:localStorage.getItem("CLIENT_IP"),
//           vendor_id:data.vendor_id,
//         }),
//         success: function (data) {
      
//         },
//         error: function ({ responseJSON }) {},
//       });

//       loadTable();
//     },
//     error: function ({ responseJSON }) {},
//   });
//   $("#changeStatus").attr("data-dismiss", "modal");
// };
