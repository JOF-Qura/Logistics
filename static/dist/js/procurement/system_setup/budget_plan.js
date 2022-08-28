

var sessionVar = [];

$(function () {
  // load datatable
  sessionVar.push(sessionStorage.getItem('departmentID'));
  if (sessionVar[0] == undefined) window.location.replace(apiURL + 'department_page'); 

  sessionVar.push(sessionStorage.getItem('department_name'));

  // set department name to text
  $("#department_name").text(sessionVar[1] + " Budget Plan");

    let startYear = 2060;
    let endYear = new Date().getFullYear();
    let yearOptions = ""
    for (i = endYear; i < startYear; i++)
    {
      yearOptions+= '<option value="'+i+'">'+i+'</option>'
    
    }
    $('#year').append(yearOptions);


    $('#curr_year').html(`Year ${new Date().getFullYear()} budget`)
    $("#year").on("change", function () {

    $("#date_from").val("January 1, "+$('#year').val())
    $("#date_to").val("December 31, "+$('#year').val())


  })
  
  
  loadTable();

  // submit form
  $("#form_id")
    .on("submit", function (e) {
      e.preventDefault();
      // trimInputFields();
    })
    .validate({
      rules: {
        // simple rule, converted to {required:true}
        budget: {
          required: true,
        },
        // compound rule
        quarter: {
          required: true,
        },
        date_from: {
          required: true,
        },
        // compound rule
        date_to: {
          required: true,
        },

      },
      messages: {
        budget: {
          required: "please provide a budget",
        },

        year: {
          required: "please provide a year",
        },
        date_from: {
          required: "please provide a date from",
        },

        date_to: {
          required: "please provide a date to",
        },
     
      },
      errorElement: "span",
      errorPlacement: function (error, element) {
        error.addClass("invalid-feedback");
        element.closest(".form-group").append(error);
      },
      highlight: function (element, errorClass, validClass) {
        $(element).addClass("is-invalid");
      },
      unhighlight: function (element, errorClass, validClass) {
        $(element).removeClass("is-invalid");
        $(element).addClass("is-valid");
      },
      submitHandler: function () {
        // var form_data = new FormData(this);
        // var form_data = new FormData(document.getElementById("form_id"));
        // console.log(form_data);

        if ($("#uuid").val() == "") {
          // add record

          $.ajax({
            url: apiURL + "budget-plan/",
            type: "POST",
            // data: form_data,
            contentType: "application/json",
            data: JSON.stringify({
                year: $("#year").val(),
                given_budget: $("#budget").val(),
              
                date_from:  moment(moment($("#date_from").val(), ['DDMMMMY', 'MMMMDDY']).format()).format('YYYY-MM-DD'),
                date_to: moment(moment($("#date_to").val(), ['DDMMMMY', 'MMMMDDY']).format()).format('YYYY-MM-DD'),
                department_id: sessionVar[0],
            }),
            dataType: "json",
            // contentType: false,
            processData: false,
            cache: false,
            headers: {
            	Accept: "application/json",
            	Authorization: "Bearer " + localStorage.getItem("TOKEN"),
            },
            success: function (data) {
              if (data) {
                notification("success", "Created!", "Budget Successfuly Created");
                console.log(data);
                console.log("success");
                $("#modal-xl").modal("hide");
               knobFunction(); 

                loadTable();
              } else {
                notification("error", "Error!", "Error creating budget");
                // console.log("error");
              }
            },
            error: function ({ responseJSON }) {
              notification("error", "Error!", responseJSON.detail);

              console.log(responseJSON.detail);
            },
          });
        } else {
          // update record
          $.ajax({
            url: apiURL + "budget-plan/" + $("#uuid").val(),
            type: "PUT",
            // data: form_data,
            contentType: "application/json",
            data: JSON.stringify({
              year: $("#year").val(),
              given_budget: $("#budget").val(),

              date_from:  moment(moment($("#date_from").val(), ['DDMMMMY', 'MMMMDDY']).format()).format('YYYY-MM-DD'),
              date_to: moment(moment($("#date_to").val(), ['DDMMMMY', 'MMMMDDY']).format()).format('YYYY-MM-DD'),
              department_id: sessionVar[0],
            }),
            dataType: "json",
            // contentType: false,
            processData: false,
            cache: false,
            success: function (data) {
              if (data) {
                notification("success", "Updated!", "Budget Successfuly Updated");
                console.log("success " + data);

                $("#modal-xl").modal("hide");
                // formReset("hide");
                loadTable();
                // $("#photo_path_placeholder").attr(
                //   "src",
                //   "https://avatars.dicebear.com/api/bottts/smile.svg"
                // );
              } else {
                console.log("error " + data.message);
                
              }
            },
            error: function ({ responseJSON }) {
              notification("error", "Error!", responseJSON.detail);

            },
          });
        }
      },
    });
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
    ajax: { url: apiURL + "budget-plan/datatable/" + sessionVar[0], dataSrc: "" },

    responsive: true,
    serverSide: false,
    dataType: "json",
    type: "GET",
    columns: [
      // {
      //   data: "id",
      //   name: "id",
      //   searchable: true,
      //   width: "20%",
      //   // className: "dtr-control",
      // },
      {
        data: null,
        name: null,
        searchable: true,
        width: "20%",
        // className: "dtr-control",
        render: function (aData, type, row) {
          return "\u20B1" + numberWithCommas(aData.given_budget)
        },
      },

      {
        data: "year",
        name: "year",
        searchable: true,
        width: "10%",
      },

      {
        data: null,
        name: null,
        searchable: true,
        width: "20%",
        render: function (aData, type, row) {
          return moment(aData["date_from"]).format(
            "MMMM D, YYYY")
        },
      },
      {
        data: null,
        name: null,
        searchable: true,
        width: "20%",
        render: function (aData, type, row) {
          return moment(aData["date_to"]).format(
            "MMMM D, YYYY")
        },
      },
      {
        data: null,
        width: "20%",
        render: function (aData, type, row) {
          let buttons = "";
          buttons +=
          '<div class="text center dropdown"><div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">'+
          '<i class="fas fa-ellipsis-v"></i></div><div class="dropdown-menu dropdown-menu-right">'+
        //view
        '<div class="dropdown-item d-flex role="button" onClick="return editData(\'' +
        aData["id"] + '\',0)">'+
        '<div style="width: 2rem"> <i class= "fas fa-eye mr-1"></i></div>'+
        '<div> View</div></div>'+
        //edit
          '<div class="dropdown-item d-flex role="button" onClick="return editData(\'' +
          aData["id"] + '\',1)">'+
          '<div style="width: 2rem"> <i class= "fas fa-edit mr-1"></i></div>'+
          '<div> Edit</div></div>'+
          //delete
      
        '<div class="dropdown-item d-flex role="button" data-toggle="modal" data-target="#modal-status" onClick="return deleteData(\'' +
        aData["id"] + '\')"  >'+
        '<div style="width: 2rem"> <i class= "fas fa-trash mr-1"></i></div>'+
        '<div> Delete</div></div>'+
          '</div></div>';
            return buttons; // same class in i element removed it from a element
        },
      },
    ],
  });
};


