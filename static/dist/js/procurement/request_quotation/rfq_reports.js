$(function () {
    // load datatable
    $(".select2").select2();
  
    loadTable("","","");
    pr_detail_table_quotation();
    // var table =  $('#data-table').DataTable();

    //Date range as a button
    $('#reservation').daterangepicker(
      {
        ranges   : {
          // 'All'       : [moment().subtract(1, 'year').startOf('year'), moment().endOf('year')],
          'Today'       : [moment(), moment()],
          'Yesterday'   : [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
          'Last 7 Days' : [moment().subtract(6, 'days'), moment()],
          'Last 30 Days': [moment().subtract(29, 'days'), moment()],
          'This Month'  : [moment().startOf('month'), moment().endOf('month')],
          'This Year'  : [moment().startOf('year'), moment().endOf('year')],
          'Last Month'  : [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
          'Last Year'  : [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],

        },
        startDate: moment().subtract(29, 'days'),
        endDate  : moment()
      },
      function (start, end) {
        date_start = start.format('YYYY-MM-DD');
        console.log(date_start)
        date_end = end.format('YYYY-MM-DD');
        $('#start_date').val(date_start)
        $('#end_date').val(date_end)
        console.log(moment(date_start, ['DDMMMMY', 'MMMMDDY']).format())
  
        if($("#rfq_status").val() != ""){
        loadTable(date_start,date_end,$("#rfq_status").val() );
  
        }
        else{
  
          loadTable(date_start,date_end,"");
        }
  
  
        $('#reportrange').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'))
  
        // $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'))
      }
    )
  });
  
  // request for quotation datatable
loadTable = (date_start,date_end,status) => {
    $.ajaxSetup({
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + localStorage.getItem("TOKEN"),
        ContentType: "application/x-www-form-urlencoded",
      },
    });
    if(date_start != "" && status !=""){
        filteredURL = apiURL + "request-quotation/filtered/rfq/reports/"+date_start+"/"+date_end+"/"+status
       }

       else if(date_start != "" && status == ""){
        filteredURL = apiURL + "request-quotation/filtered/rfq/reports/"+date_start+"/"+date_end+"/none"

       }
       else if(date_start == "" && status !=""){
        filteredURL = apiURL + "request-quotation/filtered/rfq/reports/none/none/"+status 

       }
       else{
        filteredURL = apiURL + "request-quotation/filtered/rfq/reports/none/none/none" 
         
       }
    $("#data-table").dataTable().fnClearTable();
    $("#data-table").dataTable().fnDraw();
    $("#data-table").dataTable().fnDestroy();
    $("#data-table").DataTable({
      ajax: { url: filteredURL, dataSrc: "" },
  
      dom: 'Bfrtip',

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
          data: "quotation_code",
          name: "quotation_code",
          searchable: true,
          width: "10%",
        },
        {
          data: null,
          name: null,
          searchable: true,
          width: "10%",
          render: function (aData, type, row) {
            return formatRfqNo(aData.request_quotation_number);
          },
        },
  
        {
          data: null,
          name: null,
          searchable: true,
          width: "10%",
          render: function (aData, type, row) {
            return aData.u_created_by.employees.first_name + " " + aData.u_created_by.employees.last_name;
          },
        },
        {
          data: null,
          name: null,
          searchable: true,
          width: "15%",
          render: function (aData, type, row) {
            return moment(aData["created_at"]).format("MMMM D, YYYY");
          },
        },
        {
          data: null,
          name: null,
          searchable: true,
          width: "15%",
          render: function (aData, type, row) {
            if (aData.status === "On Going") {
              let status =
                '<label class="text-left badge badge-primary p-2 w-100"> ' +
                aData.status +
                "</label> ";
              return status;
            }else {
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
              '<i class="fas fa-ellipsis-v"></i></div><div class="dropdown-menu dropdown-menu-right">';
            //view
            buttons +=
              '<div class="dropdown-item d-flex role="button" data-toggle="modal" data-target="#modal-print" onClick="return editData(\'' +
              aData["id"] +
              "',0)\">" +
              '<div style="width: 2rem"> <i class= "fas fa-eye mr-1"></i></div>' +
              "<div> View</div></div>";
  
    
            buttons += "</div></div>";
            return buttons; // same class in i element removed it from a element
          },
        },
      ],
    });
  };

  $("[name=rfq_status]").on("change", function () {
    rfq_status = $(this).val();

   if( $('#start_date').val() != ""){
    loadTable($('#start_date').val(),$('#end_date').val(),rfq_status)

    
  }
  else{
    loadTable("none","none",rfq_status)

  
  }
});

