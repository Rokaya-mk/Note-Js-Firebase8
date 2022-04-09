//get ul tag 
const list = document.querySelector('ul');

//show data 
getNotes = (note,id) =>{
    const html = `
    <li class=" mr-4 p-3 mb-3" item-id="${id}">
        <h3> ${note.titre} </h3>
        <p>${note.note}</p>
        <small>${note.created_at.toDate()}</small><br>
    <button class="btn btn-danger btn-sm my-3">Supprimer</button>
    </li> `
    list.innerHTML += html
}
//remove deleted note from list
removedNotes = id => {
    const items = document.querySelectorAll('li')
    items.forEach(item => {
        if(item.getAttribute('item-id') === id){
            item.remove()
        }
    })
}
//get collection notes from firebase
db.collection("notes").onSnapshot(res =>{
    res.docChanges().forEach(note =>{
        if(note.type === 'added'){
            getNotes(note.doc.data(),note.doc.id)
        }else{
            removedNotes(note.doc.id)
        }
    })
})

                      
//add new note
//get form tag 
const form = document.querySelector('form')
form.addEventListener('submit',e =>{
    e.preventDefault()
    //create a date 
    const now = new Date()
    //creat note object
    const note = {
        titre: form.titre.value,
        note: form.note.value,
        created_at : firebase.firestore.Timestamp.fromDate(now)
    }
    //add object to firebase collection
    db.collection("notes").add(note)
      .then(res => console.log('note added!! ',res))
      .catch(res => console.error(res))
      form.reset()
})
//delete note 
list.addEventListener('click',(e) =>{
    if(e.target.tagName === 'BUTTON'){
        const noteId = e.target.parentElement.getAttribute('item-id')
        //delete item from firebase
        db.collection("notes").doc(noteId).delete()
          .then(res => console.log('note deleted!!'))
          .catch(res => console.error(res))
    }
})