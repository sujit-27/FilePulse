const taskinput = document.querySelector("#task");
const filtertaskinput = document.querySelector("#filtertask");
const addbtn = document.querySelector("#addtask");
const clrbtn = document.querySelector("#cleartask"); 
const tasklist = document.querySelector(".tasks");
const tasklistitems = document.querySelector(".tasks li");
const close = document.querySelector(".material-symbols-outlined");

let mytasks = [];

let tasksfromLocalStorage = JSON.parse(localStorage.getItem("MyTasks"));
if(tasksfromLocalStorage){
    mytasks = tasksfromLocalStorage;
    addtask(mytasks);
}

function addtask(mytasks){
    let listitems = "";
    for(let i=0 ; i<mytasks.length ; i++){
        listitems += `
        <li>
             ${mytasks[i]}
             <i class="close"></i>
            <span class="material-symbols-outlined">close</span>
        </li>
        `
    }
    tasklist.innerHTML = listitems;
}

addbtn.addEventListener("submit" , () => {
        mytasks.push(taskinput.value);
        taskinput.value = ""
        localStorage.setItem("MyTasks",JSON.stringify(mytasks))
        addtask(mytasks);
})

clrbtn.addEventListener("click", () => {
    localStorage.clear();
    mytasks = [];
    addtask(mytasks);
})

close.addEventListener("click",(e) =>{
    e.target.remove();
})

filtertaskinput.addEventListener("focus",filtertask);

function filtertask(){
    let filteritems = filtertaskinput.value.toLowerCase();
    
    tasklist.forEach((item) => {
        const task = item.textContent.toLowerCase();
        item.style.display = text.includes(filteritems) ? 'block' : 'none' ;
    });
}