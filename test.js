function compareStudents(sig, sigObj, noSig, noSigObj, trudiArr, trudiObj) {
	let sigButNotNoSig = [];
	let noSigButNotSig = [];
	let sigAndNoSig = [];
	let neither = [];
	let trudiButNotSig = [];
	let trudiButNotNoSig = [];
	let trudiAndSig = [];
	let trudiAndNoSig = [];
	let sigIds = [],
		noSigIds = [],
		trudiIds = [];
	for (s of sig) {
		sigIds.push(s.Student);
	}
	for (n of noSig) {
		noSigIds.push(n.Student);
	}
	for (t of trudiArr) {
		trudiIds.push(t['UserID']);
	}

	for (item of trudiArr) {
		if ((noSigIds.includes(item['UserID'])) && !(sigIds.includes(item['UserID']))) {
			noSigButNotSig.push(item);
		}
		if ((sigIds.includes(item['UserID'])) && !(noSigIds.includes(item['UserID']))) {
			sigButNotNoSig.push(item);
		}
		if ((sigIds.includes(item['UserID'])) && (noSigIds.includes(item['UserID']))) {
			sigAndNoSig.push(item);
		}
		if (!(sigIds.includes(item['UserID'])) && !(noSigIds.includes(item['UserID']))) {
			neither.push(item);
		}
		if ((trudiIds.includes(item['UserID'])) && !(sigIds.includes(item['UserID']))) {
			trudiButNotSig.push(item);
		}
		if ((trudiIds.includes(item['UserID'])) && (sigIds.includes(item['UserID']))) {
			trudiAndSig.push(item);
		}
		if ((trudiIds.includes(item['UserID'])) && !(noSigIds.includes(item['UserID']))) {
			trudiButNotNoSig.push(item);
		}
		if ((trudiIds.includes(item['UserID'])) && (noSigIds.includes(item['UserID']))) {
			trudiAndNoSig.push(item);
		}
	}
	console.log(`${sigAndNoSig.length} students are in the significant cohort and the insignificant one.`);
	console.log(`${sigButNotNoSig.length} students are in the significant cohort but not in the insignificant one.`);
	console.log(`${noSigButNotSig.length} students are in the insignificant cohort but not in the significant one.`);
	console.log(`${neither.length} students are in neither the insignificant cohort nor the significant one.`);
	console.log(`${trudiButNotSig.length} students are in the Trudi cohort but not in the significant one.`);
	console.log(`${trudiAndSig.length} students are in the Trudi cohort and in the significant one.`);
	console.log(`${trudiAndNoSig.length} students are in the Trudi cohort and in the insignificant one.`);
	console.log(`${trudiButNotNoSig.length} students are in the Trudi cohort but not in the insignificant one.`);
	testScoresEqual(sigObj, noSigObj, sigAndNoSig);
	//findExtraTeachers(trudiObj, trudiButNoSig, noSigObj);
}

function findExtraTeachers(trudiObj, trudiButNoSig, noSigObj) {
	let extras = [],
		stud,
		teachersArr = [];
	for (item of trudiButNoSig) {
		stud = trudiObj[item.UserID];
		teacherName = stud.Teachers;
		if (!teachersArr.includes(teacherName)) {
			teacher = new Object;
			teacher.students = [];
			teacher.uniqueStudents = [];
			teacher.name = teacherName;
			teachersArr.push(teacherName);
			teachersObj[teacherName] = teacher;
		} else {
			teacher = teachersObj[teacherName];
		}
		teacher.students.push(stud);
		if (typeof noSigObj[stud.UserID] != 'undefined') {
			teacher.uniqueStudents.push(stud);
		}
	}
	console.log(teachersArr.length + ' teachers in Trudi cohort have students who are not in the insignificant cohort.');
	for (name of teachersArr) {
		teach = teachersObj[name];
		console.log(`${name} has ${teach.students.length} students of whom ${teach.uniqueStudents.length} are not in the insignificant cohort.`)
	}
	console.log('stop');
}


