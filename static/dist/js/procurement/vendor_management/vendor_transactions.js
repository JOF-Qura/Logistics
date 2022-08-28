const product_quality = [];
const on_time_delivery = [];
const product_defect = [];
const user_satisfaction = [];
// const reducer = (previousValue, currentValue) => parseInt(previousValue) + parseInt(currentValue);

var sessionVar = [];

$(function () {

  // load datatable
  sessionVar.push(sessionStorage.getItem('vendorID'));
  if (sessionVar[0] == undefined) window.location.replace(apiURL + 'vendor_page'); 

  sessionVar.push(sessionStorage.getItem('vendor_name'));

  $("#vendor_name").text(sessionVar[1] + " Transactions");

  // load datatable of purchase orders
  loadTable();
  loadTableProposals();

});

// datatable of vendor proposal
loadTableProposals = () => {
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
    ajax: {
      url: apiURL + "vendor-proposal/one-vendor-proposals/" +sessionVar[0],
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
        name: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {
          return moment(aData["created_at"]).format("MMMM D, YYYY");
        },
      },
      {
        data: null,
        searchable: null,
        width: "5%",
        render: function (aData, type, row) {
          return formatRfqNo(aData.request_quotation.request_quotation_number);
        },
      },
      {
        data: "u_created_by.vendor.vendor_name",
        name: "u_created_by.vendor.vendor_name",
        searchable: true,
        width: "10%",
      },
      // {
      //   data: null,
      //   name: null,
      //   searchable: true,
      //   width: "10%",
      //   render: function (aData, type, row) {
      //     return "\u20B1" + numberWithCommas(aData.subtotal);
      //   },
      // },
      {
        data: "prepared_by",
        name: "prepared_by",
        searchable: true,
        width: "10%",
        // render: function (aData, type, row) {
        //   return aData.discount + "%";
        // },
      },
      {
        data: "contact_no",
        name: "contact_no",
        searchable: true,
        width: "10%",
        // render: function (aData, type, row) {
        //   return aData.tax + "%";
        // },
      },
      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {
          return "\u20B1" + numberWithCommas(aData.total_amount);
        },
      },

      {
        data: null,
        name: null,
        searchable: true,
        width: "5%",
        render: function (aData, type, row) {
          if (aData.status === "Awarded") {
            let status =
              '<label class="text-left badge badge-primary p-2 w-100"> ' +
              aData.status +
              "</label> ";
            return status;
          } else if (aData.status === "Pending") {
            let status =
              '<label class="text-left badge badge-warning p-2 w-100"> ' +
              aData.status +
              "</label> ";
            return status;
          } else {
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
        width: "2%",
        render: function (aData, type, row) {
          let buttons = "";
          buttons +=
            '<div class="text center dropdown"><div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
            '<i class="fas fa-ellipsis-v"></i></div><div class="dropdown-menu dropdown-menu-right">';
          //view
          buttons +=
            '<div class="dropdown-item d-flex" role="button" onClick="return editData(\'' +
            aData["id"] +
            "',0)\">" +
            '<div style="width: 2rem"> <i class= "fas fa-eye mr-1"></i></div>' +
            "<div> View</div></div>";

          if (aData.status == "Pending") {
            //deactivate
            buttons +=
              '<div class="dropdown-item d-flex" role="button" data-toggle="modal" data-target="#modal-status" onClick="return deleteData(\'' +
              aData["id"] +
              "')\"  >" +
              '<div style="width: 2rem"> <i class= "fas fa-trash mr-1"></i></div>' +
              "<div> Deny</div></div>";
          }
          //activate
          // buttons +=
          //   '<div class="dropdown-item d-flex" role="button" data-toggle="modal" data-target="#modal-status" onClick="return deleteData(\'' +
          //   aData["id"] +
          //   "')\"  >" +
          //   '<div style="width: 2rem"> <i class="fas fa-redo"></i></div>' +
          //   "<div>Reactivate</div></div>";

          buttons += "</div></div>";

          return buttons;
        },
      },
    ],
  });
};

