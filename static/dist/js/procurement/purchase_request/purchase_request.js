
const formDataDetail = {};
const formData = {};
// removed
var estimated_total_obj = [];
var estimated_total = 0;
// 
// product catalog id array
var product_id_array = [];
// purchase request detail id array
var pr_detail_id_arr = [];

var edit_new_product = [];
var manual_product_id_arr = [];
var edit_product_from_catalog = [];
// new product array
// non catalog
var new_product = [];
// catalog
var new_product_from_catalog = [];

var get_pr_detail_row;
sessionStorage.setItem("product_temp_id", 0);

$(function () {
  // load purchase requisition datatable
  loadTable();

  // load summernotes
  summerNotes();
  
  // load purchase request items datatable
  pr_detail_table();

  // hide form
  formReset("hide");

  // set department name
  $("#department").val(sessionStorage.getItem("DEPARTMENTNAME"));
  $("#requested_by").val(
    "Mike Jackson"
  );

  // ADD EDIT
  $("#form_id")
    .on("submit", function (e) {
      e.preventDefault();
      trimInputFields();
    })
    .validate({
      ignore: ".summernote *",

      rules: {
        // simple rule, converted to {required:true}
        purpose: {
          required: true,
        },
        // compound rule
        qty: {
          required: true,
        },
        message: {
          required: true,
        },
      },
      messages: {
        purpose: {
          required: "please provide a purpose",
          purpose: "please enter valid purpose",
        },
        message: {
          required: "please provide a message",
          purpose: "please enter valid message",
        },

        qty: {
          required: "please provide qty",
          purpose: "please enter valid qty",
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
        var status = $("#status").val();
        var table = $("#pr-detail-table").DataTable();
        var product_quantity = table.$(".product_quantity");
        var product_quantity_of_manual_item = table.$(
          ".product_quantity_of_manual_item"
        );

        formData["department_id"] = sessionStorage.getItem("DEPARTMENTID");
        formData["date_requested"] = Date.now();
        formData["purpose"] = $("#purpose").val();
        formData["message"] = $("#message").val();
        formData["estimated_amount"] = $("#estimated_total").val();
        formData["status"] = status;
        formData["pr_detail"] = [];
        formDataDetail["pr_details_id"] = pr_detail_id_arr;

     

        // push all index of new catalog product to formData["pr_detail"]
        for (let i in new_product_from_catalog) {
          formData["pr_detail"].push(new_product_from_catalog[i]);
        }

        // push all index of new non catalog product to formData["pr_detail"]
        for (var new_product_index in new_product) {
          formData["pr_detail"].push(new_product[new_product_index]);
        }

        
        if (
          formData["pr_detail"].length != 0 ||
          formDataDetail["pr_details_id"].length != 0
        ) {
          if ($("#uuid").val() == "") {
          //  INSERT 
            $.ajax({
              url: apiURL + "purchase-requisition/",
              type: "POST",
              contentType: "application/json",
              data: JSON.stringify(formData),
              dataType: "json",
              processData: false,
              cache: false,
              headers: {
                Accept: "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("TOKEN"),
              },
              success: function (data) {
                if (data) {
                  if (formData["status"] == "Pending") {
                    notification(
                      "success",
                      "Submitted!",
                      "PR Successfuly Submitted"
                    );
                  } else {
                    notification(
                      "success",
                      "Created!",
                      "PR Successfuly Created"
                    );
                  }

                  formReset("hide");
                  product_id_array.splice(0, product_id_array.length);
                  new_product.splice(0, new_product.length);
                  new_product_from_catalog.splice(
                    0,
                    new_product_from_catalog.length
                  );

                  loadTable();
                } else {
                  notification("error", "Error!", "Error creating PR");
                }
              },
              error: function ({ responseJSON }) {
                notification("error", "Error!", responseJSON.detail);

                console.log(responseJSON.detail);

              },
            });
          } else {
            // delete purchase request detail if removed_prDetail_arr(the remove items) is not null
            if (removed_prDetail_arr != null) {
              for (
                let removed_count = 0;
                removed_count < removed_prDetail_arr.length;
                ++removed_count
              ) {
                formDataDetail["pr_details_id"].filter(onlyUnique);
                // delete all removed items
                $.ajax({
                  url:
                    apiURL +
                    "purchase-requisition/pr-detail/" +
                    removed_prDetail_arr[removed_count],
                  type: "DELETE",
                  dataType: "json",
                  success: function (data) {
                    if (data) {
                      formDataDetail["pr_details_id"].filter(onlyUnique);
                    } else {
                    }
                  },
                  error: function ({ responseJSON }) {},
                });
                // }
              }
            }
            // console.log(removed_prDetail_arr);

            // update purchase request
            console.log(formData);
            $.ajax({
              url: apiURL + "purchase-requisition/" + $("#uuid").val(),
              type: "PUT",
              contentType: "application/json",
              data: JSON.stringify(formData),
              // request1: formDataDetail,

              dataType: "json",
              // contentType: false,
              processData: false,
              cache: false,
              success: function (data) {
                for (let i in edit_new_product) {
                  // console.log(edit_new_product[i]);
                  if (
                    removed_prDetail_arr.indexOf(edit_new_product[i].id) > -1
                  ) {
                    continue;
                  } else {
                    // update non catalog products
                    $.ajax({
                      url:
                        apiURL +
                        "purchase-requisition-detail/" +
                        edit_new_product[i].id,
                      type: "PUT",
                      // data: form_data,
                      contentType: "application/json",
                      //form_data,
                      data: JSON.stringify({
                        quantity: edit_new_product[i].quantity,
                        new_category: edit_new_product[i].new_category,
                        new_product_name: edit_new_product[i].new_product_name,
                        estimated_price: edit_new_product[i].estimated_price,
                        description: edit_new_product[i].description,
                      }),
                      dataType: "json",
                      // contentType: false,
                      processData: false,
                      cache: false,
                      success: function (data) {},
                      error: function ({ responseJSON }) {
                        
                      },
                    });
                  }
                }

                for (let k in edit_product_from_catalog) {
                  // console.log(edit_product_from_catalog[k]);
                  if (
                    removed_prDetail_arr.indexOf(
                      edit_product_from_catalog[k].id
                    ) > -1
                  ) {
                    continue;
                  } else {
                    // console.log(
                    //   apiURL +
                    //     "purchase-requisition-detail/" +
                    //     edit_product_from_catalog[k].id
                    // );

                    // console.log($(product_quantity[k]).val());

                    // update catalog products
                    $.ajax({
                      url:
                        apiURL +
                        "purchase-requisition-detail/" +
                        edit_product_from_catalog[k].id,
                      type: "PUT",
                      contentType: "application/json",
                      data: JSON.stringify({
                        quantity: edit_product_from_catalog[k].quantity,
                      }),
                      dataType: "json",
                      processData: false,
                      cache: false,
                      success: function (data) {
                        if (data) {
                        } else {
                          // console.log("error " + data.message);
                        }
                      },
                      error: function ({ responseJSON }) {},
                    });
                  }
                }

                if (data) {
                  if (formData["status"] == "Pending") {
                    notification(
                      "success",
                      "Submitted!",
                      "PR Successfuly Submitted"
                    );
                  } else {
                    notification(
                      "success",
                      "Updated!",
                      "PR Successfuly Updated"
                    );
                  }

                  console.log("success " + data);
                  formReset("hide");
                  // clear all arrays
                  product_id_array.splice(0, product_id_array.length);
                  new_product.splice(0, new_product.length);
                  edit_new_product.splice(0, edit_new_product.length);
                  new_product_from_catalog.splice(
                    0,
                    new_product_from_catalog.length
                  );

                  edit_product_from_catalog.splice(
                    0,
                    edit_product_from_catalog.length
                  );

                  manual_product_id_arr.splice(0, manual_product_id_arr.length);

                  loadTable();
                } else {
                  console.log("error " + data.message);
                }
              },
              error: function ({ responseJSON }) {
                notification("error", "Error!", responseJSON.detail);

                console.log(responseJSON.detail);
              },
            });
          }
        } else {
          notification("error", "Error!", "Please select/create an item");
        }
      },
    });
});

// add product from catalog button
addfromCatalog = () => {
  $("#modal-products").modal("show");
  $(".submit").show();
  $(".submit").html("Submit");
  productTable();
  $("#new_item_uuid").val("");
};

// add new non catalog product button
addNewProduct = () => {
  $("#modal-add-new-product").modal("show");
  $(".add_item_button").html("Add");
  $("#add_manual_product_form")[0].reset();
  $("#new_item_uuid").val("")
  $(".modal-title").html("Add new product");
};

// product table on modal catalog
productTable = () => {
  $.ajaxSetup({
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
  });

  $("#product-table").dataTable().fnClearTable();
  $("#product-table").dataTable().fnDraw();
  $("#product-table").dataTable().fnDestroy();
  $("#product-table").DataTable({
    ajax: { url: apiURL + "product/active-products", dataSrc: "" },
    responsive: true,
    serverSide: false,
    dataType: "json",
    aLengthMenu: [5, 10, 20, 30, 50, 100],
    // paging: false,
    // info: false,
    type: "GET",
    columns: [
      {
        data: null,
        width: "5%",
        render: function (aData, type, row) {
          // let checkbox = "";
          // info
          if (product_id_array.includes(aData["id"])) {
            return (
              '<input type="checkbox" class="product_id" value = "' +
              aData["id"] +
              '" checked disabled>'
            );
          } else {
            return (
              '<input type="checkbox" class="product_id" value = "' +
              aData["id"] +
              '">'
            );
          }
        },
      },
      {
        data: "category.category_name",
        name: "category.category_name",
        searchable: true,
        width: "20%",
      },

      {
        data: "product_name",
        name: "product_name",
        searchable: true,
        width: "10%",
      },
      {
        data: "description",
        name: "description",
        searchable: true,
        width: "35%",
      },
      {
        data: null,
        name: null,
        searchable: true,
        width: "15%",
        render: function (aData, type, row) {
          return "\u20B1" + numberWithCommas(aData.estimated_price);
        },
      },
      {
        data: null,
        name: null,
        searchable: true,
        width: "15%",
        render: function (aData, type, row) {
          // console.log( aData.product_name.replace(/[- + )(]/g,''))
          if ($('.p_' + aData.product_name.replace(/[- + )(]/g,'')).html() != undefined) {
            // console.log($(".p_" + aData.product_name.replace(/[- + )(]/g,'')).html());
            return (
              '<input type="number" min="1" value="' +
              $(".p_" + aData.product_name.replace(/[- + )(]/g,'')).html() +
              '" class="form-control ' +
              aData.product_name.replace(/[- + )(]/g,'') +
              '" readonly/>'
            );
          } else {
            return (
              '<input type="number" min="1" value="1" class="form-control ' +
              aData.product_name.replace(/[- + )(]/g,'') +
              '"/>'
            );
          }
        },
      },
    ],
  });
};

// onclick add product from catalog form
addProduct = () => {
  // $(this).prop("disabled", true);
  let product_table = $("#product-table").DataTable();


  $("#modal-products").modal("hide");
  product_table.$(".product_id:checkbox:checked:enabled").each(function () {
    console.log(this)
    $.ajax({
      url: apiURL + "product/" + $(this).val(),
      type: "GET",
      dataType: "json",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("TOKEN"),
      },
      success: function (responseData) {
        if (responseData) {
          // console.log(responseData)
          prd_table.row
            .add([
              // product category
              responseData.category.category_name,
              // product name
              responseData.product_name,

              // product description
              responseData.description,

              // estimated price
              "\u20B1" +numberWithCommas(responseData.estimated_price),
              // quantity
              '<p class="p_' +
                responseData.product_name.replace(/[- + )(]/g,'') +
                '">' +
                product_table.$("." + responseData.product_name.replace(/[- + )(]/g,'') + "").val() +
                "</p>",

                // total
                "\u20B1" +numberWithCommas(responseData.estimated_price * product_table.$("." + responseData.product_name.replace(/[- + )(]/g,'') + "").val()),
              // '<input class="form-control product_quantity" type="number" min="1" value="1" />',

              // actions
              '<div class="text center dropdown"> <div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
                '<i class="fas fa-ellipsis-v"></i></div> <div class="dropdown-menu dropdown-menu-right">' +
                '<div class="dropdown-item d-flex" role="button" data-toggle="modal" onClick="return removeProduct(this.parentNode.parentNode.parentNode.parentNode,this.parentNode.parentNode.parentNode, \'' +
                responseData.id +
                '\');"><div style="width: 2rem"> <i class="fas fa-trash mr-1"></i></div><div> Remove</div></div>' +
                "</div></div>",
            ])
            .draw();
          product_id_array.push(responseData.id);
          product_id_array.filter(onlyUnique);

          estimated_total += parseFloat(responseData.estimated_price) * parseInt(product_table.$("." + responseData.product_name.replace(/[- + )(]/g,'') + "").val());
          // console.log(estimated_total);
          $("#estimated_total").val(parseFloat(estimated_total));

          new_product_from_catalog.push({
            product_id: responseData.id,
            quantity: product_table.$("." + responseData.product_name.replace(/[- + )(]/g,'') + "").val(),
          });
        } else {
          console.log("error", "Error!", responseData.detail);
        }
      },
      error: function ({ responseJSON }) {},
    });
  });
};

