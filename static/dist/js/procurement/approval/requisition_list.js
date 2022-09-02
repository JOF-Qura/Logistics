$(function () {
  // hide form
  formReset("hide");

  // load datatable
  loadTable();

  // load datatable of pendings
  loadTablePending();

  // load datatable of approved
  loadTableApproved();

  // load datatable of rejected
  loadTableRejected();

  // load purchase requisition items table
  pr_detail_table();
});



// all request status datatable
loadTable = () => {
  $.ajaxSetup({
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
  });
  // '+status+'
  $("#data-table-all").dataTable().fnClearTable();
  $("#data-table-all").dataTable().fnDraw();
  $("#data-table-all").dataTable().fnDestroy();
  $("#data-table-all").DataTable({
    ajax: { url: apiURL + "purchase-requisition/", dataSrc: "" },

    responsive: true,
    serverSide: false,
    dataType: "json",
    type: "GET",
    columns: [
      {
        data: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {
          return formatPurchaseRequestNo(aData.purchase_requisition_number);
        },
      },
      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {
          // return aData.u_created_by.employees.first_name +" "+aData.u_created_by.employees.last_name;
          return "name";
        },
      },

      {
        data: "purpose",
        name: "purpose",
        searchable: true,
        width: "30%",
   
      },

      {
        data: null,
        name: null,
        searchable: true,
        width: "20%",
        render: function (aData, type, row) {
          return moment(aData["created_at"]).format("MMMM D, YYYY");
        },
      },
      {
        data: null,
        name: null,
        searchable: true,
        width: "20%",
        render: function (aData, type, row) {
          if (aData.status === "Pending") {
            let status =
              '<label class="text-left badge badge-warning p-2 w-100" > ' +
              aData.status +
              "</label> ";
            return status;
          } else if (aData.status === "Approved") {
            let status =
              '<label class="text-left badge badge-primary p-2 w-100" > ' +
              aData.status +
              "</label> ";
            return status;
          } else {
            let status =
              '<label class="text-left badge badge-danger p-2 w-100" > ' +
              aData.status +
              "</label> ";
            return status;
          }
        },
      },
      {
        data: null,
        width: "20%",
        render: function (aData, type, row) {
          let buttons = "";
          buttons +=
            '<div class="text center dropdown"><div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
            '<i class="fas fa-ellipsis-v"></i></div><div class="dropdown-menu dropdown-menu-right">';
          //view
          buttons +=
            '<div class="dropdown-item d-flex role="button" onClick="return dataInfo(\'' +
            aData["id"] +
            "',0)\">" +
            '<div style="width: 2rem"> <i class= "fas fa-file-alt mr-1"></i></div>' +
            "<div> View</div></div>";
          if (aData.status == "Pending" ) {
            //approve
            buttons +=
              '<div class="dropdown-item d-flex role="button" onClick="return approvalData(\'' +
              aData["id"] +
              "',1)\">" +
              '<div style="width: 2rem"> <i class= "fas fa-check mr-1"></i></div>' +
              "<div> Approve</div></div>";
            //reject
            buttons +=
              '<div class="dropdown-item d-flex role="button" onClick="return approvalData(\'' +
              aData["id"] +
              "',2)\">" +
              '<div style="width: 2rem"> <i class= "fas fa-times mr-1"></i></div>' +
              "<div> Reject</div></div>";
          }
          buttons += "</div></div>";

          return buttons; // same class in i element removed it from a element
        },
      },
    ],
  });
};

