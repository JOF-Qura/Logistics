const formDataDetail = {};
const formData = {};
purchase_order_items = [];

// datatable for purchase order items
po_items = () => {
  $("#po-detail-table").dataTable().fnClearTable();
  $("#po-detail-table").dataTable().fnDraw();
  $("#po-detail-table").dataTable().fnDestroy();
  po_detail_table = $("#po-detail-table").DataTable({
    info: false,
    // paging: false,
    responsive: true,
    aLengthMenu: [5, 10, 20, 30, 50, 100],
  });
};

// purchase order creation
const purchaseOrder = (id) => {
  $("#modal-po").modal("show");
  $(".submit-po").show();
  $("#payment_method_p").hide();
  $("#payment_method").show();

  $("#expected_delivery_date_p").hide();
  // $("#expected_delivery_date").show();

  // load selected vendor proposal
  $.ajax({
    url: apiURL + "vendor-proposal/" + id,
    type: "GET",
    dataType: "json",
    success: function (data) {
      if (data) {
        formReset("show");

        $("#uuid").val(data["id"]);

        $("#po_vendor_name").html("vendor_name");
        // $("#po_vendor_address").html(data.u_created_by["street"]);
        // $("#po_vendor_city").html(data.creu_created_byator["city"]);

        $("#order_date").val(moment(Date.now()).format("MMMM D, YYYY"));
        $("#vendor_proposal_id").val(data["id"]);

        $("#po_subtotal").html(data["subtotal"]);

        $("#po_discount").html(data["discount"]);
        $("#po_tax").html(data["tax"]);
        $("#po_total").html(data["total_amount"]);

        // $("#po_notes").html(data["notes"]);

        po_detail_table.clear().draw();

        // Loop here
        for (let i in data.vendor_bidding_item) {
          po_detail_table.row
            .add([
              // product pic

              // '<label class="text-center badge badge-secondary p-2 w-auto"><i class="fas fa-file-image"></i></label> ',
              // product catagory
              data.vendor_bidding_item[i].category.category_name,

              // product name
              data.vendor_bidding_item[i].product_name,

              // product description
              // data.vendor_bidding_item[i].description,

              data.vendor_bidding_item[i].quantity,

              // price per unit
              "\u20B1" +
                numberWithCommas(data.vendor_bidding_item[i].price_per_unit),

              // total
              "\u20B1" + numberWithCommas(data.vendor_bidding_item[i].price_per_unit * data.vendor_bidding_item[i].quantity),

 
            ])
            .draw();

          // push data to new product array object

          purchase_order_items.push({
            product_category:
              data.vendor_bidding_item[i].category.category_name,

            product_name: data.vendor_bidding_item[i].product_name,
            product_price: data.vendor_bidding_item[i].price_per_unit,

            description: data.vendor_bidding_item[i].description,
            quantity: data.vendor_bidding_item[i].quantity,
            total_cost:
              data.vendor_bidding_item[i].price_per_unit *
              data.vendor_bidding_item[i].quantity,
          });
          // // edit_new_product.filter(onlyUnique);
        }

      //  $("#form_po input[type='number'],input[type='text']").prop(
      //     "disabled",
      //     true
      //   ); 
      } else {
        notification("error", "Error!", data.message);
      }
    },
    error: function (data) {},
  });
};