function testScoresEqual(sigObj, noSigObj, sigAndNoSig) {
	let scoreArr = ['Pre-total', 'Pre-allele', 'Pre-protein]', 'Post-total', 'Post-allele', 'Post-protein', 'allele-targetMatch-visible-simpleDom', 'allele-targetMatch-visible-simpleDom2', 'allele-targetMatch-hidden-simpleDom', 'allele-targetMatch-hidden-simpleDom2', 'allele-targetMatch-visible-armorHorns', 'allele-targetMatch-visible-armorHorns2', 'allele-targetMatch-visible-armorHorns3', 'allele-targetMatch-hidden-armorHorns', 'allele-targetMatch-hidden-armorHorns2', 'allele-targetMatch-hidden-armorHorns3',
		'allele-targetMatch-visible-simpleColor',
		'allele-targetMatch-visible-simpleColor2', 'allele-targetMatch-visible-simpleColor3',
		'allele-targetMatch-visible-simpleColor4',
		'allele-targetMatch-visible-simpleColor5',
		'allele-targetMatch-hidden-simpleColor',
		'allele-targetMatch-hidden-simpleColor2', 'allele-targetMatch-hidden-simpleColor3'
	]
	for (stud of sigAndNoSig) {
		sigStud = sigObj[stud.UserID];
		noSigStud = noSigObj[stud.UserID];
		for (scoreType of scoreArr) {
			let delta = diff(sigStud, noSigStud, scoreType)
			if (delta > 2) {
				console.log(`Student ${stud.Student} of teacher ${stud.Teacher} and class ${stud.Class} scores ${sigStud[scoreType]} on the ${scoreType} in the significant cohort and ${noSigStud[scoreType]} in the non-significant cohort.`);
				console.log(`The last run for the signficant cohort was ${sigStud['Last run']}, for the non-signficant cohort it was ${noSigStud['Last run']}.`)
			}
		}
	}
}

function diff(sigStud, noSigStud, scoreType) {
	let delta;
	if ((typeof sigStud[scoreType] != "undefined") && (typeof noSigStud[scoreType] != "undefined")) {
		delta = Math.abs(noSigStud[scoreType] - sigStud[scoreType]);
		return (delta);
	} else {
		return null;
	}
}

function compareSigNosig(evt) {
	let files = evt.target.files;
	fileCount = 0,
		sigArr = [],
		noSigArr = [],
		sigObj = {},
		noSigObj = {},
		trudiArr = [],
		trudiObj = {};
	for (i = 0; i < files.length; i++) {
		file = files[i];
		let reader = new FileReader();
		reader.onloadend = (function (file) {
			return function (e) {
				fileCount++;
				let csvStr = e.target.result,
					csvArr = Papa.parse(csvStr),
					data = csvArr.data,
					header = data[0],
					sig = header[0],
					field,
					row;
				for (i = 1; i < data.length; i++) {
					row = data[i];
					stud = new Object;
					for (j = 1; j < header.length; j++) {
						field = header[j];
						stud[field] = row[j]
					}
					if (sig === 'significant') {
						sigArr.push(stud);
						sigObj[stud.Student] = stud;
					} else if (sig === 'not_significant') {
						noSigArr.push(stud);
						noSigObj[stud.Student] = stud;
					} else if (sig === 'Student ID') {
						trudiArr.push(stud);
						trudiObj[stud.UserID] = stud;
					} else {
						alert('no sig');
						break;
					}
				}
				if (fileCount > files.length - 1) {
					console.log(`${sigArr.length} students in significant cohort, ${noSigArr.length} in non-significant cohort, and ${trudiArr.length} in Trudi cohort.`);
					compareStudents(sigArr, sigObj, noSigArr, noSigObj, trudiArr, trudiObj);
				}
			}
		})(file);
		reader.readAsText(file);
	}
}

var trudiArr = [];
var trudiObj = {};
var trudiBoth = 0;

var cohorts = [];

function createPrePostArrays(evt) {
	var fileCount = 0;
	var files = evt.target.files; // FileList object
	for (var i = 0, f;
		(f = files[i]); i++) {
		let reader = new FileReader();
		reader.onloadend = (function (file) {
			return function (e) {
				fileCount++;
				let csvStr = e.target.result,
					csvArr = Papa.parse(csvStr),
					data = csvArr.data,
					cohort = data[0][0],
					testType = data[0][15].split(' ')[1].split('-')[0].toLowerCase(),
					header = data[1],
					row, UserID;
				for (let i = 2; i < data.length; i++) {
					row = data[i];
					UserID = data[i][5];
					if (typeof (trudiObj[UserID]) != 'undefined') {
						trudiBoth++;
						stud = trudiObj[UserID];
					} else {
						stud = new Object;
						stud.cohort = cohort;
						stud.UserID = UserID;
						for (let i = 9; i < header.length; i++) {
							stud[header[i]] = row[i];
						}
					}
					addAnswers(stud, row, header, testType);
					scoreAnswers(stud, testType);
					trudiArr.push(stud);
					trudiObj[stud.UserID] = stud;
				}
			}
		})(f);
		reader.readAsText(f);
	}
}
