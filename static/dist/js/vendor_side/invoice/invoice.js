$(function () {
  // load datatable
  loadTable();

  // load purchase order itmes
  po_items();

  // hide form
  formReset("hide");
  $(".select2").select2();
  
  // set invoice date
  $("#invoice_date").html(moment(new Date()).format("MMMM D, YYYY"));

  // submit form
  $("#form_id")
    .on("submit", function (e) {
      e.preventDefault();
      // trimInputFields();
    })
    .validate({
      rules: {
        // simple rule, converted to {required:true}
        invoice_date: {
          required: true,
        },
        // compound rule
        due_date: {
          required: true,
        },

     
        billing_address: {
          required: true,
        },
        po_number: {
          required: true,
        },
      },
      messages: {
        invoice_date: {
          required: "please provide invoice date",
        },

        due_date: {
          required: "please provide due date",
        },

  

        billing_address: {
          required: "please provide billing address",
        },
        po_number: {
          required: "please provide purchase order number",
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
        var form_data = new FormData(document.getElementById("form_id"));
        console.log(form_data);
        let invoice_date = moment(
          moment($("#invoice_date").html(), ["DDMMMMY", "MMMMDDY"]).format()
        ).format("YYYY-MM-DD");
        if ($("#uuid").val() == "") {
          // add invoice
 
          $.ajax({
            url: apiURL + "invoice/",
            type: "POST",
            // data: form_data,
            contentType: "application/json",
            data: JSON.stringify({
              // invoice_pic: $("#invoice_pic").val(),
              // invoice_date: new Date(),
              prepared_by: $("#prepared_by").val(),
              message: $("#message").val(),
              created_by:localStorage.getItem("ID"),
              due_date: $("#due_date").val(),
              purchase_order_id: $("#po_number").val(),
              billing_address: $("#billing_address").val(),
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
                notification(
                  "success",
                  "Created!",
                  "Invoice Successfuly Created"
                );
                console.log(data);
                console.log("success");
                formReset("hide");
                loadTable();
              } else {
                notification("error", "Error!", "Error creating invoice");
                console.log("error");
              }
            },
            error: function ({ responseJSON }) {
              // console.log(responseJSON.detail)
              notification("error", "Error!", responseJSON.detail);

            },
          });
        } else {
          // update invoice
          $.ajax({
            url: apiURL + "invoice/" + $("#uuid").val(),
            type: "PUT",
            // data: form_data,
            contentType: "application/json",
            data: JSON.stringify({
              // invoice_date: invoice_date,
              prepared_by: $("#prepared_by").val(),
              message: $("#message").val(),
              due_date: $("#due_date").val(),
              purchase_order_id: $("#po_number").val(),
              billing_address: $("#billing_address").val(),
            }),
            dataType: "json",
            // contentType: false,
            processData: false,
            cache: false,
            success: function (data) {
              if (data) {
                notification(
                  "success",
                  "Updated!",
                  "Invoice Successfuly Updated"
                );
                console.log("success " + data);
                  formReset("hide")
                loadTable();
              } else {
                console.log("error " + data.message);
              }
            },
            error: function ({ responseJSON }) {},
          });
        }
      },
    });
});

// function to purchase order
loadPurchaseOrder = () => {
  $.ajax({
    url: apiURL + "purchase-order/get_status/"+localStorage.getItem('ID')+"/Confirmed",
    type: "GET",
    dataType: "json",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
    },
    success: function (responseData) {
      if (responseData) {
        $("#po_number").empty();
        $("#po_number").append('<option selected>Select PO</option>');

        $.each(responseData, function (i, dataOptions) {
          var options = "";
          options =
            "<option value='" +
            dataOptions.id +
            "'>" +
            formatPoNo(dataOptions.purchase_order_number) +
            "</option>";

          $("#po_number").append(options);
        });
      } else {
        // notification("error", "Error!", responseData.message);
        console.log("error", "Error!", responseData.success);
      }
    },
    error: function ({ responseJSON }) {},
  });
};

loadPurchaseOrder();

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

