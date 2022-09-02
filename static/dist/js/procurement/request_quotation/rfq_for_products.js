const formDataRFQ = {};

$(function () {
  formReset("hide");
  $("#email_loader").hide();

  // load purchase requisition items
  pr_detail_table_quotation();

  // load request for quotation datatable
  loadTable();

  // submit form
  $("#form_id")
    .on("submit", function (e) {
      e.preventDefault();
      // trimInputFields();
    })
    .validate({
      ignore: ".summernote *",

      rules: {
        // simple rule, converted to {required:true}
        purchase_requisition_id: {
          required: true,
        },
        due_date: {
          required: true,
        },
        message: {
          required: true,
        },
        background: {
          required: true,
        },
        // compound rule
        objectives: {
          required: true,
        },

        scope_of_services: {
          required: true,
        },

        tor_deliverables: {
          required: true,
        },

        qualifications: {
          required: true,
        },

        reporting_working_arrangements: {
          required: true,
        },
      },
      messages: {
        purchase_requisition_id: {
          required: "please provide first name",
        },
        due_date: {
          required: "please provide a due date",
        },
        message: {
          required: "please provide a message",
        },
        background: {
          required: "please provide a background",
        },
        // compound rule
        objectives: {
          required: "please provide a objectives",
        },

        scope_of_services: {
          required: "please provide a scope of service",
        },

        tor_deliverables: {
          required: "please provide a deliverables",
        },

        qualifications: {
          required: "please provide a qualifications",
        },

        reporting_working_arrangements: {
          required: "please provide a reproting work arrangements",
        },
      },
      errorElement: "span",
      errorPlacement: function (error, element) {
        error.addClass("invalid-feedback");
        element.closest(".validate").append(error);
      },
      highlight: function (element, errorClass, validClass) {
        $(element).addClass("is-invalid");
      },
      unhighlight: function (element, errorClass, validClass) {
        $(element).removeClass("is-invalid");
        $(element).addClass("is-valid");
      },
      submitHandler: function () {
        let date = Date.now();

  
        // formDataRFQ["status"] = $("#status").val();
        formDataRFQ["status"] = "On Going";
        
        formDataRFQ["message"] = $("#message").val();
        formDataRFQ["due_date"] = $("#due_date").val();
        formDataRFQ["quotation_code"] = $("#quotation_code").val();
        formDataRFQ["prepared_by"] = $("#prepared_by").val();
        formDataRFQ["purchase_requisition_id"] = $(
          "#purchase_requisition_id"
        ).val();
        formDataRFQ["rfq_type"] = "procure_of_products";
        // console.log(formDataRFQ);
        var vendor_id_arr = [];
        if ($("#request_quotation_id").val() == "") {
          // add record
          if ($(".vendors:checkbox:checked:enabled").length == 0) {
            notification("warning", "Please select a vendor");
          } else {
            $(".vendors:checkbox:checked:enabled").each(function (idx, array) {
              let check_vendor_id = $(this);
              $.ajax({
                url:
                  apiURL +
                  "rfq-vendor/" +
                  $(this).val() +
                  "/" +
                  formDataRFQ["purchase_requisition_id"],
                type: "GET",
                async: false,
                dataType: "json",
                success: function (data) {
                  if (data != "") {
                    // console.log("wew")
                    notification(
                      "error",
                      "Error!",
                      "This request has been already sent to vendor " +
                        check_vendor_id.parent().next().find("h6").text()
                    );
                  } else {
                    // console.log(check_vendor_id.val())
                    vendor_id_arr.push(check_vendor_id.val());
                  }
                },
                error: function ({ responseJSON }) {},
              });
            });

            if (vendor_id_arr != "") {
              $.ajax({
                url: apiURL + "request-quotation/rfq-products/",
                type: "POST",
                // data: form_data,
                contentType: "application/json",
                data: JSON.stringify(formDataRFQ),
                dataType: "json",
                // contentType: false,
                processData: false,
                // cache: false,
                headers: {
                  Accept: "application/json",
                  Authorization: "Bearer " + localStorage.getItem("TOKEN"),
                },
                beforeSend: function () {
                  $("#email_loader").show();
                  $("#send_email_txt").hide();
                },
                success: function (data) {
                  if (data) {
                    console.log(data.id);
                    if (file_arr.length != 0) {
                      for (let i in file_arr) {
                        let formDataFiles = new FormData();
                        formDataFiles.append("attachment", file_arr[i]);
                        formDataFiles.append("request_quotation_id", data.id);

                        // for (let value of formDataFiles.values()) {
                        //   console.log(value);
                        // }
                        $.ajax({
                          url: apiURL + "related-documents/",
                          type: "POST",
                          data: formDataFiles,
                          dataType: "json",
                          contentType: false,
                          processData: false,
                          cache: false,
                          success: function (data) {},
                          error: function ({ responseJSON }) {},
                        });
                      }
                    }

                    for (let i in vendor_id_arr) {
                      let vendor_id = vendor_id_arr[i];
                      console.log(vendor_id);
                      console.log(data.id);

                      $.ajax({
                        url: apiURL + "rfq-vendor/",
                        type: "POST",
                        async:false,
                        data: JSON.stringify({
                          vendor_id: vendor_id,
                          request_quotation_id: data.id,
                          rfq_pr_id: formDataRFQ["purchase_requisition_id"],
                          // rfq_tor_id:"",
                        }),
                        dataType: "json",
                        contentType: "application/json",
                        processData: false,
                        cache: false,
                        success: function (data) {
                         
                      
                        },
                        error: function ({ responseJSON }) {},
                      });
                    }

                    notification(
                      "success",
                      "Created!",
                      "RFQ Successfuly Created"
                    );
                    formReset("hide");
                    loadTable();
                    
                    // $("#modal-rfq").modal("hide");
                  } else {
                    notification("error", "Error!", "Error creating RFQ");
                    console.log("error");
                  }
                },
                complete: function () {
                  $("#email_loader").hide();
                  $("#send_email_txt").show();
                },
                error: function ({ responseJSON }) {
                  notification("error", "Error!", "Please fill out all fields");
                },
              });
            }
          }
        } else {
          // add

          delete formDataRFQ.vendor_id;

          $.ajax({
            url:
              apiURL + "request-quotation/" + $("#request_quotation_id").val(),
            type: "PUT",
            // data: form_data,
            contentType: "application/json",
            data: JSON.stringify({
              request: formDataRFQ,
            }),
            dataType: "json",
            // contentType: false,
            processData: false,
            cache: false,
            success: function (data) {
              if (data) {
                notification("success", "Updated!", "RFQ Successfuly Updated");
                // console.log("success " + data);

                formReset("hide");
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

// load all approved purchase requisition
loadPurchaseRequisition = () => {
  $.ajax({
    url: apiURL + "purchase-requisition/approved/none",
    type: "GET",
    dataType: "json",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
    success: function (responseData) {
      if (responseData) {
        $("#purchase_requisition_id").empty();
        $("#purchase_requisition_id").append(
          "<option disabled selected>Select Purchase Requisition</option>"
        );

        $.each(responseData, function (i, dataOptions) {
          let options = "";

          options =
            "<option value='" +
            dataOptions.id +
            "'>" +
            formatPurchaseRequestNo(dataOptions.purchase_requisition_number) +
            "</option>";

          $("#purchase_requisition_id").append(options);
        });
      } else {
        // notification("error", "Error!", responseData.message);
        console.log("error", "Error!", responseData.success);
      }
    },
    error: function ({ responseJSON }) {},
  });
};

loadPurchaseRequisition();

// view purchase requisition modal onclick
viewPR = () => {
  if ($("#purchase_requisition_id").val() != null) {
    console.log($("#purchase_requisition_id").val());
    $("#modal-xl").modal("show");
  }
};

// show purchase requisition modal on change
$("#purchase_requisition_id").on("change", function () {
  console.log(this.value);

  //   load pr

  $("#modal-xl").modal("show");

  $(".view_pr_button").show();
  //   console.log(id);
  $.ajax({
    url: apiURL + "purchase-requisition/" + this.value,
    type: "GET",
    dataType: "json",
    success: function (data) {
      if (data) {
        console.log(data);
        $("#pr_number").html(
          formatPurchaseRequestNo(data["purchase_requisition_number"])
        );
        $("#status").html(data["status"]);
        $("#department").html(
          // data.u_created_by.employees.department["department_name"]
          data.department_procurement['department_name']
        );
        // $("#requested_by").html(data.u_created_by.employees["first_name"]);
        $("#requested_by").html(data.department_procurement['department_head']);

        $("#purpose").html(data["purpose"]);
        $("#budget").val(data["given_budget"]);

        $("#date_requested").html(
          moment(data["created_at"]).format("MMMM D, YYYY")
        );

        $("#date_approved").html(
          moment(data["date_approved"]).format("MMMM D, YYYY")
        );

        $("#approved_by").html(data["approved_by"]);
        $("#estimated_amount").html(
          "\u20B1" + numberWithCommas(data["estimated_amount"])
        );
        $("#given_budget").html(
          "\u20B1" + numberWithCommas(data["given_budget"])
        );

        prd_table.clear().draw();

        for (let pr_item in data.purchase_requisition_detail) {
          if (data.purchase_requisition_detail[pr_item].product_id === null && data.purchase_requisition_detail[pr_item].supply_id === null) {
            $("#quotation_code").val(
              data.purchase_requisition_detail[pr_item].new_category
                .slice(0, 2)
                .toUpperCase() +
                " - " +
                data["purchase_requisition_number"]
            );
            prd_table.row
              .add([
                data.purchase_requisition_detail[pr_item].new_category,
                data.purchase_requisition_detail[pr_item].new_product_name,
                data.purchase_requisition_detail[pr_item].description,
                "\u20B1" +
                  numberWithCommas(
                    data.purchase_requisition_detail[pr_item].estimated_price
                  ),
                data.purchase_requisition_detail[pr_item].quantity,
                "\u20B1" +
                  numberWithCommas(
                    data.purchase_requisition_detail[pr_item].quantity *
                      data.purchase_requisition_detail[pr_item].estimated_price
                  ),
              ])
              .draw();
          } else if (data.purchase_requisition_detail[pr_item].supply_id != null){
            $("#quotation_code").val(
              data.purchase_requisition_detail[
                pr_item
              ].supply.category.category_name
                .slice(0, 2)
                .toUpperCase() +
                " - " +
                data["purchase_requisition_number"]
            );
            prd_table.row
              .add([
                data.purchase_requisition_detail[pr_item].supply.category
                  .category_name,
                data.purchase_requisition_detail[pr_item].supply.product_name,
                data.purchase_requisition_detail[pr_item].supply.description,
                "\u20B1" +
                  numberWithCommas(
                    data.purchase_requisition_detail[pr_item].supply
                      .estimated_price
                  ),
                data.purchase_requisition_detail[pr_item].quantity,
                "\u20B1" +
                  numberWithCommas(
                    data.purchase_requisition_detail[pr_item].quantity *
                      data.purchase_requisition_detail[pr_item].supply
                        .estimated_price
                  ),
              ])
              .draw();
          }else if (data.purchase_requisition_detail[pr_item].product_id != null && data.purchase_requisition_detail[pr_item].supply_id === null){
            $("#quotation_code").val(
              data.purchase_requisition_detail[
                pr_item
              ].product.category.category_name
                .slice(0, 2)
                .toUpperCase() +
                " - " +
                data["purchase_requisition_number"]
            );
            prd_table.row
              .add([
                data.purchase_requisition_detail[pr_item].product.category
                  .category_name,
                data.purchase_requisition_detail[pr_item].product.product_name,
                data.purchase_requisition_detail[pr_item].product.description,
                "\u20B1" +
                  numberWithCommas(
                    data.purchase_requisition_detail[pr_item].product
                      .estimated_price
                  ),
                data.purchase_requisition_detail[pr_item].quantity,
                "\u20B1" +
                  numberWithCommas(
                    data.purchase_requisition_detail[pr_item].quantity *
                      data.purchase_requisition_detail[pr_item].product
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

// load category
loadTableCategory = () => {
  $.ajax({
    url: apiURL + "category/",
    type: "GET",
    dataType: "json",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
    success: function (responseData) {
      if (responseData) {
        $("#vendor-list").empty();
        $.each(responseData, function (i, dataOptions) {
          let vendor_list = "";

          vendor_list +=
            '<div class="card collapsed-card">' +
            '<div class="card-header">' +
            '<h3 class="card-title">' +
            dataOptions.category_name +
            "</h3>" +
            '<div class="card-tools">' +
            '<button type="button" class="btn btn-tool" data-card-widget="collapse">' +
            '<i class="fas fa-plus"></i>' +
            "</button></div></div>" +
            '<div class="card-body">' +
            '<div class="container">' +
            '<div class="row">';
          if (dataOptions.vendor_procurement != "") {
            for (let k = 0; k < dataOptions.vendor_procurement.length; k++) {
              vendor_list +=
                '<div class="col-md-2">' +
                '<input type="checkbox" style="max-width: 25px; max-height: 25px;" id="' +
                dataOptions.vendor_procurement[k].vendor_name.replace(/\s/g, '') +
                '" class="form-control vendors" value = "' +
                dataOptions.vendor_procurement[k].id +
                '"></div>' +
                '<div class="col-md-10">' +
                "<h6>" +
                dataOptions.vendor_procurement[k].vendor_name +
                "</h6>" +
                "</div>";
            }
          }

          vendor_list += "</div></div></div></div>";

          $("#vendor-list").append(vendor_list);
        });
      } else {
        // notification("error", "Error!", responseData.message);
        console.log("error", "Error!", responseData.success);
      }
    },
    error: function ({ responseJSON }) {},
  });
};

loadTableCategory();

//   purchase requisition table
pr_detail_table_quotation = () => {
  $("#pr-detail-table").dataTable().fnClearTable();
  $("#pr-detail-table").dataTable().fnDraw();
  $("#pr-detail-table").dataTable().fnDestroy();
  prd_table = $("#pr-detail-table").DataTable({
    info: false,
    paging: false,
    searching: false,
    ordering: false,
  });
};

// load vendor
loadVendor = () => {
  $.ajax({
    url: apiURL + "vendor/",
    type: "GET",
    dataType: "json",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
    success: function (responseData) {
      if (responseData) {
        $("#vendor_id").empty();
        $.each(responseData, function (i, dataOptions) {
          let options = "";
          options =
            "<option value='" +
            dataOptions.id +
            "'>" +
            dataOptions.vendor_name +
            "</option>";

          $("#vendor_id").append(options);
          $("#recipient").append(options);
        });
      } else {
        // notification("error", "Error!", responseData.message);
        console.log("error", "Error!", responseData.success);
      }
    },
    error: function ({ responseJSON }) {},
  });
};

loadVendor();

// request for quotation datatable
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
    ajax: { url: apiURL + "request-quotation/status/procure_of_products", dataSrc: "" },

    responsive: true,
    serverSide: false,
    dataType: "json",
    type: "GET",
    columns: [
      {
        data: "quotation_code",
        name: "quotation_code",
        searchable: true,
        width: "10%",
      },
      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {
          return formatRfqNo(aData.request_quotation_number);
        },
      },

      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {
          return (
            // aData.u_created_by.employees.first_name +
            // " " +
            // aData.u_created_by.employees.last_name
            "name"
          );
        },
      },
      {
        data: null,
        name: null,
        searchable: true,
        width: "15%",
        render: function (aData, type, row) {
          return moment(aData["created_at"]).format("MMMM D, YYYY");
        },
      },
      {
        data: null,
        name: null,
        searchable: true,
        width: "15%",
        render: function (aData, type, row) {
          // console.log(aData.request_quotation_vendor)
          if (aData.status === "On Going") {
            let status =
              '<label class="text-left badge badge-primary p-2 w-100"> ' +
              aData.status +
              "</label> ";
            return status;
          }else {
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

            

          if (aData["status"] == "On Going") {
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
              "<div> Closed</div></div>";
          }
          if (aData.status == "Closed") {
            //resend
            buttons +=
              '<div class="dropdown-item d-flex role="button" onClick="return redoData(\'' +
              aData["id"] +
              "',2)\">" +
              '<div style="width: 2rem"> <i class= "fas fa-redo mr-1"></i></div>' +
              "<div> Reopen</div></div>";
          }
          buttons += "</div></div>";
          return buttons; // same class in i element removed it from a element
        },
      },
    ],
  });
};

// function to show details for viewing/updating
editData = (id, type) => {
  $.ajax({
    url: apiURL + "request-quotation/" + id,
    type: "GET",
    dataType: "json",
    success: function (data) {
      if (data) {
        formReset("show");
        // console.log(data);
        $("#related_files_body").empty();
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

        console.log(data)

        $('#view_vendor_involved').show()
        $('#vendor-list').hide()

        $('#vendor_involved').empty()
        let vendor_involved = "";
        for (let i in data.request_quotation_vendor) {
          // console.log(data.request_quotation_vendor[i])
          vendor_involved += '<li class="list-group-item">'+data.request_quotation_vendor[i].vendor_procurement.vendor_name+'<br>'+
          '<strong >Status: </strong>'+data.request_quotation_vendor[i].rfq_status+'<br></li>'
          
          // $("#" + (data.request_quotation_vendor[i].vendor.vendor_name).replace(/\s/g, '')).trigger(
          //   "click"
          // );
        }

        $('#vendor_involved').append(vendor_involved)

        $("#related_files_body").append(related_files_body);
        // formDataRFQ["vendor_id"] = "";
        // $("#status").val();
        $("#purchase_requisition_id")
          .val(data.purchase_requisition_id)
          .trigger("change");
        $("#request_quotation_id").val(data["id"]);
        $("#message").val(data["message"]);
        $("#due_date").val(data["due_date"]);
        $("#quotation_code").val(data["quotation_code"]);
        $("#prepared_by").val(data["prepared_by"]);
        // $("#budget").val(data.purchase_requisition["given_budget"]);
        // $("#background").val(data.terms_of_reference["background"]);
        // $("#objectives").val(data.terms_of_reference["objective"]);
        // $("#scope_of_services").val(
        //   data.terms_of_reference["scope_of_service"]
        // );
        // $("#qualifications").val(data.terms_of_reference["qualifications"]);
        // $("#reporting_working_arrangements").val(
        //   data.terms_of_reference["reporting_and_working_arrangements"]
        // );

        // // formDataTor["consultancy_type"] = "firm";

        // // formDataTor["renumeration_type"] = "waw";
        // // formDataTor["source_of_funds"] = "wew"
        // // formDataTor["rate"] = "wew";
        // // formDataTor["pocket_cost"] = "WEW"
        // $("#tor_deliverables").summernote(
        //   "code",
        //   data.terms_of_reference["tor_deliverables"]
        // );

        $("#view_pr_id").html(
          formatRfqNo(data.purchase_requisition["purchase_requisition_number"])
        );

        // if (
        //   data.terms_of_reference["tor_annex_technical_specifications"] != ""
        // ) {
        //   $("#annex_a_technical_specs").summernote(
        //     "code",
        //     data.terms_of_reference["tor_annex_technical_specifications"]
        //   );

        //   $("#annex_technical_specs").show();
        // }
        // if (data.terms_of_reference["tor_annex_key_experts"] != "") {
        //   $("#annex_b_key_experts").summernote(
        //     "code",
        //     data.terms_of_reference["tor_annex_key_experts"]
        //   );
        //   $("#annex_evaluation_criteria").show();
        // }
        // if (data.terms_of_reference["tor_annex_deliverables"] != "") {
        //   $("#annex_b_key_experts").summernote(
        //     "code",
        //     data.terms_of_reference["tor_annex_deliverables"]
        //   );

        //   $("#annex_renumeration_payment").show();
        // }
        // if (data.terms_of_reference["tor_annex_terms_conditions"] != "") {
        //   $("#annex_d_terms_conditions").summernote(
        //     "code",
        //     data.terms_of_reference["tor_annex_terms_conditions"]
        //   );
        //   $("#annex_terms_conditions").show();
        // }

        // if data is for viewing only
        if (type == 0) {
          $("#form_id input, select, textarea").prop("disabled", true);
          $("#message").summernote('disable')
          $("#add-files-button").hide();
          $(".send-email").hide();
          $(".print").hide();
          $(".submit").hide();
          $("#view_pr").show();
        } else {
          $("#form_id input, select, textarea").prop("disabled", false);
          $(".modal-title").html("PR");
          $(".print").show();
          $(".send-email").hide();
        }
      } else {
        notification("error", "Error!", data.message);
      }
    },
    error: function (data) {},
  });
};

$("#buttonid").on("click", function () {
  document.getElementById("fileid").click();
});
var file_arr = [];

// function to display selected attachment
function onUpload(input) {
  let originalFile = input.files[0];
  let reader = new FileReader();
  reader.readAsDataURL(originalFile);
  reader.onload = () => {
    let json = JSON.stringify({ dataURL: reader.result });
    // View the file
    let fileURL = JSON.parse(json).dataURL;
    let related_files_body = "";

    related_files_body +=
      '<div class="d-flex justify-content-between">' +
      "<li>" +
      '<a href="#modal-file" data-toggle="modal" onClick="return showFileModal(this,0)" data-id="' +
      fileURL +
      '" class="btn-link text-dark"><i class="far fa-fw fa-file-word"></i> ' +
      originalFile.name +
      "</a>" +
      "</li>" +
      '<p style="cursor:pointer;" onclick="removeFile(this.parentNode.parentNode,this.parentNode)"><i class="text-secondary fas fa-times"></i></p>' +
      "</div>";
    $("#related_files_body").append(related_files_body);

    file_arr.push(originalFile);
  };
}

// show selected attachment
showFileModal = (file, type, existed_file) => {
  $("#display_file").attr("src", "");
  if (type == 0) {
    let file_data = $(file).attr("data-id");
    $("#display_file").attr("src", file_data);
    console.log(file_arr);
  } else {
    $("#display_file").attr(
      "src",
      apiURL + "related-documents/related-file/" + existed_file
    );
  }
};

// remove selected attachment
removeFile = (parent_node, child_node) => {
  let remove_idx = Array.prototype.indexOf.call(
    parent_node.children,
    child_node
  );
  child_node.remove();
  file_arr.splice(remove_idx, 1);
};

$("#fileid").on("change", function () {
  // console.log($('#fileid').val())
  onUpload(this);
});

// change status
const formStatus = {};
redoData = (id, type) => {
  if (type == 1) {
    $("#modal-default").modal("show");
    $(".cancel-request").html(
      '<i class="text-secondary fas fa-exclamation-triangle mr-2"></i>' +
        "Closed Request For Quotation"
    );
    $(".request-modal-body").html("Are you sure you want to Closed this request for quotation?");
    $("#changeStatus").attr("class", "btn btn-info");

    $("#changeStatus").html("Yes, Closed it");

    $("#resend").hide();

    $("#uuid").val(id);
    formStatus["status"] = "Closed";
  } else {
    $(".budget-row").hide();
    $(".request-modal-body").html("Are you sure you want to resend this request for quotation?");
    $("#changeStatus").html("Yes, Reopen it");
    $("#changeStatus").attr("class", "btn btn-primary");

    $("#modal-default").modal("show");
    $(".cancel-request").html(
      '<i class="text-secondary fas fa-exclamation-triangle mr-2"></i>' +
        "Reopen request for quotation"
    );

    $("#cancel").hide();
    $("#resend").show();

    $("#uuid").val(id);

    formStatus["status"] = "On Going";
  }
};

changeStatus = () => {
  $.ajax({
    url: apiURL + "request-quotation/update_status/" + $("#uuid").val(),

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
        if (formStatus["status"] == "Closed") {
          notification("info","Warning", "RFQ Closed");
        } else {
          notification("success","Success", "RFQ Reopen");
        }
        $("#modal-status").modal("hide");
        loadTable();
      } else {
        $("#modal-status").modal("hide");

        notification("error", "Error!", "Error approving RFQ");
      }
    },
    error: function ({ responseJSON }) {
      console.log(responseJSON);
    },
  });
  $("#changeStatus").attr("data-dismiss", "modal");
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
    // $(".view_pr_button").hide();
    $("#annex_technical_specs").hide();
    $("#annex_evaluation_criteria").hide();
    $("#annex_renumeration_payment").hide();
    $("#annex_terms_conditions").hide();
    $("#related_files_body").empty();

    $("#view_pr").hide();

    $("#form_id")[0].reset();
    //   new_product.splice(0, new_product.length);
    $("#form_id input, select, textarea").prop("disabled", false);
  } else {
    $("#request_quotation_id").val("")
    $("#view_pr").hide();
    $("#add-files-button").show();
    $(".submit").show();

    $("#message").summernote('enable')

    $("#related_files_body").empty();

    // show
    $("#prepared_by").val(
      // localStorage.getItem("FIRSTNAME") + " " + localStorage.getItem("LASTNAME")
      "name"
    );
    $("#div_form").show();
    $("#rfq_tor").html("Request For Quotation");

    $("#form_id input, select, textarea").prop("disabled", false);
    $("#form_id button").prop("disabled", false);
  }
};


// summernotes
$(document).ready(function () {
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
