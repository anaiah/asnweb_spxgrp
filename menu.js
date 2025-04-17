
    
    document.addEventListener('DOMContentLoaded', function() {
        console.log('===menu.html complete==')
        menu.init()
    })
    const menu={
      init:()=>{
          console.log('menulive....')
          
          menu.getmenu()
   
      },

      getmenu: async() =>{
        await fetch(`${myIp}/menu/4`,{
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

            return true;
            
        })	
        .catch((error) => {
            //util.Toast(`Error:, ${error}`,1000)
            console.error('Error:', error)
        })    
      }
    }


    //menu.init()
    