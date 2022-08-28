$(function () {
  // load datatable

  loadTable("", "", "");

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

      if ($("#pr_status").val() != "") {
        loadTable(date_start, date_end, $("#pr_status").val());
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

// all purchase request
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
      "purchase-requisition/filtered/pr/reports/" +
      date_start +
      "/" +
      date_end +
      "/" +
      status;
  } else if (date_start != "" && status == "") {
    filteredURL =
      apiURL +
      "purchase-requisition/filtered/pr/reports/" +
      date_start +
      "/" +
      date_end +
      "/none";
  } else if (date_start == "" && status != "") {
    filteredURL =
      apiURL + "purchase-requisition/filtered/pr/reports/none/none/" + status;
  } else {
    filteredURL =
      apiURL + "purchase-requisition/filtered/pr/reports/none/none/none";
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
          return aData.u_created_by.employees.first_name +" "+aData.u_created_by.employees.last_name;
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
          // info
          buttons +=
            '<div class="text center dropdown"><div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
            '<i class="fas fa-ellipsis-v"></i></div><div class="dropdown-menu dropdown-menu-right">' +
            //view
            '<div class="dropdown-item d-flex" role="button" data-toggle="modal" data-target="#modal-print" role="button" onClick="return dataInfo(\'' +
            aData["id"] +
            "')\">" +
            '<div style="width: 2rem"> <i class= "fas fa-file-alt mr-1"></i></div>' +
            "<div> View</div></div>" +
            "</div></div>";

          return buttons; // same class in i element removed it from a element
        },
      },
    ],
  });
};

// view purchase requisition
dataInfo = (id, type) => {
  $("#pr-detail-table").dataTable().fnClearTable();
  $("#pr-detail-table").dataTable().fnDraw();
  $("#pr-detail-table").dataTable().fnDestroy();
  prd_table = $("#pr-detail-table").DataTable({
    info: false,
    paging: false,
    searching: false,
    ordering: false,
  });

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

        if(data["status"] != "Pending"){

          $("#given_budget").html( "\u20B1" +numberWithCommas(data["given_budget"]));
        }

        // console.log(data.purchase_requisition_detail[0].item.item_name)
        // console.log(data.purchase_requisition_detail[0].item.item_category.category_name)
        prd_table.clear().draw();

        // Loop here
        for (var pr_item in data.purchase_requisition_detail) {
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
      } else {
        notification("error", "Error!", data.detail);

        console.log("error" + data);
        loadTable();
      }
    },
    error: function ({ responseJSON }) {},
  });
};

// print purchase requisition
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

// update datatable on change of status
$("[name=pr_status]").on("change", function () {
  pr_status = $(this).val();

  if ($("#start_date").val() != "") {
    loadTable($("#start_date").val(), $("#end_date").val(), pr_status);
  } else {
    loadTable("none", "none", pr_status);
  }
});
