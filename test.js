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

//From 2019_signigicant
const sigArr = [
	238797,
	238798,
	238799,
	238800,
	238801,
	238802,
	238803,
	238805,
	238806,
	238807,
	238808,
	238809,
	238810,
	238815,
	238868,
	238869,
	238870,
	238871,
	238872,
	238873,
	238874,
	239991,
	240063,
	245565,
	251550,
	252025,
	256225,
	256230,
	256337,
	256371,
	258791,
	258792,
	258793,
	258794,
	258795,
	258796,
	258797,
	258798,
	258799,
	258800,
	258801,
	258802,
	258803,
	258804,
	258805,
	258806,
	258808,
	258809,
	258811,
	259680,
	260155,
	260156,
	260159,
	260160,
	260161,
	260163,
	260167,
	260170,
	260171,
	260173,
	260174,
	260177,
	260180,
	260338,
	260341,
	260344,
	260345,
	260347,
	260349,
	260352,
	260353,
	260355,
	260356,
	260357,
	260359,
	260362,
	260363,
	260364,
	260365,
	260366,
	260368,
	260370,
	260371,
	260375,
	261783,
	261805,
	261921,
	263100,
	263252,
	263259,
	263262,
	263266,
	263267,
	263269,
	263270,
	263271,
	263272,
	263279,
	263284,
	263641,
	263642,
	263643,
	263644,
	263645,
	263647,
	263651,
	263652,
	263655,
	263663,
	263671,
	264671,
	264674,
	264677,
	264678,
	264679,
	264683,
	264686,
	264687,
	264688,
	264738,
	264740,
	264741,
	264742,
	264745,
	264746,
	264747,
	264748,
	264749,
	264753,
	264754,
	264755,
	264932,
	265311,
	265312,
	265313,
	265314,
	265315,
	265316,
	265318,
	265319,
	266199,
	268005,
	268007,
	268008,
	268009,
	268010,
	268011,
	268012,
	268013,
	268014,
	268015,
	268016,
	268017,
	268018,
	268020,
	268021,
	269010,
	269011,
	269013,
	269016,
	269017,
	269019,
	269022,
	269026,
	271118,
	271720,
	271723,
	271724,
	271726,
	271728,
	271729,
	271730,
	271731,
	271732,
	271733,
	271734,
	271735,
	271736,
	271740,
	271742,
	271744,
	271746,
	271748,
	271749,
	271755,
	271775,
	271782,
	273035,
	273036,
	273037,
	273040,
	273041,
	273042,
	273043,
	273044,
	273046,
	273047,
	273048,
	273049,
	273050,
	273051,
	273052,
	273053,
	273054,
	273055,
	273057,
	273058,
	273061,
	274884,
	277464,
	277465,
	277466,
	277467,
	277468,
	277469,
	277470,
	277473,
	277474,
	277476,
	277479,
	277481,
	277484,
	277485,
	277488,
	277490,
	277491,
	277493,
	277495,
	277496,
	277497,
	277522,
	277523,
	277525,
	277761,
	277941,
	277942,
	277947,
	277949,
	277950,
	277951,
	277952,
	277953,
	277957,
	277958,
	277959,
	277960,
	277962,
	277963,
	277964,
	277966,
	277968,
	277969,
	277970,
	277971,
	277972,
	277974,
	277978,
	277981,
	278088,
	278090,
	278091,
	278092,
	278093,
	278094,
	278096,
	278097,
	278098,
	278099,
	278100,
	278101,
	278104,
	278108,
	278109,
	278110,
	278112,
	278115,
	278116,
	278118,
	278119,
	278123,
	278124,
	278125,
	278126,
	278127,
	278132,
	278137,
	278947,
	278949,
	278952,
	278985,
	279090,
	279443,
	279450,
];

