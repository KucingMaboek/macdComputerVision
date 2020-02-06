//Set Up
const selectButton = document.getElementById("select-button");
const fileInput = document.getElementById("file-input");

const reportStatus = message => {
    status.innerHTML += `${message}<br/>`;
    status.scrollTop = status.scrollHeight;
}

//Account info
const accountName = "macdwebapps";
const sasString = 
    "se=2025-02-25&sp=rwdlac&sv=2018-03-28&ss=b&srt=sco&sig=oiQNO6gvEbVU5AosVGgf6a5zQPGWUHFyp4%2BUlO6PiqU%3D";
const containerName = "computervisionblob";
const containerURL = new azblob.ContainerURL(
    `https://${accountName}.blob.core.windows.net/${containerName}?${sasString}`,
    azblob.StorageURL.newPipeline(new azblob.AnonymousCredential));

//Upload blobs
const uploadFiles = async () => {
    try {
        reportStatus("Uploading files...");
        const promises = [];
        for (const file of fileInput.files) {
            const blockBlobURL = azblob.BlockBlobURL.fromContainerURL(containerURL, file.name);
            url = blockBlobURL.url.split("?")[0];
            // analyzeImage(url);
            document.querySelector("#inputImage").value = url;
            console.log(url);
            promises.push(azblob.uploadBrowserDataToBlockBlob(
                azblob.Aborter.none, file, blockBlobURL));
        }
        await Promise.all(promises);
        reportStatus("Done.");
    } catch (error) {
        console.log(error);
        reportStatus(error.body.message);
    }
}

selectButton.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", uploadFiles);


function analyzeImage() {
    var subscriptionKey = "403014431ee447f9a86e48a044d24e76";
    var uriBase =
        "https://southeastasia.api.cognitive.microsoft.com/vision/v2.0/analyze";

    // Request parameters.
    var params = {
        "visualFeatures": "Categories,Description,Color",
        "details": "",
        "language": "en",
    };

    // Display the image.
    var sourceImageUrl = document.getElementById("inputImage").value;
    document.querySelector("#sourceImage").src = sourceImageUrl;

    // Make the REST API call.
    $.ajax({
        url: uriBase + "?" + $.param(params),

        // Request headers.
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader(
                "Ocp-Apim-Subscription-Key", subscriptionKey);
        },

        type: "POST",

        // Request body.
        data: '{"url": ' + '"' + sourceImageUrl + '"}',
    })

    .done(function(data) {
        // Show captions on webpage.
        document.getElementById("imageCaptions").innerHTML = data.description.captions[0].text;
    })

    .fail(function(jqXHR, textStatus, errorThrown) {
        // Display error message.
        var errorString = (errorThrown === "") ? "Error. " :
            errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ? "" :
            jQuery.parseJSON(jqXHR.responseText).message;
        alert(errorString);
    });
};