/*

author : Carlo O. Dominguez

*/

//
//speech synthesis
import { xlsReport } from './mod-report.js';

const asn = {
	
    offset: 0,

    shopCart: [],
    
    //online version socket.io
    //socket:io.connect("https://osndp.onrender.com"),

    socket:null,

    //=========================START VOICE SYNTHESIS ===============
    getVoice: async () => {
                
        voices = synth.getVoices()
        console.log( 'GETVOICE()')
                
        voices.every(value => {
            if(value.name.indexOf("English")>-1){
                console.log( "main.js bingo!-->",value.name, value.lang )
                
            }
        })
        
    },//end func getvoice

    //speak method
    speak:(theMsg)=> {
                        
        console.log("SPEAK()")
        
        // If the speech mode is on we dont want to load
        // another speech
        if(synth.speaking) {
            //alert('Already speaking....');
            return;
        }	

        const speakText = new SpeechSynthesisUtterance(theMsg);

        // When the speaking is ended this method is fired
        speakText.onend = e => {
            //synth.resume();
            console.log('Speaking is done!');
        };
        
        // When any error occurs this method is fired
        speakText.error = e=> {
            console.error('Error occurred...');
        };

        // Checking which voices has been chosen from the selection
        // and setting the voice to the chosen voice
        
        
        voices.forEach(voice => {
            if(voice.name.indexOf("English")>-1){	
                ///// take out bring back later, 
                //console.log("speaking voice is ",voice.name)
                speakText.voice = voice
                
            }
            
        });

        // Setting the rate and pitch of the voice
        speakText.rate = 1
        speakText.pitch = 1

        // Finally calling the speech function that enables speech
        synth.speak(speakText)

        synth.cancel()

    },//end func speak	
    //=======================END VOICE SYNTHESIS==========

    //===========================addtocart
    addtoCart:async (elemId, eqptId, nKey) =>{
        let qtys = document.getElementById(elemId)
        let adata = osndp.dataforTag[nKey].equipment_value
        const badge = document.getElementById('bell-badge')
            
        //console.log(nKey)

        if(osndp.shopCart.length > 0){
        
            let oFind = osndp.shopCart.find( (cart)=> cart.id == eqptId)
             
            if(oFind === undefined){
                osndp.shopCart.push({
                    id: eqptId, 
                    data: adata,
                    qty: qtys.value,
                    price: osndp.dataforTag[nKey].price,
                    sale: osndp.dataforTag[nKey].sale_price,
                    total: qtys.value * osndp.dataforTag[nKey].sale_price
                })

                badge.innerHTML = osndp.shopCart.length
                
                util.Toast("Item Successfully Added!",2000)
            }else{
                  
                console.log('present!,...ignore')
                util.Toast('THIS ITEM IS ALREADY IN CART!',2000)
                return true;  
            }
        
        }else{
            osndp.shopCart.push({
                id: eqptId, 
                data: adata,
                qty: qtys.value,
                price: osndp.dataforTag[nKey].price,
                sale: osndp.dataforTag[nKey].sale_price,
                total: qtys.value * osndp.dataforTag[nKey].sale_price
            })

            badge.innerHTML = osndp.shopCart.length
            
            util.Toast("Item Successfully Added!",2000)
        }
   
        console.log( '====TOTAL SHOPCART===',osndp.shopCart) 
    },


    showCartModal:()=>{
        const configObj = { keyboard: false, backdrop:'static' }
        
        let pocartmodal =  new bootstrap.Modal(document.getElementById('pocartModal'),configObj);
        
        let pocartModalEl = document.getElementById('pocartModal')

        if(osndp.shopCart.length == 0){
            util.Toast('SHOPPING CART EMPTY!',2000)
            e.preventDefault()
            e.stopPropagation()
            return false
        
        }else{
            osndp.showcart()
            pocartmodal.show()
          
        }//eif
        
    },

    //======================= show cart
    showcart:() => {
                
        if(osndp.shopCart.length > 0){
            
            document.getElementById('cart-content').innerHTML = ""
            
            for (let key in osndp.shopCart) {
                
                const info = JSON.parse(osndp.shopCart[key].data)

                document.getElementById('cart-content').innerHTML += `
                <a class="dropdown-item d-flex align-items-center" href="javascript:void(0)">
                <div class="me-3">
                    <div class="bg-primary icon-circle"><i class="fas fa-file-alt text-white"></i></div>
                </div>
                <div>
                
                <span class=eqptno>
                ${info.equipment_type.toUpperCase()}<br>
                ${info.eqpt_description}<br>
                </span>
                <span class='eqptmain' >
                ${info.serial}<br>
                Qty. ${osndp.shopCart[key].qty}<br>
                Price : &#8369;${ util.addCommas(parseFloat(osndp.shopCart[key].sale).toFixed(2)) }<br>
                TOTAL : &#8369;${ util.addCommas(parseFloat(osndp.shopCart[key].total).toFixed(2)) }<br></span>
                </div>
                </a>`
                
            }//===========end for next
        } 
    },

    getimagename:()=>{
        document.getElementById('serial_image').value = document.getElementById('client_po').value
    },
   
    //===========================show modal and iamge
    showPdf: async (src) => {
        console.log('*** showImage() ****')
        console.log(src)
      
        osndp.fileExists( src )
        
    },

    //=============== SHOW COMMENT MODAL ============//
    showIssue: async (id) => {
        console.log('==eo site number== ', id)
        util.modalShow('commentsModal')
    },

    //===check file exist in server
    fileExists:async (url, )=> {
        const configObj = { keyboard: false, backdrop:'static' }
        const ximagemodal =  new bootstrap.Modal(document.getElementById('imageModal'),configObj);
        const imageModalEl = document.getElementById('imageModal')
        let pdfprev = document.getElementById('pdf_iframe')

        console.log('=====osndp.fileExists()===',url)
        await fetch( `https://localhost:10000/fileexist/${url}`)
        .then(response => { 
            return response.json()
        })
        .then( (data)=>{
            if (data.status) { 
                console.log("File exists"); 
                pdfprev.src =`https://vantaztic.com/osndp/${url}`
                ximagemodal.show()
                pdfprev.width = window.innerWidth
    
            } else { 
                console.log("File does not exist"); 
                alert('ERROR, FILE NOT FOUND!')
                //document.getElementById('pdf-modal-body').innerHTML=""
                //osndp.alertMsg('File not Found!','danger','pdf-modal-body')
                ximagemodal.hide()
                pdfprev.src = ""
            } 
        }) 
        .catch(error => { 
            console.log("An error occurred: ", error); 
        })
        
        imageModalEl.addEventListener('hide.bs.modal', function (event) {
            pdfprev.src += '';
        })
         
    },

    //for badge countr
    fetchBadgeData: async()=>{ //first to fire to update badge
        fetch(`/fetch\\data`).then((response) => {  //promise... then 
            return response.json();
        })
        .then((data) => {
            
            console.log(data)
            //==== update badage for pending approv
            const badge = document.getElementById('bell-badge')
            badge.innerHTML = data.result[2].status_count

            const rentbadge = document.getElementById('rent-badge')
            rentbadge.innerHTML = data.result[0].status_count
            
            const salebadge = document.getElementById('sale-badge')
            salebadge.innerHTML = data.result[1].status_count
            
        })
        .catch((error) => {
            util.Toast(`Error:,dito nga ${error}`,1000)
            console.error('Error:', error)
        })    

    },

    /*
    filterArr:(cSerial, aArrid, transtype) => {
       		
        //table
        const  tbodyRef = document.getElementById('dataTagTable').getElementsByTagName('tbody')[0];
        tbodyRef.innerHTML="" //RESET FIRST

        let newRow = tbodyRef.insertRow();
        // Insert a cell
        let cell1 = newRow.insertCell(0);
        let cell2 = newRow.insertCell(1);
        let cell3 = newRow.insertCell(2);
        
        let newArray = osndp.dataforTag.filter(function (el)
        {
          return el.equipment_id  == aArrid //return object record if id matched with param ID
        }
        )
        let newVal = JSON.parse(newArray[0].equipment_value)
        
        ////console.log( newVal)
        //value
        cell1.innerHTML =   `<span class='eqptno' >${newVal.serial}<br>
        ${newVal.equipment_type.toUpperCase()}<br>${newVal.eqpt_description}</span>`
        
        cell2.innerHTML =   `&#8369;${util.addCommas(parseFloat(newVal.price).toFixed(2))}`
        cell2.style.textAlign = "right"
        
        cell3.innerHTML =   newVal.date_reg
        
        let divrentsale = document.getElementById('div-rent-sale')
        divrentsale.innerHTML='' //reset
        
        //=============template
        if(transtype=="rent"){
            divrentsale.innerHTML=`
            <div class="row">
            <div class="col">
                <label for="client_po">PO Number</label>
                <input type="text" onkeydown='javascript:imagepo()' style="text-transform: uppercase" id="client_po" name="client_po" class="form-control equipmentxx" value=""  required/>
            </div>           
            </div>
            <div class="row">
            <div class="col">
                <label for="client_invoice">Invoice Number</label>
                <input type="text" style="text-transform: uppercase" id="client_invoice" name="client_invoice" class="form-control equipmentxx" value=""  required/>
            </div>           
            </div>
            <div class="row">
            <div class="col">
                <label for="client_name">Client Full Name</label>
                <input type="text" style="text-transform: uppercase" id="client_name" name="client_name" class="form-control equipmentxx" value=""  required/>
            </div>           
            </div>
            <div class="row">
            <div class="col">
                <label for="company_name">Company Name</label>
                <input type="text" style="text-transform: uppercase" id="company_name" name="company_name" class="form-control equipmentxx" value=""  required/>
            </div>           
            </div>
            <div class="row">
            <div class="col">
                <label for="company_address">Company Address</label>
                <input type="text" style="text-transform: uppercase" id="company_address" name="company_address" class="form-control equipmentxx" value=""  required/>
            </div>           
            </div>
            <div class="row"> 
            <div class="col">
                <label for="company_phone">Company Phone</label>
                <input type="text" id="company_phone" name="company_phone" placeholder="0917-123-1234" pattern="[0-9]{4}-[0-9]{3}-[0-9]{4}" class="form-control equipmentxx" value=""  required/>
            </div>           
            </div>
            <div class="row">
            <div class="col">
                <label for="company_email">Company Email</label>
                <input type="email" style="text-transform: lowercase" id="company_email" name="company_email" class="form-control equipmentxx" value=""  required/>
            </div>           
            </div>
            <div class="row">
            <div class="col">
                <label for="rent-price">Rent Price</label>
                <input type="text" id="eqpt_id" name="eqpt_id" value="${aArrid}" class="lets-hide">
                <input type="text" id="trans_type" name="trans_type" value="rent" class="lets-hide">
                <input type="number" step="0.01" placeholder="0.00" class="form-control equipmentxx" id="rent_price" name="rent_price" required  />
            </div>           
            </div>
            <div class="row">
                <div class="col">
                    <label for="rent-start">Rent Start</label>
                    <input type="date" class="form-control equipmentxx" id="rent_start" name="rent_start" required />    
                </div>           
            </div>
            <div class="row">
                <div class="col">
                    <label for="rent-end">Rent End</label>
                    <input type="date" class="form-control equipmentxx" id="rent_end" name="rent_end" required />    
                </div>           
            </div>
            <div class="row">
                <div class="col">
                    <label class="form-label " for="client_remarks">Remarks</label>
                    <textarea class="form-control equipmentxx" id="client_remarks" name="client_remarks" rows="4" required></textarea>
                </div>  
            </div>
            `
        }else{  //==============SALE
            divrentsale.innerHTML=`
            <div class="row">
            <div class="col">
                <label for="client_po">PO Number</label>
                <input type="text" style="text-transform: uppercase" id="client_po" name="client_po" class="form-control equipmentxx" value=""  required/>
            </div>           
            </div>
            <div class="row">
            <div class="col">
                <label for="client_invoice">Invoice Number</label>
                <input type="text" style="text-transform: uppercase" id="client_invoice" name="client_invoice" class="form-control equipmentxx" value=""  required/>
            </div>           
            </div>            
            <div class="row">
            <div class="col">
                <label for="client_name">Client Full Name</label>
                <input type="text" style="text-transform: uppercase" id="client_name" name="client_name" class="form-control equipmentxx" value=""  required/>
            </div>           
            </div>
            <div class="row">
            <div class="col">
                <label for="company_name">Company Name</label>
                <input type="text"  style="text-transform: uppercase" id="company_name" name="company_name" class="form-control equipmentxx" value=""  required/>
            </div>           
            </div>
            <div class="row">
            <div class="col">
                <label for="company_address">Company Address</label>
                <input type="text" style="text-transform: uppercase" id="company_address" name="company_address" class="form-control equipmentxx" value=""  required/>
            </div>           
            </div>
            <div class="row">
            <div class="col">
                <label for="company_phone">Company Phone</label>
                <input type="text" id="company_phone" name="company_phone" value="" placeholder="0917-123-1234" pattern="[0-9]{4}-[0-9]{3}-[0-9]{4}" class="form-control equipmentxx" value=""  required/>
            </div>           
            </div>
            <div class="row">
            <div class="col">
                <label for="company_email">Company Email</label>
                <input type="email" style="text-transform: lowercase" id="company_email" name="company_email" value="" class="form-control equipmentxx" value=""  required/>
            </div>           
            </div>
            <div class="row">
                <div class="col">
                    <label for="sale-price">Sale Price</label>
                    <input type="text" id="eqpt_id" name="eqpt_id" value="${aArrid}" class="lets-hide">
                    <input type="text" id="trans_type" name="trans_type" value="sale" class="lets-hide">
                    <input type="number" min=1000 step="0.01" placeholder="0.00" value="9999" class="form-control equipmentxx" id="sale_price" name="sale_price" required />
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <label class="form-label " for="client_remarks">Remarks</label>
                    <textarea class="form-control equipmentxx" id="client_remarks" name="client_remarks" rows="4" required></textarea>
                </div>  
            </div>
            `
        }    
         //==load modal for tagging
        util.loadModals('equipmentTagModal','equipmentTagForm','#equipmentTagForm','equipmentTagPlaceHolder') //PRE-LOAD MODALS)
	    util.modalShow('equipmenttagmodal')

        
    },
    */

    //===========OPEN MODAL FOR CATEGORY OF SELECTED EQUIPMENT===========
    showMallCategory:(cCategory,cTxt)=>{
        console.log('showmallcategory()',cTxt)
        if(cCategory==""){
            return false
        }
        ///console.log('chosen is ', cCategory)
        //off keyboard cofig
        const configObj = { keyboard: false, backdrop:'static' }

        const eqptcatmodal =  new bootstrap.Modal(document.getElementById('equipmentTypeModal'),configObj);
            
        let eqptcatModalEl = document.getElementById('equipmentTypeModal')

        eqptcatModalEl.addEventListener('hide.bs.modal', function (event) {
            
            //take away alert
            let cDiv = document.getElementById('equipmentTypePlaceHolder')
            cDiv.innerHTML=""

            //this is for the next element to have focus
            //readonly field gets checked is-valid w/ chek icon
            document.getElementById("mall_description").focus()
            document.getElementById("mall_description").blur()

            //then moves the next field with focus()
            setTimeout(() => document.getElementById("business_name").focus(), 0)
            
        },false)
        
       document.getElementById('mall-label').innerHTML = "Select " + cTxt //cCategory 

        //DOM reference for select
        const categoryType = document.getElementById("categoryType");
        
        //reset select content
        categoryType.innerHTML = ""

        //get equipment type,
        osndp.getMall(`https://localhost:10000/getmall/${cCategory}`, categoryType)

        eqptcatmodal.show() /// show modal box

    },


    //=== FOR POPULATING DROPDOWN SELECT
    populate:async ( selectElement, department )=>{
        console.log( 'osndp.populate() ')
        osndp.removeOptions( selectElement) //restart

        let xurl
                
        switch(department){
            case "design":
                xurl = `https://localhost:10000/getProjectOwner/design` 
            break
            case "engineer":
                xurl = `https://localhost:10000/getProjectOwner/engineer` 
            break
        }


        await fetch( xurl )
        .then(response => { 
            return response.json()
        })
        .then( (data)=>{
            console.log('populate',data)

            let option = document.createElement("option")
            option.setAttribute('value', "")
            option.setAttribute('selected','selected')
              
            let optionText = document.createTextNode( "-- Pls Select --" )
            option.appendChild(optionText)
            
            selectElement.appendChild(option)
            
            for (let key in data.result) {
                let option = document.createElement("option")
                option.setAttribute('value', data.result[key].full_name.toUpperCase())
              
                let optionText = document.createTextNode( data.result[key].full_name.toUpperCase() )
                option.appendChild(optionText)
              
                selectElement.appendChild(option)
            }

            selectElement.focus()
        
        }) 
        .catch(error => { 
            console.log("An error occurred: ", error); 
        })        

    },
    
    removeOptions: (selectElement) => {
        var i, L = selectElement.options.length - 1;
        for(i = L; i >= 0; i--) {
           selectElement.remove(i);
        }
    },

    //===get Malls
    //esp getting values for SELECT DROPDOWNS
    getMall:(url,cSelect)=>{

        fetch(url)
        .then((response) => {  //promise... then 
            return response.json();
        })
        .then((data) => {
            //console.log( 'webmall ',data )
            
            osndp.removeOptions( cSelect)

            let option = document.createElement("option")
            option.setAttribute('value', "")
            option.setAttribute('selected','selected')
              
            let optionText = document.createTextNode( "-- Pls Select --" )
            option.appendChild(optionText)
            
            cSelect.appendChild(option)
            

            for (let key in data.result) {
                let option = document.createElement("option")
                option.setAttribute('value', data.result[key].mall_name)
              
                let optionText = document.createTextNode( data.result[key].mall_name )
                option.appendChild(optionText)
              
                cSelect.appendChild(option)
            }

            cSelect.focus()
            
        })
        .catch((error) => {
            util.Toast(`Error:, ${error}`,1000)
            console.error('Error:', error)
        })
    },
        
    updateMallDesc:(optionValue)=>{
        //dom reference
        //eqptdesc.focus()
        
        const eqptdesc = document.getElementById('mall_description')
        eqptdesc.value = optionValue
        
        
       // document.getElementById("business_name").focus()
    },


    //filter mall
    filterMall:(url,cSelect)=>{
        console.log('===filterMall() osndp.filterMall()===')
        fetch(url)
        .then((response) => {  //promise... then 
            return response.json();
        })
        .then((data) => {
            //console.log( 'webmall ',data )
            
            osndp.removeOptions( cSelect)
            /* TAKE OUT PLS SELECT VALUE
            let option = document.createElement("option")
            option.setAttribute('value', "")
            //option.setAttribute('selected','selected')
              
            let optionText = document.createTextNode( "-- Pls Select --" )
            option.appendChild(optionText)
          
            cSelect.appendChild(option)
            */

            for (let key in data.result) {
                let option = document.createElement("option")
                option.setAttribute('value', data.result[key].unique_id)
              
                let optionText = document.createTextNode( data.result[key].mall_name )
                option.appendChild(optionText)
              
                cSelect.appendChild(option)
            }

            cSelect.focus()
            
        })
        .catch((error) => {
            util.Toast(`Error:, ${error}`,1000)
            console.error('Error:', error)
        })
    },

    //===============filter method
    filterBy:(val)=>{

        //==========Filter By====
        
        console.log('==filterBy()===', val )

        osndp.getAll("1", val )
        ///// temporarily out osndp.fetchBadgeData()
    },

    //===== get transaction if rent or sale
    getTransact:(ctype)=>{
        const configObj = { keyboard: false, backdrop:'static' }
        const transModal =  new bootstrap.Modal(document.getElementById('msgModal'),configObj);
        
        const msg = document.getElementById('xmsg4')
        msg.innerHTML = `Are you sure this is for ${ctype.toUpperCase()}?`
        transModal.show()
        
    },

    //===========for socket.io
    getMsg:()=>{
        console.log( '====getMsg()=== ')
        
        /*
        osndp.socket.on('sales', (oMsg) => {
            let xmsg = JSON.parse(oMsg)

            util.speak( xmsg.msg )

            ///// temporarily out   osndp.fetchBadgeData()// update badges
        
        })
          */  
        
    },
    //=======check file size before upload
    //for now acceptable is 2mb max
    checkFileSize:()=>{
        const fi = document.getElementById('uploaded_file');
        // Check if any file is selected.
        if (fi.files.length > 0) {
            for (let i = 0; i <= fi.files.length - 1; i++) {

                const fsize = fi.files.item(i).size;
                const file = Math.round((fsize / 1024));
                // The size of the file.
                if (file >= 1000) {
                    const btnupload = document.getElementById('mall-save-btn')
                    btnupload.disabled = true

                    util.alertMsg("File too Big, please select a file less than 1mb","danger","size");
                    
                    fi.value=null
                    //go bottom page
                    util.scrollsTo('blindspot')

                    return false;

                }else{
                    
                    document.getElementById('size').innerHTML=""//reset
                    const btnupload = document.getElementById('mall-save-btn')
                    btnupload.disabled = false
                }
                /* turn off display of filesize */
                ///document.getElementById('size').innerHTML ='<b>'+ file + '</b> KB';
                
            }
        }
    },

    //======main func get all Claims per person =====
    getClaims: async (emp_id, emp_name)=>{
        console.log('==running getClaims()')
        
        await fetch(`${myIp}/getclaims/${emp_id}/${emp_name}/3/${nPage}`,{
            cache:'reload'
        })
        .then(res => res.text() )

        .then(text => {	
        
            util.scrollsTo('current_projects')
        })	
        .catch((error) => {
            //util.Toast(`Error:, ${error}`,1000)
            console.error('Error:', error)
        })    
    },

    notif:(msg,xclear)=>{
        if(!xclear){
            document.getElementById('p-notif').innerHTML = `<i id='i-notif' class='fa fa-spinner fa-pulse' ></i>
            &nbsp;<span id='s-notif'>${msg}</span>`
        }else{
            document.getElementById('p-notif').innerHTML = ""
        }
        
    },

    speaks:null,

    collapz: () => {
        console.log('Setting up collapse...');
        const links = document.querySelectorAll('#sidebarnav a');
        console.log('Links found:', links.length);
        
        console.log('Window width:', window.innerWidth);
                

        links.forEach(function(link) {
          link.addEventListener('click', function(e) {
            e.preventDefault();
      
            const hrefAttr = this.getAttribute('href');

            if (hrefAttr.startsWith('#')) {
                // Handle in-page anchor
                document.querySelector(hrefAttr).scrollIntoView({ behavior: 'smooth' });
            } else if (hrefAttr.startsWith('javascript:')) {
                // Extract and call the function
                // const funcName = hrefAttr.substring('javascript:'.length);
                // window[funcName]();
                // Extract the code after 'javascript:'
                const jsCode = hrefAttr.substring('javascript:'.length).trim();
                    
                // If the code is a function call like util.goNow()
                // or just an expression, you can use Function constructor:

                try {
                    // Create a new Function and execute it safely
                    new Function(jsCode)();
                } catch (err) {
                    console.error('Error executing JavaScript from href:', err);
                }


                //window.eval(hrefAttr)
            }

            if (window.innerWidth < 1200) {
              const toggleBtn = document.getElementById('sidebarCollapse');
              if (toggleBtn) {
                console.log('Clicking sidebarCollapse button');
                toggleBtn.click();
              } else {
                console.log('No sidebarCollapse element found');
                // fallback: manually hide sidebar
              }
            }
          });
        });
    },

    //====function for searching records======
    // getRecord: async (e_num,e_name, filter_type, hub, xyear) =>{

    //     console.log('====filter',  filter_type)
    //     let xmsg
    //     asn.pdfCart.length = 0
    //     asn.obj = {}

    //     if(e_num=="" && e_name=="" && hub==""){
    //         console.log('both blank')
    //         xmsg = "<div class='text-wrap' style='width: 20rem;'>PLS CHECK YOUR INPUT, YOU CAN SEARCH BY EMPLOYEE NUMBER OR BY EMPLOYEE NAME!</div>"
            
    //         asn.speaks('PLEASE CHECK YOUR INPUT, YOU CAN SEARCH BY EMPLOYEE NUMBER OR BY EMPLOYEE NAME!')
            
    //         Toastify({
    //             text: xmsg ,
    //             duration:3000,
    //             escapeMarkup:false, //to create html
    //             close:false,
    //             position:'center',
    //             offset:{
    //                 x: 0,
    //                 y:100//window.innerHeight/2 // vertical axis - can be a number or a string indicating unity. eg: '2em'
    //             },
    //             style: {
    //               background: "linear-gradient(to right, #00b09b, #96c93d)",
    //             }
    //         }).showToast();
    //         return false
        
    //     }

    //     let xclass = [], aForm = ['filter_number','filter_name']
    //     xclass.push(document.getElementById('filter_number').className ) 
    //     xclass.push(document.getElementById('filter_name').className)

    //     let nn = xclass.indexOf('form-control is-invalid')
        
    //     if ( nn > -1 ){
    //         xmsg = "<div class='text-wrap' style='width: 20rem;'>PLS CHECK YOUR INPUT, THERE'S ERROR!</div>"
            
    //         asn.speaks(`PLEASE CHECK YOUR INPUT, THERE'S AN ERROR!!!`)

    //         Toastify({
    //             text: xmsg ,
    //             duration:3000,
    //             escapeMarkup:false, //to create html
    //             close:false,
    //             position:'center', 
    //             offset:{
    //                 x: 0,
    //                 y:100//window.innerHeight/2 // vertical axis - can be a number or a string indicating unity. eg: '2em'
    //             },
    //             style: {
    //                 background: "linear-gradient(to right, #00b09b, #96c93d)",
    //             }
    //         }).showToast();

    //         document.getElementById( aForm[nn] ).classList.remove('is-invalid')
    //         document.getElementById( aForm[nn] ).value=""

    //         return false         
    //     }else{

    //         //************************ */
    //         //* IF  ALL  IS OK,  THEN  
    //         // FIRE  SEARCH
    //         //************************ */
            
    //         asn.pdfCart.length = 0
    //         asn.obj = {}

    //         console.log('redy to search')
    //         asn.speaks( 'Searching.... !!!')

    //         document.getElementById('searchField').classList.remove('d-none') // show card

    //         // Clean fallback strategy using logical OR (||)
    //         const searchNum = e_num || 'blank';
    //         const searchName = e_name || 'blank';
    //         const searchHub = hub || 'blank'; // Easily handle your new hub parameter

    //         // Build path cleanly using template literals
    //         const xurl = `${myIp}/getrecord/${searchNum}/${searchName}/${searchHub}/${util.getCookie('f_region')}/${util.getCookie('grp_id')}/${util.getCookie('f_email')}/${filter_type}`;
            
    //         await fetch( xurl ,{
    //             cache:'reload'
    //         })
    //         .then(res => res.json() )

    //         .then(data => {	
    //             console.log( data.xdata)

    //             //****  THEE  NEW  SEARCH RESULT */
    //             //set to datagrid
    //             printPdf.setData( data.xdata )//set data to grid
                
    //             //====show  grid
    //             document.getElementById('pdfprint').classList.remove('evaporate')
                
    //             //====== put  on download buttons
    //             document.getElementById('download-buttons').innerHTML = data.btn

    //             //***COPY ARRAY RESULT TO asn.pdfCart Array  ***** */
    //             asn.pdfCart = data.xdata.map(({ id, rider, emp_id: empid }) => ({
    //                 id,
    //                 rider,
    //                 empid
    //             }));

    //             console.log('*** ALL CART ***', asn.pdfCart)

    //             // document.getElementById('search_claim').innerHTML = ""
    //             // document.getElementById('search_claim').innerHTML = data.text

    //             // const element = document.getElementById('list_atd');

    //             // if (element) {
    //             //     element.style.display = 'block'; // Or 'inline', 'inline-block', '' etc.
    //             // }
                                
    //             util.scrollsTo('i-save')
            
    //         })	
    //         .catch((error) => {
    //             //util.Toast(`Error:, ${error}`,1000)
    //             console.error('Error:', error)
    //         })    
    //     }///eif
    // },
    getRecord: async (e_num, e_name, filter_type, hub, xyear) => {
        console.log('==== Processing Record Search Filter Mode:', filter_type, xyear);
        
        // 1. Reset target array states immediately
        asn.pdfCart.length = 0;
        asn.obj = {};

        // 2. CHECK FOR ALL BLANK FIELDS (Validation Safeguard)
        if (!e_num && !e_name && !hub) {
            console.log('Validation Error: All inputs left blank.');
            const errorMsg = "<div class='text-wrap' style='width: 20rem;'>PLS CHECK YOUR INPUT, YOU CAN SEARCH BY EMPLOYEE NUMBER OR BY EMPLOYEE NAME!</div>";
            
            asn.speaks('PLEASE CHECK YOUR INPUT, YOU CAN SEARCH BY EMPLOYEE NUMBER OR BY EMPLOYEE NAME!');
            
            Toastify({
                text: errorMsg,
                duration: 3000,
                escapeMarkup: false,
                close: false,
                position: 'center',
                offset: { x: 0, y: 100 },
                style: { background: "linear-gradient(to right, #00b09b, #96c93d)" }
            }).showToast();
            
            return false;
        }

        // 3. IS-INVALID INTERIOR INPUT VALIDATION CHECK
        const numInput  = document.getElementById('filter_number');
        const nameInput = document.getElementById('filter_name');

        const isNumInvalid  = numInput && numInput.classList.contains('is-invalid');
        const isNameInvalid = nameInput && nameInput.classList.contains('is-invalid');

        if (isNumInvalid || isNameInvalid) {
            const validationMsg = "<div class='text-wrap' style='width: 20rem;'>PLS CHECK YOUR INPUT, THERE'S ERROR!</div>";
            asn.speaks(`PLEASE CHECK YOUR INPUT, THERE'S AN ERROR!!!`);

            Toastify({
                text: validationMsg,
                duration: 3000,
                escapeMarkup: false,
                close: false,
                position: 'center',
                offset: { x: 0, y: 100 },
                style: { background: "linear-gradient(to right, #00b09b, #96c93d)" }
            }).showToast();

            // Clear out the offending elements instantly
            if (isNumInvalid) {
                numInput.classList.remove('is-invalid');
                numInput.value = "";
            }
            if (isNameInvalid) {
                nameInput.classList.remove('is-invalid');
                nameInput.value = "";
            }

            return false;         
        }

        // ========================================================
        // 4. ALL CHECKS PASS -> RUN SEARCH LIFECYCLE
        // ========================================================
        console.log('Validation passed. Executing database record fetch profile...');
        asn.speaks('Searching.... !!!');

        // Capture structural elements safely
        const searchCard      = document.getElementById('searchField');
        const gridPrintContainer = document.getElementById('pdfprint');
        const downloadActionBox = document.getElementById('download-buttons');

        if (searchCard) searchCard.classList.remove('d-none'); // Un-hide dashboard component card

        // Map inputs with robust string segment replacements
        const searchNum  = e_num ? e_num.trim() : 'blank';
        const searchName = e_name ? e_name.trim() : 'blank';
        const searchHub  = hub ? hub.trim() : 'blank';
        const targetYear = xyear ;

        const region  = util.getCookie('f_region') || 'NA';
        const grpId   = util.getCookie('grp_id') || 'NA';
        const fEmail  = util.getCookie('f_email') || 'NA';

        // 5. Construct URL path structure including your xyear parameter at the tail end
        // Pattern: /getrecord/:num/:name/:hub/:region/:groupId/:email/:filterType/:year
        const xurl = `${myIp}/getrecord/${encodeURIComponent(searchNum)}/${encodeURIComponent(searchName)}/${encodeURIComponent(searchHub)}/${encodeURIComponent(region)}/${encodeURIComponent(grpId)}/${encodeURIComponent(fEmail)}/${encodeURIComponent(filter_type)}/${encodeURIComponent(targetYear)}`;
        console.log('*****getRecord() - Constructed URL:', xurl);

        try {
            const response = await fetch(xurl, { cache: 'reload' });

            if (!response.ok) {
                throw new Error(`HTTP data collection error network status code: ${response.status}`);
            }

            const data = await response.json();
            console.log('Record Database Response Package:', data);

            // Set content onto datagrid instance safely
            if (data.xdata) {
                printPdf.setData(data.xdata);
                
                // Copy values into array reference cache container maps
                asn.pdfCart = data.xdata.map(({ id, rider, emp_id: empid }) => ({
                    id,
                    rider,
                    empid
                }));
                console.log('*** Syncing Local Cart Registry Arrays ***', asn.pdfCart);
            }

            // Un-hide grid viewport animations and bind structural buttons markup strings
            if (gridPrintContainer) gridPrintContainer.classList.remove('evaporate');
            if (downloadActionBox) downloadActionBox.innerHTML = data.btn || '';

            // Transition scroll viewpoint safely to finish
            util.scrollsTo('i-save');

        } catch (error) {
            console.error('Failed executing getRecord endpoint payload operations safely:', error);
        }
    },


    //==================RESET PDF===============//
    resetPdf:async(batch,downloadId)=>{
        //console.log(downloadId, util.getCookie('f_id'))
        
        if( parseInt(downloadId) == parseInt(util.getCookie('f_id'))){

            await fetch(`${myIp}/resetpdf/${batch}` ,{
                cache:'reload'
            })
            .then(res => res.json() )

            .then(data => {	

                if(data.status){
                    util.speak('RECORD SUCCESSFULLY UPDATED!')
                }else{
                    util.speak('RECORD UPDATE FAILED!!!')
                }

                console.log('reset!',data)
            })	
            .catch((error) => {
                //util.Toast(`Error:, ${error}`,1000)
                console.error('Error:', error)
            })  
        }else{
            util.speak('SORRY YOU HAVE NO AUTHORITY TO RESET THIS!')
        }    
    },


    //===Hide search Card
    hideSearch:() =>{
        const element = document.getElementById('list_atd');

        if (element) {
            element.style.display = 'none'; // Or 'inline', 'inline-block', '' etc.
        }
    },

    pdfCart:[],
    obj:{},

    //=== for selectting record IDs to include in printing
    addtoprint:(id,rider,empid)=>{

        asn.obj = {} //====reset obj every click=====

        //==========FIRST REMOVE THE ID if IT'S ALREADY IN THE CART=====
        let index = asn.pdfCart.findIndex( x => x.id === parseInt(id) )

        //remove if found
        if (index > -1) {  // Value found
           
            asn.pdfCart.splice(index, 1);  // Remove 1 element at the index
           
            document.getElementById(id).classList.add('ti-circle-x')
            document.getElementById(id).classList.remove('ti-circle-check')
            document.getElementById(`btn-${id}`).textContent = 'Add Again!'
            

        //==========bring it back
        }else{
            asn.obj.id = parseInt(id)
            asn.obj.rider = rider
            asn.obj.empid = empid

            asn.pdfCart.push( asn.obj)

             document.getElementById(`btn-${id}`).textContent = 'Remove'
            
            document.getElementById(id).classList.remove('ti-circle-x')
            document.getElementById(id).classList.add('ti-circle-check')
        }//eidf

        /*
        if(asn.pdfCart.length>0){
            document.getElementById('download-btn').disabled = false
        }else{
            document.getElementById('download-btn').disabled = true
        }
        */

        console.log('PRINT INCLUDE===', asn.pdfCart )
    },

    
    // ===== this is the final button to prit pdf
    // check if pdf is already produced or not, if produced, don't download again
    printPdf: async (batch, downloadId)=> {
        console.log(downloadId)

        switch( true ){
            case ( parseInt(downloadId) > 0 && parseInt(downloadId) !== parseInt(util.getCookie('f_id')) ):
                util.speak('SORRY...  YOU HAVE NO AUTHORITY TO DOWNLOAD AND PRINT THIS!')
                return false

            break;

            case  (parseInt(downloadId)==0):
            
            break

        }//end case

        let whattofind = batch

        const butt1 = `Are you sure you want to Print?<br /><button type='button' id='btnYes' class='btn btn-primary'>Print</button>
                &nbsp;<button type='button' id='btnNo' class='btn btn-primary'>No</button>`
                        
        Toastify({
            text: butt1,
            duration:0,
            close:false,
            position:'center',
            offset:{
                x: 0,
                y:100//window.innerHeight/2 // vertical axis - can be a number or a string indicating unity. eg: '2em'
            },
            escapeMarkup:false, //to create html
            style: {
                
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast();

        $('#btnYes').on('click', async function () {
           
            var xxx = document.querySelector('.toastify')
            xxx.classList.add('lets-hide')

            asn.speaks('DOWNLOADING PDF PLEASE WAIT!')

            const whoisId = util.getCookie('f_id')
            
            let xfile, xbatch

            if(batch=="new"){
                const response = await fetch(`${myIp}/getbatch`)

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const data = await response.json(); // Parse response as JSON
                console.log('batch id ', data); // Do something with the data
                xfile = `${data.batch}.pdf` 
                xbatch = data.batch

                console.log('pdf cart ', asn.pdfCart)
            }else{

                xfile = `${batch}.pdf`
                xbatch = batch
            }
            

            fetch(`${myIp}/printpdf/${util.getCookie('grp_id')}/${whoisId}/${xbatch}/${whattofind}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ myObjects: asn.pdfCart }), // Convert the array to JSON
                //cache: 'reload' // Remove if you don't need to reload
            })
            .then(response => response.blob())
            .then(blob => URL.createObjectURL(blob))
            .then(url => {
                const a = document.createElement('a');
                a.href = url;
                a.download =  xfile ;//`${pdffile}`; // Set the file name for the download
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            })
            .catch((error) => {
                //util.Toast(`Error:, ${error}`,1000)
                alert(error)
                console.error('Error:', error)
            })    

            //asn.deletepdf(xfile)
        });//==============ENND BTUTTON ==============

        $('#btnNo').on('click', function () {
            
            var xxx = document.querySelector('.toastify')
            xxx.classList.add('lets-hide')
            
            console.log('cancel print pls.')
            return false
        });//============END BUTTON===========


    },

    //===============download report
    createpdf: ( pdffile, whois) =>{
        fetch(`${myIp}/createpdf/${pdffile}/${whois}`,{
            cache:'reload'
        })
        .then(response => { 
            return response.blob()
            // Get the content type from the response headers
            /*
            const contentType = response.headers.get('Content-Type');

            if (contentType && contentType.includes('application/json')) {
                return response.json();
            } else if (contentType && contentType.includes('image/') || contentType.includes('application/octet-stream')) {
                return response.blob();
            } else {
                throw new Error('Unsupported content type: ' + contentType);
            }
                */
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${pdffile}`; // Set the file name for the download
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url); // Clean up the URL object

            //***************************  CLEANUP DELETE PDF *************** */
            asn.deletepdf( pdffile  ) //cleanup pdf
            //*****************************END DELETE********************* */
            
            Toastify({
                text: 'PDF Ready for Download!!!' ,
                duration:3000,
                escapeMarkup:false, //to create html
                close:false,
                position:'center',
                offset:{
                    x: 0,
                    y:100//window.innerHeight/2 // vertical axis - can be a number or a string indicating unity. eg: '2em'
                },
                style: {
                  background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
            }).showToast();
            
            return true

            //delete pdf
        })
       
        .catch((error) => {
            //util.Toast(`Error:, ${error}`,1000)
            alert(error)
            console.error('Error:', error)
        })    

    },

    //==== cleanup
    deletepdf:( pdffile ) =>{
        fetch(`${myIp}/deletepdf/${pdffile}`,{
            cache:'reload'
        })
        .then(response => { 
            return response.json()
        })
        .then( (data ) => {
            if(data.status){

                // Toastify({
                //     text: 'PDF Ready for Download!!!' ,
                //     duration:3000,
                //     escapeMarkup:false, //to create html
                //     close:false,
                //     position:'center',
                //     offset:{
                //         x: 0,
                //         y:100//window.innerHeight/2 // vertical axis - can be a number or a string indicating unity. eg: '2em'
                //     },
                //     style: {
                //       background: "linear-gradient(to right, #00b09b, #96c93d)",
                //     }
                // }).showToast();
  
            }
            
        })
       
        .catch((error) => {
            //util.Toast(`Error:, ${error}`,1000)
            console.error('Error:', error)
        })    

    },

    //==get top 5 hub pasaway
    getTopHub: async (xyear) => {
        console.log('=== Getting Top Hub ====');

        // 1. Gather all cookies cleanly at the beginning into variables
        const region   = util.getCookie('f_region');
        const xregion  = util.getCookie('f_xregion');
        const grpId    = util.getCookie('grp_id') || 'NA';
        const fEmail   = util.getCookie('f_email') || 'NA';
        const hubPanel = document.getElementById('hub');

        // Use a safe fallback string if xyear happens to be null or empty
        const targetYear = xyear ; 

        let targetRegion = region; // Default fallback assignment

        // 2. Evaluate structural route requirements cleanly
        if (region === "ALL") {
            if (xregion !== 'null' && xregion) {
                targetRegion = xregion;
                console.log('Using sub-region parameter mapping tracking:', targetRegion);
            } else {
                console.log('Using primary region fallback parameters:', targetRegion);
            }
        }

        // Construct path variables safely: /Region/GroupID/EmailAddress/Year
        // encodeURIComponent protects characters like spaces or '@' symbols in the URL string
        const xparam = `/${encodeURIComponent(targetRegion)}/${encodeURIComponent(grpId)}/${encodeURIComponent(fEmail)}/${encodeURIComponent(targetYear)}`;
        console.log('Final Request Endpoint String Matrix Parameters:', { xparam, region, xregion, targetYear });

        try {
            // 3. Fire server network request matching reload attributes
            const response = await fetch(`${myIp}/gethub${xparam}`, { cache: 'reload' });

            if (!response.ok) {
                throw new Error(`HTTP network response failure! Status: ${response.status}`);
            }

            const htmlText = await response.text();

            // 4. Update DOM layout segments directly in a single-pass swap
            if (hubPanel) {
                hubPanel.innerHTML = htmlText;
            } else {
                console.warn("Target element container ID #hub was missing from active view.");
            }

            // Execute scroll transitions and kick off down-stream analytics pipeline updates
            util.scrollsTo('hub');

            asn.getTopRider(xyear); // Chain next data retrieval for top riders based on the same year parameter

        } catch (error) {
            console.error('Failed processing top hub analytics parameters safely:', error);
        }
    },

    // =====get top 5 rider pasaway
      // ===== Get Top 5 Rider Pasaway =====
    getTopRider: async (xyear) => {
        console.log('=== Getting Top Rider ====');

        // 1. Gather all cookies cleanly at the beginning into variables
        const region      = util.getCookie('f_region');
        const xregion     = util.getCookie('f_xregion');
        const grpId       = util.getCookie('grp_id') || 'NA';
        const fEmail      = util.getCookie('f_email') || 'NA';
        const riderPanel  = document.getElementById('rider');
        
        // Use a safe fallback string if xyear happens to be null or empty
        const targetYear  = xyear ; 

        let targetRegion = region; // Default fallback assignment

        // 2. Evaluate structural route requirements cleanly
        if (region === "ALL") {
            if (xregion !== 'null' && xregion) {
                targetRegion = xregion;
                console.log('Using sub-region parameter mapping tracking:', targetRegion);
            } else {
                console.log('Using primary region fallback parameters:', targetRegion);
            }
        }

        // Construct path variables safely: /Region/GroupID/EmailAddress/Year
        // encodeURIComponent protects characters like spaces or '@' symbols in the URL string
        const xparam = `/${encodeURIComponent(targetRegion)}/${encodeURIComponent(grpId)}/${encodeURIComponent(fEmail)}/${encodeURIComponent(targetYear)}`;
        console.log('Final Rider Request Endpoint Parameters:', { xparam, region, xregion, targetYear });

        try {
            // 3. Fire server network request matching reload attributes
            const response = await fetch(`${myIp}/getrider${xparam}`, { cache: 'reload' });

            if (!response.ok) {
                throw new Error(`HTTP network response failure! Status: ${response.status}`);
            }

            const htmlText = await response.text();

            // 4. Update DOM layout segments directly in a single-pass swap
            if (riderPanel) {
                riderPanel.innerHTML = htmlText;
            } else {
                console.warn("Target element container ID #rider was missing from active view.");
            }

            // Execute scroll transitions and kick off down-stream analytics pipeline updates
            util.scrollsTo('claims_grid_update');
            asn.getClaimsUpdate(xyear); // <-- Passed targetYear down into the next cascade loop step

        } catch (error) {
            console.error('Failed processing top rider analytics parameters safely:', error);
        }
    },


    // get overall uploaded called via getTopRider() to update the claims 
    // grid with the same year parameter
    getClaimsUpdate: async (xyear) => {
        console.log('=== Getting Claims Update ====', xyear);

        // 1. Gather cookies cleanly into local variables at the start
        const region   = util.getCookie('f_region');
        const xregion  = util.getCookie('f_xregion');
        const grpId    = util.getCookie('grp_id') || 'NA';
        const fEmail   = util.getCookie('f_email') || 'NA';
        
        // Use a safe fallback string if xyear happens to be null or empty
        const targetYear = xyear ; 

        let targetRegion = region; // Default fallback assignment

        // 2. Evaluate structural route requirements cleanly
        if (region === "ALL") {
            if (xregion !== 'null' && xregion) {
                targetRegion = xregion;
                console.log('Using sub-region parameter mapping tracking:', targetRegion);
            } else {
                console.log('Using primary region fallback parameters:', targetRegion);
            }
        }

        // Construct path variables safely: /Region/GroupID/EmailAddress/Year
        // encodeURIComponent protects characters like spaces or '@' symbols in the URL string
        const xparam = `/${encodeURIComponent(targetRegion)}/${encodeURIComponent(grpId)}/${encodeURIComponent(fEmail)}/${encodeURIComponent(targetYear)}`;
        console.log('Final Claims Update Endpoint Parameters:', { xparam, region, xregion, targetYear });

        try {
            // 3. Fire server network request matching reload attributes
            const response = await fetch(`${myIp}/claimsupdate${xparam}`, { cache: 'reload' });

            if (!response.ok) {
                throw new Error(`HTTP network response failure! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Claims Update Data Response:', data);

            // 4. Update your data grid cleanly using your dynamic grid instance setter
            claims_grid.setData(data);

            // 5. Evaluate page view layout scrolling & element pruning rules based on group ID
            switch (grpId) {
                case "2": // Jennelle
                case "3":
                case "6":
                case "7":
                    util.scrollsTo('current_projects');
                    break;
                default:
                    const listAtdElement = document.getElementById('list_atd');
                    if (listAtdElement) {
                        listAtdElement.remove();
                    } else {
                        console.warn("Element #list_atd was already removed or missing from view.");
                    }
                    break;
            }

        } catch (error) {
            console.error('Failed processing claims update data parameters safely:', error);
        }
    },


    //get pie chart comparison of
    // with ATD and no ATDs
    getAtdUpdate: async() =>{
        await fetch(`${myIp}/atdupdate`,{
            cache:'reload'
        })
        .then(res => res.json() )

        .then(data => {	
            
            const myul = document.getElementById('claimsupdate')
            
            myul.innerHTML = text
                        
            console.log( text)
            console.log('claims total', document.getElementById('gxtotal').value)
            
            document.getElementById('xgtotal').innerHTML= `Claims Recent Transaction 
                <span class='text-primary fw-semibold'>P ${document.getElementById('gxtotal').value} </span>`

            util.scrollsTo('current_projects')
        
        })	
        .catch((error) => {
            //util.Toast(`Error:, ${error}`,1000)
            console.error('Error:', error)
        })    
    },

    
    //===== show List of printed/uploaded/completed PDFs
    getprintPdf: async() =>{
        
        console.log('==asn.getprintPdf()====')
        const xparam = `${util.getCookie('f_region')}/${util.getCookie('grp_id')}/${util.getCookie('f_email')}` 
        
        
        await fetch(`${myIp}/getprintpdf/${xparam}`,{
            cache:'reload'
        })
        .then( (res) => res.json() )
        .then( (result) => {

            console.log( 'getprintpdf()', result )
            printPdf.setData( result )
            //pdf_grid.redraw(true)
            //return true
        })  
        .catch((error) => {
            //zonked.notif('','p-notif',true)
            //util.Toast(`Error:, ${error}`,1000)
            console.error('Error:', error)
        })    
    
    },


    //====== for finance peeps ===
    getFinance: async( region ) =>{
        console.log('finance')
        let xparam = ""


        if(util.getCookie('grp_id')=="2" ||
            util.getCookie('grp_id')=="3"){
            xparam = `/${region}/${util.getCookie('f_email')}`    
        }else{

        }//eif

        await fetch(`${myIp}/getfinance${xparam}`,{
            cache:'reload'
        })
        .then(res => res.text() )

        .then(text => {	
        //    // console.log('what the text? ',text)
        //     osndp.notif('',true)
            document.getElementById('claims_pasaways').innerHTML = ""
            document.getElementById('claims_pasaways').innerHTML += text
        //     document.getElementById('project-badge').innerHTML = parseInt(document.getElementById('reccount').innerHTML)
        //     console.log( '**rec count** ',document.getElementById('reccount').innerHTML)
            
            util.scrollsTo('hub')

            asn.getTopRider()
        
        })	
        .catch((error) => {
            //util.Toast(`Error:, ${error}`,1000)
            console.error('Error:', error)
        })    
    },

    //===========GETMENU==========
    getmenu: async(grp_id) =>{
        console.log('=====FIRING ggetmenu()==========')
        await fetch(`${myIp}/menu/${grp_id}`,{
            cache:'reload'
        })
        .then( (res)  => res.json() )
        .then( (data) => {	

            var xdata = []
            
            xdata.push(data)
            console.log(xdata)
            
            const ul = document.getElementById('sidebarnav'); // Get the <ul> or <ol>

            //remove all elements of UL
            while (ul.firstChild) {
              ul.removeChild(ul.firstChild);
            }
              
            xdata[0].forEach(info => {  
              
                const li = document.createElement('li'); // Create a new <li>
                li.classList.add("nav-small-cap")

                const ii =  document.createElement('i')
                ii.classList.add("fs-10")
                
                li.appendChild( ii )

                const span =  document.createElement('span')
                span.textContent = info.menu
                span.classList.add('hide-menu')  
                //span.appendChild(ii)
                
                li.appendChild(span)

                ul.appendChild(li); // Append the <li> to the list
              
                //var subdata = JSON.parse(info.list)
                //console.log( info )
                var aList = []
                // //loop submenu
                aList.push( JSON.parse(info.list) )
                console.log( "yo", info.list  )
                    
                aList[0].forEach(xmenu => {  
                    // //=================== submenu
                    const li2 = document.createElement('li'); // Create a new <li>
                    li2.classList.add("sidebar-item")
                    
                    const span1 =  document.createElement('span')
                    const i2 =  document.createElement('i')
                    i2.classList.add("ti",`${xmenu.icon}`)
                    span1.appendChild(i2)

                    const span2 =  document.createElement('span')
                    span2.classList.add('hide-menu')  
                    span2.textContent = `${xmenu.sub}`

                    const aa = document.createElement('a'); // Create a new <li>
                    aa.classList.add("sidebar-link")

                    aa.appendChild(  span1 )
                    aa.appendChild(  span2 )

                    aa.href = xmenu.href
                    
                    li2.appendChild(aa)
                    
                    ul.appendChild(li2); // Append the <li> to the list                    
            
                })//===end subdata
    
            })//end foreach

            asn.collapz() //=== load sidebarnav once
            
            return true;
            
        })	
        .catch((error) => {
            //util.Toast(`Error:, ${error}`,1000)
            console.error('Error:', error)
        })    
    },
    //==========END  GETMENU

    //==========get atdchart

    getChart: async ( xyear ) => {
        console.log('===getting  Chart====');

        // 1. Declare and capture your target elements safely inside the function scope
        const loadingElement = document.getElementById("loading");
        const chartContainer = document.getElementById("chartprint"); // <-- FIX 1: Declared chartContainer

        // Exit early if elements are missing from the page to prevent crashes
        if (!loadingElement || !chartContainer) {
            console.error("Required chart DOM elements are missing.");
            return;
        }

        try {
            // 2. SHOW SPIN SCREEN & Dim container
            loadingElement.classList.remove("d-none");
            chartContainer.style.opacity = "0.4";

            const response = await fetch(`${myIp}/getchart/${xyear}`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const results = await response.json(); // Parse response as JSON

            asn.drawChart(); //=====actual drawing of chart

            console.log('CHART DATA===', results);

            // 1. Reconstruct categories cleanly first
            let xcat = [];
            results.forEach(item => {
                const regionName = item.region ? item.region.trim() : 'NO REGION';
                if (!xcat.includes(regionName)) {
                    xcat.push(regionName);
                }
            });

            // 2. Build series data mapped explicitly to ensure correct indexing
            const series = [
                { name: "Downloaded ATD", data: [] },
                { name: "No ATD", data: [] },
                { name: "Signed", data: [] },
            ];
                    
            results.forEach(item => {
                // Fallback to 0 if parsed value becomes NaN
                series[0].data.push(parseInt(item.with_atd) || 0);
                series[1].data.push(parseInt(item.no_atd) || 0);
                series[2].data.push(parseInt(item.xsigned) || 0);
            });

            console.log("XCAT LENGTH:", xcat.length);
            console.log("SERIES DATA LENGTH:", series[0].data.length);

            // 3. Update BOTH series and options together to prevent rendering mismatches
            if (asn.chart1) {
                asn.chart1.updateOptions({ 
                    xaxis: { 
                        categories: xcat,
                        labels: {
                            show: true,
                            rotate: -45,          
                            rotateAlways: false,   
                            hideOverlappingLabels: false, 
                            minHeight: 50         
                        }
                    }
                });

                asn.chart1.updateSeries(series);
            } else {
                console.error("asn.chart1 instance is not initialized yet.");
            }

        } catch (error) {
            // This catches any network, parsing, or undefined variable errors safely
            console.error("An error occurred during chart processing:", error);
        } finally {
            // =============================================================
            // FIX 2: THIS IS GUARANTEED TO RUN EVEN IF THE CODE CRASHES
            // =============================================================
            loadingElement.classList.add("d-none");
            chartContainer.style.opacity = "1"; 
        }
    },

    chart1:null,

    drawChart: async()=>{
        let colors = [ '#0277bd','#d84315','#0adb68'] 
        
        var options = {
          series:[], 
          colors:colors,
          chart: {
            type: 'bar',
            height: 350,
            width: 630,
            redrawOnParentResize: false,
            redrawOnWindowResize: false,
                    
        },

        plotOptions: {
            bar: {
                dataLabels: {
                    position: 'top',
                    //orientation:'vertical'
                }
            }
        },
        
        dataLabels: {
            enabled: true,
            dropShadow: {
                enabled: true,
                left: 1,
                top: 1,
                opacity: 0.5
            },
            formatter: function (val) {
                if (val >= 1000000) {
                    return (val / 1000000).toFixed(1) + 'M';
                } else if (val >= 1000) {
                    return (val / 1000).toFixed(1) + 'K';
                }
                
                return val;
            },
            offsetY:-20,
            style: {
                fontSize: "12px",
                colors: ["#d84315","#00695c"]
            },
            // style: {
            //     cssClass: 'vertical-label' // optional, for more control
            // },
            // offsetX: 0,// or try negative or positive to move labels
            // offsetY: 0
        },
        // plotOptions: {
        //   bar: {
        //     horizontal: false,
        //     columnWidth: '55%',
        //     borderRadius: 5,
        //     borderRadiusApplication: 'end'
        //   },
        // },
        // dataLabels: {
        //     enabled: true,
        //     useHTML: true,
        //     formatter: function (val) {
        //         return '<div style="display:inline-block; transform: rotate(90deg); white-space: nowrap;">' + val + '</div>';
        //     },
        //     style: {
        //         fontSize: '12px'
        //     },
        //     offsetY: -20 // Adjust as needed
        //     },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
                categories: [],

                title: {
                    text: 'REGION',
                    style: {
                        fontSize: '10px',
                        fontWeight: 'bold',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        color: '#6699ff' // set your desired color
                    }
                }
        },
        yaxis: {
            title: {
                text: '',
                style: {
                    fontSize: '10px',
                    fontWeight: 'bold',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    color: '#6699ff' // set your desired color
                }
            },
            labels: {
                formatter: function(val) {
                if (val >= 1000000) {
                    return (val / 1000000).toFixed(1) + 'M';
                } else if (val >= 1000) {
                    return (val / 1000).toFixed(1) + 'K';
                }
                return val;
                }
            }    
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val 
            }
          }
        }
        };

        asn.chart1 = new ApexCharts(document.querySelector("#chartprint"), options);
        asn.chart1.render();

            
    },

    waitingIndicator : document.getElementById('waiting-indicator'),
    
    atdstatusmodal:null,

    //===== listeners
    listeners:()=>{
        console.log('****** listeners loaded*******')
        
        //===atd status upload form
        document.getElementById('atdstatusuploadForm').addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent the default form submission

            const fileInput = document.getElementById('atdstatus_upload_file');
            const file = fileInput.files[0];

            if (!file) {
                alert('Please select an Excel file.');
                return;
            }

            const formData = new FormData();
            formData.append('excelFile', file); // Append the file to the FormData object

            try {
                const response = await fetch(`${myIp}/upload-atd-status`, { // Replace with your route
                method: 'POST',
                body: formData,
                });

                asn.waitingIndicator.style.display = 'block' //pls wait indicator

                const data = await response.json();

                if (response.ok) {
                    util.speak( data.message )
                    alert(data.message); // Success message from the server
                    
                    asn.atdstatusmodal.hide()
                    asn.waitingIndicator.style.display ='none'
                    // Optionally, refresh the page or update the UI
                } else {
                    alert(`Upload failed: ${data.error}`); // Error message from the server
                }
            } catch (error) {
                console.error('Fetch error:', error);
                alert('An error occurred during the upload.');
            }
            });


    },

    ///downlload offense of 10k above
    downloadReport: async( type ) =>{
        if(type=="cuml"){
            xlsReport.downloadReport()
        //}else{    
          //  xlsReport.downloadReport(year)
        }
    },

    yearProcessor:()=>{
         //process year dropdown
        const selectElement = document.getElementById("year_select");
        
        console.log('processing year select')
        // 1. Get the current calendar year dynamically from the system clock
        const currentYear = new Date().getFullYear(); 
        const startYear = 2025;

        // 2. Clear out any hardcoded mockup options inside the container element
        selectElement.innerHTML = "";

        // 3. Loop from 2025 up to the current calendar year
        for (let year = startYear; year <= currentYear; year++) {
            const option = document.createElement("option");
            option.value = year;
            option.textContent = year;

            // 4. If the option matches the current year, set it to selected automatically
            if (year === currentYear) {
            option.selected = true;
            }

            // Append the newly minted year option directly to our dropdown list
            selectElement.appendChild(option);
        }

        // ==========================================
        // 3. LISTEN FOR CHANGES
        // ==========================================
        selectElement.addEventListener("change", function(e) {
            const selectedYear = e.target.value;
            
            asn.getChart( selectedYear ) //get chart with selected year
            //get top 5 
            asn.getTopHub( selectedYear )
        
            console.log("User changed Year to Process to:", selectedYear);

            // Placeholder actions: Call your charts or grid refresh data here
            // Example: refreshAtdChart(selectedYear);
        });
    
    },

	//==,= main run
    init : async () => {

        asn.yearProcessor() ;  //process  year dropdown

        const xyear = document.getElementById('year_select').value
        //reset cart printing
        asn.pdfCart.length = 0
        asn.obj = {}

        //===GET MENU
        asn.getmenu(util.getCookie('grp_id'))    
        
         //=== GET CHART
        asn.getChart( xyear ) //get chart with selected year

        //get top 5 
        asn.getTopHub( xyear )
        
        //change form action 
        document.getElementById('claimsuploadForm').action=`${myIp}/xlsclaims` //change also in util.modalListeners()
        
        //change form action 
        document.getElementById('uploadForm').action=`${myIp}/postimage`

        asn.speaks = (txt) =>{
            let speechsynth = new SpeechSynthesisUtterance();
            speechsynth.text = txt
            speechsynth.lang = "en-US"
            speechSynthesis.speak( speechsynth )
        };    
              
        let authz = []
        authz.push(util.getCookie('grp_id') )
        authz.push(util.getCookie('fname'))
        authz.push(util.getCookie('f_id'))
                
        console.log('=== authz ',authz[1], authz[2])

        //==HANDSHAKE FIRST WITH SOCKET.IO
        const userName = { token : authz[1] , emp_id: authz[2], mode: 1}//full name token

        asn.socket = io.connect(`${myIp}`, {
            //withCredentials: true,
            transports: ['websocket', 'polling'], // Same as server
            upgrade: true, // Ensure WebSocket upgrade is attempted
            rememberTransport: false, //Don't keep transport after refresh
            query:`userName=${JSON.stringify(userName)}`
            // extraHeaders: {
            //   "osndp-header": "osndp"
            // }
        });//========================initiate socket handshake ================

        asn.socket.on('connect', () => {
            const notif = document.querySelector('.notification');
            notif.classList.replace('bg-danger','bg-primary');
            notif.classList.remove('blink')
            //document.getElementById('notif').innerHTML='Connected to Network!'
            console.log('Connected to Socket.IO server using:', asn.socket.io.engine.transport.name); // Check the transport
        });

        asn.socket.on('disconnect', () => {
            ///util.speak('Warning... NETWORK DISCONNECTED!!!')
            const notif = document.querySelector('.notification');
            notif.classList.replace('bg-primary', 'bg-danger');
            notif.classList.add('blink')
            //document.getElementById('notif').innerHTML='Error! Network disconnected!'
            console.log('Disconnected from Socket.IO server');
        });
       
        console.log('main.js SPEAK()')
        asn.speaks(  util.getCookie('f_voice')) //==FIRST welcome GREETING HERE ===
        
        document.getElementById('img-profile').src=`../shopee/assets/images/profile/${util.getCookie('f_pic')}`
    
        //load the form to validate
        util.loadFormValidation('#newempForm')
        util.loadFormValidation('#searchForm')
        
        //load listeners
        util.modalListeners('claimsModal') //upload excel file
        //util.modalListeners('atdstatusModal') // change atd status
        util.modalListeners('newempModal')

        asn.listeners() // load listners

        console.log('praise God!')

   

	}//END init
} //======================= end admin obj==========//
window.asn = asn // globalize asn for console access

document.addEventListener('DOMContentLoaded', function() {
    window.scrollTo(0,0);
    asn.init()
  
});

  
