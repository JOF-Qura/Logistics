$(function () {
  // load purchase orders datatable
  loadOrdersTable();

  // load top vendor datatable
  loadTopVendorTable();

  // load purchase order items
  po_items();

  // load select 2 library
  $(".select2").select2();

  loadCharts();

});

// all pending purchase request
loadCharts = () => {
  // total vendors
  $.ajax({
    url: apiURL + "vendor/charts/count",
    type: "GET",
    dataType: "json",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
    success: function (responseData) {
      if (responseData) {
        $("#total_vendors").html(responseData);
      } else {
        // notification("error", "Error!", responseData.message);
        console.log("error", "Error!", "No data");
      }
    },
    error: function ({ responseJSON }) {},
  });

  // total vendors
  $.ajax({
    url: apiURL + "request-quotation/charts/count",
    type: "GET",
    dataType: "json",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
    success: function (responseData) {
      if (responseData) {
        $("#total_contracts").html(responseData);
      } else {
        // notification("error", "Error!", responseData.message);
        console.log("error", "Error!", "No data");
      }
    },
    error: function ({ responseJSON }) {},
  });

  // total orders
  $.ajax({
    url: apiURL + "purchase-order/charts/count",
    type: "GET",
    dataType: "json",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
    success: function (responseData) {
      if (responseData) {
        $("#total_orders").html(responseData);
      } else {
        // notification("error", "Error!", responseData.message);
        console.log("error", "Error!", "No data");
      }
    },
    error: function ({ responseJSON }) {},
  });

  //   total spent
  $.ajax({
    url: apiURL + "purchase-order/charts/po_total",
    type: "GET",
    dataType: "json",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
    success: function (responseData) {
      if (responseData) {
        console.log(responseData);
        $("#total_spending").html("\u20B1" + numberWithCommas(responseData));
      } else {
        // notification("error", "Error!", responseData.message);
        console.log("error", "Error!", "No data");
      }
    },
    error: function ({ responseJSON }) {},
  });

  $.ajax({
    url: apiURL + "vendor-evaluation/charts/ratings/none",
    type: "GET",
    dataType: "json",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
    success: function (responseData) {
      if (responseData) {
        //   console.log(responseData)
        // console.log(responseData);
        let new_rating_dict = {};
        for (let i in responseData) {
          if (responseData[i] != 0) {
            console.log(responseData[i][0].eval_data.total);
            new_rating_dict[responseData[i][0].vendor_name] =
              responseData[i][0].eval_data.total;
          }
        }

        var vendorRatingCanvas = $("#vendor_rating_chart")
          .get(0)
          .getContext("2d");
        var horizontalBarData = {
          // category_name
          labels: Object.keys(new_rating_dict),
          datasets: [
            {
              label: "Ratings",
              data: Object.values(new_rating_dict),
              backgroundColor: ["#669911", "#669911", "#669911","#669911","#669911","#669911","#669911","#669911","#669911","#669911","#669911","#669911","#669911"],
              hoverBackgroundColor: ["#66A2EB"],
            },
          ],
        };

        var barOptions = {
          maintainAspectRatio: false,
          responsive: true,
          scales: {
            xAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
            yAxes: [
              {
                stacked: true,
              },
            ],
          },
        };
        //Create pie or douhnut chart
        // You can switch between pie and douhnut using the method below.
        new Chart(vendorRatingCanvas, {
          type: "horizontalBar",
          data: horizontalBarData,
          options: barOptions,
        });
      } else {
        // notification("error", "Error!", responseData.message);
        // console.log("error", "Error!", "No data");
      }
    },
    error: function ({ responseJSON }) {},
  });

  $.ajax({
    url: apiURL + "purchase-order/charts/po_categ",
    type: "GET",
    dataType: "json",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
    success: function (responseData) {
      if (responseData) {
        //   console.log(responseData)
        console.log(Object.keys(responseData));
        var pieChartCanvas = $("#pieChart").get(0).getContext("2d");
        var donutData = {
          // category_name
          labels: Object.keys(responseData),
          datasets: [
            {
              data: Object.values(responseData),
              backgroundColor: [
                "#f56954",
                "#00a65a",
                "#f39c12",
                "#00c0ef",
                "#3c8dbc",
                "#d2d6de",
              ],
            },
          ],
        };
        var pieData = donutData;
        var pieOptions = {
          maintainAspectRatio: false,
          responsive: true,
        };
        //Create pie or douhnut chart
        // You can switch between pie and douhnut using the method below.
        new Chart(pieChartCanvas, {
          type: "pie",
          data: pieData,
          options: pieOptions,
        });
      } else {
        // notification("error", "Error!", responseData.message);
        // console.log("error", "Error!", "No data");
      }
    },
    error: function ({ responseJSON }) {},
  });

  $.ajax({
    url: apiURL + "purchase-order/charts/po_monthly_spent",
    type: "GET",
    dataType: "json",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
    success: function (responseData) {
      if (responseData) {
        console.log(responseData);

        var areaChartData = {
          labels: Object.keys(responseData),
          datasets: [
            {
              // category
              label: "Purchase Order Per Month",
              backgroundColor: "rgba(60,141,188,0.9)",
              borderColor: "rgba(60,141,188,0.8)",
              pointRadius: false,
              pointColor: "#3b8bba",
              pointStrokeColor: "rgba(60,141,188,1)",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(60,141,188,1)",
              // value
              data: Object.values(responseData),
            },
          ],
        };

        var barChartCanvas = $("#barChart").get(0).getContext("2d");
        var barChartData = $.extend(true, {}, areaChartData);
        var temp0 = areaChartData.datasets[0];
        barChartData.datasets[0] = temp0;

        var barChartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          datasetFill: false,
        };

        new Chart(barChartCanvas, {
          type: "line",
          data: barChartData,
          options: barChartOptions,
        });
      } else {
        // notification("error", "Error!", responseData.message);
        console.log("error", "Error!", "No data");
      }
    },
    error: function ({ responseJSON }) {},
  });
};


