exports.getTokenOfEvent = function(event){
    return event.params.header.Authorization.split(' ')[1];
}