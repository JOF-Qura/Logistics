// remove duplicate in product array
function onlyUnique(a) {
  return [...new Set(a)];
}


const formDataDetail = {};
const formData = {};
bidding_items_id = [];

$(function () {
  // initialized select2
  $(".select2").select2();
  // load datatable
  loadTable();
  summerNotes();
  
  rfq_detail_table_quotation();
  proposal_items();
  formReset("hide");
  // infoCardReset("hide")

  

  $("#form_id")
    .on("submit", function (e) {
      e.preventDefault();
      // trimInputFields();
    })
    .validate({
      ignore: ".summernote *",

      rules: {
        // simple rule, converted to {required:true}
        request_quotation_id: {
          required: true,
        },
        // compound rule
        prepared_by: {
          required: true,
        },
        contact_no: {
          required: true,
        },

        arrival_date: {
          required: true,
        },
     
      },
      messages: {
        request_quotation_id: {
          required: "please select rfq",
        },

        prepared_by: {
          required: "please provide a name",
        },
        contact_no: {
          required: "please provide a contact number",
        },
        arrival_date: {
          required: "please provide a arrival date",
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
        // var product_quantity_of_manual_item = table.$(
        //   ".product_quantity_of_manual_item"
        formData["status"] = $("#status").val();

        formData["request_quotation_id"] = $("#request_quotation_id").val();
        formData["subtotal"] = $("#subtotal").val().replace(/[^0-9\.-]+/g,"");

        formData["notes"] = $("#notes").val();
        formData["prepared_by"] = $("#prepared_by").val();
        formData["contact_no"] = $("#contact_no").val();
        formData["arrival_date"] = $("#arrival_date").val();

        formData["discount"] = $("#discount").val().replace(/[^0-9\.-]+/g,"");
        formData["tax"] = $("#tax").val().replace(/[^0-9\.-]+/g,"");
        formData["total_amount"] = parseFloat($("#total").val().replace(/[^0-9\.-]+/g,""));
        formData["message"] = $("#proposal_message").val();
        formData["vendor_bidding_item"] = [];

        // push all index of product_id_array to formData["pr_detail"]
        for (var new_product_index in new_product) {
          formData["vendor_bidding_item"].push(new_product[new_product_index]);
        }

        // push all index of product_id_array to formData["pr_detail"]
        // for (var new_product_index in new_product) {
        //   formData["vendor_bidding_item"].push(new_product[new_product_index]);
        // }

        formDataDetail["bidding_items_id"] = bidding_items_id;




        if(formData["vendor_bidding_item"].length != 0  || formDataDetail["bidding_items_id"].length != 0){
          if ($("#uuid").val() == "") {
            $.ajax({
              url: apiURL + "vendor-proposal/",
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
                let temp_p_id = data.id;
                delete data.id
                console.log(data)
                if (data) {
                  notification(
                    "success",
                    "Created!",
                    "Proposal Successfuly Created"
                  );
                  formReset("hide");
                  new_product.splice(0, new_product.length);
                  bidding_items_id.splice(0, bidding_items_id.length);

                  $.ajax({
                    url:
                      apiURL +
                      "vendor-audit-trail",
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json",
                
                    data: JSON.stringify({
                      crud: "Insert",
                      table:"vendor_proposal",
                      payload:JSON.stringify(data),
                      client_ip:localStorage.getItem("CLIENT_IP"),
                      vendor_id:localStorage.getItem("ID")
                    }),
                    success: function (data) {
                  
                    },
                    error: function ({ responseJSON }) {},
                  });

                  
                  if(file_arr.length != 0){
                    for(let i in file_arr){
                      let formDataFiles = new FormData();
                      formDataFiles.append('attachment', file_arr[i])
                      formDataFiles.append('vendor_proposal_id', temp_p_id)

                      // for (let value of formDataFiles.values()) {
                      //   console.log(value);
                      // }
                      $.ajax({
                        url:
                        apiURL + "related-documents/",
                        type: "POST",
                        data: formDataFiles,
                        dataType: "json",
                        contentType: false,
                        processData: false,
                        cache: false,
                        success: function (data) {
                          
                        },
                        error: function ({ responseJSON }) {},
                      });


                    }
                  }
  
                  loadTable();
                  
                } else {
                  notification("error", "Error!", "Error creating proposal");
                  console.log("error");
                }
              },
              error: function ({ responseJSON }) {
                notification("error", "Error!", responseJSON.detail);

                console.log(responseJSON);
              },
            });
          }  
            else {

            // delete purchase request detail if removed_bid_item_arr is not null
            if (removed_bid_item_arr != null) {
              for (
                let removed_count = 0;
                removed_count < removed_bid_item_arr.length;
                ++removed_count
              ) {
                if (removed_bid_item_arr[removed_count] != "") {
                // formDataDetail["vendor_bidding_item"].filter(onlyUnique);
                console.log(apiURL +
                  "bidding-item/" +
                  removed_bid_item_arr[removed_count])
                $.ajax({
                  url:
                    apiURL +
                    "bidding-item/" +
                    removed_bid_item_arr[removed_count],
                  type: "DELETE",
                  dataType: "json",
                  success: function (data) {
                    if (data) {
      
                    } else {
     
                    }
                  },
                  error: function ({ responseJSON }) {},
                });
                }
              }
            }
            // // console.log(removed_bid_item_arr);
          
  
            // // console.log(formData);
            // // update purchase request
            $.ajax({
              url: apiURL + "vendor-proposal/" + $("#uuid").val(),
              type: "PUT",
              contentType: "application/json",
              data: JSON.stringify({
                request: formData,
                request1: formDataDetail,
              }),
  
              dataType: "json",
              // contentType: false,
              processData: false,
              cache: false,
              success: function (data) {
                console.log(data)

                for (var edit_new_product_index in edit_new_product) {
                 if(removed_bid_item_arr.indexOf(edit_new_product[edit_new_product_index].id) > -1){
                   continue
                 }else{
  
                  $.ajax({
                    url: apiURL + "bidding-item/" + edit_new_product[edit_new_product_index].id,
                    type: "PUT",
                    // data: form_data,
                    contentType: "application/json",
                    //form_data,
                    data: JSON.stringify({
                      category_id: edit_new_product[edit_new_product_index].category_id,
                      product_name: edit_new_product[edit_new_product_index].product_name,
                      price_per_unit: edit_new_product[edit_new_product_index].price_per_unit,
                      quantity: edit_new_product[edit_new_product_index].quantity,
                      description: edit_new_product[edit_new_product_index].description
                    }),
                    dataType: "json",
                    // contentType: false,
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

                  $.ajax({
                    url:
                      apiURL +
                      "vendor-audit-trail",
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json",
                
                    data: JSON.stringify({
                      crud: "Update",
                      table:"vendor_proposal",
                      payload:JSON.stringify(data),
                      client_ip:localStorage.getItem("CLIENT_IP"),
                      vendor_id:localStorage.getItem("ID")
                    }),
                    success: function (data) {
                  
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
                    notification("success", "Updated!", "PR Successfuly Updated");
                  }
  
                  console.log("success " + data);
                  formReset("hide");
                  edit_new_product.splice(0, edit_new_product.length);
  
                  loadTable();
                } else {
                  console.log("error " + data.message);
                }
              },
              error: function ({ responseJSON }) {},
            });
          }
        }

        else{
          notification("error", "Error!", "Please add a product");

        }
     
      },
    });

  $("#product_pic").change(function () {
    readURL(this);
  });
});

// remove proposal items
removeProduct = (tr, td, product_id) => {
  console.log(td)
  subtotal = $("#subtotal").val() - $("td:eq(5)", tr).html().replace(/[^0-9\.-]+/g,"")

  console.log(subtotal)
  $("#subtotal").val(subtotal);
      
  temp_tax = subtotal * 0.1

  $("#tax").val(temp_tax.toFixed(2));
  $("#total").val(((subtotal + temp_tax) - $("#discount").val()).toFixed(2));

 

  
  for(let i=0; i < new_product.length; i++ ){
    if(new_product[i].temp_id == product_id){
    proposal_items_table.row(td).remove().draw();
    // console.log(new_product[i].temp_id)
    new_product.splice(i, 1); 
    }
  }
  console.log(new_product)

  
};


var pr_detail_id_arr = [];



// remove pproposal items from table
removePrDetail = (tr,td, proposal_item_id) => {
  
  subtotal = parseFloat($("#subtotal").val().replace(/[^0-9\.-]+/g,"")) - $("td:eq(5)", tr).html().replace(/[^0-9\.-]+/g,"")
  $("#subtotal").val(subtotal)
 
  // console.log(subtotal - $("td:eq(5)", tr).html().replace(/[^0-9\.-]+/g,""));
      
  temp_tax = subtotal * 0.1

  $("#tax").val(temp_tax.toFixed(2));


  $("#total").val(numberWithCommas(((subtotal + temp_tax) - $("#discount").val()).toFixed(2)));

  removed_bid_item_arr.push(proposal_item_id);

  proposal_items_table.row(td).remove().draw();
  removeA(bidding_items_id, proposal_item_id);
  console.log(bidding_items_id)
};



// vendor proposal datatable
loadTable = () => {
  console.log(localStorage.getItem("USERID"))
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
        "vendor-proposal/one-vendor-proposals/" +
        localStorage.getItem("USERID"),
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
        searchable: true,
        width: "5%",
        render: function (aData, type, row) {
          return formatRfqNo(aData.request_quotation.request_quotation_number);
        },
      },
      {
        data: "prepared_by",
        name: "prepared_by",
        searchable: true,
        width: "10%",
      },

      {
        data: null,
        name: null,
        searchable: true,
        width: "5%",
        render: function (aData, type, row) {
          if (aData.status === "Draft") {
            let status =
              '<label class="text-left badge badge-secondary p-2 w-100"> ' +
              aData.status +
              "</label> ";
            return status;
          } else if (aData.status === "Awarded") {
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
          }
          else {
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
            '<div class="dropdown-item d-flex role="button" onClick="return editData(\'' +
            aData["id"] +
            "',0)\">" +
            '<div style="width: 2rem"> <i class= "fas fa-eye mr-1"></i></div>' +
            "<div> View</div></div>";

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


// request for quotation items

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


// datatable for pr products
proposal_items = () => {
  $("#proposal-items-table").dataTable().fnClearTable();
  $("#proposal-items-table").dataTable().fnDraw();
  $("#proposal-items-table").dataTable().fnDestroy();
  proposal_items_table = $("#proposal-items-table").DataTable({
    // order: [ [ 0, "asc" ] ],
		// 	responsive: {
		//         details: {
		//             type: 'column',
		//             target: 'tr'
		//         }
		//     },
		//     columnDefs: [ {
		//         className: 'control',
		//         orderable: false,
		//         targets: -1  //-1 is last index/column, 0 is first
		//     } ],
    info: false,
    // paging: false,
    responsive: true,
    aLengthMenu: [5, 10, 20, 30, 50, 100],
  });
};

var subtotal = 0;
var total = 0;
var w_tax = 0;

var new_product = [];
var edit_new_product = []

// all request for quotation
loadRFQ = () => {
  $.ajax({
    url: apiURL + "request-quotation/vendor/" + localStorage.getItem("ID") + "/procure_of_products/Approved",
    type: "GET",
    dataType: "json",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
    success: function (responseData) {
      if (responseData) {
        $("#request_quotation_id").empty();
        $("#request_quotation_id").append(
          "<option disabled selected>Select Request Quotation</option>"
        );

        $.each(responseData, function (i, dataOptions) {
          var options = "";
          

            options +=
              "<option value='" +
              dataOptions.RequestQuotation.id +
              "'>" +
              formatRfqNo(dataOptions.RequestQuotation.request_quotation_number) +
              "</option>";
        

          $("#request_quotation_id").append(options);
        });
      } else {
        // notification("error", "Error!", responseData.message);
        console.log("error", "Error!", responseData.success);
      }
    },
    error: function ({ responseJSON }) {},
  });
};

loadRFQ();


// add new product button
addNewProduct = () => {
  $(".is-invalid").removeClass("is-invalid");
  $(".is-valid").removeClass("is-valid");
  $(".invalid-feedback").hide();
  $("#new_item_uuid").val("")
  $("#modal-add-new-product").modal("show");
  $(".add_item_button").html("Add");
  $("#product_modal_form")[0].reset();
  $('#btn-product-edit').hide()
  $('#btn-product-add').show()

  $(".modal-title").html("Add new product");
};
sessionStorage.setItem("product_temp_id", 0);

addManualProduct = () => {
  
  $("#product_modal_form").validate({
    ignore: ".summernote *",

    rules: {
      new_item_category: {
        required: true,
      },
      new_item_name: {
        required: true,
      },
      new_item_description: {
        required: true,
      },
      new_item_price: {
        required: true,
      },
      new_item_quantity: {
        required: true,
      },
    },
    messages: {
      new_item_category: {
        required: "This field is required",
      },
      new_item_name: {
        required: "This field is required",
      },
      new_item_description: {
        required: "This field is required",
      },
      new_item_price: {
        required: "This field is required",
      },
      new_item_quantity: {
        required: "This field is required",
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
      $("#modal-add-new-product").modal("hide");
      // $(".product_id:checkbox:checked:enabled").each(function () {
        
       
        
        if ($("#new_item_uuid").val() == "") {
        sessionStorage.setItem("product_temp_id", parseInt(sessionStorage.getItem("product_temp_id")) + 1)
        new_product.push({
          temp_id: sessionStorage.getItem("product_temp_id"),
          category_id: $("#category_id").val(),
          product_name: $("#new_item_name").val(),
          description: $("#new_item_description").val(),
          price_per_unit: $("#new_item_price").val(),
          quantity: $("#new_item_quantity").val(),
          total: $("#new_item_price").val() * $("#new_item_quantity").val(),
        });

        console.log($("#new_item_price").val())
        console.log($("#new_item_price").val())

        subtotal += $("#new_item_price").val() * $("#new_item_quantity").val();
        total += $("#new_item_price").val() * $("#new_item_quantity").val();
        console.log(subtotal)

      proposal_items_table.row
        .add([
    
          // product category
          $("#category_id option:selected").html(),

          // product name
          $("#new_item_name").val(),

          // description
          $("#new_item_description").val(),

          // price
          "\u20B1" + numberWithCommas($("#new_item_price").val()),

          // quantity
          $("#new_item_quantity").val(),

          // total price
          "\u20B1" +
            numberWithCommas(
              $("#new_item_price").val() * $("#new_item_quantity").val()
            ),

        //action
        '<div class="text center dropdown"> <div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
        '<i class="fas fa-ellipsis-v"></i></div> <div class="dropdown-menu dropdown-menu-right">' +
       
        // remove
        '<div class="dropdown-item d-flex" role="button" data-toggle="modal" onClick="return removeProduct(this.parentNode.parentNode.parentNode.parentNode,this.parentNode.parentNode.parentNode, \'' +
        sessionStorage.getItem("product_temp_id") +
        '\');"><div style="width: 2rem"> <i class="fas fa-trash mr-1"></i></div><div> Remove</div></div>' +
        "</div></div>",
        ])
        .draw();
      }else{
        for(i=0; i < edit_new_product.length; i++ ){
          if(edit_new_product[i].id == $("#new_item_uuid").val()){
          console.log(edit_new_product[i].id)
          subtotal -= edit_new_product[i].price_per_unit * edit_new_product[i].quantity
          total -= edit_new_product[i].price_per_unit * edit_new_product[i].quantity

          edit_new_product.splice(i, 1); 
          }
        }

        edit_new_product.push({
          id: $("#new_item_uuid").val(),
          category_id: $("#category_id").val(),
          product_name: $("#new_item_name").val(),
          description: $("#new_item_description").val(),
          price_per_unit: $("#new_item_price").val(),
          quantity: $("#new_item_quantity").val(),
          total: $("#new_item_price").val() * $("#new_item_quantity").val(),
        });
  
        subtotal += $("#new_item_price").val() * $("#new_item_quantity").val();
        total += $("#new_item_price").val() * $("#new_item_quantity").val();

        $("td:eq(0)", get_pr_detail_row).html( $("#category_id option:selected").html());
    
    
        $("td:eq(1)", get_pr_detail_row).html($("#new_item_name").val());
        $("td:eq(2)", get_pr_detail_row).html($("#new_item_description").val());
        $("td:eq(3)", get_pr_detail_row).html($("#new_item_price").val());
    
        $("td:eq(4)", get_pr_detail_row).html($("#new_item_quantity").val());
        $("td:eq(5)", get_pr_detail_row).html($("#new_item_price").val() * $("#new_item_quantity").val());
      }

      $("#subtotal").val(subtotal);
      
      temp_tax = subtotal * 0.1

      
      $("#tax").val(temp_tax.toFixed(2));
      // console.log(w_tax);
      // if (w_tax == 0) {
        console.log(subtotal + temp_tax)
        $("#total").val((subtotal + temp_tax) -$("#discount").val() );
      // } else {
      //   $("#total").val(total + temp_tax);
      //   // console.log(w_tax);
      // }


    },
  });
};

$("#discount").keyup(function (e) {
  // if($("#uuid").val() != ""){}
  let charCode = (e.which) ? e.which : e.keyCode
  if (charCode > 31 && (charCode < 48 || charCode > 57)){
    return false
  }
  else{
    if ($("#discount").val() != "") {
      if ($("#tax").val() != "") {
        
        $("#total").val(
          (parseInt( $("#subtotal").val()) + parseInt($("#tax").val()))- $("#discount").val()
        );
        // w_tax = parseInt($("#tax").val()) - parseInt($("#discount").val());
      } else {
        

        $("#total").val(parseInt( $("#subtotal").val()) - parseInt($("#discount").val()));
        // w_tax = parseInt($("#discount").val());
      }
    } else {

      if ($("#tax").val() != "") {
        console.log("here2")
        $("#total").val(parseInt($("#tax").val()) + parseInt( $("#subtotal").val()));
        w_tax = parseInt($("#tax").val());
      } else {
        $("#total").val(0 + subtotal);
        // w_tax = 0;
      }
    }

  }
});


viewRFQ = () => {
  if ($("#request_quotation_id").val() != null) {
    console.log($("#request_quotation_id").val());
    $("#modal-xl").modal("show");
  }
};

$("#request_quotation_id").on("change", function () {
  console.log(this.value);

  //   load pr

  $("#modal-xl").modal("show");

  let vendor_id = localStorage.getItem("ID")


  //   console.log(id);
  $.ajax({
    url: apiURL + "request-quotation/vendor/"+ vendor_id +"/"+ this.value,
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
          if (data.purchase_requisition.purchase_requisition_detail[pr_item].product_id === null && data.purchase_requisition.purchase_requisition_detail[pr_item].supply_id === null) {
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
          } else if (data.purchase_requisition.purchase_requisition_detail[pr_item].supply_id != null) {
          
            rfq_table.row
              .add([
                data.purchase_requisition.purchase_requisition_detail[pr_item].supply.category
                  .category_name,
                data.purchase_requisition.purchase_requisition_detail[pr_item].supply.product_name,
                data.purchase_requisition.purchase_requisition_detail[pr_item].supply.description,
                "\u20B1" +
                  numberWithCommas(
                    data.purchase_requisition.purchase_requisition_detail[pr_item].supply
                      .estimated_price
                  ),
                data.purchase_requisition.purchase_requisition_detail[pr_item].quantity,
                "\u20B1" +
                  numberWithCommas(
                    data.purchase_requisition.purchase_requisition_detail[pr_item].quantity *
                      data.purchase_requisition.purchase_requisition_detail[pr_item].supply
                        .estimated_price
                  ),
              ])
              .draw();
          } else if (data.purchase_requisition.purchase_requisition_detail[pr_item].product_id != null && data.purchase_requisition.purchase_requisition_detail[pr_item].supply_id === null) {
          
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

// array of removed purchase request detail
var removed_bid_item_arr = [];
// remove product from table

// function to show details for viewing/updating
editData = (id, type) => {
  // insert tr??
  $(".is-invalid").removeClass("is-invalid");
  $(".is-valid").removeClass("is-valid");

  // remove all data from array

  new_product.splice(0, new_product.length);
  edit_new_product.splice(0, edit_new_product.length);

  bidding_items_id.splice(0, bidding_items_id.length);


  console.log(new_product);

  $.ajax({
    url: apiURL + "vendor-proposal/" + id,
    type: "GET",
    dataType: "json",
    success: function (data) {
      if (data) {
        formReset("show");

        $("#related_files_body").empty()
        let related_files_body =""
        for(let i in data.related_documents){
          console.log(data.related_documents[i].attachment)
   
          related_files_body += '<div >' +
          '<li>' + '<a href="#modal-file" data-toggle="modal" onClick="return showFileModal(this,1,\'' + data.related_documents[i].attachment + '\')" data-id="'+data.related_documents[i].attachment+'" class="btn-link text-dark"><i class="far fa-fw fa-file-word"></i> '+data.related_documents[i].attachment+'</a>' 
          + '</li></div>'
        }
        
        $("#related_files_body").append(related_files_body)

        $("#uuid").val(data["id"]);
  
        $("#prepared_by").val(data["prepared_by"]);
        $("#contact_no").val(data["contact_no"]);
        $("#arrival_date").val(data["arrival_date"]);
        $("#notes").val(data["notes"]);
        $("#created_at").html(
          moment(data["created_at"]).format("MMMM D, YYYY")
        );
        // $("#rfq_number").html(
        //   formatRfqNo(data.request_quotation["request_quotation_number"])
        // );

        $("#request_quotation_id").val(data["request_quotation_id"]).trigger("change");
        

        $("#subtotal").val(numberWithCommas(data["subtotal"]));

        $("#discount").val(data["discount"]);
        $("#tax").val(numberWithCommas(data["tax"]));
        $("#total").val(numberWithCommas(data["total_amount"]));
        $("#proposal_message").summernote("code", data["message"]);

       subtotal = parseFloat(data["subtotal"]);
        total = parseFloat(data["total_amount"]);

        proposal_items_table.clear().draw();
          
        // Loop here
        for (var i in data.vendor_bidding_item) {
          proposal_items_table.row
            .add([
              // product pic
              // '<label class="text-center badge badge-secondary p-2 w-100"><i class="fas fa-file-image"></i></label> ',

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
                '<div class="dropdown-item d-flex" role="button" data-toggle="modal" onClick="return editPrDetail( \'' +
                data.vendor_bidding_item[i].id +
                '\',this.parentNode.parentNode.parentNode.parentNode);"><div style="width: 2rem"> <i class="fas fa-eye mr-1"></i></div><div> View</div></div>' +
                // remove
                // '<div class="dropdown-item d-flex" role="button" data-toggle="modal" onClick="return removePrDetail(this.parentNode.parentNode.parentNode.parentNode, this.parentNode.parentNode.parentNode, \'' +
                // data.vendor_bidding_item[i].id +
                // '\');"><div style="width: 2rem"> <i class="fas fa-trash mr-1"></i></div><div> Remove</div></div>' +
                "</div></div>",
            ])
            .draw();

          // push data to new product array object
          edit_new_product.push({
            id:data.vendor_bidding_item[i].id,
            category_id: data.vendor_bidding_item[i].category.id,

            product_name: data.vendor_bidding_item[i].product_name,
            price_per_unit: data.vendor_bidding_item[i].price_per_unit,

            description: data.vendor_bidding_item[i].description,
            quantity: data.vendor_bidding_item[i].quantity,
            total:
              data.vendor_bidding_item[i].price_per_unit *
              data.vendor_bidding_item[i].quantity,
          });
          bidding_items_id.push(data.vendor_bidding_item[i].id);
        }

        console.log(edit_new_product);
        console.log(bidding_items_id)

        // if data is for viewing only
        if (type == 0) {
          $("#form_id input, select, textarea").prop("disabled", true);
          $(".submit").hide();
          $(".save-draft").hide();
          $(".addProduct").hide();
          $("#add-files-button").hide()
          $('#proposal_message').summernote('disable');
          $('#new_item_description').summernote('disable');

          $('#product_modal_form input, select,textarea').prop("disabled", true);


        } else {
          $("#form_id input, select, textarea").prop("disabled", false);
          $(".submit").show();
          $("#update-button").show();
          $(".save-draft").hide();
          $(".submit").html("Submit");
          $(".submit").append('<i class="fas fa-file-export ml-1"></i>');
          $('#proposal_message').summernote('enable');

        }
      } else {
        notification("error", "Error!", data.message);
      }
    },
    error: function (data) {},
  });
};



const formStatus = {};
redoData = (id, type) => {

  if (type == 1) {
    $("#modal-default").modal("show");
    $(".cancel-request").html(
      '<i class="text-secondary fas fa-exclamation-triangle mr-2"></i>' +
        "Cancel Proposal"
    );
    $(".request-modal-body").html("Are you sure you want to Cancel this proposal?");
    $("#changeStatus").attr('class', 'btn btn-info');

    $("#changeStatus").html("Yes, Cancel it")

    $("#resend").hide();

    $("#status_uuid").val(id);
    formStatus["status"] = "Cancelled";
  } else {
    $(".budget-row").hide();
    $(".request-modal-body").html("Are you sure you want to resend this proposal?");
    $("#changeStatus").html("Yes, Resend it")
    $("#changeStatus").attr('class', 'btn btn-primary');

    $("#modal-default").modal("show");
    $(".cancel-request").html(
      '<i class="text-secondary fas fa-exclamation-triangle mr-2"></i>' +
        "Resend Proposal"
    );

    $("#cancel").hide();
    $("#resend").show();

    $("#status_uuid").val(id);

    formStatus["status"] = "Pending";
  }

  
};


// function to show details for viewing/updating
editPrDetail = (id, tr) => {
  $("#product_modal_form")[0].reset();
  $(".modal-title").html("Update Item");
  $(".add_item_button").html("Update");
  get_pr_detail_row = tr;

  $(".is-invalid").removeClass("is-invalid");
  $(".is-valid").removeClass("is-valid");

  $('#btn-product-edit').show()
  $('#btn-product-add').hide()

  $.ajax({
    url: apiURL + "bidding-item/" + id,
    type: "GET",
    dataType: "json",
    success: function (data) {
      if (data) {
        console.log(data);

          $("#modal-add-new-product").modal("show");
          // $("#photo_path_placeholder").attr(
          //   "src",
          //   apiURL + "product/product-pic/" + data.product.product_pic
          // );
          $("#new_item_uuid").val(data["id"]);
          $("#category_id").val(
            data.category["id"]
          ).trigger("change");
          $("#new_item_name").val(data["product_name"]);
          $("#new_item_price").val(data["price_per_unit"]);

          $("#new_item_description").summernote("code", data["description"]);
          $("#new_item_quantity").val(data["quantity"]);
        
      } else {
        notification("error", "Error!", data.message);
      }
    },
    error: function (data) {},
  });
};


changeStatus = () => {
  $.ajax({
    url: apiURL + "vendor-proposal/status/" + $("#status_uuid").val(),
    type: "PUT",
    // data: form_data,
    contentType: "application/json",
    data: JSON.stringify({
      status: formStatus["status"],
    }),
    dataType: "json",
    // contentType: false,
    processData: false,
    cache: false,
    success: function (data) {
      if (data) {
        if (formStatus["status"] == "Cancelled") {
          notification("info", "RFQ Cancelled");
        } else {
          notification("success", "RFQ Resent");
        }
       
        formReset("hide");
        loadTable();
      } else {
        console.log("error " + data.message);
      }
    },
    error: function ({ responseJSON }) {},
  });
  $('#changeStatus').attr('data-dismiss','modal');
}


$('#buttonid').on("click", function(){
  document.getElementById('fileid').click();

})

var file_arr = []

function onUpload(input) {  
  let originalFile = input.files[0];
  let reader = new FileReader();
  reader.readAsDataURL(originalFile);
  reader.onload = () => {
    let json = JSON.stringify({ dataURL: reader.result });
    // View the file
    let fileURL = JSON.parse(json).dataURL;
    let related_files_body =""
   
    related_files_body += '<div class="d-flex justify-content-between">' +
    '<li>' + '<a href="#modal-file" data-toggle="modal" onClick="return showFileModal(this,0)" data-id="'+fileURL+'" class="btn-link text-dark"><i class="far fa-fw fa-file-word"></i> '+originalFile.name+'</a>' 
    + '</li>' + '<p style="cursor:pointer;" onclick="removeFile(this.parentNode.parentNode,this.parentNode)"><i class="text-secondary fas fa-times"></i></p>' + '</div>'
    $("#related_files_body").append(related_files_body)
    
    file_arr.push(originalFile)
 
  };
}
showFileModal= (file,type,existed_file) =>{
$('#display_file').attr("src", "")
if(type == 0){
  let file_data = $(file).attr('data-id');
  $('#display_file').attr("src", file_data)
  console.log(file_arr)

}
else{
  $('#display_file').attr("src", apiURL+"related-documents/related-file/"+existed_file)

}
}

removeFile = (parent_node,child_node) =>{
let remove_idx = Array.prototype.indexOf.call(parent_node.children, child_node)
child_node.remove()
file_arr.splice(remove_idx, 1);

}

$('#fileid').on("change", function(){
  // console.log($('#fileid').val())
  onUpload(this);

})

deleteData = (id) => {
  $(".modal-title").html("Delete Item");
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

// function to load category
loadCategory = () => {
  $.ajax({
    url: apiURL + "category/",
    type: "GET",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
    },
    dataType: "json",
    success: function (responseData) {
      if (responseData) {
        $("#category_id").empty();
        $.each(responseData, function (i, dataOptions) {
          var options = "";
          options =
            "<option value='" +
            dataOptions.id +
            "'>" +
            dataOptions.category_name +
            "</option>";

          $("#category_id").append(options);
        });
      } else {
        // notification("error", "Error!", responseData.message);
        console.log("error", "Error!", responseData.success);
      }
    },
    error: function ({ responseJSON }) {},
  });
};

loadCategory();

// 		action = show, hide
formReset = (action = "hide") => {
  $("html, body").animate({ scrollTop: 0 }, "slow");
  subtotal =0;
  total =0;

  if (action == "hide") {
    total = 0;
    $(".is-invalid").removeClass("is-invalid");
    $(".is-valid").removeClass("is-valid");
    $(".invalid-feedback").hide();
    // hide and clear form
    $("#uuid").val("");
    $("#generated_pr").html("New");
    $("#div_form").hide();
    $("#btn_add").show();
    $("#purpose").val("");
    $("#form_id")[0].reset();
    $("#related_files_body").empty()

    proposal_items_table.clear().draw();
    new_product.splice(0, new_product.length);
  } else {
    // show
    $('#proposal_message').summernote('enable');
    $('#new_item_description').summernote('enable');

    $('#product_modal_form input, select,textarea').prop("disabled", false);
    $("#div_form").show();
    $(".submit").show();
    $(".save-draft").show();
    $(".addProduct").show();
    $("#btn_add").hide();
    $("#update-button").hide();
    $("#add-files-button").show()
    $("#related_files_body").empty()

    $("#form_id input, select, textarea").prop("disabled", false);
    $("#form_id button").prop("disabled", false);
  }
};

infoCardReset = (action = "hide") => {
  $("html, body").animate({ scrollTop: 0 }, "slow");
  if (action == "hide") {
    $("#div_info").hide();
  } else {
    $("#div_info").show();
  }
};


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

    $("#proposal_message").summernote({
      height: 300,
  
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