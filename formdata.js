'use strict';
let fibstring	// Module noch nicht geladen
const $form = document.querySelector('form')
const $butSingle = document.getElementById('single')
const $butSequence = document.getElementById('sequence')
const $output = document.querySelector('output')
const limit = 5000 //ms

$butSingle.addEventListener('click', ev => {
	ev.preventDefault()
	performance.clearMarks();
	performance.clearMeasures();
	const inputs = readInputs()
	if (!inputs.n) {
		$output.value = 'Bitte Zahl eingeben!'
		return
	}
	let result
	if (inputs.language === 'JS')
		result = fibJS(inputs.n, inputs.slow)
	else
		result = fibCpp(inputs.n, inputs.slow)
	if (!result.result) {
		$output.value = 'Problem bei der Berechnung!'
		return
	}
	$output.value = 'Die Fibonacci-Zahl für ' + result.n + ' lautet: ' + result.result + "\n"
	$output.value += 'Berechnet mit ' + inputs.language + ' im ' + (inputs.slow? 'langsamen' : 'schnellen') + ' Algorithmus in ' + performance.getEntriesByName('fib')[0].duration + ' ms'
})

$butSequence.addEventListener('click', ev => {
	$output.value = 'Das dauert einen Moment ...'
	ev.preventDefault()
	performance.clearMarks();
	performance.clearMeasures();
	setTimeout(() => {
		const inputs = readInputs()
		const results = []
		let msg
		performance.mark('start-bulk')
		for (let n = 1; n < 94; n++) {
			let res
			if (inputs.language === 'JS')
				res = fibJS(n, inputs.slow)
			else
				res = fibCpp(n, inputs.slow)
			if (typeof res === 'object')
				results.push(res)
			else
				msg = res
			if (performance.getEntriesByName('fib')[n - 1].duration > limit)
				msg = 'Abbruch: Berechnung dauert länger als ' + limit + ' ms'
			if (msg) break
			console.log(res.n, res.result)
		}
		performance.mark('end-bulk')
		performance.measure('bulk', 'start-bulk', 'end-bulk')
		$output.value = 'Berechnungen mit ' + inputs.language + ' im ' + (inputs.slow? 'langsamen' : 'schnellen') + " Algorithmus:\n\n"
		results.forEach((res, i) => {
			$output.value += 'Die Fibonacci-Zahl für ' + res.n + ' lautet: ' + res.result + "\n"
			$output.value += 'Dauer: ' + performance.getEntriesByName('fib')[i].duration + " ms\n\n"
		})
		if (msg)
			$output.value += msg + "\n\n"
		$output.value += 'Gesamtdauer: ' + performance.getEntriesByName('bulk')[0].duration + ' ms'
	}, 1)
})

function readInputs() {
	if (!fibstring)
		fibstring = Module.cwrap('fibstring', 'string', ['number', 'number'])
	const $n = $form.querySelector('[name="n"]')
	const $language = $form.querySelectorAll('[name="language"]')
	const $algorithm = $form.querySelectorAll('[name="algorithm"]')
	const nVal = $n.value * 1
	let langVal, algVal
	for (let i = 0; i < $language.length; i++) {
		if ($language[i].checked) {
			langVal = $language[i].value
			break
		}
	}
	for (let i = 0; i < $algorithm.length; i++) {
		if ($algorithm[i].checked) {
			algVal = $algorithm[i].value
			break
		}
	}
	algVal = algVal === 'slow'? 1 : 0
	return {n: nVal, language: langVal, slow: algVal}
}

function fibslow(n) {
	if (n == 0 || n == 1)
		return n
	if (n > 1)
		return fibslow(n-1) + fibslow(n-2)
	return 0
}

function fib(n) {
	let a = 1, ta, b = 1, tb, c = 1, rc = 0, tc, d = 0, rd = 1
	while (n) {
		if (n & 1) {
			tc = rc
			rc = rc*a + rd*c
			rd = tc*b + rd*d
		}
		ta = a
		tb = b
		tc = c
		a = a*a + b*c
		b = ta*b + b*d
		c = c*ta + d*c
		d = tc*tb + d*d
		n >>= 1
	}
	return rc
}

function fibCpp(n, slow) {
	performance.mark('start-fib')
	const result = fibstring(n, slow)
	performance.mark('end-fib')
	performance.measure('fib', 'start-fib', 'end-fib')
	return {result: result, n: n}
}

function fibJS(n, slow) {
	performance.mark('start-fib')
	if (n > 93 || n < 0)
		return 'Bitte nur Zahlen zwischen 0 und 93!'
	let result
	if (slow)
		result = fibslow(n)
	else
		result = fib(n)
	performance.mark('end-fib')
	performance.measure('fib', 'start-fib', 'end-fib')
	return {result: result, n: n}
}