// edit the selected item from catalog

editCatalogProduct = () => {
  $("#edit-product-catalog").modal("hide");

  estimated_total +=
    parseFloat($("#estimated_price").val()) * parseInt($("#catalog_item_quantity").val());

  // if(catalog_item_uuid) includes pr_detail_id_arr
  edit_product_from_catalog.push({
    id: $("#catalog_item_uuid").val(),

    quantity: $("#catalog_item_quantity").val(),
  });

  console.log(edit_product_from_catalog);
  console.log( $("#catalog_item_quantity").val());
  console.log( '<p class="p_' + $('#catalog_item_name').val().replace(/[- + )(]/g,'') +'">' + $("#catalog_item_quantity").val()+
  "</p>");



  $("td:eq(4)", get_pr_detail_row).html('<p class="p_' + $('#catalog_item_name').val().replace(/[- + )(]/g,'') +'">' + $("#catalog_item_quantity").val()+
 "</p>");
  

  $("#estimated_total").val(parseFloat(estimated_total));
};

// add manual product if not exist in cataqlog
addManualProduct = () => {
  $("#modal-add-new-product").modal("hide");

  estimated_total +=
    parseFloat($("#estimated_price").val()) * parseInt($("#new_item_quantity").val());

  if ($("#new_item_uuid").val() == "") {
    sessionStorage.setItem(
      "product_temp_id",
      parseInt(sessionStorage.getItem("product_temp_id")) + 1
    );

    new_product.push({
      temp_id: sessionStorage.getItem("product_temp_id"),

      new_category: $("#new_item_category").val(),
      new_product_name: $("#new_item_name").val(),
      estimated_price: $("#estimated_price").val(),

      description: $("#new_item_description").val(),
      quantity: $("#new_item_quantity").val(),
    });

    $(".add_item_button").html("Add");
    prd_table.row
      .add([
        // product category
        $("#new_item_category").val(),

        // product name
        $("#new_item_name").val(),

        // description
        $("#new_item_description").val(),

        // estimated price
        "\u20B1" +numberWithCommas( $("#estimated_price").val() ),

        // quantity
        $("#new_item_quantity").val(),

        "\u20B1" +numberWithCommas($("#estimated_price").val()* $("#new_item_quantity").val()),


        // actions
        '<div class="text center dropdown"> <div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
          '<i class="fas fa-ellipsis-v"></i></div> <div class="dropdown-menu dropdown-menu-right">' +
          '<div class="dropdown-item d-flex" role="button" data-toggle="modal" onClick="return removeProduct(this.parentNode.parentNode.parentNode.parentNode,this.parentNode.parentNode.parentNode, \'' +
          sessionStorage.getItem("product_temp_id") +
          '\');"><div style="width: 2rem"> <i class="fas fa-trash mr-1"></i></div><div> Remove</div></div>' +
          "</div></div>",
      ])
      .draw();
  } else {
    edit_new_product.push({
      id: $("#new_item_uuid").val(),

      new_category: $("#new_item_category").val(),
      new_product_name: $("#new_item_name").val(),
      estimated_price: $("#estimated_price").val(),

      description: $("#new_item_description").val(),
      quantity: $("#new_item_quantity").val(),
    });

    $("td:eq(0)", get_pr_detail_row).html($("#new_item_category").val());

    $("td:eq(1)", get_pr_detail_row).html($("#new_item_name").val());
    $("td:eq(2)", get_pr_detail_row).html($("#new_item_description").val());
    $("td:eq(3)", get_pr_detail_row).html("\u20B1" +numberWithCommas($("#estimated_price").val()));

    $("td:eq(4)", get_pr_detail_row).html($("#new_item_quantity").val());

    $("td:eq(5)", get_pr_detail_row).html("\u20B1" +numberWithCommas($("#estimated_price").val() * $("#new_item_quantity").val()));


    // $("td:eq(5)", get_pr_detail_row).html($("#new_item_category").val());
  }
  $("#estimated_total").val(parseFloat(estimated_total));
};

