const SHA256 = (s) => {
    const chrsz = 8;
    // prevent out of renge
    const safeAdd = (x, y) => {
        const lsw = (x & 0xFFFF) + (y & 0xFFFF);
        const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }
    // Rotates right (circular right shift) value x by n positions
    const S = (X, n) => {
        return (X >>> n) | (X << (32 - n));
    }

    const R = (X, n) => {
        return (X >>> n);
    }
    // Logical functions 'choice'
    const Ch = (x, y, z) => {
        return ((x & y) ^ ((~x) & z));
    }
    // Logical functions 'majority'
    const Maj = (x, y, z) => {
        return ((x & y) ^ (x & z) ^ (y & z));
    }
    // Logical functions
    const Sigma0256 = (x) => {
        return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
    }
    // Logical functions
    const Sigma1256 = (x) => {
        return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
    }
    // Logical functions
    const Gamma0256 = (x) => {
        return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
    }
    // Logical functions
    const Gamma1256 = (x) => {
        return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
    }

    const coreSha256 = (m, l) => {
        // constants 
        const K = new Array(
            0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 
            0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 
            0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 
            0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 
            0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 
            0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 
            0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 
            0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 
            0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 
            0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 
            0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 
            0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 
            0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
        // initial hash value 
        const HASH = new Array(
            0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 
            0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
        // 1 - prepare message schedule 'W'
        const W = new Array(64);
        let a, b, c, d, e, f, g, h, i, j;
        let T1, T2;
        m[l >> 5] |= 0x80 << (24 - l % 32);
        m[((l + 64 >> 9) << 4) + 15] = l;
        // HASH COMPUTATION
        for (let i = 0; i < m.length; i += 16) {
            // 2 - initialise working variables a, b, c, d, e, f, g, h with previous hash value
            a = HASH[0];
            b = HASH[1];
            c = HASH[2];
            d = HASH[3];
            e = HASH[4];
            f = HASH[5];
            g = HASH[6];
            h = HASH[7];
            // 3 - main loop (note '>>> 0' for 'addition modulo 2^32')
            for (let j = 0; j < 64; j++) {
                if (j < 16) W[j] = m[j + i];
                else W[j] = safeAdd(safeAdd(safeAdd(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
                T1 = safeAdd(safeAdd(safeAdd(safeAdd(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
                T2 = safeAdd(Sigma0256(a), Maj(a, b, c));
                h = g;
                g = f;
                f = e;
                e = safeAdd(d, T1);
                d = c;
                c = b;
                b = a;
                a = safeAdd(T1, T2);
            }
            // 4 - compute the new intermediate hash value (note '>>> 0' for 'addition modulo 2^32')
            HASH[0] = safeAdd(a, HASH[0]);
            HASH[1] = safeAdd(b, HASH[1]);
            HASH[2] = safeAdd(c, HASH[2]);
            HASH[3] = safeAdd(d, HASH[3]);
            HASH[4] = safeAdd(e, HASH[4]);
            HASH[5] = safeAdd(f, HASH[5]);
            HASH[6] = safeAdd(g, HASH[6]);
            HASH[7] = safeAdd(h, HASH[7]);
        }
        return HASH;
    }

    // convert string msg into 512-bit blocks (array of 16 32-bit integers)
    const str2binb = (str) => {
        const bin = Array();
        const mask = (1 << chrsz) - 1; // 128
        for (let i = 0; i < str.length * chrsz; i += chrsz) {
            bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
        }
        return bin;
    }

    const binb2hex = (binarray) => {
        const hex_tab = '0123456789ABCDEF';
        let str = '';
        for (let i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
                hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
        }
        return str;
    }

    return binb2hex(coreSha256(str2binb(s), s.length * chrsz)); // add trailing chrsz 0x8 '1' bit (+ 0's padding) to string 
}

const MD5 = (s) => {
    // Constants table
    const T = [];
    // Compute constants
    for (var i = 0; i < 64; i++) {
        T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
    }
    // Let [abcd k s i] denote the operation a = b + ((a + F(b,c,d) + X[k] + T[i]) <<< s).
    const k = (a, b, c, d, x, s, t) => {
        const n = a + (b & c | ~b & d) + (x >>> 0) + t;
        return ((n << s) | (n >>> (32 - s))) + b;
    }
    // Let [abcd k s i] denote the operation a = b + ((a + G(b,c,d) + X[k] + T[i]) <<< s).
    const l = (a, b, c, d, x, s, t) => {
        const n = a + (b & d | c & ~d) + (x >>> 0) + t;
        return ((n << s) | (n >>> (32 - s))) + b;
    }
    // Let [abcd k s t] denote the operation a = b + ((a + H(b,c,d) + X[k] + T[i]) <<< s).
    const m = (a, b, c, d, x, s, t) => {
        const n = a + (b ^ c ^ d) + (x >>> 0) + t;
        return ((n << s) | (n >>> (32 - s))) + b;
    }
    // Let [abcd k s t] denote the operation a = b + ((a + I(b,c,d) + X[k] + T[i]) <<< s).
    const n = (a, b, c, d, x, s, t) => {
        const n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
        return ((n << s) | (n >>> (32 - s))) + b;
    }
    // Intermediate hash value
    const p = (a) => {
        let b = "", d = "", c;
        // 'Endianness' convert the bytes to the canonical byte order
        for (c = 0; 3 >= c; c++) {
            d = a >>> 8 * c & 255, d = "0" + d.toString(16), b += d.substr(d.length - 2, 2);
        }
        return b
    }
    var f = [], q, r, s, t, a, b, c, d;
    f = function(b) {
        var a, c = b.length;
        a = c + 8;
        // 448 module 512 
        for (var d = 16 * ((a - a % 64) / 64 + 1), e = Array(d - 1), f = 0, g = 0; g < c;) {
            a = (g - g % 4) / 4, f = g % 4 * 8, e[a] |= b.charCodeAt(g) << f, g++;
        }
        a = (g - g % 4) / 4;
        e[a] |= 128 << g % 4 * 8;
        e[d - 2] = c << 3;
        e[d - 1] = c >>> 29;
        return e
    }(s);
    // init const
    a = 0x67452301;
    b = 0xefcdab89;
    c = 0x98badcfe;
    d = 0x10325476;
    for (e = 0; e < f.length; e += 16) {
        q = a;
        r = b;
        s = c;
        t = d;
        // Round 1.
        a = k(a, b, c, d, f[e + 0], 7, T[0]);
        d = k(d, a, b, c, f[e + 1], 12, T[1]);
        c = k(c, d, a, b, f[e + 2], 17, T[2]);
        b = k(b, c, d, a, f[e + 3], 22, T[3]);
        a = k(a, b, c, d, f[e + 4], 7, T[4]);
        d = k(d, a, b, c, f[e + 5], 12, T[5]);
        c = k(c, d, a, b, f[e + 6], 17, T[6]);
        b = k(b, c, d, a, f[e + 7], 22, T[7]);
        a = k(a, b, c, d, f[e + 8], 7, T[8]);
        d = k(d, a, b, c, f[e + 9], 12, T[9]);
        c = k(c, d, a, b, f[e + 10], 17, T[10]);
        b = k(b, c, d, a, f[e + 11], 22, T[11]);
        a = k(a, b, c, d, f[e + 12], 7, T[12]);
        d = k(d, a, b, c, f[e + 13], 12, T[13]);
        c = k(c, d, a, b, f[e + 14], 17, T[14]);
        b = k(b, c, d, a, f[e + 15], 22, T[15]);
        // Round 2.
        a = l(a, b, c, d, f[e + 1], 5, T[16]);
        d = l(d, a, b, c, f[e + 6], 9, T[17]);
        c = l(c, d, a, b, f[e + 11], 14, T[18]);
        b = l(b, c, d, a, f[e + 0], 20, T[19]);
        a = l(a, b, c, d, f[e + 5], 5, T[20]);
        d = l(d, a, b, c, f[e + 10], 9, T[21]);
        c = l(c, d, a, b, f[e + 15], 14, T[22]);
        b = l(b, c, d, a, f[e + 4], 20, T[23]);
        a = l(a, b, c, d, f[e + 9], 5, T[24]);
        d = l(d, a, b, c, f[e + 14], 9, T[25]);
        c = l(c, d, a, b, f[e + 3], 14, T[26]);
        b = l(b, c, d, a, f[e + 8], 20, T[27]);
        a = l(a, b, c, d, f[e + 13], 5, T[28]);
        d = l(d, a, b, c, f[e + 2], 9, T[29]);
        c = l(c, d, a, b, f[e + 7], 14, T[30]);
        b = l(b, c, d, a, f[e + 12], 20, T[31]);
        // Round 3.
        a = m(a, b, c, d, f[e + 5], 4, T[32]);
        d = m(d, a, b, c, f[e + 8], 11, T[33]);
        c = m(c, d, a, b, f[e + 11], 16, T[34]);
        b = m(b, c, d, a, f[e + 14], 23, T[35]);
        a = m(a, b, c, d, f[e + 1], 4, T[36]);
        d = m(d, a, b, c, f[e + 4], 11, T[37]);
        c = m(c, d, a, b, f[e + 7], 16, T[38]);
        b = m(b, c, d, a, f[e + 10], 23, T[39]);
        a = m(a, b, c, d, f[e + 13], 4, T[40]);
        d = m(d, a, b, c, f[e + 0], 11, T[41]);
        c = m(c, d, a, b, f[e + 3], 16, T[42]);
        b = m(b, c, d, a, f[e + 6], 23, T[43]);
        a = m(a, b, c, d, f[e + 9], 4, T[44]);
        d = m(d, a, b, c, f[e + 12], 11, T[45]);
        c = m(c, d, a, b, f[e + 15], 16, T[46]);
        b = m(b, c, d, a, f[e + 2], 23, T[47]);
        // Round 4.
        a = n(a, b, c, d, f[e + 0], 6, T[48]);
        d = n(d, a, b, c, f[e + 7], 10, T[49]);
        c = n(c, d, a, b, f[e + 14], 15, T[50]);
        b = n(b, c, d, a, f[e + 5], 21, T[51]);
        a = n(a, b, c, d, f[e + 12], 6, T[52]);
        d = n(d, a, b, c, f[e + 3], 10, T[53]);
        c = n(c, d, a, b, f[e + 10], 15, T[54]);
        b = n(b, c, d, a, f[e + 1], 21, T[55]);
        a = n(a, b, c, d, f[e + 8], 6, T[56]);
        d = n(d, a, b, c, f[e + 15], 10, T[57]);
        c = n(c, d, a, b, f[e + 6], 15, T[58]);
        b = n(b, c, d, a, f[e + 13], 21, T[59]);
        a = n(a, b, c, d, f[e + 4], 6, T[60]);
        d = n(d, a, b, c, f[e + 11], 10, T[61]);
        c = n(c, d, a, b, f[e + 2], 15, T[62]);
        b = n(b, c, d, a, f[e + 9], 21, T[63]);

        a = (a + q) >>> 0;
        b = (b + r) >>> 0;
        c = (c + s) >>> 0;
        d = (d + t) >>> 0;
    }
    // Then perform the following additions. (That is increment each 
    // of the four registers by the value it had before this block was started.)
    return (p(a) + p(b) + p(c) + p(d)).toLowerCase();
}

module.exports = {
    SHA256,
    MD5
};