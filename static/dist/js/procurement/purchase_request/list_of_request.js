$(function () {
  // hide timeline

  $("#div_timeline").hide();

  // load datatable
  loadTable();

  // load datatable pending request
  loadTablePending();

  // load datatable approved request
  loadTableApproved();

  // load datatable rejected request
  loadTableRejected();

  // load purchase request items table
  pr_detail_table();
});

// datatable
// load all request
loadTable = () => {
  $.ajaxSetup({
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
  });
  // '+status+'
  $("#data-table-all").dataTable().fnClearTable();
  $("#data-table-all").dataTable().fnDraw();
  $("#data-table-all").dataTable().fnDestroy();
  $("#data-table-all").DataTable({
    ajax: {
      url:
        apiURL +
        "purchase-requisition/datatable/" +
        localStorage.getItem("DEPARTMENTID"),
      dataSrc: "",
    },

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
        width: "20%",
        // className: "dtr-control",
        render: function (aData, type, row) {
          return aData.u_created_by.employees.first_name + " " +aData.u_created_by.employees.last_name
        }
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
              '<label class="text-left badge badge-warning p-2 w-50"> ' +
              aData.status +
              "</label> ";
            return status;
          } else if (aData.status === "Approved") {
            let status =
              '<label class="text-left badge badge-primary p-2 w-50" > ' +
              aData.status +
              "</label> ";
            return status;
          } else {
            let status =
              '<label class="text-left badge badge-danger p-2 w-50" style="font-size:12px;"> ' +
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
          // info
          buttons +=
            '<div class="text center dropdown"><div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
            '<i class="fas fa-ellipsis-v"></i></div><div class="dropdown-menu dropdown-menu-right">';
          //timeline
          buttons +=
            '<div class="dropdown-item d-flex role="button" onClick="return Timeline(\'' +
            aData["id"] +
            "',0)\">" +
            '<div style="width: 2rem"><i class="fas fa-tasks mr-1"></i></div>' +
            "<div> Timeline</div></div>";
          //view
          buttons +=
            '<div class="dropdown-item d-flex role="button" onClick="return dataInfo(\'' +
            aData["id"] +
            "',0)\">" +
            '<div style="width: 2rem"> <i class= "fas fa-file-alt mr-1"></i></div>' +
            "<div> View</div></div>";
          if (aData.status == "Pending") {
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

// all pending request
loadTablePending = () => {
  $.ajaxSetup({
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
  });
  // '+status+'
  $("#data-table-pending").dataTable().fnClearTable();
  $("#data-table-pending").dataTable().fnDraw();
  $("#data-table-pending").dataTable().fnDestroy();
  $("#data-table-pending").DataTable({
    ajax: {
      //should be dynamic onchange
      url: apiURL + "purchase-requisition/pending-cancelled/"+localStorage.getItem("DEPARTMENTID"),
      dataSrc: "",
    },

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
        width: "20%",
        render: function (aData, type, row) {
          return aData.u_created_by.employees.first_name + " " +aData.u_created_by.employees.last_name
        }
        // className: "dtr-control",
      },

      // {
      //   data: "created_at",
      //   name: "created_at",
      //   searchable: true,
      //   width: "20%",
      // },
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
              '<label class="text-left badge badge-warning p-2 w-50"> ' +
              aData.status +
              "</label> ";
            return status;
          } else if (aData.status === "Approved") {
            let status =
              '<label class="text-left badge badge-primary p-2 w-50" > ' +
              aData.status +
              "</label> ";
            return status;
          } else {
            let status =
              '<label class="text-left badge badge-danger p-2 w-50" style="font-size:12px;"> ' +
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
          // info
          buttons +=
            '<div class="text center dropdown"><div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
            '<i class="fas fa-ellipsis-v"></i></div><div class="dropdown-menu dropdown-menu-right">';
          //timeline
          buttons +=
            '<div class="dropdown-item d-flex role="button" onClick="return Timeline(\'' +
            aData["id"] +
            "',0)\">" +
            '<div style="width: 2rem"><i class="fas fa-tasks mr-1"></i></div>' +
            "<div> Timeline</div></div>";
          //view
          buttons +=
            '<div class="dropdown-item d-flex role="button" onClick="return dataInfo(\'' +
            aData["id"] +
            "',0)\">" +
            '<div style="width: 2rem"> <i class= "fas fa-file-alt mr-1"></i></div>' +
            "<div> View</div></div>";
          if (aData.status == "Pending") {
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
// all approved request
loadTableApproved = () => {
  $.ajaxSetup({
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
  });
  // '+status+'
  $("#data-table-approved").dataTable().fnClearTable();
  $("#data-table-approved").dataTable().fnDraw();
  $("#data-table-approved").dataTable().fnDestroy();
  $("#data-table-approved").DataTable({
    ajax: {
      url: apiURL + "purchase-requisition/approved/"+localStorage.getItem("DEPARTMENTID"),
      dataSrc: "",
    },

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
        width: "20%",
        render: function (aData, type, row) {
          return aData.u_created_by.employees.first_name + " " +aData.u_created_by.employees.last_name
        }
        // className: "dtr-control",
      },

      // {
      //   data: "created_at",
      //   name: "created_at",
      //   searchable: true,
      //   width: "20%",
      // },
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
              '<label class="text-left badge badge-warning p-2 w-50"> ' +
              aData.status +
              "</label> ";
            return status;
          } else if (aData.status === "Approved") {
            let status =
              '<label class="text-left badge badge-primary p-2 w-50" > ' +
              aData.status +
              "</label> ";
            return status;
          } else if (aData.status === "Rejected") {
            let status =
              '<label class="text-left badge badge-danger p-2 w-50" style="font-size:12px;"> ' +
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
          // info
          buttons +=
            '<div class="text center dropdown"><div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
            '<i class="fas fa-ellipsis-v"></i></div><div class="dropdown-menu dropdown-menu-right">';
          //timeline
          buttons +=
            '<div class="dropdown-item d-flex role="button" onClick="return Timeline(\'' +
            aData["id"] +
            "',0)\">" +
            '<div style="width: 2rem"><i class="fas fa-tasks mr-1"></i></div>' +
            "<div> Timeline</div></div>";
          //view
          buttons +=
            '<div class="dropdown-item d-flex role="button" onClick="return dataInfo(\'' +
            aData["id"] +
            "',0)\">" +
            '<div style="width: 2rem"> <i class= "fas fa-file-alt mr-1"></i></div>' +
            "<div> View</div></div>";
          if (aData.status == "Pending") {
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
// all rejected request
loadTableRejected = () => {
  $.ajaxSetup({
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
  });
  // '+status+'
  $("#data-table-rejected").dataTable().fnClearTable();
  $("#data-table-rejected").dataTable().fnDraw();
  $("#data-table-rejected").dataTable().fnDestroy();
  $("#data-table-rejected").DataTable({
    ajax: {
      url: apiURL + "purchase-requisition/rejected/"+localStorage.getItem("DEPARTMENTID"),
      dataSrc: "",
    },

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
        width: "20%",
        render: function (aData, type, row) {
          return aData.u_created_by.employees.first_name + " " +aData.u_created_by.employees.last_name
        }
        // className: "dtr-control",
      },

      // {
      //   data: "created_at",
      //   name: "created_at",
      //   searchable: true,
      //   width: "20%",
      // },
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
              '<label class="text-left badge badge-warning p-2 w-50"> ' +
              aData.status +
              "</label> ";
            return status;
          } else if (aData.status === "Approved") {
            let status =
              '<label class="text-left badge badge-primary p-2 w-50" > ' +
              aData.status +
              "</label> ";
            return status;
          } else if (aData.status === "Rejected") {
            let status =
              '<label class="text-left badge badge-danger p-2 w-50" style="font-size:12px;"> ' +
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
          // info
          buttons +=
            '<div class="text center dropdown"><div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
            '<i class="fas fa-ellipsis-v"></i></div><div class="dropdown-menu dropdown-menu-right">';
          //timeline
          buttons +=
            '<div class="dropdown-item d-flex role="button" onClick="return Timeline(\'' +
            aData["id"] +
            "',0)\">" +
            '<div style="width: 2rem"><i class="fas fa-tasks mr-1"></i></div>' +
            "<div> Timeline</div></div>";
          //view
          buttons +=
            '<div class="dropdown-item d-flex role="button" onClick="return dataInfo(\'' +
            aData["id"] +
            "',0)\">" +
            '<div style="width: 2rem"> <i class= "fas fa-file-alt mr-1"></i></div>' +
            "<div> View</div></div>";
          if (aData.status == "Pending") {
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


// view timeline
Timeline = (id) => {
  $("#div_timeline").show();
  $("html, body").animate({ scrollTop: 0 }, "slow");

  $.ajax({
    url: apiURL + "purchase-requisition/timeline/" + id,
    type: "GET",
    dataType: "json",
    success: function (data) {
      if (data) {

        console.log(data)
        $("#timeline_pr_number").html(
          formatPurchaseRequestNo(data["purchase_requisition_number"])
        );

      

        $("#timeline_body").empty();
        let timeline_body = "";
        timeline_body +=
          '<div class="time-label">' +
          '<span class="bg-orange">' +
          moment(data.created_at).format("MMMM D, YYYY") +
          '</span>' +
          '</div>';

        timeline_body +=
          '<div>'+
          '<i class="fas fa-envelope bg-orange"></i>'+
          '<div class="timeline-item">' +
          '<span class="time"><i class="fas fa-clock"></i> '+ moment(data.created_at).format("hh:mm A") +'</span>'+
          '<h3 class="timeline-header">Purchase Request</h3>'+
          '<div class="timeline-body">This purchase request has been sent</div>'+
          // '<div class="timeline-footer">'+ +'</div>'+
          '</div>'+
          '</div>';

        var bg_color;
         if(data.approved_by != null){
          if(data.status == "Rejected") bg_color = "red";
          else bg_color = "green";
          
          timeline_body +=
          '<div class="time-label">' +
          '<span class="bg-'+bg_color+'">' +
          moment(data.date_approved).format("MMMM D, YYYY") +
          '</span>' +
          '</div>';

        timeline_body +=
          '<div>'+
          '<i class="fas fa-file text-light bg-'+bg_color+'"></i>'+
          '<div class="timeline-item">' +
          '<span class="time"><i class="fas fa-clock"></i>'+ moment(data.date_approved).format("hh:mm A") +'</span>'+
          '<h3 class="timeline-header">Purchase Request</h3>'+
          '<div class="timeline-body">This purchase request has been '+data.status.toLowerCase()+'</div>'+
          // '<div class="timeline-footer"> This purchase request has been '+data.status.toLowerCase()+'</div>'+
          '</div>'+
          '</div>';

          // get RFQ
          if(data.request_quotation.length != 0){
            for(let i = 0; i < data.request_quotation.length; i++){
              var rfq_date = data.request_quotation[i].created_at
             // get proposal
              if(data.request_quotation[i].vendor_proposal.length != 0){
                for(let j =0; j < data.request_quotation[i].vendor_proposal.length; j++){
                  // get purchase order
                  if(data.request_quotation[i].vendor_proposal[j].purchase_order.length != 0){
                     for(let k =0; k < data.request_quotation[i].vendor_proposal[j].purchase_order.length; k++){
                        var po_date = data.request_quotation[i].vendor_proposal[j].purchase_order[k].created_at
                        var po_expected_delivery_date = data.request_quotation[i].vendor_proposal[j].purchase_order[k].expected_delivery_date

                        
                      }
                    }
                  }
                //   console.log(data.request_quotation[i].venor_proposal)
                }
              }
              
              timeline_body +=
              '<div class="time-label">' +
              '<span class="bg-green">' +
              moment(data.rfq_date).format("MMMM D, YYYY") +
              '</span>' +
              '</div>';
    
            timeline_body +=
              '<div>'+
              '<i class="fas fa-copy text-light bg-primary"></i>'+
              '<div class="timeline-item">' +
              '<span class="time"><i class="fas fa-clock"></i>'+moment(data.rfq_date).format("hh:mm A")+'</span>'+
              '<h3 class="timeline-header">Request For Quotation</h3>'+
              '<div class="timeline-body">Request Quotation has been sent to the vendor</div>'+
              // '<div class="timeline-footer">'+ +'</div>'+
              '</div>'+
              '</div>';
         

              if(po_date != null){
                timeline_body +=
                '<div class="time-label">' +
                '<span class="bg-green">' +
                moment(data.po_date).format("MMMM D, YYYY") +
                '</span>' +
                '</div>';
      
              timeline_body +=
                '<div>'+
                '<i class="fas fa-truck text-light bg-primary"></i>'+
                '<div class="timeline-item">' +
                '<span class="time"><i class="fas fa-clock"></i> '+moment(data.po_date).format("hh:mm A")+'</span>'+
                '<h3 class="timeline-header">Purchase Order </h3>'+
                '<div class="timeline-body">Purchase Order is expected to arrive on '+moment(po_expected_delivery_date).format("MMMM D, YYYY")+ '</div>'+
                // '<div class="timeline-footer">'+ +'</div>'+
                '</div>'+
                '</div>';
           
              }

              
            }
          }

         timeline_body += '<div><i class="fas fa-circle text-light bg-dark"></i></div>';



        // console.log(data)
        // console.log(data.request_quotation.length)

        $("#timeline_body").append(timeline_body);
      } else {
        notification("error", "Error!", data.detail);

        console.log("error" + data);
        loadTable();
      }
    },
    error: function ({ responseJSON }) {},
  });
};

// view purchase requisition details
dataInfo = (id, type) => {
  $("#modal-xl").modal("show");

  //   console.log(id);
  $.ajax({
    url: apiURL + "purchase-requisition/" + id,
    type: "GET",
    dataType: "json",
    success: function (data) {
      if (data) {
        $("#pr_number").html(
          formatPurchaseRequestNo(data["purchase_requisition_number"])
        );
        console.log(data)
        $("#status").html(data["status"]);
        $("#department").html(data.u_created_by.employees.department["department_name"]);
        $("#requested_by").html(data.u_created_by.employees.first_name + " " +data.u_created_by.employees.last_name);
    
        $("#purpose").html(data["purpose"]);
        $("#date_requested").html(
          moment(data["created_at"]).format("MMMM D, YYYY")
        );

        if(data["status"] == "Approved"){
            $('.when_approved').show()
            $('.when_rejected').hide()

          $("#date_approved").html(
            moment(data["date_approved"]).format("MMMM D, YYYY")
          );
  
            
          $("#approved_by").html(data["approved_by"]);
          $("#estimated_amount").html( "\u20B1" +numberWithCommas(data["estimated_amount"]));
          $("#given_budget").html( "\u20B1" +numberWithCommas(data["given_budget"]));
        }
        else if(data["status"] == "Rejected"){
          $('.when_approved').hide()
          $('.when_rejected').show()

          $("#reason").html(data["reason"]);

        }
        else{
          $('.when_approved').hide()
          $('.when_rejected').hide()

          $("#reason").html(data["reason"]);
        }

        prd_table.clear().draw();

        for (let pr_item in data.purchase_requisition_detail) {
          if (data.purchase_requisition_detail[pr_item].status == "active") {
            bg_color = "primary";
        
          } else {
            bg_color = "danger";
  
          }
          if (data.purchase_requisition_detail[pr_item].product_id === null) {
            prd_table.row
              .add([
                data.purchase_requisition_detail[pr_item].new_category,
                data.purchase_requisition_detail[pr_item].new_product_name,
                data.purchase_requisition_detail[pr_item].description,
                "\u20B1" +numberWithCommas(data.purchase_requisition_detail[pr_item].estimated_price),
                data.purchase_requisition_detail[pr_item].quantity,
                "\u20B1" +numberWithCommas(data.purchase_requisition_detail[pr_item].quantity* data.purchase_requisition_detail[pr_item].estimated_price),

                '<label class="text-left badge badge-'+bg_color+' p-2 w-100" >' +
                data.purchase_requisition_detail[pr_item].status +
                '</label>'
              ])
              .draw();
          } else {
            // Loop here

            prd_table.row
              .add([
                data.purchase_requisition_detail[pr_item].product.category
                  .category_name,
                data.purchase_requisition_detail[pr_item].product.product_name,
                data.purchase_requisition_detail[pr_item].product.description,
                "\u20B1" +numberWithCommas(data.purchase_requisition_detail[pr_item].product.estimated_price),
                data.purchase_requisition_detail[pr_item].quantity,
                "\u20B1" +numberWithCommas(data.purchase_requisition_detail[pr_item].quantity* data.purchase_requisition_detail[pr_item].product.estimated_price),
                '<label class="text-left badge badge-'+bg_color+' p-2 w-100" >' +
                data.purchase_requisition_detail[pr_item].status +
                '</label>'

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


// function for changing status of purchase requisition
const formStatus = {};
redoData = (id, type) => {
  if (type == 1) {
    $("#modal-default").modal("show");
    $(".cancel-request").html(
      '<i class="text-secondary fas fa-exclamation-triangle mr-2"></i>' +
        "Cancel Purchase Request"
    );
    $(".request-modal-body").html(
      "Are you sure you want to Cancel this request?"
    );
    $("#changeStatus").attr("class", "btn btn-info");

    $("#changeStatus").html("Yes, Cancel it");

    $("#resend").hide();

    $("#uuid").val(id);
    formStatus["status"] = "Cancelled";
  } else {
    $(".budget-row").hide();
    $(".request-modal-body").html(
      "Are you sure you want to resend this request?"
    );
    $("#changeStatus").html("Yes, Resend it");
    $("#changeStatus").attr("class", "btn btn-primary");

    $("#modal-default").modal("show");
    $(".cancel-request").html(
      '<i class="text-secondary fas fa-exclamation-triangle mr-2"></i>' +
        "Resend Purchase Request"
    );

    $("#cancel").hide();
    $("#resend").show();

    $("#uuid").val(id);

    formStatus["status"] = "Pending";
  }
};

changeStatus = () => {
  $.ajax({
    url: apiURL + "purchase-requisition/status/" + $("#uuid").val(),

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
          notification("info","Warning", "Purchase Requisition is Cancelled");
        } else {
          notification("success", "Success", "Purchase Requisition Resent");
        }
        $("#modal-status").modal("hide");
        loadTable();
        loadTablePending();
        loadTableApproved();
        loadTableRejected();
      } else {
        $("#modal-status").modal("hide");

        notification("error", "Error!", "Error approving PR");

        console.log("error");
      }
    },
    error: function ({ responseJSON }) {
      console.log(responseJSON);
    },
  });
  $("#changeStatus").attr("data-dismiss", "modal");
};