// all pending request datatable
loadTablePending = () => {
  $.ajaxSetup({
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
  });
  // '+status+'
  $("#data-table-pending").dataTable().fnClearTable();
  $("#data-table-pending").dataTable().fnDraw();
  $("#data-table-pending").dataTable().fnDestroy();
  $("#data-table-pending").DataTable({
    ajax: { url: apiURL + "purchase-requisition/pending/none", dataSrc: "" },

    responsive: true,
    serverSide: false,
    dataType: "json",
    type: "GET",
    columns: [
      {
        data: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {
          return formatPurchaseRequestNo(aData.purchase_requisition_number);
        },
      },
      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {
          // return aData.u_created_by.employees.first_name +" "+aData.u_created_by.employees.last_name;
          return "name"
        },
      },

      {
        data: "purpose",
        name: "purpose",
        searchable: true,
        width: "30%",
   
      },

      {
        data: null,
        name: null,
        searchable: true,
        width: "20%",
        render: function (aData, type, row) {
          return moment(aData["created_at"]).format("MMMM D, YYYY");
        },
      },
      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {
          if (aData.status === "Pending") {
            let status =
              '<label class="text-left badge badge-warning p-2 w-100" > ' +
              aData.status +
              "</label> ";
            return status;
          } else if (aData.status === "Approved") {
            let status =
              '<label class="text-left badge badge-primary p-2 w-100" > ' +
              aData.status +
              "</label> ";
            return status;
          } else {
            let status =
              '<label class="text-left badge badge-danger p-2 w-100" > ' +
              aData.status +
              "</label> ";
            return status;
          }
        },
      },
      {
        data: null,
        width: "20%",
        render: function (aData, type, row) {
          let buttons = "";
          // info
          buttons +=
            '<div class="text center dropdown"><div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
            '<i class="fas fa-ellipsis-v"></i></div><div class="dropdown-menu dropdown-menu-right">' +
            //view
            '<div class="dropdown-item d-flex role="button" onClick="return dataInfo(\'' +
            aData["id"] +
            "',0)\">" +
            '<div style="width: 2rem"> <i class= "fas fa-file-alt mr-1"></i></div>' +
            "<div> View</div></div>" +
            //approve
            '<div class="dropdown-item d-flex role="button" onClick="return approvalData(\'' +
            aData["id"] +
            "',1)\">" +
            '<div style="width: 2rem"> <i class= "fas fa-check mr-1"></i></div>' +
            "<div> Approve</div></div>" +
            //reject
            '<div class="dropdown-item d-flex role="button" onClick="return approvalData(\'' +
            aData["id"] +
            "',2)\">" +
            '<div style="width: 2rem"> <i class= "fas fa-times mr-1"></i></div>' +
            "<div> Reject</div></div>" +
            "</div></div>";

          return buttons; // same class in i element removed it from a element
        },
      },
    ],
  });
};

// all approved request datatable
loadTableApproved = () => {
  $.ajaxSetup({
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
  });
  // '+status+'
  $("#data-table-approved").dataTable().fnClearTable();
  $("#data-table-approved").dataTable().fnDraw();
  $("#data-table-approved").dataTable().fnDestroy();
  $("#data-table-approved").DataTable({
    ajax: { url: apiURL + "purchase-requisition/approved/none", dataSrc: "" },

    responsive: true,
    serverSide: false,
    dataType: "json",
    type: "GET",
    columns: [
      {
        data: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {
          return formatPurchaseRequestNo(aData.purchase_requisition_number);
        },
      },
      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {
          // return aData.u_created_by.employees.first_name +" "+aData.u_created_by.employees.last_name;
          return "name";
        },
      },

      {
        data: "purpose",
        name: "purpose",
        searchable: true,
        width: "30%",
   
      },

      {
        data: null,
        name: null,
        searchable: true,
        width: "20%",
        render: function (aData, type, row) {
          return moment(aData["created_at"]).format("MMMM D, YYYY");
        },
      },
      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {

            let status =
              '<label class="text-left badge badge-primary p-2 w-100" > ' +
              aData.status +
              "</label> ";
            return status;
       
        },
      },
      {
        data: null,
        width: "20%",
        render: function (aData, type, row) {
          let buttons = "";
          // info
          buttons +=
            '<div class="text center dropdown"><div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
            '<i class="fas fa-ellipsis-v"></i></div><div class="dropdown-menu dropdown-menu-right">';
          //view
          buttons +=
            '<div class="dropdown-item d-flex role="button" onClick="return dataInfo(\'' +
            aData["id"] +
            "',0)\">" +
            '<div style="width: 2rem"> <i class= "fas fa-file-alt mr-1"></i></div>' +
            "<div> View</div></div>";
     
          buttons += "</div></div>";

          return buttons; // same class in i element removed it from a element
        },
      },
    ],
  });
};

