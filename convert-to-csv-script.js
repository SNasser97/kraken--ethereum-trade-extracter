/// More elegant way

var csvArray = [
	["ID", "Type", "Date", "Price (GBP)", "Volume (ETH)", "Cost (GBP)", "Fee (GBP)"]
];

var counter = 0;
var x = setInterval(() => {
	counter++;
  	readTradeData(counter);
	
}, 2500);

function readTradeData(counter, className="DataTable_row__jzOWT") {
	var a = document.getElementsByClassName(className);
	var arr = Array.from(a).map(e => [...e.children]);
	var y = setTimeout(() => {
		arr[counter][0].children[0].firstChild.click();
	}, 2500);
	
	// use regex to remove GBP/ETH values
	var formatValue = (string, pattern="[a-zA-Z]", flag="g") => {
			var regex = new RegExp(pattern, flag);
			return string.replace(regex, "").trim();
	};
	var formatFiat = (string, pattern) => {
		return formatValue(string, pattern).replace(/,/g, ".");
	};

	// elements that contain our data
	var orderId= document.querySelector("[data-testid='trade-details-order']").textContent;
	var order= document.querySelector("[data-testid='trade-details-order-type']").textContent;
	var date= document.querySelector("[data-testid='trade-details-executed']").textContent;
	var tradePrice= document.querySelector("[data-testid='trade-details-average-price']").textContent
	var volume=document.querySelector("[data-testid='trade-details-volume']").textContent;
	var cost = document.querySelector("[data-testid='trade-details-cost']").textContent;
  	var fee = document.querySelector("[data-testid='trade-details-fee']").textContent;

    // Add to csv array (uniques only)
    csvArray.push([
	  	orderId,
	  	order,
	  	date,
	  	formatFiat(tradePrice, "[a-zA-Z]"),
	  	formatValue(volume, "[a-zA-Z]"),
	  	formatValue(cost, "[a-zA-Z]"),
	  	formatValue(fee, "[a-zA-Z]")
	]);

	console.log(csvArray);

	// We stop the interval - since we have the data we need
	if (counter >= arr.length-1) {
		console.warn("DONE");
    	clearTimeout(y);
    	clearInterval(x);
		x = 0;
		y = 0;

		// Build csv file from csv array
    	var csv = "";
		csvArray.forEach(row => {
			csv+=row.join(',');
			csv+="\n";
		});

		// create blob for csv data
		var csvFile = new Blob([csv], {type: "text/csv"});
		var tmp_link = document.createElement('a');
		tmp_link.download = `kraken_transactions_${new Date().toLocaleString().replace(/\//g, '-').replace(", ", "-").replace(/:/g, "-")}.csv`;

		var url = window.URL.createObjectURL(csvFile);
		tmp_link.href = url;

		tmp_link.style.display = "none";
		document.body.appendChild(tmp_link);
		tmp_link.click();
		document.body.removeChild(tmp_link);
	}
}