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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9999958487965661, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "GET /api/addresses"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/zowie-ec2-cw"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/contacts"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/cart"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/lenovo-legion-m600-wireless"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/glorious-model-o-wireless"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/lenovo-go-wireless-multi-device-mouse"], "isController": false}, {"data": [1.0, 500, 1500, "POST /api/auth/login"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/corsair-m65-rgb-ultra"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/cart (refresh)"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/orders"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/shipping-methods/all"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/logitech-g502-hero"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/zowie-s2-c"], "isController": false}, {"data": [1.0, 500, 1500, "POST /api/cart (item 2)"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products?page=1"], "isController": false}, {"data": [0.9999587458745874, 500, 1500, "POST /api/cart (item 1)"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/logitech-g-pro-x-superlight"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products?page=0"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/payment-methods"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/steelseries-aerox-3"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/corsair-dark-core-rgb-se"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/razer-basilisk-v3-pro"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/corsair-katar-elite-wireless"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 120447, 0, 0.0, 23.582795752488387, 4, 705, 12.0, 73.0, 77.0, 85.9900000000016, 133.88370224056538, 269.2964867800446, 45.386918304870065], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET /api/addresses", 4836, 0, 0.0, 12.861662531017371, 7, 104, 12.0, 18.0, 22.0, 31.0, 5.416326932898474, 2.85627709353468, 2.315569057678394], "isController": false}, {"data": ["GET /api/products/slug/zowie-ec2-cw", 766, 0, 0.0, 7.370757180156655, 4, 26, 7.0, 10.0, 11.0, 16.0, 0.8782459845469982, 1.6495473281859634, 0.1749630672339723], "isController": false}, {"data": ["GET /api/contacts", 4836, 0, 0.0, 12.746691480562419, 7, 67, 12.0, 18.0, 21.0, 30.0, 5.416836549533364, 2.670294170502099, 2.310497047748473], "isController": false}, {"data": ["GET /api/cart", 12020, 0, 0.0, 38.17487520798688, 10, 178, 37.0, 51.0, 59.0, 90.0, 13.458452904932042, 51.62078503116606, 5.727184862473534], "isController": false}, {"data": ["GET /api/products/slug/lenovo-legion-m600-wireless", 801, 0, 0.0, 7.519350811485651, 4, 32, 7.0, 10.0, 12.0, 18.960000000000036, 0.9156347200455417, 1.6374356212198633, 0.19582422235348987], "isController": false}, {"data": ["GET /api/products/slug/glorious-model-o-wireless", 831, 0, 0.0, 7.418772563176901, 5, 38, 7.0, 10.0, 11.0, 19.0, 0.9612303748798462, 1.7453703556436715, 0.20369823373918614], "isController": false}, {"data": ["GET /api/products/slug/lenovo-go-wireless-multi-device-mouse", 787, 0, 0.0, 7.437102922490468, 5, 49, 7.0, 10.0, 11.0, 21.0, 0.9025063760297977, 1.6933316644276024, 0.20183003917072623], "isController": false}, {"data": ["POST /api/auth/login", 14524, 0, 0.0, 78.21736436243435, 68, 283, 76.0, 85.0, 89.0, 118.0, 16.14452260055312, 11.065603866170756, 4.230089720121962], "isController": false}, {"data": ["GET /api/products/slug/corsair-m65-rgb-ultra", 821, 0, 0.0, 7.344701583434832, 4, 28, 7.0, 9.0, 11.0, 17.0, 0.9287340822783736, 1.6263772021376721, 0.19318394484891951], "isController": false}, {"data": ["GET /api/cart (refresh)", 7067, 0, 0.0, 39.393943681901646, 11, 190, 38.0, 52.0, 59.0, 89.0, 8.066136152999777, 31.267426116298687, 3.448306733460255], "isController": false}, {"data": ["GET /api/orders", 2340, 0, 0.0, 18.11111111111109, 9, 467, 16.0, 26.0, 29.0, 44.0, 2.695604091788775, 1.2896220592428116, 1.1445168954042253], "isController": false}, {"data": ["GET /api/shipping-methods/all", 4795, 0, 0.0, 6.676120959332638, 4, 39, 6.0, 9.0, 11.0, 18.0, 5.406886535443015, 4.255827599322645, 1.019071388027834], "isController": false}, {"data": ["GET /api/products/slug/logitech-g502-hero", 749, 0, 0.0, 7.393858477970628, 5, 33, 7.0, 10.0, 11.0, 19.0, 0.8649010675581268, 1.6083964471503878, 0.17737228924531898], "isController": false}, {"data": ["GET /api/products/slug/zowie-s2-c", 797, 0, 0.0, 7.486825595984936, 4, 49, 7.0, 10.0, 12.0, 18.0, 0.9247677637792717, 1.6330378359970203, 0.18242489090177041], "isController": false}, {"data": ["POST /api/cart (item 2)", 12092, 0, 0.0, 15.422510750909684, 9, 97, 14.0, 21.0, 25.0, 37.0, 13.460861976070568, 5.8318906036403995, 7.016455911071147], "isController": false}, {"data": ["GET /api/products?page=1", 9625, 0, 0.0, 7.225454545454541, 4, 79, 6.0, 10.0, 12.0, 21.0, 10.787359568191803, 34.077647571779366, 2.1174406964907737], "isController": false}, {"data": ["POST /api/cart (item 1)", 12120, 0, 0.0, 15.596534653465318, 9, 705, 14.0, 21.0, 25.0, 40.0, 13.482276146382812, 5.840935682618098, 7.027679677123403], "isController": false}, {"data": ["GET /api/products/slug/logitech-g-pro-x-superlight", 833, 0, 0.0, 7.515006002400959, 4, 28, 7.0, 10.0, 13.0, 19.319999999999936, 0.9438205811804669, 1.7441370422101945, 0.20185225320168187], "isController": false}, {"data": ["GET /api/products?page=0", 21813, 0, 0.0, 8.174849860175064, 4, 84, 7.0, 11.0, 13.0, 21.0, 24.26451693999891, 97.15594051283307, 4.73642920673117], "isController": false}, {"data": ["GET /api/payment-methods", 4836, 0, 0.0, 15.449958643506989, 8, 391, 14.0, 22.0, 25.0, 34.0, 5.417006443056464, 3.7134324411589437, 2.3475998316006605], "isController": false}, {"data": ["GET /api/products/slug/steelseries-aerox-3", 763, 0, 0.0, 7.522935779816515, 4, 48, 7.0, 10.0, 12.0, 20.0, 0.8710055605086308, 1.5942490195479675, 0.17947477858136823], "isController": false}, {"data": ["GET /api/products/slug/corsair-dark-core-rgb-se", 788, 0, 0.0, 7.4517766497461935, 4, 38, 7.0, 10.0, 12.0, 18.0, 0.9290535561647066, 1.69054145665694, 0.1959722345034928], "isController": false}, {"data": ["GET /api/products/slug/razer-basilisk-v3-pro", 780, 0, 0.0, 7.321794871794874, 4, 35, 7.0, 9.0, 11.949999999999932, 17.0, 0.8830461923727451, 1.6999004043474175, 0.1836805068119089], "isController": false}, {"data": ["GET /api/products/slug/corsair-katar-elite-wireless", 827, 0, 0.0, 7.318016928657796, 4, 37, 7.0, 10.0, 11.0, 15.720000000000027, 0.9431487711695273, 1.6793355655186177, 0.20262961880595312], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 120447, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