// all rejected request datatable
loadTableRejected = () => {
  $.ajaxSetup({
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
  });
  // '+status+'
  $("#data-table-rejected").dataTable().fnClearTable();
  $("#data-table-rejected").dataTable().fnDraw();
  $("#data-table-rejected").dataTable().fnDestroy();
  $("#data-table-rejected").DataTable({
    ajax: { url: apiURL + "purchase-requisition/rejected/none", dataSrc: "" },

    responsive: true,
    serverSide: false,
    dataType: "json",
    type: "GET",
    columns: [
      {
        data: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {
          return formatPurchaseRequestNo(aData.purchase_requisition_number);
        },
      },
      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {
          // return aData.u_created_by.employees.first_name +" "+aData.u_created_by.employees.last_name;
          return "name"
        },
      },

      {
        data: "purpose",
        name: "purpose",
        searchable: true,
        width: "30%",
   
      },

      {
        data: null,
        name: null,
        searchable: true,
        width: "20%",
        render: function (aData, type, row) {
          return moment(aData["created_at"]).format("MMMM D, YYYY");
        },
      },
      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {

            let status =
              '<label class="text-left badge badge-danger p-2 w-100" > ' +
              aData.status +
              "</label> ";
            return status;
          
        },
      },
      {
        data: null,
        width: "20%",
        render: function (aData, type, row) {
          let buttons = "";
          // info
          buttons +=
            '<div class="text center dropdown"><div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
            '<i class="fas fa-ellipsis-v"></i></div><div class="dropdown-menu dropdown-menu-right">' +
            //view
            '<div class="dropdown-item d-flex role="button" onClick="return dataInfo(\'' +
            aData["id"] +
            "',0)\">" +
            '<div style="width: 2rem"> <i class= "fas fa-file-alt mr-1"></i></div>' +
            "<div> View</div></div>" +
            //print
            // '<div class="dropdown-item d-flex role="button" onClick="return dataInfo(\'' +
            // aData["id"] +
            // "',1)\">" +
            // '<div style="width: 2rem"> <i class= "fas fa-print mr-1"></i></div>' +
            // "<div> Print</div></div>" +
            //approve
       
            "</div></div>";
          return buttons; // same class in i element removed it from a element
        },
      },
    ],
  });
};