$(function () {
  // load purchase order datatable
  loadOrdersTable();
  // load awarded proposals datatable
  loadAwardedProposalsTable();
  // load purchase order to rate datatable
  loadPoToRate()
  // load vendor proposal items datatable
  proposal_items();
  // load purchase order items table
  po_items();
  // hide form
  formReset("hide");
  // initialized select 2
  $(".select2").select2();

  // submit purchase order form
  $("#form_po")
    .on("submit", function (e) {
      e.preventDefault();
      // trimInputFields();
    })
    .validate({
      rules: {
        // simple rule, converted to {required:true}
        order_date: {
          required: true,
        },
        // compound rule
        expected_delivery_date: {
          required: true,
        },

        payment_method: {
          required: true,
        },
        // compound rule
        payment_terms: {
          required: true,
        },
        shipment_method: {
          required: true,
        },
     
      },
      messages: {
        expected_delivery_date: {
          required: "please provide expected delivery date",
         
        },

        payment_method: {
          required: "please provide payment method",
          
        },

        payment_terms: {
          required: "please provide payment terms",
        },

        shipment_method: {
          required: "please provide shipment method",
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
        // var form_data = new FormData(document.getElementById("form_po"));
        // console.log(form_data);

        formData["vendor_proposal_id"] = $("#uuid").val();
        formData["order_date"] = Date.now();
        formData["status"] = "Pending";
        formData["expected_delivery_date"] = $("#expected_delivery_date").val();
        formData["notes"] = $("#notes").val();
        formData["payment_method_id"] = $("#payment_method").val();
        formData["payment_terms_id"] = $("#payment_terms").val();

        formData["shipping_method"] = $("#shipment_method").val();
        formData["subtotal"] = $("#po_subtotal").html();
        formData["tax"] = $("#po_tax").html();
        formData["discount"] = $("#po_discount").html();
        formData["total_amount"] = $("#po_total").html();
        formData["vendor_id"] = $("#vendor_id").val();
        formData["purchase_order_detail"] = [];

        // push all index of product_id_array to formData["purchase_order_detail"]
        for (let purchase_order_items_index in purchase_order_items) {
          formData["purchase_order_detail"].push(
            purchase_order_items[purchase_order_items_index]
          );
        }
        // create
        $.ajax({
          url: apiURL + "purchase-order/",
          type: "POST",
          // data: form_data,
          contentType: "application/json",
          data: JSON.stringify(formData),
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
              
              notification(
                "success",
                "Created!",
                "Purchase Order Successfuly Created"
              );
              console.log(data)
              loadAwardedProposalsTable();
              loadOrdersTable();

              $.ajax({
                url: apiURL + "budget-plan/"+data.vendor_proposal.request_quotation.purchase_requisition.given_budget+"/"+data.total_amount+"/"+new Date().getFullYear()+"/"+data.vendor_proposal.request_quotation.purchase_requisition.department_id,
                type: "PUT",
                // data: form_data,
                contentType: "application/json",
      
                
                // contentType: false,
                processData: false,
                cache: false,
                headers: {
                  Accept: "application/json",
                  Authorization: "Bearer " + localStorage.getItem("TOKEN"),
                },
                success: function (data) {
              
                },
                error: function ({ responseJSON }) {
                  console.log(responseJSON);
                },
              });

              $("#modal-po").modal("hide");
              formReset("hide");

              loadOrdersTable();

           
            } else {
              notification("error", "Error!", "Error creating department");
              console.log("error");
            }
          },
          error: function ({ responseJSON }) {
            notification("error", "Error!", responseJSON.detail);

            console.log(responseJSON.detail);
          },
        });
      },
    });
});


// awarded proposal datatable
loadAwardedProposalsTable = () => {
  $.ajaxSetup({
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
  });
  $("#data-table-proposals").dataTable().fnClearTable();
  $("#data-table-proposals").dataTable().fnDraw();
  $("#data-table-proposals").dataTable().fnDestroy();
  $("#data-table-proposals").DataTable({
    ajax: { url: apiURL + "vendor-proposal/awarded/", dataSrc: "" },

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
          return formatRfqNo(aData.request_quotation.request_quotation_number);
        },
        // className: "dtr-control",
      },
      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {
          return "vendor_name";

        },

      },
      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {
          return "\u20B1" + numberWithCommas(aData.discount);

        },

        // className: "dtr-control",
      },
      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {
          return "\u20B1" + numberWithCommas(aData.tax);

        },

        // className: "dtr-control",
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
        width: "10%",
        // className: "dtr-control",
        render: function (aData, type, row) {
          if (aData.status === "Awarded") {
            let status =
              '<label class="text-left badge badge-primary p-2 w-auto"> ' +
              aData.status +
              "</label> ";
            return status;
          }
        },
      },

      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        // className: "dtr-control",
        render: function (aData, type, row) {
       
          if (aData.is_ordered === true) {
            return '<p><i class= "fas fa-check mr-1"></i></p>';
          }
          else{
            return '<p><i class= "fas fa-minus mr-1"></i></p>';

          }
        },
      },

      {
        data: null,
        width: "15%",
        render: function (aData, type, row) {
          let buttons = "";
          buttons +=
            '<div class="text center dropdown"><div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
            '<i class="fas fa-ellipsis-v"></i></div><div class="dropdown-menu dropdown-menu-right">' +
            //view
            '<div class="dropdown-item d-flex role="button" onClick="return editData(\'' +
            aData["id"] +
            "',0)\">" +
            '<div style="width: 2rem"> <i class= "fas fa-eye mr-1"></i></div>' +
            "<div>  View</div></div>" +
            //delete
            // '<div class="dropdown-item d-flex role="button" data-toggle="modal" data-target="#modal-status" onClick="return deleteData(\'' +
            // aData["id"] +
            // "')\"  >" +
            // '<div style="width: 2rem"> <i class= "fas fa-times mr-1"></i></div>' +
            // "<div> Deactivate</div></div>" +
            "</div></div>";
          return buttons; // same class in i element removed it from a element
        },
      },
    ],
  });
};

