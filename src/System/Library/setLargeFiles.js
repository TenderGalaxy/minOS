/*
Robust SetFile system that extends on kernel

setFile(file, data) : Set a file. If data is not an object that contains name, extension, and contents, then setFileAttribute will be used instead of setFile.
*/

globalThis.setFile = function(file, contents){
  
}
globalThis.files = {
  renameFile(file, name){
    setFileAttribute(file, 'name', name)
    return true
  },
  renameFileExtension(file, name){
    setFileAttribute(file, 'extension', name)
    return true
  },
  renameFileName(file, name){
    let r = name.split('.')
    setFileAttribute(file, 'extension', r.at(-1))
    r = r.pop()
    r = r.join('.')
    setFileAttribute(file, 'name', r)
    return true
  },
  getPartialJSON(js){/* don't ask why this function is here */
    if(typeof(js) != "string"){
      js = JSON.stringify(js)
    }
    let a = js.lastIndexOf(',')
    js = js.slice(0,a) + '}'
    return JSON.parse(js)
  }
  getFileHeader(file){ /* An easier way to obtain file headers without wasting RAM and TU by using getFile */
   let m = api.getBlockData(followPath(file), 1e5, 1).persisted?.shared?.c
    return getPartialJSON(m)
  },
  setFilePage(file, n, x){ /* internal function, usage is not recommended as it can corrupt the file by disrupting the JSON parsing and removing information*/
    setBlockData([followPath(file), 1e5, n], {persisted: {shared: {c: JSON.stringify(x)}}})
    return true
  }
}
