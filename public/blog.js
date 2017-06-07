$(document).ready(function(){
    //View Comments Event Listener
    $(".viewComments-btn").click(function(event){
        var articleId = event.target.attributes[2].value;
        $.get("/comments/" + articleId, function(data){
            //Create Vex Modal
            vex.dialog.open({
                message: "Comments",
                buttons:[
                    $.extend({},vex.dialog.buttons.NO,{text: "Close Window"})
                ]
            });
            //Edit the Current HTML using JQuery and Only Use Vex as Framework for Modal
            $.each(data[0].comments, function(i,val){
                var newDIV = $("<div>");
                var commentHeading = $("<h5>");
                var userHeading = $("<h6>");
                var deleteBTN = $("<button>");
                commentHeading.html(val.comment);
                commentHeading.attr("class", "comment-heading");
                userHeading.html("Comment left by " + val.name + " on " + val.dateInserted);
                deleteBTN.html("Delete Comment");
                deleteBTN.attr("commentId", val._id);
                deleteBTN.attr("class", "delete-btn btn-sm btn btn-danger");
                newDIV.append(commentHeading);
                newDIV.append(userHeading);
                newDIV.append(deleteBTN);
                $(".vex-dialog-form").append(newDIV);
            });
        });
    });

    //Delete Comments Event Listener. Delete Button Does Not Exist as Initial Render. Renders in Vex Modal. 
    $("body").on("click",".delete-btn", function(event){
        var commentId = event.target.attributes[0].value;
        $.ajax({
            method:"delete",
            url: "/deletecomment/" + commentId,
            //Create Vex Dialog to Confirm Comment Has Been Deleted
            success: vex.dialog.alert("Comment Has Been Deleted")
        });
    });

    //Event Listener for Creating a Comment
    $(".leaveComment-btn").click(function(event){
        console.log(event.target.attributes[2].value);
        todayDateString = new Date().toJSON().slice(0, 10)
        vex.dialog.open({
            message: 'Leave A Comment!',
            input: [
                '<style>',
                    '.vex-custom-field-wrapper {',
                        'margin: 1em 0;',
                    '}',
                    '.vex-custom-field-wrapper > label {',
                        'display: inline-block;',
                        'margin-bottom: .2em;',
                    '}',
                '</style>',
                '<div class="vex-custom-field-wrapper">',
                    '<label for="date">Name</label>',
                    '<div class="vex-custom-input-wrapper">',
                        '<input name="name" type="text" placeholder="John Doe" required />',
                    '</div>',
                '</div>',
                '<div class="vex-custom-field-wrapper">',
                    '<label for="date">Comment</label>',
                    '<div class="vex-custom-input-wrapper">',
                        '<textarea name="comment" type="text" placeholder="..." required /></textarea>',
                    '</div>',
                '</div>',
            ].join(''),
            callback: function (data) {
                if (data.name == null || data.comment == null) {
                    return console.log('Cancelled')
                }
                else{
                    var Data = {
                        name: data.name,
                        comment: data.comment,
                        articleId: event.target.attributes[2].value
                    }
                    $.post("/addcomment", Data);
                    //Reload The Page to Refresh The Comment Count Upon Submission of the Comment
                    $(location).attr("href", "/");
                }
            }
        });
    });
});