// purchase order datatable
loadOrdersTable = () => {
  $.ajaxSetup({
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
  });
  $("#data-table-orders").dataTable().fnClearTable();
  $("#data-table-orders").dataTable().fnDraw();
  $("#data-table-orders").dataTable().fnDestroy();
  $("#data-table-orders").DataTable({
    ajax: { url: apiURL + "purchase-order/", dataSrc: "" },

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
        data: "vendor.vendor_name",
        name: "vendor.vendor_name",
        searchable: true,
        width: "10%",
        // className: "dtr-control",
      },
      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {
          return formatRfqNo(aData.vendor_proposal.request_quotation.request_quotation_number);
        },
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
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {
          return "\u20B1" + numberWithCommas(aData.total_amount);
        },
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
          } else if (aData.status === "Confirmed") {
            let status =
              '<label class="text-left badge badge-primary p-2 w-auto"> ' +
              aData.status +
              "</label> ";
            return status;
          } else {
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
            '<i class="fas fa-ellipsis-v"></i></div><div class="dropdown-menu dropdown-menu-right">';
            //view
            buttons +=  '<div class="dropdown-item d-flex role="button" onClick="return poInfo(\'' +
            aData["id"] +
            "',0)\">" +
            '<div style="width: 2rem"> <i class= "fas fa-eye mr-1"></i></div>' +
            "<div>View</div></div>";


            if (aData["status"] == "Pending") {
              // buttons +=
              //   '<div class="dropdown-item d-flex role="button" onClick="return editData(\'' +
              //   aData["id"] +
              //   "',1)\">" +
              //   '<div style="width: 2rem"> <i class= "fas fa-edit mr-1"></i></div>' +
              //   "<div> Edit</div></div>";
  
              //cancel
              buttons +=
                '<div class="dropdown-item d-flex role="button" onClick="return redoData(\'' +
                aData["id"] +
                "',1)\">" +
                '<div style="width: 2rem"> <i class= "fas fa-times mr-1"></i></div>' +
                "<div> Cancel</div></div>";
            }
            if (aData.status == "Cancelled") {
              //resend
              buttons +=
                '<div class="dropdown-item d-flex role="button" onClick="return redoData(\'' +
                aData["id"] +
                "',2)\">" +
                '<div style="width: 2rem"> <i class= "fas fa-redo mr-1"></i></div>' +
                "<div> Resend</div></div>";
            }
            "</div></div>";
          return buttons; // same class in i element removed it from a element
        },
      },
    ],
  });
};