// array of removed purchase request detail
var removed_prDetail_arr = [];
// remove product from table catalog
removeProduct = (tr, td, product_id) => {
  prd_table.row(td).remove().draw();

  $("#estimated_total").val(parseFloat($("#estimated_total").val()) - parseFloat($("td:eq(5)", tr).html().replace(/[^0-9\.-]+/g,"")))
  estimated_total = parseFloat($("#estimated_total").val())
  for (i = 0; i < new_product.length; i++) {
    if (new_product[i].temp_id == product_id) {
      // console.log(new_product[i].temp_id)
      new_product.splice(i, 1);
    }    
  }
  for (i = 0; i < new_product_from_catalog.length; i++) {
    if (new_product_from_catalog[i].product_id == product_id) {
      // console.log(new_product[i].temp_id)
      new_product_from_catalog.splice(i, 1);
    }    
  }
  removeA(product_id_array, product_id);
};


// remove purchase request items from table
removePrDetail = (tr,td, product_id, prdetail_id) => {
  removed_prDetail_arr.push(prdetail_id);
  // console.log(removed_prDetail_arr)
  $("#estimated_total").val(parseFloat($("#estimated_total").val()) - parseFloat($("td:eq(5)", tr).html().replace(/[^0-9\.-]+/g,"")))
  estimated_total = parseFloat($("#estimated_total").val())

  prd_table.row(td).remove().draw();
  removeA(product_id_array, product_id);
  removeA(pr_detail_id_arr, prdetail_id);
  // console.log(pr_detail_id_arr)
};

