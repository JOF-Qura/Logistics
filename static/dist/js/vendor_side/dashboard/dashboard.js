

$(function () {
// total orders
$('#card-title').text(`${localStorage.getItem("VENDORNAME")} Vendor`)

$.ajax({
  url: apiURL + "purchase-order/count-orders/" + localStorage.getItem("ID"),
  type: "GET",
  dataType: "json",
  headers: {
    Accept: "application/json",
    Authorization: "Bearer " + localStorage.getItem("TOKEN"),
    ContentType: "application/x-www-form-urlencoded",
  },
  success: function (responseData) {
   
      $('#total_orders').text(responseData)
      // console.log(responseData)
    
  
    
    
  },
  error: function ({ responseJSON }) {
    
    console.log("error", "Error!", responseData.detail);
  },
});

// total request for quotation 

$.ajax({
  url: apiURL + "rfq-vendor/count/request-quotations/" + localStorage.getItem("ID"),
  type: "GET",
  dataType: "json",
  headers: {
    Accept: "application/json",
    Authorization: "Bearer " + localStorage.getItem("TOKEN"),
    ContentType: "application/x-www-form-urlencoded",
  },
  success: function (responseData) {
  
      $('#total_contracts').text(responseData)
    
   
  },
  error: function ({ responseJSON }) {
    
    console.log("error", "Error!", responseData.detail);
  },
});



// total proposal
$.ajax({
  url: apiURL + "vendor-proposal/count-proposals/" + localStorage.getItem("USERID"),
  type: "GET",
  dataType: "json",
  headers: {
    Accept: "application/json",
    Authorization: "Bearer " + localStorage.getItem("TOKEN"),
    ContentType: "application/x-www-form-urlencoded",
  },
  success: function (responseData) {
  
      $('#total_proposal').text(responseData)

 
  },
  error: function ({ responseJSON }) {
    
    console.log("error", "Error!", responseData.detail);
  },
});


// total sales

$.ajax({
  url: apiURL + "purchase-order/sum/total-orders/" + localStorage.getItem("ID"),
  type: "GET",
  dataType: "json",
  headers: {
    Accept: "application/json",
    Authorization: "Bearer " + localStorage.getItem("TOKEN"),
    ContentType: "application/x-www-form-urlencoded",
  },
  success: function (responseData) {

      $('#total_sales').text("\u20B1" + numberWithCommas(responseData))
    
  
  },
  error: function ({ responseJSON }) {
    
    console.log("error", "Error!", responseData.detail);
  },
});


// evaluation
  $.ajax({
    url: apiURL + "vendor-evaluation/charts/vendor-scores/" + localStorage.getItem("ID"),
    type: "GET",
    dataType: "json",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
    success: function (responseData) {
 
        console.log( Object.values(responseData));

        var marksCanvas = document.getElementById("vendor_radar_chart");

        var marksData = {
            labels: Object.keys(responseData),
            datasets: [{
              label: "Ratings",
              backgroundColor: "rgba(200,0,0,0.2)",
              data: Object.values(responseData)
            }]
          };
          
          var radarChart = new Chart(marksCanvas, {
            type: 'radar',
            data: marksData
          });
    
    },
    error: function ({ responseJSON }) {
      
      console.log("error", "Error!", responseData.detail);
    },
  });

 


  // monthly sales
  $.ajax({
    url: apiURL + "purchase-order/charts/po/vendor-monthly-sales/" + localStorage.getItem("ID"),
    type: "GET",
    dataType: "json",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("TOKEN"),
      ContentType: "application/x-www-form-urlencoded",
    },
    success: function (responseData) {
      if (responseData) {
        console.log(responseData)
        var areaChartData = {
          labels: Object.keys(responseData),
          datasets: [
            {
              // category
              label: "Sales Per Month",
              backgroundColor: "rgba(60,141,188,0.9)",
              borderColor: "rgba(60,141,188,0.8)",
              pointRadius: false,
              pointColor: "#3b8bba",
              pointStrokeColor: "rgba(60,141,188,1)",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(60,141,188,1)",
              // value
              data: Object.values(responseData),
            },
 
          ],
        };

      var barChartCanvas = $("#monthly_sales").get(0).getContext("2d");
      var barChartData = $.extend(true, {}, areaChartData);
      var temp0 = areaChartData.datasets[0];
      barChartData.datasets[0] = temp0;
  

      var barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        datasetFill: false,
      };

      new Chart(barChartCanvas, {
        type: "line",
        data: barChartData,
        options: barChartOptions,
      });
      } else {
        // notification("error", "Error!", responseData.message);
        console.log("error", "Error!", responseData.success);
      }
    },
    error: function ({ responseJSON }) {},
  });


   


   
  
  });


  
