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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9999845926291138, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "GET /api/addresses"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/zowie-ec2-cw"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/contacts"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/cart"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/glorious-model-o-wireless"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/lenovo-legion-m600-wireless"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/lenovo-go-wireless-multi-device-mouse"], "isController": false}, {"data": [1.0, 500, 1500, "POST /api/auth/login"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/cart (refresh)"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/orders"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/corsair-m65-rgb-ultra"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/shipping-methods/all"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/logitech-g502-hero"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/zowie-s2-c"], "isController": false}, {"data": [1.0, 500, 1500, "POST /api/cart (item 2)"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products?page=1"], "isController": false}, {"data": [0.9998477929984779, 500, 1500, "POST /api/cart (item 1)"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/logitech-g-pro-x-superlight"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products?page=0"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/payment-methods"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/corsair-dark-core-rgb-se"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/steelseries-aerox-3"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/corsair-katar-elite-wireless"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/razer-basilisk-v3-pro"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 32452, 0, 0.0, 22.84232096635025, 4, 784, 12.0, 72.0, 75.0, 81.0, 54.20492374196372, 103.69882415866448, 18.37756442284083], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET /api/addresses", 1320, 0, 0.0, 13.118181818181814, 8, 84, 12.0, 19.0, 23.0, 34.57999999999993, 2.228487498522783, 1.1751789542991238, 0.9527143468379112], "isController": false}, {"data": ["GET /api/products/slug/zowie-ec2-cw", 221, 0, 0.0, 7.755656108597291, 5, 17, 7.0, 11.0, 12.0, 15.780000000000001, 0.3988795275533704, 0.7491787492419484, 0.07946428087977302], "isController": false}, {"data": ["GET /api/contacts", 1320, 0, 0.0, 12.961363636363616, 7, 54, 11.0, 20.0, 23.0, 32.789999999999964, 2.2287772286505936, 1.0986960888125512, 0.9506616708779861], "isController": false}, {"data": ["GET /api/cart", 3238, 0, 0.0, 32.77764051883877, 9, 127, 32.0, 51.0, 62.0, 86.0, 5.46284908331098, 17.55738545921337, 2.3245123789290587], "isController": false}, {"data": ["GET /api/products/slug/glorious-model-o-wireless", 200, 0, 0.0, 7.624999999999997, 5, 27, 7.0, 10.0, 12.0, 18.970000000000027, 0.3518141295590714, 0.6387779895625544, 0.07455436143976414], "isController": false}, {"data": ["GET /api/products/slug/lenovo-legion-m600-wireless", 198, 0, 0.0, 7.560606060606062, 5, 19, 7.0, 10.0, 12.0, 18.00999999999999, 0.34884335523881677, 0.6238823358410119, 0.07460614726298913], "isController": false}, {"data": ["GET /api/products/slug/lenovo-go-wireless-multi-device-mouse", 200, 0, 0.0, 7.890000000000009, 5, 76, 7.0, 10.0, 11.0, 21.0, 0.3461243590209526, 0.6494394894579173, 0.07740476388261538], "isController": false}, {"data": ["POST /api/auth/login", 3929, 0, 0.0, 77.91804530414866, 68, 293, 76.0, 85.0, 89.0, 114.0, 6.562650849937614, 4.498174520015334, 1.7195734762381596], "isController": false}, {"data": ["GET /api/cart (refresh)", 1842, 0, 0.0, 33.91856677524437, 12, 101, 34.0, 51.0, 60.0, 78.56999999999994, 3.1936972160045496, 10.600103964207012, 1.3652921498246242], "isController": false}, {"data": ["GET /api/orders", 602, 0, 0.0, 20.649501661129555, 12, 419, 18.0, 29.0, 33.0, 48.88000000000011, 1.0636700149302518, 0.5088671146846536, 0.451625970135079], "isController": false}, {"data": ["GET /api/products/slug/corsair-m65-rgb-ultra", 242, 0, 0.0, 7.933884297520661, 5, 86, 7.0, 11.0, 12.0, 18.279999999999973, 0.42847404810594997, 0.7503569464363177, 0.08912594945953842], "isController": false}, {"data": ["GET /api/shipping-methods/all", 1296, 0, 0.0, 6.829475308641976, 4, 48, 6.0, 9.0, 11.0, 19.0, 2.2121703507723818, 1.7412366913459076, 0.4169422633779978], "isController": false}, {"data": ["GET /api/products/slug/logitech-g502-hero", 184, 0, 0.0, 7.608695652173912, 5, 27, 7.0, 10.0, 12.0, 15.950000000000074, 0.34526045585638665, 0.6420071412856448, 0.07080536692367304], "isController": false}, {"data": ["GET /api/products/slug/zowie-s2-c", 243, 0, 0.0, 7.658436213991773, 5, 20, 7.0, 10.0, 11.0, 16.24000000000001, 0.4294166295565876, 0.7582836516627083, 0.08470913981487371], "isController": false}, {"data": ["POST /api/cart (item 2)", 3273, 0, 0.0, 15.405132905591229, 8, 99, 14.0, 22.0, 27.0, 39.0, 5.481411266619663, 2.3751797593697295, 2.8570458215124876], "isController": false}, {"data": ["GET /api/products?page=1", 2582, 0, 0.0, 6.929124709527489, 4, 60, 6.0, 9.0, 11.0, 17.170000000000073, 4.361670678660417, 13.778631646184381, 0.8561482484479919], "isController": false}, {"data": ["POST /api/cart (item 1)", 3285, 0, 0.0, 15.867275494672745, 9, 784, 14.0, 22.0, 27.0, 40.0, 5.494386025359477, 2.3806507058028075, 2.8638464669299846], "isController": false}, {"data": ["GET /api/products/slug/logitech-g-pro-x-superlight", 185, 0, 0.0, 7.524324324324321, 5, 19, 7.0, 9.400000000000006, 10.0, 18.139999999999986, 0.3352080826822445, 0.619436012967117, 0.07169000987051909], "isController": false}, {"data": ["GET /api/products?page=0", 5917, 0, 0.0, 8.26094304546218, 4, 81, 7.0, 11.0, 14.0, 21.0, 9.895873402394276, 39.62408313277897, 1.931598768074979], "isController": false}, {"data": ["GET /api/payment-methods", 1320, 0, 0.0, 16.746969696969714, 9, 347, 15.0, 24.0, 28.0, 38.0, 2.22887131307537, 1.527987518637248, 0.9659382265993841], "isController": false}, {"data": ["GET /api/products/slug/corsair-dark-core-rgb-se", 206, 0, 0.0, 7.733009708737866, 5, 22, 7.0, 10.300000000000011, 12.0, 15.0, 0.3622264618739065, 0.6591077810552043, 0.07640714430152715], "isController": false}, {"data": ["GET /api/products/slug/steelseries-aerox-3", 211, 0, 0.0, 7.511848341232223, 5, 17, 7.0, 10.0, 11.0, 16.639999999999986, 0.3686143245972321, 0.6747721464490736, 0.07595470946290622], "isController": false}, {"data": ["GET /api/products/slug/corsair-katar-elite-wireless", 201, 0, 0.0, 7.601990049751246, 5, 27, 7.0, 10.0, 11.0, 23.839999999999918, 0.3456988017494767, 0.6155206937710579, 0.07427122693836413], "isController": false}, {"data": ["GET /api/products/slug/razer-basilisk-v3-pro", 237, 0, 0.0, 7.616033755274267, 4, 16, 7.0, 10.0, 12.0, 14.240000000000009, 0.417953298568554, 0.8045972989106762, 0.08693755136240432], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 32452, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