// datatable for purchase request products
pr_detail_table = () => {
  $("#pr-detail-table").dataTable().fnClearTable();
  $("#pr-detail-table").dataTable().fnDraw();
  $("#pr-detail-table").dataTable().fnDestroy();
  prd_table = $("#pr-detail-table").DataTable({
    info: false,
    // paging: false,
    responsive: true,
    aLengthMenu: [5, 10, 20, 30, 50, 100],
    columns: [
      { width: "5%" },
      { width: "15%" },
      { width: "30%" },
      { width: "15%" },
      { width: "5%" },
      { width: "5%" },

      { width: "5%" },
    ],
  });
};

// datatable
// load table of purchase-requisition
loadTable = () => {
  $.ajaxSetup({
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("TOKEN"),
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
        "purchase-requisition/datatable/drafts/" +
        sessionStorage.getItem("DEPARTMENTID"),
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
        searchable: true,
        width: "5%",
        render: function (aData, type, row) {
          return formatPurchaseRequestNo(aData.purchase_requisition_number);
        },
      },
      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {
          // return aData.u_created_by.employees.first_name + " " +aData.u_created_by.employees.last_name
          return "name"

        }
      },
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
        name: null,
        searchable: true,
        width: "5%",
        render: function (aData, type, row) {
          let status =
            '<label class="text-left badge badge-secondary p-2 w-100"> ' +
            aData.status +
            "</label> ";

          return status;
        },
      },
      {
        data: null,
        width: "2%",
        render: function (aData, type, row) {
          let buttons = "";
          buttons +=
            '<div class="text center dropdown"><div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
            '<i class="fas fa-ellipsis-v"></i></div><div class="dropdown-menu dropdown-menu-right">' +
            //view
            '<div class="dropdown-item d-flex" role="button" onClick="return editData(\'' +
            aData["id"] +
            "',0)\">" +
            '<div style="width: 2rem"> <i class= "fas fa-eye mr-1"></i></div>' +
            "<div> View</div></div>" +
            //edit
            '<div class="dropdown-item d-flex" role="button" onClick="return editData(\'' +
            aData["id"] +
            "',1)\">" +
            '<div style="width: 2rem"> <i class= "fas fa-edit mr-1"></i></div>' +
            "<div> Edit</div></div>" +
            //delete

            '<div class="dropdown-item d-flex" role="button" data-toggle="modal" data-target="#modal-status" onClick="return deleteData(\'' +
            aData["id"] +
            "')\"  >" +
            '<div style="width: 2rem"> <i class= "fas fa-trash mr-1"></i></div>' +
            "<div> Delete</div></div>" +
            "</div></div>";
          return buttons;
        },
      },
    ],
  });
};


