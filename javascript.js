const form = document.querySelector("form"),
fileInput = form.querySelector(".fileinput"),
progressArea = document.querySelector(".progress-area"),
uploadedArea = document.querySelector(".uploaded-area")

form.addEventListener("click", ()=>{
    fileInput.click();
});
fileInput.onchange = ({target}) =>{
    // console.log(target.files);
    let file = target.files[0]; //getting file and [0] this means if user has selacted multiples files then get first one only
    if(file){ // if file is selected 
        let fileName = file.name; // getting selected file name
        // console.log(fileName);
        if(fileName.length >= 12){
            let splitName = fileName.split('.');
            fileName = splitName[0].substring(0,12) + "... ." + splitName[1];
        }
        uploadFile(fileName); // calling uploadFile with passing file name as an argument.
    }
}

function uploadFile(name){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "php/upload.php"); // sending post request to the specified URL/File
    xhr.upload.addEventListener("progress", ({loaded, total}) =>{
        // console.log(e);
        let fileLoaded = Math.floor((loaded / total) * 100);
        let fileTotal = Math.floor(total / 1000); //getting file size in KB from bytes
        console.log(fileLoaded, fileTotal);
        let fileSize;
        (fileTotal < 1024) ? fileSize = fileTotal + "KB" : fileSize = (loaded / (1024 * 1024)).toFixed(2) + " MB";
        let progressHTML = `<li class="row">
                        <i class="fas fa-file-alt"></i>
                        <div class="content">
                        <div class="details">
                        <span class="name">${name} Uploading</span>
                        <span class="size">${fileLoaded}%</span>
                    </div>
                    <div class="progress-bar">
                    <div class="progress" style="width: ${fileLoaded}%"></div>
                    </div>
                    </div>
                    </li>`;
                    uploadedArea.classList.add("onprogress");
                    // uploadedArea.innerHTML = "";
                    progressArea.innerHTML = progressHTML;

        if(loaded == total){
        progressArea.innerHTML = "";
        let uploadHTML = ` <li class="row">
                        <i class="fas fa-file-alt"></i>
                        <div class="content">
                        <div class="details">
                        <span class="name">${name} Uploading</span>
                        <span class="size">${fileSize}</span>
                        </div>
                        </div>
                        <i class="fas fa-check"></i>
                        </li>`;
                        uploadedArea.classList.remove("onprogress");
                        // uploadedArea.innerHTML = uploadHTML;
        uploadedArea.insertAdjacentHTML("afterbegin",uploadHTML);
        }
    });
    let data = new FormData(form); //formData is an object to easily send form data 
    xhr.send(data); //sending form data to php
}