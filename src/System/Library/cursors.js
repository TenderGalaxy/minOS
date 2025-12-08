require("display.pack")
require("utils.pack")

globalThis.cursors = {
	decreaseClick(){
		isClicking = registerClick
		cursors.userCursorPos = getPlayerLook()
		if(registerClick){
			let a = [...cursors.clickFunctions]
			cursors.clickFunctions = []
			let m = ''
			while(a.length > 0){
				m = a.shift()
				m(cursors.userCursorPos)
			}
		}
		registerClick = false
		requestExecFunction(cursors.decreaseClick, '')
	},
	getPlayerLook(){
		let z = api.getPlayerFacingInfo(user)
		let look = z.camPos
		z = z.dir
		z[0] *= (50-look[2])/z[2]
		z[1] *= (50-look[2])/z[2]
		z[0] += look[0]
		z[1] += look[1]
		z[0] = Math.round(z[0] + config.displayx/2)
		z[1] = Math.round(config.displayy - z[1])
		if(inBounds(z[0], 0, config.displayx - 3) && inBounds(z[1], 0, config.displayy - 3)){
			return z
		}
		return [0,0]
	},
	requestClickFunction(x){
		cursors.clickFunctions.push(x)
	},
	clickFunctions: [],
	userCursorPos: []
}
cursors.decreaseClick()