//From 2019_four_teachers (not significant)
const nosigArr = [
	263267,
	263269,
	263259,
	263284,
	263262,
	263279,
	263270,
	263266,
	263271,
	263252,
	263272,
	263652,
	263647,
	263671,
	263644,
	263651,
	263645,
	263663,
	263643,
	263655,
	263642,
	263641,
	264687,
	264671,
	264678,
	264688,
	264677,
	264686,
	264679,
	264674,
	264683,
	264747,
	264745,
	264755,
	264749,
	264748,
	264753,
	264741,
	264738,
	264746,
	264740,
	264742,
	264754,
	264932,
	265318,
	265311,
	265312,
	265314,
	265313,
	265315,
	265316,
	265319,
	266199,
	268005,
	245565,
	251550,
	252025,
	256225,
	256230,
	256337,
	256371,
	258791,
	258794,
	258793,
	258792,
	258805,
	258797,
	258809,
	258796,
	258806,
	258803,
	258801,
	258802,
	258808,
	258811,
	258804,
	258795,
	258799,
	258798,
	259680,
	258800,
	260159,
	260161,
	260156,
	260163,
	260171,
	260173,
	260174,
	260155,
	260170,
	260167,
	260180,
	260177,
	260160,
	260349,
	260345,
	260341,
	260356,
	260359,
	260352,
	260368,
	260353,
	260347,
	260344,
	260357,
	260366,
	260363,
	260362,
	260355,
	260375,
	260364,
	260371,
	260370,
	260338,
	260365,
	261783,
	261805,
	261921,
	263100,
	260099,
	260096,
	260089,
	260101,
	260092,
	260100,
	260090,
	260095,
	260097,
	260098,
	260226,
	260227,
	260303,
	261915,
	260290,
	260310,
	260233,
	260311,
	261930,
	260283,
	261832,
	260284,
	260302,
	260734,
	261822,
	260285,
	260286,
	260280,
	258562,
	258511,
	258491,
	258512,
	258513,
	258510,
	258505,
	258507,
	258490,
	258516,
	258521,
	258518,
	261831,
	258498,
	258506,
	258515,
	260131,
	258514,
	268015,
	268020,
	268017,
	268007,
	268008,
	268012,
	268009,
	268018,
	268016,
	268021,
	268014,
	268013,
	268010,
	268011,
	269013,
	269016,
	269011,
	269017,
	269022,
	269010,
	269019,
	269026,
	271118,
	271732,
	271724,
	271720,
	271726,
	271734,
	271728,
	271733,
	271735,
	271755,
	271742,
	271746,
	271744,
	271740,
	271748,
	271723,
	271782,
	271731,
	271730,
	271736,
	271729,
	274884,
	273055,
	273048,
	273049,
	273047,
	273054,
	273042,
	273051,
	273058,
	273050,
	273044,
	273040,
	273043,
	273053,
	273035,
	273052,
	273036,
	273057,
	273061,
	273037,
	271775,
	273046,
	273041,
	271749
]

//Find elements that are in one or both arrays
function overlap(arr1, arr2) {
	let inArr1Only = [],
		inArr2Only = [],
		inBoth = [];
	arr1.sort(function (a, b) {
		return a - b;
	});
	arr2.sort(function (a, b) {
		return a - b;
	});
	inBoth = intersection(arr1, arr2);
	for (item1 of arr1) {
		if (!arr2.includes(item1)) {
			inArr1Only.push(item1);
		}
	}
	for (item2 of arr2) {
		if (!arr1.includes(item2)) {
			inArr2Only.push(item2);
		}
	}
	console.log(`Array 1 contains ${arr1.length} students.`);
	console.log(`Array 2 contains ${arr2.length} students.`);
	console.log(`${inBoth.length} students are in both arrays.`);
	console.log(`${inArr1Only.length} students are in array 1 only.`);
	console.log(`${inArr2Only.length} students are in array 2 only.`);
	return ([arr1, arr2, inBoth, inArr1Only, inArr2Only]);
}

//Use the studentsObj array to find info about the students in arr
function getStudents(arr) {
	let returnArr = [];
	for (id of arr) {
		if (typeof studentsObj[id] !=
			'undefined') {
			stud = studentsObj[id];
			if (arr.includes(id)) {
				returnArr.push(stud);
			}
		}
	}
	return returnArr;
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
				console.log(`fileCount is ${fileCount},  testType = ${testType}, teacher is ${stud.teacher}`)
			}
		})(f);
		reader.readAsText(f);
	}
}