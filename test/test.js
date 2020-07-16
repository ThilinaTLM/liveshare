const w = require('filewatcher')(
     {
            forcePolling: true,  // try event-based watching first
            debounce: 10,         // debounce events in non-polling mode by 10ms
            interval: 1000,       // if we need to poll, do it every 1000ms
            persistent: true      // don't end the process while files are watched
    }
);
const fs = require('fs')

// w.add("/home/tlm/Desktop/Test/");
w.add("/home/tlm/Desktop/Test/a.txt");
w.add("/home/tlm/Desktop/Test/b.txt");

w.on('change', (file, stat) => {
    console.log(file, stat.mtime);
})

// fs.watch("/home/tlm/Desktop/Test/", {persistent: true}, (event, filename) => {
//     console.log(event, filename)
// })