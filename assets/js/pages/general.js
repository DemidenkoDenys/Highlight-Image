import 'image-map-resizer';

export default {
    areas: [],
    stage: '',
    layer: '',
    background: '',
    selectedArea: '',
    hoverAnimation: '',
    highlightAnimation: '',
    globalOpacity: 0,

    init() {
        $('map').imageMapResize();

        this.initStage();
        this.initLayer();
        this.fillAreas();
        this.initBackground();
        this.initHoverAnimation();
        this.initHighlightAnimation();
        this.initHandlers();
        this.drawFigures();

        this.stage.add(this.layer);
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
        var flag = false;

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
