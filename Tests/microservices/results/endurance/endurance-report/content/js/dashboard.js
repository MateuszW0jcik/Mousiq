/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9999945382052543, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "GET /api/addresses"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/zowie-ec2-cw"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/contacts"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/cart"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/glorious-model-o-wireless"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/lenovo-legion-m600-wireless"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/lenovo-go-wireless-multi-device-mouse"], "isController": false}, {"data": [1.0, 500, 1500, "POST /api/auth/login"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/cart (refresh)"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/corsair-m65-rgb-ultra"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/orders"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/shipping-methods/all"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/logitech-g502-hero"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/zowie-s2-c"], "isController": false}, {"data": [1.0, 500, 1500, "POST /api/cart (item 2)"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products?page=1"], "isController": false}, {"data": [0.9999454624781849, 500, 1500, "POST /api/cart (item 1)"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/logitech-g-pro-x-superlight"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products?page=0"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/payment-methods"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/steelseries-aerox-3"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/corsair-dark-core-rgb-se"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/corsair-katar-elite-wireless"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/razer-basilisk-v3-pro"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 91545, 0, 0.0, 20.189699055109113, 4, 661, 10.0, 69.0, 70.0, 76.0, 25.435610354623172, 50.19373137028047, 8.623393089009632], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET /api/addresses", 3667, 0, 0.0, 9.907826561221714, 7, 75, 9.0, 13.0, 16.0, 27.0, 1.0206862229070712, 0.5382525003611509, 0.4363398483785507], "isController": false}, {"data": ["GET /api/products/slug/zowie-ec2-cw", 612, 0, 0.0, 6.727124183006535, 5, 14, 7.0, 8.0, 9.0, 12.0, 0.17184817943420952, 0.3227591077253619, 0.03423537949665893], "isController": false}, {"data": ["GET /api/contacts", 3667, 0, 0.0, 9.83719661848921, 7, 72, 9.0, 13.0, 16.0, 28.320000000000164, 1.0207055421777966, 0.5031551134404123, 0.43535132454428016], "isController": false}, {"data": ["GET /api/cart", 9153, 0, 0.0, 29.427947121162465, 10, 153, 29.0, 37.0, 46.0, 68.0, 2.5473675949126124, 9.160902581714476, 1.0840087515491408], "isController": false}, {"data": ["GET /api/products/slug/glorious-model-o-wireless", 580, 0, 0.0, 6.893103448275863, 5, 26, 7.0, 8.0, 9.0, 16.18999999999994, 0.16256343477478516, 0.2951796915421888, 0.0344494778770785], "isController": false}, {"data": ["GET /api/products/slug/lenovo-legion-m600-wireless", 641, 0, 0.0, 6.826833073322937, 4, 28, 7.0, 8.0, 9.0, 14.0, 0.1804544467945125, 0.3227103966711081, 0.03859328500781078], "isController": false}, {"data": ["GET /api/products/slug/lenovo-go-wireless-multi-device-mouse", 654, 0, 0.0, 6.787461773700308, 5, 22, 7.0, 8.0, 9.0, 13.0, 0.18312736171994112, 0.3435902185767868, 0.04095328694713528], "isController": false}, {"data": ["POST /api/auth/login", 10995, 0, 0.0, 73.07366984993178, 67, 376, 71.0, 78.0, 83.0, 111.0, 3.055169780744678, 2.0942854427307798, 0.8004513456744686], "isController": false}, {"data": ["GET /api/cart (refresh)", 5464, 0, 0.0, 30.64732796486095, 11, 118, 31.0, 39.0, 47.0, 69.0, 1.5280859911933697, 5.512871966690578, 0.6532524897992429], "isController": false}, {"data": ["GET /api/products/slug/corsair-m65-rgb-ultra", 625, 0, 0.0, 6.9552000000000005, 4, 18, 7.0, 8.0, 10.0, 14.740000000000009, 0.1753138468486284, 0.30700276040417557, 0.03646664978394322], "isController": false}, {"data": ["GET /api/orders", 1820, 0, 0.0, 15.078021978021987, 10, 465, 13.0, 21.0, 25.0, 39.0, 0.5100862550251904, 0.2440322404291563, 0.21658001608523375], "isController": false}, {"data": ["GET /api/shipping-methods/all", 3659, 0, 0.0, 6.082262913364308, 4, 39, 6.0, 7.0, 9.0, 16.0, 1.0199334409108989, 0.8028005342838682, 0.1922335489216831], "isController": false}, {"data": ["GET /api/products/slug/logitech-g502-hero", 613, 0, 0.0, 6.965742251223492, 4, 36, 7.0, 8.0, 10.0, 13.860000000000014, 0.17187579296284988, 0.3196234459505306, 0.03524796535370945], "isController": false}, {"data": ["GET /api/products/slug/zowie-s2-c", 615, 0, 0.0, 6.874796747967483, 4, 27, 7.0, 8.0, 10.0, 13.0, 0.17221825513504432, 0.3041108685645678, 0.03397274173562397], "isController": false}, {"data": ["POST /api/cart (item 2)", 9161, 0, 0.0, 12.584870647309286, 8, 76, 11.0, 17.0, 20.0, 33.0, 2.546378075298409, 1.103122663845434, 1.3272859018357492], "isController": false}, {"data": ["GET /api/products?page=1", 7319, 0, 0.0, 6.2000273261374605, 4, 53, 6.0, 8.0, 9.0, 15.0, 2.038082826527657, 6.438490931711416, 0.40005336731646396], "isController": false}, {"data": ["POST /api/cart (item 1)", 9168, 0, 0.0, 12.78795811518327, 8, 661, 11.0, 17.0, 21.0, 35.0, 2.547982416475619, 1.103803227399232, 1.3281261507678548], "isController": false}, {"data": ["GET /api/products/slug/logitech-g-pro-x-superlight", 634, 0, 0.0, 6.884858044164042, 4, 20, 7.0, 8.0, 9.25, 16.299999999999955, 0.1774977133871071, 0.3279965901856363, 0.037960936749781696], "isController": false}, {"data": ["GET /api/products?page=0", 16498, 0, 0.0, 6.917686992362723, 4, 55, 6.0, 8.0, 10.0, 17.0, 4.5853468457188375, 18.36013079454864, 0.8950742441146886], "isController": false}, {"data": ["GET /api/payment-methods", 3667, 0, 0.0, 11.955276793018829, 8, 327, 10.0, 16.0, 20.0, 31.320000000000164, 1.020711792686671, 0.6997397995624884, 0.4423315125316241], "isController": false}, {"data": ["GET /api/products/slug/steelseries-aerox-3", 570, 0, 0.0, 6.936842105263154, 4, 29, 7.0, 9.0, 10.0, 13.289999999999964, 0.16043232289115933, 0.29364408959934135, 0.03305783215823693], "isController": false}, {"data": ["GET /api/products/slug/corsair-dark-core-rgb-se", 603, 0, 0.0, 6.767827529021552, 4, 18, 7.0, 8.0, 9.0, 12.0, 0.16936204155689497, 0.3081590883238494, 0.035724805640907534], "isController": false}, {"data": ["GET /api/products/slug/corsair-katar-elite-wireless", 572, 0, 0.0, 6.743006993006991, 4, 17, 7.0, 8.0, 9.0, 12.0, 0.16059778313290898, 0.2859499177252222, 0.03450342996996091], "isController": false}, {"data": ["GET /api/products/slug/razer-basilisk-v3-pro", 588, 0, 0.0, 6.802721088435371, 4, 19, 7.0, 8.0, 9.549999999999955, 12.0, 0.1656983084682544, 0.3189888927358482, 0.034466542679431826], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 91545, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
