$(function () {
  // initialized select2
  $(".select2").select2();
  // load datatable
  loadTable();
  // load datatable of price comparison of proposal
  loadTableComparisons("none");
  // load datatable of request for quotation products
  rfq_detail_table_quotation();
  // load datatable of proposal items
  proposal_items();
  // hide form
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
        rfq_id: {
          required: true,
        },
        // compound rule
        created_by: {
          required: true,
        },
        contact_no: {
          required: true,
        },

        subtotal: {
          required: true,
        },
        total: {
          required: true,
        },
      },
      messages: {
        rfq_id: {
          required: "please select rfq",
        },

        created_by: {
          required: "please provide a name",
        },
        contact_no: {
          required: "please provide a contact number",
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
        // form_data.append("_method", "PUT");

        $.ajax({
          url: apiURL + "vendor-proposal/award/" + $("#uuid").val(),
          type: "PUT",
          // data: form_data,
          contentType: "application/json",
          data: JSON.stringify({
            status: $("#status").val(),
            subtotal: parseFloat($("#subtotal").html().replace(/[^0-9\.-]+/g, "")),
            tax: parseFloat($("#tax").html().replace(/[^0-9\.-]+/g, "")),
            total_amount: parseFloat($("#total").html().replace(/[^0-9\.-]+/g, "")),
          }),
          dataType: "json",
          // contentType: false,
          processData: false,
          cache: false,
          success: function (data) {
            if (data) {
              notification("success","Success", "Vendor Awarded");
              formReset("hide");
              loadTable();
            } else {
              console.log("error " + data.message);
            }
          },
          error: function ({ responseJSON }) {},
        });
      },
    });
});

// datatable of vendor proposal
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
      url: apiURL + "vendor-proposal/",
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
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {
          return "vendor_name";
        },
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
      { width: "25%" },
      { width: "10%" },
      { width: "15%" },
      { width: "10%" },
      { width: "10%" },
    ],
  });
};
var new_product = [];
var edit_new_product = [];