// load purchase requisitions
dataInfo = (id, type) => {
 

  //   console.log(id);
  $.ajax({
    url: apiURL + "purchase-requisition/" + id,
    type: "GET",
    dataType: "json",
    success: function (data) {
      console.log(data.purchase_requisition_detail)
      if (data) {
        console.log(data);


        let visibility = "";
        if(data.status == "Pending"){
          $('.approval_button').show()
          visibility = "d-flex";
        }
        else{
          $('.approval_button').hide()
          visibility = "d-none";

        }
        formReset("show");
        $("#pr_number").html(
          formatPurchaseRequestNo(data["purchase_requisition_number"])
        );

        $("#pr_uuid").val(data["id"]);
        $("#status").html(data["status"]);
        // $("#department").html(data.u_created_by.employees.department["department_name"]);
        $("#department").html("dept name");

        // $("#requested_by").html(data.u_created_by.employees["first_name"] + " "+data.u_created_by.employees["last_name"] );
        $("#requested_by").html("name");

        $("#purpose").html(data["purpose"]);
        $("#message").html(data["message"]);
        $("#estimated_total").html( "\u20B1" +numberWithCommas(data["estimated_amount"]));


        $("#created_at").html(
          moment(data["created_at"]).format("MMMM D, YYYY")
        );
        // console.log(data.purchase_requisition_detail[0].item.item_name)
        // console.log(data.purchase_requisition_detail[0].item.item_category.category_name)
        prd_table.clear().draw();

        let bg_color = "";
        let fas_status = "";
        let status_text = "";

        // Loop here
        for (let pr_item in data.purchase_requisition_detail) {
          console.log(data.purchase_requisition_detail[pr_item])
          if (data.purchase_requisition_detail[pr_item].status == "active") {
            bg_color = "primary";
            fas_status = "trash";
            status_text = "Remove";
           

          } else {
            bg_color = "danger";
            fas_status = "redo";
            status_text = "Reactivate";
         

          }

          if (data.purchase_requisition_detail[pr_item].product_id === null && data.purchase_requisition_detail[pr_item].supply_id === null) {
            console.log("Dito PRODUCT ID wala")
            prd_table.row
              .add([
                data.purchase_requisition_detail[pr_item].new_category,
                data.purchase_requisition_detail[pr_item].new_product_name,
                "\u20B1" +numberWithCommas(data.purchase_requisition_detail[pr_item].estimated_price),
                data.purchase_requisition_detail[pr_item].quantity,
                "\u20B1" +numberWithCommas(data.purchase_requisition_detail[pr_item].estimated_price * data.purchase_requisition_detail[pr_item].quantity),
                
                '<label class="text-left badge badge-'+bg_color+' p-2 w-100" >' +
                data.purchase_requisition_detail[pr_item].status +
                '</label>',
              

                // actions
                '<div class="text center dropdown"> <div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
                  '<i class="fas fa-ellipsis-v"></i></div> <div class="dropdown-menu dropdown-menu-right">' +
                  // // view
                  '<div class="dropdown-item d-flex" role="button" data-toggle="modal" onClick="return editPrDetail( \'' +
                  data.purchase_requisition_detail[pr_item].id +
                  '\');"><div style="width: 2rem"> <i class="fas fa-eye mr-1"></i></div><div> View</div></div>' +

                  // remove
                  '<div class="dropdown-item '+visibility+'" role="button" data-toggle="modal" onClick="return removePrDetail(this.parentNode.parentNode.parentNode.parentNode, \'' +
                  data.id +
                  "', '" +
                  data.purchase_requisition_detail[pr_item].id +
                  "', '" +
                  data.purchase_requisition_detail[pr_item].status +
                  '\');"><div style="width: 2rem"> <i class="fas fa-' +
                  fas_status +
                  ' mr-1"></i></div><div>' +
                  status_text +
                  "</div></div>" +
                  
                  "</div></div>",
              ])
              .draw();
          } else if (data.purchase_requisition_detail[pr_item].supply_id != null) {
            console.log("Dito Supply ID meron")
            prd_table.row
              .add([
                data.purchase_requisition_detail[pr_item].supply.category
                  .category_name,
                data.purchase_requisition_detail[pr_item].supply.product_name,
                "\u20B1" +numberWithCommas(data.purchase_requisition_detail[pr_item].supply
                  .estimated_price),

                data.purchase_requisition_detail[pr_item].quantity,
                "\u20B1" +numberWithCommas(data.purchase_requisition_detail[pr_item].supply
                .estimated_price *  data.purchase_requisition_detail[pr_item].quantity),
                '<label class="text-left badge badge-'+bg_color+' p-2 w-100" >' +
                data.purchase_requisition_detail[pr_item].status +
                '</label>',

                //action
                '<div class="text center dropdown"> <div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
                  '<i class="fas fa-ellipsis-v"></i></div> <div class="dropdown-menu dropdown-menu-right">' +
                  // // view
                  '<div class="dropdown-item d-flex" role="button" data-toggle="modal" onClick="return editPrDetail( \'' +
                  data.purchase_requisition_detail[pr_item].id +
                  '\');"><div style="width: 2rem"> <i class="fas fa-eye mr-1"></i></div><div> View</div></div>' +
                  // remove
                  '<div class="dropdown-item '+visibility+'" role="button" data-toggle="modal" onClick="return removePrDetail(this.parentNode.parentNode.parentNode.parentNode, \'' +
                  data.id +
                  "', '" +
                  data.purchase_requisition_detail[pr_item].id +
                  "', '" +
                  data.purchase_requisition_detail[pr_item].status +
                  '\');"><div style="width: 2rem"> <i class="fas fa-' +
                  fas_status +
                  ' mr-1"></i></div><div>' +
                  status_text +
                  "</div></div>" +
                  "</div></div>",
              ])
              .draw();
          }else if (data.purchase_requisition_detail[pr_item].product_id != null && data.purchase_requisition_detail[pr_item].supply_id === null) {
            console.log("Dito PRODUCT ID at SUPPLY ID wala")
            prd_table.row
              .add([
                data.purchase_requisition_detail[pr_item].product.category
                  .category_name,
                data.purchase_requisition_detail[pr_item].product.product_name,
                "\u20B1" +numberWithCommas(data.purchase_requisition_detail[pr_item].product
                  .estimated_price),

                data.purchase_requisition_detail[pr_item].quantity,
                "\u20B1" +numberWithCommas(data.purchase_requisition_detail[pr_item].product
                .estimated_price *  data.purchase_requisition_detail[pr_item].quantity),
                '<label class="text-left badge badge-'+bg_color+' p-2 w-100" >' +
                data.purchase_requisition_detail[pr_item].status +
                '</label>',

                //action
                '<div class="text center dropdown"> <div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
                  '<i class="fas fa-ellipsis-v"></i></div> <div class="dropdown-menu dropdown-menu-right">' +
                  // // view
                  '<div class="dropdown-item d-flex" role="button" data-toggle="modal" onClick="return editPrDetail( \'' +
                  data.purchase_requisition_detail[pr_item].id +
                  '\');"><div style="width: 2rem"> <i class="fas fa-eye mr-1"></i></div><div> View</div></div>' +
                  // remove
                  '<div class="dropdown-item '+visibility+'" role="button" data-toggle="modal" onClick="return removePrDetail(this.parentNode.parentNode.parentNode.parentNode, \'' +
                  data.id +
                  "', '" +
                  data.purchase_requisition_detail[pr_item].id +
                  "', '" +
                  data.purchase_requisition_detail[pr_item].status +
                  '\');"><div style="width: 2rem"> <i class="fas fa-' +
                  fas_status +
                  ' mr-1"></i></div><div>' +
                  status_text +
                  "</div></div>" +
                  "</div></div>",
              ])
              .draw();
          }
        }

        if (type == 0) {
          $(".print").hide();
        } else {
          $(".print").show();
        }
      } else {
        notification("error", "Error!", data.detail);

        console.log("error" + data);
        loadTable();
      }
    },
    error: function ({ responseJSON }) {},
  });
};

