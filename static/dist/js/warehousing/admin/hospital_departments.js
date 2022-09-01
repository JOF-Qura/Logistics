$(function() 
{
    loadTable();

     // function to save/update record
     $("#form_id").on("submit", function (e)
     {
         e.preventDefault();
         trimInputFields();
         var department_id = $("#uuid").val();
         var department_head = $("#department_head").val()
         var department_name = $("#department_name").val()
         var department_description = $("#department_description").val();
         var department_location = $("#department_location").val();
         var contact_no = $("#department_contact_no").val();

         if (department_id == "")
         {
             $.ajax(
             {
                 url: "http://localhost:8000/" + "asset_management/api/Department/",
                 type: "POST",
                 data: JSON.stringify(
                 {		
                     "department_head": department_head,
                     "department_name": department_name,
                     "department_description": department_description,
                     "department_location": department_location,
                     "contact_no": contact_no,
                 }),
                 dataType: "JSON",
                 contentType: 'application/json',
                 processData: false,
                 cache: false,
                 success: function (data) 
                 {
                    $('#form_id').trigger("reset")
                    $('#button_add').prop('disabled', true)
                    notification("success", "Success!", data.message);
                    loadTable();
                    $("#adding_modal").modal('hide')
                 },
                 error: function ({ responseJSON }) 
                 {
                     
                 },
             });
         }
    });
    $('#button_add').prop('disabled', false)
});

