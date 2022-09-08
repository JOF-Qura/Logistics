const formDataDetail = {};
const formData = {};
bidding_items_id = [];

$(function () {
  // initialized select2
  $(".select2").select2();
  // load datatable
  loadTable();
  loadPrdTable();
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
  console.log();
  $("#data-table").dataTable().fnClearTable();
  $("#data-table").dataTable().fnDraw();
  $("#data-table").dataTable().fnDestroy();
  $("#data-table").DataTable({
    ajax: {
      url:
        apiURL +
        "request-quotation/vendor/" +
        localStorage.getItem("ID") +
        "/procure_of_products/all",
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
          return formatRfqNo(aData.RequestQuotation.request_quotation_number);
        },
      },

      {
        data: "RequestQuotation.prepared_by",
        name: "RequestQuotation.prepared_by",
        searchable: true,
        width: "10%",
      },
      {
        data: "RequestQuotation.message",
        name: "RequestQuotation.message",
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
            moment(aData.RequestQuotation["due_date"]).format("MMMM D, YYYY") +
            "<br>" +
            "<em class='text-secondary'>" +
            moment(aData.RequestQuotation["due_date"]).fromNow() +
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
          if (aData.RequestQuotationVendor.rfq_status === "Pending") {
            let status =
              '<label class="text-left badge badge-warning p-2 w-100"> ' +
              aData.RequestQuotationVendor.rfq_status +
              "</label> ";
            return status;
          } else if (aData.RequestQuotationVendor.rfq_status === "Approved") {
            let status =
              '<label class="text-left badge badge-primary p-2 w-100"> ' +
              aData.RequestQuotationVendor.rfq_status +
              "</label> ";
            return status;
          } else {
            let status =
              '<label class="text-left badge badge-danger p-2 w-100"> ' +
              aData.RequestQuotationVendor.rfq_status +
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
            aData.RequestQuotation["id"] +
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
  if ($("#purchase_requisition_id").val() != null) {
    console.log($("#purchase_requisition_id").val());
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
      url:
        apiURL + "purchase-requisition/" + $("#purchase_requisition_id").val(),
      type: "GET",
      dataType: "json",
      success: function (data) {
        console.log(data)
        if (data) {
          $("#pr_number").html(
            formatPurchaseRequestNo(data["purchase_requisition_number"])
          );
          $("#status").html(data["status"]);
          $("#department").html(data.u_created_by.employees.department["department_name"]);
          $("#requested_by").html(data.u_created_by["first_name"]);
          $("#purpose").html(data["purpose"]);
          $("#date_requested").html(
            moment(data["date_requested"]).format("MMMM D, YYYY")
          );

          prd_table.clear().draw();

          for (var pr_item in data.purchase_requisition_detail) {
            if (data.purchase_requisition_detail[pr_item].product_id === null && data.purchase_requisition_detail[pr_item].supply_id === null) {
              prd_table.row
                .add([
                  data.purchase_requisition_detail[pr_item].new_category,
                  data.purchase_requisition_detail[pr_item].new_product_name,
                  data.purchase_requisition_detail[pr_item].quantity,
                ])
                .draw();
            } else if(data.purchase_requisition_detail[pr_item].supply_id != null){
              prd_table.row
                .add([
                  data.purchase_requisition_detail[pr_item].supply.category
                    .category_name,
                  data.purchase_requisition_detail[pr_item].supply
                    .supply_name,
                  data.purchase_requisition_detail[pr_item].quantity,
                ])
                .draw();
            } else if (data.purchase_requisition_detail[pr_item].product_id != null && data.purchase_requisition_detail[pr_item].supply_id === null) {
              prd_table.row
                .add([
                  data.purchase_requisition_detail[pr_item].product.category
                    .category_name,
                  data.purchase_requisition_detail[pr_item].product
                    .product_name,
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

loadPrdTable = () =>{

  $("#pr-detail-table").dataTable().fnClearTable();
  $("#pr-detail-table").dataTable().fnDraw();
  $("#pr-detail-table").dataTable().fnDestroy();
  prd_table = $("#pr-detail-table").DataTable({
    info: false,
    paging: false,
    searching: false,
    ordering: false,
  });
}


showFileModal = (existed_file) => {
  $("#display_file").attr("src", "");

  $("#display_file").attr(
    "src",
    apiURL + "related-documents/related-file/" + existed_file
  );
};

// function to show details for viewing/updating
editData = (id, type) => {
  $.ajax({
    url: apiURL + "request-quotation/vendor/"+localStorage.getItem("ID") +"/"+ id,
    type: "GET",
    dataType: "json",
    success: function (data) {
      if (data) {
        console.log(data)
        if (data["temp_rfq_status"] == "Pending") {
          $("#approve_rfq").show();
          $("#reject_rfq").show();
        } else {
          $("#approve_rfq").hide();
          $("#reject_rfq").hide();
        }
        formReset("show");

        $("#related_files_body").empty();
        let related_files_body = "";
        if(data.related_documents.length >0){

          for (let i in data.related_documents) {
           
            related_files_body +=
              "<div >" +
              "<li>" +
              '<a href="#modal-file" data-toggle="modal" onClick="return showFileModal(\'' +
              data.related_documents[i].attachment +
              '\')" data-id="' +
              data.related_documents[i].attachment +
              '" class="btn-link text-dark"><i class="far fa-fw fa-file-word"></i> ' +
              data.related_documents[i].attachment +
              "</a>" +
              "</li></div>";
          }
        }
        else{
          related_files_body +=
          "<div >" +
          "<li>" + "<i>No attachment</i>"
          "</li></div>";
        }

        $("#related_files_body").append(related_files_body);

        $("#rfq_number").html(formatRfqNo(data["request_quotation_number"]));
        $("#purchase_requisition_id").val(data.purchase_requisition_id);
        $("#purchase_requisition_number").val(formatPurchaseRequestNo(data.purchase_requisition.purchase_requisition_number));

        
        $("#request_quotation_id").val(data["id"]);
        $("#prepared_by").val(
          data["prepared_by"]
        );
        $("#due_date").val(moment(data["due_date"]).format("MMMM D, YYYY"));
        $("#message").empty()
        $("#message").append(data["message"]);
        $("#budget").val(data.purchase_requisition["given_budget"]);
        $("#quotation_code").val(data["quotation_code"]);


        prd_table.clear().draw();

        for (var pr_item in data.purchase_requisition.purchase_requisition_detail) {
          if (data.purchase_requisition.purchase_requisition_detail[pr_item].product_id === null && data.purchase_requisition.purchase_requisition_detail[pr_item].supply_id === null) {
            prd_table.row
              .add([
                data.purchase_requisition.purchase_requisition_detail[pr_item].new_category,
                data.purchase_requisition.purchase_requisition_detail[pr_item].new_product_name,
                data.purchase_requisition.purchase_requisition_detail[pr_item].description,
                "\u20B1" + numberWithCommas(data.purchase_requisition.purchase_requisition_detail[pr_item].estimated_price),
                data.purchase_requisition.purchase_requisition_detail[pr_item].quantity,
                "\u20B1" + numberWithCommas(data.purchase_requisition.purchase_requisition_detail[pr_item].quantity * data.purchase_requisition.purchase_requisition_detail[pr_item].estimated_price),


              ])
              .draw();
          } else if(data.purchase_requisition.purchase_requisition_detail[pr_item].supply_id != null) {
            prd_table.row
              .add([
                data.purchase_requisition.purchase_requisition_detail[pr_item].supply.category
                  .category_name,
                data.purchase_requisition.purchase_requisition_detail[pr_item].supply
                  .product_name,
                data.purchase_requisition.purchase_requisition_detail[pr_item].supply.description,
                "\u20B1" + numberWithCommas(data.purchase_requisition.purchase_requisition_detail[pr_item].supply.estimated_price),

                data.purchase_requisition.purchase_requisition_detail[pr_item].quantity,
                "\u20B1" + numberWithCommas(data.purchase_requisition.purchase_requisition_detail[pr_item].quantity * data.purchase_requisition.purchase_requisition_detail[pr_item].supply.estimated_price),

              ])
              .draw();
          }else if (data.purchase_requisition.purchase_requisition_detail[pr_item].product_id != null && data.purchase_requisition.purchase_requisition_detail[pr_item].supply_id === null){
            prd_table.row
              .add([
                data.purchase_requisition.purchase_requisition_detail[pr_item].product.category
                  .category_name,
                data.purchase_requisition.purchase_requisition_detail[pr_item].product
                  .product_name,
                data.purchase_requisition.purchase_requisition_detail[pr_item].product.description,
                "\u20B1" + numberWithCommas(data.purchase_requisition.purchase_requisition_detail[pr_item].product.estimated_price),

                data.purchase_requisition.purchase_requisition_detail[pr_item].quantity,
                "\u20B1" + numberWithCommas(data.purchase_requisition.purchase_requisition_detail[pr_item].quantity * data.purchase_requisition.purchase_requisition_detail[pr_item].product.estimated_price),

              ])
              .draw();
          }
        }


        // if data is for viewing only
        if (type == 0) {
          // $("#form_id input, select, textarea").prop("disabled", true);

          $(".send-email").hide();
          $(".print").hide();
        } else if (type == 1) {
          // $("#form_id input, select, textarea").prop("disabled", true);

          $(".modal-title").html("Print RFQ");

          $(".print").show();
          $(".send-email").hide();
        } else {
          $("#form_id input, select, textarea").prop("disabled", false);
          $(".send-email").show();
          $(".modal-title").html("Update RFQ");
          $(".print").hide();
        }
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
  }
};

var formStatus = ""
changeStatusModal = (type) => {
  $("#modal-approval").modal("show");
  if (type == 0) {
    formStatus = "Rejected" 
    $("#approve").hide();
    $("#reject").show();
    $(".reason-row").show();

    $("#approver_label").html("Rejected by");
  } else {
    formStatus = "Approved" 

    $("#approve").show();
    $("#reject").hide();
    $(".reason-row").hide();
    $("#approver_label").html("Approve by");
  }
};

changeStatus = () => {
  if ($("#approver").val() == "") {
    notification("error", "Error!", "Please insert your name");
  
  } else {
    if (formStatus == "Rejected") {
      if ($("#reason").val() == "") {
        notification("error", "Error!", "Please insert a reason");
      console.log("wew")
      }else{
        approval_ajax();
      }
    
    }
    else{
      approval_ajax();
    }
   
  }
  $("#modal-approval").modal("hide");
};




approval_ajax = () =>{
  $.ajax({
    url:
      apiURL +
      "rfq-vendor/" +
      $("#request_quotation_id").val()+"/"+localStorage.getItem("ID"),
    type: "PUT",
    dataType: "json",
    contentType: "application/json",

    data: JSON.stringify({
      rfq_status: formStatus,
      approver_name: $("#approver").val(),

      reject_reason: $("#reason").val(),
    }),
    success: function (data) {
      console.log(data);
      if (formStatus == "Approved") {
        notification("success", "Success!", "RFQ Approved");
      } else {
        notification("success", "Success!", "RFQ Rejected");
      }
      formReset("hide");
      delete data.id
      delete data.vendor_id
      delete data.request_quotation_id
      delete data.rfq_pr_id
      delete data.rfq_tor_id
      delete data.created_by
      delete data.updated_by

      $.ajax({
        url: apiURL + "vendor-audit-trail",
        type: "POST",
        dataType: "json",
        contentType: "application/json",

        data: JSON.stringify({
          crud: "Update Status",
          table: "request_quotation_vendor",
          payload: JSON.stringify(data),
          client_ip: localStorage.getItem("CLIENT_IP"),
          vendor_id: localStorage.getItem("ID"),
        }),
        success: function (data) {},
        error: function ({ responseJSON }) {},
      });

      loadTable();
    },
    error: function ({ responseJSON }) {},
  }); 
}