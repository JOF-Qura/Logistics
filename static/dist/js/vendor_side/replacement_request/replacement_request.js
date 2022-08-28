$(function () {
  // load replacement request datatable
  loadTableReplacementRequest();

  // load replacement items table
  return_detail_table();
});

 // all replacement request
loadTableReplacementRequest = () => {
  $.ajaxSetup({
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
  });
  // '+status+'
  $("#data-table-replacement").dataTable().fnClearTable();
  $("#data-table-replacement").dataTable().fnDraw();
  $("#data-table-replacement").dataTable().fnDestroy();
  $("#data-table-replacement").DataTable({
    ajax: {
      url: apiURL + "replacement-request/vendor/" + localStorage.getItem("ID"),
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
          // return new Date(aData.purchase_requesition.created_at)
          //   .toString()
          //   .slice(0, 24);
          return moment(aData["replacement_request_date"]).format(
            "MMMM D, YYYY"
          );
        },
      },

      {
        data: "prepared_by",
        name: "prepared_by",
        searchable: true,
        width: "10%",
        // className: "dtr-control",
      },

      {
        data: "request_type",
        name: "request_type",
        searchable: true,
        width: "10%",
        // className: "dtr-control",
      },

      {
        data: "message",
        name: "message",
        searchable: true,
        width: "10%",
        // className: "dtr-control",
      },

      {
        data: null,
        name: null,
        searchable: true,
        width: "15%",
        render: function (aData, type, row) {
          let status = "";
          if (aData.status == "Pending") {
            status +=
              '<label class="text-left badge badge-warning p-2 w-auto"> ' +
              aData.status +
              "</label> ";
          } else if (aData.status == "Approved") {
            status +=
              '<label class="text-left badge badge-primary p-2 w-auto"> ' +
              aData.status +
              "</label> ";
          } else {
            status +=
              '<label class="text-left badge badge-danger p-2 w-auto"> ' +
              aData.status +
              "</label> ";
          }

          return status;
        },
      },
      {
        data: null,
        width: "15%",
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

// replacement items table
return_detail_table = () => {
  $("#return-details-table").dataTable().fnClearTable();
  $("#return-details-table").dataTable().fnDraw();
  $("#return-details-table").dataTable().fnDestroy();
  return_detail_tbl = $("#return-details-table").DataTable({
    info: false,
    paging: false,
    searching: false,
    ordering: false,
  });
};

//   view replacement request
dataInfo = (id, type) => {
  $("#modal-xl").modal("show");

  //   console.log(id);
  $.ajax({
    url: apiURL + "replacement-request/" + id,
    type: "GET",
    dataType: "json",
    success: function (data) {
      if (data) {
        if (data["status"] == "Pending") {
          $("#approve_request").show();
          $("#reject_request").show();
        } else {
          $("#approve_request").hide();
          $("#reject_request").hide();
        }
        console.log(data);
        $("#request_date").text(
          moment(data.request_date).format("MMMM D, YYYY")
        );
        $("#prepared_by").text(data.prepared_by);
        $("#request_type").text(data.request_type);
        $("#message").text(data.message);
        $("#uuid").val(data.id);

        return_detail_tbl.clear().draw();
        for (let i in data.returns.return_details) {
          return_detail_tbl.row
            .add([
              data.returns.return_details[i].purchase_order_detail
                .purchase_order.purchase_order_number,
              data.returns.return_details[i].purchase_order_detail.category,
              data.returns.return_details[i].purchase_order_detail.product_name,
              data.returns.return_details[i].purchase_order_detail.quantity,

              data.returns.return_details[i].quantity,
            ])
            .draw();
        }
      }
    },
    error: function ({ responseJSON }) {},
  });
};

// initialize replacement items table
return_detail_table = () => {
  $("#return-details-table").dataTable().fnClearTable();
  $("#return-details-table").dataTable().fnDraw();
  $("#return-details-table").dataTable().fnDestroy();
  return_detail_tbl = $("#return-details-table").DataTable({
    info: false,
    paging: false,
    searching: false,
    ordering: false,
  });
};

// request approval

var formStatus = "";
changeStatusModal = (type) => {
  $("#modal-approval").modal("show");
  if (type == 0) {
    formStatus = "Rejected";
    $("#approve").hide();
    $("#reject").show();
    $(".reason-row").show();
    $(".date-row").hide();

    $("#approver_label").html("Rejected by");
  } else {
    formStatus = "Approved";

    $("#approve").show();
    $("#reject").hide();
    $(".reason-row").hide();
    $(".date-row").show();

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
        console.log("wew");
      } else {
        approval_ajax();
      }
    } else {
      approval_ajax();
    }
  }
  $("#modal-approval").modal("hide");
};

approval_ajax = () => {
  console.log($("#expected_arrival_date").val());
  $.ajax({
    url: apiURL + "replacement-request/" + $("#uuid").val(),
    type: "PUT",
    dataType: "json",
    contentType: "application/json",

    data: JSON.stringify({
      status: formStatus,
      confirmed_by: $("#approver").val(),
      expected_arrival_date: $("#expected_arrival_date").val(),
      reason: $("#reason").val(),
    }),
    success: function (data) {
      console.log(data);
      if (formStatus == "Approved") {
        notification("success", "Success!", "Replacement Request Approved");
      } else {
        notification("success", "Success!", "Replacement Request Rejected");
      }
      delete data.id;

      $.ajax({
        url: apiURL + "vendor-audit-trail",
        type: "POST",
        dataType: "json",
        contentType: "application/json",

        data: JSON.stringify({
          crud: "Update Status",
          table: "replacement_request",
          payload: JSON.stringify({
            status: formStatus,
            confirmed_by: $("#approver").val(),
            expected_arrival_date: $("#expected_arrival_date").val(),
            reason: $("#reason").val(),
          }),
          client_ip: localStorage.getItem("CLIENT_IP"),
          vendor_id: localStorage.getItem("ID"),
        }),
        success: function (data) {},
        error: function ({ responseJSON }) {},
      });

      loadTableReplacementRequest();
      $("#modal-approval").modal("hide");
      $("#modal-xl").modal("hide");
    },
    error: function ({ responseJSON }) {},
  });
};
