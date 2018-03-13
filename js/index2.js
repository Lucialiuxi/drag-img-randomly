window.onload = function(){
   

    var btn = document.querySelector('#btn');
    var picBox = document.querySelector('#picBox');

    
    var divs = picBox.getElementsByTagName('div');

    //定义一个变量，存放一个函数
    var rp = function(arr) {
        //找到数组中的最大值
        var min = Math.min(...arr);//...arr是展开数组的意思
        //找到数组中的最小值
        var max = Math.max(...arr);
        //数组中最大值和最小值之前的随机数
        var ret = Math.random() * (max - min) + min;
        return Math.round(ret);//函数调用返回的是最大值和最小值之前的随机整数
    }
      
    //定义一个空数组存每个divs的offsetLeft的值和offsetTop的值
    var offsetData = [];
    
    //循环获取每个divs的左边和上边距离定位父级的距离作为数组 然后存到数组offsetData中
    for (var i=0; i<divs.length; i++) {
    offsetData.push([
        divs[i].offsetLeft,
        divs[i].offsetTop
    ])
    }
    //   console.log(offsetData)

    for (var i=0; i<divs.length; i++) {
        //给每个divs加绝对定位，相对它们的父级容器定位
        divs[i].style.position = 'absolute';
        //取消外边距
        divs[i].style.margin = 0;
        //分别设置divs的定位的left和top值是它们原本的offsetLeft和offsetTop的值
        divs[i].style.left = offsetData[i][0] + 'px';
        divs[i].style.top = offsetData[i][1] + 'px';
        divs[i].setAttribute('index',i)
    }
      
      //定义一个数组sortData，数组的内容从offsetData数组复制，不改变offsetData数组
      var sortData = offsetData.concat();
      
    //点击btn让divs随机打乱排序
      btn.onclick = function (){
        sortData.sort(function(a,b){//随机打乱数组
          return Math.random() - 0.5;
        })
        for (var i=0; i<divs.length; i++) {
          divs[i].style.transition = '1000ms';
          divs[i].style.left = sortData[i][0] + 'px';
          divs[i].style.top = sortData[i][1] + 'px';
        }
      }


    //拖拽元素dragDiv能走的最大值.每个div大小都是一样的，所以可以拖拽走的最大值都是一样的
    var dragDivMaxX = picBox.clientWidth - divs[0].offsetWidth;
    var dragDivMaxY = picBox.clientHeight - divs[0].offsetHeight;
    // console.log(dragDivMaxX,dragDivMaxY)
    
    //放等除了拖拽元素之外的divs
    var data =[];
    //定义一个变量存div的层级的值
    var zIndex = 1;
    //2.点击拖拽divs,找到与拖拽divs碰撞的离得最近的divs，然后交换位置 把事件委托给divs的父级picBox
    picBox.addEventListener('mousedown',function(ev){
        for(var i = 0; i < divs.length; i++){

            if(divs[i].timer) return;
        }
        console.log(ev.target.className)
        if(ev.target.className==='item'){
            //为了让拖拽的元素在拖拽的时候跟上鼠标 没有延迟，要把divs身上在布局转换加的transition去掉
            for (var i=0; i<divs.length; i++) {
                divs[i].style.transition = 'none';
            }

            //提升被拖拽的div的层级,每一次被拖拽的div的层级都比上一个的高
            ev.target.style.zIndex= ++zIndex;

            //每次有div被拖拽的时候都要先清空再找出 等待被碰撞的div
            data =[];

            //在点击被拖拽的divs的时候，存一下将要被拖拽的divs的位置
            var dragDivLocaleX = ev.target.offsetLeft;
            var dragDivLocaleY = ev.target.offsetTop;
            
            // console.log(dragDivLocaleX,dragDivLocaleY)

            //定义变量,存被碰撞到的元素的的位置
            var crashDivLocaleX ='';
            var crashDivLocaleY ='';

            for( var j = 0; j < divs.length; j++){
                if(divs[j].getAttribute('index')!==ev.target.getAttribute('index')){
                    data.push(divs[j])

                }
            }
            // console.log(divs)
           dectectCrash(ev,ev.target,data,dragDivLocaleX,dragDivLocaleY)
        }
    })
    //传入被拖拽元素和其他等待碰撞的元素，拖拽其中一个div,可以找到被碰撞的div
    function dectectCrash(ev,dragDiv,divs,dragDivLocaleX,dragDivLocaleY){

        //定义一个变量存距离拖拽元素最近的元素
        var ele = null;
       //鼠标到被点击拖拽元素左边和上面的距离
       var mouseLocaleX = ev.clientX - dragDiv.offsetLeft;
       var mouseLocaleY = ev.clientY - dragDiv.offsetTop;
       
       document.onmousemove = function(ev){
           //取消浏览器的默认行为
           ev.preventDefault();
           //定义一个空数组去存碰撞到的元素的中心点 到 findClosed的中心点的距离
           var arr = [];

           //被拖拽元素到可视区域左边的位置
           var x = ev.clientX - mouseLocaleX ;
           var y = ev.clientY - mouseLocaleY ;
           //拖拽的元素必须是要在可视区域
           if(x<0) x=0;
           if(y<0) y=0;
           if(x>dragDivMaxX) x=dragDivMaxX;
           if(y>dragDivMaxY) y=dragDivMaxY;
           dragDiv.style.left = x +'px';
           dragDiv.style.top = y + 'px';
           
           //找到dragDiv的中心点的位置
           var dragDivCenterX = dragDiv.getBoundingClientRect().left +dragDiv.offsetWidth/2
           var dragDivCenterY = dragDiv.getBoundingClientRect().top +dragDiv.offsetWidth/2

           //调用碰撞元元素,被碰撞的元素改变颜色
           for( var i = 0; i < divs.length; i++){
               divs[i].innerHTML = ''
               if(ElementsCrash(dragDiv,divs[i])){
                //    divs[i].style.backgroundColor = 'yellow'
                   arr.push(divs[i])
               }
           }
           
           //如果有元素被碰撞到
           if(arr.length>0){
               
               //定义一个变量赋值一个最大值，去跟所有碰撞的到的元素的中心点对比，找到最小值
               var getMin = Infinity;
               for(var i = 0; i < arr.length; i++){
                   //找到碰撞到的这项的中心点
                   var centerX = arr[i].getBoundingClientRect().left + arr[i].offsetWidth/2;
                   var centerY = arr[i].getBoundingClientRect().top + arr[i].offsetHeight/2;

                   //dragDiv的中心距离到 被碰撞到的box的中心点的距离，等于两个中心点的z^2 = x^2 + y^2
                   var ZPow = Math.pow(centerX-dragDivCenterX,2)+Math.pow(centerY-dragDivCenterY,2)
                   if(ZPow<getMin){
                       getMin = ZPow;
                       ele = arr[i];
                   }
               }
               
               //如果找到了离拖拽元素最近的元素，把离得最近的元素的位置存下来
               if(ele){//如果有离得最近的div
                //   console.log('最近的是',ele.getAttribute('id-ID'))
                //    ele.innerHTML='Och!'
                   //存被碰撞元素div的位置
                   crashDivLocaleX = ele.offsetLeft;
                   crashDivLocaleY = ele.offsetTop;
                //    console.log('被碰到的div的位置',crashDivLocaleX,crashDivLocaleY)
               }
           }
       }
       document.onmouseup = function(){
        // console.log('ele是',ele)
           document.onmousemove = document.onmouseup = null;
           
           if(ele){//如果有拖拽元素有碰到其他divs,那就交换语气最近的divs的位置
                // dragDiv.style.left = crashDivLocaleX + 'px';
                // dragDiv.style.top = crashDivLocaleY +'px';
                animate(dragDiv,{left:crashDivLocaleX,top:crashDivLocaleY},1000,'linear')

                // ele.style.top = dragDivLocaleY + 'px'
                // ele.style.left = dragDivLocaleX +'px'
                animate(ele,{left:dragDivLocaleX,top:dragDivLocaleY},1000,'linear')


           }else{//如果没有碰撞到任何的divs,就回到原来的位置
                // dragDiv.style.top = dragDivLocaleY + 'px';
                // dragDiv.style.left = dragDivLocaleX +'px'
                animate(dragDiv,{left:dragDivLocaleX,top:dragDivLocaleY},1000,'linear')
           }  
       }
       //相同的事件，在冒泡的时候会执行document上的，所以要阻止冒泡
       ev.stopPropagation()
       
    }



    //封装判断是否碰撞的函数
    function ElementsCrash(box1,box2){
        if(box1.getBoundingClientRect().right < box2.getBoundingClientRect().left ||
            box1.getBoundingClientRect().left > box2.getBoundingClientRect().right ||
            box1.getBoundingClientRect().bottom < box2.getBoundingClientRect().top ||
            box1.getBoundingClientRect().top > box2.getBoundingClientRect().bottom
        ){//没有碰上
            return false;

        }else{//碰上了
            return true;
        }
    }


//在碰撞到的时候找到两个div的id-id对应的数据，抬起来鼠标的时候进行数据交换，然后重新渲染






























}