// function to show details for viewing/updating
editData = (id, type) => {
  // insert tr??
  $(".is-invalid").removeClass("is-invalid");
  $(".is-valid").removeClass("is-valid");

  // remove all data from array

  new_product.splice(0, new_product.length);

  $.ajax({
    url: apiURL + "vendor-proposal/" + id,
    type: "GET",
    dataType: "json",
    success: function (data) {
      if (data) {
        if (type == 0) {
          formReset("show");
          $("#subtotal").html("\u20B1" + numberWithCommas(data["subtotal"]));

          $("#discount").text("\u20B1" + numberWithCommas(data["discount"]));
          $("#tax").text("\u20B1" + numberWithCommas(data["tax"]));
          $("#total").text("\u20B1" + numberWithCommas(data["total_amount"]));
        }

        let visi = "";
        if (data["status"] == "Awarded") {
          $(".submit").hide();
          $(".proposal-status").removeClass("text-danger");
          $(".proposal-status").addClass("text-primary");
          $(".proposal-status").html("*Awarded Proposal");
          $(".proposal-status").show();
          visi = "d-none";
        } else if (data["status"] == "Inactive") {
          $(".submit").hide();
          $(".proposal-status").removeClass("text-primary");
          $(".proposal-status").addClass("text-danger");
          $(".proposal-status").html("*Inactive Proposal");
          $(".proposal-status").show();
        } else {
          $(".submit").show();
          $(".proposal-status").hide();
          visi = "d-flex";
        }

        $("#uuid").val(data["id"]);
        $("#proposal_message").empty();
        $("#vendor").html(
          "Vendor Name"
        );
        $("#proposal_date").html(
          moment(data["created_at"]).format("MMMM D, YYYY")
        );

        $("#prepared_by").html(data["prepared_by"]);
        $("#contact_no").html(data["contact_no"]);

        $("#rfq_id").val(data["id"]).trigger("change");


        $("#proposal_message").append(data["message"]);
        $("#notes").html(data["notes"]);

        proposal_items_table.clear().draw();

        // Loop here
        let bg_color = "";
        let fas_status = "";
        let status_text = "";
        for (let i in data.vendor_bidding_item) {
          if (data.vendor_bidding_item[i].status == "active") {
            bg_color = "primary";
            fas_status = "trash";
            status_text = "Remove";
          } else {
            bg_color = "danger";
            fas_status = "redo";
            status_text = "Reactivate";
          }

          proposal_items_table.row
            .add([
              // product catagory
              data.vendor_bidding_item[i].category.category_name,

              // product name
              data.vendor_bidding_item[i].product_name,

              // price
              "\u20B1" +
                numberWithCommas(data.vendor_bidding_item[i].price_per_unit),

              // quantity input field
              // '<input class="form-control product_quantity_of_manual_item" type="number" min="1" value=' +
              data.vendor_bidding_item[i].quantity,
              //  +" />",

              // total cost
              "\u20B1" +
                numberWithCommas(
                  data.vendor_bidding_item[i].price_per_unit *
                    data.vendor_bidding_item[i].quantity
                ),

              // status
              '<label class="text-left badge badge-' +
                bg_color +
                ' p-2 w-100"> ' +
                data.vendor_bidding_item[i].status +
                "</label> ",

              //action

              '<div class="text center dropdown"> <div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
                '<i class="fas fa-ellipsis-v"></i></div> <div class="dropdown-menu dropdown-menu-right">' +
                // view
                '<div class="dropdown-item d-flex" role="button" data-toggle="modal" data-target="#modal-add-new-product" data-toggle="modal" onClick="return editPrDetail( \'' +
                data.vendor_bidding_item[i].id +
                '\',this.parentNode.parentNode.parentNode.parentNode);"><div style="width: 2rem"> <i class="fas fa-eye mr-1"></i></div><div> View</div></div>' +
                // remove
                '<div class="dropdown-item ' +
                visi +
                ' " role="button" data-toggle="modal" onClick="return removePrDetail(this.parentNode.parentNode.parentNode.parentNode, \'' +
                data.id +
                "', '" +
                data.vendor_bidding_item[i].id +
                "', '" +
                data.vendor_bidding_item[i].status +
                '\');"><div style="width: 2rem"> <i class="fas fa-' +
                fas_status +
                ' mr-1"></i></div><div>' +
                status_text +
                "</div></div>" +
                "</div></div>",
            ])
            .draw();

          // push data to new product array object
          edit_new_product.push({
            new_product_category:
              data.vendor_bidding_item[i].new_product_category,

            new_product_name: data.vendor_bidding_item[i].new_product_name,

            new_product_quantity: data.vendor_bidding_item[i].quantity,

            description: data.vendor_bidding_item[i].description,
            quantity: data.vendor_bidding_item[i].quantity,
          });
          // edit_new_product.filter(onlyUnique);
        }

        // console.log(new_product);

        $("#form_id input[type='number'],input[type='text'], textarea").prop(
          "disabled",
          true
        );
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

  if (action == "hide") {
    $(".is-invalid").removeClass("is-invalid");
    $(".is-valid").removeClass("is-valid");
    $(".invalid-feedback").hide();
    // hide and clear form
    $("#uuid").val("");
    $("#div_form").hide();
    proposal_items_table.clear().draw();
    $("#form_id input, select, textarea").prop("disabled", false);
  } else {
    // show
    $("#div_form").show();
    $("#form_id input, select, textarea").prop("disabled", false);
    $("#form_id button").prop("disabled", false);
  }
};

// datatable of price comparisons of vendor proposal
loadTableComparisons = (rfq_id) => {
  $.ajaxSetup({
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
  });
  let filteredURL =""
  if(rfq_id == "none"){
    filteredURL = "vendor-proposal/filtered/proposal/none"
    console.log(rfq_id)
  }
  else{
    filteredURL = "vendor-proposal/filtered/proposal/"+rfq_id
    console.log(rfq_id)
  }
  console.log(filteredURL)
  $("#data-table-comparisons").dataTable().fnClearTable();
  $("#data-table-comparisons").dataTable().fnDraw();
  $("#data-table-comparisons").dataTable().fnDestroy();
  $("#data-table-comparisons").DataTable({
    
    ajax: {
      // url: apiURL + "vendor-proposal/bid/" + '6b1e56e7-053f-4f26-b771-15835d49c0f8',
      url: apiURL + filteredURL,

      dataSrc: "",
    },
    aLengthMenu: [10, 20, 30, 50, 100],
    responsive: true,
    serverSide: false,
    dataType: "json",
    type: "GET",
    columns: [
      {
        data: null,
        name: null,
        // visible: false,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {
          return formatRfqNo(aData.request_quotation.request_quotation_number);
        },
      },
      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {
          return "Vendor Name";
        },
      },

      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {
          return "\u20B1" + numberWithCommas(aData.subtotal);
        },
      },
      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {
          return "\u20B1" + aData.discount;
        },
      },
      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {
          return "\u20B1" + aData.tax;
        },
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

          buttons += "</div></div>";

          return buttons;
        },
      },
    ],
  });
};

