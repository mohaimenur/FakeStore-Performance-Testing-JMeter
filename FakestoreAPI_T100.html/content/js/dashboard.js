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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5808620689655173, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.321, 500, 1500, "Delete a product"], "isController": false}, {"data": [0.242, 500, 1500, "Get carts in a date range"], "isController": false}, {"data": [0.226, 500, 1500, "Get a single user"], "isController": false}, {"data": [0.269, 500, 1500, "Delete a cart"], "isController": false}, {"data": [0.983, 500, 1500, "Update a product"], "isController": false}, {"data": [0.2885, 500, 1500, "User login"], "isController": false}, {"data": [0.938, 500, 1500, "Get all products"], "isController": false}, {"data": [0.251, 500, 1500, "Get all users"], "isController": false}, {"data": [0.197, 500, 1500, "Add a new user"], "isController": false}, {"data": [0.2515, 500, 1500, "Get user carts"], "isController": false}, {"data": [0.4731666666666667, 500, 1500, "Sort results"], "isController": false}, {"data": [0.9755, 500, 1500, "Add a new ptoduct"], "isController": false}, {"data": [0.9815, 500, 1500, "Update a cart - patch"], "isController": false}, {"data": [0.4891666666666667, 500, 1500, "Limit results"], "isController": false}, {"data": [0.262, 500, 1500, "Delete a user"], "isController": false}, {"data": [0.983, 500, 1500, "Get a single product"], "isController": false}, {"data": [0.3235, 500, 1500, "Get products in a specific category"], "isController": false}, {"data": [0.9815, 500, 1500, "Update a product - patch"], "isController": false}, {"data": [0.2825, 500, 1500, "Get all carts"], "isController": false}, {"data": [0.978, 500, 1500, "Add new product"], "isController": false}, {"data": [0.9805, 500, 1500, "Update a cart"], "isController": false}, {"data": [0.987, 500, 1500, "Get all categories"], "isController": false}, {"data": [0.984, 500, 1500, "Update a users - patch"], "isController": false}, {"data": [0.2815, 500, 1500, "Get a single cart"], "isController": false}, {"data": [0.9905, 500, 1500, "Update a users"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 29000, 0, 0.0, 958.2646896551755, 276, 2993, 1356.0, 1603.0, 1670.0, 1941.9900000000016, 100.31929209172642, 201.4736571592517, 24.758893175520708], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Delete a product", 1000, 0, 0.0, 1428.3370000000011, 445, 2056, 1468.0, 1620.9, 1701.7999999999997, 1895.92, 3.712172957562439, 3.9956394148316154, 0.7830364832358269], "isController": false}, {"data": ["Get carts in a date range", 1000, 0, 0.0, 1496.9960000000008, 548, 2276, 1505.0, 1679.9, 1766.5999999999995, 2005.88, 3.6440359884994225, 5.826635614165825, 0.5871737676781296], "isController": false}, {"data": ["Get a single user", 1000, 0, 0.0, 1509.7849999999999, 640, 2386, 1515.5, 1668.9, 1752.7999999999997, 2012.96, 3.638612960739366, 3.5156321066659393, 0.4512732871229488], "isController": false}, {"data": ["Delete a cart", 1000, 0, 0.0, 1485.7320000000004, 819, 2099, 1494.0, 1643.8, 1726.9499999999998, 2017.96, 3.628934218309425, 2.9568584361833774, 0.7548466684569409], "isController": false}, {"data": ["Update a product", 1000, 0, 0.0, 307.66000000000014, 277, 1232, 293.0, 306.0, 322.89999999999986, 678.8400000000001, 3.7307446939483593, 3.032031591013382, 1.304303320735852], "isController": false}, {"data": ["User login", 1000, 0, 0.0, 1453.1209999999999, 442, 2224, 1486.0, 1628.9, 1682.9499999999998, 1884.8100000000002, 3.692094118863278, 3.0728102305158966, 0.9194179690528671], "isController": false}, {"data": ["Get all products", 1000, 0, 0.0, 362.2670000000004, 283, 1765, 302.0, 685.9, 716.0, 1125.0800000000008, 3.729144757941214, 41.23951935519358, 0.4661430947426517], "isController": false}, {"data": ["Get all users", 1000, 0, 0.0, 1506.5249999999996, 786, 2484, 1500.0, 1667.0, 1733.6999999999996, 2029.8600000000001, 3.629368852756506, 13.086405348328677, 0.44303819003375317], "isController": false}, {"data": ["Add a new user", 1000, 0, 0.0, 1511.2190000000007, 442, 2325, 1529.0, 1665.6999999999998, 1739.9499999999998, 2047.94, 3.669697837080095, 2.530364169345546, 2.2935611481750593], "isController": false}, {"data": ["Get user carts", 1000, 0, 0.0, 1495.7739999999994, 652, 2309, 1500.0, 1678.0, 1762.4999999999993, 1962.94, 3.632453795187725, 2.9593998369028247, 0.46824599703591774], "isController": false}, {"data": ["Sort results", 3000, 0, 0.0, 1112.5159999999992, 283, 2993, 1435.0, 1639.0, 1720.0, 2034.9899999999998, 10.538074061584505, 57.12810697550249, 1.399587961304192], "isController": false}, {"data": ["Add a new ptoduct", 1000, 0, 0.0, 319.2940000000001, 278, 1937, 294.0, 315.0, 466.94999999999993, 954.8300000000002, 3.6371439690697276, 2.8807174766586288, 1.5060049246929343], "isController": false}, {"data": ["Update a cart - patch", 1000, 0, 0.0, 308.85499999999985, 277, 1138, 294.0, 305.9, 317.0, 705.7100000000003, 3.63723657314119, 2.8772104168636834, 1.5166992350891486], "isController": false}, {"data": ["Limit results", 3000, 0, 0.0, 1099.7033333333352, 279, 2575, 1433.0, 1628.0, 1694.9499999999998, 1972.9799999999996, 10.54674316571043, 22.633194105337356, 1.3801402189503882], "isController": false}, {"data": ["Delete a user", 1000, 0, 0.0, 1470.4979999999998, 445, 2009, 1499.5, 1641.9, 1690.9499999999998, 1859.89, 3.6779715251444522, 3.596560487459956, 0.7650468113825862], "isController": false}, {"data": ["Get a single product", 1000, 0, 0.0, 308.2860000000004, 278, 1018, 294.0, 307.0, 334.7999999999997, 729.99, 3.7435237039920937, 3.894266337205385, 0.4752520327333713], "isController": false}, {"data": ["Get products in a specific category", 1000, 0, 0.0, 1411.9569999999967, 443, 2359, 1461.0, 1616.8, 1674.9499999999998, 1918.99, 3.728102060522009, 8.148801019076698, 0.5315458015978646], "isController": false}, {"data": ["Update a product - patch", 1000, 0, 0.0, 312.1230000000002, 278, 1894, 294.0, 307.0, 324.0, 978.8200000000002, 3.7308282065535727, 3.032288919067144, 1.3116192913664906], "isController": false}, {"data": ["Get all carts", 1000, 0, 0.0, 1458.2869999999987, 455, 2217, 1487.0, 1652.8, 1740.299999999999, 1925.99, 3.696324744306736, 5.910495459989133, 0.4512115166390059], "isController": false}, {"data": ["Add new product", 1000, 0, 0.0, 312.4289999999997, 277, 1177, 294.0, 308.0, 387.4999999999993, 940.5900000000022, 3.7306194320504975, 3.046925130198618, 1.311545894080253], "isController": false}, {"data": ["Update a cart", 1000, 0, 0.0, 311.4959999999996, 279, 1327, 294.0, 306.0, 331.94999999999993, 934.6500000000012, 3.637077826191325, 2.878207220690608, 1.5095293712219853], "isController": false}, {"data": ["Get all categories", 1000, 0, 0.0, 303.2040000000002, 276, 805, 293.5, 305.0, 313.0, 727.9100000000001, 3.7442245336568343, 2.7839771995447027, 0.5082492286897461], "isController": false}, {"data": ["Update a users - patch", 1000, 0, 0.0, 305.53599999999943, 277, 1065, 294.0, 306.0, 314.94999999999993, 581.99, 3.6801507389742687, 3.5091962366778544, 2.3108759034770063], "isController": false}, {"data": ["Get a single cart", 1000, 0, 0.0, 1469.6800000000026, 444, 2857, 1489.0, 1647.9, 1732.4499999999994, 2034.8700000000001, 3.682441016501018, 2.993608778387017, 0.45670899325745046], "isController": false}, {"data": ["Update a users", 1000, 0, 0.0, 303.957, 278, 1017, 294.0, 307.0, 313.94999999999993, 554.99, 3.6802997236094908, 3.508317592384724, 2.3037813699547693], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 29000, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
