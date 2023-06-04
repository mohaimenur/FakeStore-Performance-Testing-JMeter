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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4439051724137931, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.021, 500, 1500, "Delete a product"], "isController": false}, {"data": [7.5E-4, 500, 1500, "Get carts in a date range"], "isController": false}, {"data": [0.0, 500, 1500, "Get a single user"], "isController": false}, {"data": [0.0, 500, 1500, "Delete a cart"], "isController": false}, {"data": [0.98925, 500, 1500, "Update a product"], "isController": false}, {"data": [0.0165, 500, 1500, "User login"], "isController": false}, {"data": [0.93825, 500, 1500, "Get all products"], "isController": false}, {"data": [0.0, 500, 1500, "Get all users"], "isController": false}, {"data": [5.0E-4, 500, 1500, "Add a new user"], "isController": false}, {"data": [0.0, 500, 1500, "Get user carts"], "isController": false}, {"data": [0.31825, 500, 1500, "Sort results"], "isController": false}, {"data": [0.98525, 500, 1500, "Add a new ptoduct"], "isController": false}, {"data": [0.9905, 500, 1500, "Update a cart - patch"], "isController": false}, {"data": [0.3323333333333333, 500, 1500, "Limit results"], "isController": false}, {"data": [0.0085, 500, 1500, "Delete a user"], "isController": false}, {"data": [0.99125, 500, 1500, "Get a single product"], "isController": false}, {"data": [0.03725, 500, 1500, "Get products in a specific category"], "isController": false}, {"data": [0.98975, 500, 1500, "Update a product - patch"], "isController": false}, {"data": [0.014, 500, 1500, "Get all carts"], "isController": false}, {"data": [0.97525, 500, 1500, "Add new product"], "isController": false}, {"data": [0.987, 500, 1500, "Update a cart"], "isController": false}, {"data": [0.9905, 500, 1500, "Get all categories"], "isController": false}, {"data": [0.9905, 500, 1500, "Update a users - patch"], "isController": false}, {"data": [0.0095, 500, 1500, "Get a single cart"], "isController": false}, {"data": [0.986, 500, 1500, "Update a users"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 58000, 0, 0.0, 1936.9166034482723, 276, 6946, 2968.0, 3458.0, 3530.0, 3766.9900000000016, 100.94505456254242, 202.73201589884607, 24.91333192648415], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Delete a product", 2000, 0, 0.0, 3059.213500000001, 446, 6374, 3103.0, 3528.0, 3613.0, 4032.9300000000003, 3.7394291013590952, 4.0248965346710515, 0.7887858260679342], "isController": false}, {"data": ["Get carts in a date range", 2000, 0, 0.0, 3239.0729999999976, 1397, 6307, 3246.0, 3440.0, 3580.95, 4948.79, 3.645942521716145, 5.8297374750480815, 0.5874809727374648], "isController": false}, {"data": ["Get a single user", 2000, 0, 0.0, 3367.9664999999995, 2463, 6783, 3336.0, 3517.8, 3831.8999999999996, 4917.0, 3.6294017838509767, 3.506218327798496, 0.45013088530183015], "isController": false}, {"data": ["Delete a cart", 2000, 0, 0.0, 3303.657000000006, 2550, 6879, 3274.0, 3437.0, 3632.699999999999, 5108.650000000001, 3.626223397118603, 2.954355734555008, 0.7542827964709594], "isController": false}, {"data": ["Update a product", 2000, 0, 0.0, 310.1599999999999, 276, 1261, 293.0, 320.9000000000001, 393.0, 692.3600000000006, 3.7602820211515864, 3.0563748531139834, 1.314629847238543], "isController": false}, {"data": ["User login", 2000, 0, 0.0, 3200.085499999997, 448, 5156, 3335.0, 3571.0, 3651.8999999999996, 4092.0, 3.6929667448344627, 3.073302071985154, 0.9196352733718632], "isController": false}, {"data": ["Get all products", 2000, 0, 0.0, 362.1829999999995, 282, 3119, 303.0, 517.0, 540.8999999999996, 860.98, 3.775273093817424, 41.74998197896984, 0.471909136727178], "isController": false}, {"data": ["Get all users", 2000, 0, 0.0, 3368.268499999996, 2607, 6783, 3312.5, 3531.8, 3863.1999999999935, 5109.66, 3.6267560299352444, 13.076885131116297, 0.44271924193545464], "isController": false}, {"data": ["Add a new user", 2000, 0, 0.0, 3398.7230000000054, 1011, 5761, 3406.0, 3627.0, 3765.95, 4243.98, 3.6553782494028026, 2.5211079531435336, 2.2846114058767517], "isController": false}, {"data": ["Get user carts", 2000, 0, 0.0, 3298.8709999999937, 1772, 6791, 3265.5, 3466.0, 3756.5999999999985, 6104.150000000001, 3.634579388300289, 2.9611457784360407, 0.46851999927308413], "isController": false}, {"data": ["Sort results", 6000, 0, 0.0, 2314.0228333333316, 282, 6320, 3188.0, 3495.0, 3605.95, 4040.99, 10.514288918640434, 57.00022942506992, 1.3964289970069323], "isController": false}, {"data": ["Add a new ptoduct", 2000, 0, 0.0, 321.872, 278, 2856, 294.0, 393.9000000000001, 455.9499999999998, 715.97, 3.6436642144806504, 2.8863834047946977, 1.5087047138083942], "isController": false}, {"data": ["Update a cart - patch", 2000, 0, 0.0, 309.63800000000043, 278, 3754, 293.0, 308.0, 376.0, 589.8600000000001, 3.6433854337450358, 2.8830244140980796, 1.5192632619229787], "isController": false}, {"data": ["Limit results", 6000, 0, 0.0, 2298.6543333333325, 277, 6851, 3161.0, 3479.9000000000005, 3601.95, 4228.99, 10.5504151588365, 22.64237922632047, 1.3806207336758702], "isController": false}, {"data": ["Delete a user", 2000, 0, 0.0, 3304.9880000000035, 443, 5026, 3371.0, 3593.9, 3693.95, 4085.96, 3.6737355461467107, 3.591672043331711, 0.7641656946574701], "isController": false}, {"data": ["Get a single product", 2000, 0, 0.0, 308.26849999999996, 276, 1370, 293.0, 316.0, 390.9499999999998, 719.99, 3.779218079779294, 3.931899966459439, 0.4797835452844806], "isController": false}, {"data": ["Get products in a specific category", 2000, 0, 0.0, 3026.420999999997, 447, 5562, 3161.5, 3545.9, 3619.0, 3995.0, 3.758882709703368, 8.216238508390767, 0.5359344488444255], "isController": false}, {"data": ["Update a product - patch", 2000, 0, 0.0, 310.95550000000077, 277, 1495, 293.0, 319.0, 394.0, 849.3500000000015, 3.7600416612616065, 3.0559408129492076, 1.3218896465372836], "isController": false}, {"data": ["Get all carts", 2000, 0, 0.0, 3115.7799999999947, 474, 6666, 3150.0, 3511.8, 3587.8999999999996, 4100.330000000001, 3.72006510113927, 5.947831899558242, 0.4541095094164148], "isController": false}, {"data": ["Add new product", 2000, 0, 0.0, 319.5290000000002, 276, 1454, 293.0, 336.8000000000002, 498.84999999999945, 969.99, 3.760310300806023, 3.070807465532056, 1.3219840901271174], "isController": false}, {"data": ["Update a cart", 2000, 0, 0.0, 316.4919999999995, 278, 3912, 293.0, 312.9000000000001, 430.1499999999969, 920.99, 3.6435845584886413, 2.8834951027946296, 1.512229919294602], "isController": false}, {"data": ["Get all categories", 2000, 0, 0.0, 307.8194999999999, 276, 1345, 293.0, 316.9000000000001, 391.0, 621.99, 3.7791323867866415, 2.809353134176206, 0.5129876970345149], "isController": false}, {"data": ["Update a users - patch", 2000, 0, 0.0, 309.5505, 279, 1306, 294.0, 318.0, 393.0, 583.8700000000001, 3.6748695880654934, 3.5031627420590663, 2.3075597120372193], "isController": false}, {"data": ["Get a single cart", 2000, 0, 0.0, 3155.3374999999996, 508, 6946, 3171.0, 3497.0, 3609.8999999999996, 6212.97, 3.7003254436227664, 3.0080393617493657, 0.45892708138680793], "isController": false}, {"data": ["Update a users", 2000, 0, 0.0, 317.69750000000005, 278, 1394, 295.0, 369.9000000000001, 450.0, 853.9100000000001, 3.6749506178510725, 3.503566568285176, 2.3004329551196654], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 58000, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
