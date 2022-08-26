function load_event(id){
    $.ajax({
    url: '/asset_management/api/Event/' + id,
    type: "GET",
    dataType: "JSON",

    success: function(data){
        var event = data.data;

        var html = ""


        for(var i=0; i < event.length; i++){

            if (event[i].event_title == "Creation"){
                if ( event.length == 1 || moment(event[i - 1].created_at).format('LL') <  moment(event[i].created_at).format('LL') || moment(event[i - 1].created_at).format('LL') >  moment(event[i].created_at).format('LL') ) {
                    html += 
                '<div class="time-label">' +
                    '<span class="bg-green">' + moment(event[i].created_at).format('LL') + '</span>' +
                '</div>'}

                html += 
                '<div>' +
                '<i class="fas fa-plus bg-primary"></i>' +
                '<div class="timeline-item">' +
                '<span class="time"><i class="fas fa-clock"></i>  ' + moment(event[i].created_at).startOf('seconds').fromNow() + '</span>'+
                '<h3 class="timeline-header">' + event[i].event_title + '</h3>' +
                '<div class="timeline-body text-small">' +
                    event[i].event_message +
                '</div>' +
                '</div>' +
            '</div> <div><i class="fas fa-clock bg-gray"></i></div>'
            }

            if (event[i].event_title == "Edited"){
                if ( i  == 0 ||  moment(event[i - 1].created_at).format('LL') >  moment(event[i].created_at).format('LL') ) {
                    html += 
                '<div class="time-label">' +
                    '<span class="bg-green">' + moment(event[i].created_at).format('LL') + '</span>' +
                '</div>'
                }
                    html += 
                    '<div>' +
                    '<i class="fas fa-edit bg-info"></i>' +
                    '<div class="timeline-item">' +
                    '<span class="time"><i class="fas fa-clock"></i>  ' + moment(event[i].created_at).startOf('seconds').fromNow() + '</span>'+
                    '<h3 class="timeline-header">' + event[i].event_title + '</h3>' +
                    '<div class="timeline-body text-small">' +
                        event[i].event_message +
                    '</div>' +
                    '</div>' +
                    '</div>'
            }

            if (event[i].event_title == "Lost/Missing" || event[i].event_title == "Undo Missing"){
                if ( i  == 0 ||  moment(event[i - 1].created_at).format('LL') >  moment(event[i].created_at).format('LL') ) {
                    html += 
                '<div class="time-label">' +
                    '<span class="bg-green">' + moment(event[i].created_at).format('LL') + '</span>' +
                '</div>'
                }
                    if (event[i].event_title == "Undo Missing"){
                        html += 
                        '<div>' +
                        '<i class="fas fa-sticky-note bg-info"></i>'
                    }
                    else {
                        html += 
                        '<div>' +
                        '<i class="fas fa-sticky-note bg-warning"></i>'
                    }
                    html += 
                    '<div class="timeline-item">' +
                    '<span class="time"><i class="fas fa-clock"></i>  ' + moment(event[i].created_at).startOf('seconds').fromNow() + '</span>'+
                    '<h3 class="timeline-header">' + event[i].event_title + '</h3>' +
                    '<div class="timeline-body text-small">' +
                        event[i].event_message +
                    '</div>' +
                    '</div>' +
                    '</div>'
            }

            if (event[i].event_title == "Sold" || event[i].event_title == "Undo Sold"){
                if ( i  == 0 ||  moment(event[i - 1].created_at).format('LL') >  moment(event[i].created_at).format('LL') ) {
                    html += 
                '<div class="time-label">' +
                    '<span class="bg-green">' + moment(event[i].created_at).format('LL') + '</span>' +
                '</div>'
                }
                    if (event[i].event_title == "Undo Sold"){
                        html += 
                        '<div>' +
                        '<i class="fas fa-dollar-sign bg-info"></i>'
                    }
                    else {
                        html += 
                        '<div>' +
                        '<i class="fas fa-dollar-sign bg-success"></i>'
                    }
                    html += 
                    '<div class="timeline-item">' +
                    '<span class="time"><i class="fas fa-clock"></i>  ' + moment(event[i].created_at).startOf('seconds').fromNow() + '</span>'+
                    '<h3 class="timeline-header">' + event[i].event_title + '</h3>' +
                    '<div class="timeline-body text-small">' +
                        event[i].event_message +
                    '</div>' +
                    '</div>' +
                    '</div>'
            }

            if (event[i].event_title == "Disposed" || event[i].event_title == "Undo Dispose"){
                if ( i  == 0 ||  moment(event[i - 1].created_at).format('LL') >  moment(event[i].created_at).format('LL') ) {
                    html += 
                '<div class="time-label">' +
                    '<span class="bg-green">' + moment(event[i].created_at).format('LL') + '</span>' +
                '</div>'
                }
                    if (event[i].event_title == "Undo Disposed"){
                        html += 
                        '<div>' +
                        '<i class="fas fa-thumbs-down bg-info"></i>'
                    }
                    else {
                        html += 
                        '<div>' +
                        '<i class="fas fa-thumbs-down bg-success"></i>'
                    }
                    html += 
                    '<div class="timeline-item">' +
                    '<span class="time"><i class="fas fa-clock"></i>  ' + moment(event[i].created_at).startOf('seconds').fromNow() + '</span>'+
                    '<h3 class="timeline-header">' + event[i].event_title + '</h3>' +
                    '<div class="timeline-body text-small">' +
                        event[i].event_message +
                    '</div>' +
                    '</div>' +
                    '</div>'
            }

            if (event[i].event_title == "Broken" || event[i].event_title == "Undo Broken"){
                if ( i  == 0 ||  moment(event[i - 1].created_at).format('LL') >  moment(event[i].created_at).format('LL') ) {
                    html += 
                '<div class="time-label">' +
                    '<span class="bg-green">' + moment(event[i].created_at).format('LL') + '</span>' +
                '</div>'
                }
                    if (event[i].event_title == "Undo Broken"){
                        html += 
                        '<div>' +
                        '<i class="fas fa-heart-broken bg-info"></i>'
                    }
                    else {
                        html += 
                        '<div>' +
                        '<i class="fas fa-heart-broken bg-warning"></i>'
                    }
                    html += 
                    '<div class="timeline-item">' +
                    '<span class="time"><i class="fas fa-clock"></i>  ' + moment(event[i].created_at).startOf('seconds').fromNow() + '</span>'+
                    '<h3 class="timeline-header">' + event[i].event_title + '</h3>' +
                    '<div class="timeline-body text-small">' +
                        event[i].event_message +
                    '</div>' +
                    '</div>' +
                    '</div>'
            }

            if (event[i].event_title == "Repair" || event[i].event_title == "Undo Repair"){
                if ( i  == 0 ||  moment(event[i - 1].created_at).format('LL') >  moment(event[i].created_at).format('LL') ) {
                    html += 
                '<div class="time-label">' +
                    '<span class="bg-green">' + moment(event[i].created_at).format('LL') + '</span>' +
                '</div>'
                }
                    if (event[i].event_title == "Undo Repair"){
                        html += 
                        '<div>' +
                        '<i class="fas fa-hammer bg-info"></i>'
                    }
                    else {
                        html += 
                        '<div>' +
                        '<i class="fas fa-hammer bg-info"></i>'
                    }
                    html += 
                    '<div class="timeline-item">' +
                    '<span class="time"><i class="fas fa-clock"></i>  ' + moment(event[i].created_at).startOf('seconds').fromNow() + '</span>'+
                    '<h3 class="timeline-header">' + event[i].event_title + '</h3>' +
                    '<div class="timeline-body text-small">' +
                        event[i].event_message +
                    '</div>' +
                    '</div>' +
                    '</div>'
            }

            if (event[i].event_title == "Maintenance Added" || event[i].event_title == "Maintenance Removed" || event[i].event_title == "Maintenance Updated" || event[i].event_title == "Maintenance Completed"){
                if ( i  == 0 ||  moment(event[i - 1].created_at).format('LL') >  moment(event[i].created_at).format('LL') ) {
                    html += 
                '<div class="time-label">' +
                    '<span class="bg-green">' + moment(event[i].created_at).format('LL') + '</span>' +
                '</div>'
                }
                    if (event[i].event_title == "Maintenance Removed"){
                        html += 
                        '<div>' +
                        '<i class="fas fa-tools bg-info"></i>'
                    }
                    else {
                        html += 
                        '<div>' +
                        '<i class="fas fa-tools bg-info"></i>'
                    }
                    html += 
                    '<div class="timeline-item">' +
                    '<span class="time"><i class="fas fa-clock"></i>  ' + moment(event[i].created_at).startOf('seconds').fromNow() + '</span>'+
                    '<h3 class="timeline-header">' + event[i].event_title + '</h3>' +
                    '<div class="timeline-body text-small">' +
                        event[i].event_message +
                    '</div>' +
                    '</div>' +
                    '</div>'
            }

            if (event[i].event_title == "Asset Checked-out" || event[i].event_title == "Asset Checked-in"){
                if ( i  == 0 ||  moment(event[i - 1].created_at).format('LL') >  moment(event[i].created_at).format('LL') ) {
                    html += 
                '<div class="time-label">' +
                    '<span class="bg-green">' + moment(event[i].created_at).format('LL') + '</span>' +
                '</div>'
                }
                    if (event[i].event_title == "Maintenance Removed"){
                        html += 
                        '<div>' +
                        '<i class="fas fa-thumbs-up bg-success"></i>'
                    }
                    else {
                        html += 
                        '<div>' +
                        '<i class="fas fa-thumbs-up bg-success"></i>'
                    }
                    html += 
                    '<div class="timeline-item">' +
                    '<span class="time"><i class="fas fa-clock"></i>  ' + moment(event[i].created_at).startOf('seconds').fromNow() + '</span>'+
                    '<h3 class="timeline-header">' + event[i].event_title + '</h3>' +
                    '<div class="timeline-body text-small">' +
                        event[i].event_message +
                    '</div>' +
                    '</div>' +
                    '</div>'
            }

        }
     $('.timeline').html(html);
        

    }
    })

}