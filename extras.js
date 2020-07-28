function open2019PrePostFiles(evt) {
	var fileCount = 0;
	var files = evt.target.files; // FileList object
	for (var i = 0, f;
		(f = files[i]); i++) {
		var reader = new FileReader();
		reader.onerror = function (err) {
			console.log(err);
		};
		//closure to capture the file information
		reader.onloadend = (function (f) {
			return function (e) {
				fileCount++;
				let ppStudentsArr = [];
				let csvStr = e.target.result;
				let csvArr = Papa.parse(csvStr);
				let data = csvArr.data;
				let header = data[0];
				let questions = [];
				let shortQuestions = [];
				let lastQuestion = "";
				let testType = header[13].split("-")[0].split(" ")[1].toLowerCase();
				for (s = 15; s < header.length; s++) {
					header[s] = testType + '_' + header[s].split(':')[0]
				}
				for (let i = 1; i < data.length; i++) {
					let userId = data[i][5];
					if (userId != "") {
						if (typeof prepostStudentsObj[userId] != "undefined") {
							newStudent = prepostStudentsObj[userId];
						} else {
							newStudent = new Object();
						}
						for (let j = 0; j < header.length; j++) {
							newStudent[header[j]] = data[i][j];
						}
						newStudent.id = newStudent["UserID"];
						newStudent[testType] = true;
						newStudent[testType + '_%completed'] = newStudent['% Completed'].substring(0, newStudent['% Completed'].length - 1);
						newStudent[testType + '_#correct'] = parseInt(newStudent['# Correct'].split('/')[0]);
						newStudent[testType + "_total_score"] = 0;
						newStudent[testType + "_protein_score"] = 0;
						newStudent[testType + "_allele_score"] = 0;
						newStudent[testType + "_open_ended"] = 0;
						newStudent[testType + "_not_answered"] = 0;
						newStudent[testType + "_wrong"] = 0;
						for (y = 1; y < 30; y++) {
							q = testType + '_' + y;
							if (typeof newStudent[q] != 'undefined') {
								let ans = newStudent[q].split(' ')[0];
								let num = parseInt(q.split('_')[1]);
								switch (ans) {
									case 'not answered':
										newStudent[testType + "_not_answered"]++;
										break;
									case '(correct)':
										newStudent[testType + "_total_score"]++;
										if ((num < 25) && (num > 18)) {
											newStudent[testType + '_protein_score']++;
										} else {
											newStudent[testType + '_allele_score']++;
										}
										break;
									case '(wrong)':
										newStudent[testType + "_wrong"]++;
										break;
									default:
										newStudent[testType + '_open_ended']++;
										break;
								}
							}
						}
						if (Math.abs(newStudent.pre_score - newStudent.total_pre_score) > 1) {
							console.log(`Student ${newStudent.id} has an anomalous pre-score.`);
						}
						if (Math.abs(newStudent.post_score - newStudent.total_post_score) > 1) {
							console.log(`Student ${newStudent.id} has an anomalous post-score.`);
						}
						prepostStudentsObj[newStudent.id] = newStudent;
						prepostStudentsArr.push(newStudent);
					}
				}
			}
		})(f);
		reader.readAsText(f);
	}
}