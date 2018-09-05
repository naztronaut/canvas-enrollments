/*
	script.js
	Title: Canvas Enrollments API - List Users' Enrollments
	Author: Nazmus
	URL: https://www.easyprogramming.net
	Instructure Docs: https://canvas.instructure.com/doc/api/enrollments.html
	Github: https://github.com/naztronaut/

	Custom JS file for Enrollments API Script
*/

$(document).ready(function () {

    var multiples = []; // array placeholder for any results that return multiples

    $("#myForm").on("submit", function (e) {
        var apiKey = $("#apiKey").val();
        var domain = $("#domain").val();
        multiples = [];
        var table = $("<table>").addClass("table table-striped table-hover table-bordered");
        var thead = $("<thead>");
        var row = $("<tr>");

        $("#output").html("<div id='resultTitle'>Results</div>"); //clear HTML
        $("#multiples").html('');
        $(thead).append($(row).append($("<th>").append("SIS ID").addClass("info"))); //if show PersonID is checked
        $(thead).append($(row).append($("<th>").append("Name").addClass("info"))); //if show PersonID is checked
        $(thead).append($(row).append($("<th>").append("Course Code").addClass("info"))); //if show Name is checked
        $(thead).append($(row).append($("<th>").append("Term").addClass("info"))); //if show PersonID is checked
        $(thead).append($(row).append($("<th>").append("Role").addClass("info"))); //if show email is checked

        $(table).append($(thead));
        var list = $("#text").val().split("\n"); // array item per newline 
        list.forEach(function (item, i) {
            var item1;
            (item == "") ? "" : searchMe(item);

            function searchMe(item) {
                $.ajax({
                    url: 'code/enrollments/canvascurler.php', //'https://'+environment+'.instructure.com/api/v1/accounts/self/users?access_token=' + canHBSkey,
                    method: 'GET',
                    data: {
                        url: 'instructure.com/api/v1/accounts/self/users?search_term=' + item,
                        domain : domain,
                        apiKey : apiKey
                    },
                    dataType: "json",
                    success: function (data) {
                        (data.length > 1) ? multiples.push(item): '';
                        //                        console.log(multiples);
                        var id = data[0]['id']; //get id from result - if multiple results, only the first ID will be grabbed, the rest will be ignored
                        var name = data[0]['name'];
                        var personId = data[0]['sis_user_id'];
                        
                        getCourses(id, table, name, personId, domain, apiKey); //pass id for another canvas api call -- add showPic argument to pass in picture
                    }
                }).done(function () {
                    (multiples.length > 0) ? $("#multiples").html("The following searches returned multiple results, please double check: " + multiples).addClass("bg-danger"): ''; // when the ajax is completed, display the list of users who appeared multiple times
                });
            }
            $("#output").append($(table));
        });
        e.preventDefault();
    });
    
    $(document).ajaxStart(function(){
        $("#spinner").show();
    });
    $(document).ajaxStop(function(){
        $("#spinner").hide();
    });
});

//add sPic parameter to get Picture
function getCourses(id, table, name, personId, domain, apiKey) {
    $.ajax({
        url: 'code/enrollments/canvascurler.php',//'https://'+environment+'.instructure.com/api/v1/users/' + id + '/courses?per_page=999&include[]=term&access_token=' + canHBSkey,
        method: 'GET',
        data: {
            url: 'instructure.com/api/v1/users/' + id + '/courses?per_page=999&include[]=term',
            domain : domain,
            apiKey : apiKey
        },
        dataType: "json",
        success: function (data) {
            var email = data['primary_email']; //get primary email from canvas profile 
            if (data !== '') {
                $(data).each(function (i, item) {
                    displayData(item, table, name, personId, domain);
                });
            }
        }
    });
}

//get course information from getCourses() and display onto screen
function displayData(item, table, name, personId, domain) {
    console.log(name + personId);
    var tr = $("<tr>");
    $(tr).append($("<td>").append(personId)).append($("<td>").append(name))
        .append($("<td>").append("<a href=\"https://"+domain+".instructure.com/courses/"+item['id']+"\">"+item['course_code']+"</a>"))
        .append($("<td>").append(item['term'].name))
        .append($("<td>").append(item['enrollments'][0]['role']));
    $(table).append(tr);
    $("#output").append(table);
}