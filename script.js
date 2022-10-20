$(function(){
    var canvas=$('#canvas')[0];
    var ctx=canvas.getContext('2d');
    var snake=[
        {x:50,y:90,oldX:0,oldY:0},
        {x:50,y:80,oldX:0,oldY:0},
        {x:50,y:70,oldX:0,oldY:0}
          ];

    var food={x:200,y:200,eaten:false};
    var width=height=10;
    var blockSize=10;
    var score=0;

    const LEFT=37;
    const UP=38;
    const RIGHT=39;
    const DOWN=40;
    var keyPressed=DOWN;
    var game;

    game=setInterval(gameLoop,100);

    function gameLoop(){
        console.log('running');
        clearCanvas();
        drawFood();
        moveSnake();
        draw();
    }
 
    function drawFood(){
        ctx.fillStyle="yellow";
        if(food.eaten==true){
            food=getNewPositionFood();
        }
        ctx.fillRect(food.x,food.y,width,height);
    }

    function moveSnake(){
        $.each(snake,function(index,value){
            value.oldX=value.x;
            value.oldY=value.y;
            if(index==0){
                if(keyPressed==DOWN){
                    value.y+=blockSize;
                }
                else if(keyPressed==UP){
                    value.y-=blockSize;
                }
               else if(keyPressed==LEFT){
                    value.x-=blockSize;
                }
                else if(keyPressed==RIGHT){
                    value.x+=blockSize;
                }
           }else{
            value.x=snake[index-1].oldX;
            value.y=snake[index-1].oldY;
           }
        });
    }

function draw(){
    $.each(snake,function(index,value){
     ctx.fillStyle="green";
     ctx.fillRect(value.x,value.y,width,height);
     ctx.strokeStyle="white";
     ctx.strokeRect(value.x,value.y,width,height);
     if(index==0){
        if(collided(value.x,value.y)){
            gameOver();
        }
        if(snakeEatFood(value.x,value.y)){
            score++;
            $('.score').text(score);
            biggerSnake();
            food.eaten=true;
        }
     }
    });
}

function collided(x,y){
    return snake.filter(function(value,index){
        return index!=0 && x==value.x && y==value.y;
    }).length>0 || x<0 || x>canvas.width || y<0 || y>canvas.height;
}

function snakeEatFood(headX,headY){
return food.x==headX && food.y==headY;

}
 
function biggerSnake(){
    snake.push({
       x:snake[snake.length-1].oldX,
       y:snake[snake.length-1].oldY
    });
}

function gameOver(){
clearInterval(game);
$("#error").css("display","block");
$("#last").css("display","none");
}

function clearCanvas(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
}



function getNewPositionFood(){
    var xArr=yArr=[];
    var xy;
    $.each(snake,function(index,value){
        if($.inArray(value.x,xArr)!=-1){
            xArr.push(value.x);
        }
        if($.inArray(value.y,yArr)!=-1){
            yArr.push(value.y);
        }
    });
    xy=getEmpty(xArr,yArr);
    return xy;
}

function getEmpty(xArr,yArr){
let newX,newY;
newX=getRandomNumber(canvas.width-10,10);
newY=getRandomNumber(canvas.height-10,10);
if($.inArray(newX,xArr)==-1 && $.inArray(newY,yArr)==-1){
    return {
        x:newX,
        y:newY,
        eaten:false
    };
}
else{
    getEmpty(xArr,yArr);
}
}

function getRandomNumber(max,multipleOf){
    let result=Math.floor(Math.random()*max);
    result=(result%10==0)?result:result+(multipleOf-result%10);
    return result;
}

$(document).keydown(function(e){
    if($.inArray(e.which,[UP,DOWN,LEFT,RIGHT])!=-1){
   keyPressed=whichKey(e.which);
    }
   });

   function whichKey(tempKey){
    var key;
    if(tempKey==UP){
        key=keyPressed!=DOWN?tempKey:keyPressed;
    }
    else if(tempKey==DOWN){
        key=keyPressed!=UP?tempKey:keyPressed;
    }
    else if(tempKey==LEFT){
        key=keyPressed!=RIGHT?tempKey:keyPressed;
    }
    else if(tempKey==RIGHT){
        key=keyPressed!=LEFT?tempKey:keyPressed;
    }
    return key;
   }


});
function reload(){
    location.reload();
}