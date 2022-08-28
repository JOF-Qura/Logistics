// NOT USED

$(function () {


    loadTable();
   
  
  });



  
// datatable
loadTable = () => {
        $.ajaxSetup({
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem('TOKEN'),
            ContentType: "application/x-www-form-urlencoded",
          },
        });
      $("#data-table").dataTable().fnClearTable();
      $("#data-table").dataTable().fnDraw();
      $("#data-table").dataTable().fnDestroy();
      $("#data-table").DataTable({
        ajax: { url: apiURL + "vendor-evaluation/vendor-results/" + localStorage.getItem("ID"), dataSrc: "" },
        
        responsive: true,
        serverSide: false,
        dataType: "json",
        type: "GET",
        columns: [
          {
            data: null,
            name: null,
            searchable: true,
            width: "5%",
            render: function (aData, type, row) {
            return moment(aData.date).format("MMMM D, YYYY")

            }
          },
     
          {
            data: "product_quality",
            name: "product_quality",
            searchable: true,
            width: "10%",
            // className: "dtr-control",
          },
          {
            data: "user_satisfaction",
            name: "user_satisfaction",
            searchable: true,
            width: "10%",
        },
        {
            data: "on_time_delivery",
            name: "on_time_delivery",
            searchable: true,
            width: "10%",
        },
        {
            data: "product_defect",
            name: "product_defect",
            searchable: true,
            width: "10%",
        },
          {
            data: "message",
            name: "message",
            searchable: true,
            width: "25%",
            // className: "dtr-control",
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
                '<div class="dropdown-item d-flex role="button" onClick="return editData(\'' +
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
    
    
    // function to show details for viewing/updating
    editData = (id, type) => {
        $(".is-invalid").removeClass("is-invalid");
        $(".is-valid").removeClass("is-valid");
      
        $("#modal-xl").modal("show");
      
        $.ajax({
          url: apiURL + "vendor-evaluation-result/" + id,
          type: "GET",
          dataType: "json",
          success: function (data) {
            if (data) {
              $("#uuid").val(data["id"]);
              $("#product_quality").val(data["product_quality"]);
              $("#user_satisfaction").val(data["user_satisfaction"]);
              $("#on_time_delivery").val(data["on_time_delivery"]);
              $("#product_defect").val(data["product_defect"]);
      
              $("#defect_comments").val(data["defect_comments"]);
              $("#message").val(data["message"]);
         
      
      
                $("#form_id input, select, textarea").prop("disabled", true);
             
             
        
            } else {
              notification("error", "Error!", data.message);
            }
          },
          error: function (data) {},
        });
      };