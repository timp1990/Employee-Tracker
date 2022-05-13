const Tracker = require("./lib/Tracker");

// Initialize a new Tracker object
const newTracker = new Tracker();

const program = new Promise((resolve, reject) => {
    // Start the Tracker
    let result = newTracker.startTracker();
    resolve(result)
})


