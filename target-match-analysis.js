//Create a csv table that reports on the pre- and post-test scores and gains each student got and also on the challenge proficiency scores on the target match challenges and the various mean scores.

function makeEnhancedTargetMatchChallengesFile(prepostStudentsObj) {
	let tableStr,
		testStr, //To be added to tableStr if student has completed all challenges. Starts with a <CR>
		chalFound,
		scores = {},
		elapsedTime,
		aggregates = {},
		totalScore = 0,
		visibleScore = 0,
		hiddenScore = 0;
	permissions = false;
	let counted = 0,
		uncounted = 0,
		noPrePost = 0,
		chalsMissing = 0,
		simpleDomVisibleMean,
		simpleDomHiddenMean,
		armorHornsVisibleMean,
		armorHornsHiddenMean,
		simpleColorsVisibleMean,
		simpleColorsHiddenMean,
		harderTraitsVisibleMean,
		harderTraitsHiddenMean;
	tableStr = 'Teacher,Class,Student,Permission?, Pre-total,Pre-allele,Pre-protein,Post-total,Post-allele,Post-protein,Gain-total,Gain-allele,Gain-protein,Pre-lastRun,Post-lastRun,';
	for (name of targetMatchArray) {
		tableStr += name + ',';
	}
	tableStr += 'simpleDom-visible-mean,simpleDom-hidden-mean, armorHorns-visible-mean,armorHorns-hidden-mean,  simpleColors-visible-mean, simpleColors-hidden-mean, harderTraits-visible-mean, harderTraits-hidden-mean, all-visible-mean, all-hidden-mean, all-mean, visible-intercept, visible-slope, hidden-intercept, hidden-slope';
	for (s of students) {
		n = prepostStudentsObj[s.id];
		if (typeof n != "undefined") {
			permissions =
				(n["pre_permForm"] != 'none') && (n["post_permForm"] != 'none');
			if (n.pre && n.post && (n['pre_not_answered'] < 2) && (n['post_not_answered'] < 2)) {
				chalFound = true;
				//We don't want to include students who have not completed all the target match challenges so we populate a test string and only add that to the table if all the challenges are there. So the first time a challenge is missing we set chalFound false and don't reset it until we move to another student.
				testStr = '\n';
				testStr += (s.teacher.id + ',' + s.class.id + ',' + s.id + ',' + permissions + ',' + n.pre_total_score + ',' + n.pre_allele_score + ',' + n.pre_protein_score + ',' + n.post_total_score + ',' + n.post_allele_score + ',' + n.post_protein_score + ',' + (n.post_total_score - n.pre_total_score) + ',' + (n.post_allele_score - n.pre_allele_score) + ',' + (n.post_protein_score - n.pre_protein_score) + ',' + n['pre_Last run'] + ',' + n['post_Last run']);
				testStr += ',';
				for (name of targetMatchArray) {
					chal = s.activitiesByName[name]
					if (typeof chal === "undefined") {
						chalFound = false;
					} else {
						scores[name] = chal.score[0];
						elapsedTime = chal.elapsedTime;
						testStr += scores[name] + ',';
						//testStr += elapsedTime + ','; 
					}
				} //new challenge
				if (chalFound) {
					counted++;
					tableStr += testStr;
					simpleDomVisibleMean = getMean("simpleDom", "visible", scores);
					simpleDomHiddenMean = getMean("simpleDom", "hidden", scores);
					armorHornsVisibleMean = getMean("armorHorns", "visible", scores);
					armorHornsHiddenMean = getMean("armorHorns", "hidden", scores);
					simpleColorsVisibleMean = getMean("simpleColors", "visible", scores);
					simpleColorsHiddenMean = getMean("simpleColors", "hidden", scores);
					harderTraitsVisibleMean = getMean("harderTraits", "visible", scores);
					harderTraitsHiddenMean = getMean("harderTraits", "hidden", scores);
					interceptVisible = leastSquares('visible', scores)[0];
					slopeVisible = leastSquares('visible', scores)[1];
					interceptHidden = leastSquares('hidden', scores)[0];
					slopeHidden = leastSquares('hidden', scores)[1];
					tableStr += simpleDomVisibleMean + ',' + simpleDomHiddenMean + ',' + armorHornsVisibleMean + ',' + armorHornsHiddenMean + ',' + simpleColorsVisibleMean + ',' + simpleColorsHiddenMean + ',' + harderTraitsVisibleMean + ',' + harderTraitsHiddenMean + ',';
					tableStr += getMean("", "visible", scores) + ',' + getMean('', 'hidden', scores) + ',' + getMean('', '', scores) + ',' + interceptVisible + ',' + slopeVisible + ',' + interceptHidden + ',' + slopeHidden;
				} else {
					chalsMissing++;
					uncounted++;
				}
			} else {
				noPrePost++;
				uncounted++;
			}
		}
	} //next student
	console.log(`${counted} students were counted, ${noPrePost} students failed to complete the pre or post, and ${chalsMissing} didn't do all the challenges.`);
	console.log(`${uncounted} students were not counted.`);
	let fileName = prompt('Enter file name') + '_challenge_scores_with_slope';
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
//Returns the intercept and slope of the best fit line through the scores with <condition> (visible or hidden)
function leastSquares(condition, scores) {
	const visibleNames = ['allele-targetMatch-visible-simpleDom', 'allele-targetMatch-visible-simpleDom2', 'allele-targetMatch-visible-armorHorns', 'allele-targetMatch-visible-armorHorns2', 'allele-targetMatch-visible-armorHorns3', 'allele-targetMatch-visible-simpleColors', 'allele-targetMatch-visible-simpleColors2', 'allele-targetMatch-visible-simpleColors3', 'allele-targetMatch-visible-simpleColors4', 'allele-targetMatch-visible-simpleColors5', 'allele-targetMatch-visible-harderTraits', 'allele-targetMatch-visible-harderTraits2']
	const hiddenNames = ['allele-targetMatch-hidden-simpleDom', 'allele-targetMatch-hidden-simpleDom2', 'allele-targetMatch-hidden-armorHorns', 'allele-targetMatch-hidden-armorHorns2', 'allele-targetMatch-hidden-armorHorns3', 'allele-targetMatch-hidden-simpleColors', 'allele-targetMatch-hidden-simpleColors2', 'allele-targetMatch-hidden-simpleColors3', 'allele-targetMatch-hidden-harderTraits', 'allele-targetMatch-hidden-harderTraits2']
	let yNames = [],
		yArray = [],
		xArray = [],
		yResiduals = [],
		xResiduals = [],
		sumXResiduals = 0,
		sumYResiduals = 0,
		ySum = 0,
		xSum = 0,
		yMean, xMean, n,
		intercept,
		slopeNumerator = 0,
		slopeDenominator = 0,
		slope;
	if (condition === 'visible') {
		yNames = visibleNames;
		for (let i = 0; i < visibleNames.length; i++) {
			xArray.push(i + 1);
			xSum += (i + 1);
		}
	} else if (condition === 'hidden') {
		yNames = hiddenNames;
		for (let i = 0; i < hiddenNames.length; i++) {
			xArray.push(i + 1);
			xSum += (i + 1);
		}
	}
	n = xArray.length;
	xMean = xSum / n;
	for (let x of xArray) {
		xResiduals.push(x - xMean);
		sumXResiduals += (x - xMean);
	}

	for (name of yNames) {
		yArray.push(scores[name]);
		ySum += scores[name];
	}
	yMean = ySum / n;

	for (let y of yArray) {
		yResiduals.push(y - yMean);
		sumYResiduals += (y - yMean);
	}

	for (let j = 0; j < yArray.length; j++) {
		slopeNumerator += xResiduals[j] * yResiduals[j];
		slopeDenominator += xResiduals[j] * xResiduals[j];
	}
	slope = slopeNumerator / slopeDenominator;

	intercept = (ySum - slope * xSum) / n;
	return [intercept, slope];
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