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

    var data = {"OkPercent": 99.98965517241379, "KoPercent": 0.010344827586206896};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.44308045977011495, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0105, 500, 1500, "Delete a product"], "isController": false}, {"data": [0.0, 500, 1500, "Get carts in a date range"], "isController": false}, {"data": [0.0, 500, 1500, "Get a single user"], "isController": false}, {"data": [0.0, 500, 1500, "Delete a cart"], "isController": false}, {"data": [0.9888333333333333, 500, 1500, "Update a product"], "isController": false}, {"data": [0.0026666666666666666, 500, 1500, "User login"], "isController": false}, {"data": [0.9558333333333333, 500, 1500, "Get all products"], "isController": false}, {"data": [0.0, 500, 1500, "Get all users"], "isController": false}, {"data": [0.0, 500, 1500, "Add a new user"], "isController": false}, {"data": [0.0, 500, 1500, "Get user carts"], "isController": false}, {"data": [0.32872222222222225, 500, 1500, "Sort results"], "isController": false}, {"data": [0.9783333333333334, 500, 1500, "Add a new ptoduct"], "isController": false}, {"data": [0.9886666666666667, 500, 1500, "Update a cart - patch"], "isController": false}, {"data": [0.33094444444444443, 500, 1500, "Limit results"], "isController": false}, {"data": [0.0, 500, 1500, "Delete a user"], "isController": false}, {"data": [0.9923333333333333, 500, 1500, "Get a single product"], "isController": false}, {"data": [0.025, 500, 1500, "Get products in a specific category"], "isController": false}, {"data": [0.9895, 500, 1500, "Update a product - patch"], "isController": false}, {"data": [0.005333333333333333, 500, 1500, "Get all carts"], "isController": false}, {"data": [0.9838333333333333, 500, 1500, "Add new product"], "isController": false}, {"data": [0.9905, 500, 1500, "Update a cart"], "isController": false}, {"data": [0.992, 500, 1500, "Get all categories"], "isController": false}, {"data": [0.9845, 500, 1500, "Update a users - patch"], "isController": false}, {"data": [0.0021666666666666666, 500, 1500, "Get a single cart"], "isController": false}, {"data": [0.9803333333333333, 500, 1500, "Update a users"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 87000, 9, 0.010344827586206896, 2903.9407011494313, 276, 7778, 4512.5, 5347.0, 5562.950000000001, 6070.970000000005, 101.69443976883802, 204.22530055199917, 25.098280881795993], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Delete a product", 3000, 2, 0.06666666666666667, 4691.373000000007, 445, 6899, 4624.5, 5814.5, 6046.95, 6399.969999999999, 3.789835912737765, 4.07759696926822, 0.7994185128431223], "isController": false}, {"data": ["Get carts in a date range", 3000, 0, 0.0, 4871.333999999997, 3407, 6148, 4857.0, 5135.0, 5278.0, 5641.809999999996, 3.7027985751631083, 5.920251804960023, 0.5966423485370242], "isController": false}, {"data": ["Get a single user", 3000, 0, 0.0, 5202.368999999993, 4645, 7433, 5217.5, 5458.9, 5736.799999999999, 6921.959999999999, 3.6908449820501907, 3.5654643828845676, 0.4577512819534904], "isController": false}, {"data": ["Delete a cart", 3000, 1, 0.03333333333333333, 4993.827666666655, 4619, 7110, 4928.0, 5249.9, 5361.0, 6610.109999999981, 3.6908041154926425, 3.0062344409539006, 0.7677160904296219], "isController": false}, {"data": ["Update a product", 3000, 0, 0.0, 302.1193333333337, 276, 1275, 293.0, 306.0, 318.9499999999998, 552.0, 3.811852064562609, 3.0977353310402926, 1.3326592178841934], "isController": false}, {"data": ["User login", 3000, 2, 0.06666666666666667, 5023.821333333333, 487, 7275, 5149.0, 5999.8, 6165.95, 6623.899999999998, 3.7379590992515364, 3.1097556488349403, 0.9308394241300212], "isController": false}, {"data": ["Get all products", 3000, 0, 0.0, 349.6133333333341, 282, 1641, 302.0, 482.0, 678.8999999999996, 761.9599999999991, 3.8296324191149718, 42.35133396867999, 0.47870405238937147], "isController": false}, {"data": ["Get all users", 3000, 0, 0.0, 5179.492666666676, 4681, 7211, 5119.5, 5445.700000000001, 6004.499999999998, 6985.99, 3.6898689727527776, 13.304694601075965, 0.45042345858798555], "isController": false}, {"data": ["Add a new user", 3000, 0, 0.0, 5526.692666666663, 3171, 7778, 5444.5, 6179.0, 6292.0, 6890.98, 3.702464977766698, 2.552751978581857, 2.3140406111041862], "isController": false}, {"data": ["Get user carts", 3000, 1, 0.03333333333333333, 4918.214333333335, 4239, 6475, 4877.0, 5133.9, 5312.95, 5669.0, 3.6951455641009217, 3.010097812812548, 0.47632735787238445], "isController": false}, {"data": ["Sort results", 9000, 1, 0.011111111111111112, 3485.30877777778, 281, 7230, 4826.0, 5449.0, 5735.949999999999, 6183.99, 10.614008604422974, 57.53641692150115, 1.4096730177749264], "isController": false}, {"data": ["Add a new ptoduct", 3000, 0, 0.0, 327.25333333333367, 278, 1873, 295.0, 448.0, 466.0, 871.8499999999749, 3.714172166736617, 2.9424126504084973, 1.5378994127893804], "isController": false}, {"data": ["Update a cart - patch", 3000, 0, 0.0, 304.98400000000055, 277, 1578, 294.0, 305.0, 313.0, 601.8799999999974, 3.7140664075073664, 2.9391515989055885, 1.548736675786763], "isController": false}, {"data": ["Limit results", 9000, 0, 0.0, 3432.1950000000156, 278, 7232, 4809.0, 5332.0, 5444.0, 5894.969999999999, 10.667867789558528, 22.893802209582116, 1.3959905115242606], "isController": false}, {"data": ["Delete a user", 3000, 0, 0.0, 5399.9126666666625, 1796, 7121, 5364.0, 6141.9, 6282.0, 6815.969999999999, 3.7160722602637914, 3.633672712664622, 0.7729720619494019], "isController": false}, {"data": ["Get a single product", 3000, 0, 0.0, 300.0886666666664, 277, 1221, 293.0, 306.0, 316.0, 545.0, 3.8326364322753976, 3.9869150199105463, 0.48656517206621264], "isController": false}, {"data": ["Get products in a specific category", 3000, 1, 0.03333333333333333, 4615.01933333333, 443, 7634, 4485.0, 5906.8, 6086.0, 6417.769999999995, 3.81107727721395, 8.328161582371989, 0.5433762524152702], "isController": false}, {"data": ["Update a product - patch", 3000, 0, 0.0, 303.22566666666745, 276, 1168, 293.0, 306.0, 317.0, 557.9899999999998, 3.811827847689524, 3.09785462387424, 1.3400957277033483], "isController": false}, {"data": ["Get all carts", 3000, 0, 0.0, 4795.1383333333315, 510, 6940, 4786.0, 5702.8, 6024.799999999999, 6384.959999999999, 3.7688158129461335, 6.026351206837637, 0.46006052404127606], "isController": false}, {"data": ["Add new product", 3000, 0, 0.0, 317.3843333333327, 276, 1914, 294.0, 383.9000000000001, 458.9499999999998, 694.9499999999989, 3.8119053427665284, 3.1130783653088656, 1.3401229720663577], "isController": false}, {"data": ["Update a cart", 3000, 0, 0.0, 301.508333333333, 278, 1402, 293.0, 304.0, 311.0, 552.9899999999998, 3.714121585484222, 2.9392629697125767, 1.5415055408503853], "isController": false}, {"data": ["Get all categories", 3000, 0, 0.0, 299.87433333333433, 276, 905, 293.0, 305.0, 317.0, 548.9899999999998, 3.8322790307910846, 2.849034992220474, 0.5202019387499617], "isController": false}, {"data": ["Update a users - patch", 3000, 0, 0.0, 310.28799999999893, 277, 2314, 293.0, 306.0, 326.0, 807.9599999999991, 3.723068255010319, 3.549262049089896, 2.3378250859097998], "isController": false}, {"data": ["Get a single cart", 3000, 1, 0.03333333333333333, 4807.860000000007, 844, 6888, 4820.0, 5305.9, 5734.95, 6221.899999999998, 3.748528702484275, 3.046279921068481, 0.46490541524951456], "isController": false}, {"data": ["Update a users", 3000, 0, 0.0, 320.37466666666637, 276, 2115, 295.0, 325.9000000000001, 461.0, 732.9299999999985, 3.723146803678469, 3.549288452349926, 2.3306026378495104], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 9, 100.0, 0.010344827586206896], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 87000, 9, "502/Bad Gateway", 9, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Delete a product", 3000, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Delete a cart", 3000, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["User login", 3000, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get user carts", 3000, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Sort results", 9000, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get products in a specific category", 3000, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get a single cart", 3000, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
