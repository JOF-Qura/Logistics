$(function () {
  // load purchase order items
  po_items();
  // load datatable
  loadTable("", "", "");
  $(".select2").select2();

  //Date range as a button
  $("#reservation").daterangepicker(
    {
      ranges: {
        // 'All'       : [moment().subtract(1, 'year').startOf('year'), moment().endOf('year')],
        Today: [moment(), moment()],
        Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
        "Last 7 Days": [moment().subtract(6, "days"), moment()],
        "Last 30 Days": [moment().subtract(29, "days"), moment()],
        "This Month": [moment().startOf("month"), moment().endOf("month")],
        "This Year": [moment().startOf("year"), moment().endOf("year")],
        "Last Month": [
          moment().subtract(1, "month").startOf("month"),
          moment().subtract(1, "month").endOf("month"),
        ],
        "Last Year": [
          moment().subtract(1, "year").startOf("year"),
          moment().subtract(1, "year").endOf("year"),
        ],
      },
      startDate: moment().subtract(29, "days"),
      endDate: moment(),
    },
    function (start, end) {
      date_start = start.format("YYYY-MM-DD");
      date_end = end.format("YYYY-MM-DD");
      $("#start_date").val(date_start);
      $("#end_date").val(date_end);

      if ($("#po_status").val() != "") {
        loadTable(date_start, date_end, $("#po_status").val());
      } else {
        loadTable(date_start, date_end, "");
      }

      $("#reportrange").html(
        start.format("MMMM D, YYYY") + " - " + end.format("MMMM D, YYYY")
      );

      // $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'))
    }
  );
});

// datatable for purchase order items
po_items = () => {
  $("#po-detail-table").dataTable().fnClearTable();
  $("#po-detail-table").dataTable().fnDraw();
  $("#po-detail-table").dataTable().fnDestroy();
  po_detail_table = $("#po-detail-table").DataTable({
    info: false,
    paging: false,
    searchable: false,
    searching: false,
    responsive: true,
    aLengthMenu: [5, 10, 20, 30, 50, 100],
  });
};

// purchase order datatable
loadTable = (date_start, date_end, status) => {
  $.ajaxSetup({
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
  });

  if (date_start != "" && status != "") {
    filteredURL =
      apiURL +
      "purchase-order/filtered/po/reports/" +
      date_start +
      "/" +
      date_end +
      "/" +
      status;
  } else if (date_start != "" && status == "") {
    filteredURL =
      apiURL +
      "purchase-order/filtered/po/reports/" +
      date_start +
      "/" +
      date_end +
      "/none";
  } else if (date_start == "" && status != "") {
    filteredURL =
      apiURL + "purchase-order/filtered/po/reports/none/none/" + status;
  } else {
    filteredURL = apiURL + "purchase-order/filtered/po/reports/none/none/none";
  }

  console.log(filteredURL);
  $("#data-table-orders").dataTable().fnClearTable();
  $("#data-table-orders").dataTable().fnDraw();
  $("#data-table-orders").dataTable().fnDestroy();
  $("#data-table-orders").DataTable({
    ajax: { url: filteredURL, dataSrc: "" },

    dom: "Bfrtip",

    // buttons: ["copy", "csv", "excel", "pdf", "print", "colvis"],
    buttons: [
      {
        extend: "copy",
        //  text: 'Export Search Results',
        //  className: 'btn btn-default',
        exportOptions: {
          columns: "th:not(:last-child)",
        },
      },

      {
        extend: "excel",
        //  text: 'Export Search Results',
        //  className: 'btn btn-default',
        exportOptions: {
          columns: "th:not(:last-child)",
        },
      },

      {
        extend: "csv",
        //  text: 'Export Search Results',
        //  className: 'btn btn-default',
        exportOptions: {
          columns: "th:not(:last-child)",
        },
      },

      {
        extend: "pdf",
        //  text: 'Export Search Results',
        //  className: 'btn btn-default',
        exportOptions: {
          columns: "th:not(:last-child)",
        },
      },
      {
        extend: "print",
        //  text: 'Export Search Results',
        //  className: 'btn btn-default',
        exportOptions: {
          columns: "th:not(:last-child)",
        },
      },
    ],

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
          return formatPoNo(aData.purchase_order_number);
        },
        // className: "dtr-control",formatPoNo
      },
      {
        data: "vendor.vendor_name",
        name: "vendor.vendor_name",
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
          return moment(aData.order_date).format("MMMM D, YYYY");
        },
      },

      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {
          return moment(aData.expected_delivery_date).format("MMMM D, YYYY");
        },
      },

      {
        data: "payment_method.method_name",
        name: "payment_method.method_name",
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
          return "\u20B1" + numberWithCommas(aData.total_amount);
        },
        // className: "dtr-control",
      },
      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        // className: "dtr-control",
        render: function (aData, type, row) {
          if (aData.status === "Pending") {
            let status =
              '<label class="text-left badge badge-warning p-2 w-100"> ' +
              aData.status +
              "</label> ";
            return status;
          } else if (aData.status === "Confirmed") {
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
        width: "10%",
        render: function (aData, type, row) {
          let buttons = "";
          buttons +=
            '<div class="text center dropdown"><div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
            '<i class="fas fa-ellipsis-v"></i></div><div class="dropdown-menu dropdown-menu-right">' +
            //view
            '<div class="dropdown-item d-flex role="button" onClick="return poInfo(\'' +
            aData["id"] +
            "',0)\">" +
            '<div style="width: 2rem"> <i class= "fas fa-eye mr-1"></i></div>' +
            "<div>View</div></div>" +
            "</div></div>";
          return buttons; // same class in i element removed it from a element
        },
      },
    ],
  });
};

