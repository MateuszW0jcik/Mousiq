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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9999821364773134, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "GET /api/addresses"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/zowie-ec2-cw"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/contacts"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/cart"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/glorious-model-o-wireless"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/lenovo-legion-m600-wireless"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/lenovo-go-wireless-multi-device-mouse"], "isController": false}, {"data": [1.0, 500, 1500, "POST /api/auth/login"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/cart (refresh)"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/orders"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/corsair-m65-rgb-ultra"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/shipping-methods/all"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/logitech-g502-hero"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/zowie-s2-c"], "isController": false}, {"data": [1.0, 500, 1500, "POST /api/cart (item 2)"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products?page=1"], "isController": false}, {"data": [0.999822316986496, 500, 1500, "POST /api/cart (item 1)"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/logitech-g-pro-x-superlight"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products?page=0"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/payment-methods"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/corsair-dark-core-rgb-se"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/steelseries-aerox-3"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/razer-basilisk-v3-pro"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/corsair-katar-elite-wireless"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 27990, 0, 0.0, 20.977277599142624, 4, 815, 11.0, 71.0, 72.0, 76.0, 31.125246032893347, 58.50123246668131, 10.55023710203832], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET /api/addresses", 1124, 0, 0.0, 11.749110320284695, 8, 65, 10.0, 16.0, 21.0, 31.75, 1.2592158580536599, 0.6640396126454848, 0.5383232690823296], "isController": false}, {"data": ["GET /api/products/slug/zowie-ec2-cw", 202, 0, 0.0, 7.301980198019805, 5, 23, 7.0, 9.0, 11.0, 16.97, 0.23351035421902347, 0.43857134254292773, 0.046519640879571084], "isController": false}, {"data": ["GET /api/contacts", 1124, 0, 0.0, 11.443060498220653, 7, 90, 10.0, 16.0, 20.0, 30.75, 1.2592976838557812, 0.6207733981206887, 0.5371284672700241], "isController": false}, {"data": ["GET /api/cart", 2794, 0, 0.0, 28.393700787401613, 10, 165, 26.0, 42.0, 52.0, 83.10000000000036, 3.1278021760278705, 9.364710049295908, 1.3309778583314955], "isController": false}, {"data": ["GET /api/products/slug/glorious-model-o-wireless", 180, 0, 0.0, 7.477777777777775, 5, 32, 7.0, 9.0, 10.949999999999989, 29.569999999999993, 0.2059649745118344, 0.3739775054780962, 0.043646874481511784], "isController": false}, {"data": ["GET /api/products/slug/lenovo-legion-m600-wireless", 173, 0, 0.0, 7.242774566473989, 5, 15, 7.0, 9.599999999999994, 10.0, 14.259999999999991, 0.19933792156225622, 0.3564479624322913, 0.04263184064661534], "isController": false}, {"data": ["GET /api/products/slug/lenovo-go-wireless-multi-device-mouse", 165, 0, 0.0, 7.260606060606058, 5, 16, 7.0, 9.0, 10.699999999999989, 14.02000000000001, 0.19100272960264486, 0.3583709062471784, 0.04271447761621648], "isController": false}, {"data": ["POST /api/auth/login", 3369, 0, 0.0, 74.53873552983077, 69, 292, 73.0, 80.0, 84.0, 97.0, 3.7463720573353942, 2.5681811705605657, 0.9815556993450243], "isController": false}, {"data": ["GET /api/cart (refresh)", 1648, 0, 0.0, 29.436286407767014, 11, 114, 29.0, 43.0, 52.0, 77.0, 1.8821057199796714, 5.738957404224459, 0.8045784694900155], "isController": false}, {"data": ["GET /api/orders", 545, 0, 0.0, 18.911926605504583, 12, 441, 17.0, 25.0, 29.0, 40.0, 0.6256723107283859, 0.29931549870675256, 0.2656528754234768], "isController": false}, {"data": ["GET /api/products/slug/corsair-m65-rgb-ultra", 204, 0, 0.0, 7.504901960784309, 5, 23, 7.0, 10.0, 11.0, 17.799999999999955, 0.235367143900472, 0.41220122289960787, 0.0489582047371099], "isController": false}, {"data": ["GET /api/shipping-methods/all", 1116, 0, 0.0, 6.46057347670251, 4, 37, 6.0, 8.0, 10.0, 14.829999999999927, 1.2599520405352311, 0.9917200631556605, 0.23747142951494102], "isController": false}, {"data": ["GET /api/products/slug/logitech-g502-hero", 189, 0, 0.0, 7.534391534391535, 5, 28, 7.0, 9.0, 12.5, 21.69999999999996, 0.2170388097545739, 0.4036036373235555, 0.04450991215669972], "isController": false}, {"data": ["GET /api/products/slug/zowie-s2-c", 171, 0, 0.0, 7.099415204678362, 5, 14, 7.0, 8.0, 10.0, 12.560000000000002, 0.19578097718750895, 0.34572274737384434, 0.038620856828004695], "isController": false}, {"data": ["POST /api/cart (item 2)", 2807, 0, 0.0, 14.016743854649091, 9, 60, 12.0, 19.0, 24.0, 37.0, 3.128814182768672, 1.3555403094678118, 1.6308483264968316], "isController": false}, {"data": ["GET /api/products?page=1", 2239, 0, 0.0, 6.420276909334527, 4, 26, 6.0, 8.0, 10.0, 14.0, 2.509718292808688, 7.928159559067493, 0.4926302508345178], "isController": false}, {"data": ["POST /api/cart (item 1)", 2814, 0, 0.0, 14.491115849324807, 9, 815, 13.0, 19.0, 24.0, 39.0, 3.131851621017017, 1.3567981209864108, 1.6324476164010417], "isController": false}, {"data": ["GET /api/products/slug/logitech-g-pro-x-superlight", 198, 0, 0.0, 7.303030303030304, 5, 15, 7.0, 9.0, 10.049999999999983, 14.009999999999991, 0.22500920492201953, 0.4158095796390534, 0.04812208581828347], "isController": false}, {"data": ["GET /api/products?page=0", 5066, 0, 0.0, 7.327279905250711, 5, 31, 7.0, 9.0, 12.0, 17.329999999999927, 5.637790333404187, 22.574475053111637, 1.1005016757708561], "isController": false}, {"data": ["GET /api/payment-methods", 1124, 0, 0.0, 14.81939501779359, 10, 332, 13.0, 20.0, 25.0, 32.75, 1.2593259021154208, 0.8633280309391949, 0.5457491763683685], "isController": false}, {"data": ["GET /api/products/slug/corsair-dark-core-rgb-se", 192, 0, 0.0, 7.281249999999997, 5, 18, 7.0, 9.0, 11.0, 17.069999999999993, 0.21810077391696495, 0.3968684630114719, 0.046005631998109794], "isController": false}, {"data": ["GET /api/products/slug/steelseries-aerox-3", 206, 0, 0.0, 7.388349514563104, 5, 17, 7.0, 9.0, 11.0, 16.930000000000007, 0.23509299297345845, 0.4303087560584948, 0.04844201320058568], "isController": false}, {"data": ["GET /api/products/slug/razer-basilisk-v3-pro", 175, 0, 0.0, 7.457142857142857, 5, 25, 7.0, 10.0, 11.0, 15.88000000000011, 0.1984363217843394, 0.3820209251101322, 0.041276305214906536], "isController": false}, {"data": ["GET /api/products/slug/corsair-katar-elite-wireless", 165, 0, 0.0, 7.3818181818181845, 5, 18, 7.0, 9.400000000000006, 11.0, 17.340000000000003, 0.19017257296575857, 0.3386064532037163, 0.04085738872311219], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 27990, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
