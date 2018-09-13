#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// simple recursion algorithm
unsigned long long fibslow(unsigned int n) {
	if (n < 2)
		return n;
	return fibslow(n-1) + fibslow(n-2);
}

// much faster than recursion
unsigned long long fib(unsigned int n) {
	unsigned long long
		a = 1, ta,
		b = 1, tb,
		c = 1, rc = 0, tc,
		d = 0, rd = 1;
	while (n) {
		if (n & 1) {
			tc = rc;
			rc = rc*a + rd*c;
			rd = tc*b + rd*d;
		}
		ta = a; tb = b; tc = c;
		a = a*a + b*c;
		b = ta*b + b*d;
		c = c*ta + d*c;
		d = tc*tb + d*d;
		n >>= 1;
	}
	return rc;
}

int main(int argc, char * argv[]) {
	if (argc != 2) {
		printf("Bitte eine Zahl als Argument eingeben!\n");
	} else {
		unsigned int n = atoi(argv[1]);
		if (n > 93 || n < 1) {
			printf("Bitte nur Zahlen zwischen 1 und 93!\n");
			exit(0);
		}
		printf("Berechne Fibonacci-Zahl %d ...\n", n);
		printf("%llu\n", fib(n));
	}
	return 0;
}

extern "C" {
	const char * fibstring(unsigned int n, unsigned short slow = 0) {
		if (n > 93 || n < 0)
			return "Bitte nur Zahlen zwischen 0 und 93!";
    static char * retVal = strdup("");
		unsigned long long fibVal;
		if (slow)
			fibVal = fibslow(n);
		else
			fibVal = fib(n);
		sprintf(retVal, "%llu", fibVal);
		return retVal;
	}
}
