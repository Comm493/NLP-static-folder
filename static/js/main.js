/*
* Handle the Submission of the analyze comment form
    > When the button with the id "analyze_text" is clicked, this code will run
*/
$("#analyze_text").on("click", function(){
    // Take the contents of the textarea with ID comment_query and assign it to the 
    // comment_text variable
    var comment_text = $("#comment_query").val();
  
    // Validate that the comment_text is not empty; if it is, then return false to quit the submission immediately
    if (comment_text.length <= 0) return false;
    
    // The comment appears to be present; we will, as such, send the AJAX request here
    $.ajax({
        url: 'analyze',               // The URL endpoint is @ /analyze
        method: 'POST',               // For now we will send a POST request with the data
        data: {'text': comment_text}, // Send a data object, storing the comment text in a 'text' parameter
		dataType: 'json',
        beforeSend: function(){
            // This code will run before the request is sent to our Python Code
            $("#loader").fadeIn();            
        },
        success: function(response){
            // This code will trigger after the response is returned from the Python code
            // in here we will display the response in the manner that we decide
            // The classes will be returned a "classes" property on the response object
            //  all 6 classes will be present (index 0,...,5) along with a corresponding confidence
            //  the confidence scores will sum to ~1 (meaning they can interpreted as a corresponding probability)
            //  for now we will simply append the results the body in a results list  
            $("#loader").fadeOut();
           
            //Travis's code
            console.log(response);
            //console.log("hello world") 
			
            let resultMessage = "";
            let returnedScores = "";
            var aScore = 0;
			const returnedValue = response.Results.output1.value;
            
            var result_length = Number(returnedValue.ColumnNames.length)
			for(let i = 0; i < result_length-1; i++) {
                aScore = (Number(returnedValue.Values[0][i])*100);
                aScore = aScore.toPrecision(3);
                const splitString = returnedValue.ColumnNames[i].split('"');

                var stringTing = returnedValue.ColumnNames[i].replace("Scored Probabilities for Class ", "");
                stringTing = stringTing.replace('"','');
                var newStr = stringTing.substring(0, stringTing.length-1);
                
                if (newStr == returnedValue.Values[0][6]){
                    var maxScore = aScore
                }

                //var indexOf = returnedValue.ColumnNames[i].indexOf("Class");

                if (newStr == "gibberish") {
                    returnedScores += "<div id='results_right'><ul> Gibberish (" + aScore + "%) </ul></div>";
                  }
                  else {
                    returnedScores += "<div id='results_right'><ul> " + newStr + " (" + aScore + "%) </ul></div>";
                  }
                //returnedScores += "<div class='result_table'><ul><strong> " + newStr + "</strong> (" + aScore + "%) </ul></div>";
                //returnedScores += "<p>" + i + "</p>"
                //returnedScores += "<p>" + newStr + "</p>"
				//resultMessage += "<ul><p><strong>" + returnedValue.ColumnNames[i] + "</strong>: " + returnedValue.Values[0][i] + "</p></ul>";
            }
            let result_sentence = ""
            //comment
            result_sentence += "<div id='sentence'> <p> Azure is <span class='confidence'> " + maxScore + "%</span> confidence that this comment is: <span class='class_name'>" + returnedValue.Values[0][6] + "</span> </p></div>";
            
			
			
            //$('#result_text').html(resultMessage);
            $('#after_list').html(returnedScores);
            $('#after_sentence').html(result_sentence);
            
            //end Travis's code. My old code follows
			/*
            //$("#results").html(""); // This removes any current text in the list w/ id "results"
            $("#result_text").html(""); // This removes any current text in the 'result_text' container

            // Add the main sentence to the "result_text" container
            $("#result_text").html("<p>Azure is <span class='confidence'>"+ // Add the the main result text line
                                        (response['Values'][1]*100).toFixed(2)+ // Generate % confidence
                                        "%</span> confident that this comment is: <span class='class_name'>"+ 
                                        response['ColunmNames'][1]+ // Add the class name
                                    "</span></p>");

            // Add the full prediction set to the list
            //response['classes'].forEach(function(element, index) {
                // This loops through each of the class elements;
                // index is the number 0..5 that corresponds to the given class
                //$("#results").append(
                  //      "<a class='list-group-item' href='#'>"+ // Add a list item anchor tag to the list
                    //        element['class_name']+      // Include the text of the class name
                      //      " ("+                       // In brackets include the confidence %
                        //        (element['confidence']*100).toFixed(2)+
                          //  "%)</a>");
            //});

            // Scroll the page to the top of the holder so that the user can see the results immediately
            $(window).scrollTop($("#results").offset().top);
*/
        }
    });

    // Return false prevents the default behaviour from engaging (i.e. the button will not actually submit the contents 
    // in the typical manner, since we have already handled the form submission)
    return false;
});

/*
* When the link with 'random-comment' class is clicked, we will make an ajax request to a backend URL 
* at /random-comment which simply returns the text of a comment choosen at random.
* This text is then added to the comment box.
*/ 
$(".random-comment").on("click", function(){
    alert("pressed");
    $.ajax({
        'url': 'random-comment',    // GET: /random-comment
        'method': 'GET',            //    no data is required
        'success': function(response) {
            if (response.length > 0) { 
                // If the response is set, add it to the text area
                alert(response);
                $("#comment_query").val(response);
            }
        }
    });

    return false; // Ensures that the link is not followed
});