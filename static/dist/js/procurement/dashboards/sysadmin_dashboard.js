

$(function () {

    // load datatable
    loadTable();
  
  });
  


 // datatable
loadTable = () => {
    $.ajaxSetup({
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + localStorage.getItem("TOKEN"),
        ContentType: "application/x-www-form-urlencoded",
      },
    });
  $("#data-table").dataTable().fnClearTable();
  $("#data-table").dataTable().fnDraw();
  $("#data-table").dataTable().fnDestroy();
  $("#data-table").DataTable({
    ajax: { url: apiURL + "user", dataSrc: "" },
    
    responsive: true,
    serverSide: false,
    dataType: "json",
    type: "GET",
    columns: [

      {
        data: "email",
        name: "email",
        searchable: true,
        width: "20%",
      },

      {
        data: "user_types.name",
        name: "user_types.name",
        searchable: true,
        width: "10%",
        // className: "dtr-control",
      },

 

    ],
  });
};
