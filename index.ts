import * as fs from 'fs';


//IMode
interface IMode {
    execute(): number;
    initialize(parameters: { [key: string]: any }): void;
}


//PrimeMode
class PrimeMode implements IMode {
    private start: number = 0;
    private end: number = 0;

    initialize(parameters: { [key: string]: any }): void {
        this.start = parameters['START'];
        this.end = parameters['END'];
    }

    execute(): number {
        let count = 0;
        for (let i = this.start + 1; i < this.end; i++) {
            if (this.isPrime(i)) {
                count++;
            }
        }

        return count;
    }

    private isPrime(number: number): boolean {
        if (number <= 1) return false;
        if (number === 2) return true;
        if (number % 2 === 0) return false;

        for (let i = 3; i <= Math.sqrt(number); i += 2) {
            if (number % i === 0) {
                return false;
            }
        }

        return true;
    }
}


//EncryptionMode
class EncryptionMode implements IMode {
    private encryptionMap: Map<string, string> = new Map();
    private wordsToEncrypt: string[] = [];
    private encryptedFilePath: string = '';

    initialize(parameters: { [key: string]: any }): void {
        const mappingFilePath: string = parameters['MAPPINGFILE'];
        const mappingFileContent: string = fs.readFileSync(mappingFilePath, 'utf-8');

        mappingFileContent.split('\n').forEach(line => {
            const [key, value] = line.split('|');
            if (key && value) {
                this.encryptionMap.set(key.trim(), value.trim());
            }
        });

        const wordsFilePath: string = parameters['WORDSTOENCRYPT'];
        this.wordsToEncrypt = fs.readFileSync(wordsFilePath, 'utf-8').split('\n').map(word => word.trim());

        this.encryptedFilePath = parameters['ENCRYPTEDFILE'];
    }

    execute(): number {
        const encryptedWords: string[] = this.wordsToEncrypt.map(word => this.encryptWord(word));
        fs.writeFileSync(this.encryptedFilePath, encryptedWords.join('\n'));

        return this.wordsToEncrypt.length; 
    }

    private encryptWord(word: string): string {
        return word.split('').map(char => this.encryptionMap.get(char) || char).join('');
    }
}


//main File
function main(): void {
    console.log(`-----------------------------------------------------------------------`);
    
    //change the input value here for PRIME MODE
    let object = { START: 1, END: 5 }
   
    const primeMode: PrimeMode = new PrimeMode();
    primeMode.initialize(object); 

    console.log(`PrimeMode Result for input -> Start: ${object.START} and End:${object.END} ==>: ${primeMode.execute()}`); 

    const encryptionMode: EncryptionMode = new EncryptionMode();
    encryptionMode.initialize({
        MAPPINGFILE: 'mapping.txt',
        WORDSTOENCRYPT: 'words.txt',
        ENCRYPTEDFILE: 'encrypted.txt'
    });

    console.log(`EncryptionMode Result is generated in encrypted.txt file (count) ==>: ${encryptionMode.execute()}`);
    console.log(`-----------------------------------------------------------------------`);
}

main();