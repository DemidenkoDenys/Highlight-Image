import 'image-map-resizer';
import anime from 'animejs';
import Victor from 'victor';
import picturefill from 'picturefill';
import '../libs/object-fit';
import objectFitImages from 'object-fit-images';

export default {
    areas: [],
    stage: '',
    layer: '',
    background: '',
    selectedArea: '',
    hoverAnimation: '',
    highlightAnimation: '',
    globalOpacity: 0,
    // context: document.getElementById("flash").getContext("2d"),

    init() {
        if ($('map'))
            $('map').imageMapResize();

        if (vars.page === 'home_page') {
            this.initStage();
            this.initLayer();
            this.fillAreas();
            this.initBackground();
            this.initHoverAnimation();
            this.initHighlightAnimation();
            this.initHandlers();
            this.drawFigures();
            this.stage.add(this.layer);
        }

        this.flashlight();

        objectFitImages('.box img');
        objectFitImages('.grid-container li img');

        picturefill();

        // let fromX = 400,
        //     fromY = 400,
        //     toX = 600,
        //     toY = 600;
        //
        // var v1 = new Victor(300, 300);
        // var v2 = new Victor(500, 400);
        //
        // var vc = new Victor((v2.x + v1.x) / 2, (v2.y + v1.y) / 2);
        //
        // this.drawPoint(v1);
        // this.drawPoint(v2);
        //
        // var v3 = new Victor.fromObject({ x: (vc.x-v1.x) * Math.cos(60)-(vc.y-v1.y) * Math.sin(60)+v1.x,
        //                                  y: (vc.x-v1.x) * Math.sin(60)+(vc.y-v1.y) * Math.cos(60)+v1.y
        // });
        //
        // let x2 = v2.x;
        // let x1 = v1.x;
        // let y2 = v2.y;
        // let y1 = v1.y;
        //
        // this.drawPoint(v3, 'blue');

    },

    flashlight(){
        var dot1 = new Victor(200, 200);
        var dot2 = new Victor(800, 400);

        function getPerpendicular(x2, y2, x1, y1, l, dir){
            var angle = Math.atan((y2 - y1) / (x2 - x1)) * 180 / Math.PI;
            return {
                x: (x1 + x2) / 2 + dir * (l * Math.sin(angle * Math.PI / 180)),
                y: (y1 + y2) / 2 + dir * -1 * (l * Math.cos(angle * Math.PI / 180))
            }
        };

        var lines = [dot1, dot2];
        var points = [];
        var path = '';

        function divideLine(l1, l2){
            return getPerpendicular(l1.x, l1.y, l2.x, l2.y,
                random(length(l1, l2) / 10,
                    length(l1, l2)),
                random(-1, 1));
        };

        function length(d1, d2){
            return Math.sqrt((d2.x - d1.x) * (d2.x - d1.x) + (d2.y - d1.y) * (d2.y - d1.y));
        }

        for(var l = 0; l < 7; l++){
            for(var i = lines.length - 2; i >= 0; i--) {
                lines.splice(i + 1, 0, divideLine(lines[i], lines[i + 1]));
            }
        }

        for (var i = 0; i < lines.length; i++) {
            points.push(lines[i].x);
            points.push(lines[i].y);
        };

        console.log(points);

        for (var i = 0; i < points.length; i++) {
            if(i === 0)
                path = path + 'M' + Math.round(points[i]) + ' ' + Math.round(points[i + 1]) + ' ';
            else if(!(i % 2))
                path = path + 'L' + Math.round(points[i]) + ' ' + Math.round(points[i + 1]) + ' ';
        }

        $('#svg path').attr('d', path);

        function random(min, max) {
            return Math.random() * (max - min) + min;
        }
    },

    // drawLine(){
    //
    //     var canvas = document.getElementById("flash");
    //     var context = canvas.getContext("2d");
    //
    //     let prevPoint = { top: 0, left: 0 };
    //     let counter = 1;
    //     let looper = 0;
    //
    //     context.fillStyle = 'rgba(1,89,116, 0.2)';
    //     context.fillRect(0, 0, 1000, 800);
    //
    //     for(let i = 1; i < 500; i++){
    //         (() => {
    //             setTimeout(() => {
    //                 let offset = Math.abs(Math.sin(i++ * Math.PI / 150) * 10).toFixed(1) * 15;
    //
    //                 console.log();
    //
    //                 let x = this.random(5);
    //                 let y = this.random(10);
    //
    //                 let color = `rgb(${this.random(256)}, ${this.random(256)}, ${this.random(256)})`;
    //                     color = '#66DCFF';
    //
    //                 context.beginPath();
    //
    //                 context.moveTo(prevPoint.top, prevPoint.left);
    //                 context.lineTo(prevPoint.top + x, y + offset);
    //
    //                 prevPoint.top += x;
    //                 prevPoint.left = y + offset;
    //
    //                 context.strokeStyle = '#fff';
    //                 // context.shadowColor = color;
    //                 context.lineWidth = 2;
    //                 // context.shadowBlur = 20;
    //
    //                 for(let l = 0; l < 7; l++){
    //                     context.stroke();
    //                 }
    //
    //                 // if(i === 19)
    //                     // context.clearRect(0, 0, 1000, 800);
    //
    //             }, i * 20);
    //         })();
    //     }
    //
    // },

    lengthBetweenDots(coord1, coord2){
        let x = coord2.x - coord1.x,
            y = coord2.y - coord1.y;
        return Math.pow((x * x + y * y), 0.5);
    },

    drawPoint(coords, color = 'red'){

        this.context.beginPath();
        this.context.moveTo(coords.x, coords.y);
        this.context.arc(coords.x, coords.y, 3, 0, 2 * Math.PI, false);
        this.context.fillStyle = color;
        this.context.fill();
    },

    drawLine(coords1, coords2){

        this.context.beginPath();
        this.context.moveTo(coords1.x, coords1.y);
        this.context.lineTo(coords2.x, coords2.y);
        this.context.strokeWidth = 1;
        this.context.strokeStyle = 'red';
        this.context.stroke();
    },

    drawLightning(){

        this.context.fillStyle = 'rgba(110,89,116, 0.2)';
        this.context.fillRect(0, 0, 1000, 800);

        this.context.beginPath();

        this.context.moveTo(0, 0);
        this.context.lineTo(400, 400);

        this.context.strokeStyle = 'white';
        this.context.shadowColor = 'lightblue';
        this.context.lineWidth = 2;
        this.context.shadowBlur = 20;

        for(let l = 0; l < 7; l++){
            this.context.stroke();
        }
    },

    random(num){
        return Math.floor(Math.random() * (num))
    },

    initStage(){

        this.stage = new Konva.Stage({
            container: 'canvas',
            width: window.innerWidth,
            height: window.innerHeight
        });

        this.stage.on('click tap', (evt) => {
            if(evt.target.name())
                location.href = location.href.replace(location.search, '').replace(location.hash, '') + evt.target.name();
        });
    },

    initLayer(){
        this.layer = new Konva.Layer();
    },

    initBackground(){
        this.background = new Konva.Rect({
            x: 0,
            y: 0,
            width: this.stage.getWidth(),
            height: this.stage.getHeight(),
            fill: 'white',
            opacity: 0
        });
        this.layer.add(this.background);

        this.background.on('click tap', () => {
            this.highlightAnimation.start();
        });
    },

    initFigure(area){
        let object = new Konva.Path({
            x: 0,
            y: 0,
            data: this.coordsToPath(area.coords),
            fill: 'white',
            globalCompositeOperation: 'xor',
            opacity: 0,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffset: {x : -3, y : -3},
            shadowOpacity: 0.3
        });
        object.name(area.url);
        return object;
    },

    initHoverAnimation(){
        this.hoverAnimation = new Konva.Animation(() => {

            if(this.hoverOnFigure && parseFloat(this.globalOpacity).toFixed(2) <= 0.8)
                this.globalOpacity += 0.05;

            if(!this.hoverOnFigure && parseFloat(this.globalOpacity).toFixed(2) >= 0.05)
                this.globalOpacity -= 0.05;

            this.background.opacity(this.globalOpacity);
            this.selectedArea.opacity(this.hoverOnFigure ? this.globalOpacity + 1.2 : 0);

        }, this.layer);
    },

    initHighlightAnimation(){
        var flag = false;

        this.highlightAnimation = new Konva.Animation((frame) => {
            var paths = this.stage.find('Path');
            var opacity = parseFloat(Math.abs(Math.sin(frame.time * Math.PI / 500)) / 3).toFixed(2);

            for(let i = 0; i < paths.length; i++)
                paths[i].fill('blue').opacity(opacity);

            if(opacity > 0.25)
                flag = true;
            
            if(flag && opacity < 0.1) {
                this.highlightAnimation.stop();
                for(let i = 0; i < paths.length; i++)
                    paths[i].fill('white').opacity(0);
                flag = false;
            }
        }, this.layer);
    },

    initHandlers(){
        this.stage.on('mouseover tap', (e) => {
            if(this.background){
                this.hoverOnFigure = !(e.target === this.background);
                this.selectedArea = !(e.target === this.background) ? e.target : this.selectedArea;
                this.stage.container().style.cursor = !(e.target === this.background) ? 'pointer' : 'default';
            }

            let allPaths = this.stage.find('Path');
            for(let i = 0; i < allPaths.length; i++)
                allPaths[i].opacity(0);
            this.hoverAnimation.start();
        });

        $(window).on('resize', () => {
            this.stage.width(window.innerWidth).height(window.innerHeight);
            this.background.width(this.stage.width()).height(this.stage.height());
        });

        let observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation, index) => {
                if(mutation.attributeName === 'coords'){
                    let paths = this.stage.find('Path');
                    paths[index].setData(this.coordsToPath(mutation.target.coords));
                }
            });
        });

        Array.prototype.forEach.call(document.getElementsByTagName('area'), area => {
            observer.observe(area, { attributes: true } );
        });
    },

    fillAreas(){
        let areas = $('map area');
        this.areas = [];
        for(let i = 0; i < areas.length; i++){
            this.areas.push(new Object());
            this.areas[i].coords = $(areas[i]).attr('coords');
            this.areas[i].url = $(areas[i]).attr('href') ? $(areas[i]).attr('href') : location.href;
            this.areas[i].name = $(areas[i]).attr('data-name') ? $(areas[i]).attr('data-name') : '';
        }
    },

    coordsToPath(coordinates){
        let path = '';
        coordinates = coordinates.split(',');
        for(let i = 0; i < coordinates.length; i++){
            if(i % 2 === 0)
                path = (i === 0)
                    ? path + 'M ' + String(coordinates[i] + ',' + coordinates[i + 1])
                    : path + ' L ' + String(coordinates[i] + ',' + coordinates[i + 1]);
            }
        return path + ' z';
    },

    drawFigures(){
        for(let i = 0; i < this.areas.length; i++){
            var areaPath = this.initFigure(this.areas[i]);
            this.selectedArea = i === 0 ? areaPath : this.background;
            this.layer.add(areaPath);
        }
    }
};