// show modal of create
addData = () => {
  $("#modal-xl").modal("show");
  $(".submit").show();
  ;
  $("#form_id input, select, textarea").prop("disabled", false);
  $("#form_id input, select, textarea").val("");
  $(".modal-title").html("Add Budget Plan");

  $(".is-invalid").removeClass("is-invalid")
  $(".is-valid").removeClass("is-valid")

  $(".submit").html("Submit" + '<i class="fas fa-check ml-1"></i>');
};

// function to show details for viewing/updating
editData = (id, type) => {
  $(".is-invalid").removeClass("is-invalid")
  $(".is-valid").removeClass("is-valid")

  $("#modal-xl").modal("show");

  $.ajax({
    url: apiURL + "budget-plan/" + id,
    type: "GET",
    dataType: "json",
    success: function (data) {
      if (data) {

        $("#uuid").val(data["id"]);
        $("#year").val(data["year"]).trigger("change");
        $("#budget").val(data["given_budget"]);
        $("#date_from").val(moment(data["date_from"]).format(
          "MMMM D, YYYY"));
        $("#date_to").val(moment(data["date_to"]).format(
          "MMMM D, YYYY"));
        // $("#department_id").val(data["department_id"]);


        // setTimeout(() => {
        // 	$("#section_id").val(data.data["section_id"]).trigger("change");
        // }, 1500);

        // if data is for viewing only
        if (type == 0) {
          $("#form_id input, select, textarea").prop("disabled", true);
          $(".modal-title").html("View Budget Plan");
          $(".submit").hide();
        } else {
          $("#form_id input, select, textarea").prop("disabled", false);
          // $("#form_id button").prop("disabled", false);
          $(".submit").show();
          $(".modal-title").html("Update Budget Plan");
          $(".submit").html("Update" + '<i class="fas fa-check ml-1"></i>');

        }
      } else {
        notification("error", "Error!", data.message);
      }
    },
    error: function (data) {},
  });
};

