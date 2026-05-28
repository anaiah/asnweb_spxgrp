
// Create Tabulator on DOM element with id "table"
var printPdf = new Tabulator("#pdfprint", {
   
    //ajaxURL: `${myIp}/claimsupdate/${util.getCookie('f_region')}/${util.getCookie('grp_id')}/${util.getCookie('f_email')}`, // URL of your API endpoint
    //ajaxContentType:"json",
   
    height: "360px", // height of table
    
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
        { title: "Rider", 
            field: "rider", 
            formatter:"html", 
            headerSort:false, 
            width:330,
            headerHozAlign:"center", 
            resizable:false,
            formatter:(cell)=>{

                if( cell.getData().pdf_batch!==null ){

                    xpdfbatch =     `ATD # ${cell.getData().pdf_batch}<br>
                    Downloaded by: ${(cell.getData().downloaded_by==null?'NO ID':cell.getData().downloaded_by)}`
                    xpdfbutton =` <a href='javascript:void(0)' onclick="asn.printPdf('${cell.getData().pdf_batch}','${cell.getData().download_empid}')" class='btn btn-primary btn-sm'>RE-PRINT ${cell.getData().pdf_batch}</a>
                    <a href='javascript:void(0)' onclick="asn.resetPdf('${cell.getData().pdf_batch}','${cell.getData().download_empid}')" class='btn btn-danger btn-sm'>RESET ${cell.getData().pdf_batch}</a>
                    `
                   
                }else{
                    xpdfbatch = "ATD PDF NOT YET PROCESSED"
                    xpdfbutton =` <a href='javascript:void(0)' id ='btn-${cell.getData().id}' onclick="asn.addtoprint('${cell.getData().id}','${cell.getData().rider}','${cell.getData().emp_id}')" class='btn btn-danger btn-sm'>Remove </a>`
                }//eif

                return  `
                    Record ID# ${cell.getData().id}<br>
                    Record Count: ${cell.getData().id_count}<br>
                    <b>${cell.getData().rider}</b>&nbsp;<i style='color:green;font-size:2em;' class='ti ti-circle-check ' id='${cell.getData().id}'></i><br>
                    ${cell.getData().emp_id}<br>
                    <span style='color:red'>${xpdfbatch}</span><br>
                    ${xpdfbutton}&nbsp;`

            },
        },  
        { title: "Batch/Yr.", 
            field: "batch_file", 
            formatter:"html", 
            headerSort:false, 
            headerHozAlign:"center",
            hozAlign:"center", 
            width:120,
            resizable:false,
            formatter:(cell)=>{
                return`
                    ${cell.getData().batch_file}, ${cell.getData().transaction_year}
                `
            }
        },
         { title: "Region/Hub", 
            field: "region", 
            formatter:"html", 
            headerSort:false, 
            headerHozAlign:"center",
            hozAlign:"center", 
            width:120,
            resizable:false,
            formatter:(cell)=>{
                return`
                     (${cell.getData().region || 'NO REGION'}, ${cell.getData().hub})
                    `
            }
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
            width:120,
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

    locale: "en-us",
    langs: {
        "en-us": {
            "pagination": {
                "page_size": "Page Size",
                "first": "&#9194;",       // Shows ⏮ (Media Skip Back block)
                "first_title": "First Page",
                "last": "&#9193;",        // Shows ⏭ (Media Skip Forward block)
                "last_title": "Last Page",
                "prev": "&#9664; Prev",   // Shows ◀ Prev (Solid triangle arrow)
                "prev_title": "Prev Page",
                "next": "Next &#9654;",   // Shows Next ▶ (Solid triangle arrow)
                "next_title": "Next Page"
            }
        }
    },
    
    pagination: true,
    paginationMode: "local", 
    paginationSize: 10,
    paginationSizeSelector: [10, 25, 50, 100], 
    /*
    paginationCounter: function(pageSize, currentRow, currentPage, totalRows, totalPages) {
        if (totalRows === 0) return "<i class='fa-solid fa-database'></i> No records found";
        
        return `<i class='fa-solid fa-magnifying-glass'></i> Showing <b>${currentRow}</b> - <b>${Math.min(currentRow + pageSize - 1, totalRows)}</b> of <b>${totalRows}</b> entries`;
    }
*/


});