// view/edit purchase requisition
editData = (id, type) => {
  $(".is-invalid").removeClass("is-invalid");
  $(".is-valid").removeClass("is-valid");

  // remove all data from array
  product_id_array.splice(0, product_id_array.length);
  new_product.splice(0, new_product.length);
  removed_prDetail_arr.splice(0, removed_prDetail_arr.length);
  pr_detail_id_arr.splice(0, pr_detail_id_arr.length);
  new_product_from_catalog.splice(0, new_product_from_catalog.length);
  edit_new_product.splice(0, edit_new_product.length);
  edit_product_from_catalog.splice(0, edit_product_from_catalog.length);

  $.ajax({
    url: apiURL + "purchase-requisition/" + id,
    type: "GET",
    dataType: "json",
    success: function (data) {
      if (data) {
        estimated_total = data.estimated_amount;
        estimated_total_obj = [];
        // $("#estimated_total").val(estimated_amount);

        formReset("show");
        $("#uuid").val(data["id"]);
        $("#generated_pr").html(
          formatPurchaseRequestNo(data["purchase_requisition_number"])
        );
        // $("#requested_by").val(data.u_created_by.employees["first_name"]);
        $("#requested_by").val("employee name");

        $("#purpose").val(data["purpose"]);
        $("#message").summernote("code", data["message"]);
        $("#estimated_total").val(data["estimated_amount"]);
       
        prd_table.clear().draw();

        // Loop here - append product data to datatable product list
        for (var i in data.purchase_requisition_detail) {
          if (data.purchase_requisition_detail[i].product == null) {
            prd_table.row
              .add([
                // product catagory
                data.purchase_requisition_detail[i].new_category,

                // product name
                data.purchase_requisition_detail[i].new_product_name,

                // product description
                data.purchase_requisition_detail[i].description,

                // estimated price
                "\u20B1" +numberWithCommas(data.purchase_requisition_detail[i].estimated_price),

                // quantity input field
                // '<input class="form-control product_quantity_of_manual_item" type="number" min="1" value=' +
                data.purchase_requisition_detail[i].quantity,
                // " />",
                "\u20B1" +numberWithCommas(data.purchase_requisition_detail[i].estimated_price* data.purchase_requisition_detail[i].quantity),

                //action
                '<div class="text center dropdown"> <div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
                  '<i class="fas fa-ellipsis-v"></i></div> <div class="dropdown-menu dropdown-menu-right">' +
                  // view
                  '<div class="dropdown-item d-flex" role="button" data-toggle="modal" onClick="return editPrDetail( \'' +
                  data.purchase_requisition_detail[i].id +
                  '\',this.parentNode.parentNode.parentNode.parentNode);"><div style="width: 2rem"> <i class="fas fa-eye mr-1"></i></div><div> View</div></div>' +
                  // remove
                  '<div class="dropdown-item d-flex" role="button" data-toggle="modal" onClick="return removePrDetail(this.parentNode.parentNode.parentNode.parentNode,this.parentNode.parentNode.parentNode, \'' +
                  "" +
                  "', '" +
                  data.purchase_requisition_detail[i].id +
                  '\');"><div style="width: 2rem"> <i class="fas fa-trash mr-1"></i></div><div> Remove</div></div>' +
                  "</div></div>",
              ])
              .draw();

            // push data to non catalog product array object
            edit_new_product.push({
              id: data.purchase_requisition_detail[i].id,

              new_category: data.purchase_requisition_detail[i].new_category,

              new_product_name:
                data.purchase_requisition_detail[i].new_product_name,
              // product_id: "",

              estimated_price:
                data.purchase_requisition_detail[i].estimated_price,

              description: data.purchase_requisition_detail[i].description,
              quantity: data.purchase_requisition_detail[i].quantity,
            });
            manual_product_id_arr.push(data.purchase_requisition_detail[i].id);
            // edit_new_product.filter(onlyUnique);

            // estimated_total +=
            //   data.purchase_requisition_detail[i].estimated_price *
            //   data.purchase_requisition_detail[i].quantity;

            estimated_total_obj.push({
              id: i,
              price: data.purchase_requisition_detail[i].estimated_price,
              quantity: data.purchase_requisition_detail[i].quantity,
              total:
                data.purchase_requisition_detail[i].estimated_price *
                data.purchase_requisition_detail[i].quantity,
            });
          } else {
            prd_table.row
              .add([
                // product catagory
                data.purchase_requisition_detail[i].product.category
                  .category_name,

                // product name
                data.purchase_requisition_detail[i].product.product_name,

                // product description
                data.purchase_requisition_detail[i].product.description,

                // estimated price
                "\u20B1" +numberWithCommas(data.purchase_requisition_detail[i].product.estimated_price),

                // quantity input field
                // '<input class="form-control product_quantity" type="number" min="1" value=' +
                // data.purchase_requisition_detail[i].quantity,
                '<p class="p_' +
                data.purchase_requisition_detail[i].product.product_name +
                '">' + data.purchase_requisition_detail[i].quantity+
                "</p>",

                // " />",

                "\u20B1" +numberWithCommas(data.purchase_requisition_detail[i].product.estimated_price* data.purchase_requisition_detail[i].quantity),


                //action
                '<div class="text center dropdown"> <div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
                  '<i class="fas fa-ellipsis-v"></i></div> <div class="dropdown-menu dropdown-menu-right">' +
                  // view
                  '<div class="dropdown-item d-flex" role="button" data-toggle="modal" onClick="return editPrDetail( \'' +
                  data.purchase_requisition_detail[i].id +
                  '\',this.parentNode.parentNode.parentNode.parentNode);"><div style="width: 2rem"> <i class="fas fa-eye mr-1"></i></div><div> View</div></div>' +
                  // remove
                  '<div class="dropdown-item d-flex" role="button" data-toggle="modal" onClick="return removePrDetail(this.parentNode.parentNode.parentNode.parentNode,this.parentNode.parentNode.parentNode, \'' +
                  data.purchase_requisition_detail[i].product.id +
                  "', '" +
                  data.purchase_requisition_detail[i].id +
                  '\');"><div style="width: 2rem"> <i class="fas fa-trash mr-1"></i></div><div> Remove</div></div>' +
                  "</div></div>",
              ])
              .draw();

            product_id_array.push(
              data.purchase_requisition_detail[i].product.id
            );
            product_id_array.filter(onlyUnique);

            edit_product_from_catalog.push({
              id: data.purchase_requisition_detail[i].id,
              product_id: data.purchase_requisition_detail[i].product.id,
              product_name:
                data.purchase_requisition_detail[i].product.product_name,
              quantity: data.purchase_requisition_detail[i].quantity,
            });

            estimated_total_obj.push({
              id: i,
              price:
                data.purchase_requisition_detail[i].product.estimated_price,
              quantity: data.purchase_requisition_detail[i].quantity,
              total:
                data.purchase_requisition_detail[i].product.estimated_price *
                data.purchase_requisition_detail[i].quantity,
            });
          }
          pr_detail_id_arr.push(data.purchase_requisition_detail[i].id);
          pr_detail_id_arr.filter(onlyUnique);
        }

        // if data is for viewing only
        if (type == 0) {
          $("#form_id input, select, textarea").prop("disabled", true);
          $(".submit").hide();
          $(".save-draft").hide();
          $(".addProduct").hide();
        } else {
          $("#form_id input, select, textarea").prop("disabled", false);
          $(".submit").show();
          $("#update-button").show();
          $(".save-draft").hide();
          $(".submit").html("Submit");
          $(".submit").append('<i class="fas fa-file-export ml-1"></i>');
        }
      } else {
        notification("error", "Error!", data);
      }
    },
    error: function (data) {},
  });
};

