function openTeacherFiles(evt) {
	var fileCount = 0;
	var files = evt.target.files; // FileList object
	for (var i = 0, f;
		(f = files[i]); i++) {
		var reader = new FileReader();
		reader.onerror = function (err) {
			console.log(err);
		};
		//closure to capture the file information
		reader.onloadstart = (function (f) {
			return function (e) {
				let today = new Date();
				let time = today.getMinutes() + ":" + today.getSeconds() + "." + today.getMilliseconds();;
				console.log("File " + f.name + " has started to load at " + time + ".");
			}
		})(f);
		reader.onloadend = (function (f) {
			return function (e) {
				let today = new Date();
				let time = today.getMinutes() + ":" + today.getSeconds() + "." + today.getMilliseconds();
				fileCount++;
				var myTeacher = new Object();
				var myName = f.name.split(".")[0];
				myTeacher.id = myName;
				myTeacher.data = e.target.result;
				teachersArray.push(myTeacher);
				console.log("File " + f.name + " has finished loading " + e.loaded + " bytes at " + time + ". The data field is " + e.target.result.length + " long.");
				if (fileCount >= files.length - 1) {
					console.log('All done!');
				}
			}
		})(f);
		reader.readAsText(f);
	}
}