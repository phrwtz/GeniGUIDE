//Create a csv table that reports on the pre- and post-test scores and gains each student got and also on the challenge proficiency scores on the target match challenges and the various mean scores.

function makeEnhancedTargetMatchChallengesFile() {
	let tableStr,
		testStr, //To be added to tableStr if student has completed all challenges. Starts with a <CR>
		chalFound,
		scores = {},
		aggregates = {},
		totalScore = 0,
		visibleScore = 0,
		hiddenScore = 0,
		filteredOutStudents = [];
		permissions = false;
	tableStr = 'Teacher,Class,Student,Permission?, Pre-total,Pre-allele,Pre-protein,Post-total,Post-allele,Post-protein,Gain-total,Gain-allele,Gain-protein,Pre-lastRun,Post-lastRun,';
	for (name of targetMatchArray) {
		tableStr += name + ',';
	}
	tableStr += 'simpleDom-visible-mean, simpleDom-hidden-mean, armorHorns-visible-mean, armorHorns-hidden-mean, simpleColors-visible-mean, simpleColors-hidden-mean, harderTraits-visible-mean, harderTraits-hidden-mean, all-visible-mean, all-hidden-mean, all-mean';
	for (s of students) {
		n = prepostStudentsObj[s.id];
		if (typeof n != "undefined") {
			permissions =
				(n["pre_permForm"] != 'none') && (n["post_permForm"] != 'none');
			if (n.pre && n.post && (n['pre_not_answered'] < 2) && (n['post_not_answered'] < 2)) {
				chalFound = true;
				//We don't want to include students who have not completed all the target match challenges so we populate a test string and only add that to the table if all the challenges are there. So the first time a challenge is missing we set chalFound false and don't reset it until we move to another student.
				testStr = '\n';
				testStr += (s.teacher.id + ',' + s.class.id + ',' + s.id + ',' + permissions + ',' + n.pre_total_score + ',' + n.pre_allele_score + ',' + n.pre_protein_score + ',' + n.post_total_score + ',' + n.post_allele_score + ',' + n.post_protein_score + ',' + (n.post_total_score - n.pre_total_score) + ',' + (n.post_allele_score - n.pre_allele_score) + ',' + (n.post_protein_score - n.pre_protein_score) + ',' + n.pre_lastRun + ',' + n.post_lastRun);
				testStr += ',';
				for (name of targetMatchArray) {
					chal = s.activitiesByName[name]
					if (typeof chal === "undefined") {
						chalFound = false;
					} else {
						scores[name] = chal.score[0];
						testStr += scores[name] + ',';
					}
				} //new challenge
				if (chalFound) {
					tableStr += testStr;
					tableStr += getMean("simpleDom", "visible", scores) + ',';
					tableStr += getMean("simpleDom", "hidden", scores) + ',';
					tableStr += getMean("armorHorns", "visible", scores) + ',';
					tableStr += getMean("armorHorns", "hidden", scores) + ',';
					tableStr += getMean("simpleColors", "visible", scores) + ',';
					tableStr += getMean("simpleColors", "hidden", scores) + ',';
					tableStr += getMean("harderTraits", "visible", scores) + ',';
					tableStr += getMean("harderTraits", "hidden", scores) + ',';
					tableStr += getMean("", "visible", scores) + ',';
					tableStr += getMean("", "hidden", scores) + ',';
					tableStr += getMean("", "", scores);
				}
			} else {
				filteredOutStudents.push(n);
			}
		}
	} //next student
	console.log(filteredOutStudents.length + 'students filtered out.');
	let fileName = prompt('Enter file name') + '_challenge_scores_with_means';
	saveData()(tableStr, fileName);
}

//Create a csv table that reports on the proficiency score each student got on the target match challenges and compares them to the pre- and post-test scores and gains.
function makeTargetMatchChallengesFile() {
	let totalScore = 0,
		head = '',
		tableStr,
		testStr,
		chalFound;
	head = 'Teacher,Class,Student,Pre-total,Pre-allele,Pre-protein,Post-total,Post-allele,Post-protein,Gain-total,Gain-allele,Gain-protein';
	for (name of targetMatchArray) {
		head += ',' + name;
	}
	head += ", Total score";
	tableStr = head;
	for (s of students) {
		n = prepostStudentsObj[s.id];
		if (typeof n != "undefined") {
			if (n.pre && n.post && (n.pre_not_answered < 5) && (n.post_not_answered < 5)) {
				testStr = '\n'
				testStr += (s.teacher.id + ',' + s.class.id + ',' + s.id + ',' + n.pre_total_score + ',' + n.pre_allele_score + ',' + n.pre_protein_score + ',' + n.post_total_score + ',' + n.post_allele_score + ',' + n.post_protein_score + ',' + (n.post_total_score - n.pre_total_score) + ',' + (n.post_allele_score - n.pre_allele_score) + ',' + (n.post_protein_score - n.pre_protein_score));
				totalScore = 0;
				chalFound = true;
				//We don't want to include students who have not completed all the target match challenges so we populate a test string and only add that to the table if all the challenges are there. So the first time a challenge is missing we set chalFound false and don't reset it until we move to another student.
				for (name of targetMatchArray) {
					chal = s.activitiesByName[name]
					if (typeof chal === "undefined") {
						chalFound = false;
					} else {
						testStr += ',' + chal.score[0];
						totalScore += chal.score[0];
					}
				} //New challenge
				if (chalFound) {
					tableStr += testStr + ',' + totalScore;
				}
			} else {
				//console.log("No pre-post info for student " + s.id + " of teacher " + s.teacher.id + " in class " + s.class.id + ".");
			}
		} else {
			//console.log("Student " + n.id + " of teacher " + s.teacher.id + " in class " + s.class.id + " did not do the pre- and post-tests.");
		}
	} //New student
	let fileName = prompt('Enter file name') + '_challenge_scores';
	saveData()(tableStr, fileName);
}

//Takes a type and a condition and returns the mean of the scores for all challenges that match those inputs. If either <type> or <condition> is empty, returns the mean for all challenges that match the non-empty input.
function getMean(type, condition, scores) {
	let sum = 0;
	let names = getNames(type, condition);
	for (name of getNames(type, condition)) {
		sum += scores[name];
	}
	return Math.round(1000 * (sum / names.length)) / 1000;
}

//Takes a type and a condition and returns an array of names from targetMatchArray that match those inputs. If either input is empty it returns the names that match the non-empty input.
function getNames(t, c) {
	let names = [];
	for (name of targetMatchArray) {
		let nameArr = name.split('-');
		let condition = nameArr[2];
		let type = nameArr[3];
		if (!isNaN(type.slice(-1))) {
			type = type.slice(0, type.length - 1);
		}
		if (((type === t) || (t === '')) && ((condition === c) || (c === ''))) {
			names.push(name);
		}
	}
	return names;
}

function parseName(n) {
	let nameArr = name.split('-');
	let condition = nameArr[2];
	let type = nameArr[3];
	if (!isNaN(type.slice(-1))) {
		type = type.slice(0, type.length - 1);
	}
	return [type, condition];
}