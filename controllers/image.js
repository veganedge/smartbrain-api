const Clarifai = require('clarifai');
const { response } = require('express');

const app = new Clarifai.App({
    apiKey: '77317ed803754d02a6a5c11e2bc90e0a'
});

const handleApiCall = (req, res) => {
    app.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => {
            res.json(data);
        })
        .catch(err => response.status(400).json('unable to work with api'))
} 

const handleImage = (req, res, db) => {
    const { id } = req.body;
   db('users').where('id', '=', id)
   .increment('entries', 1)
   .returning('entries')
   .then(entries => {
       res.json(entries[0]);
   })
   .catch(err => res.status(400).json('unable to get entry count'))
}

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
};