// purchase order to rate datatable
loadPoToRate = () => {
  $.ajaxSetup({
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
  });
  $("#data-table-to-rate-po").dataTable().fnClearTable();
  $("#data-table-to-rate-po").dataTable().fnDraw();
  $("#data-table-to-rate-po").dataTable().fnDestroy();
  $("#data-table-to-rate-po").DataTable({
    ajax: { url: apiURL + "purchase-order/", dataSrc: "" },

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
        data: "vendor.vendor_name",
        name: "vendor.vendor_name",
        searchable: true,
        width: "10%",
        // className: "dtr-control",
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
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {
          return "\u20B1" + numberWithCommas(aData.total_amount);
        },
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
          } else if (aData.status === "Confirmed") {
            let status =
              '<label class="text-left badge badge-primary p-2 w-auto"> ' +
              aData.status +
              "</label> ";
            return status;
          } else {
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
            '<i class="fas fa-ellipsis-v"></i></div><div class="dropdown-menu dropdown-menu-right">';
            //view
            buttons +=  '<div class="dropdown-item d-flex role="button" onClick="return poInfo(\'' +
            aData["id"] +
            "',0)\">" +
            '<div style="width: 2rem"> <i class= "fas fa-eye mr-1"></i></div>' +
            "<div>View</div></div>";

            if(aData.status != "Pending"){

              buttons +=  '<div class="dropdown-item d-flex" role="button" data-toggle="modal" data-target="#modal-vendor-rating" onClick="return rateVendor(\'' +
              aData["id"] +
              "')\">" +
              '<div style="width: 2rem"> <i class= "fas fa-star mr-1"></i></div>' +
              "<div>Rate Vendor</div></div>";
            }

            //delete

            // buttons +=   '<div class="dropdown-item d-flex" role="button" data-toggle="modal" data-target="#modal-status" onClick="return deleteData(\'' +
            // aData["id"] +
            // "')\"  >" +
            // '<div style="width: 2rem"> <i class= "fas fa-trash mr-1"></i></div>' +
            // "<div> Cancel</div></div>";
            "</div></div>";
          return buttons; // same class in i element removed it from a element
        },
      },
    ],
  });
};

// show create vendor rating modal 
rateVendor = (id) =>{
  console.log(id)
  $("#po_id").val(id)
  $(
    "#form_po input[type='number'],input[type='text'], select, textarea"
  ).prop("disabled", false);
  
}

// submit vendor rating
submitRating =() =>{
 
  $.ajax({
    url: apiURL + "vendor-evaluation/",
    type: "POST",
    // data: form_data,
    contentType: "application/json",
    data: JSON.stringify({
   
      purchase_order_id: $("#po_id").val(),
      cost: $("#cost").val(),
      timeliness: $("#timeliness").val(),
      reliability: $("#reliability").val(),
      quality: $("#quality").val(),
      availability: $("#availability").val(),
      reputation: $("#reputation").val(),

      message: $("#rating_message").val(),

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
        notification("success", "Rating Successfuly Submitted");
        loadOrdersTable();
        

        $("#modal-vendor-rating").modal("hide");
      } else {
        notification("error", "Error submitting Rating");
        console.log("error");
      }
    },
    error: function ({ responseJSON }) {
      // console.log(responseJSON);
      notification("error","Error!", "You have already rated this order");

    },

    
  });

 

}

