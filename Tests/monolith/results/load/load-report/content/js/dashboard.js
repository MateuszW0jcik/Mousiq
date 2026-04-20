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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "GET /api/addresses"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/zowie-ec2-cw"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/contacts"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/cart"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/glorious-model-o-wireless"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/lenovo-legion-m600-wireless"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/lenovo-go-wireless-multi-device-mouse"], "isController": false}, {"data": [1.0, 500, 1500, "POST /api/auth/login"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/cart (refresh)"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/orders"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/corsair-m65-rgb-ultra"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/shipping-methods/all"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/logitech-g502-hero"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/zowie-s2-c"], "isController": false}, {"data": [1.0, 500, 1500, "POST /api/cart (item 2)"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products?page=1"], "isController": false}, {"data": [1.0, 500, 1500, "POST /api/cart (item 1)"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/logitech-g-pro-x-superlight"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products?page=0"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/payment-methods"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/steelseries-aerox-3"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/corsair-dark-core-rgb-se"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/razer-basilisk-v3-pro"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/products/slug/corsair-katar-elite-wireless"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 28016, 0, 0.0, 15.386314962878252, 3, 273, 7.0, 68.0, 70.0, 76.0, 31.152945885989737, 59.2998388773136, 9.239039973924308], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET /api/addresses", 1124, 0, 0.0, 7.274911032028469, 5, 70, 6.0, 10.0, 13.0, 21.0, 1.257179287859384, 0.6605102117854965, 0.430652413415132], "isController": false}, {"data": ["GET /api/products/slug/zowie-ec2-cw", 176, 0, 0.0, 5.244318181818182, 4, 10, 5.0, 7.0, 7.0, 9.22999999999999, 0.20437359493153484, 0.39298008634784387, 0.04071505211526671], "isController": false}, {"data": ["GET /api/contacts", 1124, 0, 0.0, 7.106761565836294, 5, 46, 6.0, 9.0, 12.0, 17.75, 1.257203192669745, 0.6172767010272379, 0.4294328646224811], "isController": false}, {"data": ["GET /api/cart", 2799, 0, 0.0, 9.822079314040728, 5, 69, 9.0, 12.0, 16.0, 27.0, 3.1285313339346734, 9.635612269733276, 1.0655138677684148], "isController": false}, {"data": ["GET /api/products/slug/glorious-model-o-wireless", 187, 0, 0.0, 5.406417112299466, 3, 31, 5.0, 6.0, 7.0, 11.6400000000001, 0.2132881968364912, 0.39679103024757395, 0.045198768274920496], "isController": false}, {"data": ["GET /api/products/slug/lenovo-legion-m600-wireless", 188, 0, 0.0, 5.287234042553192, 3, 9, 5.0, 6.099999999999994, 7.0, 9.0, 0.21609319593790768, 0.39610051638227806, 0.04621524405312674], "isController": false}, {"data": ["GET /api/products/slug/lenovo-go-wireless-multi-device-mouse", 204, 0, 0.0, 5.500000000000002, 3, 13, 5.0, 7.0, 8.0, 11.949999999999989, 0.23396266231159696, 0.44941851246768677, 0.052321728192730184], "isController": false}, {"data": ["POST /api/auth/login", 3374, 0, 0.0, 72.07735625370475, 67, 273, 70.0, 76.0, 83.0, 117.25, 3.7525121478405263, 2.3245361354463365, 0.983123739755386], "isController": false}, {"data": ["GET /api/cart (refresh)", 1647, 0, 0.0, 10.842744383728002, 7, 65, 10.0, 13.0, 16.59999999999991, 26.0, 1.881120494505118, 5.9912274785932595, 0.6443397168553878], "isController": false}, {"data": ["GET /api/orders", 546, 0, 0.0, 8.177655677655675, 6, 43, 8.0, 10.0, 12.0, 20.649999999999864, 0.6271464835000747, 0.2982620483052113, 0.2130117909425575], "isController": false}, {"data": ["GET /api/products/slug/corsair-m65-rgb-ultra", 197, 0, 0.0, 5.30456852791878, 3, 11, 5.0, 6.0, 7.0, 9.04000000000002, 0.22941709425199547, 0.4120098011029489, 0.0477205479254639], "isController": false}, {"data": ["GET /api/shipping-methods/all", 1115, 0, 0.0, 4.544394618834077, 3, 18, 4.0, 5.0, 6.0, 11.0, 1.25437343203321, 0.984879139994825, 0.2364199925609468], "isController": false}, {"data": ["GET /api/products/slug/logitech-g502-hero", 176, 0, 0.0, 5.3295454545454515, 3, 11, 5.0, 6.0, 7.0, 11.0, 0.20140226325793334, 0.3835297005400098, 0.041303198519693364], "isController": false}, {"data": ["GET /api/products/slug/zowie-s2-c", 180, 0, 0.0, 5.4222222222222225, 3, 14, 5.0, 7.0, 8.0, 13.189999999999998, 0.20423654676846723, 0.3697798415124397, 0.04028885004612342], "isController": false}, {"data": ["POST /api/cart (item 2)", 2812, 0, 0.0, 10.000000000000009, 6, 95, 9.0, 14.0, 17.0, 27.0, 3.1298451661589386, 1.4223262647935826, 1.3654920831445816], "isController": false}, {"data": ["GET /api/products?page=1", 2241, 0, 0.0, 5.008478357875941, 3, 45, 5.0, 7.0, 8.0, 11.579999999999927, 2.5111860395537016, 8.041190452828697, 0.49291835346708396], "isController": false}, {"data": ["POST /api/cart (item 1)", 2816, 0, 0.0, 9.921519886363676, 6, 73, 9.0, 14.0, 17.0, 28.659999999999854, 3.134067064138193, 1.42429552702632, 1.367343791213928], "isController": false}, {"data": ["GET /api/products/slug/logitech-g-pro-x-superlight", 196, 0, 0.0, 5.41326530612245, 3, 32, 5.0, 6.0, 8.0, 11.630000000000024, 0.22335673261008296, 0.4227200662093172, 0.04776867621250798], "isController": false}, {"data": ["GET /api/products?page=0", 5070, 0, 0.0, 5.830571992110463, 3, 32, 5.0, 7.0, 9.0, 14.289999999999964, 5.641563748001251, 22.77305625804646, 1.1012376597747602], "isController": false}, {"data": ["GET /api/payment-methods", 1124, 0, 0.0, 7.09341637010676, 5, 39, 6.0, 10.0, 12.0, 18.0, 1.2572242859044354, 0.8189146471662679, 0.4380343762478566], "isController": false}, {"data": ["GET /api/products/slug/steelseries-aerox-3", 189, 0, 0.0, 5.470899470899469, 3, 13, 5.0, 7.0, 7.0, 11.199999999999989, 0.21651890301671547, 0.4059729431563415, 0.04461473489895212], "isController": false}, {"data": ["GET /api/products/slug/corsair-dark-core-rgb-se", 184, 0, 0.0, 5.5380434782608665, 4, 16, 5.0, 7.0, 8.0, 14.300000000000011, 0.21655619162398315, 0.40371657208025763, 0.04567982167068394], "isController": false}, {"data": ["GET /api/products/slug/razer-basilisk-v3-pro", 165, 0, 0.0, 5.472727272727277, 3, 25, 5.0, 6.400000000000006, 7.0, 15.100000000000051, 0.18624244025003894, 0.36684668162532086, 0.038739882591072555], "isController": false}, {"data": ["GET /api/products/slug/corsair-katar-elite-wireless", 182, 0, 0.0, 5.406593406593404, 3, 11, 5.0, 7.0, 7.0, 10.169999999999987, 0.2096708973338387, 0.3826903389813911, 0.045046481849066906], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 28016, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