//    $.ajaxSetup(
//     {
// 		headers: 
//         {
// 			Accept: "application/json",
// 			Authorization: "Bearer " + token,
// 			ContentType: "application/x-www-form-urlencoded",
// 		},
// 	});
loadTable = () => 
{
    $("#data-table").dataTable().fnClearTable();
    $("#data-table").dataTable().fnDraw();
    $("#data-table").dataTable().fnDestroy();
    $("#data-table").dataTable({
        serverSide: true,
        // scrollX: true,
        responsive: false,
        buttons:[
            {extend: 'excel', text: 'Save to Excel File'}
        ],
        order: [[0, "desc"]],
        aLengthMenu: [5, 10, 20, 30, 50, 100],
        aaColumns: [
            { sClass: "text-left" },
            { sClass: "text-left" },
            { sClass: "text-left" },
            { sClass: "text-center" },
        ],
        columns: [
            {
                data: "department_head",
                name: "department_head",
                searchable: true,
                // width: "6.66%",
                className: "dtr-control",
            },
            {
                data: "department_name",
                name: "department_name",
                searchable: true,
                // width: "6.66%",
                className: "dtr-control",
            },
            {
                data: "department_description",
                name: "department_description",
                searchable: true,
                // width: "6.66%",
                className: "dtr-control",
            },
            {
                data: "department_location",
                name: "department_location",
                searchable: true,
                // width: "6.66%",
                className: "dtr-control",
            },
            {
                data: "contact_no",
                name: "contact_no",
                searchable: true,
                // width: "6.66%",
                className: "dtr-control",
            },
            {
                data: null,
                // width: "30%",
                class: "text-center", 
                render: function (aData, type, row) 
                {
                    let buttons = "";

                    buttons +=
                    '<div class="text-center dropdown">' +
                        '<div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">'  +
                            '<i class="fas fa-ellipsis-v"></i>'  +
                        '</div>' +
                        '<div class="dropdown-menu dropdown-menu-right">'  +
                        //Info
                            // '<div class="dropdown-item d-flex" role="button"onClick="return viewData(\'' +
                    //     aData["department_id"] +
                    //     '\',0)>'  +
                            //     '<div style="width: 2rem">' +
                            //         '<i class="fas fa-eye mr-1"></i>'  +
                            //     '</div>' +
                            //     '<div>View Hospital Department</div>'  +
                            // '</div>'  +
                        // Edit
                            '<div class="dropdown-item d-flex" role="button" data-toggle="modal" data-target="#editing_modal" onClick="return editData(\'' +
                            aData["department_id"] +
                            '\',1)">'  +
                                '<div style="width: 2rem">' +
                                    '<i class="fas fa-edit mr-1"></i>'  +
                                '</div>' +
                                '<div>' +
                                    'Edit Hospital Department' +
                                '</div>'  +
                            '</div>' +
                        // Delete
                            '<div class="dropdown-divider"></div>' +
                            '<div class="dropdown-item d-flex" role="button" data-toggle="modal" data-target="#delete_modal" onClick="return deleteData(\'' + 
                            aData["department_id"] + 
                            '\')">'  +
                                '<div style="width: 2rem">' +
                                    '<i class="fas fa-trash-alt mr-1"></i>'  +
                                '</div>' +
                                '<div>' +
                                    'Delete Hospital Department' +
                                '</div>'  +
                            '</div>'  +
                        '</div>'  +
                    '</div>';

                    return buttons; // same class in i element removed it from a element
                },
            },
        ],
        ajax: 
        {
            url: '/asset_management/api/Department/datatable',
            type: "GET",
            ContentType: "application/x-www-form-urlencoded",
        },
        fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) 
        {
            // console.log(aData)
            let buttons = "";

                    buttons +=
                    '<div class="text-center dropdown">' +
                        '<div class="btn btn-sm btn-default" data-toggle="dropdown" role="button">'  +
                            '<i class="fas fa-ellipsis-v"></i>'  +
                        '</div>' +
                        '<div class="dropdown-menu dropdown-menu-right">'  +
                        //Info
                            // '<div class="dropdown-item d-flex" role="button"onClick="return viewData(\'' +
                    //     aData["department_id"] +
                    //     '\',0)>'  +
                            //     '<div style="width: 2rem">' +
                            //         '<i class="fas fa-eye mr-1"></i>'  +
                            //     '</div>' +
                            //     '<div>View Hospital Department</div>'  +
                            // '</div>'  +
                        // Edit
                            '<div class="dropdown-item d-flex" role="button" data-toggle="modal" data-target="#editing_modal" onClick="return editData(\'' +
                            aData["department_id"] +
                            '\',1)">'  +
                                '<div style="width: 2rem">' +
                                    '<i class="fas fa-edit mr-1"></i>'  +
                                '</div>' +
                                '<div>' +
                                    'Edit Hospital Department' +
                                '</div>'  +
                            '</div>' +
                        // Delete
                            '<div class="dropdown-divider"></div>' +
                            '<div class="dropdown-item d-flex" role="button" data-toggle="modal" data-target="#delete_modal" onClick="return deleteData(\'' + 
                            aData["department_id"] + 
                            '\')">'  +
                                '<div style="width: 2rem">' +
                                    '<i class="fas fa-trash-alt mr-1"></i>'  +
                                '</div>' +
                                '<div>' +
                                    'Delete Hospital Department' +
                                '</div>'  +
                            '</div>'  +
                        '</div>'  +
                    '</div>';

            var department_id = ""

            if(aData["department_id"] == null)
            {
                department_id = "null"
            }
            else
            {
                department_id = aData["department_id"]
            }

            $("td:eq(0)", nRow).html(aData["department_name"]);
            $("td:eq(1)", nRow).html(aData["department_head"]);
            $("td:eq(2)", nRow).html(aData["department_description"]);
            $("td:eq(3)", nRow).html(aData["department_location"]);
            $("td:eq(4)", nRow).html(aData["contact_no"]);
            $("td:eq(5)", nRow).html(buttons);

        },
        drawCallback: function (settings) {
            // $("#data-table").removeClass("dataTable");
        },
    });
};

// loadEmployees = () => {
//     $.ajax({
//         url: "http://localhost:8000/" + "employees",
//         type: "GET",
//         dataType: "json",
//         success: function (responseData) 
//         { 
//             $.each(responseData.Employees, function (i, dataOptions) 
//             {
//                 var options = "";

