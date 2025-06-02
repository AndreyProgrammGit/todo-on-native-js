var validator = {
    validateLength: function (input, maxLength) {
        if(input.value.length <= maxLength && input.value.length >= 3) {
            return true;
        }
    },
    validateValue: function(input){
        if(input.value) {
            return true;
        }
    },
    validateDate: function(inputDate){
        if(/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(inputDate.value)){
            return true;
        }
    }
}

export default validator;