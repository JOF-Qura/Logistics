var total_notifications = 0;

$(document).ready(function () {
    $.ajax({
        url: '/projects/department/notification/Request',
        type: "GET",
        dataType: "JSON",

        success: function (data) {
            var projects = data;

            var html = "";
            total_notifications = total_notifications + projects.length;

            for (var i = 0; i < projects.length; i++) {
                html += `<a href="/project_management/department_head/view_project/${projects[i].id}" class="dropdown-item btn-notif1" data-custom-value="${projects[i].id}"> <i class="fas fa-hammer mr-2"></i> <span style="white-space: normal; display: inline-block; inline-size: 250px;">Project: ${projects[i].name} is requesting for approval.</span> <span class="float-right text-muted text-sm">${moment(projects[i].created_at).fromNow()}</span> </a> <span class="text-muted text-sm ml-5" style="white-space: normal; display: inline-block; inline-size: 250px;">by ${projects[i].project_user.employee_first_name + " " + projects[i].project_user.employee_last_name}</span> <div class="dropdown-divider"></div>`
            }

            $.ajax({
                url: '/projects/department/notification/Refused',
                type: "GET",
                dataType: "JSON",
        
                success: function (data) {
                    var projects = data;
        
                    total_notifications = total_notifications + projects.length;
        
                    for (var i = 0; i < projects.length; i++) {
                        html += `<a href="/project_management/department_head/project_details/${projects[i].id}" class="dropdown-item btn-notif1" data-custom-value="${projects[i].id}"> <i class="fas fa-hammer mr-2"></i> <span style="white-space: normal; display: inline-block; inline-size: 250px;">Project: ${projects[i].name} has been refused.</span> <span class="float-right text-muted text-sm">${moment(projects[i].created_at).fromNow()}</span> </a> <span class="text-muted text-sm ml-5" style="white-space: normal; display: inline-block; inline-size: 250px;">by ${projects[i].project_user.employee_first_name + " " + projects[i].project_user.employee_last_name}</span> <div class="dropdown-divider"></div>`
                    }
        
                    $.ajax({
                        url: '/projects/department/notification/Accept',
                        type: "GET",
                        dataType: "JSON",
                
                        success: function (data) {
                            var projects = data;
                
                            total_notifications = total_notifications + projects.length;
                
                            for (var i = 0; i < projects.length; i++) {
                                html += `<a href="/project_management/department_head/project_details/${projects[i].id}" class="dropdown-item btn-notif1" data-custom-value="${projects[i].id}"> <i class="fas fa-hammer mr-2"></i> <span style="white-space: normal; display: inline-block; inline-size: 250px;">Project: ${projects[i].name} has been accepted.</span> <span class="float-right text-muted text-sm">${moment(projects[i].updated_at).fromNow()}</span> </a> <span class="text-muted text-sm ml-5" style="white-space: normal; display: inline-block; inline-size: 250px;">by ${projects[i].project_user.employee_first_name + " " + projects[i].project_user.employee_last_name}</span> <div class="dropdown-divider"></div>`
                            }
                
                            $.ajax({
                                url: '/projects/department/notification/Cancelled',
                                type: "GET",
                                dataType: "JSON",
                        
                                success: function (data) {
                                    var projects = data;
                        
                                    total_notifications = total_notifications + projects.length;
                        
                                    for (var i = 0; i < projects.length; i++) {
                                        html += `<a href="/project_management/department_head/project_details/${projects[i].id}" class="dropdown-item btn-notif1" data-custom-value="${projects[i].id}"> <i class="fas fa-hammer mr-2"></i> <span style="white-space: normal; display: inline-block; inline-size: 250px;">Project: ${projects[i].name} has been cancelled.</span> <span class="float-right text-muted text-sm">${moment(projects[i].created_at).fromNow()}</span> </a> <span class="text-muted text-sm ml-5" style="white-space: normal; display: inline-block; inline-size: 250px;">by ${projects[i].project_user.employee_first_name + " " + projects[i].project_user.employee_last_name}</span> <div class="dropdown-divider"></div>`
                                    }
                        
                                    $.ajax({
                                        url: '/concept_paper/department/notification/Request',
                                        type: "GET",
                                        dataType: "JSON",
                                
                                        success: function (data) {
                                            var concept_paper = data;
                                
                                            total_notifications = total_notifications + concept_paper.length;
                                
                                            for (var i = 0; i < concept_paper.length; i++) {
                                                html += `<a href="/project_management/department_head/concept_paper_details/${concept_paper[i].id}" class="dropdown-item btn-notif2" data-custom-value="${concept_paper[i].id}"> <i class="fas fa-hammer mr-2"></i> <span style="white-space: normal; display: inline-block; inline-size: 250px;">Concept Paper: ${concept_paper[i].name} is requesting for approval.</span> <span class="float-right text-muted text-sm">${moment(concept_paper[i].created_at).fromNow()}</span> </a> <span class="text-muted text-sm ml-5" style="white-space: normal; display: inline-block; inline-size: 250px;">by ${concept_paper[i].concept_employee.employee_first_name + " " + concept_paper[i].concept_employee.employee_last_name}</span> <div class="dropdown-divider"></div>`
                                            }
                                
                                            $('#notifications').append(html);
                                            
                                            if(total_notifications != 0){
                                                $('#notification_number').html(total_notifications);
                                            }
                                            $('#notification_numbers').html(total_notifications + ' Notification/s');
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
});

$(document).on("click", ".btn-notif1", function () {
    var id = $(this).data("custom-value");

    $.ajax({
        url: '/projects/notification/'+ id,
        type: "PUT",
        dataType: "JSON",

        success: function (data) {
            console.log('Alaws na.')
        }
    })
});

$(document).on("click", ".btn-notif2", function () {
    var id = $(this).data("custom-value");

    $.ajax({
        url: '/concept_paper/notification/'+ id,
        type: "PUT",
        dataType: "JSON",

        success: function (data) {
            console.log('Alaws na.')
        }
    })
});