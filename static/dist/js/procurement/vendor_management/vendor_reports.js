$(function () {
    // load datatable
    $(".select2").select2();
  
    loadTable("","","",$('#vendor_status').val());
    
    // var table =  $('#data-table').DataTable();
  console.log($('#vendor_status').val())

  });
  


// datatable
loadTable = (region,province,municipality,status) => {
    $.ajaxSetup({
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + localStorage.getItem("TOKEN"),
        ContentType: "application/x-www-form-urlencoded",
      },
    });
    if(region != ""){
        filteredURL = apiURL + "vendor/filtered/vendor/reports/"+region+"/none/none/"+status
        if(province != ""){
          filteredURL = apiURL + "vendor/filtered/vendor/reports/"+region+"/"+province+"/none/"+status
          if(municipality != ""){
            filteredURL = apiURL + "vendor/filtered/vendor/reports/"+region+"/"+province+"/"+municipality+"/"+status
           }
        }
      }
      
      
      else{
        filteredURL = apiURL + "vendor/filtered/vendor/reports/none/none/none/"+status
        
      }
      console.log(filteredURL)
    $("#data-table").dataTable().fnClearTable();
    $("#data-table").dataTable().fnDraw();
    $("#data-table").dataTable().fnDestroy();
    $("#data-table").DataTable({
      ajax: { url: filteredURL, dataSrc: "" },
      dom: 'Bfrtip',

      // buttons: ["copy", "csv", "excel", "pdf", "print", "colvis"],
      buttons: [
        {
          extend: "copy",
          //  text: 'Export Search Results',
          //  className: 'btn btn-default',
          exportOptions: {
            columns: "th:not(:last-child)",
          },
        },
    
  
        {
          extend: "excel",
          //  text: 'Export Search Results',
          //  className: 'btn btn-default',
          exportOptions: {
            columns: "th:not(:last-child)",
          },
        },
  
        {
          extend: "csv",
          //  text: 'Export Search Results',
          //  className: 'btn btn-default',
          exportOptions: {
            columns: "th:not(:last-child)",
          },
        },
  
        {
          extend: "pdf",
          //  text: 'Export Search Results',
          //  className: 'btn btn-default',
          exportOptions: {
            columns: "th:not(:last-child)",
          },
        },
        {
          extend: "print",
          //  text: 'Export Search Results',
          //  className: 'btn btn-default',
          exportOptions: {
            columns: "th:not(:last-child)",
          },
        },
      ],
  
      responsive: true,
      serverSide: false,
      dataType: "json",
      type: "GET",
      columns: [
        {
          data: "vendor_name",
          name: "vendor_name",
          searchable: true,
          width: "10%",
          // className: "dtr-control",
        },
        {
          data: "category.category_name",
          name: "category.category_name",
          searchable: true,
          width: "10%",
          // className: "dtr-control",
        },
        {
          data: "contact_person",
          name: "contact_person",
          searchable: true,
          width: "10%",
          // className: "dtr-control",
        },
        {
          data: "contact_no",
          name: "contact_no",
          searchable: true,
          width: "10%",
          // className: "dtr-control",
        },
        {
          data: "email",
          name: "email",
          searchable: true,
          width: "10%",
          // className: "dtr-control",
        },

  
        {
          data: null,
          searchable: true,
          width: "15%",
          render: function (aData, type, row) {
            let address =
              aData.region + " " + aData.province + " " + aData.street;
            return address;
          },
        },
       
        {
          data: null,
          name: null,
          searchable: true,
          width: "10%",
          render: function (aData, type, row) {
            if (aData.status == "Active" || aData.status == "active") {
              let status =
                '<label class="text-left badge badge-primary p-2 w-100" >Active</label>';
  
              return status;
            } else {
              let status =
                '<label class="text-left badge badge-dark p-2 w-100" >Blacklisted</label> ';
              return status;
            }
          },
        },
  
        // {
        //   data: null,
        //   width: "10%",
        //   render: function (aData, type, row) {
        //     let buttons = "";
        //     buttons +=
        //       '<div class="text center dropdown"><div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">' +
        //       '<i class="fas fa-ellipsis-v"></i></div><div class="dropdown-menu dropdown-menu-right">';
        //     //view
        //     buttons +=
        //       '<div class="dropdown-item d-flex role="button" onClick="return editData(\'' +
        //       aData["id"] +
        //       "',0)\">" +
        //       '<div style="width: 2rem"> <i class= "fas fa-eye mr-1"></i></div>' +
        //       "<div> View</div></div>";
  
        //     buttons += "</div></div>";
        //     return buttons; // same class in i element removed it from a element
        //   },
        // },
      ],
    });
  };


  // view vendor details
  editData = (id, type) => {
    $(".is-invalid").removeClass("is-invalid");
    $(".is-valid").removeClass("is-valid");
  
    // $("#modal-xl").modal("show");
  
    $.ajax({
      url: apiURL + "vendor/" + id,
      type: "GET",
      dataType: "json",
      success: function (data) {
        if (data) {
          $("#modal-print").modal("show");

          $("#uuid").val(data["id"]);
          $("#photo_path_placeholder").attr(
            "src",
            apiURL + "vendor/vendor-pic/" + data["vendor_logo"]
          );
  
          // console.log(apiURL + "vendor/vendor-pic/" + data["vendor_logo"]);
          $("#vendor_name").val(data["vendor_name"]);
  
          // $("#region").val(data["region"]);
          // $("#province").val(data["province"]);
          // $("#municipality").val(data["municipality"]);
          $("#barangay").val(data["barangay"]);
          $("#street").val(data["street"]);
          $("#organization_type").val(data["organization_type"]);
          $("#vendor_website").val(data["vendor_website"]);
  
          $("#category_id").val(data.category["id"]).trigger("change");
  
          $("#contact_no").val(data["contact_no"]);
          $("#contact_person").val(data["contact_person"]);
  
          $("#email").val(data["email"]);
  
          $("#username").val(data["username"]);
          // $("#password").val(data["password"]);
  
  
          $("#region option:contains(" + data["region"] + ")")
            .attr("selected", "selected")
            .trigger("change");
  
          setTimeout(() => {
            $("#province option:contains(" + data["province"] + ")")
              .attr("selected", "selected")
              .trigger("change");
  
          }, 1500);
  
          setTimeout(() => {
            $("#municipality option:contains(" + data["municipality"] + ")")
              .attr("selected", "selected")
              .trigger("change");
  
          }, 3000);
  
  
          setTimeout(() => {
            $("#barangay option:contains(" + data["barangay"] + ")")
              .attr("selected", "selected")
              .trigger("change");
  
          }, 4500);
  
          // if data is for viewing only
          if (type == 0) {
            $("#form_id input, select, textarea").prop("disabled", true);
            $(".modal-title").html("View Vendor");
            $(".submit").hide();
            $(".hide-password").hide();
          } else {
            $("#form_id input, select, textarea").prop("disabled", false);
            // $("#form_id button").prop("disabled", false);
            $(".submit").show();
            $(".modal-title").html("Update Vendor");
            $(".submit").html(
              "Update" + '<i class="fas fa-check font-size-16 ml-2"></i>'
            );
            $(".submit").attr("class", "btn btn-info submit");
            $(".hide-password").hide();
          }
        } else {
          notification("error", "Error!", data.message);
        }
      },
      error: function (data) {},
    });
  };
  
