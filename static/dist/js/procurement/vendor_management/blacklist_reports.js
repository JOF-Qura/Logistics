$(function () {
  // load datatable
  loadTable("", "");

  // var table =  $('#data-table').DataTable();

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
      console.log(date_start);
      date_end = end.format("YYYY-MM-DD");
      $("#start_date").val(date_start);
      $("#end_date").val(date_end);
      console.log(moment(date_start, ["DDMMMMY", "MMMMDDY"]).format());

      loadTable(date_start, date_end);

      $("#reportrange").html(
        start.format("MMMM D, YYYY") + " - " + end.format("MMMM D, YYYY")
      );

      // $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'))
    }
  );
});

// blacklist reports
loadTable = (date_start, date_end) => {
  $.ajaxSetup({
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
  });
  if (date_start != "") {
    filteredURL =
      apiURL + "vendor/blacklist/reports/" + date_start + "/" + date_end + "";
  } else {
    filteredURL = apiURL + "vendor/blacklist/reports/none/none";
  }

  console.log(filteredURL);
  $("#data-table").dataTable().fnClearTable();
  $("#data-table").dataTable().fnDraw();
  $("#data-table").dataTable().fnDestroy();
  $("#data-table").DataTable({
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
    // responsive: true, lengthChange: false, autoWidth: false,

    serverSide: false,
    dataType: "json",
    type: "GET",
    columns: [
      {
        data: "vendor_name",
        name: "vendor_name",
        searchable: true,
        width: "20%",
      },
      {
        data: "email",
        name: "email",
        searchable: true,
        width: "20%",
      },

      {
        data: "remarks",
        name: "remarks",
        searchable: true,
        width: "20%",
      },
      {
        data: null,
        name: null,
        searchable: true,
        width: "30%",
        render: function (aData, type, row) {
          return moment(aData["created_at"]).format("MMMM D, YYYY");
        },
      },
    ],
  });
};
