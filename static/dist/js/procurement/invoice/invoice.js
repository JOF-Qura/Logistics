$(function () {
    // load datatable
    loadTable();

    // load purchase order items
    po_items();

    // hide form
    formReset("hide");

    // initialized select 2
    $(".select2").select2();
   
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
  
          message: {
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
  
          message: {
            required: "please provide message",
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
            // add record
        
            $.ajax({
              url: apiURL + "invoice/",
              type: "POST",
              // data: form_data,
              contentType: "application/json",
              data: JSON.stringify({
                // invoice_pic: $("#invoice_pic").val(),
                invoice_date: invoice_date,
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
                console.log(responseJSON);
              },
            });
          } else {
            // update record
            $.ajax({
              url: apiURL + "invoice/" + $("#uuid").val(),
              type: "PUT",
              // data: form_data,
              contentType: "application/json",
              data: JSON.stringify({
                invoice_name: $("#invoice_name").val(),
                contact_no: $("#contact_no").val(),
                invoice_head: $("#invoice_head").val(),
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
  
  
  
  // datatable for purchase order products
  po_items = () => {
    $("#po-detail-table").dataTable().fnClearTable();
    $("#po-detail-table").dataTable().fnDraw();
    $("#po-detail-table").dataTable().fnDestroy();
    po_detail_table = $("#po-detail-table").DataTable({
      info: false,
      paging: false,
      searching:false,
      responsive: true,
      aLengthMenu: [5, 10, 20, 30, 50, 100],
    });
  };
  

  
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
      ajax: { url: apiURL + "invoice", dataSrc: "" },
  
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
            } else {
              status =
                '<label class="text-left badge badge-warning p-2 w-auto"> ' +
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
              '<i class="fas fa-ellipsis-v"></i></div><div class="dropdown-menu dropdown-menu-right">' +
              //view
              '<div class="dropdown-item d-flex role="button" onClick="return editData(\'' +
              aData["id"] +
              "',0)\">" +
              '<div style="width: 2rem"> <i class= "fas fa-eye mr-1"></i></div>' +
              "<div> View</div></div>" +
              //edit
              // '<div class="dropdown-item d-flex role="button" onClick="return editData(\'' +
              // aData["id"] +
              // "',1)\">" +
              // '<div style="width: 2rem"> <i class= "fas fa-edit mr-1"></i></div>' +
              // "<div> Edit</div></div>" +
            //  // delete
              // '<div class="dropdown-item d-flex role="button" data-toggle="modal" data-target="#modal-status" onClick="return deleteData(\'' +
              // aData["id"] +
              // "')\"  >" +
              // '<div style="width: 2rem"> <i class= "fas fa-trash mr-1"></i></div>' +
              // "<div> Delete</div></div>" +
              "</div></div>";
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
  
    formReset("show");
  
    $.ajax({
      url: apiURL + "invoice/" + id,
      type: "GET",
      dataType: "json",
      success: function (data) {
        if (data) {
          $("#uuid").val(data["id"]);
          $("#order_date").html(
            moment(data.purchase_order.order_date).format("MMMM D, YYYY")
          );
          $("#shipping_method").text(data.purchase_order.shipping_method);
          $("#payment_method").text(data.purchase_order.payment_method.method_name);
          $("#payment_terms").text(data.purchase_order.payment_terms.method_name);
          $("#po_subtotal").text(data.purchase_order.subtotal);
          $("#po_tax").text(data.purchase_order.tax);
          $("#po_discount").text(data.purchase_order.discount);
          $("#po_total").text(data.purchase_order.total_amount);
          $("#invoice_date").text(moment(data.invoice_date).format("MMMM D, YYYY"));
  
          $("#due_date").val(moment(data.due_date ).format("MMMM D, YYYY"));
          $("#message").val(data.message);
          $("#prepared_by").val(data.prepared_by);
  
          $("#billing_address").val(data.billing_address);
          $("#po_number").text(formatPoNo(data.purchase_order.purchase_order_number));
  
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
  
  // function to change status of data
  deleteData = (id) => {
    $("#del_uuid").val(id);
    $("#modal-default").modal("hide");
    $(".modal-title").html("Delete invoice");
  
    console.log(id);
    $("#changeStatus").click(() => {
      $.ajax({
        url: apiURL + "invoice/" + id,
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
      $("#changeStatus").attr("data-dismiss", "modal");
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
  