// function to delete data
deleteData = (id) => {
  $("#modal-default").modal("show");
  $(".modal-title").html("Delete Budget Plan");
  $("#del_uuid").val(id);
};

deleteData2 = (id) => {
  id = $("#del_uuid").val();
  $("#modal-default").modal("hide");

  console.log(id);
  $.ajax({
    url: apiURL + "budget-plan/delete/" + id,
    type: "DELETE",
    dataType: "json",
    success: function (data) {
      if (data) {
        // notification("success", "Success!", data.message);
        console.log("success" + data);
        loadTable();
      } else {
        notification("info", "Deleted!", "Record Deleted");

        console.log("error" + data);
        loadTable();
      }
    },
    error: function ({ responseJSON }) {},
  });
};


$(function () {
  /* jQueryKnob */
// load budget plan chart of specific department
  $.ajax({
    url: apiURL + "budget-plan/charts/" + sessionStorage.getItem('departmentID') +"/"+ new Date().getFullYear(),
    type: "GET",
    dataType: "json",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
    },
    success: function (data) {
      if (data) {
        let percent = 100 - (data.total_spent / data.given_budget * 100)
    
        $('#budget_percent').val(Math.round(percent))
        $('#given_budget').html("\u20B1" + numberWithCommas(data.given_budget))
        $('#total_spent').html("\u20B1" + numberWithCommas(data.total_spent))
        $('#remaining').html("\u20B1" + numberWithCommas(data.given_budget - data.total_spent))

       

      } else {
        // notification("error", "Error!", "Error");

        console.log("error" + data);
        loadTable();
      }
    },
    complete: function (data) {
      knobFunction(); 
     },
    error: function ({ responseJSON }) {},
  });

  // load mothly spent of department

  $.ajax({
    url: apiURL + "budget-plan/dept-spent/" +sessionStorage.getItem('departmentID') +"/"+ new Date().getFullYear(),
    type: "GET",
    dataType: "json",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
    success: function (responseData) {
      if (responseData) {
        console.log(Object.keys(responseData))
        // console.log(Object.values(responseData))

        var areaChartData = {
            labels: Object.keys(responseData).reverse(),
            datasets: [
              {
                // category
                label: "Monthly Spent",
                // backgroundColor: "rgba(60,141,188,0.9)",
                borderColor: "rgba(60,141,188,0.8)",
                pointRadius: false,
                pointColor: "#3b8bba",
                pointStrokeColor: "rgba(60,141,188,1)",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(60,141,188,1)",
                fill:false,

                // value
                data: Object.values(responseData).reverse(),
              },
   
            ],
          };

        var lineChartCanvas = $("#request_per_month_line").get(0).getContext("2d");
        var lineChartData = $.extend(true, {}, areaChartData);
        var temp0 = areaChartData.datasets[0];
        lineChartData.datasets[0] = temp0;
    

        var lineChartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          datasetFill: false,
        };

        new Chart(lineChartCanvas, {
          type: "line",
          data: lineChartData,
          options: lineChartOptions,
        });
      } else {
        // notification("error", "Error!", responseData.message);
        console.log("error", "Error!", responseData.success);
      }
    },
    error: function ({ responseJSON }) {},
  });

})

knobFunction = () => {
  
  $('.knob').knob({

     readOnly: true,
     format : function (value) {
      return value + '%';
   }
 
  })
  /* END JQUERY KNOB */

}