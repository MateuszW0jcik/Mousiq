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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "GET /api/addresses"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/zowie-ec2-cw"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/contacts"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/cart"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/lenovo-legion-m600-wireless"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/glorious-model-o-wireless"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/lenovo-go-wireless-multi-device-mouse"], "isController": false}, {"data": [1.0, 500, 1500, "POST /api/auth/login"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/cart (refresh)"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/corsair-m65-rgb-ultra"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/orders"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/shipping-methods/all"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/logitech-g502-hero"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/zowie-s2-c"], "isController": false}, {"data": [1.0, 500, 1500, "POST /api/cart (item 2)"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products?page=1"], "isController": false}, {"data": [1.0, 500, 1500, "POST /api/cart (item 1)"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/logitech-g-pro-x-superlight"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products?page=0"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/payment-methods"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/corsair-dark-core-rgb-se"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/steelseries-aerox-3"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/corsair-katar-elite-wireless"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/razer-basilisk-v3-pro"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 91658, 0, 0.0, 15.328285583364321, 3, 324, 8.0, 68.0, 69.0, 76.0, 25.46659679824047, 50.68714347445199, 7.552075265736649], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET /api/addresses", 3669, 0, 0.0, 6.949304987735075, 5, 44, 6.0, 8.0, 12.0, 18.0, 1.0208808958375941, 0.5363612519146734, 0.34970505160749094], "isController": false}, {"data": ["GET /api/products/slug/zowie-ec2-cw", 624, 0, 0.0, 5.336538461538456, 3, 15, 5.0, 6.0, 7.0, 12.0, 0.1741841746419664, 0.33493031237307797, 0.03470075354195424], "isController": false}, {"data": ["GET /api/contacts", 3669, 0, 0.0, 6.886345053148011, 5, 41, 6.0, 8.0, 12.0, 18.0, 1.0208854407378645, 0.5012442910828481, 0.3487096500351008], "isController": false}, {"data": ["GET /api/cart", 9163, 0, 0.0, 10.132816763068847, 5, 52, 9.0, 12.0, 16.0, 26.0, 2.549543305368955, 9.281556663238247, 0.8683763988159914], "isController": false}, {"data": ["GET /api/products/slug/lenovo-legion-m600-wireless", 603, 0, 0.0, 5.303482587064681, 3, 12, 5.0, 6.0, 7.0, 9.0, 0.16908512608899373, 0.30993435709867306, 0.036161760364735965], "isController": false}, {"data": ["GET /api/products/slug/glorious-model-o-wireless", 581, 0, 0.0, 5.26506024096385, 3, 14, 5.0, 6.0, 7.0, 11.0, 0.16377583063380402, 0.30468062241933264, 0.034706401608921356], "isController": false}, {"data": ["GET /api/products/slug/lenovo-go-wireless-multi-device-mouse", 640, 0, 0.0, 5.199999999999999, 3, 11, 5.0, 6.0, 7.0, 8.0, 0.17910649924313513, 0.34404539454223315, 0.04005409016277143], "isController": false}, {"data": ["POST /api/auth/login", 11007, 0, 0.0, 71.95239393113457, 66, 324, 69.0, 76.0, 84.0, 124.0, 3.0588016900525443, 1.8946981721631262, 0.8013797143152308], "isController": false}, {"data": ["GET /api/cart (refresh)", 5473, 0, 0.0, 11.328704549607144, 7, 51, 11.0, 13.0, 18.0, 27.26000000000022, 1.531091965389992, 5.645595095379225, 0.5244879073668379], "isController": false}, {"data": ["GET /api/products/slug/corsair-m65-rgb-ultra", 577, 0, 0.0, 5.332755632582318, 3, 12, 5.0, 6.0, 7.0, 11.0, 0.161963048284918, 0.29086918534762124, 0.033689579379577665], "isController": false}, {"data": ["GET /api/orders", 1822, 0, 0.0, 8.001097694840817, 5, 41, 8.0, 9.0, 12.0, 19.0, 0.5111010187516848, 0.2430724571602251, 0.17358271855810042], "isController": false}, {"data": ["GET /api/shipping-methods/all", 3663, 0, 0.0, 4.486213486213484, 3, 22, 4.0, 5.0, 6.0, 10.0, 1.020986100318086, 0.8016336178278722, 0.192431950548233], "isController": false}, {"data": ["GET /api/products/slug/logitech-g502-hero", 637, 0, 0.0, 5.282574568288862, 3, 17, 5.0, 6.0, 7.0, 9.620000000000005, 0.17904841249831, 0.34096133239424264, 0.03671891271937998], "isController": false}, {"data": ["GET /api/products/slug/zowie-s2-c", 633, 0, 0.0, 5.232227488151662, 3, 15, 5.0, 6.0, 7.0, 10.659999999999968, 0.17851210582806776, 0.3232045353566773, 0.035214302126239924], "isController": false}, {"data": ["POST /api/cart (item 2)", 9176, 0, 0.0, 9.999346120313882, 6, 52, 9.0, 14.0, 17.0, 27.0, 2.5501363305772626, 1.1589887051346506, 1.1126341072674717], "isController": false}, {"data": ["GET /api/products?page=1", 7331, 0, 0.0, 4.886372936843552, 3, 26, 5.0, 6.0, 7.0, 11.0, 2.0414977369756704, 6.537178788616429, 0.400723676886826], "isController": false}, {"data": ["POST /api/cart (item 1)", 9179, 0, 0.0, 9.992591785597535, 6, 90, 9.0, 14.0, 17.0, 25.0, 2.5509126481246804, 1.159350980544393, 1.112973814863603], "isController": false}, {"data": ["GET /api/products/slug/logitech-g-pro-x-superlight", 587, 0, 0.0, 5.3049403747870505, 3, 17, 5.0, 6.0, 7.0, 10.0, 0.16413579706663886, 0.3106398190577599, 0.0351032612867128], "isController": false}, {"data": ["GET /api/products?page=0", 16520, 0, 0.0, 5.640133171912826, 3, 31, 5.0, 7.0, 9.0, 13.0, 4.591585169735784, 18.534715919813745, 0.8962918389785002], "isController": false}, {"data": ["GET /api/payment-methods", 3669, 0, 0.0, 6.848460070863993, 5, 49, 6.0, 8.0, 12.0, 18.0, 1.020890269738742, 0.6649719782107124, 0.35569004158270545], "isController": false}, {"data": ["GET /api/products/slug/corsair-dark-core-rgb-se", 644, 0, 0.0, 5.276397515527952, 3, 14, 5.0, 6.0, 7.0, 9.0, 0.18008716890107118, 0.33572891155482903, 0.03798713719006971], "isController": false}, {"data": ["GET /api/products/slug/steelseries-aerox-3", 583, 0, 0.0, 5.44082332761578, 3, 23, 5.0, 7.0, 7.7999999999999545, 13.319999999999936, 0.16389050764733348, 0.3072947018387503, 0.03377040733748766], "isController": false}, {"data": ["GET /api/products/slug/corsair-katar-elite-wireless", 588, 0, 0.0, 5.33673469387755, 3, 26, 5.0, 6.0, 7.0, 12.0, 0.16431066228095054, 0.2998990505889615, 0.03530111884942297], "isController": false}, {"data": ["GET /api/products/slug/razer-basilisk-v3-pro", 620, 0, 0.0, 5.26774193548387, 3, 15, 5.0, 6.0, 7.0, 10.789999999999964, 0.17429649576895256, 0.3433164374667747, 0.03625503281131533], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 91658, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
