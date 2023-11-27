function toggleFocus(focused){
    let Sheets = document.querySelectorAll('.ficha')
    console.log(Sheets)
    console.log(`${focused} is focused`)
    for(sheet of Sheets){
        //sheet.id
        if(sheet.id === focused){
            if(sheet.classList.contains('reduced')){
                sheet.classList.remove('reduced')
            }
        } else {
            if(!sheet.classList.contains('reduced')){
                sheet.classList.add('reduced')
            }
        }
    }
}