// edit purchase requisition item
editPrDetail = (id, tr) => {
  $("#add_manual_product_form")[0].reset();
  $(".modal-title").html("Update Item");
  $(".add_item_button").html("Update");
  get_pr_detail_row = tr;

  $(".is-invalid").removeClass("is-invalid");
  $(".is-valid").removeClass("is-valid");

  $.ajax({
    url: apiURL + "purchase-requisition-detail/" + id,
    type: "GET",
    dataType: "json",
    success: function (data) {
      if (data) {
        console.log(data);
        if (data["product_id"] == null) {
          $("#modal-add-new-product").modal("show");
          $("#new_item_uuid").val(data["id"]);
          $("#new_item_category").val(data["new_category"]);
          $("#new_item_name").val(data["new_product_name"]);
          $("#estimated_price").val(data["estimated_price"]);

          $("#new_item_description").val(data["description"]);
          $("#new_item_quantity").val(data["quantity"]);
        } else {
          $("#edit-product-catalog").modal("show");

          $("#catalog_item_uuid").val(data["id"]);
          $("#catalog_item_category").val(
            data.product.category["category_name"]
          );
          $("#catalog_item_name").val(data.product["product_name"]);
          $("#catalog_product_price").val(data.product["estimated_price"]);

          $("#catalog_item_description").val(data.product["description"]);
          $("#catalog_item_quantity").val(data["quantity"]);
        }
      } else {
        notification("error", "Error!", data.message);
      }
    },
    error: function (data) {},
  });
};

