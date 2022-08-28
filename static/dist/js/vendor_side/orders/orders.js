$(function () {
  // load datatable
  loadTable();
  po_items();
  formReset("hide");

  // submit form
  $("#form_id")
    .on("submit", function (e) {
      e.preventDefault();
      // trimInputFields();
    })
    .validate({
      rules: {
        // simple rule, converted to {required:true}
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
        $.ajax({
          url: apiURL + "purchase-order/" + $("#uuid").val(),
          type: "PUT",
          // data: form_data,
          contentType: "application/json",
          data: JSON.stringify({
            status: "Confirmed",
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
              notification("success", "Confirmed!", "Purchase Order Confirmed");

              formReset("hide");

              loadTable();
            } else {
              notification("error", "Error!", "Error creating department");
              console.log("error");
            }
          },
          error: function ({ responseJSON }) {
            console.log(responseJSON);
          },
        });
      },
    });
});

// table for purchase order items
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

// purchase order datatable
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
    ajax: {
      url:
        apiURL +
        "purchase-order/orders-to-vendor/" +
        localStorage.getItem("ID"),
      dataSrc: "",
    },

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
        formatPoNo,
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
      },
      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {

        return "\u20B1" +aData.total_amount
        }
      },
      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
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
            '<i class="fas fa-ellipsis-v"></i></div><div class="dropdown-menu dropdown-menu-right">';
            //view
            buttons += '<div class="dropdown-item d-flex role="button" onClick="return poInfo(\'' +
            aData["id"] +
            "',0)\">" +
            '<div style="width: 2rem"> <i class= "fas fa-eye mr-1"></i></div>' +
            "<div>View</div></div>";
          if (aData.status === "Pending") {
            //delete
            buttons += '<div class="dropdown-item d-flex role="button" data-toggle="modal" data-target="#modal-status" onClick="return deleteData(\'' +
            aData["id"] +
            "')\"  >" +
            '<div style="width: 2rem"> <i class= "fas fa-trash mr-1"></i></div>' +
            "<div>Cancel Order</div></div>";
          }

          buttons +=  "</div></div>";
          return buttons; // same class in i element removed it from a element
        },
      },
    ],
  });
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


// view purchase order
poInfo = (id) => {
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
        formReset("show");
        console.log(data)
        if(data["status"] ==  "Cancelled" || data["status"] ==  "Confirmed") $('.submit').hide()
        else $('.submit').show()

        $("#uuid").val(data["id"]);

        $("#po_vendor_name").html(data.vendor["vendor_name"]);
      // $("#po_vendor_address").html(data.vendor_proposal.u_created_by["street"]);
      //   $("#po_vendor_city").html(data.vendor_proposal.u_created_by["city"]);  

        $("#order_date").val(
          moment(data["order_date"]).format("MMMM D, YYYY")
        );
        $("#expected_delivery_date").val(
          // moment(data["order_date"]).format("MMMM D, YYYY")
          data["expected_delivery_date"]

        );

        $('#po_number').val(data["purchase_order_number"])

        $("#vendor_proposal_id").val(data["vendor_proposal_id"]);

        $("#po_subtotal").html(data["subtotal"]);

        $("#po_discount").html(data["discount"]);
        $("#po_tax").html(data["tax"]);
        $("#po_total").html(data["total_amount"]);
        $("#po_notes").html(data["notes"]);

        po_detail_table.clear().draw();

        // Loop here
        for (var i in data.purchase_order_detail) {
          console.log(data.purchase_order_detail[i])
          po_detail_table.row
            .add([
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
                numberWithCommas(data.purchase_order_detail[i].product_price * data.purchase_order_detail[i].quantity),

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
          "#form_id input[type='number'],input[type='text'], select, textarea"
        ).prop("disabled", true);
      } else {
        // notification("error", "Error!", responseData.message);
        console.log("error", "Error!", responseData.success);
      }
    },
    error: function ({ responseJSON }) {},
  });
};


  // function to delete data
  deleteData = (id) => {
    $("#modal-default").modal("show");
    $(".modal-title").html("Cancel Order");
    $("#del_uuid").val(id);
  };
  
  deleteData2 = (id) => {
    id = $("#del_uuid").val();
    $("#modal-default").modal("hide");
  
    console.log(id);
    $.ajax({
      url: apiURL + "purchase-order/" + id,
      type: "PUT",
      // data: form_data,
      contentType: "application/json",
      data: JSON.stringify({
        status: "Cancelled",
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
          notification("success", "Confirmed!", "Purchase Order Confirmed");

          formReset("hide");

          loadTable();
        } else {
          notification("error", "Error!", "Error creating department");
          console.log("error");
        }
      },
      error: function ({ responseJSON }) {
        console.log(responseJSON);
      },
    });
  };
  


// 		action = show, hide
formReset = (action = "hide") => {
  $("html, body").animate({ scrollTop: 0 }, "slow");

  if (action == "hide") {
    $(".is-invalid").removeClass("is-invalid");
    $(".is-valid").removeClass("is-valid");
    $(".invalid-feedback").hide();
    // hide and clear form
    $("#uuid").val("");
    $("#div_form").hide();

    $("#form_id input, select, textarea").prop("disabled", false);
  } else {
    // show
    $("#div_form").show();
    $("#form_id input, select, textarea").prop("disabled", false);
    $("#form_id button").prop("disabled", false);
  }
};
