$(function () {
  // load datatable of purchase request
  loadTable();

  // load top vendor datatable
  loadTopVendorTable();

  // load purchase orders datatable
  loadOrdersTable();

  loadCharts();
});

// charts of count of purchase requeisition
loadCharts = () => {
  $.ajax({
    url: apiURL + "purchase-requisition/charts/count/none",
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
        $("#total_request").html(responseData.all_pr);
        $("#total_pending").html(responseData.pending_pr);
        $("#total_approved").html(responseData.approved_pr);
        $("#total_rejected").html(responseData.rejected_pr);
      } else {
        // notification("error", "Error!", responseData.message);
        console.log("error", "Error!", responseData.success);
      }
    },
    error: function ({ responseJSON }) {},
  });

  $.ajax({
    url: apiURL + "purchase-requisition/charts/pr_category/none",
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
        var pieChartCanvas = $("#request_by_category_pie")
          .get(0)
          .getContext("2d");
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
        console.log("error", "Error!", responseData.success);
      }
    },
    error: function ({ responseJSON }) {},
  });

  $.ajax({
    url: apiURL + "purchase-requisition/charts/pr_per_month",
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
              label: "Purchase Request Per Month",
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

        var barChartCanvas = $("#request_per_month_bar")
          .get(0)
          .getContext("2d");
        var barChartData = $.extend(true, {}, areaChartData);
        var temp0 = areaChartData.datasets[0];
        barChartData.datasets[0] = temp0;

        var barChartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          datasetFill: false,
        };

        new Chart(barChartCanvas, {
          type: "bar",
          data: barChartData,
          options: barChartOptions,
        });
      } else {
        // notification("error", "Error!", responseData.message);
        console.log("error", "Error!", responseData.success);
      }
    },
    error: function ({ responseJSON }) {},
  });
};

// load table of purchase-requisition
loadTable = () => {
  $.ajaxSetup({
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
  });
  // '+status+'
  $("#data-table-request").dataTable().fnClearTable();
  $("#data-table-request").dataTable().fnDraw();
  $("#data-table-request").dataTable().fnDestroy();
  $("#data-table-request").DataTable({
    ajax: {
      url: apiURL + "purchase-requisition/",
      dataSrc: "",
    },
    aLengthMenu: [3, 5, 20, 30, 50, 100],

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
          return (
            aData.u_created_by.employees.first_name +
            " " +
            aData.u_created_by.employees.last_name
          );
        },
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
    ],
  });
};

// PROCUREMENT OFFICER

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

  // total request for quotation
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

  // vendor total ratings

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
              backgroundColor: ["#669911", "#669911", "#669911"],
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

  // purchase order spent by category
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

  // chart of purchase order monthly spent
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
              label: "Purchase Request Per Month",
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
          type: "bar",
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
    ],
  });
};


// top vendors datatable
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