// purchase order datatable
loadOrdersTable = () => {
  $.ajaxSetup({
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
  });
  $("#data-table-orders").dataTable().fnClearTable();
  $("#data-table-orders").dataTable().fnDraw();
  $("#data-table-orders").dataTable().fnDestroy();
  $("#data-table-orders").DataTable({
    ajax: { url: apiURL + "purchase-order/", dataSrc: "" },
    aLengthMenu: [5, 10, 20, 30, 50, 100],

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
        data: "total_amount",
        name: "total_amount",
        searchable: true,
        width: "10%",
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
              '<label class="text-left badge badge-warning p-2 w-auto"> ' +
              aData.status +
              "</label> ";
            return status;
          } else if (aData.status === "Confirmed") {
            let status =
              '<label class="text-left badge badge-primary p-2 w-auto"> ' +
              aData.status +
              "</label> ";
            return status;
          } else {
            let status =
              '<label class="text-left badge badge-danger p-2 w-auto"> ' +
              aData.status +
              "</label> ";
            return status;
          }
        },
      },

      // {
      //   data: null,
      //   width: "10%",
      //   render: function (aData, type, row) {
      //     let buttons = "";
      //     buttons +=
      //       '<div class="text center dropdown"><div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
      //       '<i class="fas fa-ellipsis-v"></i></div><div class="dropdown-menu dropdown-menu-right">' +

      //       //view
      //       '<div class="dropdown-item d-flex role="button" onClick="return poInfo(\'' +
      //       aData["id"] +
      //       "',0)\">" +
      //       '<div style="width: 2rem"> <i class= "fas fa-eye mr-1"></i></div>' +
      //       "<div>View</div></div>" +

      //       "</div></div>";
      //     return buttons; // same class in i element removed it from a element
      //   },
      // },
    ],
  });
};

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

// view/edit purchase order
poInfo = (id) => {
  $("#modal-po").modal("show");
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

        $("#po_vendor_name").html(data.vendor["vendor_name"]);
        // $("#po_vendor_address").html(data..u_created_by["street"]);
        // $("#po_vendor_city").html(data.vendor_proposal.u_created_by["city"]);

        $("#order_date").val(
          //.val
          moment(data["order_date"]).format("MMMM D, YYYY")
        );

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

              //action
              // '<div class="text center dropdown"> <div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
              //   '<i class="fas fa-ellipsis-v"></i></div> <div class="dropdown-menu dropdown-menu-right">' +
              //   // view
              //   '<div class="dropdown-item d-flex" role="button" data-toggle="modal" data-target="#modal-add-new-product" data-toggle="modal" onClick="return editPrDetail( \'' +
              //   data.vendor_bidding_item[i].id +
              //   '\',this.parentNode.parentNode.parentNode.parentNode);"><div style="width: 2rem"> <i class="fas fa-eye mr-1"></i></div><div> View</div></div>' +
              //   // remove
              //   '<div class="dropdown-item d-flex" role="button" data-toggle="modal" onClick="return removePrDetail(this.parentNode.parentNode.parentNode, \'' +
              //   "" +
              //   "', '" +
              //   data.vendor_bidding_item[i].id +
              //   '\');"><div style="width: 2rem"> <i class="fas fa-trash mr-1"></i></div><div> Remove</div></div>' +
              //   "</div></div>",
            ])
            .draw();
        }

        $(
          "#form_po input[type='number'],input[type='text'],input[type='date'], select, textarea"
        ).prop("disabled", true);
      } else {
        // notification("error", "Error!", responseData.message);
        console.log("error", "Error!", responseData.success);
      }
    },
    error: function ({ responseJSON }) {},
  });
};

// top vendor datatable
loadTopVendorTable = () => {
  $.ajaxSetup({
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
  });
  $("#data-table-top-vendor").dataTable().fnClearTable();
  $("#data-table-top-vendor").dataTable().fnDraw();
  $("#data-table-top-vendor").dataTable().fnDestroy();
  $("#data-table-top-vendor").DataTable({
    ajax: {
      url: apiURL + "vendor-evaluation/datatable/vendor-total-order",
      dataSrc: "",
    },
    aLengthMenu: [5, 10, 20, 30, 50, 100],

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
        data: "purchase_order",
        name: "purchase_order",
        searchable: true,
        width: "10%",
        // className: "dtr-control",
      },
    ],
  });
};

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

// load payment methods
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

// print purchase order

$(document).on("click", ".print", function () {
  const content_wrapper = $(".content-wrapper");
  const content_header = $(".content-header").detach();
  const content = $(".content").detach();
  const modal_content = $(".po-report-modal-content");

  const modalHeader = $(".po-report-modal-header");
  const modalBody = $(".po-report-modal-body").detach();
  const modalFooter = $(".po-report-modal-footer");

  $("footer").hide();

  content_wrapper.append(modalBody);
  $("#modal-po").hide();
  window.print();
  $("#modal-po").show();
  modal_content.empty();
  content_wrapper.empty();
  content_wrapper.append(content_header);

  content_wrapper.append(content);
  modal_content.append(modalHeader);
  modal_content.append(modalBody);
  modal_content.append(modalFooter);

  $("footer").show();
});