// purchase requisition items table
pr_detail_table = () => {
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

// change status of purchase requisition
const formApproval = {};
approvalData = (id, type) => {
  $(".is-invalid").removeClass("is-invalid");
  $(".is-valid").removeClass("is-valid");
  if (type == 1) {
    $("#reason").val("");

    $("#modal-default").modal("show");
    $(".modal-title").html(
      '<i class="text-secondary fas fa-exclamation-triangle mr-2"></i>' +
        "Approve Purchase Request"
    );
    $("#reject").hide();
    $(".budget-row").show();

    $(".reason-row").hide();
    $("#approve").show();
    $("#approved_by").val(
      // sessionStorage.getItem("FIRSTNAME") + " " + sessionStorage.getItem("LASTNAME")
      "approver name"
    ); //should be foreign key to users
    // $("#approved_by").val();
    $("#uuid").val(id);
    formApproval["status"] = "Approved";
  } else {
    $(".budget-row").hide();
    $("#given_budget").val("");
    $("#modal-default").modal("show");
    $(".modal-title").html(
      '<i class="text-secondary fas fa-exclamation-triangle mr-2"></i>' +
        "Reject Purchase Request"
    );
    $("#approved_by").val(
      // sessionStorage.getItem("FIRSTNAME") + " " + sessionStorage.getItem("LASTNAME")
      "approver name"
      ); 

    $("#approve").hide();
    $(".reason-row").show();
    $("#reject").show();

    $("#uuid").val(id);
    $("#approved_by").val();
    console.log("reject");
    formApproval["status"] = "Rejected";
  }

  $("#form_id")
    .on("submit", function (e) {
      e.preventDefault();
      // trimInputFields();
    })
    .validate({
      rules: {
        // simple rule, converted to {required:true}
        reason: {
          required: true,
        },
        given_budget: {
          required: true,
        },
      },
      messages: {
        reason: {
          required: "please provide a reason",
        },
        given_budget: {
          required: "please provide a budget",
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
        formApproval["approved_by"] = $("#approved_by").val();
        formApproval["reason"] = $("#reason").val();
        if(formApproval["status"] != "Approved"){
          formApproval["given_budget"] = 0;
        }
        else{
          formApproval["given_budget"] = $("#given_budget").val();

        }
        
        $.ajax({
          // url: apiURL + "workflow-approval/",
          url: apiURL + "purchase-requisition/status/" + $("#uuid").val(),

          type: "PUT",
          contentType: "application/json",
          data: JSON.stringify({
            approved_by: formApproval["approved_by"],
            reason: formApproval["reason"],
            given_budget: formApproval["given_budget"],
            status: formApproval["status"],
          }),
          dataType: "json",
          processData: false,
          cache: false,
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("TOKEN"),
          },
          success: function (data) {
            if (data) {
              if (formApproval["status"] == "Approved") {
                notification("success", "Success", "Purchase Requisition Approved");
                console.log(data)
                $.ajax({
                  url: apiURL + "budget-plan/"+data.given_budget+"/0/"+new Date().getFullYear()+"/"+data.department_id,
                  type: "PUT",
                  // data: form_data,
                  contentType: "application/json",
        
                  
                  // contentType: false,
                  processData: false,
                  cache: false,
                  headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + sessionStorage.getItem("TOKEN"),
                  },
                  success: function (data) {
                
                  },
                  error: function ({ responseJSON }) {
                    // console.log(responseJSON.detail);
                  },
                });
              } else {
                notification("info","Success", "Purchase Requisition Rejected");
              }
              $("#modal-default").modal("hide");
              formReset("hide");
              loadTable();
              loadTablePending();
              loadTableApproved();
              loadTableRejected();
            } else {
              $("#modal-default").modal("hide");

              notification("error", "Error!", "Error approving PR");

              console.log("error");
            }
          },
          error: function ({ responseJSON }) {
            notification("error", "Error!", responseJSON.detail);

            console.log(responseJSON.detail);
          },
        });
      },
    });
};

