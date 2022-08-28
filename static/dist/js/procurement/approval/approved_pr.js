$(function () {

  // load datatable of approved pr
  loadTableApproved();

  // load datatable of pr items
  pr_detail_table();

});


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
    ajax: { url: apiURL + "purchase-requisition/approved/none", dataSrc: "" },

    responsive: true,
    serverSide: false,
    dataType: "json",
    type: "GET",
    columns: [
      {
        data: null,
        searchable: true,
        width: "15%",
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
          return aData.u_created_by.employees.first_name+" "+aData.u_created_by.employees.last_name;
        
        }
      },

      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
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
          if (aData.has_rfq === true) {
            return '<p>Done</p>';
          }
          else{
            return '<p><i class= "fas fa-minus mr-1"></i></p>';

          }
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
              '<label class="text-left badge badge-warning p-2 w-50"> ' +
              aData.status +
              "</label> ";
            return status;
          } else if (aData.status === "Approved") {
            let status =
              '<label class="text-left badge badge-primary p-2 w-50"> ' +
              aData.status +
              "</label> ";
            return status;
          } else if (aData.status === "Rejected") {
            let status =
              '<label class="text-left badge badge-danger p-2 w-50"> ' +
              aData.status +
              "</label> ";
            return status;
          }
        },
      },
      {
        data: null,
        width: "5%",
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

//   show purchase requisition
dataInfo = (id, type) => {
  $("#modal-xl").modal("show");

  $.ajax({
    url: apiURL + "purchase-requisition/" + id,
    type: "GET",
    dataType: "json",
    success: function (data) {
      if (data) {
        $("#pr_number").html(
          formatPurchaseRequestNo(data["purchase_requisition_number"])
        );
        $("#status").html(data["status"]);
        $("#department").html(data.u_created_by.employees.department["department_name"]);
        $("#requested_by").html(data.u_created_by.employees["first_name"]);
        $("#purpose").html(data["purpose"]);
        $("#date_requested").html(
          moment(data["created_at"]).format("MMMM D, YYYY")
        );

        $("#date_approved").html(
          moment(data["date_approved"]).format("MMMM D, YYYY")
        );

        $("#approved_by").html(data["approved_by"]);
        $("#estimated_amount").html( "\u20B1" +numberWithCommas(data["estimated_amount"]));
        $("#given_budget").html( "\u20B1" +numberWithCommas(data["given_budget"]));


        prd_table.clear().draw();

        for (let pr_item in data.purchase_requisition_detail) {
          if(data.purchase_requisition_detail[pr_item].status == "active"){
          if (data.purchase_requisition_detail[pr_item].product_id === null) {
            prd_table.row
              .add([
                data.purchase_requisition_detail[pr_item].new_category,
                data.purchase_requisition_detail[pr_item].new_product_name,
                data.purchase_requisition_detail[pr_item].description,
                "\u20B1" +numberWithCommas(data.purchase_requisition_detail[pr_item].estimated_price),
                data.purchase_requisition_detail[pr_item].quantity,
                "\u20B1" +numberWithCommas(data.purchase_requisition_detail[pr_item].quantity* data.purchase_requisition_detail[pr_item].estimated_price),

            
              ])
              .draw();
          } else {
            prd_table.row
              .add([
                data.purchase_requisition_detail[pr_item].product.category
                .category_name,
              data.purchase_requisition_detail[pr_item].product.product_name,
              data.purchase_requisition_detail[pr_item].product.description,
              "\u20B1" +numberWithCommas(data.purchase_requisition_detail[pr_item].product.estimated_price),
              data.purchase_requisition_detail[pr_item].quantity,
              "\u20B1" +numberWithCommas(data.purchase_requisition_detail[pr_item].quantity* data.purchase_requisition_detail[pr_item].product.estimated_price),
           
              ])
              .draw();
          }
        }
        }

        if (type == 0) {
          $(".print").hide();
        } else {
          $(".print").show();
          $(".print").html("Print" + '<i class="fas fa-print ml-1"></i>');
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

