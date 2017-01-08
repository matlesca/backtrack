import moment from 'moment'
import Vue from 'vue'
import {getIntervalSongs} from './algo_actions.js'
import eventsURL from '../events.json'

export function generateEvents ({state, dispatch}) {
	return new Promise((resolve, reject) => {
		Vue.http.get(eventsURL).then(response => {
			let loadEvents = JSON.parse(response.body)
			let delayTimer = 0
			for (let ee = 0; ee < loadEvents.length; ee++) {
				setTimeout(() => {
					if (getIntervalSongs({state}, loadEvents[ee].date, loadEvents[ee].date, 12).length >= 5) {
						dispatch('ADD_EVENT', loadEvents[ee])
					}
				}, delayTimer)
				delayTimer += 1
			}
			setTimeout(() => {
				resolve()
			}, delayTimer)
		}, error => console.log('error parsing json', error))
	})
}

export function generateDateTags ({state, dispatch}) {
	return new Promise((resolve, reject) => {
		moment.locale(state.momentLocale)
		let today = moment()
		let delayTimer = 0
		let startDate = moment(state.dateBounds.first, 'YYYY-MM-DD')
		let endDate = moment(state.dateBounds.last, 'YYYY-MM-DD')
		let diffDays = endDate.diff(startDate, 'days')
		if (diffDays < 0) {
			startDate = moment(state.dateBounds.last, 'YYYY-MM-DD')
			endDate = moment(state.dateBounds.first, 'YYYY-MM-DD')
			diffDays = -diffDays
		}

		let seasons = [
			{'name': {'en': 'winter', 'fr': 'hiver'}, 'logo': 'fir', start: '01-01', end: '03-19', collection: 184253},
			{'name': {'en': 'spring', 'fr': 'printemps'}, 'logo': 'flower', start: '03-20', end: '06-19', collection: 173953},
			{'name': {'en': 'summer', 'fr': 'été'}, 'logo': 'sun', start: '06-20', end: '09-21', collection: 149495},
			{'name': {'en': 'autumn', 'fr': 'automne'}, 'logo': 'leaves', start: '09-22', end: '12-31', collection: 222102}
		]
		let monthCol = [
			460, 460, // janvier février hiver
			254504, // mars desert
			13533, // avril flowers
			199320, // mai flowers
			256460, // juin fermes
			291441, 291441, // juillet aout vacation
			332741, // sept school
			273263, // oct autumn
			357644, // nov night city
			349458 // dec noel
		]
		for (let yy = startDate.year(); yy < endDate.year() + 1; yy++) {
			// Push years
			let pushObj = {
				type: state.locale === 'fr' ? 'année' : 'year',
				name: yy.toString(),
				start: yy + '-01-01',
				end: yy + '-12-31',
				rank: 10,
				featured: true,
				collection: 136301
			}
			pushObj.id = pushObj.start + '-' + pushObj.end
			if (yy === today.year()) {
				pushObj.fromNow = state.locale === 'fr' ? 'cette année' : 'this year'
				pushObj.logo = 'calendar'
			} else if (yy === today.year() - 1) {
				pushObj.fromNow = state.locale === 'fr' ? 'l\'an dernier' : 'last year'
				pushObj.logo = 'loop'
			} else {
				for (let gg = 2; gg < 7; gg++) {
					if (yy === today.year() - gg) {
						pushObj.fromNow = state.locale === 'fr' ? 'il y a ' + gg + ' ans' : gg + ' years ago'
						pushObj.logo = 'loop'
					}
				}
			}
			setTimeout(() => {
				if (getIntervalSongs({state}, pushObj.start, pushObj.end, 0).length >= 5) {
					dispatch('ADD_DATECARD', pushObj)
				}
			}, delayTimer)
			delayTimer += 1
			// Push seasons
			seasons.forEach(season => {
				if (startDate.isBefore(yy + '-' + season.end) && endDate.isAfter(yy + '-' + season.start)) {
					let pushObj = {
						type: state.locale === 'fr' ? 'saison' : 'season',
						name: season.name[state.locale] + ' ' + yy,
						start: moment(yy + '-' + season.start).format('YYYY-MM-DD'),
						end: moment(yy + '-' + season.end).format('YYYY-MM-DD'),
						rank: 20,
						featured: Math.random() > 0.4,
						logo: season.logo,
						collection: season.collection
					}
					pushObj.id = pushObj.start + '-' + pushObj.end
					if (yy === today.year()) {
						if (today.isAfter(yy + '-' + season.start) && today.isBefore(yy + '-' + season.end)) {
							pushObj.fromNow = state.locale === 'fr' ? 'cet ' + season.name[state.locale] : 'this ' + season.name[state.locale]
							pushObj.featured = true
						} else {
							pushObj.fromNow = season.name[state.locale] === 'printemps' ? 'le printemps dernier' : state.locale === 'fr' ? 'l\'' + season.name[state.locale] + ' dernier' : 'last ' + season.name[state.locale]
						}
					} else if (today.isBefore(moment(yy + '-' + season.end).add(1, 'year'))) {
						pushObj.fromNow = season.name[state.locale] === 'printemps' ? 'le printemps dernier' : state.locale === 'fr' ? 'l\'' + season.name[state.locale] + ' dernier' : 'last ' + season.name[state.locale]
					}
					setTimeout(() => {
						if (getIntervalSongs({state}, pushObj.start, pushObj.end, 0).length >= 5) {
							dispatch('ADD_DATECARD', pushObj)
						}
					}, delayTimer)
					delayTimer += 1
				}
			})
			// Push months
			for (let mm = 1; mm < 13; mm++) {
				let stmm = mm < 10 ? '0' + mm : mm
				if (startDate.isBefore(moment(yy + '-' + stmm + '-01').endOf('month')) && endDate.isAfter(yy + '-' + stmm + '-01')) {
					let pushObj = {
						type: state.locale === 'fr' ? 'mois' : 'month',
						name: moment.months()[mm - 1] + ' ' + yy,
						start: yy + '-' + stmm + '-1',
						end: moment(yy + '-' + stmm + '-1').endOf('month').format('YYYY-MM-DD'),
						rank: 30,
						featured: Math.random() > 0.8,
						collection: monthCol[mm - 1]
					}
					pushObj.id = pushObj.start + '-' + pushObj.end
					if (today.isSame(moment(yy + '-' + stmm + '-15'), 'month')) {
						pushObj.fromNow = state.locale === 'fr' ? 'ce mois-ci' : 'this month'
						pushObj.logo = 'calendar'
					} else if (today.isSame(moment(yy + '-' + stmm + '-15').add(1, 'month'), 'month')) {
						pushObj.fromNow = state.locale === 'fr' ? 'le mois dernier' : 'last month'
						pushObj.logo = 'loop'
						pushObj.featured = true
					} else {
						for (let gg = 2; gg < 7; gg++) {
							if (today.isSame(moment(yy + '-' + stmm + '-15').add(gg, 'month'), 'month')) {
								pushObj.fromNow = state.locale === 'fr' ? 'il y a ' + gg + ' mois' : gg + ' months ago'
								pushObj.logo = 'loop'
							}
						}
						if (today.isSame(moment(yy + '-' + stmm + '-15').add(1, 'year'), 'month')) {
							pushObj.fromNow = state.locale === 'fr' ? 'même mois l\'an dernier' : 'same month last year'
							pushObj.logo = 'loop'
							pushObj.featured = true
						}
					}
					setTimeout(() => {
						if (getIntervalSongs({state}, pushObj.start, pushObj.end, 0).length >= 5) {
							dispatch('ADD_DATECARD', pushObj)
						}
					}, delayTimer)
					delayTimer += 1
				}
			}
		}

		let specialDays = [
			{'d': 25, 'm': 12, 'y': null, 'name': {'en': 'Christmas Day', 'fr': 'Noël'}, 'logo': 'christmas', collection: 197200},
			{'d': '01', 'm': '01', 'y': null, 'name': {'en': 'New year\'s Day', 'fr': 'Jour de l\'an'}, 'logo': 'fireworks', collection: 235549},
			{'d': 21, 'm': '06', 'y': null, 'name': {'en': 'Summer solstice', 'fr': 'Fête de la musique'}, 'logo': 'music', collection: 244173},
			{'d': 14, 'm': '02', 'y': null, 'name': {'en': 'Valentine\'s Day', 'fr': 'Saint Valentin'}, 'logo': 'love', collection: 208403},
			{'d': 31, 'm': 10, 'y': null, 'name': {'en': 'Halloween', 'fr': 'Halloween'}, 'logo': 'halloween', collection: 286795},
			{'d': 22, 'm': 11, 'y': 2012, 'name': {'en': 'Thanksgiving', 'fr': 'Thanksgiving'}, 'logo': 'chicken', collection: 285897},
			{'d': 28, 'm': 11, 'y': 2013, 'name': {'en': 'Thanksgiving', 'fr': 'Thanksgiving'}, 'logo': 'chicken', collection: 285897},
			{'d': 27, 'm': 11, 'y': 2014, 'name': {'en': 'Thanksgiving', 'fr': 'Thanksgiving'}, 'logo': 'chicken', collection: 285897},
			{'d': 26, 'm': 11, 'y': 2015, 'name': {'en': 'Thanksgiving', 'fr': 'Thanksgiving'}, 'logo': 'chicken', collection: 285897},
			{'d': 24, 'm': 11, 'y': 2016, 'name': {'en': 'Thanksgiving', 'fr': 'Thanksgiving'}, 'logo': 'chicken', collection: 285897},
			{'d': 23, 'm': 11, 'y': 2017, 'name': {'en': 'Thanksgiving', 'fr': 'Thanksgiving'}, 'logo': 'chicken', collection: 285897},
			{'d': 22, 'm': 11, 'y': 2018, 'name': {'en': 'Thanksgiving', 'fr': 'Thanksgiving'}, 'logo': 'chicken', collection: 285897},
			{'d': 28, 'm': 11, 'y': 2019, 'name': {'en': 'Thanksgiving', 'fr': 'Thanksgiving'}, 'logo': 'chicken', collection: 285897},
			{'d': 23, 'm': 11, 'y': 2012, 'name': {'en': 'Black friday', 'fr': 'Black friday'}, 'logo': 'computer', collection: 145103},
			{'d': 29, 'm': 11, 'y': 2013, 'name': {'en': 'Black friday', 'fr': 'Black friday'}, 'logo': 'computer', collection: 145103},
			{'d': 28, 'm': 11, 'y': 2014, 'name': {'en': 'Black friday', 'fr': 'Black friday'}, 'logo': 'computer', collection: 145103},
			{'d': 27, 'm': 11, 'y': 2015, 'name': {'en': 'Black friday', 'fr': 'Black friday'}, 'logo': 'computer', collection: 145103},
			{'d': 25, 'm': 11, 'y': 2016, 'name': {'en': 'Black friday', 'fr': 'Black friday'}, 'logo': 'computer', collection: 145103},
			{'d': 24, 'm': 11, 'y': 2017, 'name': {'en': 'Black friday', 'fr': 'Black friday'}, 'logo': 'computer', collection: 145103},
			{'d': 23, 'm': 11, 'y': 2018, 'name': {'en': 'Black friday', 'fr': 'Black friday'}, 'logo': 'computer', collection: 145103},
			{'d': 29, 'm': 11, 'y': 2019, 'name': {'en': 'Black friday', 'fr': 'Black friday'}, 'logo': 'computer', collection: 145103},
			{'d': 23, 'm': '01', 'y': 2012, 'name': {'en': 'Chinese new year', 'fr': 'Nouvel an Chinois'}, 'logo': 'chinese', collection: 1248},
			{'d': 10, 'm': '02', 'y': 2013, 'name': {'en': 'Chinese new year', 'fr': 'Nouvel an Chinois'}, 'logo': 'chinese', collection: 1248},
			{'d': 31, 'm': '01', 'y': 2014, 'name': {'en': 'Chinese new year', 'fr': 'Nouvel an Chinois'}, 'logo': 'chinese', collection: 1248},
			{'d': 19, 'm': '02', 'y': 2015, 'name': {'en': 'Chinese new year', 'fr': 'Nouvel an Chinois'}, 'logo': 'chinese', collection: 1248},
			{'d': '08', 'm': '02', 'y': 2016, 'name': {'en': 'Chinese new year', 'fr': 'Nouvel an Chinois'}, 'logo': 'chinese', collection: 1248},
			{'d': 28, 'm': '01', 'y': 2017, 'name': {'en': 'Chinese new year', 'fr': 'Nouvel an Chinois'}, 'logo': 'chinese', collection: 1248},
			{'d': 16, 'm': '02', 'y': 2018, 'name': {'en': 'Chinese new year', 'fr': 'Nouvel an Chinois'}, 'logo': 'chinese', collection: 1248},
			{'d': '05', 'm': '02', 'y': 2019, 'name': {'en': 'Chinese new year', 'fr': 'Nouvel an Chinois'}, 'logo': 'chinese', collection: 1248},
			{'d': '08', 'm': '04', 'y': 2012, 'name': {'en': 'Easter day', 'fr': 'Pâques'}, 'logo': 'rabbit', collection: 877},
			{'d': 31, 'm': '03', 'y': 2013, 'name': {'en': 'Easter day', 'fr': 'Pâques'}, 'logo': 'rabbit', collection: 877},
			{'d': 20, 'm': '04', 'y': 2014, 'name': {'en': 'Easter day', 'fr': 'Pâques'}, 'logo': 'rabbit', collection: 877},
			{'d': '05', 'm': '04', 'y': 2015, 'name': {'en': 'Easter day', 'fr': 'Pâques'}, 'logo': 'rabbit', collection: 877},
			{'d': 27, 'm': '03', 'y': 2016, 'name': {'en': 'Easter day', 'fr': 'Pâques'}, 'logo': 'rabbit', collection: 877},
			{'d': 16, 'm': '04', 'y': 2017, 'name': {'en': 'Easter day', 'fr': 'Pâques'}, 'logo': 'rabbit', collection: 877},
			{'d': '01', 'm': '04', 'y': 2018, 'name': {'en': 'Easter day', 'fr': 'Pâques'}, 'logo': 'rabbit', collection: 877},
			{'d': 21, 'm': '04', 'y': 2019, 'name': {'en': 'Easter day', 'fr': 'Pâques'}, 'logo': 'rabbit', collection: 877}

		]
		// Mother's day
		if (state.auth.country === 'FR') {
			// if france also add bastille day
			specialDays.push(
				{'d': '07', 'm': '06', 'y': 2012, 'name': {'en': 'Mother\'s Day', 'fr': 'Fête des mères'}, 'logo': 'family', collection: 233395},
				{'d': 26, 'm': '05', 'y': 2013, 'name': {'en': 'Mother\'s Day', 'fr': 'Fête des mères'}, 'logo': 'family', collection: 233395},
				{'d': 25, 'm': '05', 'y': 2014, 'name': {'en': 'Mother\'s Day', 'fr': 'Fête des mères'}, 'logo': 'family', collection: 233395},
				{'d': 31, 'm': '05', 'y': 2015, 'name': {'en': 'Mother\'s Day', 'fr': 'Fête des mères'}, 'logo': 'family', collection: 233395},
				{'d': 29, 'm': '05', 'y': 2016, 'name': {'en': 'Mother\'s Day', 'fr': 'Fête des mères'}, 'logo': 'family', collection: 233395},
				{'d': 28, 'm': '05', 'y': 2017, 'name': {'en': 'Mother\'s Day', 'fr': 'Fête des mères'}, 'logo': 'family', collection: 233395},
				{'d': 27, 'm': '05', 'y': 2018, 'name': {'en': 'Mother\'s Day', 'fr': 'Fête des mères'}, 'logo': 'family', collection: 233395},
				{'d': 26, 'm': '05', 'y': 2019, 'name': {'en': 'Mother\'s Day', 'fr': 'Fête des mères'}, 'logo': 'family', collection: 233395},
				{'d': 14, 'm': '07', 'y': null, 'name': {'en': 'Bastille day', 'fr': 'Fête nationale Française'}, 'logo': 'fireworks', collection: 306296}
			)
		} else if (state.auth.country === 'ES') {
			specialDays.push(
				{'d': '06', 'm': '05', 'y': 2012, 'name': {'en': 'Mother\'s Day', 'fr': 'Fête des mères'}, 'logo': 'family', collection: 233395},
				{'d': '05', 'm': '05', 'y': 2013, 'name': {'en': 'Mother\'s Day', 'fr': 'Fête des mères'}, 'logo': 'family', collection: 233395},
				{'d': '04', 'm': '05', 'y': 2014, 'name': {'en': 'Mother\'s Day', 'fr': 'Fête des mères'}, 'logo': 'family', collection: 233395},
				{'d': '03', 'm': '05', 'y': 2015, 'name': {'en': 'Mother\'s Day', 'fr': 'Fête des mères'}, 'logo': 'family', collection: 233395},
				{'d': '01', 'm': '05', 'y': 2016, 'name': {'en': 'Mother\'s Day', 'fr': 'Fête des mères'}, 'logo': 'family', collection: 233395},
				{'d': '07', 'm': '05', 'y': 2017, 'name': {'en': 'Mother\'s Day', 'fr': 'Fête des mères'}, 'logo': 'family', collection: 233395},
				{'d': '06', 'm': '05', 'y': 2018, 'name': {'en': 'Mother\'s Day', 'fr': 'Fête des mères'}, 'logo': 'family', collection: 233395},
				{'d': '05', 'm': '05', 'y': 2019, 'name': {'en': 'Mother\'s Day', 'fr': 'Fête des mères'}, 'logo': 'family', collection: 233395}
			)
		} else {
			specialDays.push(
				{'d': 13, 'm': '05', 'y': 2012, 'name': {'en': 'Mother\'s Day', 'fr': 'Fête des mères'}, 'logo': 'family', collection: 233395},
				{'d': 12, 'm': '05', 'y': 2013, 'name': {'en': 'Mother\'s Day', 'fr': 'Fête des mères'}, 'logo': 'family', collection: 233395},
				{'d': 11, 'm': '05', 'y': 2014, 'name': {'en': 'Mother\'s Day', 'fr': 'Fête des mères'}, 'logo': 'family', collection: 233395},
				{'d': 10, 'm': '05', 'y': 2015, 'name': {'en': 'Mother\'s Day', 'fr': 'Fête des mères'}, 'logo': 'family', collection: 233395},
				{'d': '08', 'm': '05', 'y': 2016, 'name': {'en': 'Mother\'s Day', 'fr': 'Fête des mères'}, 'logo': 'family', collection: 233395},
				{'d': 14, 'm': '05', 'y': 2017, 'name': {'en': 'Mother\'s Day', 'fr': 'Fête des mères'}, 'logo': 'family', collection: 233395},
				{'d': 13, 'm': '05', 'y': 2018, 'name': {'en': 'Mother\'s Day', 'fr': 'Fête des mères'}, 'logo': 'family', collection: 233395},
				{'d': 12, 'm': '05', 'y': 2019, 'name': {'en': 'Mother\'s Day', 'fr': 'Fête des mères'}, 'logo': 'family', collection: 233395}
			)
		}
		// Father's day
		if (state.auth.country === 'ES' || state.auth.country === 'IT' || state.auth.country === 'PT') {
			specialDays.push(
				{'d': 19, 'm': '03', 'y': null, 'name': {'en': 'Father\'s Day', 'fr': 'Fête des pères'}, 'logo': 'family', collection: 233395}
			)
		} else {
			specialDays.push(
				{'d': 17, 'm': '06', 'y': 2012, 'name': {'en': 'Father\'s Day', 'fr': 'Fête des pères'}, 'logo': 'family', collection: 233395},
				{'d': 16, 'm': '06', 'y': 2013, 'name': {'en': 'Father\'s Day', 'fr': 'Fête des pères'}, 'logo': 'family', collection: 233395},
				{'d': 15, 'm': '06', 'y': 2014, 'name': {'en': 'Father\'s Day', 'fr': 'Fête des pères'}, 'logo': 'family', collection: 233395},
				{'d': 21, 'm': '06', 'y': 2015, 'name': {'en': 'Father\'s Day', 'fr': 'Fête des pères'}, 'logo': 'family', collection: 233395},
				{'d': 19, 'm': '06', 'y': 2016, 'name': {'en': 'Father\'s Day', 'fr': 'Fête des pères'}, 'logo': 'family', collection: 233395},
				{'d': 18, 'm': '06', 'y': 2017, 'name': {'en': 'Father\'s Day', 'fr': 'Fête des pères'}, 'logo': 'family', collection: 233395},
				{'d': 17, 'm': '06', 'y': 2018, 'name': {'en': 'Father\'s Day', 'fr': 'Fête des pères'}, 'logo': 'family', collection: 233395},
				{'d': 16, 'm': '06', 'y': 2019, 'name': {'en': 'Father\'s Day', 'fr': 'Fête des pères'}, 'logo': 'family', collection: 233395}
			)
		}

		// Push dates
		for (let cc = 0; cc <= diffDays; cc++) {
			let dDate = startDate.clone().add(cc, 'days')
			let pushObj = {
				type: 'date',
				name: dDate.format('L'),
				lookFor: dDate.format('l'),
				start: dDate.format('YYYY-MM-DD'),
				end: dDate.format('YYYY-MM-DD'),
				rank: 40,
				featured: false
			}
			pushObj.id = pushObj.start + '-' + pushObj.end
			if (today.isSame(dDate, 'day')) {
				pushObj.fromNow = state.locale === 'fr' ? 'aujourd\'hui' : 'today'
				pushObj.logo = 'calendar'
			} else if (today.isSame(dDate.clone().add(1, 'week'), 'day')) {
				pushObj.fromNow = state.locale === 'fr' ? 'la semaine dernière' : 'last week'
				pushObj.logo = 'loop'
			} else if (today.isSame(dDate.clone().add(1, 'month'), 'day')) {
				pushObj.fromNow = state.locale === 'fr' ? 'même date le mois dernier' : 'same date last month'
				pushObj.logo = 'loop'
				pushObj.featured = true
			} else if (today.isSame(dDate.clone().add(1, 'year'), 'day')) {
				pushObj.fromNow = state.locale === 'fr' ? 'même date l\'an dernier' : 'same date last year'
				pushObj.logo = 'loop'
				pushObj.featured = true
			}
			for (let ss = 0; ss < specialDays.length; ss++) {
				if (parseInt(specialDays[ss].d, 10) === dDate.date() && parseInt(specialDays[ss].m, 10) === dDate.month() + 1 && (!specialDays[ss].y || specialDays[ss].y === dDate.year())) {
					pushObj.specialDay = specialDays[ss].name[state.locale] + ' ' + dDate.year()
					pushObj.logo = specialDays[ss].logo
					pushObj.type = state.locale === 'fr' ? 'fête' : 'holiday'
					pushObj.featured = Math.random() > 0.7
					if (specialDays[ss].collection) {
						pushObj.collection = specialDays[ss].collection
					}
				}
			}
			setTimeout(() => {
				if (getIntervalSongs({state}, pushObj.start, pushObj.end, 0).length > 0) {
					dispatch('ADD_DATECARD', pushObj)
				}
			}, delayTimer)
			delayTimer += 1
		}
		setTimeout(() => {
			resolve()
		}, delayTimer)
	})
}
