

$(function () {

  console.log("aw")
    // load datatable
    loadTable();
    
  
  });
  


 // datatable
loadTable = () => {

  $("#data-table").dataTable().fnClearTable();
    $("#data-table").dataTable().fnDraw();
    $("#data-table").dataTable().fnDestroy();
    $("#data-table").dataTable({
        serverSide: true,
        // scrollX: true,
        responsive: false,
        buttons:[
            {extend: 'excel', text: 'Save to Excel File'}
        ],
        order: [[0, "desc"]],
        aLengthMenu: [5, 10, 20, 30, 50, 100],
        aaColumns: [
            { sClass: "text-left" },
            { sClass: "text-center" },
        ],
        columns: [
          {
            data: "user_email",
            name: "user_email",
            searchable: true,
            width: "20%",
          },
    
          {
            data: "user_type",
            name: "user_type",
            searchable: true,
            width: "10%",
            // className: "dtr-control",
          },
        ],
        ajax: 
        {
            url: '/auth',
            type: "GET",
            ContentType: "application/x-www-form-urlencoded",
        },
        fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) 
        {
            $("td:eq(0)", nRow).html(aData["user_email"]);
            $("td:eq(1)", nRow).html(aData["user_type"]);
        },
        drawCallback: function (settings) {
            // $("#data-table").removeClass("dataTable");
        },
    });


  //   $.ajaxSetup({
  //     headers: {
  //       Accept: "application/json",
  //       Authorization: "Bearer " + localStorage.getItem("TOKEN"),
  //       ContentType: "application/x-www-form-urlencoded",
  //     },
  //   });
  // $("#data-table").dataTable().fnClearTable();
  // $("#data-table").dataTable().fnDraw();
  // $("#data-table").dataTable().fnDestroy();
  // $("#data-table").DataTable({
  //   ajax: { 
  //     url: apiURL + "auth/", 
  //     type: "GET",
  //     ContentType: "application/x-www-form-urlencoded",
  //   },
    
  //   responsive: true,
  //   serverSide: false,
  //   dataType: "json",
  //   type: "GET",
  //   columns: [
  //     {
  //       data: "user_email",
  //       name: "user_email",
  //       searchable: true,
  //       width: "20%",
  //     },

  //     {
  //       data: "user_type",
  //       name: "user_type",
  //       searchable: true,
  //       width: "10%",
  //       // className: "dtr-control",
  //     },

 

  //   ],
  // });
};
