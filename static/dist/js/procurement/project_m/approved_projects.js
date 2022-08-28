$(function () {
    // getRFQNo()
  
    // load approvd project request
    loadTableApproved();
  
  
  
  });
  
  
 // all approved project request
  loadTableApproved = () => {
    $.ajaxSetup({
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + localStorage.getItem("TOKEN"),
        ContentType: "application/x-www-form-urlencoded",
      },
    });
    // '+status+'
    $("#data-table-approved").dataTable().fnClearTable();
    $("#data-table-approved").dataTable().fnDraw();
    $("#data-table-approved").dataTable().fnDestroy();
    $("#data-table-approved").DataTable({
      ajax: { url: apiURL + "project-request/status/Approved", dataSrc: "" },
  
      responsive: true,
      serverSide: false,
      dataType: "json",
      type: "GET",
      columns: [

        {
          data: "name",
          name: "name",
          searchable: true,
          width: "10%",
          // className: "dtr-control",
        },
        {
            data: "background",
            name: "background",
            searchable: true,
            width: "55%",
            // className: "dtr-control",
          },

       
       
        {
          data: null,
          name: null,
          searchable: true,
          width: "10%",
          render: function (aData, type, row) {
            // return new Date(aData.purchase_requesition.created_at)
            //   .toString()
            //   .slice(0, 24);
            return moment(aData["start_date"]).format("MMMM D, YYYY");
          },
        },
        {
            data: null,
            name: null,
            searchable: true,
            width: "10%",
            render: function (aData, type, row) {
              // return new Date(aData.purchase_requesition.created_at)
              //   .toString()
              //   .slice(0, 24);
              return moment(aData["end_date"]).format("MMMM D, YYYY");
            },
          },
        {
          data: null,
          name: null,
          searchable: true,
          width: "10%",
          render: function (aData, type, row) {
           
              let status =
                '<label class="text-left badge badge-primary p-2 w-auto"> ' +
                aData.approval_status +
                "</label> ";
              return status;
         
            
          },
        },
        // {
        //   data: null,
        //   width: "5%",
        //   render: function (aData, type, row) {
        //     let buttons = "";
        //     // info
        //     buttons +=
        //       '<div class="text center dropdown"><div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
        //       '<i class="fas fa-ellipsis-v"></i></div><div class="dropdown-menu dropdown-menu-right">';
        //     //view
        //     buttons +=
        //       '<div class="dropdown-item d-flex role="button" onClick="return dataInfo(\'' +
        //       aData["id"] +
        //       "',0)\">" +
        //       '<div style="width: 2rem"> <i class= "fas fa-file-alt mr-1"></i></div>' +
        //       "<div> View</div></div>";
  
        //     buttons += "</div></div>";
  
        //     return buttons; // same class in i element removed it from a element
        //   },
        // },
      ],
    });
  };
  
  // view prject request
  dataInfo = (id, type) => {
    $("#modal-xl").modal("show");
  
    //   console.log(id);
    $.ajax({
      url: apiURL + "project-request/" + id,
      type: "GET",
      dataType: "json",
      success: function (data) {
        if (data) {
      
            console.log(data)
  
       
          if (type == 0) {
            $(".print").hide();
          } else {
            $(".print").show();
            $(".print").html("Print" + '<i class="fas fa-print ml-1"></i>');
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
  