// on change event of purchase order status
$("[name=po_status]").on("change", function () {
  po_status = $(this).val();

  if ($("#start_date").val() != "") {
    loadTable($("#start_date").val(), $("#end_date").val(), po_status);
  } else {
    loadTable("none", "none", po_status);
  }
});

// view purchase order details
poInfo = (id) => {
  $("#modal-print").modal("show");
  $("#payment_method_p").show();
  $("#payment_method").hide();

  $("#expected_delivery_date_p").show();
  // $("#expected_delivery_date").hide();

  $(".submit-po").hide();
  $.ajax({
    url: apiURL + "purchase-order/" + id,
    type: "GET",
    dataType: "json",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
    success: function (data) {
      if (data) {
        console.log(data);

        $("#uuid").val(data["id"]);

        $("#po_vendor_name").text(data.vendor["vendor_name"]);
        // $("#po_vendor_address").html(data..u_created_by["street"]);
        // $("#po_vendor_city").html(data.vendor_proposal.u_created_by["city"]);
        $("#po_number").text(formatPoNo(data["purchase_order_number"]));
        $("#order_date").val(moment(data["order_date"]).format("MMMM D, YYYY"));

        $("#expected_delivery_date").val(data["expected_delivery_date"]);
        $("#vendor_proposal_id").val(data["vendor_proposal_id"]);
        $("#payment_method_p").val(data["payment_method"]);

        $("#po_subtotal").html(data["subtotal"]);

        $("#po_discount").html(data["discount"]);
        $("#po_tax").html(data["tax"]);
        $("#po_total").html(data["total_amount"]);
        $("#po_notes").html(data["notes"]);

        po_detail_table.clear().draw();

        // Loop here
        for (let i in data.purchase_order_detail) {
          po_detail_table.row
            .add([
              // product pic

              // '<label class="text-center badge badge-secondary p-2 w-auto"><i class="fas fa-file-image"></i></label> ',
              // product catagory
              data.purchase_order_detail[i].category,

              // product name
              data.purchase_order_detail[i].product_name,

              // product description
              // data.vendor_bidding_item[i].description,

              data.purchase_order_detail[i].quantity,

              // price per unit
              "\u20B1" +
                numberWithCommas(data.purchase_order_detail[i].product_price),

              // total
              "\u20B1" +
                numberWithCommas(
                  data.purchase_order_detail[i].product_price *
                    data.purchase_order_detail[i].quantity
                ),
            ])
            .draw();
        }

        $(
          "#modal-po input[type='number'],input[type='text'],input[type='date'], .select2, #shipment_method, textarea"
        ).prop("disabled", true);
      } else {
        // notification("error", "Error!", responseData.message);
        console.log("error", "Error!", responseData.success);
      }
    },
    error: function ({ responseJSON }) {},
  });
};

// print purchase order
$(document).on("click", ".print", function () {
  const content_wrapper = $(".content-wrapper");
  const content_header = $(".content-header").detach();
  const content = $(".content").detach();
  const modal_content = $(".pr-report-modal-content");

  const modalHeader = $(".pr-report-modal-header");
  const modalBody = $(".pr-report-modal-body").detach();
  const modalFooter = $(".pr-report-modal-footer");

  $("footer").hide();

  content_wrapper.append(modalBody);
  $("#modal-print").hide();
  window.print();
  $("#modal-print").show();
  modal_content.empty();
  content_wrapper.empty();
  content_wrapper.append(content_header);

  content_wrapper.append(content);
  modal_content.append(modalHeader);
  modal_content.append(modalBody);
  modal_content.append(modalFooter);

  $("footer").show();
});

// load payment terms
loadPaymentTerms = () => {
  $.ajax({
    url: apiURL + "payment-terms/",
    type: "GET",
    dataType: "json",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
    success: function (responseData) {
      if (responseData) {
        $("#payment_terms").empty();
        $.each(responseData, function (i, dataOptions) {
          let options = "";
          options =
            "<option value='" +
            dataOptions.id +
            "'>" +
            dataOptions.method_name +
            "</option>";

          $("#payment_terms").append(options);
        });
      } else {
        // notification("error", "Error!", responseData.message);
        console.log("error", "Error!", responseData.success);
      }
    },
    error: function ({ responseJSON }) {},
  });
};

loadPaymentTerms();

// load payment method
loadPaymentMethods = () => {
  $.ajax({
    url: apiURL + "payment-method/",
    type: "GET",
    dataType: "json",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
    success: function (responseData) {
      if (responseData) {
        $("#payment_method").empty();
        $.each(responseData, function (i, dataOptions) {
          let options = "";
          options =
            "<option value='" +
            dataOptions.id +
            "'>" +
            dataOptions.method_name +
            "</option>";

          $("#payment_method").append(options);
        });
      } else {
        // notification("error", "Error!", responseData.message);
        console.log("error", "Error!", responseData.success);
      }
    },
    error: function ({ responseJSON }) {},
  });
};

loadPaymentMethods();
