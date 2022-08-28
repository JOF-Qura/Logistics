

$(function () {
  // load datatable
  loadTable();

  loadCharts();

});

// chart of all count of purchase request
loadCharts = () => {
  $.ajax({
    url: apiURL + "purchase-requisition/charts/count/"+localStorage.getItem("DEPARTMENTID"),
    type: "GET",
    dataType: "json",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
    success: function (responseData) {
      if (responseData) {
        // console.log(responseData);
      $('#total_request').html(responseData.all_pr)
      $('#total_pending').html(responseData.pending_pr)
      $('#total_approved').html(responseData.approved_pr)
      $('#total_rejected').html(responseData.rejected_pr)

    
      } else {
        // notification("error", "Error!", responseData.message);
        console.log("error", "Error!", responseData.success);
      }
    },
    error: function ({ responseJSON }) {},
  });

  $.ajax({
    url: apiURL + "purchase-requisition/charts/pr_category/"+localStorage.getItem("DEPARTMENTID"),
    type: "GET",
    dataType: "json",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
    success: function (responseData) {
      if (responseData) {
          console.log(responseData)
        console.log(Object.keys(responseData));
        var pieChartCanvas = $("#request_by_category_pie").get(0).getContext("2d");
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

        var barChartCanvas = $("#request_per_month_bar").get(0).getContext("2d");
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
      url:
        apiURL +
        "purchase-requisition/datatable/" +
        localStorage.getItem("DEPARTMENTID"),
      dataSrc: "",
    },
    aLengthMenu: [5, 10, 20, 30, 50, 100],

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
          return aData.u_created_by.employees.first_name +" "+aData.u_created_by.employees.last_name
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
  
    ],
  });
};