// change status of purchase requisition
deleteData = (id) => {
  $("#del_uuid").val(id);

  $(".modal-title").html("Delete PR");
  formReset("hide");
};

changeStatus = () => {
  $.ajax({
    url: apiURL + "purchase-requisition/" + $("#del_uuid").val(),
    type: "DELETE",
    dataType: "json",
    success: function (data) {
      notification("info", "Warning", "Draft has been deleted");
      // console.log("success" + data);
      loadTable();
    },
    error: function ({ responseJSON }) {},
  });
  $("#changeStatus").attr("data-dismiss", "modal");
};

// 		action = show, hide
formReset = (action = "hide") => {
  $("html, body").animate({ scrollTop: 0 }, "slow");

  if (action == "hide") {
    // hide and clear form
    estimated_total = 0;
    $("#uuid").val("");
    $("#purpose").val("");
    $("#total").val("");
    $("#generated_pr").html("New");
    $("#div_form").hide();
    $("#btn_add").show();
    // $("#purpose").val("");
    $("#message").summernote("code", "");
    prd_table.clear().draw();
    product_id_array.splice(0, product_id_array.length);
    new_product.splice(0, new_product.length);
    edit_new_product.splice(0, edit_new_product.length);
    new_product_from_catalog.splice(0, new_product_from_catalog.length);

    edit_product_from_catalog.splice(0, edit_product_from_catalog.length);

    removed_prDetail_arr.splice(0, removed_prDetail_arr.length);
  } else if (action == "show") {
    // show
    $("#div_form").show();
    $(".submit").show();
    $(".save-draft").show();
    $(".addProduct").show();
    $("#btn_add").hide();
    $("#update-button").hide();

    $("#form_id input, select, textarea").prop("disabled", false);
    $("#form_id button").prop("disabled", false);
  }
};