// set details on change of purchase order
$("#po_number").on("change", function () {
  $.ajax({
    url: apiURL + "purchase-order/" + $(this).val(),
    type: "GET",
    dataType: "json",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
    },
    success: function (responseData) {
      console.log(responseData);
      $("#order_date").html(
        moment(responseData.order_date).format("MMMM D, YYYY")
      );
      $("#shipping_method").html();
      $("#payment_method").html(responseData.payment_method.method_name);
      $("#payment_terms").html(responseData.payment_terms.method_name);
      $("#shipping_method").html(responseData.shipping_method);

      $("#po_subtotal").html(responseData.subtotal);
      $("#po_tax").html(responseData.tax);
      $("#po_discount").html(responseData.discount);
      $("#po_total").html(responseData.total_amount);

      po_detail_table.clear().draw();

      // Loop here
      for (var i in responseData.purchase_order_detail) {
        po_detail_table.row
          .add([
            // product catagory
            responseData.purchase_order_detail[i].category,

            // product name
            responseData.purchase_order_detail[i].product_name,

            // product description
            //  responseData.purchase_order_detail[i].description,

            responseData.purchase_order_detail[i].quantity,

            // price per unit
            "\u20B1" +
              numberWithCommas(
                responseData.purchase_order_detail[i].product_price
              ),

            // total
            "\u20B1" +
              numberWithCommas(
                responseData.purchase_order_detail[i].product_price *
                  responseData.purchase_order_detail[i].quantity
              ),
          ])
          .draw();
      }
    },
    error: function ({ responseJSON }) {},
  });
});

// datatable of invoice

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
    ajax: { url: apiURL + "invoice/vendor/"+localStorage.getItem("ID"), dataSrc: "" },

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
        width: "30%",
        render: function (aData, type, row) {
          return formatPoNo(aData.purchase_order.purchase_order_number);
        },
        // className: "dtr-control",
      },

      {
        data: "prepared_by",
        name: "prepared_by",
        searchable: true,
        width: "20%",
      },

      {
        data: null,
        name: null,
        searchable: true,
        width: "20%",
        render: function (aData, type, row) {
          return moment(aData.invoice_date).format("MMMM D, YYYY");
        },
      },

      {
        data: null,
        name: null,
        searchable: true,
        width: "20%",
        render: function (aData, type, row) {
          return moment(aData.due_date).format("MMMM D, YYYY");
        },
      },

      {
        data: null,
        name: null,
        searchable: true,
        width: "20%",
        render: function (aData, type, row) {
          let status = "";
          if (aData.status === "Paid") {
            '<label class="text-left badge badge-primary p-2 w-auto"> ' +
              aData.status +
              "</label> ";
          } else if(aData.status == "Pending") {
            status =
              '<label class="text-left badge badge-warning p-2 w-auto"> ' +
              aData.status +
              "</label> ";
          }
          else{
            status =
              '<label class="text-left badge badge-danger p-2 w-auto"> ' +
              aData.status +
              "</label> ";
          }
          return status;
        },
      },
      {
        data: null,
        width: "20%",
        render: function (aData, type, row) {
          let buttons = "";
          buttons +=
            '<div class="text center dropdown"><div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
            '<i class="fas fa-ellipsis-v"></i></div><div class="dropdown-menu dropdown-menu-right">';
            //view
            buttons +=  '<div class="dropdown-item d-flex role="button" onClick="return editData(\'' +
            aData["id"] +
            "',0)\">" +
            '<div style="width: 2rem"> <i class= "fas fa-eye mr-1"></i></div>' +
            "<div> View</div></div>";
            //edit
            // buttons +=  '<div class="dropdown-item d-flex role="button" onClick="return editData(\'' +
            // aData["id"] +
            // "',1)\">" +
            // '<div style="width: 2rem"> <i class= "fas fa-edit mr-1"></i></div>' +
            // "<div> Edit</div></div>";
            //delete
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
            buttons += "</div></div>";
          return buttons; // same class in i element removed it from a element
        },
      },
    ],
  });
};


// show modal of create invoice
addData = () => {
  $("#modal-xl").modal("show");
  $(".submit").show();
  $("#form_id input, select, textarea").prop("disabled", false);
  $("#form_id input, select, textarea").val("");
  $(".modal-title").html("Add invoice");

  $(".is-invalid").removeClass("is-invalid");
  $(".is-valid").removeClass("is-valid");

  $(".submit").html("Submit" + '<i class="fas fa-check ml-1"></i>');
};