// item details table
pr_detail_table_quotation = () => {
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

// function to show details for viewing/updating
editData = (id, type) => {
  $.ajax({
    url: apiURL + "request-quotation/" + id,
    type: "GET",
    dataType: "json",
    success: function (data) {
      if (data) {
        // console.log(data);
        $("#related_files_body").empty();
        let related_files_body = "";
        for (let i in data.related_documents) {
          // console.log(data.related_documents[i].attachment)

          related_files_body +=
            "<div >" +
            "<li>" +
            '<a href="#modal-file" data-toggle="modal" onClick="return showFileModal(this,1,\'' +
            data.related_documents[i].attachment +
            '\')" data-id="' +
            data.related_documents[i].attachment +
            '" class="btn-link text-dark"><i class="far fa-fw fa-file-word"></i> ' +
            data.related_documents[i].attachment +
            "</a>" +
            "</li></div>";
        }

     

        $('#vendors_involved').empty()
        let vendor_involved = "";
        for (let i in data.request_quotation_vendor) {
          vendor_involved += '<li class="mt-2">'+data.request_quotation_vendor[i].vendor.vendor_name+'<br>'+'</li>'
          console.log(data.request_quotation_vendor[i])
        }
        $('#vendors_involved').append(vendor_involved)

        
        prd_table.clear().draw();

        for (var pr_item in data.purchase_requisition.purchase_requisition_detail) {
          if (data.purchase_requisition.purchase_requisition_detail[pr_item].product_id === null) {
            prd_table.row
              .add([
                data.purchase_requisition.purchase_requisition_detail[pr_item].new_category,
                data.purchase_requisition.purchase_requisition_detail[pr_item].new_product_name,
                data.purchase_requisition.purchase_requisition_detail[pr_item].description,
                "\u20B1" + numberWithCommas(data.purchase_requisition.purchase_requisition_detail[pr_item].estimated_price),
                data.purchase_requisition.purchase_requisition_detail[pr_item].quantity,
                "\u20B1" + numberWithCommas(data.purchase_requisition.purchase_requisition_detail[pr_item].quantity * data.purchase_requisition.purchase_requisition_detail[pr_item].estimated_price),


              ])
              .draw();
          } else {
            prd_table.row
              .add([
                data.purchase_requisition.purchase_requisition_detail[pr_item].product.category
                  .category_name,
                data.purchase_requisition.purchase_requisition_detail[pr_item].product
                  .product_name,
                data.purchase_requisition.purchase_requisition_detail[pr_item].product.description,
                "\u20B1" + numberWithCommas(data.purchase_requisition.purchase_requisition_detail[pr_item].product.estimated_price),

                data.purchase_requisition.purchase_requisition_detail[pr_item].quantity,
                "\u20B1" + numberWithCommas(data.purchase_requisition.purchase_requisition_detail[pr_item].quantity * data.purchase_requisition.purchase_requisition_detail[pr_item].product.estimated_price),

              ])
              .draw();
          }
        }

        $('#vendor_involved').append(vendor_involved)

        $("#related_files_body").append(related_files_body);
        // formDataRFQ["vendor_id"] = "";
        // $("#status").val();
        $("#purchase_requisition_id")
          .val(data.purchase_requisition["id"])
          .trigger("change");
        $("#request_quotation_id").val(data["id"]);
        $("#request_quotation_id").val(data["id"]);
        $('#rfq_number').text(formatRfqNo(data.request_quotation_number))
        $("#message").val(data["message"]);
        $("#due_date").val(moment(data["due_date"]).format("MMMM D, YYYY"));
        $("#quotation_code").val(data["quotation_code"]);
        $("#prepared_by").val(data["prepared_by"]);
        $("#budget").val(data.purchase_requisition["given_budget"]);
      

      } else {
        notification("error", "Error!", data.message);
      }
    },
    error: function (data) {},
  });
};

// print request for quotation
$(document).on("click", ".print", function () {
  const content_wrapper = $(".content-wrapper");
  const content_header = $(".content-header").detach();
  const content = $(".content").detach();
  const modal_content = $(".rfq-report-modal-content");

  const modalHeader = $(".rfq-report-modal-header");
  const modalBody = $(".rfq-report-modal-body").detach();
  const modalFooter = $(".rfq-report-modal-footer");

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