// textareas summernotes
summerNotes = () => {
  $(document).ready(function () {
    $("#new_item_description").summernote({
      height: 150,
      minHeight: null, // set minimum height of editor
      maxHeight: null, // set maximum height of editor
      focus: true,

      toolbar: [
        ["style", ["style"]],
        [
          "font",
          [
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "superscript",
            "subscript",
            "clear",
          ],
        ],
        ["fontname", ["fontname"]],
        ["fontsize", ["fontsize"]],
        ["color", ["color"]],
        ["para", ["ol", "ul", "paragraph", "height"]],
        ["table", ["table"]],
        ["insert", ["link"]],
        ["view", ["undo", "redo", "fullscreen", "codeview", "help"]],
      ],
    });

    $("#message").summernote({
      height: 150,
      minHeight: null, // set minimum height of editor
      maxHeight: null, // set maximum height of editor
      focus: true,

      toolbar: [
        ["style", ["style"]],
        [
          "font",
          [
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "superscript",
            "subscript",
            "clear",
          ],
        ],
        ["fontname", ["fontname"]],
        ["fontsize", ["fontsize"]],
        ["color", ["color"]],
        ["para", ["ol", "ul", "paragraph", "height"]],
        ["table", ["table"]],
        ["insert", ["link"]],
        ["view", ["undo", "redo", "fullscreen", "codeview", "help"]],
      ],
    });
  });
};
