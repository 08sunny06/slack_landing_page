const nav = document.getElementsByTagName('nav')[0]
const header = nav.nextElementSibling
const scrollHeading = header.children[0].children[0]
let scrollChildren = [...scrollHeading.children]
let lastScroll = 0

const colors = ['#41b658','#fcc003','#1ab9ff', '#9602c7']
async function changeBgImgColor(ind){
    try {
        const res = await fetch('images/svg/rectCircle.svg')
        let data = await res.text()
    
        data = data.split('\n')
        data[6] = data[6].replace(colors[0], colors[ind])
        data = data.join('\n')        
        
        const encodedSVG = encodeURIComponent(data).replace(/'/g, '%27').replace(/"/g, '%22')
        const dataURI = `url("data:image/svg+xml,${encodedSVG}")`
    
        document.querySelector('.titleVid').style.backgroundImage = dataURI        
    } 
    catch(error) {
        console.log(error)
    }
}

const video = document.getElementsByClassName('titleVidCollection')[0]
let videoArr = [...video.children]
const titleCummulative = [...document.getElementsByClassName('titleCummulative')[0].children]
let actualTop = 0, diffPos = 0, change = false, numberChnage = true;

if(window.innerWidth > 425){
    let index = Number(sessionStorage.getItem('videoIndex'));
    videoArr.forEach((videoEle, ind) => {
        if(ind!==index){ 
            videoEle.classList.add('titleVidDisappear') 
            changeBgImgColor(index)
        }
    })
}

const businessBlock = document.getElementsByClassName('business_heading')[0]
const estimationBlock = [...document.querySelectorAll('.estimationBlock span')]

function numberCounting(num, time){
    let len = Number(estimationBlock[num].textContent)
    for(let i=0; i<len; i++){
        setTimeout(()=>{
            estimationBlock[num].textContent = i+1
        }, i*time)
        
    }
}

for(let i=0; i<3; i++){
    let t = i == 1 ? 50: 25
    numberCounting(i, t)
}

window.addEventListener('scroll', ()=>{
    let videoTop = video.getBoundingClientRect().top + 50
    let headerBottom = header.getBoundingClientRect().bottom
    let scrollTop = scrollHeading.getBoundingClientRect().top

    if(scrollTop > 100){
        scrollHeading.style.animationName = 'none'
        scrollChildren.forEach(child => {
            child.style.animationName = 'none'
        })
    
        requestAnimationFrame(()=>{
            scrollHeading.style.animationName = ''
            scrollChildren.forEach(child => {
                child.style.animationName = ''
            })
        })
    }
        
    if(window.pageYOffset > lastScroll){
        if(headerBottom > 0){
            nav.classList.add('nav_hides')
        }
        else{
            nav.classList.remove('nav_hides')
            nav.classList.add('nav_extra_styling')            
        }
    }
    else{
        if(headerBottom > 0){
            nav.classList.add('nav_hides')
            nav.classList.remove('nav_extra_styling')            
        }
        if(window.pageYOffset == 0){
            nav.classList.remove('nav_hides')      
        }
    }
    lastScroll = window.pageYOffset

    
    if(videoTop == actualTop && window.innerWidth > 425){
    
        titleCummulative.forEach(detail => {
            let detailTop = detail.getBoundingClientRect().top
            let detailHeight = detail.getBoundingClientRect().bottom - detailTop
            let closeness = actualTop - detail.getBoundingClientRect().top
        
            if(Math.abs(closeness) >= detailHeight/2 && Math.abs(closeness) < detailHeight/2 + 50){
                index = titleCummulative.indexOf(detail)
                sessionStorage.setItem('videoIndex', index)
            
                if(closeness - diffPos > 0 && Math.abs(closeness - diffPos) < 100){
                    if(closeness < 0)
                        change = false
                    else
                        change = true                         
                }
                else if(closeness - diffPos < 0 && Math.abs(closeness - diffPos) < 100){
                    if(closeness > 0)
                        change = false
                    else
                        change = true
                }
                diffPos = closeness
                changeBgImgColor(index)
            }
        
        })
        
        if(change)
            video.children[index].classList.add("titleVidDisappear")
        
        else
            video.children[index].classList.remove("titleVidDisappear")      
    }

    let businessTop = businessBlock.getBoundingClientRect().top
    
    if(window.innerHeight - businessTop < 140 && window.innerHeight - businessTop >= 120 && numberChnage){
        for(let i=0; i<3; i++){
            let t = i == 1 ? 50: 25
            numberCounting(i, t)
        }           
        numberChnage = false
    }
    actualTop = videoTop
   })

const tabs = document.querySelector('.tabs')
const tabChild = [...document.querySelectorAll('.tabDetails')]

let activeTabChild = tabs.children[0]
activeTabChild.children[2].style.opacity = 1

tabChild.forEach((item, ind) => {
    let reqWidth = getComputedStyle(item).width
    let cond = reqWidth == '180.75px' || reqWidth == '382.5px'
    if(cond){        
        item.children[0].pause()
        ind === 1 ?
    
            item.children[0].currentTime = 3.8 :
            ind === 2 ?
    
                item.children[0].currentTime = 0 : 
                ind == 3 ?
                    item.children[0].currentTime = 1.55 : null
    }
})


tabChild.forEach((item) => item.addEventListener('mouseenter' ,e => {
    activeTabChild.style.width = '15%'
    e.target.style.width = '45%'
    
    activeTabChild.children[2].style.opacity = 0
    e.target.children[2].style.opacity = 1
    e.target.children[2].style.transition = 'opacity 2s linear 0.5s'        
    
    e.target.children[0].play()
    e.target.children[0].currentTime = 0        

    if(e.target !== activeTabChild){
        activeTabChild.children[0].pause()
        tabChild.indexOf(activeTabChild) === 0 ? 
    
            activeTabChild.children[0].currentTime = 0 : 
                tabChild.indexOf(activeTabChild) === 1 ?
    
                    activeTabChild.children[0].currentTime = 3.8 : 
                    tabChild.indexOf(activeTabChild) === 2 ?
    
                        activeTabChild.children[0].currentTime = 0 : 
                        activeTabChild.children[0].currentTime = 1.55
    }

    activeTabChild = e.target
}))

tabChild.forEach(item => item.addEventListener('mouseleave', (e => {
    e.target.children[2].style.transitionDuration = '0s'
    e.target.children[2].style.transitionDelay = '0s'
})))

const footer = document.getElementsByTagName('footer')[0]
let oldmenu = footer.children[1].children[0].children[0]
let menufall = false;

footer.addEventListener('click', function(e){
    if(e.target!=oldmenu){
        oldmenu.nextElementSibling.classList.remove("list_content_fall_down")
        e.target.nextElementSibling.classList.add("list_content_fall_down")
        menufall = true
    }
    else{
        if(!menufall){
            e.target.nextElementSibling.classList.add("list_content_fall_down")
            menufall = true
        }
        else{
            e.target.nextElementSibling.classList.remove("list_content_fall_down")
            menufall = false
        }
    }
    oldmenu = e.target
})