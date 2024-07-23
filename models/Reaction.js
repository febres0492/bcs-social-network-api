const { Schema, model, Types } = require('mongoose');
const f = require('../utils/helpers');

const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280,
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User' 
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => f.formatDate(createdAtVal),
        },
    },
    {
        toJSON: {
            getters: true,
        },
        _id: false,
    }
);

module.exports = { reactionSchema };