// load rfq code for filtering price comparisons
loadRfqCode = () => {
  $.ajax({
    url: apiURL + "request-quotation/status/procure_of_products",
    type: "GET",
    dataType: "json",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
    success: function (responseData) {
      if (responseData) {
        $("#rfq_code").empty();
        $("#rfq_code").append("<option disabled selected>Select RFQ Number</option>");
        $.each(responseData, function (i, dataOptions) {
          var options = "";
          options =
            "<option value='" +
            dataOptions.id +
            "'>" +
            formatRfqNo(dataOptions.request_quotation_number) +
            "</option>";

          $("#rfq_code").append(options);
        });
      } else {
        // notification("error", "Error!", responseData.message);
        console.log("error", "Error!", responseData.success);
      }
    },
    error: function ({ responseJSON }) {},
  });
};

loadRfqCode();

$('#rfq_code').on("change", function(){
  loadTableComparisons($(this).val())
})

// function to show details for viewing/updating
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
          $("#new_item_description").val(data["description"]),
          $("#new_item_price").val(data["price_per_unit"]),
          $("#new_item_quantity").val(data["quantity"]);

        $("#product_modal_form input, select, textarea").prop("disabled", true);
      } else {
        notification("error", "Error!", data.message);
      }
    },
    error: function (data) {},
  });
};

// remove purchase request items from table
removePrDetail = (tr, proposal_id, proposal_item_id, status) => {
  console.log(
    $("td:eq(4)", tr)
      .html()
      .replace(/[^0-9\.-]+/g, "")
  );
  let new_status = "";
  let subtotal = parseInt($("#subtotal").text().replace(/[^0-9\.-]+/g, ""));
  let tax = parseInt($("#tax").text().replace(/[^0-9\.-]+/g, ""));
  let total = parseInt($("#total").text().replace(/[^0-9\.-]+/g, ""));

  if (status == "removed") {
    new_status = "active";
    subtotal += parseInt(
      $("td:eq(4)", tr)
        .html()
        .replace(/[^0-9\.-]+/g, "")
    );
  } else {
    subtotal -= parseInt(
      $("td:eq(4)", tr)
        .html()
        .replace(/[^0-9\.-]+/g, "")
    );

    new_status = "removed";
  }

  tax = parseInt(subtotal) * 0.1;
  total = parseInt(subtotal) + parseFloat(tax.toFixed(2));

  $.ajax({
    url: apiURL + "bidding-item/status/" + proposal_item_id,
    type: "DELETE",
    data: JSON.stringify({
      status: new_status,
    }),
    contentType: "application/json",
    processData: false,
    cache: false,
    dataType: "json",
    success: function (data) {
      console.log(subtotal);
      //       // notification("success", "Success!", data.message);
      editData(proposal_id, 1);
      $("#subtotal").html(parseInt(subtotal));
      $("#tax").html(tax.toFixed(2));
      $("#total").html(total);

      loadTable();

      // notification("info", "Deleted!", "Record Deleted");
    },
    error: function ({ responseJSON }) {},
  });
};



// show rfq 

rfq_detail_table_quotation = () => {
  $("#rfq-detail-table").dataTable().fnClearTable();
  $("#rfq-detail-table").dataTable().fnDraw();
  $("#rfq-detail-table").dataTable().fnDestroy();
  rfq_table = $("#rfq-detail-table").DataTable({
    info: false,
    paging: false,
    searching: false,
    ordering: false,
  });
};

// show ruquest for quotation details on change

