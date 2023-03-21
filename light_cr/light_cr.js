const lightCr = new class {
    init(radius = 300, innerRadius = 175, opacity = 0.95, color = '#000000', enabled = true) {
        let instance = this;
        let lastMousePos = {};

        if (enabled) {
            instance.enable();
        } else {
            instance.disable();
        }

        instance.setColor(color);
        instance.setRadius(radius, innerRadius);
        instance.setOpacity(opacity);
        instance._minWidth = 991;
        instance._visible = true;

        function cursorObservation() {
            window.addEventListener('mousemove', (e) => {
                if (!instance._enabled || !instance._visible) {
                    return;
                }
                if (!e.target) {
                    return;
                }

                if (e.x !== undefined) {
                    let pageScrollPos = getPageScrollPosition();
                    lastMousePos = {
                        x: e.pageX - pageScrollPos.x,
                        y: e.pageY - pageScrollPos.y
                    }
                }


                drawCursor(lastMousePos);
            });
        }

        cursorObservation();

        const canvas = document.createElement("canvas");
        instance.canvas = canvas;

        canvas.style['position'] = 'fixed';
        canvas.style['left'] = '0';
        canvas.style['top'] = '0';
        canvas.style['z-index'] = '99999';
        canvas.style['pointer-events'] = 'none';
        document.body.append(canvas);
        let context = canvas.getContext('2d');

        setCanvasSize();
        window.addEventListener("resize", setCanvasSize);

        function setCanvasSize() {
            if (window.innerWidth < instance._minWidth) {
                instance._visible = false;
                canvas.style.height = '0';
                canvas.style.width = '0';
                return
            }

            instance._visible = true;
            canvas.style.height = 'auto';
            canvas.style.width = 'auto';
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            if (instance._enabled) {
                fillCanvas();
            }
        }

        function fillCanvas() {
            clearCanvas();
            context.fillStyle = 'rgba(' + instance._color.r + ', ' + instance._color.g + ', ' + instance._color.b + ', ' + instance._opacity + ')';
            context.beginPath();
            context.rect(0, 0, canvas.width, canvas.height);
            context.fill();
        }
        function clearCanvas() {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }

        function drawCursor(cursorPositions) {
            clearCanvas();
            if (cursorPositions.x === undefined) {
                return;
            }

            let gradient = context.createRadialGradient(cursorPositions.x,cursorPositions.y, instance._radius, cursorPositions.x, cursorPositions.y, instance._innerRadius);
            gradient.addColorStop(0, 'rgba(' + instance._color.r + ', ' + instance._color.g + ', ' + instance._color.b + ', ' + instance._opacity + ')');
            gradient.addColorStop(1, 'rgba(' + instance._color.r + ', ' + instance._color.g + ', ' + instance._color.b + ', 0)');
            context.fillStyle = gradient;
            context.fillRect(0, 0, canvas.width, canvas.height);
        }

        function getPageScrollPosition() {
            let doc = document.documentElement;
            return {
                x: (scrollX || doc.scrollLeft) - (doc.clientLeft || 0),
                y: (scrollY || doc.scrollTop) - (doc.clientTop || 0),
            };
        }
    }

    setColor(color) {
        this._color = hexToRgb(color);

        window.dispatchEvent(new Event('mousemove', {}));

        function hexToRgb(hex) {
            let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }
    }
    setRadius(outer, inner) {
        if (inner <= outer) {
            this._radius = outer;
            this._innerRadius = inner;
        }
    }
    setOpacity(opacity) {
        this._opacity = opacity;
    }
    setMinWindowWidth(width) {
        this._minWidth = width;
    }
    enable() {
        this._enabled = true;
        if (this.canvas) {
            this.canvas.style.display = 'block';
        }
    }
    disable() {
        this._enabled = false;
        if (this.canvas) {
            this.canvas.style.display = 'none';
        }
    }
}
