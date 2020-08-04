function addPrePostToStudents(logStudentsObj, preArr, postArr) {
	let logPrePostArr = [];
	prePostArr = intersection(preArr, postArr);
	for (stud of prePostArr) {
		let id = stud.UserID;
		if (typeof (logStudentsObj[id]) != 'undefined') {
			let logStud = logStudentsObj[id];
			logPrePostArr.push(logStud);
		}
		return logPrePostArr;
	}
}


function compareStudents(arr1, obj2) {
	const keyArr = ['UserID', '1', '2', '3', '4'];
	let id,
		matched = [],
		unmatched = [],
		prePostMatched = 0,
		prePostUnmatched = 0,
		noPrePostMatched = 0,
		noPrePostUnmatched = 0;
	for (i = 0; i < arr1.length; i++) {
		stud1 = arr1[i];
		id = stud1.id;
		stud2 = obj2[id];
		if (typeof (stud2) === 'undefined') {
			unmatched.push(stud1);
		} else {
			matched.push(stud2);
		}
	}
	console.log(`Out of ${arr1.length} students in the array, ${matched.length} matched a student in the object and ${unmatched.length} did not.`);
	for (stud of matched) {
		if ((stud.pre) && (stud.post)) {
			prePostMatched++;
		} else {
			noPrePostMatched++;
		}
	}
	for (stud of unmatched) {
		if ((stud.pre) && (stud.post)) {
			prePostUnmatched++;
		} else {
			noPrePostUnmatched++;
		}
	}
	console.log(`${prePostMatched} of the matched students did the pre and post.`);
	console.log(`${noPrePostMatched} of the matched students did not do the pre and post.`);
	console.log(`${prePostUnmatched} of the unmatched students did the pre and post.`);
	console.log(`${noPrePostUnmatched} of the unmatched students did not do the pre and post.`);
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
var recentArr = [];
var recentObj = {};
var researchArr = [];
var researchObj = {};

function createPrePostArrays(evt) {
	var fileCount = 0;
	var studArr = [];
	var studObj = {};
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
					testType = data[0][1],
					header = data[1],
					row, UserID, teacher;
				for (let i = 2; i < data.length; i++) {
					row = data[i];
					UserID = data[i][5];
					teacher = data[i][7];
					if (typeof (studObj[UserID]) != 'undefined') {
						stud = studObj[UserID];
					} else {
						stud = new Object;
						stud.cohort = cohort;
						stud.UserID = UserID;
						stud.id = UserID;
						stud.teacher = teacher;
					}
					stud[testType] = true;
					for (let i = 8; i < header.length; i++) {
						stud[testType + '_' + header[i]] = row[i];
					}
					//		addAnswers(stud, row, header, testType);
					scoreAnswers(stud, testType);
					studArr.push(stud);
					studObj[stud.UserID] = stud;
					switch (cohort) {
						case 'Trudi':
							trudiArr.push(stud);
							trudiObj[stud.UserID] = stud;
							break;
						case 'Recent':
							recentArr.push(stud);
							recentObj[stud.UserID] = stud;
							break;
						case '2019':
							researchArr.push(stud);
							researchObj[stud.UserID] = stud;
							break;
					}
				}
				console.log(`fileCount is ${fileCount},  testType = ${testType}.`)
			}
		})(f);
		reader.readAsText(f);
	}
}