//PSGC API For filtering location of vendor
let region = localStorage.getItem("region") || null;
let province = localStorage.getItem("province") || null;
let municipality = localStorage.getItem("municipality") || null;
let barangay = localStorage.getItem("barangay") || null;
let street = localStorage.getItem("street") || null;
let full_address = localStorage.getItem("full_address") || null;

function setRegion() {
  // Get region from storage (in this case, localStorage)
  let region = localStorage.getItem("region") || null;
  $.ajax({
    type: "get",
    url: apiURL + "vendor/psgc/api/regions",
    dataType: "json",
    success: function (response) {
      $("[name=region]").append(`
                <option value="">Choose Region</option>
            `);
      response.forEach((el) => {
        // Create element builder
        let builder;
        // Compare if region is same with code
        if (el.code == region) {
          p_region = el.code;
          // Add "selected" attribute if match
          builder = `
                        <option selected value="${el.code}">${el.name} (${el.regionName})</option>
                    `;
        } else {
          // Otherwise, add as option
          builder = `
                        <option value="${el.code}">${el.name} (${el.regionName})</option>
                    `;
        }
        // Add element builder to select
        $("[name=region]").append(builder);
      });
    },
  });
}

function setProvince(code, value = null) {
  $("[name=province]").prop("readonly", false);
  $("[name=province]").empty();
  $("[name=barangay]").prop("readonly", true);
  $("[name=barangay]").empty();
  $("[name=municipality]").prop("readonly", true);
  $("[name=municipality]").empty();
  $("[name=province]").append(`
        <option value="">Choose Province</option>
    `);

  $.ajax({
    type: "get",
    url: apiURL + "vendor/psgc/api/regions/" + code + "/provinces",
    dataType: "json",
    success: function (response) {
      response.forEach((el) => {
        if (el.code == value) {
          builder = `
                            <option selected value="${el.code}">${el.name}</option>
                        `;
        } else {
          builder = `
                            <option value="${el.code}">${el.name}</option>
                        `;
        }
        $("[name=province]").append(builder);
      });
    },
  });
}