// view purchase order
poInfo = (id) => {
  $("#modal-po").modal("show");
  $("#payment_method_p").show();
  $("#payment_method").hide();

  $("#expected_delivery_date_p").show();
  // $("#expected_delivery_date").hide();

  $(".submit-po").hide();
  $.ajax({
    url: apiURL + "purchase-order/" + id,
    type: "GET",
    dataType: "json",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
    success: function (data) {
      if (data) {
        console.log(data);

        $("#uuid").val(data["id"]);

        $("#po_vendor_name").html("vendor_name");
        // $("#po_vendor_address").html(data..u_created_by["street"]);
        // $("#po_vendor_city").html(data.vendor_proposal.u_created_by["city"]);

        $("#order_date").val(//.val
          moment(data["order_date"]).format("MMMM D, YYYY")
        );

        $("#expected_delivery_date").val(
         data["expected_delivery_date"]
        );
        $("#vendor_proposal_id").val(data["vendor_proposal_id"]);
        $("#payment_method_p").val(data["payment_method"]);

        $("#po_subtotal").html(data["subtotal"]);

        $("#po_discount").html(data["discount"]);
        $("#po_tax").html(data["tax"]);
        $("#po_total").html(data["total_amount"]);
        $("#po_notes").html(data["notes"]);

        po_detail_table.clear().draw();

        // Loop here
        for (let i in data.purchase_order_detail) {
          po_detail_table.row
            .add([
              // product pic

              // '<label class="text-center badge badge-secondary p-2 w-auto"><i class="fas fa-file-image"></i></label> ',
              // product catagory
              data.purchase_order_detail[i].category,

              // product name
              data.purchase_order_detail[i].product_name,

              // product description
              // data.vendor_bidding_item[i].description,

              data.purchase_order_detail[i].quantity,

              // price per unit
              "\u20B1" +
                numberWithCommas(data.purchase_order_detail[i].product_price),

              // total
              "\u20B1" +
                numberWithCommas(data.purchase_order_detail[i].product_price *  data.purchase_order_detail[i].quantity),

              //action
              // '<div class="text center dropdown"> <div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
              //   '<i class="fas fa-ellipsis-v"></i></div> <div class="dropdown-menu dropdown-menu-right">' +
              //   // view
              //   '<div class="dropdown-item d-flex" role="button" data-toggle="modal" data-target="#modal-add-new-product" data-toggle="modal" onClick="return editPrDetail( \'' +
              //   data.vendor_bidding_item[i].id +
              //   '\',this.parentNode.parentNode.parentNode.parentNode);"><div style="width: 2rem"> <i class="fas fa-eye mr-1"></i></div><div> View</div></div>' +
              //   // remove
              //   '<div class="dropdown-item d-flex" role="button" data-toggle="modal" onClick="return removePrDetail(this.parentNode.parentNode.parentNode, \'' +
              //   "" +
              //   "', '" +
              //   data.vendor_bidding_item[i].id +
              //   '\');"><div style="width: 2rem"> <i class="fas fa-trash mr-1"></i></div><div> Remove</div></div>' +
              //   "</div></div>",
            ])
            .draw();
        }

        $(
          "#form_po input[type='number'],input[type='text'],input[type='date'], select, textarea"
        ).prop("disabled", true);
      } else {
        // notification("error", "Error!", responseData.message);
        console.log("error", "Error!", responseData.success);
      }
    },
    error: function ({ responseJSON }) {},
  });
};

// function to show modal of change status 
const formStatus = {};
redoData = (id, type) => {
  if (type == 1) {
    $("#modal-default").modal("show");
    $(".cancel-order").html(
      '<i class="text-secondary fas fa-exclamation-triangle mr-2"></i>' +
        "Cancel PO"
    );
    $(".order-modal-body").html("Are you sure you want to Cancel this po?");
    $("#changeStatus").attr("class", "btn btn-info");

    $("#changeStatus").html("Yes, Cancel it");

    $("#resend").hide();

    $("#del_uuid").val(id);
    formStatus["status"] = "Cancelled";
  } else {

    $(".order-modal-body").html("Are you sure you want to resend this po?");
    $("#changeStatus").html("Yes, Resend it");
    $("#changeStatus").attr("class", "btn btn-primary");

    $("#modal-default").modal("show");
    $(".cancel-order").html(
      '<i class="text-secondary fas fa-exclamation-triangle mr-2"></i>' +
        "Resend PO"
    );

    $("#cancel").hide();
    $("#resend").show();

    $("#del_uuid").val(id);

    formStatus["status"] = "Pending";
  }
};

// function to change status of data
changeStatus = () => {
  $.ajax({
    url: apiURL + "purchase-order/" + $("#del_uuid").val(),

    type: "PUT",
    contentType: "application/json",
    data: JSON.stringify({
      status: formStatus["status"],
    }),
    dataType: "json",
    processData: false,
    cache: false,
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
    },
    success: function (data) {
      if (data) {
        if (formStatus["status"] == "Cancelled") {
          notification("info", "PO Cancelled");
        } else {
          notification("success", "PO Resent");
        }
        loadOrdersTable();
      } else {

        notification("error", "Error!", "Error approving PO");
      }
    },
    error: function ({ responseJSON }) {
      console.log(responseJSON);
    },
  });
  $("#changeStatus").attr("data-dismiss", "modal");
};

