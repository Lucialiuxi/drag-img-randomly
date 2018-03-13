window.onload = function(){
    var btn = document.querySelector('#btn');//随机排序按钮
    var picBox = document.querySelector('#picBox');//随意拖拽的图片的父级
    var divs = picBox.getElementsByTagName('div');//随意拖拽换位的图片div

    //定义一个空数组存每个divs的offsetLeft的值和offsetTop的值
    var offsetData = [];
    
    //循环获取每个divs的左边和上边距离定位父级的距离作为数组 然后存到数组offsetData中
    for (var i=0; i<divs.length; i++) {
    offsetData.push([
        divs[i].offsetLeft,
        divs[i].offsetTop
    ])
    }

    for (var i=0; i<divs.length; i++) {
        //给每个divs加绝对定位，相对它们的父级容器定位
        divs[i].style.position = 'absolute';
        //取消外边距
        divs[i].style.margin = 0;
        //分别设置divs的定位的left和top值是它们原本的offsetLeft和offsetTop的值
        divs[i].style.left = offsetData[i][0] + 'px';
        divs[i].style.top = offsetData[i][1] + 'px';
        //给每个div写一个定义属性，在拖拽图片检测到的最近div换位的时候用来去找div的left和top值进行更换
        divs[i].index = i;
    }
      
      //定义一个数组sortData，数组的内容从offsetData数组复制，不改变offsetData数组
      var sortData = offsetData.concat();
      
    //点击btn让divs随机打乱排序
      btn.onclick = function (){
        sortData.sort(function(a,b){//随机打乱数组
          return Math.random() - 0.5;
        })
        for (var i=0; i<divs.length; i++) {
          divs[i].style.left = sortData[i][0] + 'px';
          divs[i].style.top = sortData[i][1] + 'px';
          //给每个div写一个定义属性，在拖拽图片检测到的最近div换位的时候用来去找div的left和top值进行更换  
          divs[i].index = i;
        }
      }

    //拖拽元素dragDiv能走的最大值.【每个div大小都是一样的，所以可以拖拽走的最大值都是一样的】
    var dragDivMaxX = picBox.clientWidth - divs[0].offsetWidth;
    var dragDivMaxY = picBox.clientHeight - divs[0].offsetHeight;
    
    //放等除了拖拽元素之外的divs，在检测碰撞找最近的div的时候使用
    var data =[];
    //定义一个变量存div的层级的值
    var zIndex = 1;

    /*2.点击拖拽divs,找到与拖拽divs碰撞的离得最近的divs，
    然后交换位置 把事件委托给divs的父级picBox*/
    picBox.addEventListener('mousedown',function(ev){

        for(var i = 0; i < divs.length; i++){

            if(divs[i].timer) return;
        }
        
        if(ev.target.className==='item'){

            //为了让拖拽的元素在拖拽的时候跟上鼠标 没有延迟，要把divs身上在布局转换加的transition去掉
            ev.target.style.transition = 'none';

            //提升被拖拽的div的层级,每一次被拖拽的div的层级都比上一个的高
            ev.target.style.zIndex= ++zIndex;

            //每次有div被拖拽的时候都要先清空再找出 等待被碰撞的div
            data =[];

            //在点击被拖拽的divs的时候，存一下将要被拖拽的divs的位置
            var dragDivLocaleX = ev.target.offsetLeft;
            var dragDivLocaleY = ev.target.offsetTop;

            //定义变量,存被碰撞到的元素的的位置
            var crashDivLocaleX ='';
            var crashDivLocaleY ='';

            //找到所有非拖拽元素
            for( var j = 0; j < divs.length; j++){

                if(divs[j]!=ev.target){

                    data.push(divs[j])

                }
            }
            //传入被拖拽元素和其他等待碰撞的元素，拖拽其中一个div,可以找到被碰撞的div
           dectectCrash(ev,ev.target,data,dragDivLocaleX,dragDivLocaleY)
        }
    })

    //传入被拖拽元素和其他等待碰撞的元素，拖拽其中一个div,可以找到被碰撞的div
    function dectectCrash(ev,dragDiv,data,dragDivLocaleX,dragDivLocaleY){
        //定义一个变量存距离拖拽元素最近的元素
        var ele = null;
       //鼠标到被点击拖拽元素左边和上面的距离
       var mouseLocaleX = ev.clientX - dragDiv.offsetLeft;
       var mouseLocaleY = ev.clientY - dragDiv.offsetTop;
       
        //定义一个空数组去存碰撞到的元素的中心点 到 findClosed的中心点的距离
        var arr = [];
        
        //定义变量 存dragDiv的中心点的位置
        var dragDivCenterX = null;
        var dragDivCenterY = null;

       document.onmousemove = function(ev){
           //取消浏览器的默认行为
           ev.preventDefault();

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
           dragDivCenterX = dragDiv.getBoundingClientRect().left +dragDiv.offsetWidth/2
           dragDivCenterY = dragDiv.getBoundingClientRect().top +dragDiv.offsetWidth/2

           //调用碰撞元元素,被碰撞的元素改变颜色
           for( var i = 0; i < data.length; i++){
            data[i].innerHTML = ''
               if(ElementsCrash(dragDiv,data[i])){
                   arr.push(data[i])
               }
           }
       }
       document.onmouseup = function(){
           ev.target.style.transition = '.8s';
           document.onmousemove = document.onmouseup = null;
                //如果有多个元素被碰撞到
                if(arr.length>1){
                    
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

                    //ele 就是离拖拽元素最近的div
                    var l = sortData[ele.index][0];//被碰撞元素的left值
                    var t = sortData[ele.index][1];//被碰撞元素的top值

                    dragDiv.style.left = l + 'px';
                    dragDiv.style.top = t + 'px';

                    ele.style.left = sortData[dragDiv.index][0] +'px';
                    ele.style.top = sortData[dragDiv.index][1]+ 'px';

                    //要同步修改index属性值
                    var index = dragDiv.index;
                    dragDiv.index = ele.index;
                    ele.index = index;

                }else if(arr.length===1){//如果只有碰撞到一个元素
                    //被拖拽div值碰撞到一个div--> arr[0]
                    var l = sortData[arr[0].index][0];//被碰撞元素的left值
                    var t = sortData[arr[0].index][1];//被碰撞元素的top值

                    dragDiv.style.left = l + 'px';
                    dragDiv.style.top = t + 'px';

                    arr[0].style.left = sortData[dragDiv.index][0] +'px';
                    arr[0].style.top = sortData[dragDiv.index][1]+ 'px';  

                    var index = dragDiv.index;
                    dragDiv.index = arr[0].index;
                    arr[0].index = index;         
                }else if(arr.length===0){//如果没有碰撞到任何元素，回到开始拖拽的位置
                    dragDiv.style.left = dragDivLocaleX + 'px';
                    dragDiv.style.top = dragDivLocaleY + 'px';
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
































}