// function to show details for viewing/updating
editData = (id, type) => {
  $(".is-invalid").removeClass("is-invalid");
  $(".is-valid").removeClass("is-valid");

  formReset("show");

  $.ajax({
    url: apiURL + "invoice/" + id,
    type: "GET",
    dataType: "json",
    success: function (data) {
      if (data) {
        console.log(data)
        $("#uuid").val(data["id"]);
        $("#order_date").html(
          moment(data.purchase_order.order_date).format("MMMM D, YYYY")
        );
        $("#payment_method").html(data.purchase_order.payment_method.method_name);
        $("#payment_terms").html(data.purchase_order.payment_terms.method_name);
        $("#shipping_method").html(data.shipping_method);
        $("#po_subtotal").html(data.purchase_order.subtotal);
        $("#po_tax").html(data.purchase_order.tax);
        $("#po_discount").html(data.purchase_order.discount);
        $("#po_total").html(data.purchase_order.total_amount);
        $("#invoice_date").html(moment(data.invoice_date).format("MMMM D, YYYY"));
        

        $("#due_date").val(data.due_date);
        $("#message").val(data.message);
        $("#prepared_by").val(data.prepared_by);

        $("#billing_address").val(data.billing_address);
        $("#po_number").val(data.purchase_order.id).trigger("change");

        po_detail_table.clear().draw();

        for (var i in data.purchase_order.purchase_order_detail) {
          po_detail_table.row
            .add([
              // product catagory
              data.purchase_order.purchase_order_detail[i].category,

              // product name
              data.purchase_order.purchase_order_detail[i].product_name,

              // product description
              //  responseData.purchase_order_detail[i].description,

              data.purchase_order.purchase_order_detail[i].quantity,

              // price per unit
              "\u20B1" +
                numberWithCommas(
                  data.purchase_order.purchase_order_detail[i].product_price
                ),

              // total
              "\u20B1" +
                numberWithCommas(
                  data.purchase_order.purchase_order_detail[i].product_price *
                    data.purchase_order.purchase_order_detail[i].quantity
                ),
            ])
            .draw();
        }

        // setTimeout(() => {
        // 	$("#section_id").val(data.data["section_id"]).trigger("change");
        // }, 1500);

        // if data is for viewing only
        if (type == 0) {
          $("#form_id input, select, textarea").prop("disabled", true);
          $(".modal-title").html("View invoice");
          $(".submit").hide();
        } else {
          $("#form_id input, select, textarea").prop("disabled", false);
          // $("#form_id button").prop("disabled", false);
          $(".submit").show();
          $(".modal-title").html("Update invoice");
          $(".submit").html("Update" + '<i class="fas fa-check ml-1"></i>');
        }
      } else {
        notification("error", "Error!", data.message);
      }
    },
    error: function (data) {},
  });
};


// change status of invoice
const formStatus = {};
redoData = (id, type) => {
  if (type == 1) {
    $("#modal-status").modal("show");
    $(".cancel-request").html(
      '<i class="text-secondary fas fa-exclamation-triangle mr-2"></i>' +
        "Cancel Invoice"
    );
    $(".invoice-modal-body").text("Are you sure you want to Cancel this Invoice?");
    $("#changeStatus").attr('class', 'btn btn-info');

    $("#changeStatus").html("Yes, Cancel it")

    $("#resend").hide();

    $("#del_uuid").val(id);
    formStatus["status"] = "Cancelled";
  } else {
    $(".budget-row").hide();
    $(".invoice-modal-body").text("Are you sure you want to resend this Invoice?");
    $("#changeStatus").html("Yes, Resend it")
    $("#changeStatus").attr('class', 'btn btn-primary');

    $("#modal-status").modal("show");
    $(".cancel-request").html(
      '<i class="text-secondary fas fa-exclamation-triangle mr-2"></i>' +
        "Resend Invoice"
    );

    $("#cancel").hide();
    $("#resend").show();

    $("#del_uuid").val(id);

    formStatus["status"] = "Pending";
  }

  
};


changeStatus = () => {
  $.ajax({
    url: apiURL +
    "invoice/" +
    $("#del_uuid").val(),

    type: "DELETE",
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
    
        if (formStatus["status"] == "Cancelled") {
          notification("info", "Invoice Cancelled");
        } else {
          notification("success", "Invoice Resent");
        }
        $("#modal-status").modal("hide");
        loadTable();

    },
    error: function ({ responseJSON }) {
      console.log(responseJSON);
    },
  });
  $('#changeStatus').attr('data-dismiss','modal');
}


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
    $('.submit').show()
    $("#form_id p").empty()
    $("#form_id")[0].reset()

    $("#div_form").show();
    $("#form_id input, select, textarea").prop("disabled", false);
    $("#form_id button").prop("disabled", false);
  }
};