// datatable for proposal items
proposal_items = () => {
  $("#proposal-items-table").dataTable().fnClearTable();
  $("#proposal-items-table").dataTable().fnDraw();
  $("#proposal-items-table").dataTable().fnDestroy();
  proposal_items_table = $("#proposal-items-table").DataTable({
    info: false,
    // paging: false,
    responsive: true,
    aLengthMenu: [5, 10, 20, 30, 50, 100],
    columns: [

      { width: "10%" },
      { width: "15%" },
      { width: "30%" },
      { width: "10%" },
      { width: "10%" },
      { width: "10%" },
      { width: "10%" },
    ],
  });
};


// view awarded proposal details
editData = (id, type) => {
  // insert tr??
  $(".is-invalid").removeClass("is-invalid");
  $(".is-valid").removeClass("is-valid");

  $.ajax({
    url: apiURL + "vendor-proposal/" + id,
    type: "GET",
    dataType: "json",
    success: function (data) {
      if (data) {
        formReset("show");
        if (data.is_ordered === true) {
          $('.create-po').hide()
        }
        else{
          $('.create-po').show()

        }
        
        $("#uuid").val(data["id"]);
        $("#vendor_id").val(data.vendor["id"]);

        $("#vendor").html("vendor_name");
        $("#proposal_date").html(
          moment(data["created_at"]).format("MMMM D, YYYY")
        );

        $("#prepared_by").val(data["prepared_by"]);
        $("#contact_no").val(data["contact_no"]);
        $("#rfq_id").val(data["id"]).trigger("change");
        $("#subtotal").val(data["subtotal"]);
        $("#discount").val(data["discount"]);
        $("#tax").val(data["tax"]);
        $("#total").val(data["total_amount"]);
        $("#proposal_message").empty()
        $("#proposal_message").append(data["message"]);
        $("#notes").val(data["notes"]);

        proposal_items_table.clear().draw();

        // Loop here
        for (let i in data.vendor_bidding_item) {
          proposal_items_table.row
            .add([
       

              // product catagory
              data.vendor_bidding_item[i].category.category_name,

              // product name
              data.vendor_bidding_item[i].product_name,

              // product description
              data.vendor_bidding_item[i].description,

              // price
              "\u20B1" +
                numberWithCommas(data.vendor_bidding_item[i].price_per_unit),

              // quantity input field
              // '<input class="form-control product_quantity_of_manual_item" type="number" min="1" value=' +
              data.vendor_bidding_item[i].quantity,
              //  +" />",

              // total cost
              "\u20B1" + numberWithCommas(data.vendor_bidding_item[i].price_per_unit * data.vendor_bidding_item[i].quantity),

              //action
              '<div class="text center dropdown"> <div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
                '<i class="fas fa-ellipsis-v"></i></div> <div class="dropdown-menu dropdown-menu-right">' +
                // view
                '<div class="dropdown-item d-flex" role="button" data-toggle="modal" data-target="#modal-add-new-product" data-toggle="modal" onClick="return editPrDetail( \'' +
                data.vendor_bidding_item[i].id +
                '\',this.parentNode.parentNode.parentNode.parentNode);"><div style="width: 2rem"> <i class="fas fa-eye mr-1"></i></div><div> View</div></div>' +
                // remove
                // '<div class="dropdown-item d-flex" role="button" data-toggle="modal" onClick="return removePrDetail(this.parentNode.parentNode.parentNode, \'' +
                // "" +
                // "', '" +
                // data.vendor_bidding_item[i].id +
                // '\');"><div style="width: 2rem"> <i class="fas fa-trash mr-1"></i></div><div> Remove</div></div>' +
                "</div></div>",
            ])
            .draw();

          // push data to new product array object
          // edit_new_product.push({
          //   new_product_category:
          //     data.vendor_bidding_item[i].new_product_category,

          //   new_product_name: data.vendor_bidding_item[i].new_product_name,

          //   new_product_quantity: data.vendor_bidding_item[i].quantity,

          //   description: data.vendor_bidding_item[i].description,
          //   quantity: data.vendor_bidding_item[i].quantity,
          // });
          // edit_new_product.filter(onlyUnique);
        }

        // console.log(new_product);

        // $(
        //   "#form_id input[type='number'],input[type='text'], select, textarea"
        // ).prop("readonly", true);
      } else {
        notification("error", "Error!", data.message);
      }
    },
    error: function (data) {},
  });
};

