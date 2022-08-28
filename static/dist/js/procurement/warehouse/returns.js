$(function () {
  // load datatable of returns
  loadTableReturns();
  // load datatable of replacement request
  loadTableReplacementRequest();

  // load datatable of return details/items
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
    ajax: { url: apiURL + "replacement-request/", dataSrc: "" },

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
        width: "5%",
        render: function (aData, type, row) {
          let buttons = "";
          // info
          buttons +=
            '<div class="text center dropdown"><div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
            '<i class="fas fa-ellipsis-v"></i></div><div class="dropdown-menu dropdown-menu-right">';

          //cancel
          if (aData["status"] == "Pending") {
            buttons +=
              '<div class="dropdown-item d-flex role="button" onClick="return redoData(\'' +
              aData["id"] +
              "',1)\">" +
              '<div style="width: 2rem"> <i class= "fas fa-times mr-1"></i></div>' +
              "<div> Cancel</div></div>";
          }

          // else if(aData["status"] =="Cancell"){
          else {
            // Resent
            buttons +=
              '<div class="dropdown-item d-flex role="button" onClick="return redoData(\'' +
              aData["id"] +
              "',0)\">" +
              '<div style="width: 2rem"> <i class= "fas fa-redo mr-1"></i></div>' +
              "<div> Resent</div></div>";
          }

          buttons += "</div></div>";

          return buttons; // same class in i element removed it from a element
        },
      },
    ],
  });
};

// all return
loadTableReturns = () => {
  $.ajaxSetup({
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
  });
  // '+status+'
  $("#data-table-returns").dataTable().fnClearTable();
  $("#data-table-returns").dataTable().fnDraw();
  $("#data-table-returns").dataTable().fnDestroy();
  $("#data-table-returns").DataTable({
    ajax: { url: apiURL + "returns/", dataSrc: "" },

    responsive: true,
    serverSide: false,
    dataType: "json",
    type: "GET",
    columns: [
      // {
      //   data: null,
      //   searchable: true,
      //   width: "15%",
      //   render: function (aData, type, row) {
      //     return formatPurchaseRequestNo(aData.purchase_requisition_number);
      //   },
      // },
      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        // className: "dtr-control",
        render: function (aData, type, row) {
          // return new Date(aData.purchase_requesition.created_at)
          //   .toString()
          //   .slice(0, 24);
          return moment(aData["return_date"]).format("MMMM D, YYYY");
        },
      },
      {
        data: "returner",
        name: "returner",
        searchable: true,
        width: "10%",
        // className: "dtr-control",
      },

      {
        data: "return_type",
        name: "return_type",
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
          if (aData.return_status == "Pending") {
            status +=
              '<label class="text-left badge badge-warning p-2 w-auto"> ' +
              aData.return_status +
              "</label> ";
          } else if (aData.return_status == "Rejected") {
            status +=
              '<label class="text-left badge badge-danger p-2 w-auto"> ' +
              aData.return_status +
              "</label> ";
          } else if (aData.return_status == "Approved") {
            status +=
              '<label class="text-left badge badge-primary p-2 w-auto"> ' +
              aData.return_status +
              "</label> ";
          } else {
            status +=
              '<label class="text-left badge badge-info p-2 w-auto"> ' +
              aData.return_status +
              "</label> ";
          }

          return status;
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

          buttons +=
            '<div class="dropdown-item d-flex role="button" data-toggle="modal" data-target="#modal-replacement-request"  onClick="return replaceRequest(\'' +
            aData["id"] +
            "',0)\">" +
            '<div style="width: 2rem"> <i class="fas fa-retweet mr-1"></i></div>' +
            "<div> Request Replacement</div></div>";

          buttons += "</div></div>";

          return buttons; // same class in i element removed it from a element
        },
      },
    ],
  });
};

// return detail/items
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

// show modal of create replacement request
replaceRequest = (id) => {
  $("#return_id").val(id);
  $("#prepared_by").val(
    localStorage.getItem("FIRSTNAME") + " " + localStorage.getItem("LASTNAME")
  );
  $("#request_date").val(moment(Date.now()).format("MMMM D, YYYY"));
};

