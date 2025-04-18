
// Create Tabulator on DOM element with id "table"
var claims_grid = new Tabulator("#claims_grid_update", {
   
    ajaxURL: `${myIp}/claimsupdate/${util.getCookie('f_region')}/${util.getCookie('grp_id')}/${util.getCookie('f_email')}`, // URL of your API endpoint
    ajaxContentType:"json",
   
    height: "311px", // height of table
    
    layout:'fitColumns',

    htmlOutputConfig:{
        formatCells: true
    },

    //layout:"fitDataFill",
    responsiveLayout:"collapse",
    rowHeader:{
        formatter:"responsiveCollapse",
    },
    rowFormatter:function(row){
        if(row.getData().total == ""){
            row.getElement().style.backgroundColor = "lemonchiffon"; //mark rows with age greater than or equal to 18 as successful;
        }
    },

    columns: [ // Define Table Columns
        { title: "Date", 
            field: "xdate", 
            formatter:"html", 
            headerSort:false, 
            headerHozAlign:"center", 
            resizable:false
        },  

        { title: "Total", 
            field: "total",  
            headerSort:false, 
            headerHozAlign:"center", 
            hozAlign:"right", 
            formatter:'money',
            formatterParams: {
                decimal: ".",
                thousand: ",",
                symbol: "",
                precision:2
            },
            bottomCalc:"sum" ,
            bottomCalcFormatter: "money",
            bottomCalcFormatterParams:  {
                thousand: ",",
                precision:2,
                decimal:"."
            },
            resizable:false
        },  
        /*
        { title: "Delivered", 
            field: "delivered", 
            headerSort:false, 
            headerHozAlign:"center", 
            hozAlign:"center",
            //formatter:'html',
            bottomCalc:'sum',
            bottomCalcFormatter: "money",
            bottomCalcFormatterParams:  {
                thousand: ",",
                precision:0
            },
            //formatter:'html',
            formatter:(cell)=>{
                if(cell.getRow().getData().parcel > 0){
                    if(cell.getRow().getData().parcel > cell.getRow().getData().delivered){
                        console.log('dito')
                        return "<span><i class='ti ti-caret-down-filled'></i>&nbsp;"+ cell.getValue()+"</span>"
                        //return "<span style='color:red'>"+cell.getValue()+"</span>"
                    }else{
                        return cell.getValue()
                    }//eif
                }else{
                    return 0
                }//eif
                
            },

                //formatter sampl
                // formatter: "money",
                // bottomCalc: "sum",
                // bottomCalcParams: {
                // precision: 3
                // },
                // bottomCalcFormatter: "money",
                // bottomCalcFormatterParams:  {
                // decimal: ".",
                // thousand: ",",
                // symbol: "$"
                // },
                // formatterParams: {
                // decimal: ".",
                // thousand: ",",
                // symbol: "$"
                // }

         },
        { title: "Amount", 
            field: "total_amount",
            headerSort:false, 
            headerHozAlign:"center",
            hozAlign:"right",
            formatter:"money", 
            formatterParams:{ thousand:","},
            bottomCalc:'sum',
            //bottomCalcParams:{ precision: 1},
            bottomCalcFormatter: "money",
            bottomCalcFormatterParams:  {
                decimal: ".",
                thousand: ",",
                precision: 2

            // symbol: "$"
            },
            
        },
        { title: "Remitted",
            field: "amount_remitted", 
            headerSort:false, 
            headerHozAlign:"center", 
            hozAlign:"right" ,
            formatter:"money", 
            formatterParams:{ 
                thousand:",", 
                precision:2
            },
            bottomCalc:'sum',
           // bottomCalcParams:{ precision: 1},            
            bottomCalcFormatter: "money",
            bottomCalcFormatterParams:  {
                decimal: ".",
                thousand: ",",
                precision: 2
            // symbol: "$"
            }
        },    
        { title: "Remarks", field: "remarks", formatter:"textarea", headerHozAlign:"center", headerSort:false }
        */
    ],

    locale:"en-us",
    langs:{
        "en-us":{
            "pagination":{
                "page_size":"Page Size", //label for the page size select element
                "first":"<i class='ti ti-player-skip-back-filled'></i>", //text for the first page button
                "first_title":"First Page", //tooltip text for the first page button
                "last":"<i class='ti ti-player-skip-forward-filled'></i>",
                "last_title":"Last Page",
                "prev":"Prev",
                "prev_title":"Prev Page",
                "next":"Next",
                "next_title":"Next Page",
            },
        }
    },
    
    pagination:true, //enable pagination
    paginationMode:"local", //enable remote pagination
    paginationSize: 10, //optional parameter to request a certain number of rows per page
    // paginationCounter:function(pageSize, currentRow, currentPage, totalRows, totalPages){
    //     return `<i class='ti ti-database-search'></i>&nbsp;Showing ${pageSize}  rows of ${totalRows} total`;
    // }
});


