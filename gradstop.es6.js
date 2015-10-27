/**
 * extend obj function
 */
let extend = (a, b) => {
    for (let key in b) {
        if (b.hasOwnProperty(key)) {
            a[key] = b[key]
        }
    }
    return a
}

/**
 * hex to rgb conversion
 */
let hexToRgb = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null
}

class gradStop {
    constructor(options) {
        this.options = {
            // input color options: hex, rgb or hsl
            inColor: 'hex',
            // number of equidistant color stops (cannot be less than colorArray.length)
            stops: 5,
            // input color array (currently supports only 2)
            colorArray: ['#fff', '#000']
        }
        this.options = extend({}, this.options)
        extend(this.options, options)
        this._init()
        this.stopsGenerator()
            // console.log(this.colorArray)
        return this.outputArray
    }

    // methods
    _init() {
        if (this.options.inColor === 'hex') {
            let fixedHexFormat = this.options.colorArray.map((color) => {
                if (color.length === 3) {
                    color = color + color.split('').slice(1, 3).join('') + color.split('').slice(1, 3).join('')
                    return color
                } else if (color.length === 4) {
                    color = color + color.split('').slice(1, 4).join('')
                    return color
                } else if (color.length === 7) {
                    return color
                }
            })
            this.colorArray = fixedHexFormat.map((color) => hexToRgb(color))
        } else if (this.options.inColor === 'rgb') {
            this.colorArray = this.options.colorArray.map((color) => {
                color = color.split('').slice(4, -1).join('').split(',')
                let [r, g, b] = [color]
                return {
                    r, g, b
                }
            })
        } else if (this.options.inColor === 'hsl') {
            this.colorArray = this.options.colorArray.map((color) => {
                color = color.split('').slice(4, -1).join('').split(',')
                let h = color[0],
                    s = color[1].split('').slice(0, -1).join(''),
                    l = color[2].split('').slice(0, -1).join('')
                return {
                    h, s, l
                }
            })
        }
    }

    stopsGenerator() {

        this.outputArray = []

        if (this.options.inColor === 'hex' || this.options.inColor === 'rgb') {

            // red
            let redStart = parseInt(this.colorArray[0].r),
                redEnd = parseInt(this.colorArray[1].r),
                rIncrement = (redEnd - redStart) / (this.options.stops - 1)

            // green
            let greenStart = parseInt(this.colorArray[0].g),
                greenEnd = parseInt(this.colorArray[1].g),
                gIncrement = (greenEnd - greenStart) / (this.options.stops - 1)

            // blue
            let blueStart = parseInt(this.colorArray[0].b),
                blueEnd = parseInt(this.colorArray[1].b),
                bIncrement = (blueEnd - blueStart) / (this.options.stops - 1)

            let i
            for (i = 0; i < this.options.stops; i++) {
                let r, g, b
                r = redStart + Math.floor(rIncrement * i)
                g = greenStart + Math.floor(gIncrement * i)
                b = blueStart + Math.floor(bIncrement * i)
                this.outputArray.push(`rgb(${r},${g},${b})`)
            }

        } else if (this.options.inColor === 'hsl') {

            // hue
            let hueStart = parseInt(this.colorArray[0].h),
                hueEnd = parseInt(this.colorArray[1].h),
                hIncrement = (hueEnd - hueStart) / (this.options.stops - 1)

            // saturation
            let satStart = parseInt(this.colorArray[0].s),
                satEnd = parseInt(this.colorArray[1].s),
                sIncrement = (satEnd - satStart) / (this.options.stops - 1)

            // luminance
            let lumStart = parseInt(this.colorArray[0].l),
                lumEnd = parseInt(this.colorArray[1].l),
                lIncrement = (lumEnd - lumStart) / (this.options.stops - 1)

            let i
            for (i = 0; i < this.options.stops; i++) {
                let h, s, l
                h = hueStart + Math.floor(hIncrement * i)
                s = satStart + Math.floor(sIncrement * i)
                l = lumStart + Math.floor(lIncrement * i)
                this.outputArray.push(`hsl(${h}, ${s}%, ${l}%)`)
            }

        }
    }
}