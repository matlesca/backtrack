import moment from 'moment'
import star1 from '../img/starPart1.png'
import star2 from '../img/starPart2.png'
import star3 from '../img/starPart3.png'
import star4 from '../img/starPart4.png'
import star5 from '../img/starPart5.png'
import cloud1 from '../img/cloud1.png'
import cloud2 from '../img/cloud2.png'
import cloud3 from '../img/cloud3.png'
import logo from '../img/backtrack-small-logo.png'

export function drawShare ({state}, wrapperSelector, canvasSelector) {
    // Globals
    let mcw = document.getElementById(wrapperSelector)
    let mc = document.getElementById(canvasSelector)
    mc.width = mcw.offsetWidth
    mc.height = mcw.offsetHeight
    let starTab = [star1, star2, star3, star4, star5]
    let cloudTab = [cloud1, cloud2, cloud3]
    let ctx = mc.getContext('2d')
    // Tool func
    function wrapText (context, text, x, y, maxWidth, lineHeight, writeit) {
        let cars = text.split('\n')
        let finalWidth = 0
        let finalHeight = 0
        for (let ii = 0; ii < cars.length; ii++) {
            let line = ''
            let words = cars[ii].split(' ')
            for (let n = 0; n < words.length; n++) {
                let testLine = line + words[n] + ' '
                let metrics = context.measureText(testLine)
                let testWidth = metrics.width
                if (testWidth > maxWidth) {
                    if (writeit) {
                        context.fillText(line, x, y)
                    }
                    if (context.measureText(line).width > finalWidth) {
                        finalWidth = context.measureText(line).width
                    }
                    finalHeight += lineHeight
                    y += lineHeight
                    line = words[n] + ' '
                } else {
                    line = testLine
                }
            }
            if (writeit) {
                context.fillText(line, x, y)
            }
            if (context.measureText(line).width > finalWidth) {
                finalWidth = context.measureText(line).width
            }
            finalHeight += lineHeight
            y += lineHeight
        }
        return {'w': finalWidth, 'h': finalHeight}
    }
    // BCK gradient
    let grd = ctx.createLinearGradient(mc.width / 2, 0, Math.floor((0.35 + 0.3 * state.randKey) * mc.width), mc.height)
    grd.addColorStop(0.2, '#282828')
    grd.addColorStop(1, state.bckCol)
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, mc.width, mc.height)
    // Draw backtrack logo
    let logImg = new Image()
    logImg.src = logo
    logImg.alpha = 0.8
    logImg.onload = function () {
        ctx.globalCompositeOperation = 'source-over'
        ctx.drawImage(logImg, 20, 20, 50, 50)
    }
    // Draw clouds
    let nbClouds = 15
    let cloudProms = []
    for (let cc = 0; cc < nbClouds; cc++) {
        cloudProms.push(new Promise(function (resolve, reject) {
            let img = new Image()
            img.src = cloudTab[Math.floor(Math.random() * cloudTab.length)]
            img.alpha = 0.6 + 0.4 * Math.random()
            img.onload = function () {
                ctx.globalCompositeOperation = 'overlay'
                let ww = img.width * (1 + 2 * Math.random())
                let hh = img.height * (1 + Math.random())
                let xpos = mc.width * (Math.floor(cc * 4 / nbClouds) + Math.random()) / 4 - ww / 2
                let ypos = mc.height - hh * 1.5 * Math.random()
                ctx.drawImage(img, xpos, ypos, ww, hh)
                resolve()
            }
        }))
    }
    // When all clouds are drawn start drawing stars..
    let starProms = []
    Promise.all(cloudProms).then(() => {
        let nbStars = 20
        for (let ss = 0; ss < nbStars; ss++) {
            starProms.push(new Promise(function (resolve, reject) {
                let img = new Image()
                img.src = starTab[Math.floor(Math.random() * starTab.length)]
                img.alpha = 0.6 + 0.4 * Math.random()
                img.onload = function () {
                    ctx.globalCompositeOperation = 'screen'
                    ctx.globalAlpha = 0.4
                    let xpos = mc.width * (Math.floor(ss * 4 / nbStars) + Math.random()) / 4
                    let ypos = mc.height * (ss - Math.floor(ss / 4) * 4 + Math.random()) / 4
                    let size = 20 + 10 * Math.random()
                    ctx.drawImage(img, xpos, ypos, size, size)
                    resolve()
                }
            }))
        }
    })
    // When all stars are drawn, draw text..
    Promise.all(starProms).then(() => {
        // Define title and subtitle :
        let title = 'Le 13 juin 2016..'
        let subtitle = 'Federer reached the threshold of 300 Grand Slam success and go and go and go and go'
        title = false
        subtitle = ''
        if (!title) {
            if (state.currentEvent.type === 'news') {
                title = (state.locale === 'fr' ? 'Le ' : 'On ') + moment(state.currentEvent.date).format('LL')
                subtitle = state.currentEvent.title[state.locale === 'fr' ? 'fr' : 'en']
            } else {
                if (state.currentEvent.specialDay) {
                    title = (state.locale === 'fr' ? 'Le ' : 'On ') + moment(state.currentEvent.start).format('LL')
                    subtitle = state.currentEvent.specialDay
                } else {
                    if (state.currentEvent.fromNow) {
                        subtitle = state.currentEvent.fromNow
                    }
                    if (state.currentEvent.type === 'date') {
                        title = (state.locale === 'fr' ? 'Le ' : 'On ') + moment(state.currentEvent.start).format('LL')
                    } else {
                        let pref = state.locale === 'fr' ? 'En ' : 'In '
                        if (state.currentEvent.type === 'saison' && state.currentEvent.logo === 'flower') {
                            pref = 'Au '
                        }
                        title = pref + state.currentEvent.name
                    }
                }
                title += '..'
            }
        }
        // Get the song currently playing :
        let mySong
        state.currentSongsData.forEach(val => {
            if (parseInt(val.id, 10) === parseInt(state.currentSongID, 10)) {
                mySong = val
            }
        })
        if (!mySong) {
            mySong = {
                id: '123',
                title: 'I used to like spaghettis with a lot of sauce mmh it was so delicious. I used to like spaghettis with a lot of sauce mmh it was so delicious',
                artist: {id: 'abc', name: 'The Pains of Being Pure at Heart'}
            }
        }

        ctx.globalAlpha = 1
        // Title
        ctx.font = 'italic 40px Raleway'
        ctx.fillStyle = 'white'
        ctx.textAlign = 'right'
        let rectTitle = wrapText(ctx, title, mc.width - 10, 70, Math.max(0.8 * mc.width, mc.width - 50), 40, true)
        // I listened to..
        ctx.textAlign = 'center'
        wrapText(ctx, state.locale === 'fr' ? 'J\'écoutais :' : 'I listened to :', mc.width / 2, mc.height / 2, mc.width, 40, true)
        // Subtitle
        ctx.font = '26px Roboto'
        ctx.fillStyle = '#A493C6'
        ctx.textAlign = 'right'
        wrapText(ctx, subtitle, mc.width - 10, 80 + rectTitle.h, 0.8 * mc.width, 26, true)
        // Song title
        ctx.textAlign = 'left'
        ctx.font = '26px Roboto'
        let songRect = wrapText(ctx, '"' + mySong.title + '"', 0, 0, mc.width - 40, 26, false)
        ctx.fillStyle = state.bckCol
        ctx.globalCompositeOperation = 'screen'
        ctx.fillRect(20, mc.height - 5 - 26 - songRect.h, songRect.w, songRect.h)
        ctx.fillStyle = 'black'
        ctx.globalCompositeOperation = 'source-over'
        wrapText(ctx, '"' + mySong.title + '"', 20, mc.height - 10 - songRect.h, mc.width - 40, 26, true)
        // Artist name
        ctx.textAlign = 'left'
        ctx.font = '40px Times New Roman'
        let artistRect = wrapText(ctx, mySong.artist.name, 0, 0, mc.width - 40, 40, false)
        ctx.fillStyle = state.bckCol
        ctx.globalCompositeOperation = 'screen'
        ctx.fillRect(20, mc.height - 40 - songRect.h - artistRect.h, artistRect.w, artistRect.h)
        ctx.fillStyle = 'black'
        ctx.globalCompositeOperation = 'source-over'
        wrapText(ctx, mySong.artist.name, 20, mc.height - 5 - songRect.h - artistRect.h, mc.width - 40, 40, true)
    })
}
