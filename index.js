"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
//PrimeMode
var PrimeMode = /** @class */ (function () {
    function PrimeMode() {
        this.start = 0;
        this.end = 0;
    }
    PrimeMode.prototype.initialize = function (parameters) {
        this.start = parameters['START'];
        this.end = parameters['END'];
    };
    PrimeMode.prototype.execute = function () {
        var count = 0;
        for (var i = this.start + 1; i < this.end; i++) {
            if (this.isPrime(i)) {
                count++;
            }
        }
        return count;
    };
    PrimeMode.prototype.isPrime = function (number) {
        if (number <= 1)
            return false;
        if (number === 2)
            return true;
        if (number % 2 === 0)
            return false;
        for (var i = 3; i <= Math.sqrt(number); i += 2) {
            if (number % i === 0) {
                return false;
            }
        }
        return true;
    };
    return PrimeMode;
}());
//EncryptionMode
var EncryptionMode = /** @class */ (function () {
    function EncryptionMode() {
        this.encryptionMap = new Map();
        this.wordsToEncrypt = [];
        this.encryptedFilePath = '';
    }
    EncryptionMode.prototype.initialize = function (parameters) {
        var _this = this;
        var mappingFilePath = parameters['MAPPINGFILE'];
        var mappingFileContent = fs.readFileSync(mappingFilePath, 'utf-8');
        mappingFileContent.split('\n').forEach(function (line) {
            var _a = line.split('|'), key = _a[0], value = _a[1];
            if (key && value) {
                _this.encryptionMap.set(key.trim(), value.trim());
            }
        });
        var wordsFilePath = parameters['WORDSTOENCRYPT'];
        this.wordsToEncrypt = fs.readFileSync(wordsFilePath, 'utf-8').split('\n').map(function (word) { return word.trim(); });
        this.encryptedFilePath = parameters['ENCRYPTEDFILE'];
    };
    EncryptionMode.prototype.execute = function () {
        var _this = this;
        var encryptedWords = this.wordsToEncrypt.map(function (word) { return _this.encryptWord(word); });
        fs.writeFileSync(this.encryptedFilePath, encryptedWords.join('\n'));
        return this.wordsToEncrypt.length;
    };
    EncryptionMode.prototype.encryptWord = function (word) {
        var _this = this;
        return word.split('').map(function (char) { return _this.encryptionMap.get(char) || char; }).join('');
    };
    return EncryptionMode;
}());
//main File
function main() {
    console.log("-----------------------------------------------------------------------");
    //change the input value here for PRIME MODE
    var object = { START: 1, END: 5 };
    var primeMode = new PrimeMode();
    primeMode.initialize(object);
    console.log("PrimeMode Result for input -> Start: ".concat(object.START, " and End:").concat(object.END, " ==>: ").concat(primeMode.execute()));
    var encryptionMode = new EncryptionMode();
    encryptionMode.initialize({
        MAPPINGFILE: 'mapping.txt',
        WORDSTOENCRYPT: 'words.txt',
        ENCRYPTEDFILE: 'encrypted.txt'
    });
    console.log("EncryptionMode Result is generated in encrypted.txt file (count) ==>: ".concat(encryptionMode.execute()));
    console.log("-----------------------------------------------------------------------");
}
main();
