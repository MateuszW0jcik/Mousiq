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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "GET /api/addresses"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/zowie-ec2-cw"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/contacts"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/cart"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/glorious-model-o-wireless"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/lenovo-legion-m600-wireless"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/lenovo-go-wireless-multi-device-mouse"], "isController": false}, {"data": [1.0, 500, 1500, "POST /api/auth/login"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/corsair-m65-rgb-ultra"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/cart (refresh)"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/orders"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/shipping-methods/all"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/logitech-g502-hero"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/zowie-s2-c"], "isController": false}, {"data": [1.0, 500, 1500, "POST /api/cart (item 2)"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products?page=1"], "isController": false}, {"data": [1.0, 500, 1500, "POST /api/cart (item 1)"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/logitech-g-pro-x-superlight"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products?page=0"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/payment-methods"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/corsair-dark-core-rgb-se"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/steelseries-aerox-3"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/razer-basilisk-v3-pro"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/corsair-katar-elite-wireless"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 32475, 0, 0.0, 15.750207852193942, 3, 310, 7.0, 69.0, 71.0, 77.0, 54.24270667348145, 104.46779211409593, 16.096612592033047], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET /api/addresses", 1316, 0, 0.0, 7.320668693009115, 5, 29, 6.0, 10.0, 13.0, 20.829999999999927, 2.2193328172878606, 1.16601665595788, 0.7602705012133815], "isController": false}, {"data": ["GET /api/products/slug/zowie-ec2-cw", 220, 0, 0.0, 5.259090909090906, 3, 9, 5.0, 6.0, 7.0, 9.0, 0.3926587099733527, 0.7550244140014957, 0.07822497737750386], "isController": false}, {"data": ["GET /api/contacts", 1316, 0, 0.0, 7.259878419452894, 5, 28, 6.0, 10.0, 12.149999999999864, 20.0, 2.2193889597204515, 1.089730282474585, 0.7581223617351034], "isController": false}, {"data": ["GET /api/cart", 3248, 0, 0.0, 9.962746305418737, 5, 60, 9.0, 13.0, 17.0, 27.0, 5.4773360045464585, 17.72019524708721, 1.8654550690442824], "isController": false}, {"data": ["GET /api/products/slug/glorious-model-o-wireless", 191, 0, 0.0, 5.25130890052356, 3, 11, 5.0, 6.0, 7.399999999999977, 10.079999999999984, 0.3361835597438669, 0.6254196106563147, 0.07124202389103428], "isController": false}, {"data": ["GET /api/products/slug/lenovo-legion-m600-wireless", 194, 0, 0.0, 5.427835051546388, 3, 29, 5.0, 7.0, 8.0, 13.800000000000182, 0.3418435942210812, 0.6266019788603217, 0.07310912806095389], "isController": false}, {"data": ["GET /api/products/slug/lenovo-go-wireless-multi-device-mouse", 223, 0, 0.0, 5.403587443946184, 3, 24, 5.0, 7.0, 7.799999999999983, 17.59999999999991, 0.38947747143540784, 0.7481466663217259, 0.08709994234248868], "isController": false}, {"data": ["POST /api/auth/login", 3929, 0, 0.0, 74.10511580554842, 66, 310, 71.0, 78.0, 88.0, 141.69999999999982, 6.570387935503507, 4.0705988648772715, 1.7215517874791384], "isController": false}, {"data": ["GET /api/products/slug/corsair-m65-rgb-ultra", 207, 0, 0.0, 5.280193236714977, 3, 14, 5.0, 6.200000000000017, 8.0, 13.0, 0.36268068331143233, 0.6513376724704336, 0.07544041557161629], "isController": false}, {"data": ["GET /api/cart (refresh)", 1853, 0, 0.0, 11.247166756610913, 6, 65, 10.0, 14.0, 18.0, 29.0, 3.2367321058322314, 10.862408071698944, 1.108727173221937], "isController": false}, {"data": ["GET /api/orders", 613, 0, 0.0, 8.456769983686796, 6, 74, 7.0, 11.0, 14.0, 32.0, 1.0788701607041344, 0.5130954768192514, 0.36645478293237965], "isController": false}, {"data": ["GET /api/shipping-methods/all", 1285, 0, 0.0, 4.543190661478596, 3, 25, 4.0, 6.0, 7.0, 13.1400000000001, 2.1870590778269654, 1.7171831040750782, 0.4122093769732464], "isController": false}, {"data": ["GET /api/products/slug/logitech-g502-hero", 197, 0, 0.0, 5.502538071065991, 3, 17, 5.0, 7.0, 8.0, 10.140000000000072, 0.3956117221560638, 0.7533621662151605, 0.08113131020778652], "isController": false}, {"data": ["GET /api/products/slug/zowie-s2-c", 223, 0, 0.0, 5.560538116591926, 3, 40, 5.0, 7.0, 7.0, 12.519999999999982, 0.39893735967870336, 0.7222947898870273, 0.07869662759286922], "isController": false}, {"data": ["POST /api/cart (item 2)", 3277, 0, 0.0, 9.874580408910594, 6, 59, 9.0, 14.0, 17.0, 28.0, 5.487283133427886, 2.493159079929806, 2.394004788395493], "isController": false}, {"data": ["GET /api/products?page=1", 2591, 0, 0.0, 4.924739482825158, 3, 41, 4.0, 7.0, 8.0, 13.0, 4.391562640361359, 14.0624354470165, 0.8620157135865558], "isController": false}, {"data": ["POST /api/cart (item 1)", 3289, 0, 0.0, 10.008209182122217, 6, 85, 9.0, 14.0, 18.0, 30.0, 5.506666934549521, 2.5021965609282812, 2.4025024130385284], "isController": false}, {"data": ["GET /api/products/slug/logitech-g-pro-x-superlight", 261, 0, 0.0, 5.4367816091954, 3, 13, 5.0, 7.0, 8.0, 12.0, 0.4600610594448244, 0.8707014972695992, 0.0983919648617349], "isController": false}, {"data": ["GET /api/products?page=0", 5915, 0, 0.0, 6.022485207100569, 3, 50, 6.0, 8.0, 10.0, 15.840000000000146, 9.903227966782747, 39.97552086385364, 1.9330470005692473], "isController": false}, {"data": ["GET /api/payment-methods", 1316, 0, 0.0, 7.30091185410334, 5, 42, 6.0, 10.0, 13.0, 19.0, 2.2194488481127936, 1.445676153995345, 0.7733148326559179], "isController": false}, {"data": ["GET /api/products/slug/corsair-dark-core-rgb-se", 188, 0, 0.0, 5.648936170212766, 3, 39, 5.0, 7.0, 8.549999999999983, 28.319999999999823, 0.32542335327993854, 0.606673028722073, 0.06864398858248703], "isController": false}, {"data": ["GET /api/products/slug/steelseries-aerox-3", 178, 0, 0.0, 5.432584269662923, 3, 16, 5.0, 7.0, 8.0, 11.260000000000048, 0.32181954601748314, 0.6034116487827809, 0.06631242598602435], "isController": false}, {"data": ["GET /api/products/slug/razer-basilisk-v3-pro", 198, 0, 0.0, 5.262626262626265, 3, 8, 5.0, 7.0, 7.0, 8.0, 0.341936430908981, 0.6735212706478659, 0.07112544900743453], "isController": false}, {"data": ["GET /api/products/slug/corsair-katar-elite-wireless", 247, 0, 0.0, 5.37246963562753, 3, 28, 5.0, 7.0, 7.599999999999994, 10.52000000000001, 0.46115643845335225, 0.8417005697942532, 0.09907657857396239], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 32475, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