function setMunicipality(code, region, value = null) {
  $("[name=municipality]").prop("readonly", false);
  $("[name=municipality]").empty();
  $("[name=barangay]").prop("readonly", true);
  $("[name=barangay]").empty();
  $("[name=municipality]").append(`
        <option value="">Choose Municipality</option>
    `);

  $.ajax({
    type: "get",
    url:
      apiURL + "vendor/psgc/api/provinces/" + code + "/cities-municipalities",
    dataType: "json",
    success: function (response) {
      response.forEach((el) => {
        if (el.code == value) {
          builder = `
                            <option selected value="${el.code}">${el.name}</option>
                        `;
        } else {
          builder = `
                            <option value="${el.code}">${el.name}</option>
                        `;
        }
        $("[name=municipality]").append(builder);
      });
    },
  });
}

function setBarangay(code, value = null) {
  $("[name=barangay]").prop("readonly", false);
  $("[name=barangay]").empty();

  $.ajax({
    type: "get",
    url:
      apiURL + "vendor/psgc/api/cities-municipalities/" + code + "/barangays",
    dataType: "json",
    success: function (response) {
      $("[name=barangay]").append(`
                <option value="">Choose Barangay</option>
            `);
      response.forEach((el) => {
        if (el.code == value) {
          builder = `
                        <option selected value="${el.code}">${el.name}</option>
                    `;
        } else {
          builder = `
                        <option value="${el.code}">${el.name}</option>
                    `;
        }
        $("[name=barangay]").append(builder);
      });
    },
  });
}

function setAddress() {
  setProvince(region, province);
  setMunicipality(province, region, municipality);
  setBarangay(municipality, barangay);
  $("[name=street]").val(street);
  $("#address").text(full_address);
}

$(document).ready(() => {
  $("[name=region]").select2({
    width: "100%",
    placeholder: { id: "", text: "Select Region" },
  });
  $("[name=province]").select2({
    width: "100%",
    placeholder: { id: "", text: "Select Region First" },
  });
  $("[name=municipality]").select2({
    width: "100%",
    placeholder: { id: "", text: "Select Province First" },
  });
  $("[name=barangay]").select2({
    width: "100%",
    placeholder: { id: "", text: "Select Municipality First" },
  });

  // Get Regions First
  setRegion();

  // OnChange Event of REGION to fill respective PROVINCES
  $("[name=region]").on("change", function () {
    region = $(this).val();
    region_text = $(this).find(":selected").text();
    setProvince(region);
    if(region != ""){
      loadTable(region_text,"none","none",$('#vendor_status').val())
    }
    else{
      loadTable("none","none","none",$('#vendor_status').val())

    }
  });

  // OnChange Event of PROVINCE to fill respective MUNICIPALITIES
  $("[name=province]").on("change", function () {
    province = $(this).val();

    province_text = $(this).find(":selected").text()
    setMunicipality(province, region);
    loadTable(region_text,province_text,"none",$('#vendor_status').val())

  });


  // OnChange Event of MUNICIPALITY to fill respective BARANGAYS
  $("[name=municipality]").on("change", function () {
    municipality = $(this).val();

    municipality_text = $(this).find(":selected").text();
    setBarangay(municipality);
    loadTable(region_text,province_text,municipality_text,$('#vendor_status').val())

  });

  $("[name=vendor_status]").on("change", function () {
    vendor_status = $(this).val();

   if($("[name=region]").val() != ""){
    loadTable(region_text,"none","none",vendor_status)
    if ($("[name=province]").val() != ""  ){
    loadTable(region_text,province_text,"none",vendor_status)

      if($("[name=municipality]").val() != "" ){
        loadTable(region_text,province_text,municipality_text,vendor_status)

      }
    }
  }
  else{
    loadTable("none","none","none",vendor_status)

  
  }
  });


});


// Clear on click
// $("#clear").on("click", function () {
//   // Remove from storage
//   localStorage.removeItem("region");
//   localStorage.removeItem("province");
//   localStorage.removeItem("municipality");
//   localStorage.removeItem("barangay");
//   localStorage.removeItem("street");
//   localStorage.removeItem("full_address");

//   console.log("wew")

//   // Reset Variables
//   region = "";
//   province = "";
//   municipality = "";
//   barangay = "";
//   street = "";

//   // Reset Form
//   $("#address").text("");
//   setRegion();
  
//   $("#region").val("");
//   $("#province").val("").empty();
//   $("#municipality").val("").empty();
//   $("#barangay").val("").empty();
//   $("#vendor_status").val("Active")
// });

