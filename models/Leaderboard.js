const mongoose = require('mongoose');

const LeaderboardSchema = new mongoose.Schema({
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
    },
    results: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Result',
        },
    ],
});

const Leaderboard = mongoose.model('Leaderboard', LeaderboardSchema);
module.exports = Leaderboard;