//                 options =
//                     "<option value='" +
//                     dataOptions.employee_id +
//                     "'>" +
//                     dataOptions.employee_first_name +
//                     "</option>";

//                 $("#hospital_manager_id").append(options);
//                 $("#e_hospital_manager_id").append(options);
//             });
            
//         },
//         error: function ({ responseJSON }) {},
//     });
// };
// loadEmployees();

// function to edit data
editData = (department_id, type) => 
{
    console.log(department_id)
    $("#e_form_id")[0].reset();
	$.ajax(
		{
		url: "http://localhost:8000/" + "asset_management/api/Department/" + department_id,
		type: "GET",
		dataType: "json",
		success: function (data) 
		{
            console.log(data.data)
            if (type == 1) 
            {
                $("#e_uuid").val(data.data["department_id"]);
                $("#e_department_head").val(data.data["department_head"])
                $("#e_department_name").val(data.data["department_name"])
                $("#e_department_description").val(data.data["department_description"]);
                $("#e_department_location").val(data.data["department_location"]);
                $("#e_department_contact_no").val(data.data["contact_no"]);

                $("#e_form_id").on("submit", function (e)
                {
                    var department_id = $("#e_uuid").val();
                    var department_head = $("#e_department_head").val()
                    var department_name = $("#e_department_name").val();
                    var department_description = $("#e_department_description").val();
                    var department_location = $("#e_department_location").val();
                    var contact_no = $("#e_department_contact_no").val();

                    $.ajax(
                    {
                        url: "http://localhost:8000/" + "asset_management/api/Department/" + department_id,
                        type: "PUT",
                        data: JSON.stringify(
                        {		
                            "department_head": department_head,
                            "department_name": department_name,
                            "department_description": department_description,
                            "department_location": department_location,
                            "contact_no": contact_no,

                        }),
                        dataType: "JSON",
                        contentType: 'application/json',
                        processData: false,
                        cache: false,
                        success: function (data) 
                        {
                            $('#button_save').prop('disabled', true)
                            notification("success", "Success!", data.message);
                            loadTable();
                            $("#editing_modal").modal('hide')
                        },
                        error: function ({ responseJSON }) 
                        {
                            
                        },
                    });
                    $('#button_save').prop('disabled', false)
                });
            }
		},
		error: function (data) {},
	});
    $('#button_save').prop('disabled', false)
};

// function to delete data
// deleteData = (hospital_department_id) => 
// {
// 	Swal.fire(
// 	{
// 		title: "Are you sure you want to delete this record?",
// 		text: "You won't be able to revert this!",
// 		icon: "warning",
// 		showCancelButton: !0,
// 		confirmButtonColor: "#34c38f",
// 		cancelButtonColor: "#f46a6a",
// 		confirmButtonText: "Yes, delete it!",
// 	})
// 	.then(function (t) 
// 	{
// 		// if user clickes yes, it will change the active status to "Not Active".
// 		if (t.value) 
// 		{
// 			$.ajax(
// 				{
// 				url: "http://localhost:8000/" + "supplies/" + hospital_department_id,
// 				type: "DELETE",
// 				dataType: "json",
// 				success: function (data) 
//                 {
//                     notification("success", "Success!", data.message);
//                     loadTable();
// 				},
// 				error: function ({ responseJSON }) {},
// 			});
// 		}
// 	});
// };

deleteData = (department_id) => 
{
    $("#d_uuid").val(department_id);

    $("#d_form_id").on("submit", function (e)
    {
        e.preventDefault();
        trimInputFields();
        $.ajax(
            {
            url: "http://localhost:8000/" + "asset_management/api/Department/" + department_id,
            type: "DELETE",
            dataType: "json",
            success: function (data) 
            {
                notification("info", "Success!", data.message);
                loadTable();
                loadNotif();
                $("#delete_modal").modal('hide')
            },
            error: function ({ responseJSON }) {},
            
        });
    });
};