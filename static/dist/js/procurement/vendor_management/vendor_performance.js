var token = localStorage.getItem("TOKEN");
var user_id = localStorage.getItem("ID");



$(function () {
  // load datatable
  $(".select2").select2();

  loadEval("");
  



});


loadEval = (category_id) =>{

  if( category_id !=""){
    filteredURL = apiURL + "vendor-evaluation/charts/ratings/"+category_id
   }


   else{
    filteredURL = apiURL + "vendor-evaluation/charts/ratings/none" 
     
   }



  $.ajax({
    url: filteredURL,
    type: "GET",
    dataType: "json",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
    },
    success: function (data) {
      if (data) {

        let bg_cost, bg_timeliness, bg_quality,bg_reliability,bg_availability,bg_reputation
        function getEval(key, score) {
          if(key == "cost"){
            return (score > 60) ? (bg_cost ='primary') : ((score <= 60 && score >= 30) ? (bg_cost ='warning') : (bg_cost= 'danger'));
          }
          else if(key == "availability"){
            return (score > 60) ? (bg_availability ='primary') : ((score <= 60 && score >= 30) ? (bg_availability ='warning') : (bg_availability= 'danger'));
          }
          else if(key == "timeliness"){
            return (score > 60) ? (bg_timeliness ='primary') : ((score <= 60 && score >= 30) ? (bg_timeliness ='warning') : (bg_timeliness= 'danger'));

          }
          else if(key == "quality"){
            return (score > 60) ? (bg_quality ='primary') : ((score <= 60 && score >= 30) ? (bg_quality ='warning') : (bg_quality= 'danger'));
          }
          else if(key == "reliability"){
            return (score > 60) ? (bg_reliability ='primary') : ((score <= 60 && score >= 30) ? (bg_reliability ='warning') : (bg_reliability= 'danger'));
            
          }
          else if(key == "reputation"){
            return (score > 60) ? (bg_reputation ='primary') : ((score <= 60 && score >= 30) ? (bg_reputation ='warning') : (bg_reputation= 'danger'));
            
          }

        }

        $("#vendor_rating_body").empty();
        let vendor_rating_body = ''
        
        
        for(let i in data){
          if(data[i] != 0){
   
              getEval("cost",data[i][0].eval_data.cost)
              getEval("availability",data[i][0].eval_data.availability)
              getEval("timeliness",data[i][0].eval_data.timeliness)
              getEval("quality",data[i][0].eval_data.quality)
              getEval("reliability",data[i][0].eval_data.reliability)
              getEval("reputation",data[i][0].eval_data.reputation)


    

            vendor_rating_body += ' <div class="col-md-4">' + '<div class="card">' 
            + '<div class="card-header">' + '<h3 class="card-title">'+data[i][0].vendor_name+' - '+data[i][0].category+'</h3>'+'</div>'+
            '<div class="card-body">' + '<label>Cost</label>' + 
            
            '<div class="progress mb-3">' + 
            '<div class="progress-bar bg-'+bg_cost+'" role="progressbar" aria-valuenow="'+data[i][0].eval_data.cost+'" aria-valuemin="0" aria-valuemax="100" style="width: '+data[i][0].eval_data.cost+'%">'
            + ''+data[i][0].eval_data.cost+'%</div>'+ '</div>' + 
            
            '<label>Timeliness</label>' + '<div class="progress mb-3">' + 
            '<div class="progress-bar bg-'+bg_timeliness+'" role="progressbar" aria-valuenow="'+data[i][0].eval_data.timeliness+'" aria-valuemin="0" aria-valuemax="100" style="width: '+data[i][0].eval_data.timeliness+'%">'
            + ''+data[i][0].eval_data.timeliness+'%</div>'+ '</div>' + 
            
            '<label>Reliability</label>' + '<div class="progress mb-3">' + 
            '<div class="progress-bar bg-'+bg_reliability+'" role="progressbar" aria-valuenow="'+data[i][0].eval_data.reliability+'" aria-valuemin="0" aria-valuemax="100" style="width: '+data[i][0].eval_data.reliability+'%">'
            + ''+data[i][0].eval_data.reliability+'%</div>'+ '</div>' + 
            
            '<label>Quality</label>' + '<div class="progress mb-3">' + 
            '<div class="progress-bar bg-'+bg_quality+'" role="progressbar" aria-valuenow="'+data[i][0].eval_data.quality+'" aria-valuemin="0" aria-valuemax="100" style="width: '+data[i][0].eval_data.quality+'%">'
            + ''+data[i][0].eval_data.quality+'%</div>'+ '</div>' +
            
            '<label>Availability</label>' + '<div class="progress mb-3">' + 
            '<div class="progress-bar bg-'+bg_availability+'" role="progressbar" aria-valuenow="'+data[i][0].eval_data.availability+'" aria-valuemin="0" aria-valuemax="100" style="width: '+data[i][0].eval_data.availability+'%">'
            + ''+data[i][0].eval_data.availability+'%</div>'+ '</div>' +
             
            '<label>Reputation</label>' + '<div class="progress mb-3">' + 
            '<div class="progress-bar bg-'+bg_reputation+'" role="progressbar" aria-valuenow="'+data[i][0].eval_data.reputation+'" aria-valuemin="0" aria-valuemax="100" style="width: '+data[i][0].eval_data.reputation+'%">'
            + ''+data[i][0].eval_data.reputation+'%</div>'+ '</div>' + '</div>' + '</div>' +'</div>'


          }
       
        }
        // vendor_rating_body+= '</div>'
        $("#vendor_rating_body").append(vendor_rating_body);

      } else {
        notification("error", "Error!", data.detail);

        console.log("error" + data);
        loadTable();
      }
    },
    complete: function (data) {
      
     },
    error: function ({ responseJSON }) {},
  });
}





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

        var options = "";
         options += "<option value=''>All Category</option>";

        $.each(responseData, function (i, dataOptions) {
          options +=
            "<option value='" +
            dataOptions.id +
            "'>" +
            dataOptions.category_name +
            "</option>";

          });
          $("#category_id").append(options);
      } else {
        // notification("error", "Error!", responseData.message);
        console.log("error", "Error!", responseData.success);
      }
    },
    error: function ({ responseJSON }) {},
  });
};

loadCategory();


$("[name=category_id]").on("change", function () {
 category_id = $(this).val();
 loadEval(category_id)
 

});
