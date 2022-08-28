// const formDataRFQ = {};
const formDataTor = {};

$(function () {
  // window.stepper = new Stepper(document.querySelector(".bs-stepper"));
  // summerNotes();
  $("#email_loader").hide();
  $('.submit').hide()
  // load datatable
  formReset("hide");
  $(".select2").select2();

  pr_detail_table_quotation();
  loadTable();


});

// all pending request
loadPurchaseRequisition = () => {
  $.ajax({
    url: apiURL + "project-request/status/approved/",
    type: "GET",
    dataType: "json",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
    success: function (responseData) {
      if (responseData) {
        $("#project_request_id").empty();
        $("#project_request_id").append(
          "<option disabled selected>Select Project Request</option>"
        );

        $.each(responseData, function (i, dataOptions) {
          let options = "";

          options =
            "<option value='" +
            dataOptions.id +
            "'>" +
            dataOptions.name +
            "</option>";

          $("#project_request_id").append(options);
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

viewPR = () => {
  if($("#purchase_requisition_id").val() != null){
    console.log($("#purchase_requisition_id").val())
    $("#modal-xl").modal("show");

  }
  //   console.log(id);
  // $.ajax({
  //   url: apiURL + "purchase-requisition/" + $('#purchase_requisition_id').val(),
  //   type: "GET",
  //   dataType: "json",
  //   success: function (data) {
  //     if (data) {
  //       $("#pr_number").html(
  //         formatPurchaseRequestNo(data["purchase_requisition_number"])
  //       );
  //       $("#status").html(data["status"]);
  //       $("#department").html(data.u_created_by.department["department_name"]);
  //       $("#requested_by").html(data.u_created_by["first_name"]);
  //       $("#purpose").html(data["purpose"]);
  //       $("#date_requested").html(
  //         moment(data["date_requested"]).format("MMMM D, YYYY")
  //       );

  //       prd_table.clear().draw();

  //       for (var pr_item in data.purchase_requisition_detail) {
  //         if (data.purchase_requisition_detail[pr_item].product_id === null) {
  //           prd_table.row
  //             .add([
  //               data.purchase_requisition_detail[pr_item].new_category,
  //               data.purchase_requisition_detail[pr_item].new_product_name,
  //               data.purchase_requisition_detail[pr_item].quantity,
  //             ])
  //             .draw();
  //         } else {
  //           prd_table.row
  //             .add([
  //               data.purchase_requisition_detail[pr_item].product.category
  //                 .category_name,
  //               data.purchase_requisition_detail[pr_item].product.product_name,
  //               data.purchase_requisition_detail[pr_item].quantity,
  //             ])
  //             .draw();
  //         }
  //       }

  //     } else {
  //       notification("error", "Error!", data.detail);

  //       console.log("error" + data);
  //       loadTable();
  //     }
  //   },
  //   error: function ({ responseJSON }) {},
  // });
};

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
        $("#pr_number").html(
          formatPurchaseRequestNo(data["purchase_requisition_number"])
        );
        $("#status").html(data["status"]);
        $("#department").html(data.u_created_by.department["department_name"]);
        $("#requested_by").html(data.u_created_by["first_name"]);
        $("#purpose").html(data["purpose"]);
        $("#budget").val(data["budget"]);

        $("#date_requested").html(
          moment(data["date_requested"]).format("MMMM D, YYYY")
        );

        prd_table.clear().draw();

        for (let pr_item in data.purchase_requisition_detail) {
          if (data.purchase_requisition_detail[pr_item].product_id === null) {
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
                data.purchase_requisition_detail[pr_item].quantity,
              ])
              .draw();
          } else {
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
                data.purchase_requisition_detail[pr_item].quantity,
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


//   pr table
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


// rfq datatable
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
      url: apiURL + "terms-of-reference/vendor/"+localStorage.getItem("ID"),
      dataSrc: "",
    //   error: function(xhr, error, thrown) {
    //     if(thrown == "Unauthorized"){
    //    window.location.replace(baseURL+"login");

    //     }
    // } 
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
          return aData.tor_number
        },
      },

      {
        data: null,
        name: null,
        searchable: true,
        width: "10%",
        render: function (aData, type, row) {
          return aData.prepared_by;
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
          if (aData.status === "Pending") {
            let status =
              '<label class="text-left badge badge-warning p-2 w-100"> ' +
              aData.status +
              "</label> ";
            return status;
          } else if (aData.status === "Approved") {
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
    url: apiURL + "terms-of-reference/" + id,
    type: "GET",
    dataType: "json",
    success: function (data) {
      if (data) {
        if (data["status"] == "Pending") {
          $("#approve_rfq").show();
          $("#reject_rfq").show();
        } else {
          $("#approve_rfq").hide();
          $("#reject_rfq").hide();
        }

        formReset("show");
        console.log(data);
        $("#related_files_body").empty()
        let related_files_body =""
        for(let i in data.related_documents){
          console.log(data.related_documents[i].attachment)
   
          related_files_body += '<div >' +
          '<li>' + '<a href="#modal-file" data-toggle="modal" onClick="return showFileModal(this,1,\'' + data.related_documents[i].attachment + '\')" data-id="'+data.related_documents[i].attachment+'" class="btn-link text-dark"><i class="far fa-fw fa-file-word"></i> '+data.related_documents[i].attachment+'</a>' 
          + '</li></div>'
        }
        
        $('#project_title').text(data.project_request["name"])
        $("#related_files_body").append(related_files_body)
        // formDataRFQ["vendor_id"] = "";
        // $("#status").val();
        // $("#purchase_requisition_id").val(data.purchase_requisition["id"]).trigger("change");
        $("#terms_of_reference_id").val(data["id"])
        $("#message").val(data["message"]);
        $("#due_date").val(data["due_date"]);
 
        $("#prepared_by").val(data["prepared_by"]);
        $("#background_div").append(data["background"]);

        $("#deliverables_div").append(data["tor_deliverables"]);

        $("#objectives_div").append(data["objective"]);
        $("#scope_of_services_div").append(
          data["scope_of_service"]
        );
        $("#qualifications_div").append(data["qualifications"]);
        $("#reporting_working_arrangements_div").append(
          data["reporting_and_working_arrangements"]
        );


        // formDataTor["consultancy_type"] = "firm";

        // formDataTor["renumeration_type"] = "waw";
        // formDataTor["source_of_funds"] = "wew"
        // formDataTor["rate"] = "wew";
        // formDataTor["pocket_cost"] = "WEW"
        $("#tor_deliverables").summernote(
          "code",
          data["tor_deliverables"]
        );

    
        if (
          data["tor_annex_technical_specifications"] != ""
        ) {
          $("#annex_a_technical_specs").summernote(
            "code",
            data["tor_annex_technical_specifications"]
          );

          $("#annex_technical_specs").show();
        }
        if (data["tor_annex_key_experts"] != "") {
          $("#annex_b_key_experts").summernote(
            "code",
            data["tor_annex_key_experts"]
          );
          $("#annex_evaluation_criteria").show();
        }
        if (data["tor_annex_deliverables"] != "") {
          $("#annex_b_key_experts").summernote(
            "code",
            data["tor_annex_deliverables"]
          );

          $("#annex_renumeration_payment").show();
        }
        if (data["tor_annex_terms_conditions"] != "") {
          $("#annex_d_terms_conditions").summernote(
            "code",
            data["tor_annex_terms_conditions"]
          );
          $("#annex_terms_conditions").show();
        }

        // if data is for viewing only
        if (type == 0) {
          $("#form_id input, select, textarea").prop("disabled", true);
  $('#add-files-button').hide()
          $(".send-email").hide();
          $(".print").hide();
          $(".submit").hide();
          $("#view_pr").show();
        } else{
          $("#form_id input, select, textarea").prop("disabled", false);
          // $(".modal-title").html("PR");
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




var formStatus = ""

changeStatusModal = (type) => {
    $('#reason').prop("disabled", false);
    $("#modal-approval").modal("show");
    if (type == 0) {
      formStatus = "Rejected" 
      $("#approve").hide();
      $("#reject").show();
      $(".reason-row").show();
  
      $("#approver_label").html("Rejected by");
    } else {
      formStatus = "Approved" 
  
      $("#approve").show();
      $("#reject").hide();
      $(".reason-row").hide();
      $("#approver_label").html("Approve by");
    }
  };
  
  changeStatus = () => {
    if ($("#approver").val() == "") {
      notification("error", "Error!", "Please insert your name");
    
    } else {
      if (formStatus == "Rejected") {
        if ($("#reason").val() == "") {
          notification("error", "Error!", "Please insert a reason");
        console.log("wew")
        }else{
          approval_ajax();
        }
      
      }
      else{
        approval_ajax();
      }
     
    }
    $("#modal-approval").modal("hide");
  };


// update status of terms of reference 
approval_ajax = () =>{
    $.ajax({
      url:
        apiURL +
        "terms-of-reference/" +$('#terms_of_reference_id').val(),
      type: "PUT",
      dataType: "json",
      contentType: "application/json",
  
      data: JSON.stringify({
        status: formStatus,
        approver_name: $("#approver").val(),
  
        reject_reason: $("#reason").val(),
      }),
      success: function (data) {
        console.log(data);
        if (formStatus == "Approved") {
          notification("success", "Success!", "TOR Approved");
        } else {
          notification("success", "Success!", "TOR Rejected");
        }
        formReset("hide");
        delete data.id
        delete data.vendor_id
        delete data.request_quotation_id
        delete data.rfq_pr_id
        delete data.rfq_tor_id
        delete data.created_by
        delete data.updated_by
  
        $.ajax({
          url: apiURL + "vendor-audit-trail",
          type: "POST",
          dataType: "json",
          contentType: "application/json",
  
          data: JSON.stringify({
            crud: "Update Status",
            table: "terms_of_reference",
            payload: JSON.stringify(data),
            client_ip: localStorage.getItem("CLIENT_IP"),
            vendor_id: localStorage.getItem("ID"),
          }),
          success: function (data) {},
          error: function ({ responseJSON }) {},
        });
  
        loadTable();
      },
      error: function ({ responseJSON }) {},
    }); 
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
    // $(".view_pr_button").hide();
    $("#annex_technical_specs").hide();
    $("#annex_evaluation_criteria").hide();
    $("#annex_renumeration_payment").hide();
    $("#annex_terms_conditions").hide();
    $("#related_files_body").empty()

    $("#view_pr").hide();
    // window.stepper = new Stepper(document.querySelector(".bs-stepper"));

    $("#form_id")[0].reset();
    //   new_product.splice(0, new_product.length);
    $("#form_id input, select, textarea").prop("disabled", false);
  } else {
    $("#view_pr").hide();
  $('#add-files-button').show()

    // window.stepper = new Stepper(document.querySelector(".bs-stepper"));
    $("#related_files_body").empty()

    // show
    $("#prepared_by").val(
      localStorage.getItem("FIRSTNAME") + " " + localStorage.getItem("LASTNAME")
    );
    $("#div_form").show();
    // $("#rfq_tor").html("Request For Quotation");

    $("#form_id input, select, textarea").prop("disabled", false);
    $("#form_id button").prop("disabled", false);
  }
};

addAnnex = () => {
  if ($("#select_annex").val() == "technical_specifications") {
    $("#annex_technical_specs").show();
  } else if ($("#select_annex").val() == "evaluation_criteria") {
    $("#annex_evaluation_criteria").show();
  } else if ($("#select_annex").val() == "renumeration_payment") {
    $("#annex_renumeration_payment").show();
  } else if ($("#select_annex").val() == "terms_and_conditions") {
    $("#annex_terms_conditions").show();
  }
  $("#modal-select-annex").modal("hide");
};



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



summerNotes = () => {
  $(document).ready(function () {
    $("#background").summernote({
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

    $("#objectives").summernote({
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


    $("#scope_of_services").summernote({
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


    $("#tor_deliverables").summernote({
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


    $("#qualifications").summernote({
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

    $("#reporting_working_arrangements").summernote({
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

    $("#annex_a_technical_specs").summernote({
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

    $("#annex_b_key_experts").summernote({
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

    $("#annex_c_deliverable_amount").summernote({
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

    $("#annex_d_terms_conditions").summernote({
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
