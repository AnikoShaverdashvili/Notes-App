const saveBtn=document.querySelector("#saveBtn");
const titleInput=document.querySelector("#title");
const descInput=document.querySelector("#description");
const notesContainer=document.querySelector("#notesContainer");
const deleteBtn=document.querySelector("#deleteBtn");
const clearAllBtn = document.querySelector("#clearAllBtn");


function clearForm(){
    titleInput.value="";
    descInput.value="";
    deleteBtn.classList.add("hidden");
    saveBtn.removeAttribute('data-id');
}

function displayNoteInForm(note){
    titleInput.value=note.title;
    descInput.value=note.description;
    deleteBtn.classList.remove("hidden");
    deleteBtn.setAttribute('data-id',note.id);
    saveBtn.setAttribute('data-id',note.id);
}

function getNoteById(id){
    fetch(`https://localhost:7028/api/notes/${id}`)
    .then(data=>data.json())
    .then(responce=>displayNoteInForm(responce));

}

function populateForm(id){
    getNoteById(id);
}

function addNote(title,description){

    const body={
        title:title,
        description:description,
        isVisible:true
    };
    fetch('https://localhost:7028/api/notes',{
        method:"POST",
        body:JSON.stringify(body),
        headers: {
            "content-type":"application/json"
        }
    })
    .then(data=>data.json())
    .then(responce=>{
        clearForm();
        getAllNotes();
    });
}


function displayNotes(notes) {
    let allNotes="";
    notes.forEach(note => {
        noteElement = `
            <div class="note" data-id="${note.id}">
                <h3 class="note-h3">${note.title}</h3>
                <p class="note-p">${note.description}</p>
            </div>
        `;
        allNotes+=noteElement;
    });
    notesContainer.innerHTML = allNotes;


    //add event listener

    document.querySelectorAll(".note").forEach(note=>{
        note.addEventListener('click',function(){
            
            populateForm(note.dataset.id);
        })
    })
}

function getAllNotes(){
    fetch('https://localhost:7028/api/notes')
    .then(data=>data.json())
    .then(responce=>displayNotes(responce));
}
getAllNotes();


saveBtn.addEventListener("click",function(){
    const id=saveBtn.dataset.id;
    if(id){
        updateNote(id,titleInput.value,descInput.value);
    }
    else{
            addNote(titleInput.value,descInput.value);
    }
})


function updateNote(id,title,description){
    const body={
        title:title,
        description:description,
        isVisible:true
    };
    fetch(`https://localhost:7028/api/notes/${id}`,{
        method:"PUT",
        body:JSON.stringify(body),
        headers: {
            "content-type":"application/json"
        }
    })
    .then(data=>data.json())
    .then(responce=>{
        clearForm();
        getAllNotes();
    });
}


function deleteNote(id){
    fetch(`https://localhost:7028/api/notes/${id}`,{
        method:"DELETE",
        headers: {
            "content-type":"application/json"
        }
    })
    .then(responce=>{
        clearForm();
        getAllNotes();
    });
}
function clearAll() {
    fetch('https://localhost:7028/api/notes', {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        notesContainer.innerHTML = '';
      } else {
        throw new Error('Something went wrong');
      }
    })
    .catch(error => {
      console.error(error);
    });
  }
  
  clearAllBtn.addEventListener('click', function() {
    clearAll();
  });
  

deleteBtn.addEventListener("click",function(){
   const id=  deleteBtn.dataset.id;
deleteNote(id);
});