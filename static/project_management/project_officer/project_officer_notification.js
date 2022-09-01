var total_notifications = 0;

$(document).ready(function () {
    $.ajax({
        url: '/projects/department/notification/Approved',
        type: "GET",
        dataType: "JSON",

        success: function (data) {
            var projects = data;

            var html = "";
            total_notifications = total_notifications + projects.length;

            for (var i = 0; i < projects.length; i++) {
                html += `<a href="/project_management/project_officer/view_project/${projects[i].id}" class="dropdown-item btn-notif1" data-custom-value="${projects[i].id}"> <i class="fas fa-hammer mr-2"></i> <span style="white-space: normal; display: inline-block; inline-size: 250px;">Project: ${projects[i].name} has been approved.</span> <span class="float-right text-muted text-sm">${moment(projects[i].updated_at).fromNow()}</span> </a> <span class="text-muted text-sm ml-3">by Department Head</span> <div class="dropdown-divider"></div>`
            }

            $.ajax({
                url: '/projects/department/notification/Rejected',
                type: "GET",
                dataType: "JSON",
        
                success: function (data) {
                    var projects = data;
        
                    total_notifications = total_notifications + projects.length;
        
                    for (var i = 0; i < projects.length; i++) {
                        html += `<a href="/project_management/project_officer/view_project/${projects[i].id}" class="dropdown-item btn-notif1" data-custom-value="${projects[i].id}"> <i class="fas fa-hammer mr-2"></i> <span style="white-space: normal; display: inline-block; inline-size: 250px;">Project: ${projects[i].name} has been rejected.</span> <span class="float-right text-muted text-sm">${moment(projects[i].updated_at).fromNow()}</span> </a> <span class="text-muted text-sm ml-3">by Department Head</span> <div class="dropdown-divider"></div>`
                    }

                    $.ajax({
                        url: '/projects/department/notification/Remarks',
                        type: "GET",
                        dataType: "JSON",
                
                        success: function (data) {
                            var projects = data;
                
                            total_notifications = total_notifications + projects.length;
                
                            for (var i = 0; i < projects.length; i++) {
                                html += `<a href="/project_management/project_officer/project_details/${projects[i].id}" class="dropdown-item btn-notif1" data-custom-value="${projects[i].id}"> <i class="fas fa-hammer mr-2"></i> <span style="white-space: normal; display: inline-block; inline-size: 250px;">Project: ${projects[i].name} has been added a remark.</span> <span class="float-right text-muted text-sm">${moment(projects[i].updated_at).fromNow()}</span> </a> <span class="text-muted text-sm ml-3">by Department Head</span> <div class="dropdown-divider"></div>`
                            }
                
                            $.ajax({
                                url: '/projects/department/notification/Appoint',
                                type: "GET",
                                dataType: "JSON",
                        
                                success: function (data) {
                                    var projects = data;
                        
                                    total_notifications = total_notifications + projects.length;
                        
                                    for (var i = 0; i < projects.length; i++) {
                                        html += `<a href="/project_management/project_officer/view_project/${projects[i].id}" class="dropdown-item btn-notif1" data-custom-value="${projects[i].id}"> <i class="fas fa-hammer mr-2"></i> <span style="white-space: normal; display: inline-block; inline-size: 250px;">Project: ${projects[i].name} has been assigned to you.</span> <span class="float-right text-muted text-sm">${moment(projects[i].updated_at).fromNow()}</span> </a> <span class="text-muted text-sm ml-3">by Department Head</span> <div class="dropdown-divider"></div>`
                                    }
                        
                                    $.ajax({
                                        url: '/projects/department/notification/Reschedule',
                                        type: "GET",
                                        dataType: "JSON",
                                
                                        success: function (data) {
                                            var projects = data;
                                
                                            total_notifications = total_notifications + projects.length;
                                
                                            for (var i = 0; i < projects.length; i++) {
                                                html += `<a href="/project_management/project_officer/project_details/${projects[i].id}" class="dropdown-item btn-notif1" data-custom-value="${projects[i].id}"> <i class="fas fa-hammer mr-2"></i> <span style="white-space: normal; display: inline-block; inline-size: 250px;">Project: ${projects[i].name} has been rescheduled.</span> <span class="float-right text-muted text-sm">${moment(projects[i].updated_at).fromNow()}</span> </a> <span class="text-muted text-sm ml-3">by Department Head</span> <div class="dropdown-divider"></div>`
                                            }
                                
                                            $.ajax({
                                                url: '/task/department/notification/Remarks',
                                                type: "GET",
                                                dataType: "JSON",
                                        
                                                success: function (data) {
                                                    var tasks = data;
                                        
                                                    total_notifications = total_notifications + tasks.length;
                                        
                                                    for (var i = 0; i < tasks.length; i++) {
                                                        html += `<a href="/project_management/project_officer/task_details/${tasks[i].id}" class="dropdown-item btn-notif2" data-custom-value="${tasks[i].id}"> <i class="fas fa-thumbtack mr-2"></i> <span style="white-space: normal; display: inline-block; inline-size: 250px;">Task: ${tasks[i].name} has been added a remark.</span> <span class="float-right text-muted text-sm">${moment(tasks[i].updated_at).fromNow()}</span> </a> <span class="text-muted text-sm ml-3">by Department Head</span> <div class="dropdown-divider"></div>`
                                                    }
                                        
                                                    $.ajax({
                                                        url: '/concept_paper/department/notification/Approved',
                                                        type: "GET",
                                                        dataType: "JSON",
                                                
                                                        success: function (data) {
                                                            var concept_paper = data;
                                                
                                                            total_notifications = total_notifications + concept_paper.length;
                                                
                                                            for (var i = 0; i < concept_paper.length; i++) {
                                                                html += `<a href="/project_management/project_officer/concept_paper_details/${concept_paper[i].id}" class="dropdown-item btn-notif3" data-custom-value="${concept_paper[i].id}"> <i class="fas fa-hammer mr-2"></i> <span style="white-space: normal; display: inline-block; inline-size: 250px;">Concept Paper: ${concept_paper[i].name} has been approved.</span> <span class="float-right text-muted text-sm">${moment(concept_paper[i].updated_at).fromNow()}</span> </a> <span class="text-muted text-sm ml-5" style="white-space: normal; display: inline-block; inline-size: 250px;">by Department Head</span> <div class="dropdown-divider"></div>`
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
        url: '/task/notification/'+ id,
        type: "PUT",
        dataType: "JSON",

        success: function (data) {
            console.log('Alaws na.')
        }
    })
});

$(document).on("click", ".btn-notif3", function () {
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