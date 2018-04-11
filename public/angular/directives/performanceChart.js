myApp.directive('performancePieChart',function(){
    return {
        restrict:'A',
        scope:{
            percent:'=performancePieChart'
        },
        link:function(scope,elem,attr,ctrl){
            var circle=elem[0];
            var options={
                size:200,
                lineWidth:15,
                rotate:0
            };

            var canvas = document.createElement('canvas');
            var span = document.createElement('span');

            if (typeof(G_vmlCanvasManager) !== 'undefined') {
                G_vmlCanvasManager.initElement(canvas);
            }
          
            circle.append(span);
            circle.append(canvas);
        
            var ctx = canvas.getContext('2d');
            canvas.width = canvas.height = options.size;

            var circleMargin = 10;
            var radius = (options.size - options.lineWidth - circleMargin) / 2;
            var to_rad = Math.PI / 180;
            
            var drawCircle = function(color, lineWidth, percent) {
                ctx.save();
                ctx.translate(options.size / 2, options.size / 2);
                ctx.rotate((-1 / 2 + options.rotate / 180) * Math.PI);
                percent = Math.min(Math.max(0, percent || 1), 1);
                ctx.beginPath();
                ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false);
                ctx.strokeStyle = color;
                ctx.lineCap = 'round';
                ctx.lineWidth = lineWidth;
                ctx.stroke();
                ctx.restore();
            };

            drawCircle('rgb(233, 166, 188)', options.lineWidth, 100 / 100);

            scope.$watch('percent', function(value) {
                span.innerText = value + '%';
                drawCircle('rgb(180, 19, 73)', options.lineWidth, value / 100);
            });
          
        }
    }
})