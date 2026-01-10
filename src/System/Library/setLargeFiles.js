/*
Robust SetFile system that extends on kernel
*/

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
    r.pop()
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
  },
  getFileHeader(file){ /* An easier way to obtain file headers without wasting RAM and TU by using getFile */
   let m = api.getBlockData(followPath(file), 1e5, 1).persisted?.shared?.c
    return getPartialJSON(m)
  },
  setFilePage(file, n, x){ /* internal function, usage is not recommended as it can corrupt the file by disrupting the JSON parsing and removing information*/
    setBlockData([followPath(file), 1e5, n], {persisted: {shared: {c: JSON.stringify(x)}}})
    return true
  }
}

function setFileSingleTick(x,z){
  let n = z.match(/.{1,300}/g)
  let m = followPath(x)
  if(!api.isBlockInLoadedChunk(1e5,m,0)){
    loadChunk(m)
    scheduleFirstUnused(() => (setFileSingleTick(x, z), functions.tick + 3))
    log('setLargeFiles.pack', 'Chunk unloaded, will schedule next tick.')
  } else {
  	api.setBlockData(1e5, m, 0, {persisted: {shared: {c: n.length}}})
  	for(let i = 0; i < n.length; i++){
    		api.setBlockData(1e5,m,i + 1,{persisted: {shared: {c: n[i]}}})
  	}
  }
}
globalThis.setFile = function(file, contents){
  contents = JSON.stringify(contents)
  file = followPath(file)
  if(contents.length < 20000){
    setFileSingleTick(file, contents)
  } else {
    contents = contents.match(/.{1,300}/g)
    files.setFilePage(file, 0, contents.length)
    for(let i = 0; i < contents.length; i++){
      schedule(() => files.setFilePage(file, i, contents[i]), Math.floor(i/10)+1)
    }
  }
}

globalThis.setFileSimple = function(loc, name, contents, under=0){
  let r = name.split('.')
  let m = r.pop()
  r = r.join('.')
  contents = Object.assign(contents, {name: r, extension: m})
  setFile(loc, contents)
  under = followPath(under)
  a = getFile(under)
  a.contents.append(loc)
  setFile(under, a)
  return true
}

