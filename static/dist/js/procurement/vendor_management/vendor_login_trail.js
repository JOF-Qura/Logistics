$(function () {
  // load datatable

  loadTable("","","");
  
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

      if($("#vendor_id").val() != ""){
      loadTable(date_start,date_end,$("#vendor_id").val() );

      }
      else{

        loadTable(date_start,date_end,"");
      }


      $('#reportrange').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'))

      // $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'))
    }
  )
});



// login trail datatable
loadTable = (date_start,date_end,vendor_id) => {
  $.ajaxSetup({
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
  });
  if(date_start != "" && vendor_id !=""){
    filteredURL = apiURL + "vendor-time-log/"+date_start+"/"+date_end+"/"+vendor_id
   }

   else if(date_start != "" && vendor_id == ""){
    filteredURL = apiURL + "vendor-time-log/"+date_start+"/"+date_end+"/none"

   }
   else if(date_start == "" && vendor_id !=""){
    filteredURL = apiURL + "vendor-time-log/none/none/"+vendor_id 

   }
   else{
    filteredURL = apiURL + "vendor-time-log/none/none/none" 
     
   }

   console.log(filteredURL)
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
    // responsive: true, lengthChange: false, autoWidth: false,

    serverSide: false,
    dataType: "json",
    type: "GET",
    columns: [

      {
        data: "vendor.vendor_name",
        name: "vendor.vendor_name",
        searchable: true,
        width: "20%",
      },
      {
        data: "logged_type",
        name: "logged_type",
        searchable: true,
        width: "20%",
      },
      {
        data: null,
        name: null,
        searchable: true,
        width: "30%",
        render: function (aData, type, row) {
          return moment(aData["logged_date"]).format("MMMM D, YYYY") +'<br>'+moment(aData["logged_date"]).format("hh:mm A")
        },
      },


    
      {
        data: "client_ip",
        name: "client_ip",
        searchable: true,
        width: "30%",
      },
 
    ],
  });
};




$(document).on("click", ".print", function () {
  const content_wrapper = $(".content-wrapper");
  const content_header = $(".content-header").detach();
  const content = $(".content").detach();
  const modal_content = $(".pr-report-modal-content");
  
  const modalHeader = $(".pr-report-modal-header");
  const modalBody = $(".pr-report-modal-body").detach();
  const modalFooter = $(".pr-report-modal-footer");

  $("footer").hide()
  
  content_wrapper.append(modalBody);
  $("#modal-print").hide()
  window.print();
  $("#modal-print").show()
  modal_content.empty()
  content_wrapper.empty();
  content_wrapper.append(content_header);
  
  content_wrapper.append(content);
  modal_content.append(modalHeader);
  modal_content.append(modalBody);
  modal_content.append(modalFooter);
  
  $("footer").show()

});

// function to load vendor
loadVendor = () => {
  $.ajax({
    url: apiURL + "vendor/",
    type: "GET",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
    },
    dataType: "json",
    success: function (responseData) {
      if (responseData) {
        $("#vendor_id").empty();
        $("#vendor_id").append("<option value=''>All Vendor</option>")
        $.each(responseData, function (i, dataOptions) {
          var options = "";
          options =
            "<option value='" +
            dataOptions.id +
            "'>" +
            dataOptions.vendor_name +
            "</option>";

          $("#vendor_id").append(options);
        });
      } else {
        // notification("error", "Error!", responseData.message);
        console.log("error", "Error!", responseData.success);
      }
    },
    error: function ({ responseJSON }) {},
  });
};

loadVendor();



$("[name=vendor_id]").on("change", function () {
 vendor_id = $(this).val();

 if( $('#start_date').val() != ""){
  loadTable($('#start_date').val(),$('#end_date').val(),vendor_id)

  
}
else{
  loadTable("none","none",vendor_id)


}
});
