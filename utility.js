require('dotenv').config()

const dfs = require('dropbox-fs')({
    apiKey: process.env.DROPBOX_TOKEN
})

const DEBUG = false

var utility = module.exports = {
    getOutputTime: (isLog = 0) => {
        const date = new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"})
        let day = date.getDate().toString()
        let month = (1 + date.getMonth()).toString()
        let year = date.getFullYear().toString()
        let hours = date.getHours().toString()
        let minutes = date.getMinutes().toString()
        let seconds = date.getSeconds().toString()
        
        month = month.length > 1 ? month : '0' + month
        day = day.length > 1 ? day : '0' + day
        hours = hours.length > 1 ? hours : '0' + hours
        minutes = minutes.length > 1 ? minutes : '0' + minutes
        seconds = seconds.length > 1 ? seconds : '0' + seconds
        
        if (isLog == 0) return `[${month}/${day}/${year} ${hours}:${minutes}:${seconds}] `
        else if (isLog == 1) return month + day + year
        else return `${month}/${day}/${year}`
    },
    writeLog: (toWrite) => {
        if (DEBUG) return console.log(toWrite)
        else
        {
            const filename = utility.getOutputTime(1) + '-log.txt'
            const logTime = utility.getOutputTime(0)
            let content = ''
            dfs.readFile(`/Chaos/${filename}`, { encoding: 'utf8'}, (err, res) => {
                if (err) content = `${logTime} ${toWrite}`
                else content = `${res}\n${logTime} ${toWrite}`
                dfs.writeFile(`/Chaos/${filename}`, content, {encoding: 'utf8'}, (err, stat) => {
                    if (err) console.log(`Error: ${err}`)
                })
            })
        }
    },
}