// datatable of purchase orders
loadTable = () => {
    $.ajaxSetup({
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + localStorage.getItem('TOKEN'),
        ContentType: "application/x-www-form-urlencoded",
      },
    });
  $("#data-table-orders").dataTable().fnClearTable();
  $("#data-table-orders").dataTable().fnDraw();
  $("#data-table-orders").dataTable().fnDestroy();
  $("#data-table-orders").DataTable({
    ajax: { url: apiURL + "purchase-order/vendor/"+ sessionStorage.getItem('vendorID'), dataSrc: "" },//+ sessionStorage.getItem('vendorID')
    
    responsive: true,
    serverSide: false,
    dataType: "json",
    type: "GET",
    columns: [
      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {
          return formatPoNo(aData.purchase_order_number);
        },
        // className: "dtr-control",formatPoNo
      },
  

      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {
          return moment(aData.order_date).format("MMMM D, YYYY");
        },
      },

      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {
          return moment(aData.expected_delivery_date).format("MMMM D, YYYY");
        },
      },

      {
        data: "payment_method.method_name",
        name: "payment_method.method_name",
        searchable: true,
        width: "10%",
        // className: "dtr-control",
      },
      {
        data: "total_amount",
        name: "total_amount",
        searchable: true,
        width: "10%",
        // className: "dtr-control",
      },
      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        // className: "dtr-control",
        render: function (aData, type, row) {
          if (aData.status === "Pending") {
            let status =
              '<label class="text-left badge badge-warning p-2 w-auto"> ' +
              aData.status +
              "</label> ";
            return status;
          }
          else if(aData.status === "Confirmed"){
            let status =
            '<label class="text-left badge badge-primary p-2 w-auto"> ' +
            aData.status +
            "</label> ";
          return status;
          }
          else{
            let status =
            '<label class="text-left badge badge-danger p-2 w-auto"> ' +
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
            '<i class="fas fa-ellipsis-v"></i></div><div class="dropdown-menu dropdown-menu-right">' +
         
            //view
            '<div class="dropdown-item d-flex role="button" onClick="return poInfo(\'' +
            aData["id"] +
            "',0)\">" +
            '<div style="width: 2rem"> <i class= "fas fa-eye mr-1"></i></div>' +
            "<div>View</div></div>" +
            //delete

            '<div class="dropdown-item d-flex role="button" data-toggle="modal" data-target="#modal-status" onClick="return deleteData(\'' +
            aData["id"] +
            "')\"  >" +
            '<div style="width: 2rem"> <i class= "fas fa-trash mr-1"></i></div>' +
            "<div> Cancel</div></div>" +
            "</div></div>";
          return buttons; // same class in i element removed it from a element
        },
      },
    ],
  });
};



// const getEvaluation = () => {
//   $.ajax({
//     url: apiURL + "vendor-performance-evaluation/" + sessionStorage.getItem('vendorID'),
//     type: "GET",
//     dataType: "json",
//     headers: {
//       Accept: "application/json",
//       Authorization: "Bearer " + localStorage.getItem("TOKEN"),
//     },
//     success: function (data) {
//       if (data) {
//           for(let i = 0; i<data.length; i++){
//             product_quality.push(data[i].product_quality)
//             on_time_delivery.push(data[i].on_time_delivery)
//             product_defect.push(data[i].product_defect)
//             user_satisfaction.push(data[i].user_satisfaction)

//             // console.log(data[i].product_quality)
//             // console.log(data[i].on_time_delivery)
//             // console.log(data[i].product_defect)
//             // console.log(data[i].user_satisfaction)
//           }
//         // sum * 100 / total-?? data.length * 5
//           console.log(product_quality.reduce(reducer))
//           console.log(on_time_delivery.reduce(reducer))
//           console.log(product_defect.reduce(reducer))
//           console.log(user_satisfaction.reduce(reducer))
//       } else {
//         notification("error", "Error!", "Error Retrieving Evaluation");
//       }
//     },
//     error: function ({ responseJSON }) {
//       // try{ notify('primary', responseJSON.message.join(), ''); }
//       // catch(ReferenceError) { window.location.replace(baseURL + 'Access/logout'); }
//     },
//   });
// };