// submit replacement request
$(function () {
  $("#form_id")
    .on("submit", function (e) {
      e.preventDefault();
      // trimInputFields();
    })
    .validate({
      rules: {
        prepared_by: {
          required: true,
        },

        message: {
          required: true,
        },
      },
      messages: {
        message: {
          required: "please provide a message",
        },
        prepared_by: {
          required: "please provide prepared by",
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
        $.ajax({
          url: apiURL + "replacement-request/",
          type: "POST",

          contentType: "application/json",
          data: JSON.stringify({
            return_id: $("#return_id").val(),
            prepared_by: $("#prepared_by").val(),
            message: $("#message").val(),
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
              notification(
                "success",
                "Created!",
                "Request Successfuly Created"
              );
              console.log(data);

              loadTableReturns();
            } else {
              notification("error", "Error!", "Error creating Request");
            }
          },
          error: function ({ responseJSON }) {
            console.log(responseJSON.detail);
            notification("error", "Error!", responseJSON.detail);
          },
        });
        $("#modal-replacement-request").modal("hide");
      },
    });
});

//   view returns
dataInfo = (id, type) => {
  $("#modal-xl").modal("show");

  //   console.log(id);
  $.ajax({
    url: apiURL + "returns/" + id,
    type: "GET",
    dataType: "json",
    success: function (data) {
      if (data) {
        $("#return_status").text(data.return_status);
        $("#return_type").text(data.return_type);
        $("#returner").text(data.returner);
        $("#return_date").text(moment(data.return_date).format("MMMM D, YYYY"));

        return_detail_tbl.clear().draw();
        for (let i in data.return_details) {
          return_detail_tbl.row
            .add([
              formatPoNo(
                data.return_details[i].purchase_order_detail.purchase_order
                  .purchase_order_number
              ),
              data.return_details[i].purchase_order_detail.category,
              data.return_details[i].purchase_order_detail.product_name,
              data.return_details[i].purchase_order_detail.quantity,

              data.return_details[i].quantity,
            ])
            .draw();
        }
      }
    },
    error: function ({ responseJSON }) {},
  });
};

// cancel resent request
const formStatus = {};
redoData = (id, type) => {
  if (type == 1) {
    $("#modal-default").modal("show");
    $(".cancel-request").html(
      '<i class="text-secondary fas fa-exclamation-triangle mr-2"></i>' +
        "Cancel Request"
    );
    $(".request-modal-body").html(
      "Are you sure you want to Cancel this Request?"
    );
    $("#changeStatus").attr("class", "btn btn-info");

    $("#changeStatus").html("Yes, Cancel it");

    $("#resend").hide();

    $("#replacement_request_id").val(id);
    formStatus["status"] = "Cancelled";
  } else {
    $(".budget-row").hide();
    $(".request-modal-body").html(
      "Are you sure you want to resend this Request?"
    );
    $("#changeStatus").html("Yes, Resend it");
    $("#changeStatus").attr("class", "btn btn-primary");

    $("#modal-default").modal("show");
    $(".cancel-request").html(
      '<i class="text-secondary fas fa-exclamation-triangle mr-2"></i>' +
        "Resend Request"
    );

    $("#cancel").hide();
    $("#resend").show();

    $("#replacement_request_id").val(id);

    formStatus["status"] = "Pending";
  }
};

changeStatus = () => {
  $.ajax({
    url: apiURL + "replacement-request/" + $("#replacement_request_id").val(),

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
          notification("info", "Request Cancelled");
        } else {
          notification("success", "Request Resent");
        }
        loadTableReplacementRequest();
        loadTableReplacementReturns();
      } else {
        notification("error", "Error!", "Error approving Request");
      }
    },
    error: function ({ responseJSON }) {
      console.log(responseJSON);
    },
  });
  $("#modal-replacement-request").modal("hide");

  $("#changeStatus").attr("data-dismiss", "modal");
};