// view vendor proposal item details
editPrDetail = (id, tr) => {
  // $(".modal-title").html("View Product");
  $(".is-invalid").removeClass("is-invalid");
  $(".is-valid").removeClass("is-valid");

  $.ajax({
    url: apiURL + "vendor-proposal/bidding-item/" + id,
    type: "GET",
    dataType: "json",
    success: function (data) {
      if (data) {
        $("#category_id").val(data.category["category_name"]).val();

        $("#new_item_name").val(data["product_name"]),
        $("#new_item_description").empty()
          $("#new_item_description").append(data["description"]),
          $("#new_item_price").val(data["price_per_unit"]),
          $("#new_item_quantity").val(data["quantity"]);

      } else {
        notification("error", "Error!", data.message);
      }
    },
    error: function (data) {},
  });
};


// 		action = show, hide
formReset = (action = "hide") => {
  $("html, body").animate({ scrollTop: 0 }, "slow");
  purchase_order_items.splice(0, purchase_order_items.length);

  if (action == "hide") {
    $(".is-invalid").removeClass("is-invalid");
    $(".is-valid").removeClass("is-valid");
    $(".invalid-feedback").hide();
    // hide and clear form
    $("#uuid").val("");
    $("#div_form").hide();
    // proposal_items_table.clear().draw();

    // $("#form_id input, select, textarea").prop("readonly", false);
  } else {
    // show
    $("#div_form").show();
    // $("#form_id input, select, textarea").prop("readonly", false);
    // $("#form_id button").prop("readonly", false);
  }
};

// load payment terms
loadPaymentTerms = () => {
  $.ajax({
    url: apiURL + "payment-terms/",
    type: "GET",
    dataType: "json",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
    success: function (responseData) {
      if (responseData) {
        $("#payment_terms").empty();
        $.each(responseData, function (i, dataOptions) {
          let options = "";
          options =
            "<option value='" +
            dataOptions.id +
            "'>" +
            dataOptions.method_name +
            "</option>";

          $("#payment_terms").append(options);
        });
      } else {
        // notification("error", "Error!", responseData.message);
        console.log("error", "Error!", responseData.success);
      }
    },
    error: function ({ responseJSON }) {},
  });
};

loadPaymentTerms();


// load payment methods
loadPaymentMethods = () => {

  $.ajax({
    url: apiURL + "payment-method/",
    type: "GET",
    dataType: "json",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
    success: function (responseData) {
      if (responseData) {
        $("#payment_method").empty();
        $.each(responseData, function (i, dataOptions) {
          let options = "";
          options =
            "<option value='" +
            dataOptions.id +
            "'>" +
            dataOptions.method_name +
            "</option>";

          $("#payment_method").append(options);
        });
      } else {
        // notification("error", "Error!", responseData.message);
        console.log("error", "Error!", responseData.success);
      }
    },
    error: function ({ responseJSON }) {},
  });
};

loadPaymentMethods();



// print purchase order

$(document).on("click", ".print", function () {
  const content_wrapper = $(".content-wrapper");
  const content_header = $(".content-header").detach();
  const content = $(".content").detach();
  const modal_content = $(".po-report-modal-content");

  const modalHeader = $(".po-report-modal-header");
  const modalBody = $(".po-report-modal-body").detach();
  const modalFooter = $(".po-report-modal-footer");

  $("footer").hide();

  content_wrapper.append(modalBody);
  $("#modal-po").hide();
  window.print();
  $("#modal-po").show();
  modal_content.empty();
  content_wrapper.empty();
  content_wrapper.append(content_header);

  content_wrapper.append(content);
  modal_content.append(modalHeader);
  modal_content.append(modalBody);
  modal_content.append(modalFooter);

  $("footer").show();
});