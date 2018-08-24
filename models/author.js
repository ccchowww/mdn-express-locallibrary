var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var moment = require('moment');

var AuthorSchema = new Schema(
    {
        first_name: {type: String, required: true, max: 100},
        family_name: {type: String, required: true, max:100},
        date_of_birth: {type: Date},
        date_of_death: {type: Date},
    }
);


//Virtual for author's full name.
AuthorSchema
.virtual('name')
.get(function() {
    return (this.family_name + ', ' + this.first_name);
});


//Virtual for author's URL
AuthorSchema
.virtual('url')
.get(function() {
    return ('/catalog/author/' + this.id) 
});

//Virtual for author's lifespan
AuthorSchema
.virtual('lifespan')
.get(function() {
    const birthdate = this.date_of_birth;
    const deathdate = this.date_of_death;
    if (birthdate && deathdate) {
        return moment(birthdate).format('YYYY-MM-DD') + " - " + moment(deathdate).format('YYYY-MM-DD')
    } else if (birthdate) {
        return moment(birthdate).format('YYYY-MM-DD')
    } else {
        return "y u no birthday"
    }
})

//Export model
module.exports = mongoose.model('Author', AuthorSchema);