$("#rfq_code").on("change", function () {
  console.log(this.value);

  //   load pr

  $("#modal-xl").modal("show");


  $.ajax({
    url: apiURL + "request-quotation/" + this.value,
    type: "GET",
    dataType: "json",
    success: function (data) {
      console.log(data)
      if (data) {
        console.log(data);
        $("#rfq_number").text(
          formatRfqNo(data["request_quotation_number"])
        );
        $("#rfq_prepared_by").val(data["prepared_by"]);
        $("#rfq_budget").val(data.purchase_requisition["given_budget"]);
        $("#rfq_quotation_code").val(data["quotation_code"]);
        $("#rfq_due_date").val(data["due_date"]);
        $("#rfq_message").empty()
        $("#rfq_message").append(data["message"]);


        let related_files_body = "";
        for (let i in data.related_documents) {
          // console.log(data.related_documents[i].attachment)

          related_files_body +=
            "<div >" +
            "<li>" +
            '<a href="#modal-file" data-toggle="modal" onClick="return showFileModal(this,1,\'' +
            data.related_documents[i].attachment +
            '\')" data-id="' +
            data.related_documents[i].attachment +
            '" class="btn-link text-dark"><i class="far fa-fw fa-file-word"></i> ' +
            data.related_documents[i].attachment +
            "</a>" +
            "</li></div>";
        }

        $("#rfq_related_files_body").append(related_files_body);


        console.log(data)



        rfq_table.clear().draw();

        for (let pr_item in data.purchase_requisition.purchase_requisition_detail) {
          if (data.purchase_requisition.purchase_requisition_detail[pr_item].product_id === null) {
            $("#quotation_code").val(
              data.purchase_requisition_detail[pr_item].new_category
                .slice(0, 2)
                .toUpperCase() +
                " - " +
                data["purchase_requisition_number"]
            );
            rfq_table.row
              .add([
                data.purchase_requisition.purchase_requisition_detail[pr_item].new_category,
                data.purchase_requisition.purchase_requisition_detail[pr_item].new_product_name,
                data.purchase_requisition.purchase_requisition_detail[pr_item].description,
                "\u20B1" +
                  numberWithCommas(
                    data.purchase_requisition.purchase_requisition_detail[pr_item].estimated_price
                  ),
                data.purchase_requisition.purchase_requisition_detail[pr_item].quantity,
                "\u20B1" +
                  numberWithCommas(
                    data.purchase_requisition.purchase_requisition_detail[pr_item].quantity *
                      data.purchase_requisition.purchase_requisition_detail[pr_item].estimated_price
                  ),
              ])
              .draw();
          } else {
          
            rfq_table.row
              .add([
                data.purchase_requisition.purchase_requisition_detail[pr_item].product.category
                  .category_name,
                data.purchase_requisition.purchase_requisition_detail[pr_item].product.product_name,
                data.purchase_requisition.purchase_requisition_detail[pr_item].product.description,
                "\u20B1" +
                  numberWithCommas(
                    data.purchase_requisition.purchase_requisition_detail[pr_item].product
                      .estimated_price
                  ),
                data.purchase_requisition.purchase_requisition_detail[pr_item].quantity,
                "\u20B1" +
                  numberWithCommas(
                    data.purchase_requisition.purchase_requisition_detail[pr_item].quantity *
                      data.purchase_requisition.purchase_requisition_detail[pr_item].product
                        .estimated_price
                  ),
              ])
              .draw();
          }
        }
      } else {
        notification("error", "Error!", data.detail);

        console.log("error" + data);
        loadTable();
      }
    },
    error: function ({ responseJSON }) {},
  });
});



// change status of data
deleteData = (id) => {
  $("#del_uuid").val(id);

  console.log(id);
  $("#changeStatus").click(() => {
    $.ajax({
      url: apiURL + "vendor-proposal/" + id,
      type: "DELETE",
      dataType: "json",
      success: function (data) {
        if (data) {
          // notification("success", "Success!", data.message);
          console.log("success" + data);
          loadTable();
        } else {
          notification("info", "Denied!", "Proposal Denied");

          console.log("error" + data);
          loadTable();
        }
      },
      error: function ({ responseJSON }) {},
    });
    $("#changeStatus").attr("data-dismiss", "modal");
  });
};
