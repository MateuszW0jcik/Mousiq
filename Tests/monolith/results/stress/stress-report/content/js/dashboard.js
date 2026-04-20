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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "GET /api/addresses"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/zowie-ec2-cw"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/contacts"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/cart"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/lenovo-legion-m600-wireless"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/glorious-model-o-wireless"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/lenovo-go-wireless-multi-device-mouse"], "isController": false}, {"data": [1.0, 500, 1500, "POST /api/auth/login"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/cart (refresh)"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/orders"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/corsair-m65-rgb-ultra"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/shipping-methods/all"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/logitech-g502-hero"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/zowie-s2-c"], "isController": false}, {"data": [1.0, 500, 1500, "POST /api/cart (item 2)"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products?page=1"], "isController": false}, {"data": [1.0, 500, 1500, "POST /api/cart (item 1)"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/logitech-g-pro-x-superlight"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products?page=0"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/payment-methods"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/corsair-dark-core-rgb-se"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/steelseries-aerox-3"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/corsair-katar-elite-wireless"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/razer-basilisk-v3-pro"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 120798, 0, 0.0, 15.985479892051057, 2, 334, 8.0, 69.0, 72.0, 81.0, 134.27296322438295, 271.9605708623263, 39.821812093242336], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET /api/addresses", 4854, 0, 0.0, 7.691594561186636, 5, 61, 7.0, 9.0, 14.0, 27.0, 5.425985709558857, 2.850762023186196, 1.858761568924774], "isController": false}, {"data": ["GET /api/products/slug/zowie-ec2-cw", 773, 0, 0.0, 5.244501940491585, 3, 31, 5.0, 6.0, 8.0, 18.25999999999999, 0.8843513288722976, 1.7004763345210487, 0.17617936629877803], "isController": false}, {"data": ["GET /api/contacts", 4854, 0, 0.0, 7.682117840955889, 5, 77, 7.0, 9.0, 14.0, 27.0, 5.425876535040163, 2.6641277175492566, 1.8534254618254822], "isController": false}, {"data": ["GET /api/cart", 12055, 0, 0.0, 11.002239734550002, 5, 86, 10.0, 14.0, 20.0, 37.0, 13.468596551011402, 52.17780273093811, 4.587281357012776], "isController": false}, {"data": ["GET /api/products/slug/lenovo-legion-m600-wireless", 787, 0, 0.0, 5.168996188055909, 3, 28, 5.0, 6.0, 8.0, 13.0, 0.8990247808698494, 1.6479194469655343, 0.19227190137743846], "isController": false}, {"data": ["GET /api/products/slug/glorious-model-o-wireless", 786, 0, 0.0, 5.305343511450384, 3, 29, 5.0, 7.0, 8.0, 17.129999999999995, 0.912212858951698, 1.6970366174833835, 0.1933107328051938], "isController": false}, {"data": ["GET /api/products/slug/lenovo-go-wireless-multi-device-mouse", 792, 0, 0.0, 5.122474747474749, 3, 20, 5.0, 6.0, 8.0, 12.069999999999936, 0.8980202734879924, 1.7250057401864072, 0.2008267994421389], "isController": false}, {"data": ["POST /api/auth/login", 14556, 0, 0.0, 74.69339104149444, 66, 334, 71.0, 78.0, 93.0, 160.0, 16.180128987508088, 10.023225596764531, 4.239233820218381], "isController": false}, {"data": ["GET /api/cart (refresh)", 7080, 0, 0.0, 12.035593220338967, 6, 73, 11.0, 14.0, 20.0, 35.0, 8.093463499394135, 31.737196155747732, 2.772416930899769], "isController": false}, {"data": ["GET /api/orders", 2349, 0, 0.0, 8.210302256279274, 5, 58, 7.0, 10.0, 14.0, 30.0, 2.7005928887836297, 1.2843640008179957, 0.9172081438999826], "isController": false}, {"data": ["GET /api/products/slug/corsair-m65-rgb-ultra", 790, 0, 0.0, 5.196202531645566, 3, 35, 5.0, 6.0, 8.0, 16.090000000000032, 0.9097577856265179, 1.6338325857101235, 0.18923672689301593], "isController": false}, {"data": ["GET /api/shipping-methods/all", 4808, 0, 0.0, 4.34754575707155, 3, 49, 4.0, 5.0, 7.0, 15.0, 5.407016300894609, 4.245352642499283, 1.0190958457740815], "isController": false}, {"data": ["GET /api/products/slug/logitech-g502-hero", 770, 0, 0.0, 5.17142857142857, 3, 40, 5.0, 6.0, 8.0, 12.579999999999927, 0.8905667011327546, 1.6959033859461634, 0.18263574925574066], "isController": false}, {"data": ["GET /api/products/slug/zowie-s2-c", 827, 0, 0.0, 5.249093107617891, 3, 40, 5.0, 6.0, 8.0, 14.440000000000055, 0.9399297382630962, 1.6990331499267493, 0.1854158272745561], "isController": false}, {"data": ["POST /api/cart (item 2)", 12129, 0, 0.0, 10.337703025805835, 6, 87, 9.0, 13.0, 18.0, 34.70000000000073, 13.492677977867068, 6.131295986862743, 5.886774049997664], "isController": false}, {"data": ["GET /api/products?page=1", 9652, 0, 0.0, 4.832677165354321, 2, 62, 4.0, 6.0, 8.0, 15.0, 10.811428392208871, 34.61979853325477, 2.1221651433925617], "isController": false}, {"data": ["POST /api/cart (item 1)", 12155, 0, 0.0, 10.398930481283477, 6, 85, 9.0, 13.0, 18.0, 36.0, 13.52044306564228, 6.14424270745621, 5.8989443949532205], "isController": false}, {"data": ["GET /api/products/slug/logitech-g-pro-x-superlight", 818, 0, 0.0, 5.210268948655259, 3, 46, 5.0, 6.0, 8.0, 14.809999999999945, 0.95682138788229, 1.810859228238162, 0.20463269916623192], "isController": false}, {"data": ["GET /api/products?page=0", 21884, 0, 0.0, 5.758407969292658, 3, 72, 5.0, 7.0, 10.0, 19.0, 24.34227796736862, 98.26121533277643, 4.751596405276015], "isController": false}, {"data": ["GET /api/payment-methods", 4854, 0, 0.0, 7.60135970333745, 5, 67, 7.0, 9.0, 13.0, 25.449999999999818, 5.425852274632632, 3.5341926623983073, 1.8905079617451706], "isController": false}, {"data": ["GET /api/products/slug/corsair-dark-core-rgb-se", 806, 0, 0.0, 5.200992555831273, 3, 35, 5.0, 6.0, 7.649999999999977, 16.92999999999995, 0.9101441550903707, 1.6967433516284354, 0.1919835327143751], "isController": false}, {"data": ["GET /api/products/slug/steelseries-aerox-3", 815, 0, 0.0, 5.1803680981595095, 3, 33, 5.0, 6.399999999999977, 8.0, 15.0, 0.9284553919904489, 1.7408538599820915, 0.19131258565428194], "isController": false}, {"data": ["GET /api/products/slug/corsair-katar-elite-wireless", 778, 0, 0.0, 5.152956298200517, 3, 34, 5.0, 6.0, 8.0, 13.210000000000036, 0.8876303350519287, 1.6200987267695846, 0.1907018297963128], "isController": false}, {"data": ["GET /api/products/slug/razer-basilisk-v3-pro", 826, 0, 0.0, 5.222760290556897, 3, 40, 5.0, 6.0, 8.0, 13.0, 0.9466755756555384, 1.8646920274386924, 0.1969159156392868], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 120798, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
