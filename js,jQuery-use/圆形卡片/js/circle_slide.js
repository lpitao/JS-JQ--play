$(document).ready(function(){

    // helpful variables
    var slider = $('.slider');
    var sliderInner = slider.find('.slider-inner');
    var sliderOrigin = slider.find('.slider-origin');
    var sliderItems = slider.find('.slider-item');
    var itemsLength = sliderItems.length;
    var calcDeg = 270 / itemsLength;
    var clickDown = false;
    var mouseMove = false;
    var moveFrom = null;
    var moveTo = null;
    var extraDeg = 0;
    var currentItem = sliderItems.eq(0);

    // 画：中间圆圈
    sliderOrigin.width(sliderItems.outerHeight() / 2);
    sliderOrigin.height(sliderItems.outerHeight() / 2);
    
    // 画：Item外层大小
    sliderInner.width(sliderItems.outerHeight()*3.5);
    sliderInner.height(sliderItems.outerHeight()*3.5);

    var sliderInnerWidth = sliderInner.outerWidth();
    var sliderInnerOffset = sliderInner.offset();

    sliderOrigin.css('margin-top',(sliderInner.height() / 2) - (sliderOrigin.height() / 2));
    
    // 画：转圈
    //1、选中的位置
    //2、其他的卡片
    function rotationPosition(exceptIndex){
        exceptIndex = exceptIndex | 0;
        var i = 1;
        sliderItems.each(function(e){
            var $this = $(this);
            extraDeg = exceptIndex > itemsLength/2? 360: 0;
            if(e === exceptIndex){
                $this.addClass('active').css('transform', 'rotate('+extraDeg+'deg)');
            }else{
                $this.css('transform', 'rotate('+((i*calcDeg)+45)+'deg)');
                i++;
            }
        });
    }rotationPosition();


    
    var clickedItemIndex = null;
    function sliderItemsClickEvent(){
        sliderItems.mousedown(function(e){
            if(clickedItemIndex == null && e.which == 1){
            	//记录下来选中index
                clickedItemIndex = $(this).index();
            }
        });
        sliderItems.mouseup(function(){
            var $this = $(this);
            //当鼠标释放的时候，如果选中index正好等于鼠标释放的index则
            if(clickedItemIndex === $this.index()){
                currentItem = $this;
                //旋转选中index
                pushIndex($this.index());
            }
        });
    }sliderItemsClickEvent();

    // 
    function pushIndex(index){
        sliderItems.removeClass('active');
        rotationPosition(index);
    }

    // 鼠标写下来
    sliderInner.mousedown(function(e){
        clickDown = true;
        moveFrom = e.pageX;
    });

	 // 鼠标来回晃动
    sliderInner.mousemove(function(e){
        if(clickDown){
            if(!mouseMove){mouseMove = true;}
            var offsetX = e.pageX - sliderInnerOffset.left;
            var move = moveFrom - sliderInnerOffset.left;
            var motionDeg = ((offsetX - move)/sliderInnerWidth) * (calcDeg*2);
            extraDeg = currentItem.index() > itemsLength/2? 360:0; 
            sliderInner.find('.slider-item.active').css('transform', 'rotate('+(motionDeg+extraDeg)+'deg)');
        }
    });
    
    // clickDown = false if mouseup on any place in the page
    $(document).mouseup(function(e){
        clickDown = false;
        setTimeout(function(){ clickedItemIndex = null; }, 505);
        // setTimeout(function(){clickDown = false;}, 505);
        if(mouseMove){
            mouseMove = false;
            moveto = e.pageX;
            swipe(moveFrom, moveto);
        }
    });

    function swipe(from, to){
        var distance = Math.abs(from - to); // mouse move distance
        var rightDir = from < to;
        if(distance > sliderInnerWidth/4){
            navigate();
        }else{
            currentItem.css('transform', 'rotate('+(currentItem.index() > itemsLength/2? 360:0)+'deg)');
        }

        function navigate(){
            if(rightDir){
                var nextIndex = currentItem.next().index();
                pushIndex(nextIndex != -1? nextIndex:  0);
            }else{
                var prevIndex = currentItem.prev().index();
                pushIndex( prevIndex != -1? prevIndex:  sliderItems.length -1);
            }
            currentItem = sliderInner.find('.slider-item.active');
        }

    }
});