// 	hide, show form
formReset = (action = "hide") => {
  $("html, body").animate({ scrollTop: 0 }, "slow");

  if (action == "hide") {
    $("#div_form").hide();
  } else if (action == "show") {
    // show
    $("#div_form").show();

    $("#form_id input, select, textarea").prop("disabled", false);
    $("#form_id button").prop("disabled", false);
  }
};


// edit purchase requisition items
editPrDetail = (id, tr) => {
  $(".is-invalid").removeClass("is-invalid");
  $(".is-valid").removeClass("is-valid");
  $('.modal-title').text("View Product")
  $.ajax({
    url: apiURL + "purchase-requisition-detail/" + id,
    type: "GET",
    dataType: "json",
    success: function (data) {
      $("#modal-product").modal("show");

      if (data) {
        console.log(data);
        if (data["product_id"] == null && data["supply_id"] == null) {
          $("#item_uuid").val(data["id"]);
          $("#item_category").val(data["new_category"]);
          $("#item_name").val(data["new_product_name"]);
          $("#estimated_price").val( "\u20B1" +numberWithCommas(data["estimated_price"]));

          $("#item_description").val(data["description"]);
          $("#item_quantity").val(data["quantity"]);
        } else if (data["supply_id"] != null) {
          $("#item_uuid").val(data["id"]);
          $("#item_category").val(data.supply.category["category_name"]);
          $("#item_name").val(data.supply["product_name"]);
          $("#estimated_price").val( "\u20B1" +numberWithCommas(data.supply["estimated_price"]));

          $("#item_description").val(data.supply["description"]);
          $("#item_quantity").val(data["quantity"]);
        } else if (data["product_id"] != null && data["supply_id"] == null) {
          $("#item_uuid").val(data["id"]);
          $("#item_category").val(data.product.category["category_name"]);
          $("#item_name").val(data.product["product_name"]);
          $("#estimated_price").val( "\u20B1" +numberWithCommas(data.product["estimated_price"]));

          $("#item_description").val(data.product["description"]);
          $("#item_quantity").val(data["quantity"]);
        }
      } else {
        notification("error", "Error!", data.message);
      }
    },
    error: function (data) {},
  });
};


// remove purchase request items from table
removePrDetail = (tr, pr_id,pr_item_id,status) => {
  let new_status= ""
  
  
  if(status =="removed"){
    $('#estimated_total').html( "\u20B1" +numberWithCommas(parseFloat($('#estimated_total').html().replace(/[^0-9\.-]+/g,"")) + parseFloat($("td:eq(4)", tr).html().replace(/[^0-9\.-]+/g,""))))
    new_status = "active"
    // subtotal += parseInt($("td:eq(4)", tr).html().replace(/[^0-9\.-]+/g,""))
    
  } 
  else{
    console.log(parseFloat($("td:eq(4)", tr).html().replace(/[^0-9\.-]+/g,"")))
    $('#estimated_total').html( "\u20B1" +numberWithCommas(parseFloat($('#estimated_total').html().replace(/[^0-9\.-]+/g,"")) - parseFloat($("td:eq(4)", tr).html().replace(/[^0-9\.-]+/g,""))))

    // subtotal -= parseInt($("td:eq(4)", tr).html().replace(/[^0-9\.-]+/g,""))

    new_status = "removed"  
  }

  console.log($('#estimated_total').html())

  $.ajax({
    url: apiURL + "purchase-requisition-detail/" + pr_item_id,
    type: "DELETE",
    data: JSON.stringify({
      status: new_status,
      estimated_amount: parseFloat($('#estimated_total').html().replace(/[^0-9\.-]+/g,""))
    }),
    contentType: "application/json",
    processData: false,
    cache: false,
    dataType: "json",
    success: function (data) {
  
  //       // notification("success", "Success!", data.message);
          dataInfo(pr_id)
    
        loadTable();
     
        // notification("info", "Deleted!", "Record Deleted");

    },
    error: function ({ responseJSON }) {},
  });
};