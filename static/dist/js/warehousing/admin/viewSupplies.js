$(function()
{

});

generateQRCode = () =>
{
    $.ajax(
	{
		url: apiURL + "supplies/" + id,
		type: "GET",
		dataType: "json",
		success: function (data) 
		{


            console.log(data)
            var details = JSON.stringify(
                {
                    "created_at": data.created_at,
                    "supplier_id": data.supplier_id,
                    "supply_category": data.supply_category.supply_category_name,
                    "category_id": data.category_id,
                    "supply_description": data.supply_description,
                    "supply_expiration": data.supply_expiration,
                    "id": data.id,
                    "product_name": data.product_name,
                    "supply_quantity": data.supply_quantity,
                    "supply_reorder_interval": data.supply_reorder_interval,
                    "supply_status": data.supply_status,
                    "supply_supplier": data.supply_supplier.supplier_name,
                    "supply_unit_cost": data.supply_unit_cost,
                    "supply_unit_type": data.supply_unit_type,
                    "updated_at": data.updated_at
                });
            

            console.log(details)
            window.addEventListener("load", () => {
                var qrc = new QRCode(document.getElementById("qrcode"), details);
              });
        }
    });
}
// generateQRCode();

generateQRCode1 = () =>
{
    $.ajax(
	{
		url: apiURL + "supplies/" + id,
		type: "GET",
		dataType: "json",
		success: function (data) 
		{

            function generateQRcode(width, height, text) {
                $('#qrcode').qrcode({width: width,height: height,text: text});
             }
            
            function generate_qr(){
              $('#qrcode').html("")
            

              txt = JSON.stringify(
                {
                    "id": data.id,
                });
            //   txt = sessionStorage.getItem('USER_TYPE')
            
              var size = '200x200';
              var sizeSplit = size.split('x');
              var width = sizeSplit[0];
              var height = sizeSplit[1];
              generateQRcode(width, height, txt);
              
            }
            
            generate_qr()
            console.log(txt)
        }
    });
}
generateQRCode1();


